import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { defaultBrandSettings, defaultHeroBanners } from "@/lib/content"
import type {
  BrandSettings,
  CartItemWithProduct,
  Category,
  HeroBanner,
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/types"

const PRODUCT_SELECT = `
  id, slug, name, subtitle, description, price_cents, compare_at_cents, currency,
  materials, care, is_featured, category_id,
  category:categories!category_id ( slug, name ),
  images:product_images ( id, url, alt, sort_order ),
  variants:product_variants ( id, size, color, sku, stock )
`

const fallbackCategories: Category[] = [
  {
    id: "cat-outerwear",
    slug: "outerwear",
    name: "Outerwear",
    description:
      "Vestes, shells et surcouches sombres pour une presence immediate.",
    image_url: "/products/carbon-shell.jpg",
    sort_order: 1,
  },
  {
    id: "cat-tops",
    slug: "tops",
    name: "Tops",
    description: "Hoodies lourds, tees boxy et crewnecks graphite.",
    image_url: "/products/graphite-hoodie.jpg",
    sort_order: 2,
  },
  {
    id: "cat-bottoms",
    slug: "bottoms",
    name: "Bas",
    description: "Cargos, denims et bas techniques a la coupe affirmee.",
    image_url: "/products/obsidian-cargo.jpg",
    sort_order: 3,
  },
  {
    id: "cat-accessories",
    slug: "accessories",
    name: "Accessoires",
    description: "Sacs, caps et details chrome fume pour finir la silhouette.",
    image_url: "/products/onyx-bag.jpg",
    sort_order: 4,
  },
]

const fallbackProducts: Product[] = [
  {
    id: "prod-graphite-heavy-hoodie",
    slug: "graphite-heavy-hoodie",
    name: "Graphite Heavy Hoodie",
    subtitle: "Hoodie 500gsm coupe boxy",
    description:
      "Molleton lourd, capuche structuree, toucher sec et signature ton sur ton.",
    price_cents: 89000,
    compare_at_cents: null,
    currency: "MAD",
    materials: "Coton loop-back 500gsm, bord-cotes denses, cordon plat.",
    care: "Lavage froid, sechage a plat, ne pas blanchir.",
    is_featured: true,
    category_id: "cat-tops",
    category: { slug: "tops", name: "Tops" },
    images: [
      {
        id: "img-graphite-1",
        url: "/products/graphite-hoodie.jpg",
        alt: "Hoodie Pyro Wear graphite",
        sort_order: 0,
      },
      {
        id: "img-graphite-2",
        url: "/products/smoke-crewneck.jpg",
        alt: "Detail matiere graphite",
        sort_order: 1,
      },
    ],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      id: `var-hoodie-${size}`,
      size,
      color: "Noir graphite",
      sku: `PW-HOODIE-${size}`,
      stock: 18,
    })),
  },
  {
    id: "prod-obsidian-cargo-pant",
    slug: "obsidian-cargo-pant",
    name: "Obsidian Cargo Pant",
    subtitle: "Cargo noir coupe droite",
    description:
      "Ripstop mat, poches plaquees, taille ajustable et presence utilitaire.",
    price_cents: 99000,
    compare_at_cents: null,
    currency: "MAD",
    materials: "Nylon ripstop mat, boucles metal, renforts genoux.",
    care: "Lavage froid sur envers, sechage naturel.",
    is_featured: true,
    category_id: "cat-bottoms",
    category: { slug: "bottoms", name: "Bas" },
    images: [
      {
        id: "img-cargo-1",
        url: "/products/obsidian-cargo.jpg",
        alt: "Cargo noir Pyro Wear",
        sort_order: 0,
      },
    ],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      id: `var-cargo-${size}`,
      size,
      color: "Noir",
      sku: `PW-CARGO-${size}`,
      stock: 14,
    })),
  },
  {
    id: "prod-carbon-shell-jacket",
    slug: "carbon-shell-jacket",
    name: "Carbon Shell Jacket",
    subtitle: "Veste technique chrome fume",
    description:
      "Shell de mi-saison, volume net, zip metal et finition deperlante.",
    price_cents: 129000,
    compare_at_cents: 149000,
    currency: "MAD",
    materials: "Nylon technique deperlant, doublure mesh, zip metal.",
    care: "Nettoyage doux, pas de seche-linge.",
    is_featured: true,
    category_id: "cat-outerwear",
    category: { slug: "outerwear", name: "Outerwear" },
    images: [
      {
        id: "img-shell-1",
        url: "/products/carbon-shell.jpg",
        alt: "Veste Carbon Shell Pyro Wear",
        sort_order: 0,
      },
    ],
    variants: ["S", "M", "L", "XL"].map((size) => ({
      id: `var-shell-${size}`,
      size,
      color: "Chrome fume",
      sku: `PW-SHELL-${size}`,
      stock: 10,
    })),
  },
  {
    id: "prod-onyx-crossbody-bag",
    slug: "onyx-crossbody-bag",
    name: "Onyx Crossbody Bag",
    subtitle: "Sac compact nylon noir",
    description:
      "Nylon balistique, boucles metal, format daily carry et port croise.",
    price_cents: 39000,
    compare_at_cents: null,
    currency: "MAD",
    materials: "Nylon balistique, sangles polyamide, hardware metal.",
    care: "Nettoyer avec chiffon humide.",
    is_featured: false,
    category_id: "cat-accessories",
    category: { slug: "accessories", name: "Accessoires" },
    images: [
      {
        id: "img-bag-1",
        url: "/products/onyx-bag.jpg",
        alt: "Sac Onyx Pyro Wear",
        sort_order: 0,
      },
    ],
    variants: [
      {
        id: "var-bag-os",
        size: "One Size",
        color: "Noir",
        sku: "PW-BAG-OS",
        stock: 24,
      },
    ],
  },
]

function filterFallbackProducts(opts?: {
  categorySlug?: string
  search?: string
  sort?: "featured" | "newest" | "price-asc" | "price-desc"
}) {
  let products = [...fallbackProducts]

  if (opts?.categorySlug) {
    products = products.filter((product) => product.category?.slug === opts.categorySlug)
  }

  if (opts?.search) {
    const search = opts.search.toLowerCase()
    products = products.filter((product) =>
      [product.name, product.subtitle, product.description]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(search)),
    )
  }

  if (opts?.sort === "price-asc") {
    products.sort((a, b) => a.price_cents - b.price_cents)
  } else if (opts?.sort === "price-desc") {
    products.sort((a, b) => b.price_cents - a.price_cents)
  } else {
    products.sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
  }

  return products
}

function normalizeBrandSettings(value: unknown): BrandSettings {
  const raw = value && typeof value === "object" ? (value as Partial<BrandSettings>) : {}
  const announcementItems = Array.isArray(raw.announcement_items)
    ? raw.announcement_items
        .map((item) => String(item).trim())
        .filter(Boolean)
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

function normalizeHeroBanner(
  raw: Partial<HeroBanner> | null | undefined,
  fallback = defaultHeroBanners[0],
): HeroBanner {
  return {
    id: String(raw?.id ?? fallback.id),
    title: String(raw?.title ?? fallback.title),
    subtitle: raw?.subtitle ? String(raw.subtitle) : fallback.subtitle,
    eyebrow: raw?.eyebrow ? String(raw.eyebrow) : fallback.eyebrow,
    cta_label: raw?.cta_label ? String(raw.cta_label) : fallback.cta_label,
    cta_href: raw?.cta_href ? String(raw.cta_href) : fallback.cta_href,
    image_url: raw?.image_url ? String(raw.image_url) : fallback.image_url,
    is_active: raw?.is_active ?? fallback.is_active,
    sort_order: Number(raw?.sort_order ?? fallback.sort_order) || fallback.sort_order,
    created_at: raw?.created_at,
  }
}

export function getFallbackCategoryImage(slug: string) {
  return (
    fallbackCategories.find((category) => category.slug === slug)?.image_url ??
    "/products/hero-editorial.jpg"
  )
}

type RawProduct = Omit<Product, "images" | "variants" | "category"> & {
  category: { slug: string; name: string } | { slug: string; name: string }[] | null
  images: ProductImage[]
  variants: ProductVariant[]
}

function normalize(raw: RawProduct): Product {
  const sortedImages = [...(raw.images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const sortedVariants = [...(raw.variants ?? [])]
  const category = Array.isArray(raw.category) ? raw.category[0] ?? null : raw.category
  return {
    ...raw,
    category: category ?? null,
    images: sortedImages,
    variants: sortedVariants,
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) return fallbackCategories
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
  if (error) {
    console.log("[v0] getCategories error:", error.message)
    return []
  }
  return (data ?? []) as Category[]
}

export async function getBrandSettings(): Promise<BrandSettings> {
  if (!hasSupabaseEnv()) return defaultBrandSettings
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "brand")
    .maybeSingle()

  if (error) {
    console.log("[v0] getBrandSettings error:", error.message)
    return defaultBrandSettings
  }

  return normalizeBrandSettings(data?.value)
}

export async function getHeroBanners(limit = 3): Promise<HeroBanner[]> {
  if (!hasSupabaseEnv()) return defaultHeroBanners.slice(0, limit)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hero_banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(limit)

  if (error) {
    console.log("[v0] getHeroBanners error:", error.message)
    return defaultHeroBanners.slice(0, limit)
  }

  const banners = (data ?? []).map((banner) =>
    normalizeHeroBanner(banner as HeroBanner),
  )

  return banners.length > 0 ? banners : defaultHeroBanners.slice(0, limit)
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return fallbackProducts.filter((product) => product.is_featured).slice(0, limit)
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(limit)
  if (error) {
    console.log("[v0] getFeaturedProducts error:", error.message)
    return []
  }
  return (data ?? []).map((p) => normalize(p as unknown as RawProduct))
}

export async function getAllProducts(opts?: {
  categorySlug?: string
  search?: string
  sort?: "featured" | "newest" | "price-asc" | "price-desc"
}): Promise<Product[]> {
  if (!hasSupabaseEnv()) return filterFallbackProducts(opts)
  const supabase = await createClient()
  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)

  if (opts?.search) {
    query = query.or(
      `name.ilike.%${opts.search}%,subtitle.ilike.%${opts.search}%,description.ilike.%${opts.search}%`,
    )
  }

  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle()
    if (!cat) return []
    query = query.eq("category_id", cat.id)
  }

  switch (opts?.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "price-asc":
      query = query.order("price_cents", { ascending: true })
      break
    case "price-desc":
      query = query.order("price_cents", { ascending: false })
      break
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
  }

  const { data, error } = await query
  if (error) {
    console.log("[v0] getAllProducts error:", error.message)
    return []
  }
  return (data ?? []).map((p) => normalize(p as unknown as RawProduct))
}

export async function getNewestProducts(limit = 12): Promise<Product[]> {
  if (!hasSupabaseEnv()) return fallbackProducts.slice(0, limit)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) {
    console.log("[v0] getNewestProducts error:", error.message)
    return []
  }
  return (data ?? []).map((p) => normalize(p as unknown as RawProduct))
}

export async function getBestSellerProducts(limit = 12): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return fallbackProducts.filter((product) => product.is_featured).slice(0, limit)
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) {
    console.log("[v0] getBestSellerProducts error:", error.message)
    return []
  }
  return (data ?? []).map((p) => normalize(p as unknown as RawProduct))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) {
    return fallbackProducts.find((product) => product.slug === slug) ?? null
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
  if (error) {
    console.log("[v0] getProductBySlug error:", error.message)
    return null
  }
  if (!data) return null
  return normalize(data as unknown as RawProduct)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!hasSupabaseEnv()) {
    return fallbackCategories.find((category) => category.slug === slug) ?? null
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()
  if (error) {
    console.log("[v0] getCategoryBySlug error:", error.message)
    return null
  }
  return (data as Category) ?? null
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return fallbackProducts
      .filter(
        (item) =>
          item.id !== product.id && item.category_id === product.category_id,
      )
      .slice(0, limit)
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .neq("id", product.id)
    .eq("category_id", product.category_id ?? "")
    .limit(limit)
  if (error) {
    console.log("[v0] getRelatedProducts error:", error.message)
    return []
  }
  return (data ?? []).map((p) => normalize(p as unknown as RawProduct))
}

export async function getCart(userId: string): Promise<CartItemWithProduct[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `id, quantity,
       product:products ( ${PRODUCT_SELECT} ),
       variant:product_variants ( id, size, color, sku, stock )`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.log("[v0] getCart error:", error.message)
    return []
  }

  return (data ?? []).map((row) => {
    const rawProduct = Array.isArray(row.product) ? row.product[0] : row.product
    const rawVariant = Array.isArray(row.variant) ? row.variant[0] : row.variant
    return {
      id: row.id as string,
      quantity: row.quantity as number,
      product: normalize(rawProduct as unknown as RawProduct),
      variant: (rawVariant as ProductVariant | null) ?? null,
    }
  })
}

export async function getUserOrders(userId: string) {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, created_at, status, subtotal_cents, shipping_cents, total_cents, currency,
       items:order_items ( id, product_name, variant_label, unit_price_cents, quantity )`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) {
    console.log("[v0] getUserOrders error:", error.message)
    return []
  }
  return data ?? []
}

export async function getWishlist(userId: string): Promise<Product[]> {
  if (!hasSupabaseEnv()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("wishlist_items")
    .select(`product:products ( ${PRODUCT_SELECT} )`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.log("[v0] getWishlist error:", error.message)
    return []
  }

  return (data ?? [])
    .map((row) => (Array.isArray(row.product) ? row.product[0] : row.product))
    .filter(Boolean)
    .map((p) => normalize(p as unknown as RawProduct))
}
