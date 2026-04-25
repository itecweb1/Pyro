import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { getBestSellerProducts } from "@/lib/queries"

export const metadata = {
  title: "Best sellers",
  description:
    "Les pieces Pyro Wear les plus demandees: essentiels streetwear premium, coupes fortes et stocks limites.",
}

export default async function BestSellersPage() {
  const products = await getBestSellerProducts(16)

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-border bg-foreground text-background">
          <Container className="py-16 md:py-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/65">
              Selection communaute
            </p>
            <h1 className="mt-5 max-w-[13ch] text-balance font-serif text-[46px] leading-[0.95] tracking-tight md:text-[82px]">
              Les pieces qui partent en premier.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-background/72">
              Best sellers, mais pas basiques: les coupes les plus fortes, les
              matieres les plus portees, les silhouettes qui signent Pyro Wear.
            </p>
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
