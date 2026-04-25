"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "tertiary" | "danger"
type Size = "sm" | "md"

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "border border-border bg-background text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed",
  tertiary:
    "text-smoke hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "border border-danger-200 bg-danger-50 text-danger-700 hover:bg-danger-100 hover:text-danger-800 disabled:opacity-50 disabled:cursor-not-allowed",
}

const SIZES: Record<Size, string> = {
  sm: "px-3 py-2 text-[10px]",
  md: "px-5 py-3 text-[11px]",
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  /** Render as `<Slot>` so the styles apply to the child (e.g. wrapping a `<Link>`). */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    />
  )
})
