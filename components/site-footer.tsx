import Link from "next/link"
import { Container } from "@/components/container"
import { NewsletterForm } from "@/components/newsletter-form"

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="label-eyebrow mb-5">Dispatches</p>
            <h3 className="font-serif text-[28px] leading-[1.05] tracking-tight text-balance max-w-[22ch]">
              Recois les drops, les archives et les previews privees avant le
              reste du monde.
            </h3>
            <div className="mt-6 max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <FooterCol
            title="Shop"
            links={[
              { href: "/shop", label: "Toute la boutique" },
              { href: "/nouveautes", label: "Nouveautes" },
              { href: "/best-sellers", label: "Best sellers" },
              { href: "/collections/outerwear", label: "Outerwear" },
              { href: "/collections/tops", label: "Tops" },
              { href: "/collections/bottoms", label: "Bas" },
              { href: "/collections/accessories", label: "Accessoires" },
            ]}
          />
          <FooterCol
            title="House"
            links={[
              { href: "/about", label: "Manifeste" },
              { href: "/about#manifesto", label: "Vision" },
              { href: "/about#stockists", label: "Stockists" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/account", label: "Compte" },
            ]}
          />
          <FooterCol
            title="Service"
            links={[
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
              { href: "/legal/shipping", label: "Livraison" },
              { href: "/legal/returns", label: "Retours" },
              { href: "/legal/contact", label: "Contact" },
              { href: "/legal/terms", label: "CGV" },
              { href: "/legal/privacy", label: "Confidentialite" },
            ]}
          />
        </div>

        <div aria-hidden className="chrome-rule mt-16" />

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-smoke">
            © {new Date().getFullYear()} Pyro Wear. Tous droits reserves.
          </div>
          <div
            aria-hidden
            className="select-none text-center font-serif italic text-smoke/60 text-sm"
          >
            Est. 2024 - Casablanca / Maroc
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-smoke md:text-right">
            <Link href="/legal/privacy" className="hover:text-foreground">
              Confidentialite
            </Link>{" "}
            <span className="text-smoke/50">/</span>{" "}
            <Link href="/legal/terms" className="hover:text-foreground">
              CGV
            </Link>{" "}
            <span className="text-smoke/50">/</span>{" "}
            <Link href="/legal/cookies" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </Container>

      {/* Oversized brand mark for visual anchor */}
      <div className="overflow-hidden border-t border-border pt-6 pb-8">
        <div
          aria-hidden
          className="select-none text-center font-sans font-semibold tracking-[-0.04em] leading-none text-foreground/[0.06] uppercase"
          style={{ fontSize: "clamp(84px, 18vw, 260px)" }}
        >
          PYRO · WEAR
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="label-eyebrow mb-5">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
