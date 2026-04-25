"use client"

import Image from "next/image"
import { useState } from "react"
import type { ProductImage } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[]
  name: string
}) {
  const safeImages = images.length
    ? images
    : [{ id: "placeholder", url: "/placeholder.svg", alt: name, sort_order: 0 }]
  const [active, setActive] = useState(0)
  const current = safeImages[active]

  return (
    <div className="grid gap-3 md:grid-cols-[80px_1fr]">
      {/* thumbs */}
      <div className="order-2 flex gap-3 md:order-1 md:flex-col">
        {safeImages.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            aria-label={`Voir l'image ${i + 1}`}
            className={cn(
              "relative aspect-square w-20 shrink-0 overflow-hidden border",
              i === active
                ? "border-foreground"
                : "border-border hover:border-smoke",
            )}
          >
            <Image
              src={img.url}
              alt={img.alt ?? ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* main */}
      <div className="order-1 relative aspect-[4/5] overflow-hidden bg-secondary md:order-2">
        <Image
          src={current.url}
          alt={current.alt ?? name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}
