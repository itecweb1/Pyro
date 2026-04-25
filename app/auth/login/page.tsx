"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthUnavailableNotice } from "@/components/auth-unavailable-notice"
import { createClient } from "@/lib/supabase/client"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get("next") ?? "/account"
  const authEnabled = hasSupabaseEnv()

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
      setError("La connexion client sera activee des que Supabase sera branche.")
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <div>
      <p className="label-eyebrow">Retour maison</p>
      <h1 className="mt-4 font-serif text-[40px] md:text-[48px] leading-none tracking-tight">
        Connexion.
      </h1>
      <p className="mt-3 text-[14px] text-smoke">
        Retrouve tes commandes, ton panier et ta wishlist Pyro.
      </p>

      {!authEnabled ? (
        <AuthUnavailableNotice className="mt-8" />
      ) : null}

      <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
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
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[11px] uppercase tracking-[0.22em] text-smoke"
            >
              Mot de passe
            </Label>
            {authEnabled ? (
              <Link
                href="/auth/login"
                className="text-[11px] text-smoke hover:text-foreground"
              >
                Oublie ?
              </Link>
            ) : null}
          </div>
          <Input
            id="password"
            type="password"
            required
            disabled={!authEnabled || loading}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-none border-0 border-b border-foreground/80 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
          />
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
            ? "Connexion bientot activee"
            : loading
              ? "Connexion..."
              : "Se connecter"}
        </button>

        {authEnabled ? (
          <p className="text-[13px] text-smoke text-center">
            Pas encore de compte ?{" "}
            <Link
              href={`/auth/sign-up?next=${encodeURIComponent(next)}`}
              className="text-foreground underline underline-offset-4 hover:text-smoke"
            >
              Creer un compte
            </Link>
          </p>
        ) : (
          <p className="text-[13px] text-smoke text-center">
            En attendant, la commande reste ouverte sans compte sur tout le
            Maroc.
          </p>
        )}
      </form>
    </div>
  )
}
