import Link from "next/link"
import { Pencil } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { FormToast } from "@/components/admin/form-toast"
import { ImageInput } from "@/components/admin/image-input"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import {
  createHeroBanner,
  deleteHeroBanner,
  toggleHeroBanner,
  updateBrandSettings,
} from "@/app/admin/actions"
import {
  getAdminBrandSettings,
  getAdminHeroBanners,
} from "@/lib/admin"

export const metadata = { title: "Admin parametres" }

export default async function AdminSettingsPage() {
  const [brandSettings, heroBanners] = await Promise.all([
    getAdminBrandSettings(),
    getAdminHeroBanners(),
  ])
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const heroStatFields = Array.from({ length: 3 }, (_, index) => {
    return brandSettings.hero_stats[index] ?? { label: "", value: "" }
  })

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Configuration</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Paramètres.
        </h1>
      </header>

      {!configured && <AdminSetupNotice />}

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <form action={updateBrandSettings} className="border border-border p-5 md:p-6">
          <h2 className="label-eyebrow">Plateforme de marque</h2>
          <div className="mt-6 grid gap-4">
            <Input
              name="name"
              label="Nom de la marque"
              defaultValue={brandSettings.name}
            />
            <Input
              name="slogan"
              label="Slogan"
              defaultValue={brandSettings.slogan}
            />
            <Textarea
              name="description"
              label="Description de la marque"
              defaultValue={brandSettings.description}
            />
            <Input
              name="shipping_threshold"
              label="Seuil livraison offerte (MAD)"
              type="number"
              min="0"
              step="0.01"
              defaultValue={(brandSettings.shipping_threshold_cents / 100).toString()}
            />
            <Input
              name="shipping_fee"
              label="Frais de livraison standard (MAD)"
              type="number"
              min="0"
              step="0.01"
              defaultValue={(brandSettings.shipping_fee_cents / 100).toString()}
            />
            <Textarea
              name="announcement_items"
              label="Messages de la barre d'annonce (1 ligne = 1 message)"
              defaultValue={brandSettings.announcement_items.join("\n")}
              rows={5}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {heroStatFields.map((stat, index) => (
                <div key={index} className="grid gap-3">
                  <Input
                    name={`hero_stat_${index + 1}_label`}
                    label={`Stat ${index + 1} label`}
                    defaultValue={stat.label}
                  />
                  <Input
                    name={`hero_stat_${index + 1}_value`}
                    label={`Stat ${index + 1} valeur`}
                    defaultValue={stat.value}
                  />
                </div>
              ))}
            </div>
            <SubmitButton>Enregistrer la marque</SubmitButton>
          </div>
        </form>

        <form action={createHeroBanner} className="border border-border p-5 md:p-6">
          <h2 className="label-eyebrow">Nouvelle bannière hero</h2>
          <div className="mt-6 grid gap-4">
            <Input name="title" label="Titre" required />
            <Textarea name="subtitle" label="Sous-titre" />
            <Input
              name="eyebrow"
              label="Eyebrow (suréclairage)"
              defaultValue="Drop 05 — Capsule active"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="cta_label"
                label="Texte du bouton CTA"
                defaultValue="Voir le drop"
              />
              <Input
                name="cta_href"
                label="Lien du CTA"
                defaultValue="/shop"
              />
            </div>
            <ImageInput name="file" label="Image (fichier)" />
            <Input
              name="image_url"
              label="…ou URL externe"
              defaultValue="/products/hero-main.jpg"
            />
            <Input
              name="sort_order"
              label="Ordre d'affichage"
              type="number"
              min="0"
              step="1"
              defaultValue="1"
            />
            <label className="flex items-center gap-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked />
              Activer cette bannière dès la création
            </label>
            <SubmitButton pendingLabel="Ajout…">Ajouter la bannière</SubmitButton>
          </div>
        </form>
      </section>

      <section className="border border-border">
        <div className="border-b border-border p-5">
          <h2 className="label-eyebrow">Bannières homepage</h2>
        </div>
        <div className="divide-y divide-border">
          {heroBanners.map((banner) => (
            <article
              key={banner.id}
              className="grid gap-4 p-5 md:grid-cols-[1.1fr_auto_auto_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium">{banner.title}</p>
                  <StatusBadge status={banner.is_active ? "active" : "draft"} />
                </div>
                <p className="mt-1 text-sm text-smoke">
                  {banner.eyebrow || "Sans eyebrow"} ·{" "}
                  {banner.cta_href || "/shop"} · ordre {banner.sort_order}
                </p>
                {banner.image_url && (
                  <p className="mt-1 break-all font-mono text-xs text-smoke">
                    {banner.image_url}
                  </p>
                )}
              </div>

              <Link
                href={`/admin/settings/banners/${banner.id}`}
                className="inline-flex items-center justify-center gap-1.5 border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
              >
                <Pencil className="size-3" strokeWidth={1.5} />
                Editer
              </Link>

              <FormToast
                action={toggleHeroBanner}
                successMessage={
                  banner.is_active ? "Bannière désactivée" : "Bannière activée"
                }
                className="flex"
              >
                <input type="hidden" name="id" value={banner.id} />
                <input
                  type="hidden"
                  name="next_active"
                  value={banner.is_active ? "false" : "true"}
                />
                <SubmitButton variant="secondary" pendingLabel="…">
                  {banner.is_active ? "Désactiver" : "Activer"}
                </SubmitButton>
              </FormToast>

              <ConfirmDeleteForm
                action={deleteHeroBanner}
                hidden={[{ name: "id", value: banner.id }]}
                successMessage={`Bannière "${banner.title}" supprimée`}
                description={`Supprimer la bannière "${banner.title}" ?`}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Paiement principal", "COD", "Paiement comptant a la livraison pour le Maroc."],
          ["Paiement carte", "STRIPE_SECRET_KEY", "Optionnel pour plus tard."],
          ["Supabase admin", "SUPABASE_SERVICE_ROLE_KEY", "Autorise le back office."],
          ["Admins", "ADMIN_EMAILS", "Liste d'emails separes par virgules."],
          ["Tracking", "NEXT_PUBLIC_GA_ID", "GA4 pret a charger."],
          ["URL site", "NEXT_PUBLIC_SITE_URL", "Utilisee par SEO et integrations futures."],
        ].map(([title, key, copy]) => (
          <article key={key} className="border border-border p-5">
            <p className="label-eyebrow">{title}</p>
            <p className="mt-3 font-mono text-sm">{key}</p>
            <p className="mt-2 text-sm text-smoke">{copy}</p>
          </article>
        ))}
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
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="grid gap-2">
      <span className="label-eyebrow">{label}</span>
      <textarea
        {...props}
        rows={rows}
        className="border border-border bg-background px-3 py-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
