import Link from "next/link"
import { cn } from "@/lib/utils"

export function Wordmark({
  className,
  variant = "full",
}: {
  className?: string
  variant?: "full" | "mark"
}) {
  return (
    <Link
      href="/"
      aria-label="Pyro Wear home"
      className={cn(
        "inline-flex items-baseline gap-[2px] font-sans uppercase tracking-[0.08em] select-none",
        className,
      )}
    >
      {variant === "full" ? (
        <>
          <span className="text-[15px] font-semibold leading-none">PYRO</span>
          <span className="text-[15px] font-light leading-none text-smoke">
            WEAR
          </span>
          <span
            aria-hidden
            className="ml-1 inline-block h-[6px] w-[6px] translate-y-[-1px] bg-foreground"
          />
        </>
      ) : (
        <span className="text-[15px] font-semibold leading-none">PW</span>
      )}
    </Link>
  )
}
