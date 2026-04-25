import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-16 md:py-24 max-w-3xl">{children}</Container>
      </main>
      <SiteFooter />
    </>
  )
}
