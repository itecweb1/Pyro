import Link from "next/link"
import { redirect } from "next/navigation"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getUserOrders } from "@/lib/queries"
import { formatDate, formatPrice } from "@/lib/format"
import { ProfileForm } from "@/components/profile-form"
import { signOut } from "@/app/actions/auth"

export const metadata = { title: "Compte" }

type SearchParams = Promise<{ order?: string }>

export default async function AccountPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { order } = await searchParams
  if (!hasSupabaseEnv()) redirect("/auth/login?next=/account")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?next=/account")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const orders = await getUserOrders(user.id)

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email ||
    "Membre Pyro"

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <section className="border-b border-border">
          <Container className="py-14 md:py-20">
            <p className="label-eyebrow">Compte</p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h1 className="font-serif text-[44px] md:text-[64px] leading-[0.95] tracking-tight">
                Bienvenue, {profile?.first_name || "membre"}.
              </h1>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground border-b border-smoke hover:border-foreground pb-1"
                >
                  Deconnexion
                </button>
              </form>
            </div>
            <p className="mt-3 text-[13px] text-smoke">{user.email}</p>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <aside>
              <nav className="flex flex-col border-t border-border">
                {[
                  { href: "#orders", label: "Commandes" },
                  { href: "#profile", label: "Profile" },
                  { href: "/wishlist", label: "Wishlist" },
                  { href: "/cart", label: "Panier actuel" },
                ].map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="flex items-center justify-between border-b border-border py-4 text-[12px] uppercase tracking-[0.22em] hover:text-smoke"
                  >
                    {it.label}
                    <span aria-hidden className="text-smoke">
                      -&gt;
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-10 border border-border p-6 bg-secondary/30">
                <p className="label-eyebrow">Membre Pyro</p>
                <p className="mt-3 font-serif text-2xl leading-tight">
                  {displayName}
                </p>
                <p className="mt-2 text-[12px] text-smoke">
                  Inscrit le {formatDate(user.created_at)}
                </p>
              </div>
            </aside>

            <div className="flex flex-col gap-16">
              {order === "placed" && (
                <div className="border border-foreground/20 bg-secondary/40 p-5 text-[13px] leading-relaxed">
                  Commande recue. L&apos;equipe Pyro peut te contacter pour
                  confirmer l&apos;adresse et la disponibilite avant expedition.
                </div>
              )}

              <section id="orders">
                <h2 className="label-eyebrow">Historique commandes</h2>
                {orders.length === 0 ? (
                  <div className="mt-6 border border-dashed border-border p-8 md:p-12 text-center">
                    <p className="font-serif text-2xl">Aucune commande.</p>
                    <p className="mt-2 text-[13px] text-smoke">
                      Tes commandes apparaitront ici apres validation.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-6 inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-graphite"
                    >
                      Explorer la boutique
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-6 border-t border-border">
                    {orders.map((o) => (
                      <li
                        key={o.id}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-border py-5"
                      >
                        <div>
                          <p className="text-[12px] text-smoke tabular-nums">
                            {formatDate(o.created_at)}
                          </p>
                          <p className="text-[13px] font-medium tabular-nums mt-1">
                            #{o.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center bg-secondary px-2 py-1 text-[10.5px] uppercase tracking-[0.22em]">
                            {o.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-medium tabular-nums">
                            {formatPrice(o.total_cents, o.currency)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section id="profile">
                <h2 className="label-eyebrow">Profil</h2>
                <div className="mt-6 border border-border p-6 md:p-8">
                  <ProfileForm
                    initial={{
                      first_name: profile?.first_name ?? "",
                      last_name: profile?.last_name ?? "",
                      phone: profile?.phone ?? "",
                    }}
                  />
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
