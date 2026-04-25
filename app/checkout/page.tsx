import Link from "next/link"
import { redirect } from "next/navigation"
import { PackageCheck, Phone, Truck } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getBrandSettings, getCart } from "@/lib/queries"
import { formatPrice } from "@/lib/format"
import { placeCashOnDeliveryOrder } from "@/app/actions/cart"

export const metadata = { title: "Paiement a la livraison" }

type SearchParams = Promise<{
  invalid?: string
  error?: string
}>

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  if (!hasSupabaseEnv()) redirect("/cart")

  const brandSettings = await getBrandSettings()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?next=/checkout")

  const [{ data: profile }, items] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    getCart(user.id),
  ])

  if (items.length === 0) redirect("/cart")

  const subtotal = items.reduce(
    (a, it) => a + it.product.price_cents * it.quantity,
    0,
  )
  const currency = items[0]?.product.currency ?? "MAD"
  const shipping =
    subtotal >= brandSettings.shipping_threshold_cents
      ? 0
      : brandSettings.shipping_fee_cents
  const total = subtotal + shipping
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || ""

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-12 md:py-16 max-w-6xl">
          <p className="label-eyebrow">Paiement</p>
          <h1 className="mt-4 font-serif text-[40px] md:text-[56px] leading-none tracking-tight">
            Payez comptant a la livraison.
          </h1>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-smoke">
            Passe ta commande, confirme tes coordonnees et regle en especes a la
            reception. Pyro Wear prepare les commandes pour le Maroc avec un
            suivi simple, une verification rapide et une livraison 24h a
            Casablanca, 24 a 48h dans la plupart des autres villes.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_360px]">
            <div className="space-y-6">
              {(params.invalid || params.error) && (
                <div className="border border-destructive/30 bg-destructive/5 p-4 text-[13px] leading-relaxed text-foreground">
                  {params.invalid
                    ? "Merci de renseigner au minimum le nom complet, le telephone, la ville et l'adresse."
                    : "La commande n'a pas pu etre enregistree. Reessaie dans un instant."}
                </div>
              )}

              <section className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: PackageCheck,
                    title: "Commande confirmee",
                    copy: "Nous verifions les details avant expedition.",
                  },
                  {
                    icon: Truck,
                    title: "Livraison nationale",
                    copy: "24h Casa, 24-48h ailleurs selon la ville.",
                  },
                  {
                    icon: Phone,
                    title: "Contact rapide",
                    copy: "Numero mobile recommande pour la confirmation.",
                  },
                ].map((item) => (
                  <article key={item.title} className="border border-border p-5">
                    <item.icon className="size-5 text-smoke" strokeWidth={1.4} />
                    <p className="mt-4 text-[13px] font-medium">{item.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-smoke">
                      {item.copy}
                    </p>
                  </article>
                ))}
              </section>

              <form action={placeCashOnDeliveryOrder} className="border border-border p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Nom complet" htmlFor="full_name" className="md:col-span-2">
                    <input
                      id="full_name"
                      name="full_name"
                      required
                      defaultValue={fullName}
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="Yassine El Idrissi"
                    />
                  </Field>

                  <Field label="Telephone" htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      required
                      defaultValue={profile?.phone ?? ""}
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="+212 6 12 34 56 78"
                    />
                  </Field>

                  <Field label="Ville" htmlFor="city">
                    <input
                      id="city"
                      name="city"
                      required
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="Casablanca"
                    />
                  </Field>

                  <Field label="Adresse" htmlFor="line1" className="md:col-span-2">
                    <input
                      id="line1"
                      name="line1"
                      required
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="Numero, rue, quartier"
                    />
                  </Field>

                  <Field label="Complement d'adresse" htmlFor="line2">
                    <input
                      id="line2"
                      name="line2"
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="Appartement, etage, point de repere"
                    />
                  </Field>

                  <Field label="Code postal" htmlFor="postal_code">
                    <input
                      id="postal_code"
                      name="postal_code"
                      className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
                      placeholder="20000"
                    />
                  </Field>
                </div>

                <input type="hidden" name="country" value="Maroc" />

                <div className="mt-6 border-t border-border pt-5 text-[12.5px] leading-relaxed text-smoke">
                  En validant, tu choisis le paiement comptant a la livraison.
                  L&apos;equipe peut te contacter pour confirmer l&apos;adresse ou la
                  disponibilite avant expedition.
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-foreground px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-background hover:bg-graphite"
                  >
                    Confirmer la commande COD
                  </button>
                  <Link
                    href="/cart"
                    className="inline-flex items-center justify-center border border-foreground/80 px-6 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
                  >
                    Retour panier
                  </Link>
                </div>
              </form>
            </div>

            <aside className="border border-border p-6 md:p-8 self-start lg:sticky lg:top-28">
              <h2 className="label-eyebrow">Recapitulatif</h2>
              <ul className="mt-6 space-y-4">
                {items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-start justify-between gap-3 text-[13px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{it.product.name}</p>
                      <p className="text-smoke text-[12px] truncate">
                        {it.variant?.size} - x{it.quantity}
                      </p>
                    </div>
                    <span className="tabular-nums shrink-0">
                      {formatPrice(
                        it.product.price_cents * it.quantity,
                        it.product.currency,
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div aria-hidden className="chrome-rule my-6" />
              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <dt>Sous-total</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal, currency)}</dd>
                </div>
                <div className="flex justify-between text-smoke">
                  <dt>Livraison</dt>
                  <dd className="tabular-nums">
                    {shipping === 0 ? "Offerte" : formatPrice(shipping, currency)}
                  </dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-[14px] font-medium">
                  <dt>Total a payer a la livraison</dt>
                  <dd className="tabular-nums">{formatPrice(total, currency)}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border pt-5 text-[12px] leading-relaxed text-smoke">
                Livraison offerte des {formatPrice(brandSettings.shipping_threshold_cents, currency)}.
                Au-dela, les frais standards sont de {formatPrice(brandSettings.shipping_fee_cents, currency)}.
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`grid gap-2 ${className ?? ""}`} htmlFor={htmlFor}>
      <span className="label-eyebrow">{label}</span>
      {children}
    </label>
  )
}
