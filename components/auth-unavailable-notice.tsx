import Link from "next/link"
import { Clock3, PackageCheck, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type AuthUnavailableNoticeProps = {
  className?: string
  tone?: "customer" | "admin"
}

const content = {
  customer: {
    eyebrow: "Compte client",
    title: "Activation en cours",
    description:
      "Pyro reste ouvert partout au Maroc en paiement comptant a la livraison. L'espace client, la wishlist connectee et le suivi de commande seront actives des que Supabase sera branche.",
    items: [
      {
        icon: PackageCheck,
        label: "Commande possible sans compte",
      },
      {
        icon: ShieldCheck,
        label: "Paiement a la livraison deja actif",
      },
      {
        icon: Clock3,
        label: "Connexion client bientot disponible",
      },
    ],
  },
  admin: {
    eyebrow: "Back office",
    title: "Connexion admin en attente",
    description:
      "Le dashboard complet s'activera des que Supabase sera relie au projet. En attendant, le front Pyro reste navigable en mode fallback local.",
    items: [
      {
        icon: PackageCheck,
        label: "Catalogue public deja accessible",
      },
      {
        icon: ShieldCheck,
        label: "Checkout COD deja en place",
      },
      {
        icon: Clock3,
        label: "Auth admin a activer apres setup",
      },
    ],
  },
} as const

export function AuthUnavailableNotice({
  className,
  tone = "customer",
}: AuthUnavailableNoticeProps) {
  const block = content[tone]

  return (
    <section
      className={cn(
        "border border-border bg-muted/35 p-5 md:p-6",
        className,
      )}
    >
      <p className="label-eyebrow">{block.eyebrow}</p>
      <h2 className="mt-3 font-serif text-[28px] leading-none tracking-tight">
        {block.title}
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-smoke">
        {block.description}
      </p>

      <ul className="mt-5 grid gap-3 text-[12px] text-foreground sm:grid-cols-3">
        {block.items.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-start gap-3 border border-border/70 bg-background/70 p-3"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-smoke" strokeWidth={1.7} />
            <span className="leading-relaxed">{label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-foreground px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-background hover:bg-graphite"
        >
          Voir la boutique
        </Link>
        <Link
          href="/legal/shipping"
          className="inline-flex items-center justify-center border border-border px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-foreground hover:border-foreground"
        >
          Livraison Maroc
        </Link>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-smoke">
        Pour activer l&apos;inscription et la connexion en local, renseigne{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </p>
    </section>
  )
}
