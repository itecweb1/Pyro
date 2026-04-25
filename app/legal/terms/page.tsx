import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "CGV" }

export default function TermsPage() {
  return (
    <LegalArticle
      eyebrow="Legal"
      title="CGV."
      intro="En utilisant pyrowear.example et en passant commande, tu acceptes les conditions ci-dessous. Elles sont redigees pour le marche marocain et devront etre validees avant mise en production finale."
      sections={[
        {
          heading: "Commandes",
          body: [
            "Le passage de commande constitue une demande d'achat. La commande est confirmee apres verification des informations et disponibilites.",
            "Pyro Wear se reserve le droit d'annuler une commande en cas d'erreur evidente de prix, de stock ou de suspicion de fraude.",
          ],
        },
        {
          heading: "Prix",
          body: [
            "Les prix affiches sur le site sont en dirhams marocains (MAD).",
            "Les frais de livraison et les promotions applicables sont affiches avant validation de la commande.",
          ],
        },
        {
          heading: "Propriete intellectuelle",
          body: [
            "Les designs, photographies, textes et elements visuels du site restent la propriete de Pyro Wear.",
            "Toute reproduction ou exploitation sans autorisation ecrite est interdite.",
          ],
        },
        {
          heading: "Cadre juridique",
          body: [
            "La version finale des CGV et la juridiction applicable doivent etre confirmees selon l'entite legale qui exploitera Pyro Wear.",
            "Avant mise en production publique, cette section doit etre validee avec le conseil juridique de la marque.",
          ],
        },
      ]}
    />
  )
}
