import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Trend = {
  /** + or - prefixed string e.g. "+12%" / "-3" */
  value: string
  /** Drives color (success / danger / neutral). */
  direction?: "up" | "down" | "flat"
}

type Props = {
  label: string
  value: React.ReactNode
  /** Small caption under the value (e.g. "Sur 30 jours"). */
  hint?: string
  /** Eyebrow icon. */
  icon?: LucideIcon
  /** Optional trend pill (top-right). */
  trend?: Trend
  className?: string
}

const TREND_TONE = {
  up: "text-success-700 bg-success-50 border-success-200",
  down: "text-danger-700 bg-danger-50 border-danger-200",
  flat: "text-smoke bg-secondary border-border",
} as const

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "border border-border bg-background p-5 transition-colors hover:bg-secondary/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              className="size-4 text-smoke"
              strokeWidth={1.3}
              aria-hidden="true"
            />
          )}
          <p className="label-eyebrow">{label}</p>
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
              TREND_TONE[trend.direction ?? "flat"],
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 font-serif text-4xl tabular-nums leading-none">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-smoke">{hint}</p>}
    </article>
  )
}
