import Link from "next/link"
import { AlertTriangle } from "lucide-react"

type Search = Promise<{ error?: string }>

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Search
}) {
  const { error } = await searchParams
  return (
    <div>
      <AlertTriangle className="size-7 text-destructive" strokeWidth={1.2} />
      <p className="label-eyebrow mt-6">Erreur authentification</p>
      <h1 className="mt-4 font-serif text-[40px] md:text-[48px] leading-none tracking-tight">
        Connexion impossible.
      </h1>
      {error && (
        <p className="mt-4 text-[13px] text-smoke leading-relaxed border-l-2 border-destructive pl-3">
          {error}
        </p>
      )}
      <Link
        href="/auth/login"
        className="mt-8 inline-flex items-center justify-center bg-foreground text-background px-6 py-4 text-[11px] uppercase tracking-[0.24em] hover:bg-graphite"
      >
        Reessayer
      </Link>
    </div>
  )
}
