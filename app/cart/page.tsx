import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartItemRow } from "@/components/cart-item-row"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getBrandSettings, getCart } from "@/lib/queries"
import { formatPrice } from "@/lib/format"

export const metadata = { title: "Panier" }

export default async function CartPage() {
  const brandSettings = await getBrandSettings()
  const supabase = hasSupabaseEnv() ? await createClient() : null
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  if (!user) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="flex-1">
          <Container className="py-24 md:py-32">
            <div className="mx-auto max-w-md text-center">
              <ShoppingBag className="mx-auto size-7 text-smoke" strokeWidth={1.2} />
              <h1 className="mt-6 font-serif text-[36px] md:text-[44px] leading-none tracking-tight">
                Ton panier est vide.
              </h1>
              <p className="mt-4 text-[14px] text-smoke leading-relaxed">
                Connecte-toi pour conserver ton panier, tes commandes et tes
                adresses.
              </p>
              <div className="mt-8 flex flex-col gap-2">
                <Link
                  href="/auth/login?next=/cart"
                  className="inline-flex items-center justify-center bg-foreground text-background py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-graphite"
                >
                  Connexion
                </Link>
                <Link
                  href="/shop"
                  className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground py-2"
                >
                  Continuer la selection
                </Link>
              </div>
            </div>
          </Container>
        </main>
        <SiteFooter />
      </>
    )
  }

  const items = await getCart(user.id)
  const subtotal = items.reduce(
    (acc, it) => acc + it.product.price_cents * it.quantity,
    0,
  )
  const currency = items[0]?.product.currency ?? "MAD"
  const freeThreshold = brandSettings.shipping_threshold_cents
  const shipping =
    subtotal === 0 || subtotal >= freeThreshold
      ? 0
      : brandSettings.shipping_fee_cents
  const total = subtotal + shipping
  const remainingForFree = Math.max(0, freeThreshold - subtotal)

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-12 md:py-16">
          <header className="flex items-end justify-between gap-4 pb-8 border-b border-border">
            <div>
              <p className="label-eyebrow">Panier</p>
              <h1 className="mt-4 font-serif text-[40px] md:text-[56px] leading-none tracking-tight">
                Ta selection
              </h1>
            </div>
            <p className="text-[12.5px] text-smoke tabular-nums">
              {items.reduce((a, it) => a + it.quantity, 0)} articles
            </p>
          </header>

          {items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-serif text-2xl">
                Rien ici pour l&apos;instant.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] hover:text-smoke"
              >
                Explorer le catalogue <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-20 mt-2">
              <ul>
                {items.map((it) => (
                  <CartItemRow key={it.id} item={it} />
                ))}
              </ul>

              <aside className="lg:sticky lg:top-28 lg:self-start border border-border p-6 md:p-8 bg-secondary/30">
                <h2 className="label-eyebrow">Recapitulatif</h2>

                <dl className="mt-6 space-y-3 text-[13.5px]">
                  <div className="flex justify-between">
                    <dt>Sous-total</dt>
                    <dd className="tabular-nums">
                      {formatPrice(subtotal, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-smoke">
                    <dt>Livraison</dt>
                    <dd className="tabular-nums">
                      {shipping === 0 ? "Offerte" : formatPrice(shipping, currency)}
                    </dd>
                  </div>
                  {remainingForFree > 0 && (
                    <div className="pt-2">
                      <div className="h-[2px] bg-border overflow-hidden">
                        <div
                          className="h-full bg-foreground"
                          style={{
                            width: `${Math.min(
                              100,
                              (subtotal / freeThreshold) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-[11.5px] text-smoke">
                        Encore {formatPrice(remainingForFree, currency)} pour la
                        livraison offerte.
                      </p>
                    </div>
                  )}
                </dl>

                <div aria-hidden className="chrome-rule my-6" />

                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em]">
                    Total
                  </span>
                  <span className="text-[20px] font-medium tabular-nums">
                    {formatPrice(total, currency)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-smoke">
                  Taxes calculees au paiement.
                </p>

                <Link
                  href="/checkout"
                  className="mt-6 inline-flex items-center justify-center w-full bg-foreground text-background py-5 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-graphite"
                >
                  Passer au paiement
                  <ArrowRight className="ml-3 size-4" strokeWidth={1.4} />
                </Link>
                <Link
                  href="/shop"
                  className="mt-3 inline-flex items-center justify-center w-full py-3 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
                >
                  Continuer la selection
                </Link>
              </aside>
            </div>
          )}
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
