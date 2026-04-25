import Link from "next/link"
import { Search, User, ShoppingBag, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Wordmark } from "@/components/wordmark"
import { Container } from "@/components/container"
import { MobileNav } from "@/components/mobile-nav"
import { mainNav } from "@/lib/content"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { getBrandSettings } from "@/lib/queries"

export async function SiteHeader() {
  const brandSettings = await getBrandSettings()
  const supabase = hasSupabaseEnv() ? await createClient() : null
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } }

  let cartCount = 0
  if (supabase && user) {
    const { data } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", user.id)
    cartCount = (data ?? []).reduce((acc, r) => acc + (r.quantity ?? 0), 0)
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar items={brandSettings.announcement_items} />
      <div className="border-b border-border bg-background/85 backdrop-blur-md">
        <Container>
          <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center md:h-16">
            <div className="flex items-center gap-6">
              <MobileNav nav={mainNav} isAuthed={Boolean(user)}>
                <button
                  className="inline-flex size-9 items-center justify-center md:hidden"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="size-4" />
                </button>
              </MobileNav>
              <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
                {mainNav.slice(0, 4).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-center">
              <Wordmark />
            </div>

            <div className="flex items-center justify-end gap-1">
              <nav className="hidden items-center gap-6 md:flex mr-2">
                {mainNav.slice(4).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/shop"
                aria-label="Rechercher"
                className="inline-flex size-9 items-center justify-center hover:text-smoke transition-colors"
              >
                <Search className="size-4" strokeWidth={1.4} />
              </Link>
              <Link
                href={user ? "/account" : "/auth/login"}
                aria-label="Compte"
                className="inline-flex size-9 items-center justify-center hover:text-smoke transition-colors"
              >
                <User className="size-4" strokeWidth={1.4} />
              </Link>
              <Link
                href="/cart"
                aria-label={`Panier, ${cartCount} articles`}
                className="relative inline-flex size-9 items-center justify-center hover:text-smoke transition-colors"
              >
                <ShoppingBag className="size-4" strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[16px] h-[16px] items-center justify-center bg-foreground text-background text-[9px] font-semibold px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
