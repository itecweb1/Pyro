import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { deleteCategory, updateCategory } from "@/app/admin/actions"
import { getAdminCategoryById } from "@/lib/admin"

export const metadata = { title: "Editer categorie" }

async function deleteCategoryAndRedirect(formData: FormData) {
  "use server"
  await deleteCategory(formData)
  redirect("/admin/categories")
}

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
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Merchandising</p>
          <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
            Editer categorie.
          </h1>
        </div>
        <Link
          href="/admin/categories"
          className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Retour
        </Link>
      </header>

      {!configured && <AdminSetupNotice />}

      {category && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form action={updateCategory} className="border border-border p-5 md:p-6">
            <input type="hidden" name="id" value={category.id} />
            <h2 className="label-eyebrow">Donnees categorie</h2>
            <div className="mt-6 grid gap-4">
              <Input
                name="name"
                label="Nom"
                required
                defaultValue={category.name}
              />
              <Input name="slug" label="Slug (URL)" defaultValue={category.slug} />
              <label className="grid gap-2">
                <span className="label-eyebrow">Nouvelle image (fichier)</span>
                <input
                  name="file"
                  type="file"
                  accept="image/*"
                  className="border border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-[11px] file:uppercase file:tracking-[0.22em] file:text-background"
                />
              </label>
              <Input
                name="image_url"
                label="Image URL existante"
                defaultValue={category.image_url ?? ""}
              />
              <Input
                name="sort_order"
                label="Ordre"
                inputMode="numeric"
                defaultValue={String(category.sort_order ?? 0)}
              />
              <Textarea
                name="description"
                label="Texte collection"
                defaultValue={category.description ?? ""}
              />
              <button
                type="submit"
                className="bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background"
              >
                Enregistrer
              </button>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="border border-border p-5">
              <p className="label-eyebrow">Identifiant</p>
              <p className="mt-3 break-all font-mono text-xs text-smoke">
                {category.id}
              </p>
            </div>
            <form
              action={deleteCategoryAndRedirect}
              className="border border-border p-5"
            >
              <input type="hidden" name="id" value={category.id} />
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 text-sm text-smoke">
                La suppression libere les produits de cette categorie sans les
                supprimer.
              </p>
              <button
                type="submit"
                className="mt-4 w-full border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
              >
                Supprimer la categorie
              </button>
            </form>
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
        rows={4}
        className="border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  )
}
