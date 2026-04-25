import Link from "next/link"
import { Container } from "@/components/container"
import { AdminNav } from "@/components/admin/admin-nav"
import { Toaster } from "@/components/ui/sonner"
import { signOut } from "@/app/actions/auth"

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode
  email?: string | null
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <Container>
          <div className="flex min-h-16 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                href="/admin"
                className="text-[13px] font-semibold uppercase tracking-[0.28em]"
              >
                Pyro Admin
              </Link>
              <p className="mt-1 text-[11px] text-smoke">{email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
              >
                Voir le site
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
                >
                  Deconnexion
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <AdminNav />
          </aside>
          <main>{children}</main>
        </div>
      </Container>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ className: "font-sans" }}
      />
    </div>
  )
}
