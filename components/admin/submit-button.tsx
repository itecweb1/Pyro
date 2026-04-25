"use client"

import { useFormStatus } from "react-dom"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string
  variant?: "primary" | "secondary"
}

const baseByVariant = {
  primary:
    "bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed",
}

export function SubmitButton({
  children,
  pendingLabel = "Enregistrement…",
  variant = "primary",
  className,
  ...rest
}: Props) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || rest.disabled}
      className={`${baseByVariant[variant]} ${className ?? ""}`}
      {...rest}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
