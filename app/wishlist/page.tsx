import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"
import { createClient } from "@/lib/supabase/server"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getWishlist } from "@/lib/queries"

export const metadata = { title: "Wishlist" }

export default async function WishlistPage() {
  if (!hasSupabaseEnv()) redirect("/auth/login?next=/wishlist")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login?next=/wishlist")

  const products = await getWishlist(user.id)

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-14 md:py-20">
          <p className="label-eyebrow">Wishlist</p>
          <h1 className="mt-4 font-serif text-[44px] leading-[0.95] tracking-tight md:text-[64px]">
            Tes pieces en attente.
          </h1>

          <div className="mt-12">
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="mx-auto max-w-md py-20 text-center">
                <Heart className="mx-auto size-7 text-smoke" strokeWidth={1.2} />
                <p className="mt-6 font-serif text-3xl">
                  Rien pour l&apos;instant.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-smoke">
                  Ajoute une piece depuis une fiche produit pour la retrouver
                  ici avant le prochain drop.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex bg-foreground px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-background"
                >
                  Explorer la boutique
                </Link>
              </div>
            )}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
