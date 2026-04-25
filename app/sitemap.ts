import type { MetadataRoute } from "next"
import { brand } from "@/lib/content"
import { getAllProducts, getCategories } from "@/lib/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])

  const staticRoutes = [
    "",
    "/shop",
    "/nouveautes",
    "/best-sellers",
    "/about",
    "/contact",
    "/faq",
    "/legal/shipping",
    "/legal/returns",
    "/legal/privacy",
    "/legal/terms",
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${brand.siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: `${brand.siteUrl}/collections/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${brand.siteUrl}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ]
}
