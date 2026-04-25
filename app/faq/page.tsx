import Link from "next/link"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "@/lib/content"

export const metadata = {
  title: "FAQ",
  description:
    "Questions frequentes Pyro Wear: tailles, livraison, retours, paiement et stocks limites.",
}

export default function FAQPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="grid gap-12 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
          <div>
            <p className="label-eyebrow">Service client</p>
            <h1 className="mt-5 font-serif text-[44px] leading-[0.95] tracking-tight md:text-[72px]">
              Questions nettes. Reponses directes.
            </h1>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-smoke">
              Besoin d&apos;un detail avant de commander ? Ecris-nous, l&apos;equipe
              repond sous un jour ouvre.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex border border-foreground px-6 py-4 text-[11px] uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
            >
              Contacter Pyro
            </Link>
          </div>

          <Accordion type="single" collapsible className="border-t border-border">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`item-${index}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-6 text-left text-[13px] font-medium uppercase tracking-[0.18em]">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14.5px] leading-relaxed text-foreground/75">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
