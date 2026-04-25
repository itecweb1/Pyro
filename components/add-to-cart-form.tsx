"use client"

import { useState, useTransition } from "react"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { addToCart } from "@/app/actions/cart"
import type { Product } from "@/lib/types"

export function AddToCartForm({
  product,
  redirectTo,
  deliveryNote,
}: {
  product: Product
  redirectTo: string
  deliveryNote: string
}) {
  const hasSizes = product.variants.some((v) => v.size && v.size !== "One Size")
  const defaultVariant = product.variants.find((v) => v.stock > 0) ?? product.variants[0]
  const [variantId, setVariantId] = useState<string | null>(
    hasSizes ? null : defaultVariant?.id ?? null,
  )
  const [pending, startTransition] = useTransition()

  const selected = product.variants.find((v) => v.id === variantId)
  const outOfStock = selected ? selected.stock === 0 : false

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!variantId) {
          toast.error("Choisis une taille d'abord.")
          return
        }
        const fd = new FormData()
        fd.set("productId", product.id)
        fd.set("variantId", variantId)
        fd.set("quantity", "1")
        fd.set("redirectTo", redirectTo)
        startTransition(async () => {
          const res = await addToCart(fd)
          if (res?.ok) toast.success("Ajoute au panier.")
          else if (res) toast.error(res.message)
        })
      }}
      className="flex flex-col gap-5"
    >
      {hasSizes && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="label-eyebrow">Taille</label>
            <button
              type="button"
              className="text-[11px] underline underline-offset-4 text-smoke hover:text-foreground"
            >
              Guide tailles
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {product.variants.map((v) => {
              const active = v.id === variantId
              const disabled = v.stock === 0
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "py-3 text-[12px] uppercase tracking-[0.14em] border transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                    disabled &&
                      "text-smoke line-through cursor-not-allowed hover:border-border bg-secondary/40",
                  )}
                >
                  {v.size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={pending || outOfStock || !variantId}
        className={cn(
          "group inline-flex items-center justify-center gap-3 w-full py-5 text-[11px] uppercase tracking-[0.24em] font-medium transition-colors",
          outOfStock
            ? "bg-secondary text-smoke cursor-not-allowed"
            : "bg-foreground text-background hover:bg-graphite",
          "disabled:opacity-60",
        )}
      >
        <ShoppingBag className="size-4" strokeWidth={1.4} />
        {pending
          ? "Ajout..."
          : outOfStock
            ? "Epuise"
            : variantId
              ? "Ajouter au panier"
              : "Choisir une taille"}
      </button>

      <p className="text-[11px] text-smoke leading-relaxed">
        {deliveryNote}
      </p>
    </form>
  )
}
