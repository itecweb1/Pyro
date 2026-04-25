import Link from "next/link"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { FormToast } from "@/components/admin/form-toast"
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
          Parametres.
        </h1>
      </header>

      {!configured && <AdminSetupNotice />}

      <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <form action={updateBrandSettings} className="border border-border p-5 md:p-6">
          <h2 className="label-eyebrow">Plateforme de marque</h2>
          <div className="mt-6 grid gap-4">
            <Input name="name" label="Nom marque" defaultValue={brandSettings.name} />
            <Input name="slogan" label="Slogan" defaultValue={brandSettings.slogan} />
            <Textarea
              name="description"
              label="Description marque"
              defaultValue={brandSettings.description}
            />
            <Input
              name="shipping_threshold"
              label="Seuil livraison offerte (MAD)"
              inputMode="decimal"
              defaultValue={(brandSettings.shipping_threshold_cents / 100).toString()}
            />
            <Input
              name="shipping_fee"
              label="Frais de livraison standard (MAD)"
              inputMode="decimal"
              defaultValue={(brandSettings.shipping_fee_cents / 100).toString()}
            />
            <Textarea
              name="announcement_items"
              label="Messages announcement bar (1 ligne = 1 message)"
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
          <h2 className="label-eyebrow">Nouvelle hero banner</h2>
          <div className="mt-6 grid gap-4">
            <Input name="title" label="Titre hero" required />
            <Textarea name="subtitle" label="Sous-titre hero" />
            <Input name="eyebrow" label="Eyebrow" defaultValue="Drop 05 - Capsule active" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="cta_label" label="CTA label" defaultValue="Voir le drop" />
              <Input name="cta_href" label="CTA href" defaultValue="/shop" />
            </div>
            <label className="grid gap-2">
              <span className="label-eyebrow">Image (fichier)</span>
              <input
                name="file"
                type="file"
                accept="image/*"
                className="border border-border bg-background px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-[11px] file:uppercase file:tracking-[0.22em] file:text-background"
              />
            </label>
            <Input
              name="image_url"
              label="ou URL externe"
              defaultValue="/products/hero-main.jpg"
            />
            <Input name="sort_order" label="Ordre" inputMode="numeric" defaultValue="1" />
            <label className="flex items-center gap-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked />
              Activer cette banniere
            </label>
            <SubmitButton pendingLabel="Ajout…">Ajouter la bannière</SubmitButton>
          </div>
        </form>
      </section>

      <section className="border border-border">
        <div className="border-b border-border p-5">
          <h2 className="label-eyebrow">Bannieres homepage</h2>
        </div>
        <div className="divide-y divide-border">
          {heroBanners.map((banner) => (
            <article
              key={banner.id}
              className="grid gap-4 p-5 md:grid-cols-[1.1fr_auto_auto_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{banner.title}</p>
                  <span className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                    {banner.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-smoke">
                  {banner.eyebrow || "Sans eyebrow"} · {banner.cta_href || "/shop"} · ordre{" "}
                  {banner.sort_order}
                </p>
                {banner.image_url && (
                  <p className="mt-1 text-xs text-smoke">{banner.image_url}</p>
                )}
              </div>

              <Link
                href={`/admin/settings/banners/${banner.id}`}
                className="border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
              >
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
        className="h-11 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
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
        className="border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground"
      />
    </label>
  )
}
