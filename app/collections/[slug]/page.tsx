import Link from "next/link"
import { notFound } from "next/navigation"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  getAllProducts,
  getCategories,
  getCategoryBySlug,
} from "@/lib/queries"

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Collection" }
  return {
    title: category.name,
    description:
      category.description ?? `Decouvre ${category.name} par Pyro Wear.`,
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [products, categories] = await Promise.all([
    getAllProducts({ categorySlug: slug }),
    getCategories(),
  ])

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-border">
          <Container className="py-14 md:py-20">
            <nav aria-label="Breadcrumb" className="label-eyebrow flex items-center gap-3">
              <Link href="/shop" className="hover:text-foreground">
                Boutique
              </Link>
              <span aria-hidden>/</span>
              <span className="text-foreground/80">{category.name}</span>
            </nav>
            <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h1 className="font-serif text-[44px] md:text-[72px] leading-[0.95] tracking-tight text-balance max-w-[14ch]">
                {category.name}.
              </h1>
              {category.description && (
                <p className="max-w-md text-[14px] leading-relaxed text-smoke">
                  {category.description}
                </p>
              )}
            </div>

            <nav aria-label="Other categories" className="mt-10 flex flex-wrap gap-2">
              <Link
                href="/shop"
                className="border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:border-foreground hover:text-foreground"
              >
                Tout
              </Link>
              {categories.map((c) => {
                const active = c.slug === slug
                return (
                  <Link
                    key={c.id}
                    href={`/collections/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "border border-foreground bg-foreground text-background px-4 py-2 text-[11px] uppercase tracking-[0.22em]"
                        : "border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:border-foreground hover:text-foreground"
                    }
                  >
                    {c.name}
                  </Link>
                )
              })}
            </nav>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container>
            {products.length === 0 ? (
              <Empty className="min-h-[40vh]">
                <EmptyHeader>
                  <EmptyTitle className="font-serif text-3xl">
                    Aucune piece dans cette division.
                  </EmptyTitle>
                  <EmptyDescription>
                    Le drop est en preparation. Reviens tres vite.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ProductGrid products={products} />
            )}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
