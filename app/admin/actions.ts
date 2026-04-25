"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

type AllowedBucket = "product-images" | "hero-banners" | "category-images"

async function uploadToBucket(
  supabase: ReturnType<typeof createAdminClient>,
  bucket: AllowedBucket,
  file: File,
  prefix?: string,
): Promise<string | null> {
  if (!supabase || !file || file.size === 0) return null

  const ext =
    (file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase() || ".jpg"
  const path = `${prefix ? `${prefix}/` : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  })
  if (error) return null

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl ?? null
}

function priceToCents(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "0").replace(",", ".")
  return Math.max(0, Math.round(Number(normalized) * 100))
}

function linesToList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function createCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  if (!name) return

  let imageUrl = String(formData.get("image_url") ?? "").trim() || null
  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadToBucket(supabase, "category-images", file)
    if (uploaded) imageUrl = uploaded
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: description || null,
    image_url: imageUrl,
    sort_order: Number(formData.get("sort_order") ?? 0),
  })

  if (error) return
  revalidatePath("/admin/categories")
  revalidatePath("/shop")
}

export async function updateCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  if (!id || !name) return

  let imageUrl: string | null = String(formData.get("image_url") ?? "").trim() || null
  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadToBucket(supabase, "category-images", file)
    if (uploaded) imageUrl = uploaded
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugInput ? slugify(slugInput) : slugify(name),
      description: description || null,
      image_url: imageUrl,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id)

  if (error) return
  revalidatePath("/admin/categories")
  revalidatePath("/shop")
  revalidatePath("/")
  redirect("/admin/categories")
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  if (!id) return

  await supabase.from("categories").delete().eq("id", id)
  revalidatePath("/admin/categories")
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const name = String(formData.get("name") ?? "").trim()
  const subtitle = String(formData.get("subtitle") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("image_url") ?? "").trim()
  const categoryId = String(formData.get("category_id") ?? "").trim()
  const stock = Math.max(0, Number(formData.get("stock") ?? 0))
  const sizes = String(formData.get("sizes") ?? "S,M,L,XL")
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean)

  if (!name) return

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name),
      subtitle: subtitle || null,
      description: description || null,
      price_cents: priceToCents(formData.get("price")),
      compare_at_cents: formData.get("compare_at")
        ? priceToCents(formData.get("compare_at"))
        : null,
      currency: "MAD",
      category_id: categoryId || null,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      materials: String(formData.get("materials") ?? "").trim() || null,
      care: String(formData.get("care") ?? "").trim() || null,
    })
    .select("id")
    .single()

  if (error || !product) {
    return
  }

  if (imageUrl) {
    await supabase.from("product_images").insert({
      product_id: product.id,
      url: imageUrl,
      alt: name,
      sort_order: 0,
    })
  }

  await supabase.from("product_variants").insert(
    sizes.map((size) => ({
      product_id: product.id,
      size,
      color: String(formData.get("color") ?? "Noir").trim(),
      sku: `PW-${slugify(name).slice(0, 18).toUpperCase()}-${size}`,
      stock,
    })),
  )

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const slugInput = String(formData.get("slug") ?? "").trim()
  if (!id || !name) return

  const compareAt = formData.get("compare_at")
  const categoryId = String(formData.get("category_id") ?? "").trim()

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug: slugInput ? slugify(slugInput) : slugify(name),
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      price_cents: priceToCents(formData.get("price")),
      compare_at_cents:
        compareAt && String(compareAt).trim() ? priceToCents(compareAt) : null,
      category_id: categoryId || null,
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      materials: String(formData.get("materials") ?? "").trim() || null,
      care: String(formData.get("care") ?? "").trim() || null,
    })
    .eq("id", id)

  if (error) return
  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  revalidatePath("/shop")
  revalidatePath("/")
  redirect("/admin/products")
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  if (!id) return

  await supabase.from("products").delete().eq("id", id)
  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function addProductImage(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const productId = String(formData.get("product_id") ?? "").trim()
  if (!productId) return

  const file = formData.get("file")
  let url = String(formData.get("url") ?? "").trim()

  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadToBucket(
      supabase,
      "product-images",
      file,
      productId,
    )
    if (uploaded) url = uploaded
  }

  if (!url) return

  await supabase.from("product_images").insert({
    product_id: productId,
    url,
    alt: String(formData.get("alt") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  })

  revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/shop")
  revalidatePath("/")
}

export async function deleteProductImage(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const productId = String(formData.get("product_id") ?? "").trim()
  if (!id) return

  await supabase.from("product_images").delete().eq("id", id)
  if (productId) revalidatePath(`/admin/products/${productId}`)
  revalidatePath("/shop")
}

export async function addProductVariant(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const productId = String(formData.get("product_id") ?? "").trim()
  const size = String(formData.get("size") ?? "").trim()
  const color = String(formData.get("color") ?? "").trim()
  if (!productId) return

  const stock = Math.max(0, Number(formData.get("stock") ?? 0))
  const skuInput = String(formData.get("sku") ?? "").trim()
  const sku =
    skuInput ||
    `PW-${productId.slice(0, 6).toUpperCase()}-${(size || "X").toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`

  await supabase.from("product_variants").insert({
    product_id: productId,
    size: size || null,
    color: color || null,
    sku,
    stock,
  })

  revalidatePath(`/admin/products/${productId}`)
}

export async function updateVariantStock(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const productId = String(formData.get("product_id") ?? "").trim()
  if (!id) return

  const stock = Math.max(0, Number(formData.get("stock") ?? 0))
  await supabase.from("product_variants").update({ stock }).eq("id", id)
  if (productId) revalidatePath(`/admin/products/${productId}`)
}

export async function deleteProductVariant(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const productId = String(formData.get("product_id") ?? "").trim()
  if (!id) return

  await supabase.from("product_variants").delete().eq("id", id)
  if (productId) revalidatePath(`/admin/products/${productId}`)
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "")
  const status = String(formData.get("status") ?? "pending")
  if (!id) return

  await supabase.from("orders").update({ status }).eq("id", id)
  revalidatePath("/admin/orders")
}

export async function createCoupon(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  if (!code) return

  const { error } = await supabase.from("coupons").insert({
    code,
    type: String(formData.get("type") ?? "percent"),
    value: Number(formData.get("value") ?? 10),
    is_active: formData.get("is_active") === "on",
    starts_at: String(formData.get("starts_at") ?? "") || null,
    ends_at: String(formData.get("ends_at") ?? "") || null,
  })

  if (error) return
  revalidatePath("/admin/coupons")
}

export async function updateCoupon(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const code = String(formData.get("code") ?? "").trim().toUpperCase()
  if (!id || !code) return

  const value = Number(formData.get("value") ?? 0)
  if (!Number.isFinite(value) || value <= 0) return

  const { error } = await supabase
    .from("coupons")
    .update({
      code,
      type: String(formData.get("type") ?? "percent"),
      value,
      is_active: formData.get("is_active") === "on",
      starts_at: String(formData.get("starts_at") ?? "") || null,
      ends_at: String(formData.get("ends_at") ?? "") || null,
    })
    .eq("id", id)

  if (error) return
  revalidatePath("/admin/coupons")
  redirect("/admin/coupons")
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  if (!id) return

  await supabase.from("coupons").delete().eq("id", id)
  revalidatePath("/admin/coupons")
}

export async function updateBrandSettings(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const heroStats = [
    {
      label: String(formData.get("hero_stat_1_label") ?? "").trim(),
      value: String(formData.get("hero_stat_1_value") ?? "").trim(),
    },
    {
      label: String(formData.get("hero_stat_2_label") ?? "").trim(),
      value: String(formData.get("hero_stat_2_value") ?? "").trim(),
    },
    {
      label: String(formData.get("hero_stat_3_label") ?? "").trim(),
      value: String(formData.get("hero_stat_3_value") ?? "").trim(),
    },
  ].filter((item) => item.label && item.value)

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "brand",
      value: {
        name: String(formData.get("name") ?? "").trim() || "Pyro Wear",
        slogan:
          String(formData.get("slogan") ?? "").trim() ||
          "La coupe froide. Casablanca en mouvement.",
        description:
          String(formData.get("description") ?? "").trim() ||
          "Streetwear homme premium pense pour le marche marocain, avec paiement comptant a la livraison.",
        shipping_threshold_cents: priceToCents(formData.get("shipping_threshold")),
        shipping_fee_cents: priceToCents(formData.get("shipping_fee")),
        announcement_items: linesToList(formData.get("announcement_items")),
        hero_stats: heroStats,
      },
    },
    { onConflict: "key" },
  )

  if (error) return
  revalidatePath("/", "layout")
  revalidatePath("/cart")
  revalidatePath("/checkout")
  revalidatePath("/admin/settings")
}

export async function createHeroBanner(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const title = String(formData.get("title") ?? "").trim()
  if (!title) return

  let imageUrl = String(formData.get("image_url") ?? "").trim() || null
  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadToBucket(supabase, "hero-banners", file)
    if (uploaded) imageUrl = uploaded
  }

  const { error } = await supabase.from("hero_banners").insert({
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim() || null,
    eyebrow: String(formData.get("eyebrow") ?? "").trim() || null,
    cta_label: String(formData.get("cta_label") ?? "").trim() || null,
    cta_href: String(formData.get("cta_href") ?? "").trim() || null,
    image_url: imageUrl,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  })

  if (error) return
  revalidatePath("/")
  revalidatePath("/admin/settings")
}

export async function toggleHeroBanner(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "")
  const nextActive = String(formData.get("next_active") ?? "") === "true"
  if (!id) return

  await supabase.from("hero_banners").update({ is_active: nextActive }).eq("id", id)
  revalidatePath("/")
  revalidatePath("/admin/settings")
}

export async function updateHeroBanner(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  if (!id || !title) return

  let imageUrl: string | null = String(formData.get("image_url") ?? "").trim() || null
  const file = formData.get("file")
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadToBucket(supabase, "hero-banners", file)
    if (uploaded) imageUrl = uploaded
  }

  const { error } = await supabase
    .from("hero_banners")
    .update({
      title,
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      eyebrow: String(formData.get("eyebrow") ?? "").trim() || null,
      cta_label: String(formData.get("cta_label") ?? "").trim() || null,
      cta_href: String(formData.get("cta_href") ?? "").trim() || null,
      image_url: imageUrl,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)

  if (error) return
  revalidatePath("/")
  revalidatePath("/admin/settings")
  redirect("/admin/settings")
}

export async function updateCustomerProfile(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "").trim()
  if (!id) return

  const role = String(formData.get("role") ?? "customer")
  if (role !== "customer" && role !== "admin") return

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: String(formData.get("first_name") ?? "").trim() || null,
      last_name: String(formData.get("last_name") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      role,
    })
    .eq("id", id)

  if (error) return
  revalidatePath("/admin/customers")
  revalidatePath(`/admin/customers/${id}`)
}

export async function deleteHeroBanner(formData: FormData) {
  await requireAdmin()
  const supabase = createAdminClient()
  if (!supabase) return

  const id = String(formData.get("id") ?? "")
  if (!id) return

  await supabase.from("hero_banners").delete().eq("id", id)
  revalidatePath("/")
  revalidatePath("/admin/settings")
}
