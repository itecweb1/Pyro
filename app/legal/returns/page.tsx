import { LegalArticle } from "@/components/legal-article"

export const metadata = { title: "Retours" }

export default function ReturnsPage() {
  return (
    <LegalArticle
      eyebrow="Service"
      title="Retours."
      intro="Pyro Wear accepte les demandes d'echange ou de retour sur une fenetre courte et claire afin de garder un service rapide sur le marche marocain."
      sections={[
        {
          heading: "Conditions",
          body: [
            "La demande doit etre faite sous 7 jours apres reception du colis.",
            "La piece doit etre non portee, non lavee et retournee avec ses etiquettes.",
            "Les pieces en promotion finale ou endommagees apres reception ne sont pas eligibles.",
          ],
        },
        {
          heading: "Processus",
          body: [
            "Contacte le service client avec ta reference de commande pour lancer la demande.",
            "Un retour ou un echange est valide apres verification de l'etat de la piece.",
            "Pour une commande payee a la livraison, le remboursement est traite par virement bancaire ou avoir apres controle.",
          ],
        },
        {
          heading: "Echanges",
          body: [
            "L'echange de taille est la solution la plus rapide quand le stock est encore disponible.",
            "Si la taille souhaitee n'est plus en stock, l'equipe propose un avoir ou un remboursement selon le cas.",
          ],
        },
      ]}
    />
  )
}
