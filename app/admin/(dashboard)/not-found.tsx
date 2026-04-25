import Link from "next/link"
import { FileQuestion } from "lucide-react"

export const metadata = { title: "Introuvable" }

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <FileQuestion
        className="size-12 text-smoke"
        strokeWidth={1.1}
        aria-hidden="true"
      />
      <p className="label-eyebrow">404 — Introuvable</p>
      <h1 className="font-serif text-[44px] leading-none tracking-tight md:text-[56px]">
        Cette ressource n&apos;existe pas.
      </h1>
      <p className="max-w-md text-sm text-smoke">
        L&apos;élément a peut-être été supprimé, déplacé, ou le lien est
        incorrect. Retour au tableau de bord pour reprendre.
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90"
        >
          Retour au dashboard
        </Link>
        <Link
          href="/admin/orders"
          className="border border-border px-5 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Voir les commandes
        </Link>
      </div>
    </div>
  )
}
