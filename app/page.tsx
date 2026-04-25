import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import {
  getBrandSettings,
  getFallbackCategoryImage,
  getFeaturedProducts,
  getCategories,
  getHeroBanners,
} from "@/lib/queries"
import { assuranceItems, defaultHeroBanners } from "@/lib/content"
import { MotionReveal } from "@/components/motion-reveal"

export default async function HomePage() {
  const [featured, categories, brandSettings, heroBanners] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
    getBrandSettings(),
    getHeroBanners(1),
  ])
  const hero = heroBanners[0] ?? defaultHeroBanners[0]

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="relative grid md:grid-cols-[1.15fr_1fr]">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[640px] lg:min-h-[760px]">
              <Image
                src={hero.image_url ?? "/products/hero-main.jpg"}
                alt={hero.title}
                fill
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="absolute left-5 top-5 md:left-8 md:top-8 flex items-center gap-3">
                <span aria-hidden className="block h-[1px] w-10 bg-background" />
                <span className="text-[10.5px] uppercase tracking-[0.28em] text-background">
                  {hero.eyebrow ?? "Drop Pyro Wear"}
                </span>
              </div>
              <div className="absolute left-5 bottom-5 right-5 md:left-8 md:bottom-8 md:right-auto flex items-end justify-between md:block">
                <span className="text-[10.5px] uppercase tracking-[0.28em] text-background/80">
                  {brandSettings.slogan}
                </span>
              </div>
            </div>

            <div className="relative flex flex-col justify-between bg-background p-8 md:p-12 lg:p-16">
              <div>
                <p className="label-eyebrow">01 - Campagne active</p>
                <h1 className="mt-6 font-serif text-[44px] md:text-[64px] lg:text-[84px] leading-[0.95] tracking-[-0.015em] text-balance">
                  {hero.title}
                </h1>
                <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-foreground/75">
                  {hero.subtitle ?? brandSettings.description}
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href={hero.cta_href ?? "/shop"}
                  className="group inline-flex items-center justify-between bg-foreground text-background px-6 py-4 text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-graphite transition-colors"
                >
                  {hero.cta_label ?? "Voir le drop"}
                  <ArrowUpRight
                    className="ml-8 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.4}
                  />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center justify-between border border-foreground/80 px-6 py-4 text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  Manifeste Pyro
                  <ArrowUpRight
                    className="ml-8 size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.4}
                  />
                </Link>
              </div>

              <div aria-hidden className="chrome-rule mt-12" />

              <dl className="mt-6 grid grid-cols-3 gap-6">
                {brandSettings.hero_stats.slice(0, 3).map((item) => (
                  <div key={item.label}>
                    <dt className="label-eyebrow">{item.label}</dt>
                    <dd className="mt-2 font-serif text-xl">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="border-b border-border">
          <Container>
            <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              {assuranceItems.map((v) => (
                <li key={v.title} className="flex items-start gap-4 px-2 py-6 md:px-8">
                  <v.icon className="size-5 mt-0.5 text-smoke" strokeWidth={1.3} />
                  <div>
                    <p className="text-[13px] font-medium">{v.title}</p>
                    <p className="text-[12.5px] text-smoke leading-relaxed mt-0.5">
                      {v.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-20 md:py-28">
          <Container>
            <MotionReveal className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="label-eyebrow">02 - Best sellers</p>
                <h2 className="mt-5 font-serif text-[36px] md:text-[52px] leading-[1] tracking-tight text-balance max-w-[18ch]">
                  Les essentiels qui construisent la silhouette.
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-medium hover:text-smoke"
              >
                Tout voir <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>
            </MotionReveal>
            <ProductGrid products={featured} />
            <div className="mt-10 md:hidden">
              <Link
                href="/shop"
                className="block w-full text-center border border-foreground/80 px-6 py-4 text-[11px] uppercase tracking-[0.22em]"
              >
                Tout voir
              </Link>
            </div>
          </Container>
        </section>

        {/* EDITORIAL SPLIT */}
        <section className="border-t border-border bg-secondary/50">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image
                src="/products/hero-editorial.jpg"
                alt="Detail of heavyweight knit garment in smoke grey"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <p className="label-eyebrow">03 - Manifeste</p>
              <h2 className="mt-6 font-serif text-[34px] md:text-[48px] leading-[1.05] tracking-tight text-balance">
                Coupe froide.
                <br />
                <em className="text-smoke">Impact durable.</em>
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-foreground/75">
                Pyro Wear reduit le bruit: moins de pieces, plus de presence.
                Chaque coupe, zip et texture sert une silhouette masculine,
                urbaine, premium et facile a porter.
              </p>
              <div className="mt-10">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 border-b border-foreground/80 pb-2 text-[11px] uppercase tracking-[0.22em] font-medium hover:text-smoke hover:border-smoke"
                >
                  Lire le manifeste
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.4}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-20 md:py-28">
          <Container>
            <div className="mb-12">
              <p className="label-eyebrow">04 - Collections</p>
              <h2 className="mt-5 font-serif text-[36px] md:text-[52px] leading-[1] tracking-tight">
                Choisir sa division.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
                >
                  <Image
                    src={cat.image_url ?? getFallbackCategoryImage(cat.slug)}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <p className="label-eyebrow text-background/80">
                      Division {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl md:text-3xl text-background">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
