import Link from "next/link"
import { Package, Pencil } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { EmptyState } from "@/components/admin/empty-state"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { SortableHeader } from "@/components/admin/sortable-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import { createProduct, deleteProduct } from "@/app/admin/actions"
import { getAdminCategories, getAdminProducts } from "@/lib/admin"
import { formatPrice } from "@/lib/format"
import { parseListParams } from "@/lib/list-params"

export const metadata = { title: "Admin produits" }

const PAGE_SIZE = 20
const ALLOWED_SORTS = ["created_at", "name", "price_cents"] as const

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const params = parseListParams(sp, {
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "created_at",
    defaultDir: "desc",
  })

  const [{ rows: products, total }, categories] = await Promise.all([
    getAdminProducts({
      page: params.page,
      limit: PAGE_SIZE,
      q: params.q,
      sort: params.sort,
      dir: params.dir,
    }),
    getAdminCategories(),
  ])

  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const basePath = "/admin/products"
  const currentParams = {
    q: params.q || null,
    sort: params.sort,
    dir: params.dir,
    page: params.page > 1 ? params.page : null,
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Catalogue</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Produits.
        </h1>
      </header>

      {!configured && <AdminSetupNotice />}

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.4fr]">
        <form action={createProduct} className="border border-border p-5 md:p-6">
          <h2 className="label-eyebrow">Créer une pièce</h2>
          <div className="mt-6 grid gap-4">
            <Input name="name" label="Nom du produit" required />
            <Input name="subtitle" label="Sous-titre" />
            <Input
              name="price"
              label="Prix MAD"
              type="number"
              min="0"
              step="0.01"
              required
            />
            <Input
              name="compare_at"
              label="Ancien prix MAD (barré)"
              type="number"
              min="0"
              step="0.01"
            />
            <label className="grid gap-2">
              <span className="label-eyebrow">Catégorie</span>
              <select
                name="category_id"
                className="h-11 border border-border bg-background px-3 text-sm"
              >
                <option value="">Sans catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <Input
              name="image_url"
              label="Image principale (URL)"
              placeholder="https://…"
            />
            <Input
              name="sizes"
              label="Tailles (séparées par virgule)"
              defaultValue="S,M,L,XL"
            />
            <Input name="color" label="Couleur" defaultValue="Noir graphite" />
            <Input
              name="stock"
              label="Stock initial par taille"
              type="number"
              min="0"
              step="1"
              defaultValue="12"
            />
            <Textarea name="description" label="Description" />
            <Textarea name="materials" label="Matières" />
            <Textarea name="care" label="Entretien" />
            <div className="grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input name="is_active" type="checkbox" defaultChecked />
                Actif (visible sur la boutique)
              </label>
              <label className="flex items-center gap-2">
                <input name="is_featured" type="checkbox" />
                Mis en avant en homepage
              </label>
            </div>
            <SubmitButton pendingLabel="Création…">Créer le produit</SubmitButton>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchInput placeholder="Rechercher un produit…" />
            {params.q && (
              <p className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                {total} résultat{total > 1 ? "s" : ""} pour « {params.q} »
              </p>
            )}
          </div>

          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <SortableHeader
                    basePath={basePath}
                    currentParams={currentParams}
                    field="name"
                    activeField={params.sort}
                    activeDir={params.dir}
                  >
                    Produit
                  </SortableHeader>
                  <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Catégorie
                  </th>
                  <SortableHeader
                    basePath={basePath}
                    currentParams={currentParams}
                    field="price_cents"
                    activeField={params.sort}
                    activeDir={params.dir}
                  >
                    Prix
                  </SortableHeader>
                  <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Stock
                  </th>
                  <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Statut
                  </th>
                  <th className="p-4 text-right text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-secondary/40"
                  >
                    <td className="p-4">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-smoke">/{product.slug}</p>
                    </td>
                    <td className="p-4 text-smoke">
                      {Array.isArray(product.category)
                        ? product.category[0]?.name
                        : product.category?.name ?? "-"}
                    </td>
                    <td className="p-4 tabular-nums">
                      {formatPrice(product.price_cents, product.currency)}
                    </td>
                    <td className="p-4 tabular-nums">
                      {(product.variants ?? []).reduce(
                        (sum, variant) => sum + (variant.stock ?? 0),
                        0,
                      )}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={product.is_active ? "active" : "draft"} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
                        >
                          <Pencil className="size-3" strokeWidth={1.5} />
                          Editer
                        </Link>
                        <ConfirmDeleteForm
                          action={deleteProduct}
                          hidden={[{ name: "id", value: product.id }]}
                          successMessage={`Produit "${product.name}" supprimé`}
                          description={`Supprimer "${product.name}" ? Toutes ses images et variantes seront supprimées.`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      {params.q ? (
                        <EmptyState
                          icon={Package}
                          title="Aucun résultat"
                          description={`Aucun produit ne correspond à « ${params.q} ».`}
                        />
                      ) : (
                        <EmptyState
                          icon={Package}
                          title="Aucun produit"
                          description="Crée ton premier produit en utilisant le formulaire à gauche."
                        />
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              basePath={basePath}
              currentParams={currentParams}
              page={params.page}
              pageSize={PAGE_SIZE}
              total={total}
              itemNoun="produits"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="label-eyebrow">{label}</span>
      <input
        {...props}
        className="h-11 border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}

function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="label-eyebrow">{label}</span>
      <textarea
        {...props}
        rows={3}
        className="border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
