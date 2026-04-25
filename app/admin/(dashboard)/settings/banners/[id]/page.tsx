import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { deleteHeroBanner, updateHeroBanner } from "@/app/admin/actions"
import { getAdminHeroBannerById } from "@/lib/admin"

export const metadata = { title: "Editer hero banner" }

async function deleteBannerAndRedirect(formData: FormData) {
  "use server"
  await deleteHeroBanner(formData)
  redirect("/admin/settings")
}

export default async function AdminHeroBannerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const banner = await getAdminHeroBannerById(id)
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !banner) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Configuration</p>
          <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
            Editer banniere.
          </h1>
        </div>
        <Link
          href="/admin/settings"
          className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Retour
        </Link>
      </header>

      {!configured && <AdminSetupNotice />}

      {banner && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form
            action={updateHeroBanner}
            className="border border-border p-5 md:p-6"
          >
            <input type="hidden" name="id" value={banner.id} />
            <h2 className="label-eyebrow">Donnees banniere</h2>
            <div className="mt-6 grid gap-4">
              <Input
                name="title"
                label="Titre"
                required
                defaultValue={banner.title}
              />
              <Textarea
                name="subtitle"
                label="Sous-titre"
                defaultValue={banner.subtitle ?? ""}
              />
              <Input
                name="eyebrow"
                label="Eyebrow"
                defaultValue={banner.eyebrow ?? ""}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  name="cta_label"
                  label="CTA label"
                  defaultValue={banner.cta_label ?? ""}
                />
                <Input
                  name="cta_href"
                  label="CTA href"
                  defaultValue={banner.cta_href ?? ""}
                />
              </div>
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
                defaultValue={banner.image_url ?? ""}
              />
              <Input
                name="sort_order"
                label="Ordre"
                inputMode="numeric"
                defaultValue={String(banner.sort_order ?? 0)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={banner.is_active}
                />
                Active
              </label>
              <button
                type="submit"
                className="bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background"
              >
                Enregistrer
              </button>
            </div>
          </form>

          <aside className="space-y-4">
            {banner.image_url && (
              <div className="border border-border p-5">
                <p className="label-eyebrow">Image actuelle</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="mt-3 w-full border border-border object-cover"
                />
              </div>
            )}
            <form
              action={deleteBannerAndRedirect}
              className="border border-border p-5"
            >
              <input type="hidden" name="id" value={banner.id} />
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 text-sm text-smoke">
                Supprime definitivement la banniere de la homepage.
              </p>
              <button
                type="submit"
                className="mt-4 w-full border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
              >
                Supprimer la banniere
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
        rows={3}
        className="border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  )
}
