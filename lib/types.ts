export type Category = {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  sort_order: number
}

export type ProductImage = {
  id: string
  url: string
  alt: string | null
  sort_order: number
}

export type ProductVariant = {
  id: string
  size: string | null
  color: string | null
  sku: string | null
  stock: number
}

export type Product = {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  price_cents: number
  compare_at_cents: number | null
  currency: string
  materials: string | null
  care: string | null
  is_featured: boolean
  category_id: string | null
  category?: Pick<Category, "slug" | "name"> | null
  images: ProductImage[]
  variants: ProductVariant[]
}

export type CartItemWithProduct = {
  id: string
  quantity: number
  product: Product
  variant: ProductVariant | null
}

export type HeroStat = {
  label: string
  value: string
}

export type BrandSettings = {
  name: string
  slogan: string
  description: string
  shipping_threshold_cents: number
  shipping_fee_cents: number
  announcement_items: string[]
  hero_stats: HeroStat[]
}

export type HeroBanner = {
  id: string
  title: string
  subtitle: string | null
  eyebrow: string | null
  cta_label: string | null
  cta_href: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at?: string
}
