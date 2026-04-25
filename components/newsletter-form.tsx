"use client"

import { useTransition, useState } from "react"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { subscribeNewsletter } from "@/app/actions/cart"

export function NewsletterForm() {
  const [pending, startTransition] = useTransition()
  const [email, setEmail] = useState("")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          const res = await subscribeNewsletter(fd)
          if (res.ok) {
            toast.success(res.message)
            setEmail("")
          } else {
            toast.error(res.message)
          }
        })
      }}
      className="flex items-center border-b border-foreground/80 focus-within:border-foreground"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse email
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Ton email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent py-3 text-sm placeholder:text-smoke/70 outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 py-3 text-[11px] uppercase tracking-[0.22em] font-medium disabled:opacity-50"
      >
        {pending ? "Envoi" : "S'inscrire"}
        <ArrowRight className="size-3.5" strokeWidth={1.6} />
      </button>
    </form>
  )
}
