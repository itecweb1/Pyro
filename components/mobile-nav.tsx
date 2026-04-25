"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Wordmark } from "@/components/wordmark"

export function MobileNav({
  nav,
  isAuthed,
  children,
}: {
  nav: { href: string; label: string }[]
  isAuthed: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-full max-w-[360px] border-r border-border bg-background p-0"
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <Wordmark />
        </div>
        <nav aria-label="Mobile" className="flex flex-col py-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-6 py-4 text-[13px] uppercase tracking-[0.22em] border-b border-border hover:bg-secondary/60"
            >
              {item.label}
              <span aria-hidden className="text-smoke">-&gt;</span>
            </Link>
          ))}
        </nav>
        <div className="px-6 py-6 flex flex-col gap-3">
          <Link
            href={isAuthed ? "/account" : "/auth/login"}
            onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
          >
            {isAuthed ? "Mon compte" : "Connexion"}
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
          >
            Panier
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
