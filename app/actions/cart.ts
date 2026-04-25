"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getBrandSettings, getCart } from "@/lib/queries"
import { getStripe } from "@/lib/stripe"
import { brand } from "@/lib/content"

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId") ?? "")
  const variantId = String(formData.get("variantId") ?? "")
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1))
  const redirectTo = String(formData.get("redirectTo") ?? "/cart")

  if (!productId || !variantId) {
    return { ok: false, message: "Selectionne une taille avant d'ajouter au panier." }
  }

  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      message: "Connecte Supabase pour activer le panier persistant.",
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectTo)}`)
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("variant_id", variantId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
  } else {
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      variant_id: variantId,
      quantity,
    })
  }

  revalidatePath("/cart")
  revalidatePath("/", "layout")
  return { ok: true, message: "Ajoute au panier." }
}

export async function updateCartItem(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const quantity = Math.max(0, Number(formData.get("quantity") ?? 0))
  if (!id) return
  if (!hasSupabaseEnv()) return

  const supabase = await createClient()
  if (quantity === 0) {
    await supabase.from("cart_items").delete().eq("id", id)
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", id)
  }
  revalidatePath("/cart")
  revalidatePath("/", "layout")
}

export async function removeCartItem(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return
  if (!hasSupabaseEnv()) return
  const supabase = await createClient()
  await supabase.from("cart_items").delete().eq("id", id)
  revalidatePath("/cart")
  revalidatePath("/", "layout")
}

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Entre une adresse email valide." }
  }
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      message: "Connecte Supabase pour enregistrer les inscriptions newsletter.",
    }
  }
  const supabase = await createClient()
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
  if (error && !error.message.includes("duplicate")) {
    return { ok: false, message: "Une erreur est survenue. Reessaie." }
  }
  return { ok: true, message: "Tu es sur la liste." }
}

export async function toggleWishlist(formData: FormData) {
  const productId = String(formData.get("productId") ?? "")
  const redirectTo = String(formData.get("redirectTo") ?? "/wishlist")
  if (!productId) return

  if (!hasSupabaseEnv()) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectTo)}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?next=${encodeURIComponent(redirectTo)}`)
  }

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    await supabase.from("wishlist_items").delete().eq("id", existing.id)
  } else {
    await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: productId,
    })
  }

  revalidatePath("/wishlist")
}

export async function createCheckoutSession() {
  if (!hasSupabaseEnv()) {
    redirect("/checkout?supabase=missing")
  }

  const stripe = getStripe()
  if (!stripe) {
    redirect("/checkout?stripe=missing")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?next=/checkout")

  const items = await getCart(user.id)
  if (items.length === 0) redirect("/cart")

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    success_url: `${brand.siteUrl}/account?checkout=success`,
    cancel_url: `${brand.siteUrl}/checkout?checkout=cancelled`,
    metadata: {
      user_id: user.id,
    },
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: item.product.currency.toLowerCase(),
        unit_amount: item.product.price_cents,
        product_data: {
          name: item.product.name,
          description: item.variant?.size
            ? `Taille ${item.variant.size}`
            : item.product.subtitle ?? undefined,
          images: item.product.images[0]?.url
            ? [
                item.product.images[0].url.startsWith("http")
                  ? item.product.images[0].url
                  : `${brand.siteUrl}${item.product.images[0].url}`,
              ]
            : undefined,
        },
      },
    })),
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "MA", "ES", "DE", "NL", "IT", "GB"],
    },
    allow_promotion_codes: true,
  })

  if (!session.url) {
    redirect("/checkout?stripe=error")
  }

  redirect(session.url)
}

export async function placeCashOnDeliveryOrder(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect("/checkout?supabase=missing")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?next=/checkout")

  const items = await getCart(user.id)
  if (items.length === 0) redirect("/cart")

  const fullName = String(formData.get("full_name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const line1 = String(formData.get("line1") ?? "").trim()
  const line2 = String(formData.get("line2") ?? "").trim()
  const postalCode = String(formData.get("postal_code") ?? "").trim()
  const country = String(formData.get("country") ?? "Maroc").trim() || "Maroc"

  if (!fullName || !phone || !city || !line1) {
    redirect("/checkout?invalid=1")
  }

  const brandSettings = await getBrandSettings()
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price_cents * item.quantity,
    0,
  )
  const currency = items[0]?.product.currency ?? "MAD"
  const shipping =
    subtotal >= brandSettings.shipping_threshold_cents
      ? 0
      : brandSettings.shipping_fee_cents
  const total = subtotal + shipping

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      payment_method: "cod",
      subtotal_cents: subtotal,
      shipping_cents: shipping,
      total_cents: total,
      currency,
      email: user.email ?? null,
      shipping_name: fullName,
      shipping_phone: phone,
      shipping_line1: line1,
      shipping_line2: line2 || null,
      shipping_city: city,
      shipping_postal_code: postalCode || null,
      shipping_country: country,
    })
    .select("id")
    .single()

  if (orderError || !order) {
    redirect("/checkout?error=1")
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => {
      const variantBits = [item.variant?.size, item.variant?.color].filter(Boolean)
      return {
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant?.id ?? null,
        product_name: item.product.name,
        variant_label: variantBits.length > 0 ? variantBits.join(" - ") : null,
        unit_price_cents: item.product.price_cents,
        quantity: item.quantity,
      }
    }),
  )

  if (itemsError) {
    redirect("/checkout?error=1")
  }

  await supabase.from("addresses").insert({
    user_id: user.id,
    label: "Livraison",
    full_name: fullName,
    line1,
    line2: line2 || null,
    city,
    postal_code: postalCode || "00000",
    country,
    phone,
  })

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      phone,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  )

  await supabase.from("cart_items").delete().eq("user_id", user.id)

  revalidatePath("/cart")
  revalidatePath("/account")
  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath("/", "layout")
  redirect("/account?order=placed")
}
