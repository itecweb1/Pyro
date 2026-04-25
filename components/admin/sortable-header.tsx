import Link from "next/link"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { buildListUrl, type SortDir } from "@/lib/list-params"

type Props = {
  basePath: string
  currentParams: Record<string, string | number | null | undefined>
  /** The sort key this header represents (e.g. "price"). */
  field: string
  /** The currently-active sort field from URL (or null). */
  activeField: string | null
  activeDir: SortDir
  children: React.ReactNode
  /** Extra th classes (e.g. text-right). */
  className?: string
}

/**
 * Renders a `<th>` whose label is a link that toggles sort direction (or
 * activates this column). Shows an arrow indicator for the active column.
 */
export function SortableHeader({
  basePath,
  currentParams,
  field,
  activeField,
  activeDir,
  children,
  className,
}: Props) {
  const isActive = activeField === field
  const nextDir: SortDir = isActive && activeDir === "desc" ? "asc" : "desc"
  const href = buildListUrl(basePath, currentParams, {
    sort: field,
    dir: nextDir,
  })

  const Icon = isActive ? (activeDir === "desc" ? ArrowDown : ArrowUp) : ArrowUpDown

  return (
    <th
      className={`p-4 text-[11px] uppercase tracking-[0.18em] text-smoke ${className ?? ""}`}
      aria-sort={
        isActive
          ? activeDir === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${
          isActive ? "text-foreground" : ""
        }`}
        scroll={false}
      >
        {children}
        <Icon
          className={`size-3 ${isActive ? "" : "opacity-40"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Link>
    </th>
  )
}
