import Link from "next/link"
import { createCoupon, deleteCoupon } from "@/app/admin/actions"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { SubmitButton } from "@/components/admin/submit-button"
import { getAdminCoupons } from "@/lib/admin"

export const metadata = { title: "Admin coupons" }

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons()
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Conversion</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Coupons.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <section className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form action={createCoupon} className="border border-border p-6">
          <h2 className="label-eyebrow">Nouveau code</h2>
          <div className="mt-6 grid gap-4">
            <Input name="code" label="Code" required placeholder="PYRO10" />
            <label className="grid gap-2">
              <span className="label-eyebrow">Type</span>
              <select name="type" className="h-11 border border-border bg-background px-3 text-sm">
                <option value="percent">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
            </label>
            <Input name="value" label="Valeur" inputMode="numeric" defaultValue="10" />
            <Input name="starts_at" label="Debut ISO" placeholder="2026-05-01" />
            <Input name="ends_at" label="Fin ISO" placeholder="2026-06-01" />
            <label className="flex items-center gap-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked />
              Actif
            </label>
            <SubmitButton pendingLabel="Création…">Créer le coupon</SubmitButton>
          </div>
        </form>

        <div className="border border-border">
          {coupons.map((coupon) => (
            <article
              key={coupon.id}
              className="grid gap-3 border-b border-border p-5 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center"
            >
              <p className="font-medium">{coupon.code}</p>
              <p className="text-sm text-smoke">
                {coupon.type} - {coupon.value}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em]">
                {coupon.is_active ? "Actif" : "Inactif"}
              </p>
              <Link
                href={`/admin/coupons/${coupon.id}`}
                className="border border-border px-4 py-3 text-center text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
              >
                Editer
              </Link>
              <ConfirmDeleteForm
                action={deleteCoupon}
                hidden={[{ name: "id", value: coupon.id }]}
                successMessage={`Coupon ${coupon.code} supprimé`}
                description={`Supprimer le coupon "${coupon.code}" ? L'historique des commandes utilisant ce code reste intact.`}
              />
            </article>
          ))}
          {coupons.length === 0 && (
            <p className="p-5 text-sm text-smoke">Aucun coupon.</p>
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
