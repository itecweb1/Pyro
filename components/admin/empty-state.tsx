import Link from "next/link"
import * as React from "react"
import { type LucideIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

type CTA = {
  href: string
  label: string
}

type Props = {
  icon?: LucideIcon
  title: string
  description?: string
  cta?: CTA
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  cta,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className,
      )}
    >
      <Icon
        className="size-8 text-smoke"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <p className="font-serif text-xl text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-smoke">{description}</p>
      )}
      {cta && (
        <Link
          href={cta.href}
          className="mt-2 inline-flex items-center gap-2 border border-border px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] hover:bg-secondary"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
