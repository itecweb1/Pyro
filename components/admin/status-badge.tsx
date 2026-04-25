import { cn } from "@/lib/utils"

/**
 * Pyro status mapping. Each variant pairs:
 * - the French operator-facing label
 * - the semantic tone (drives background + dot color)
 *
 * DB values stay English — these labels are presentation-only.
 */
const VARIANTS = {
  // Order statuses
  pending: { label: "En attente", tone: "warning" },
  paid: { label: "Payé", tone: "success" },
  shipped: { label: "Expédié", tone: "info" },
  delivered: { label: "Livré", tone: "success" },
  cancelled: { label: "Annulé", tone: "neutral" },
  refunded: { label: "Remboursé", tone: "danger" },

  // Product / banner is_active
  active: { label: "Actif", tone: "success" },
  draft: { label: "Brouillon", tone: "neutral" },

  // Coupon flag
  inactive: { label: "Inactif", tone: "neutral" },

  // Sale price indicator
  sale: { label: "Promo", tone: "danger" },

  // Payment methods
  cod: { label: "Paiement livraison", tone: "warning" },
  card: { label: "Carte", tone: "info" },
} as const

export type StatusKey = keyof typeof VARIANTS

const TONES: Record<
  "success" | "warning" | "danger" | "info" | "neutral",
  { wrap: string; dot: string }
> = {
  success: {
    wrap: "bg-success-50 text-success-700 border-success-200",
    dot: "bg-success-600",
  },
  warning: {
    wrap: "bg-warning-50 text-warning-700 border-warning-200",
    dot: "bg-warning-600",
  },
  danger: {
    wrap: "bg-danger-50 text-danger-700 border-danger-200",
    dot: "bg-danger-600",
  },
  info: {
    wrap: "bg-info-50 text-info-700 border-info-200",
    dot: "bg-info-600",
  },
  neutral: {
    wrap: "bg-secondary text-foreground/70 border-border",
    dot: "bg-smoke",
  },
}

type Props = {
  status: StatusKey | string
  /** Override the auto-mapped label (rare). */
  label?: string
  className?: string
  /** Larger badge for headers/detail pages. */
  size?: "sm" | "md"
}

export function StatusBadge({ status, label, className, size = "sm" }: Props) {
  const variant =
    VARIANTS[status as StatusKey] ?? {
      label: status,
      tone: "neutral" as const,
    }
  const tone = TONES[variant.tone]
  const sizing =
    size === "md"
      ? "text-xs px-3 py-1.5"
      : "text-[10px] px-2 py-1"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-medium uppercase tracking-[0.14em]",
        tone.wrap,
        sizing,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", tone.dot)}
      />
      <span>{label ?? variant.label}</span>
    </span>
  )
}
