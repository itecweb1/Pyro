import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { Breadcrumbs } from "@/components/admin/breadcrumbs"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { ImageInput } from "@/components/admin/image-input"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import { deleteHeroBanner, updateHeroBanner } from "@/app/admin/actions"
import { getAdminHeroBannerById } from "@/lib/admin"

export const metadata = { title: "Éditer bannière" }

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
      <header className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Paramètres", href: "/admin/settings" },
            { label: banner?.title ?? "Bannière" },
          ]}
        />
        <h1 className="font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          {banner?.title ?? "Bannière"}.
        </h1>
        {banner && (
          <StatusBadge status={banner.is_active ? "active" : "draft"} size="md" />
        )}
      </header>

      {!configured && <AdminSetupNotice />}

      {banner && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form
            action={updateHeroBanner}
            className="border border-border p-5 md:p-6"
          >
            <input type="hidden" name="id" value={banner.id} />
            <h2 className="label-eyebrow">Données bannière</h2>
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
                label="Eyebrow (suréclairage)"
                defaultValue={banner.eyebrow ?? ""}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  name="cta_label"
                  label="Texte du bouton CTA"
                  defaultValue={banner.cta_label ?? ""}
                />
                <Input
                  name="cta_href"
                  label="Lien du CTA"
                  defaultValue={banner.cta_href ?? ""}
                />
              </div>
              <ImageInput
                name="file"
                label="Image (fichier)"
                currentUrl={banner.image_url}
              />
              <Input
                name="image_url"
                label="…ou URL externe"
                defaultValue={banner.image_url ?? ""}
              />
              <Input
                name="sort_order"
                label="Ordre d'affichage"
                type="number"
                min="0"
                step="1"
                defaultValue={String(banner.sort_order ?? 0)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={banner.is_active}
                />
                Bannière active sur la homepage
              </label>
              <SubmitButton>Enregistrer</SubmitButton>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="border border-border p-5">
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 mb-4 text-sm text-smoke">
                Supprime définitivement la bannière de la homepage.
              </p>
              <ConfirmDeleteForm
                action={deleteHeroBanner}
                hidden={[{ name: "id", value: banner.id }]}
                successMessage={`Bannière "${banner.title}" supprimée`}
                description={`Supprimer définitivement la bannière "${banner.title}" ?`}
                triggerLabel="Supprimer la bannière"
                size="block"
                redirectTo="/admin/settings"
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
        rows={3}
        className="border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
