import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/container"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Manifeste",
  description:
    "Pyro Wear cree un streetwear homme premium, sombre, net et durable.",
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src="/products/about-editorial.jpg"
              alt="Atelier Pyro Wear a Casablanca"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
            <Container className="relative z-10 h-full flex items-end pb-10 md:pb-16">
              <div className="max-w-3xl text-background">
                <p className="text-[11px] uppercase tracking-[0.28em] text-background/80">
                  Est. 2024 - Casablanca / Maroc
                </p>
                <h1 className="mt-5 font-serif text-[44px] md:text-[84px] leading-[0.95] tracking-tight text-balance">
                  Une maison pour silhouettes affirmees.
                </h1>
              </div>
            </Container>
          </div>
        </section>

        {/* Manifesto */}
        <section id="manifesto" className="py-20 md:py-28">
          <Container>
            <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
              <div>
                <p className="label-eyebrow">Manifeste</p>
              </div>
              <div>
                <p className="font-serif text-[28px] md:text-[38px] leading-[1.15] tracking-tight text-balance">
                  Pyro Wear construit moins de pieces, mais plus fortes. Des
                  coupes nettes, des poids serieux, une palette disciplinee.
                  Pas de bruit, pas de saison jetable, pas de compromis. Des
                  vetements faits pour etre&nbsp;
                  <em className="text-smoke">gardes</em>.
                </p>
                <div aria-hidden className="chrome-rule my-10" />
                <div className="grid gap-10 sm:grid-cols-3">
                  {[
                    {
                      n: "01",
                      t: "Poids",
                      c: "Coton loop-back 500gsm, nylon ripstop mat, construction dense.",
                    },
                    {
                      n: "02",
                      t: "Palette",
                      c: "Noir profond, graphite, blanc casse et chrome fume. Rien de gratuit.",
                    },
                    {
                      n: "03",
                      t: "Duree",
                      c: "Capsules courtes, stocks controles et pieces pensees pour durer.",
                    },
                  ].map((p) => (
                    <div key={p.n}>
                      <p className="font-serif text-4xl text-smoke">{p.n}</p>
                      <h3 className="mt-3 text-[13px] uppercase tracking-[0.22em] font-medium">
                        {p.t}
                      </h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">
                        {p.c}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Split editorial */}
        <section className="border-t border-border bg-secondary/40">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/5] md:aspect-auto">
              <Image
                src="/products/hero-editorial.jpg"
                alt="Detail photograph of a heavyweight knit"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24">
              <p className="label-eyebrow">Fabrication</p>
              <h2 className="mt-5 font-serif text-[32px] md:text-[44px] leading-[1.1] tracking-tight text-balance">
                Petites series. Matiere serieuse. Zero raccourci.
              </h2>
              <p className="mt-6 max-w-[50ch] text-[15px] leading-relaxed text-foreground/75">
                Chaque piece est pensee comme une uniforme de ville: coupe
                directe, confort reel, finitions propres. Les quantites restent
                limitees pour eviter le surplus et garder le drop desirable.
              </p>
              <dl className="mt-10 grid grid-cols-3 gap-6">
                {[
                  { k: "Drops", v: "04/an" },
                  { k: "Unites", v: "< 8k" },
                  { k: "Surplus", v: "Limite" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="label-eyebrow">{s.k}</dt>
                    <dd className="mt-2 font-serif text-2xl md:text-3xl">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Stockists */}
        <section id="stockists" className="py-20 md:py-28">
          <Container>
            <div className="flex items-end justify-between gap-6 mb-12">
              <div>
                <p className="label-eyebrow">Presence</p>
                <h2 className="mt-5 font-serif text-[36px] md:text-[52px] leading-[1] tracking-tight max-w-[18ch]">
                  Ou nous rencontrer, hors ligne.
                </h2>
              </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2 border-t border-border">
              {[
                ["Casablanca", "Studio Pyro", "Essayage prive sur rendez-vous"],
                ["Rabat", "Drop ponctuel", "Activation capsule a annoncer"],
                ["Marrakech", "Showroom invite", "Sessions limitees selon campagne"],
                ["Tanger", "Livraison express", "Commande confirmee par telephone"],
                ["Agadir", "Livraison express", "Selection online + support client"],
                ["Fes", "Livraison express", "Selection online + support client"],
              ].map(([city, name, addr]) => (
                <li
                  key={city + name}
                  className="grid grid-cols-[80px_1fr] items-start gap-4 border-b border-border py-4"
                >
                  <p className="label-eyebrow">{city}</p>
                  <div>
                    <p className="text-[14px] font-medium">{name}</p>
                    <p className="text-[12.5px] text-smoke">{addr}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <Container className="py-20 md:py-32 text-center">
            <p className="label-eyebrow">Acces prive</p>
            <h2 className="mt-6 font-serif text-[40px] md:text-[72px] leading-[0.95] tracking-tight text-balance max-w-[22ch] mx-auto">
              Entre avant le prochain drop.
            </h2>
            <p className="mt-5 text-[14px] text-smoke max-w-md mx-auto leading-relaxed">
              Les abonnes recoivent 48h d&apos;acces prive avant la mise en ligne
              publique.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-foreground text-background px-8 py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-graphite"
              >
                Voir le drop actuel
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
