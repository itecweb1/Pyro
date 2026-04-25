import * as React from "react"
import { cn } from "@/lib/utils"

type Tone = "default" | "danger" | "muted"

const TONES: Record<Tone, string> = {
  default: "border-border bg-background",
  danger: "border-danger-200 bg-danger-50/30",
  muted: "border-border bg-secondary/40",
}

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tone?: Tone
  /** Adds a subtle hover lift. Use on clickable cards. */
  interactive?: boolean
  padding?: "none" | "sm" | "md" | "lg"
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function Card({
  tone = "default",
  interactive = false,
  padding = "md",
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "border transition-all duration-150",
        TONES[tone],
        PADDING[padding],
        interactive &&
          "hover:-translate-y-0.5 hover:shadow-[0_2px_12px_-4px_rgb(0_0_0/0.08)]",
        className,
      )}
      {...rest}
    />
  )
}

export function CardHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3", className)} {...rest} />
}

export function CardEyebrow({
  className,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("label-eyebrow", className)} {...rest} />
}

export function CardTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("mt-2 text-lg font-medium leading-tight", className)}
      {...rest}
    />
  )
}
