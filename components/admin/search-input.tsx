"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

type Props = {
  placeholder?: string
  /** ms before pushing the URL update. Defaults to 250. */
  debounceMs?: number
  className?: string
}

/**
 * Debounced search box that owns the `?q=` URL param. Resets `?page` on change.
 */
export function SearchInput({
  placeholder = "Rechercher…",
  debounceMs = 250,
  className,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get("q") ?? ""

  const [value, setValue] = useState(queryFromUrl)
  // Derived-state pattern: when URL changes externally (chip click, back nav),
  // resync the input. This avoids setState-in-effect.
  const [prevUrlQuery, setPrevUrlQuery] = useState(queryFromUrl)
  if (queryFromUrl !== prevUrlQuery) {
    setPrevUrlQuery(queryFromUrl)
    setValue(queryFromUrl)
  }

  // Debounced push to URL on local change.
  useEffect(() => {
    if (value === queryFromUrl) return
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (value) params.set("q", value)
      else params.delete("q")
      params.delete("page") // reset to page 1 on new search
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    }, debounceMs)
    return () => clearTimeout(t)
  }, [value, queryFromUrl, debounceMs, pathname, router, searchParams])

  return (
    <div
      className={`relative inline-flex items-center ${className ?? ""}`}
    >
      <Search
        className="pointer-events-none absolute left-3 size-4 text-smoke"
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full min-w-[260px] border border-border bg-background pl-9 pr-9 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Effacer la recherche"
          className="absolute right-2 inline-flex size-6 items-center justify-center text-smoke transition-colors hover:text-foreground"
        >
          <X className="size-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}
