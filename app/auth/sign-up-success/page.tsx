import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div>
      <Mail className="size-7 text-smoke" strokeWidth={1.2} />
      <p className="label-eyebrow mt-6">Presque termine</p>
      <h1 className="mt-4 font-serif text-[40px] md:text-[48px] leading-none tracking-tight">
        Verifie ta boite mail.
      </h1>
      <p className="mt-4 text-[14px] text-smoke leading-relaxed">
        Un email de confirmation vient de partir. Clique sur le lien pour
        activer ton compte, puis retrouve ton panier, tes commandes et tes
        adresses.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center bg-foreground text-background py-4 text-[11px] uppercase tracking-[0.24em] hover:bg-graphite"
        >
          Retour connexion
        </Link>
        <Link
          href="/shop"
          className="text-center text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground py-2"
        >
          Continuer la selection
        </Link>
      </div>
    </div>
  )
}
