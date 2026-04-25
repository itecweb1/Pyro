import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { getNewestProducts } from "@/lib/queries"

export const metadata = {
  title: "Nouveautes",
  description:
    "Les dernieres pieces Pyro Wear: drops limites, silhouettes homme et streetwear premium.",
}

export default async function NewArrivalsPage() {
  const products = await getNewestProducts(16)

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-border">
          <Container className="py-16 md:py-24">
            <p className="label-eyebrow">Drop actuel</p>
            <div className="mt-5 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
              <h1 className="text-balance font-serif text-[46px] leading-[0.95] tracking-tight md:text-[82px]">
                Nouveautes en stock limite.
              </h1>
              <div>
                <p className="text-[15px] leading-relaxed text-foreground/75">
                  Capsules courtes, matieres lourdes, details fonctionnels. Les
                  pieces arrivent en petites quantites et ne reviennent pas
                  toujours.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] hover:text-smoke"
                >
                  Voir tout le catalogue
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-12 md:py-16">
          <Container>
            <ProductGrid products={products} />
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
