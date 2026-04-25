import Link from "next/link"
import { buildListUrl } from "@/lib/list-params"
import { cn } from "@/lib/utils"

type Chip = {
  /** URL value, e.g. "pending" or null for "Tous". */
  value: string | null
  label: string
  /** Optional count badge. */
  count?: number
}

type Props = {
  basePath: string
  currentParams: Record<string, string | number | null | undefined>
  /** The active status from URL, or null for "Tous". */
  active: string | null
  chips: Chip[]
  className?: string
}

export function StatusFilterChips({
  basePath,
  currentParams,
  active,
  chips,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => {
        const isActive = chip.value === active
        const href = buildListUrl(basePath, currentParams, {
          status: chip.value,
        })
        return (
          <Link
            key={chip.label}
            href={href}
            scroll={false}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-2 border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-smoke hover:border-foreground/40 hover:text-foreground",
            )}
          >
            <span>{chip.label}</span>
            {typeof chip.count === "number" && (
              <span
                className={cn(
                  "tabular-nums text-[10px]",
                  isActive ? "text-background/70" : "text-smoke/60",
                )}
              >
                {chip.count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
