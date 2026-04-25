import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { deleteCoupon, updateCoupon } from "@/app/admin/actions"
import { getAdminCouponById } from "@/lib/admin"

export const metadata = { title: "Editer coupon" }

async function deleteCouponAndRedirect(formData: FormData) {
  "use server"
  await deleteCoupon(formData)
  redirect("/admin/coupons")
}

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
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Conversion</p>
          <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
            Editer coupon.
          </h1>
        </div>
        <Link
          href="/admin/coupons"
          className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Retour
        </Link>
      </header>

      {!configured && <AdminSetupNotice />}

      {coupon && (
        <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <form action={updateCoupon} className="border border-border p-5 md:p-6">
            <input type="hidden" name="id" value={coupon.id} />
            <h2 className="label-eyebrow">Donnees coupon</h2>
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
                  <option value="percent">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </label>
              <Input
                name="value"
                label="Valeur"
                inputMode="numeric"
                defaultValue={String(coupon.value)}
              />
              <Input
                name="starts_at"
                label="Debut (YYYY-MM-DD)"
                type="date"
                defaultValue={toDateInputValue(coupon.starts_at)}
              />
              <Input
                name="ends_at"
                label="Fin (YYYY-MM-DD)"
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
                {coupon.id}
              </p>
            </div>
            <form
              action={deleteCouponAndRedirect}
              className="border border-border p-5"
            >
              <input type="hidden" name="id" value={coupon.id} />
              <p className="label-eyebrow">Zone dangereuse</p>
              <p className="mt-3 text-sm text-smoke">
                La suppression est definitive. Les commandes utilisant le code
                gardent l&apos;historique.
              </p>
              <button
                type="submit"
                className="mt-4 w-full border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
              >
                Supprimer le coupon
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
