import Link from "next/link"
import { notFound } from "next/navigation"
import { Heart } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGallery } from "@/components/product-gallery"
import { AddToCartForm } from "@/components/add-to-cart-form"
import { ProductGrid } from "@/components/product-grid"
import { toggleWishlist } from "@/app/actions/cart"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  getBrandSettings,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/queries"
import { formatPrice } from "@/lib/format"
import { brand } from "@/lib/content"

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produit" }
  return {
    title: product.name,
    description: product.subtitle ?? product.description ?? undefined,
    openGraph: {
      title: `${product.name} - Pyro Wear`,
      description: product.subtitle ?? product.description ?? undefined,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  const [related, brandSettings] = await Promise.all([
    getRelatedProducts(product, 4),
    getBrandSettings(),
  ])

  const onSale =
    product.compare_at_cents && product.compare_at_cents > product.price_cents
  const shippingCopy = `Paiement comptant a la livraison. ${formatPrice(
    brandSettings.shipping_fee_cents,
    product.currency,
  )} de livraison, offerte des ${formatPrice(
    brandSettings.shipping_threshold_cents,
    product.currency,
  )}. Casablanca 24h, autres villes 24 a 48h.`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.subtitle,
    image: product.images.map((image) => image.url),
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price_cents / 100,
      availability: product.variants.some((variant) => variant.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${brand.siteUrl}/product/${product.slug}`,
    },
  }

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Container className="py-8 md:py-12">
          <nav
            aria-label="Breadcrumb"
            className="label-eyebrow flex items-center gap-3"
          >
            <Link href="/shop" className="hover:text-foreground">
              Boutique
            </Link>
            {product.category && (
              <>
                <span aria-hidden>/</span>
                <Link
                  href={`/collections/${product.category.slug}`}
                  className="hover:text-foreground"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span aria-hidden>/</span>
            <span className="text-foreground/80 truncate">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14 lg:gap-20">
            <ProductGallery images={product.images} name={product.name} />

            <div className="flex flex-col">
              <div className="md:sticky md:top-28">
                <p className="label-eyebrow">{product.category?.name}</p>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h1 className="font-serif text-[34px] leading-[1] tracking-tight text-balance md:text-[44px]">
                    {product.name}
                  </h1>
                  <form action={toggleWishlist}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input
                      type="hidden"
                      name="redirectTo"
                      value={`/product/${product.slug}`}
                    />
                    <button
                      type="submit"
                      aria-label="Ajouter a la wishlist"
                      className="inline-flex size-11 shrink-0 items-center justify-center border border-border transition-colors hover:bg-foreground hover:text-background"
                    >
                      <Heart className="size-4" strokeWidth={1.4} />
                    </button>
                  </form>
                </div>
                {product.subtitle && (
                  <p className="mt-2 text-[15px] text-smoke">
                    {product.subtitle}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-[20px] font-medium tabular-nums">
                    {formatPrice(product.price_cents, product.currency)}
                  </span>
                  {onSale && product.compare_at_cents && (
                    <span className="text-[14px] text-smoke line-through tabular-nums">
                      {formatPrice(
                        product.compare_at_cents,
                        product.currency,
                      )}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="mt-6 text-[14.5px] leading-relaxed text-foreground/80 max-w-[52ch]">
                    {product.description}
                  </p>
                )}

                <div className="mt-8">
                  <AddToCartForm
                    product={product}
                    redirectTo={`/product/${product.slug}`}
                    deliveryNote={shippingCopy}
                  />
                </div>

                <Accordion type="multiple" className="mt-10 border-t border-border">
                  {product.materials && (
                    <AccordionItem value="materials" className="border-b border-border">
                      <AccordionTrigger className="text-[11px] uppercase tracking-[0.22em] font-medium py-5">
                        Matiere
                      </AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-relaxed text-foreground/80">
                        {product.materials}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {product.care && (
                    <AccordionItem value="care" className="border-b border-border">
                      <AccordionTrigger className="text-[11px] uppercase tracking-[0.22em] font-medium py-5">
                        Entretien
                      </AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-relaxed text-foreground/80">
                        {product.care}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="shipping" className="border-b border-border">
                    <AccordionTrigger className="text-[11px] uppercase tracking-[0.22em] font-medium py-5">
                      Livraison &amp; retours
                    </AccordionTrigger>
                    <AccordionContent className="text-[14px] leading-relaxed text-foreground/80">
                      {shippingCopy} Echange taille sous 7 jours apres
                      reception.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </Container>

        {related.length > 0 && (
          <section className="border-t border-border py-20 md:py-24">
            <Container>
              <div className="mb-10 flex items-end justify-between">
                <h2 className="font-serif text-[32px] md:text-[40px] leading-none tracking-tight">
                  Completer la silhouette.
                </h2>
                <Link
                  href="/shop"
                  className="text-[11px] uppercase tracking-[0.22em] hover:text-smoke"
                >
                  Tout voir -&gt;
                </Link>
              </div>
              <ProductGrid products={related} />
            </Container>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
