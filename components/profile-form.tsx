"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/actions/auth"

type Props = {
  initial: {
    first_name: string
    last_name: string
    phone: string
  }
}

export function ProfileForm({ initial }: Props) {
  const [values, setValues] = useState(initial)
  const [pending, startTransition] = useTransition()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(async () => {
          await updateProfile(fd)
          toast.success("Profil mis a jour.")
        })
      }}
      className="grid gap-5 md:grid-cols-2"
    >
      <Field label="Prenom" htmlFor="first_name">
        <Input
          id="first_name"
          name="first_name"
          value={values.first_name}
          onChange={(e) =>
            setValues((v) => ({ ...v, first_name: e.target.value }))
          }
          className="h-11 rounded-none border-0 border-b border-foreground/60 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
        />
      </Field>
      <Field label="Nom" htmlFor="last_name">
        <Input
          id="last_name"
          name="last_name"
          value={values.last_name}
          onChange={(e) =>
            setValues((v) => ({ ...v, last_name: e.target.value }))
          }
          className="h-11 rounded-none border-0 border-b border-foreground/60 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
        />
      </Field>
      <Field label="Telephone" htmlFor="phone" className="md:col-span-2">
        <Input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          className="h-11 rounded-none border-0 border-b border-foreground/60 bg-transparent px-0 focus-visible:border-foreground focus-visible:ring-0 shadow-none"
        />
      </Field>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center bg-foreground text-background px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:bg-graphite disabled:opacity-60"
        >
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Label
        htmlFor={htmlFor}
        className="text-[11px] uppercase tracking-[0.22em] text-smoke"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}
