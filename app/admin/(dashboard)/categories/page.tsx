import Link from "next/link"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { createCategory, deleteCategory } from "@/app/admin/actions"
import { getAdminCategories } from "@/lib/admin"

export const metadata = { title: "Admin categories" }

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Merchandising</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Categories.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <form action={createCategory} className="border border-border p-6">
          <h2 className="label-eyebrow">Nouvelle categorie</h2>
          <div className="mt-6 grid gap-4">
            <Input name="name" label="Nom" required />
            <Input name="sort_order" label="Ordre" inputMode="numeric" defaultValue="0" />
            <label className="grid gap-2">
              <span className="label-eyebrow">Image (fichier)</span>
              <input
                name="file"
                type="file"
                accept="image/*"
                className="border border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-[11px] file:uppercase file:tracking-[0.22em] file:text-background"
              />
            </label>
            <Input name="image_url" label="ou URL externe" placeholder="https://..." />
            <Textarea name="description" label="Texte collection" />
            <button className="bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background">
              Creer
            </button>
          </div>
        </form>

        <div className="border border-border">
          {categories.map((category) => (
            <article
              key={category.id}
              className="grid gap-3 border-b border-border p-5 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
            >
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="mt-1 text-sm text-smoke">{category.description}</p>
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-smoke">
                /{category.slug}
              </p>
              <Link
                href={`/admin/categories/${category.id}`}
                className="border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
              >
                Editer
              </Link>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button
                  type="submit"
                  className="w-full border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
                >
                  Supprimer
                </button>
              </form>
            </article>
          ))}
          {categories.length === 0 && (
            <p className="p-5 text-sm text-smoke">Aucune categorie.</p>
          )}
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
        rows={4}
        className="border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  )
}
