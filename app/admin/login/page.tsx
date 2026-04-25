import Link from "next/link"
import { LockKeyhole } from "lucide-react"
import { AuthUnavailableNotice } from "@/components/auth-unavailable-notice"
import { Container } from "@/components/container"
import { hasSupabaseEnv } from "@/lib/supabase/config"
import { Wordmark } from "@/components/wordmark"

export const metadata = { title: "Admin login" }

export default function AdminLoginPage() {
  const authEnabled = hasSupabaseEnv()

  return (
    <main className="min-h-screen bg-foreground text-background">
      <Container className="flex min-h-screen flex-col justify-between py-8">
        <header className="flex items-center justify-between">
          <Wordmark className="text-background [&_span]:text-background" />
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.22em] text-background/65 hover:text-background"
          >
            Retour site
          </Link>
        </header>

        <section className="mx-auto w-full max-w-lg py-20">
          <LockKeyhole className="size-7 text-background/60" strokeWidth={1.2} />
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.24em] text-background/60">
            Acces admin
          </p>
          <h1 className="mt-5 font-serif text-[48px] leading-[0.95] tracking-tight md:text-[72px]">
            Dashboard Pyro.
          </h1>
          <p className="mt-5 text-[14px] leading-relaxed text-background/70">
            L&apos;admin utilise l&apos;auth Supabase du site. Connecte-toi avec
            un email present dans <code>ADMIN_EMAILS</code> ou un profil role
            admin.
          </p>
          {authEnabled ? (
            <Link
              href="/auth/login?next=/admin"
              className="mt-8 inline-flex bg-background px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground"
            >
              Se connecter
            </Link>
          ) : (
            <div className="mt-8">
              <AuthUnavailableNotice tone="admin" />
            </div>
          )}
        </section>

        <footer className="text-[10.5px] uppercase tracking-[0.28em] text-background/45">
          Pyro Wear back office
        </footer>
      </Container>
    </main>
  )
}
