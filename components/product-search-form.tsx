import { Search } from "lucide-react"

export function ProductSearchForm({
  query,
  sort,
}: {
  query?: string
  sort?: string
}) {
  return (
    <form
      action="/shop"
      className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end"
    >
      <label className="flex flex-col gap-2">
        <span className="label-eyebrow">Recherche</span>
        <span className="flex h-12 items-center border border-border bg-background px-4 focus-within:border-foreground">
          <Search className="mr-3 size-4 text-smoke" strokeWidth={1.4} />
          <input
            name="q"
            defaultValue={query}
            placeholder="Cargo, hoodie, overshirt..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-smoke/70"
          />
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <span className="label-eyebrow">Tri</span>
        <select
          name="sort"
          defaultValue={sort ?? "featured"}
          className="h-12 border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
        >
          <option value="featured">Selection Pyro</option>
          <option value="newest">Nouveautes</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix decroissant</option>
        </select>
      </label>

      <button
        type="submit"
        className="h-12 bg-foreground px-6 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-graphite"
      >
        Filtrer
      </button>
    </form>
  )
}
