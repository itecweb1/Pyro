import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { Breadcrumbs } from "@/components/admin/breadcrumbs"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { FormToast } from "@/components/admin/form-toast"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import {
  addProductImage,
  addProductVariant,
  deleteProduct,
  deleteProductImage,
  deleteProductVariant,
  updateProduct,
  updateVariantStock,
} from "@/app/admin/actions"
import { getAdminCategories, getAdminProductById } from "@/lib/admin"
import { formatPrice } from "@/lib/format"

export const metadata = { title: "Editer produit" }

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ])
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Produits", href: "/admin/products" },
            { label: product?.name ?? "—" },
          ]}
        />
        <h1 className="font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          {product?.name ?? "Produit"}.
        </h1>
        {product && (
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={product.is_active ? "active" : "draft"} />
            <span className="text-sm text-smoke">
              /{product.slug} ·{" "}
              {formatPrice(product.price_cents, product.currency)}
            </span>
          </div>
        )}
      </header>

      {!configured && <AdminSetupNotice />}

      {product && (
        <>
          <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
            <form
              action={updateProduct}
              className="border border-border p-5 md:p-6"
            >
              <input type="hidden" name="id" value={product.id} />
              <h2 className="label-eyebrow">Donnees produit</h2>
              <div className="mt-6 grid gap-4">
                <Input
                  name="name"
                  label="Nom"
                  required
                  defaultValue={product.name}
                />
                <Input
                  name="slug"
                  label="Slug (URL)"
                  defaultValue={product.slug}
                />
                <Input
                  name="subtitle"
                  label="Sous-titre"
                  defaultValue={product.subtitle ?? ""}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="price"
                    label="Prix MAD"
                    inputMode="decimal"
                    required
                    defaultValue={(product.price_cents / 100).toString()}
                  />
                  <Input
                    name="compare_at"
                    label="Ancien prix MAD"
                    inputMode="decimal"
                    defaultValue={
                      product.compare_at_cents != null
                        ? (product.compare_at_cents / 100).toString()
                        : ""
                    }
                  />
                </div>
                <label className="grid gap-2">
                  <span className="label-eyebrow">Categorie</span>
                  <select
                    name="category_id"
                    defaultValue={product.category_id ?? ""}
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
                <Textarea
                  name="description"
                  label="Description"
                  defaultValue={product.description ?? ""}
                />
                <Textarea
                  name="materials"
                  label="Matieres"
                  defaultValue={product.materials ?? ""}
                />
                <Textarea
                  name="care"
                  label="Entretien"
                  defaultValue={product.care ?? ""}
                />
                <div className="grid gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={product.is_active}
                    />
                    Actif
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      name="is_featured"
                      type="checkbox"
                      defaultChecked={product.is_featured}
                    />
                    Best seller / mise en avant
                  </label>
                </div>
                <SubmitButton>Enregistrer</SubmitButton>
              </div>
            </form>

            <aside className="space-y-4">
              <div className="border border-border p-5">
                <p className="label-eyebrow">Identifiant</p>
                <p className="mt-3 break-all font-mono text-xs text-smoke">
                  {product.id}
                </p>
              </div>
              <div className="border border-border p-5">
                <p className="label-eyebrow">Zone dangereuse</p>
                <p className="mt-3 mb-4 text-sm text-smoke">
                  Supprime le produit, ses images et toutes ses variantes.
                </p>
                <ConfirmDeleteForm
                  action={deleteProduct}
                  hidden={[{ name: "id", value: product.id }]}
                  successMessage={`Produit "${product.name}" supprimé`}
                  description={`Supprimer définitivement "${product.name}" ainsi que toutes ses images et variantes ?`}
                  triggerLabel="Supprimer le produit"
                  size="block"
                  redirectTo="/admin/products"
                />
              </div>
            </aside>
          </section>

          <section className="border border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <h2 className="label-eyebrow">Images ({product.images.length})</h2>
            </div>
            <ul className="divide-y divide-border">
              {product.images.map((image) => (
                <li
                  key={image.id}
                  className="grid items-center gap-4 p-5 md:grid-cols-[80px_1fr_120px_auto]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt ?? ""}
                    className="h-20 w-20 border border-border object-cover"
                  />
                  <div>
                    <p className="break-all font-mono text-xs text-smoke">
                      {image.url}
                    </p>
                    {image.alt && (
                      <p className="mt-1 text-sm">{image.alt}</p>
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Ordre {image.sort_order}
                  </p>
                  <ConfirmDeleteForm
                    action={deleteProductImage}
                    hidden={[
                      { name: "id", value: image.id },
                      { name: "product_id", value: product.id },
                    ]}
                    successMessage="Image supprimée"
                    description="Supprimer cette image du produit ?"
                    iconOnly
                  />
                </li>
              ))}
              {product.images.length === 0 && (
                <li className="p-5 text-sm text-smoke">Aucune image.</li>
              )}
            </ul>
            <form
              action={addProductImage}
              className="grid gap-4 border-t border-border p-5"
            >
              <input type="hidden" name="product_id" value={product.id} />
              <div className="grid gap-4 md:grid-cols-[1fr_220px_120px]">
                <label className="grid gap-2">
                  <span className="label-eyebrow">Fichier</span>
                  <input
                    name="file"
                    type="file"
                    accept="image/*"
                    className="border border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-[11px] file:uppercase file:tracking-[0.22em] file:text-background"
                  />
                </label>
                <Input name="alt" label="Alt" defaultValue={product.name} />
                <Input
                  name="sort_order"
                  label="Ordre"
                  inputMode="numeric"
                  defaultValue={String(product.images.length)}
                />
              </div>
              <Input
                name="url"
                label="ou coller une URL externe"
                placeholder="https://..."
              />
              <div className="justify-self-start">
                <SubmitButton pendingLabel="Ajout…">Ajouter</SubmitButton>
              </div>
            </form>
          </section>

          <section className="border border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <h2 className="label-eyebrow">
                Variantes ({product.variants.length}) · Stock total{" "}
                {product.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)}
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {product.variants.map((variant) => (
                <li
                  key={variant.id}
                  className="grid items-center gap-4 p-5 md:grid-cols-[1fr_1fr_1.4fr_140px_auto_auto]"
                >
                  <p className="font-medium">
                    {variant.size ?? "—"}
                  </p>
                  <p className="text-sm text-smoke">{variant.color ?? "—"}</p>
                  <p className="break-all font-mono text-xs text-smoke">
                    {variant.sku ?? "—"}
                  </p>
                  <FormToast
                    action={updateVariantStock}
                    successMessage="Stock mis à jour"
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={variant.id} />
                    <input
                      type="hidden"
                      name="product_id"
                      value={product.id}
                    />
                    <input
                      name="stock"
                      type="number"
                      min={0}
                      defaultValue={variant.stock}
                      className="h-11 w-24 border border-border bg-background px-3 text-sm"
                    />
                    <SubmitButton variant="secondary" pendingLabel="…">
                      OK
                    </SubmitButton>
                  </FormToast>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                    Stock
                  </span>
                  <ConfirmDeleteForm
                    action={deleteProductVariant}
                    hidden={[
                      { name: "id", value: variant.id },
                      { name: "product_id", value: product.id },
                    ]}
                    successMessage="Variante supprimée"
                    description={`Supprimer la variante ${variant.size ?? ""} ${variant.color ?? ""} ?`}
                    iconOnly
                  />
                </li>
              ))}
              {product.variants.length === 0 && (
                <li className="p-5 text-sm text-smoke">Aucune variante.</li>
              )}
            </ul>
            <form
              action={addProductVariant}
              className="grid gap-4 border-t border-border p-5 md:grid-cols-[1fr_1fr_1.4fr_140px_auto] md:items-end"
            >
              <input type="hidden" name="product_id" value={product.id} />
              <Input name="size" label="Taille" placeholder="M" />
              <Input
                name="color"
                label="Couleur"
                placeholder="Noir graphite"
              />
              <Input name="sku" label="SKU (auto si vide)" />
              <Input
                name="stock"
                label="Stock"
                inputMode="numeric"
                defaultValue="0"
              />
              <SubmitButton pendingLabel="Ajout…">Ajouter</SubmitButton>
            </form>
          </section>
        </>
      )}
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
