import Link from "next/link"
import { SlidersHorizontal } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSearchForm } from "@/components/product-search-form"
import { getAllProducts, getCategories } from "@/lib/queries"

type SearchParams = Promise<{
  q?: string
  sort?: "featured" | "newest" | "price-asc" | "price-desc"
}>

export const metadata = {
  title: "Boutique",
  description:
    "Catalogue Pyro Wear: streetwear homme premium, silhouettes urbaines, pieces limitees et essentiels graphite.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { q, sort } = await searchParams
  const [products, categories] = await Promise.all([
    getAllProducts({ search: q, sort }),
    getCategories(),
  ])

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-border">
          <Container className="py-14 md:py-20">
            <p className="label-eyebrow">Catalogue complet</p>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h1 className="max-w-[14ch] text-balance font-serif text-[44px] leading-[0.95] tracking-tight md:text-[72px]">
                L&apos;uniforme Pyro, piece par piece.
              </h1>
              <p className="max-w-md text-[14px] leading-relaxed text-smoke">
                {products.length} pieces, {categories.length} divisions, une
                seule intention: une silhouette nette, sombre et confiante.
              </p>
            </div>

            <div className="mt-10 border border-border bg-secondary/25 p-4 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-smoke" strokeWidth={1.4} />
                <p className="label-eyebrow">Filtres rapides</p>
              </div>
              <ProductSearchForm query={q} sort={sort} />
            </div>

            <nav
              aria-label="Filtrer par categorie"
              className="mt-8 flex flex-wrap gap-2"
            >
              <Link
                href="/shop"
                className="border border-foreground bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-background"
              >
                Tout
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:border-foreground hover:text-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="min-h-[36vh] border border-dashed border-border p-10 text-center">
                <p className="font-serif text-3xl">Aucune piece trouvee.</p>
                <p className="mt-3 text-sm text-smoke">
                  Essaie une recherche plus large ou reviens au catalogue.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex bg-foreground px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background"
                >
                  Reinitialiser
                </Link>
              </div>
            )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
