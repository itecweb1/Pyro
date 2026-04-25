import Link from "next/link"
import { Package, Pencil } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import { createProduct, deleteProduct } from "@/app/admin/actions"
import { getAdminCategories, getAdminProducts } from "@/lib/admin"
import { formatPrice } from "@/lib/format"

export const metadata = { title: "Admin produits" }

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ])
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

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
          <h2 className="label-eyebrow">Creer une piece</h2>
          <div className="mt-6 grid gap-4">
            <Input name="name" label="Nom produit" required />
            <Input name="subtitle" label="Sous-titre" />
            <Input name="price" label="Prix MAD" inputMode="decimal" required />
            <Input name="compare_at" label="Ancien prix MAD" inputMode="decimal" />
            <label className="grid gap-2">
              <span className="label-eyebrow">Categorie</span>
              <select
                name="category_id"
                className="h-11 border border-border bg-background px-3 text-sm"
              >
                <option value="">Sans categorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <Input name="image_url" label="Image principale URL" />
            <Input name="sizes" label="Tailles" defaultValue="S,M,L,XL" />
            <Input name="color" label="Couleur" defaultValue="Noir graphite" />
            <Input name="stock" label="Stock par taille" inputMode="numeric" defaultValue="12" />
            <Textarea name="description" label="Description" />
            <Textarea name="materials" label="Matieres" />
            <Textarea name="care" label="Entretien" />
            <div className="grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input name="is_active" type="checkbox" defaultChecked />
                Actif
              </label>
              <label className="flex items-center gap-2">
                <input name="is_featured" type="checkbox" />
                Best seller / mise en avant
              </label>
            </div>
            <SubmitButton pendingLabel="Création…">Créer le produit</SubmitButton>
          </div>
        </form>

        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border text-[11px] uppercase tracking-[0.18em] text-smoke">
              <tr>
                <th className="p-4">Produit</th>
                <th className="p-4">Categorie</th>
                <th className="p-4">Prix</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
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
                    <EmptyState
                      icon={Package}
                      title="Aucun produit"
                      description="Crée ton premier produit en utilisant le formulaire à gauche."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
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
        className="border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  )
}
