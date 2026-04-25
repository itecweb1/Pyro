import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type Crumb =
  | { label: string; href: string }
  | { label: string; href?: never }

type Props = {
  items: Crumb[]
  className?: string
}

/**
 * Breadcrumb trail. The last item is rendered as the current page (no link).
 * Pass items in order: e.g. [{label: "Admin", href: "/admin"}, {label: "Produits", href: "/admin/products"}, {label: product.name}]
 */
export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-smoke",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-foreground"
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                className="size-3 text-smoke/60"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </span>
        )
      })}
    </nav>
  )
}
