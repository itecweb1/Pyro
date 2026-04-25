import Link from "next/link"
import { Wordmark } from "@/components/wordmark"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_1fr]">
      <aside
        aria-hidden
        className="hidden md:block relative overflow-hidden border-r border-border bg-[url('/products/hero-main.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 lg:p-14 text-background">
          <Wordmark className="text-background [&_span]:text-background" />
          <div>
            <p className="label-eyebrow text-background/70">Le rituel</p>
            <blockquote className="mt-4 font-serif text-[28px] lg:text-[34px] leading-tight tracking-tight max-w-[22ch] text-balance">
              &ldquo;Pyro Wear habille ceux qui veulent une presence nette, meme
              dans le silence.&rdquo;
            </blockquote>
            <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-background/70">
              - Studio Pyro
            </p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col">
        <header className="flex items-center justify-between p-6 md:p-10">
          <div className="md:hidden">
            <Wordmark />
          </div>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground ml-auto"
          >
            Retour boutique
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 pb-16 md:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
