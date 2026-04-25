/**
 * Helpers for parsing/serializing list-page URL params (search, sort, pagination, status filter).
 * Used by every admin list page so the URL is the single source of truth.
 */

export type SortDir = "asc" | "desc"

export type ListParams<TSortField extends string = string> = {
  page: number
  q: string
  sort: TSortField | null
  dir: SortDir
  status: string | null
}

export const DEFAULT_PAGE_SIZE = 25

/**
 * Parse Next.js searchParams (record-of-strings-or-arrays) into a typed ListParams.
 * Whitelist allowed sort fields to prevent SQL injection.
 */
export function parseListParams<TSortField extends string>(
  searchParams: Record<string, string | string[] | undefined>,
  options: {
    allowedSorts: readonly TSortField[]
    defaultSort?: TSortField
    defaultDir?: SortDir
  },
): ListParams<TSortField> {
  const first = (key: string) => {
    const v = searchParams[key]
    return Array.isArray(v) ? v[0] : v
  }

  const pageRaw = Number(first("page") ?? 1)
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1

  const q = (first("q") ?? "").trim()

  const sortRaw = first("sort") ?? options.defaultSort ?? null
  const sort =
    sortRaw && options.allowedSorts.includes(sortRaw as TSortField)
      ? (sortRaw as TSortField)
      : (options.defaultSort ?? null)

  const dirRaw = first("dir")
  const dir: SortDir =
    dirRaw === "asc" || dirRaw === "desc"
      ? dirRaw
      : (options.defaultDir ?? "desc")

  const status = first("status") ?? null

  return { page, q, sort, dir, status }
}

/**
 * Build a URL with merged query params. Pass `null` to drop a key.
 * Resets page to 1 when changing sort/q/status.
 */
export function buildListUrl(
  basePath: string,
  current: Record<string, string | number | null | undefined>,
  next: Record<string, string | number | null | undefined>,
): string {
  const merged: Record<string, string | number | null | undefined> = {
    ...current,
    ...next,
  }

  // If filters changed (anything but `page`), reset page to 1.
  const filterChanged = Object.keys(next).some((k) => k !== "page")
  if (filterChanged && !("page" in next)) {
    merged.page = 1
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(merged)) {
    if (value === null || value === undefined || value === "") continue
    if (typeof value === "number" && value === 1 && key === "page") continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function totalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize))
}
