"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminNav } from "@/lib/content"

export function AdminNav() {
  const pathname = usePathname() ?? ""

  return (
    <nav className="grid gap-1 border border-border bg-secondary/30 p-2">
      {adminNav.map((item) => {
        // Active when the path matches exactly OR is a sub-route.
        // The dashboard root (/admin) only counts as active for an exact match.
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "border-l-2 px-4 py-3 text-[12px] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "border-foreground bg-background text-foreground"
                : "border-transparent text-foreground/75 hover:bg-background hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
