import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <LegalArticle
      eyebrow="House"
      title="Contact."
      intro="Pyro Wear est une petite equipe basee a Casablanca. Nous lisons chaque message et repondons generalement sous un jour ouvre."
      sections={[
        {
          heading: "Service client",
          body: [
            "care@pyrowear.example — commandes, livraison, retours, tailles.",
          ],
        },
        {
          heading: "Wholesale & presse",
          body: [
            "wholesale@pyrowear.example — stockists, presse, collaborations.",
          ],
        },
        {
          heading: "Atelier",
          body: [
            "Pyro Wear, Casablanca, Maroc.",
            "Essayage et showroom prive sur rendez-vous.",
          ],
        },
      ]}
    />
  )
}
