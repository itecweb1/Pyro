import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { toggleWishlist } from "@/app/actions/cart"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  const primary = product.images[0]?.url ?? "/placeholder.svg"
  const secondary = product.images[1]?.url
  const inStock = product.variants.some((v) => v.stock > 0)
  const onSale =
    product.compare_at_cents && product.compare_at_cents > product.price_cents

  return (
    <article className="group flex flex-col gap-3">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block" prefetch>
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
            <Image
              src={primary}
              alt={product.images[0]?.alt ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
            />
            {secondary && (
              <Image
                src={secondary}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}

            <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
              {onSale && (
                <span className="bg-foreground px-2 py-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-background">
                  Archive
                </span>
              )}
              {product.is_featured && !onSale && (
                <span className="border border-border bg-background/90 px-2 py-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-foreground">
                  Essentiel
                </span>
              )}
              {!inStock && (
                <span className="border border-border bg-background/90 px-2 py-1 text-[9.5px] font-medium uppercase tracking-[0.22em] text-foreground">
                  Epuise
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.22em] text-smoke">
                  {product.variants.length} tailles
                </span>
                <span className="text-[10.5px] font-medium uppercase tracking-[0.22em]">
                  Voir la piece
                </span>
              </div>
            </div>
          </div>
        </Link>

        <form action={toggleWishlist} className="absolute right-3 top-3">
          <input type="hidden" name="productId" value={product.id} />
          <input
            type="hidden"
            name="redirectTo"
            value={`/product/${product.slug}`}
          />
          <button
            type="submit"
            aria-label="Ajouter a la wishlist"
            className="inline-flex size-9 items-center justify-center border border-border bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-foreground hover:text-background"
          >
            <Heart className="size-4" strokeWidth={1.4} />
          </button>
        </form>
      </div>

      <Link href={`/product/${product.slug}`} className="block" prefetch>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-medium tracking-tight">
              {product.name}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-smoke">
              {product.subtitle}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[13px] font-medium tabular-nums">
              {formatPrice(product.price_cents, product.currency)}
            </p>
            {onSale && product.compare_at_cents && (
              <p className="text-[11px] text-smoke line-through tabular-nums">
                {formatPrice(product.compare_at_cents, product.currency)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
