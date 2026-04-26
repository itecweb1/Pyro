import Link from "next/link"
import { Pencil, TicketPercent } from "lucide-react"
import { createCoupon, deleteCoupon } from "@/app/admin/actions"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form"
import { EmptyState } from "@/components/admin/empty-state"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
import { getAdminCoupons } from "@/lib/admin"
import { parseListParams } from "@/lib/list-params"

export const metadata = { title: "Admin coupons" }

const PAGE_SIZE = 25
const ALLOWED_SORTS = ["created_at", "code", "value"] as const

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const params = parseListParams(sp, {
    allowedSorts: ALLOWED_SORTS,
    defaultSort: "created_at",
    defaultDir: "desc",
  })

  const { rows: coupons, total } = await getAdminCoupons({
    page: params.page,
    limit: PAGE_SIZE,
    q: params.q,
    sort: params.sort,
    dir: params.dir,
  })

  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const basePath = "/admin/coupons"
  const currentParams = {
    q: params.q || null,
    sort: params.sort,
    dir: params.dir,
    page: params.page > 1 ? params.page : null,
  }

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
              <select
                name="type"
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
              defaultValue="10"
              required
            />
            <Input name="starts_at" label="Date de début" type="date" />
            <Input name="ends_at" label="Date de fin" type="date" />
            <label className="flex items-center gap-2 text-sm">
              <input name="is_active" type="checkbox" defaultChecked />
              Actif dès la création
            </label>
            <SubmitButton pendingLabel="Création…">Créer le coupon</SubmitButton>
          </div>
        </form>

        <div className="space-y-4">
          <SearchInput placeholder="Rechercher un code…" />

          <div className="border border-border">
            {coupons.map((coupon) => (
              <article
                key={coupon.id}
                className="grid gap-3 border-b border-border p-5 transition-colors last:border-b-0 hover:bg-secondary/40 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center"
              >
                <p className="font-mono text-sm font-medium tracking-wider">
                  {coupon.code}
                </p>
                <p className="text-sm text-smoke">
                  {coupon.type === "percent"
                    ? `${coupon.value} %`
                    : `${coupon.value} MAD`}
                </p>
                <StatusBadge status={coupon.is_active ? "active" : "inactive"} />
                <Link
                  href={`/admin/coupons/${coupon.id}`}
                  className="inline-flex items-center justify-center gap-1.5 border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
                >
                  <Pencil className="size-3" strokeWidth={1.5} />
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
              <>
                {params.q ? (
                  <EmptyState
                    icon={TicketPercent}
                    title="Aucun résultat"
                    description={`Aucun coupon ne correspond à « ${params.q} ».`}
                  />
                ) : (
                  <EmptyState
                    icon={TicketPercent}
                    title="Aucun coupon"
                    description="Crée ton premier code promo en utilisant le formulaire à gauche."
                  />
                )}
              </>
            )}
            <Pagination
              basePath={basePath}
              currentParams={currentParams}
              page={params.page}
              pageSize={PAGE_SIZE}
              total={total}
              itemNoun="coupons"
            />
          </div>
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
        className="h-11 border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
