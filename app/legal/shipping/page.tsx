import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "Livraison" }

export default function ShippingPage() {
  return (
    <LegalArticle
      eyebrow="Service"
      title="Livraison."
      intro="Pyro Wear prepare les commandes pour le Maroc avec un fonctionnement simple: confirmation rapide, expedition nationale et paiement comptant a la livraison."
      sections={[
        {
          heading: "Tarifs",
          body: [
            "Maroc: 35 MAD en standard.",
            "Livraison offerte des 1000 MAD d'achat.",
            "Aucun frais additionnel sur le paiement a la livraison.",
          ],
        },
        {
          heading: "Delais",
          body: [
            "Casablanca: livraison generalement sous 24h ouvrables.",
            "Rabat, Sale, Kenitra, Marrakech, Tanger, Fes, Agadir et autres villes: 24 a 48h selon la zone.",
            "Les capsules tres demandees peuvent necessiter un delai supplementaire de preparation.",
          ],
        },
        {
          heading: "Confirmation",
          body: [
            "Un numero mobile joignable est recommande afin de confirmer la commande si necessaire.",
            "Le transporteur ou l'equipe Pyro peut contacter le client avant la remise du colis.",
            "Le paiement se fait comptant au moment de la reception.",
          ],
        },
      ]}
    />
  )
}
