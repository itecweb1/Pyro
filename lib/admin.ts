import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { defaultBrandSettings, defaultHeroBanners } from "@/lib/content"
import type { BrandSettings, HeroBanner } from "@/lib/types"

export type AdminProduct = {
  id: string
  slug: string
  name: string
  price_cents: number
  currency: string
  is_active: boolean
  is_featured: boolean
  category: { name: string } | { name: string }[] | null
  variants: { stock: number | null }[] | null
}

export type AdminCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  sort_order: number
}

export type AdminOrder = {
  id: string
  created_at: string
  status: string
  email: string | null
  payment_method: string | null
  shipping_city: string | null
  shipping_phone: string | null
  total_cents: number
  currency: string
}

export type AdminCustomer = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: string | null
  created_at: string
}

export type AdminCoupon = {
  id: string
  code: string
  type: string
  value: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
}

function normalizeBrandSettings(value: unknown): BrandSettings {
  const raw = value && typeof value === "object" ? (value as Partial<BrandSettings>) : {}
  const announcementItems = Array.isArray(raw.announcement_items)
    ? raw.announcement_items.map((item) => String(item).trim()).filter(Boolean)
    : defaultBrandSettings.announcement_items
  const heroStats = Array.isArray(raw.hero_stats)
    ? raw.hero_stats
        .map((item) => {
          if (!item || typeof item !== "object") return null
          const stat = item as { label?: unknown; value?: unknown }
          const label = String(stat.label ?? "").trim()
          const value = String(stat.value ?? "").trim()
          return label && value ? { label, value } : null
        })
        .filter((item): item is BrandSettings["hero_stats"][number] => Boolean(item))
    : defaultBrandSettings.hero_stats

  return {
    name: String(raw.name ?? defaultBrandSettings.name).trim() || defaultBrandSettings.name,
    slogan:
      String(raw.slogan ?? defaultBrandSettings.slogan).trim() ||
      defaultBrandSettings.slogan,
    description:
      String(raw.description ?? defaultBrandSettings.description).trim() ||
      defaultBrandSettings.description,
    shipping_threshold_cents: Math.max(
      0,
      Number(raw.shipping_threshold_cents ?? defaultBrandSettings.shipping_threshold_cents) ||
        defaultBrandSettings.shipping_threshold_cents,
    ),
    shipping_fee_cents: Math.max(
      0,
      Number(raw.shipping_fee_cents ?? defaultBrandSettings.shipping_fee_cents) ||
        defaultBrandSettings.shipping_fee_cents,
    ),
    announcement_items:
      announcementItems.length > 0
        ? announcementItems
        : defaultBrandSettings.announcement_items,
    hero_stats: heroStats.length > 0 ? heroStats : defaultBrandSettings.hero_stats,
  }
}

function configuredAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function getAdminSession() {
  if (!hasSupabaseEnv()) {
    return { user: null, isAdmin: false, profile: null }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, isAdmin: false, profile: null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  const email = user.email?.toLowerCase()
  const isAdmin =
    profile?.role === "admin" ||
    Boolean(email && configuredAdminEmails().includes(email))

  return { user, isAdmin, profile }
}

export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session.user) {
    redirect("/admin/login")
  }

  if (!session.isAdmin) {
    redirect("/account")
  }

  return session
}

export async function getAdminMetrics() {
  const supabase = createAdminClient()
  if (!supabase) return null

  const [products, categories, orders, customers, subscribers] =
    await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true }),
    ])

  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    orders: orders.count ?? 0,
    customers: customers.count ?? 0,
    subscribers: subscribers.count ?? 0,
  }
}

export async function getAdminProducts() {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, currency, is_active, is_featured, category:categories(name), variants:product_variants(stock)",
    )
    .order("created_at", { ascending: false })

  return (data ?? []) as unknown as AdminProduct[]
}

export type AdminProductDetail = {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  price_cents: number
  compare_at_cents: number | null
  currency: string
  category_id: string | null
  materials: string | null
  care: string | null
  is_active: boolean
  is_featured: boolean
  images: {
    id: string
    url: string
    alt: string | null
    sort_order: number
  }[]
  variants: {
    id: string
    size: string | null
    color: string | null
    sku: string | null
    stock: number
  }[]
}

export async function getAdminProductById(id: string) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("products")
    .select(
      `id, slug, name, subtitle, description, price_cents, compare_at_cents, currency,
       category_id, materials, care, is_active, is_featured,
       images:product_images ( id, url, alt, sort_order ),
       variants:product_variants ( id, size, color, sku, stock )`,
    )
    .eq("id", id)
    .maybeSingle()

  if (!data) return null
  const detail = data as unknown as AdminProductDetail
  return {
    ...detail,
    images: [...(detail.images ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
    variants: [...(detail.variants ?? [])].sort((a, b) => {
      const sa = a.size ?? ""
      const sb = b.size ?? ""
      return sa.localeCompare(sb)
    }),
  }
}

export async function getAdminCategories() {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, description, sort_order")
    .order("sort_order", { ascending: true })

  return (data ?? []) as unknown as AdminCategory[]
}

export async function getAdminCategoryById(id: string) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("categories")
    .select("id, slug, name, description, image_url, sort_order")
    .eq("id", id)
    .maybeSingle()

  return (data ?? null) as
    | (AdminCategory & { image_url: string | null })
    | null
}

export async function getAdminOrders() {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, email, payment_method, shipping_city, shipping_phone, total_cents, currency",
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (data ?? []) as unknown as AdminOrder[]
}

export type AdminOrderDetail = {
  id: string
  created_at: string
  status: string
  user_id: string | null
  email: string | null
  payment_method: string | null
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  coupon_code: string | null
  subtotal_cents: number
  shipping_cents: number
  discount_cents: number
  total_cents: number
  currency: string
  shipping_name: string | null
  shipping_phone: string | null
  shipping_line1: string | null
  shipping_line2: string | null
  shipping_city: string | null
  shipping_postal_code: string | null
  shipping_country: string | null
  items: {
    id: string
    product_id: string | null
    variant_id: string | null
    product_name: string
    variant_label: string | null
    unit_price_cents: number
    quantity: number
  }[]
  customer: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  } | null
}

export async function getAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: order } = await supabase
    .from("orders")
    .select(
      `id, created_at, status, user_id, email, payment_method,
       stripe_checkout_session_id, stripe_payment_intent_id, coupon_code,
       subtotal_cents, shipping_cents, discount_cents, total_cents, currency,
       shipping_name, shipping_phone, shipping_line1, shipping_line2,
       shipping_city, shipping_postal_code, shipping_country,
       items:order_items ( id, product_id, variant_id, product_name, variant_label, unit_price_cents, quantity )`,
    )
    .eq("id", id)
    .maybeSingle()

  if (!order) return null

  let customer: AdminOrderDetail["customer"] = null
  if (order.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", order.user_id)
      .maybeSingle()
    customer = profile ?? null
  }

  return { ...(order as unknown as AdminOrderDetail), customer }
}

export async function getAdminCustomers() {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, phone, role, created_at")
    .order("created_at", { ascending: false })
    .limit(50)

  return (data ?? []) as unknown as AdminCustomer[]
}

export type AdminCustomerDetail = AdminCustomer & {
  email: string | null
  orders: {
    id: string
    created_at: string
    status: string
    total_cents: number
    currency: string
    payment_method: string | null
  }[]
}

export async function getAdminCustomerById(id: string): Promise<AdminCustomerDetail | null> {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, phone, role, created_at")
    .eq("id", id)
    .maybeSingle()

  if (!profile) return null

  const { data: authUser } = await supabase.auth.admin.getUserById(id)
  const { data: orders } = await supabase
    .from("orders")
    .select("id, created_at, status, total_cents, currency, payment_method")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(50)

  return {
    ...(profile as AdminCustomer),
    email: authUser?.user?.email ?? null,
    orders: (orders ?? []) as AdminCustomerDetail["orders"],
  }
}

export async function getAdminHeroBannerById(id: string) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("hero_banners")
    .select(
      "id, title, subtitle, eyebrow, cta_label, cta_href, image_url, is_active, sort_order",
    )
    .eq("id", id)
    .maybeSingle()

  return (data ?? null) as HeroBanner | null
}

export async function getAdminCoupons() {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("coupons")
    .select("id, code, type, value, is_active, starts_at, ends_at")
    .order("created_at", { ascending: false })

  return (data ?? []) as unknown as AdminCoupon[]
}

export async function getAdminCouponById(id: string) {
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("coupons")
    .select("id, code, type, value, is_active, starts_at, ends_at")
    .eq("id", id)
    .maybeSingle()

  return (data ?? null) as AdminCoupon | null
}

export async function getAdminBrandSettings() {
  const supabase = createAdminClient()
  if (!supabase) return defaultBrandSettings

  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "brand")
    .maybeSingle()

  return normalizeBrandSettings(data?.value)
}

export async function getAdminHeroBanners() {
  const supabase = createAdminClient()
  if (!supabase) return defaultHeroBanners

  const { data } = await supabase
    .from("hero_banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  return ((data ?? []) as HeroBanner[]).length > 0
    ? ((data ?? []) as HeroBanner[])
    : defaultHeroBanners
}
