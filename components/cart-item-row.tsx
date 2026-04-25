"use client"

import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { Minus, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/format"
import { removeCartItem, updateCartItem } from "@/app/actions/cart"
import type { CartItemWithProduct } from "@/lib/types"

export function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const [pending, startTransition] = useTransition()
  const image = item.product.images[0]?.url ?? "/placeholder.svg"
  const variantLabel = [item.variant?.size, item.variant?.color]
    .filter(Boolean)
    .join(" - ")

  const submit = (quantity: number) => {
    const fd = new FormData()
    fd.set("id", item.id)
    fd.set("quantity", String(quantity))
    startTransition(async () => {
      await updateCartItem(fd)
    })
  }

  const remove = () => {
    const fd = new FormData()
    fd.set("id", item.id)
    startTransition(async () => {
      await removeCartItem(fd)
    })
  }

  return (
    <li
      className={cn(
        "grid grid-cols-[96px_1fr] gap-4 py-6 border-b border-border md:grid-cols-[120px_1fr_auto] md:gap-6",
        pending && "opacity-60",
      )}
    >
      <Link
        href={`/product/${item.product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-secondary"
      >
        <Image
          src={image}
          alt={item.product.name}
          fill
          sizes="120px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/product/${item.product.slug}`}
                className="text-[14px] font-medium hover:text-smoke"
              >
                {item.product.name}
              </Link>
              <p className="mt-1 text-[12px] text-smoke">
                {variantLabel || "Taille unique"}
              </p>
            </div>
            <button
              onClick={remove}
              aria-label="Retirer l'article"
              className="shrink-0 inline-flex size-8 items-center justify-center hover:text-destructive md:hidden"
            >
              <X className="size-4" strokeWidth={1.4} />
            </button>
          </div>
          <p className="mt-2 text-[13px] tabular-nums md:hidden">
            {formatPrice(
              item.product.price_cents * item.quantity,
              item.product.currency,
            )}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="inline-flex items-center border border-border">
            <button
              onClick={() => submit(Math.max(1, item.quantity - 1))}
              aria-label="Diminuer la quantite"
              className="inline-flex size-9 items-center justify-center hover:bg-secondary"
            >
              <Minus className="size-3.5" strokeWidth={1.5} />
            </button>
            <span className="min-w-[28px] text-center text-[13px] tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => submit(item.quantity + 1)}
              aria-label="Augmenter la quantite"
              className="inline-flex size-9 items-center justify-center hover:bg-secondary"
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <button
            onClick={remove}
            className="hidden md:inline text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-destructive"
          >
            Retirer
          </button>
        </div>
      </div>

      <div className="hidden md:block text-right">
        <p className="text-[14px] font-medium tabular-nums">
          {formatPrice(
            item.product.price_cents * item.quantity,
            item.product.currency,
          )}
        </p>
        {item.quantity > 1 && (
          <p className="text-[11px] text-smoke tabular-nums mt-0.5">
            {formatPrice(item.product.price_cents, item.product.currency)} piece
          </p>
        )}
      </div>
    </li>
  )
}
