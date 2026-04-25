"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthUnavailableNotice } from "@/components/auth-unavailable-notice"
import { createClient } from "@/lib/supabase/client"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  )
}

function SignUpForm() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get("next") ?? "/account"
  const authEnabled = hasSupabaseEnv()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!authEnabled) {
      setLoading(false)
      setError("L'inscription sera activee des que Supabase sera branche.")
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/auth/sign-up-success?next=${encodeURIComponent(next)}`)
  }

  return (
    <div>
      <p className="label-eyebrow">Entrer dans la maison</p>
      <h1 className="mt-4 font-serif text-[40px] md:text-[48px] leading-none tracking-tight">
        Creer un compte.
      </h1>
      <p className="mt-3 text-[14px] text-smoke">
        Acces prioritaire aux drops, paiement plus rapide, wishlist et suivi
        commande.
      </p>

      {!authEnabled ? (
        <AuthUnavailableNotice className="mt-8" />
      ) : null}

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="firstName"
              className="text-[11px] uppercase tracking-[0.22em] text-smoke"
            >
              Prenom
            </Label>
            <Input
              id="firstName"
              required
              disabled={!authEnabled || loading}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 rounded-none border-0 border-b border-foreground/80 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="lastName"
              className="text-[11px] uppercase tracking-[0.22em] text-smoke"
            >
              Nom
            </Label>
            <Input
              id="lastName"
              required
              disabled={!authEnabled || loading}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 rounded-none border-0 border-b border-foreground/80 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="email"
            className="text-[11px] uppercase tracking-[0.22em] text-smoke"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            disabled={!authEnabled || loading}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-none border-0 border-b border-foreground/80 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="password"
            className="text-[11px] uppercase tracking-[0.22em] text-smoke"
          >
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            required
            disabled={!authEnabled || loading}
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-none border-0 border-b border-foreground/80 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
          />
          <p className="text-[11px] text-smoke">Minimum 8 caracteres.</p>
        </div>

        {error && (
          <p
            role="alert"
            className="text-[13px] text-destructive border-l-2 border-destructive pl-3"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!authEnabled || loading}
          className="mt-2 inline-flex items-center justify-center bg-foreground text-background py-4 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-graphite disabled:opacity-60"
        >
          {!authEnabled
            ? "Inscription bientot activee"
            : loading
              ? "Creation..."
              : "Creer le compte"}
        </button>

        {authEnabled ? (
          <p className="text-[13px] text-smoke text-center">
            Deja inscrit ?{" "}
            <Link
              href={`/auth/login?next=${encodeURIComponent(next)}`}
              className="text-foreground underline underline-offset-4 hover:text-smoke"
            >
              Connexion
            </Link>
          </p>
        ) : (
          <p className="text-[13px] text-smoke text-center">
            Tu peux deja commander avec paiement a la livraison, meme sans
            compte client.
          </p>
        )}
      </form>
    </div>
  )
}
