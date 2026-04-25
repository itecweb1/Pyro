import type { Product } from "@/lib/types"
import { ProductCard } from "@/components/product-card"

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[]
  columns?: 2 | 3 | 4
}) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 3
        ? "md:grid-cols-2 lg:grid-cols-3"
        : "md:grid-cols-2 lg:grid-cols-4"

  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-6 md:gap-y-14 ${cols}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  )
}
