import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { Breadcrumbs } from "@/components/admin/breadcrumbs"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { SubmitButton } from "@/components/admin/submit-button"
import { deleteCoupon, updateCoupon } from "@/app/admin/actions"
import { getAdminCouponById } from "@/lib/admin"

export const metadata = { title: "Editer coupon" }

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().slice(0, 10)
}

export default async function AdminCouponEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const coupon = await getAdminCouponById(id)
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !coupon) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Coupons", href: "/admin/coupons" },
            { label: coupon?.code ?? "—" },
          ]}
        />
        <h1 className="font-mono text-[40px] leading-none tracking-tight md:text-[56px]">
          {coupon?.code ?? "Coupon"}
        </h1>
      </header>

      {!configured && <AdminSetupNotice />}

      {coupon && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form action={updateCoupon} className="border border-border p-5 md:p-6">
            <input type="hidden" name="id" value={coupon.id} />
            <h2 className="label-eyebrow">Données coupon</h2>
            <div className="mt-6 grid gap-4">
              <Input
                name="code"
                label="Code"
                required
                defaultValue={coupon.code}
              />
              <label className="grid gap-2">
                <span className="label-eyebrow">Type</span>
                <select
                  name="type"
                  defaultValue={coupon.type}
                  className="h-11 border border-border bg-background px-3 text-sm"
                >
                  <option value="percent">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (MAD)</option>
                </select>
              </label>
              <Input
                name="value"
                label="Valeur"
                type="number"
                min="1"
                step="1"
                defaultValue={String(coupon.value)}
                required
              />
              <Input
                name="starts_at"
                label="Date de début"
                type="date"
                defaultValue={toDateInputValue(coupon.starts_at)}
              />
              <Input
                name="ends_at"
                label="Date de fin"
                type="date"
                defaultValue={toDateInputValue(coupon.ends_at)}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={coupon.is_active}
                />
                Actif
              </label>
              <SubmitButton>Enregistrer</SubmitButton>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="border border-border p-5">
              <p className="label-eyebrow">Identifiant</p>
              <p className="mt-3 break-all font-mono text-xs text-smoke">
                {coupon.id}
              </p>
            </div>
            <div className="border border-border p-5">
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 mb-4 text-sm text-smoke">
                La suppression est définitive. Les commandes utilisant le code
                gardent l&apos;historique.
              </p>
              <ConfirmDeleteForm
                action={deleteCoupon}
                hidden={[{ name: "id", value: coupon.id }]}
                successMessage={`Coupon ${coupon.code} supprimé`}
                description={`Supprimer définitivement le coupon "${coupon.code}" ?`}
                triggerLabel="Supprimer le coupon"
                size="block"
                redirectTo="/admin/coupons"
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
