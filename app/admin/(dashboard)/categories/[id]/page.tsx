import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { Breadcrumbs } from "@/components/admin/breadcrumbs"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { ImageInput } from "@/components/admin/image-input"
import { SubmitButton } from "@/components/admin/submit-button"
import { deleteCategory, updateCategory } from "@/app/admin/actions"
import { getAdminCategoryById } from "@/lib/admin"

export const metadata = { title: "Éditer catégorie" }

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getAdminCategoryById(id)
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !category) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Catégories", href: "/admin/categories" },
            { label: category?.name ?? "—" },
          ]}
        />
        <h1 className="font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          {category?.name ?? "Catégorie"}.
        </h1>
      </header>

      {!configured && <AdminSetupNotice />}

      {category && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form action={updateCategory} className="border border-border p-5 md:p-6">
            <input type="hidden" name="id" value={category.id} />
            <h2 className="label-eyebrow">Données catégorie</h2>
            <div className="mt-6 grid gap-4">
              <Input
                name="name"
                label="Nom"
                required
                defaultValue={category.name}
              />
              <Input
                name="slug"
                label="Slug URL"
                defaultValue={category.slug}
                placeholder="laisser vide pour générer depuis le nom"
              />
              <ImageInput
                name="file"
                label="Image (fichier)"
                currentUrl={category.image_url}
              />
              <Input
                name="image_url"
                label="…ou URL externe"
                defaultValue={category.image_url ?? ""}
              />
              <Input
                name="sort_order"
                label="Ordre d'affichage"
                type="number"
                min="0"
                step="1"
                defaultValue={String(category.sort_order ?? 0)}
              />
              <Textarea
                name="description"
                label="Texte de la collection"
                defaultValue={category.description ?? ""}
              />
              <SubmitButton>Enregistrer</SubmitButton>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="border border-border p-5">
              <p className="label-eyebrow">Identifiant</p>
              <p className="mt-3 break-all font-mono text-xs text-smoke">
                {category.id}
              </p>
            </div>
            <div className="border border-border p-5">
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 mb-4 text-sm text-smoke">
                La suppression libère les produits de cette catégorie sans les
                supprimer.
              </p>
              <ConfirmDeleteForm
                action={deleteCategory}
                hidden={[{ name: "id", value: category.id }]}
                successMessage={`Catégorie "${category.name}" supprimée`}
                description={`Supprimer définitivement la catégorie "${category.name}" ?`}
                triggerLabel="Supprimer la catégorie"
                size="block"
                redirectTo="/admin/categories"
              />
            </div>
          </aside>
        </section>
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
        rows={4}
        className="border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
