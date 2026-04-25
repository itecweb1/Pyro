import { Mail, MapPin, MessageSquare } from "lucide-react"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Contact",
  description:
    "Contacter Pyro Wear pour commandes, retours, presse, wholesale et collaborations.",
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Container className="py-16 md:py-24">
          <p className="label-eyebrow">Contact</p>
          <h1 className="mt-5 max-w-[14ch] font-serif text-[48px] leading-[0.95] tracking-tight md:text-[82px]">
            Parle-nous du prochain mouvement.
          </h1>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Mail,
                title: "Commandes",
                body: "care@pyrowear.example",
                meta: "Livraison, retours, tailles, reparations.",
              },
              {
                icon: MessageSquare,
                title: "Presse & wholesale",
                body: "studio@pyrowear.example",
                meta: "Lookbooks, collaborations, points de vente.",
              },
              {
                icon: MapPin,
                title: "Atelier",
                body: "Casablanca / Maroc",
                meta: "Essayage ou showroom prive sur rendez-vous.",
              },
            ].map((item) => (
              <article key={item.title} className="border border-border p-6">
                <item.icon className="size-5 text-smoke" strokeWidth={1.3} />
                <h2 className="mt-6 label-eyebrow">{item.title}</h2>
                <p className="mt-3 font-serif text-2xl">{item.body}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-smoke">
                  {item.meta}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
