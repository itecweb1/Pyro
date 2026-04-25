import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buildListUrl, totalPages } from "@/lib/list-params"

type Props = {
  basePath: string
  /** Current full search-params (q, sort, dir, etc.) so prev/next links preserve them. */
  currentParams: Record<string, string | number | null | undefined>
  page: number
  pageSize: number
  total: number
  /** Plural-aware label, e.g. "produits", "commandes". */
  itemNoun?: string
}

export function Pagination({
  basePath,
  currentParams,
  page,
  pageSize,
  total,
  itemNoun = "résultats",
}: Props) {
  const last = totalPages(total, pageSize)
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const hasPrev = page > 1
  const hasNext = page < last

  const prevHref = buildListUrl(basePath, currentParams, { page: page - 1 })
  const nextHref = buildListUrl(basePath, currentParams, { page: page + 1 })

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-secondary/20 px-5 py-3 text-[12px] text-smoke">
      <p>
        {total === 0 ? (
          <>Aucun résultat</>
        ) : (
          <>
            <span className="font-medium tabular-nums text-foreground">
              {start.toLocaleString("fr-FR")}–{end.toLocaleString("fr-FR")}
            </span>{" "}
            sur{" "}
            <span className="font-medium tabular-nums text-foreground">
              {total.toLocaleString("fr-FR")}
            </span>{" "}
            {itemNoun}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={prevHref}
            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-3" strokeWidth={1.5} />
            Précédent
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 border border-border bg-background/50 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-smoke/50">
            <ChevronLeft className="size-3" strokeWidth={1.5} />
            Précédent
          </span>
        )}
        <span className="px-2 text-[11px] uppercase tracking-[0.18em]">
          Page <span className="tabular-nums text-foreground">{page}</span> /{" "}
          <span className="tabular-nums text-foreground">{last}</span>
        </span>
        {hasNext ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
          >
            Suivant
            <ChevronRight className="size-3" strokeWidth={1.5} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 border border-border bg-background/50 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-smoke/50">
            Suivant
            <ChevronRight className="size-3" strokeWidth={1.5} />
          </span>
        )}
      </div>
    </div>
  )
}
