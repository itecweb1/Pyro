import Link from "next/link"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-32 md:py-44 text-center">
          <p className="label-eyebrow">404</p>
          <h1 className="mt-5 font-serif text-[72px] md:text-[120px] leading-[0.9] tracking-tight">
            Not here.
          </h1>
          <p className="mt-6 max-w-md mx-auto text-[15px] text-smoke leading-relaxed">
            The page you were looking for has either moved or never existed.
            The shop, however, remains open.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-foreground text-background px-8 py-4 text-[11px] uppercase tracking-[0.24em] hover:bg-graphite"
            >
              Enter the shop
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-foreground/80 px-8 py-4 text-[11px] uppercase tracking-[0.24em] hover:bg-foreground hover:text-background"
            >
              Go home
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
