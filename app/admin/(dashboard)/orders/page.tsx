import Link from "next/link"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { EmptyState } from "@/components/admin/empty-state"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { SortableHeader } from "@/components/admin/sortable-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatusFilterChips } from "@/components/admin/status-filter-chips"
import { getAdminOrders, getOrderStatusCounts } from "@/lib/admin"
import { formatDate, formatPrice } from "@/lib/format"
import { parseListParams } from "@/lib/list-params"

export const metadata = { title: "Admin commandes" }

const PAGE_SIZE = 25
const ALLOWED_SORTS = ["created_at", "total_cents", "status"] as const

export default async function AdminOrdersPage({
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

  const [{ rows: orders, total }, counts] = await Promise.all([
    getAdminOrders({
      page: params.page,
      limit: PAGE_SIZE,
      q: params.q,
      sort: params.sort,
      dir: params.dir,
      status: params.status,
    }),
    getOrderStatusCounts(),
  ])

  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const basePath = "/admin/orders"
  const currentParams = {
    q: params.q || null,
    sort: params.sort,
    dir: params.dir,
    status: params.status,
    page: params.page > 1 ? params.page : null,
  }

  const chips = [
    { value: null as string | null, label: "Tous", count: counts._all },
    { value: "pending", label: "En attente", count: counts.pending ?? 0 },
    { value: "paid", label: "Payé", count: counts.paid ?? 0 },
    { value: "shipped", label: "Expédié", count: counts.shipped ?? 0 },
    { value: "delivered", label: "Livré", count: counts.delivered ?? 0 },
    { value: "cancelled", label: "Annulé", count: counts.cancelled ?? 0 },
    { value: "refunded", label: "Remboursé", count: counts.refunded ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">Operations</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Commandes.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatusFilterChips
          basePath={basePath}
          currentParams={currentParams}
          active={params.status}
          chips={chips}
        />
        <SearchInput placeholder="Rechercher (email, ville, téléphone)…" />
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                Commande
              </th>
              <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                Client
              </th>
              <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                Ville
              </th>
              <SortableHeader
                basePath={basePath}
                currentParams={currentParams}
                field="created_at"
                activeField={params.sort}
                activeDir={params.dir}
              >
                Date
              </SortableHeader>
              <SortableHeader
                basePath={basePath}
                currentParams={currentParams}
                field="total_cents"
                activeField={params.sort}
                activeDir={params.dir}
              >
                Total
              </SortableHeader>
              <SortableHeader
                basePath={basePath}
                currentParams={currentParams}
                field="status"
                activeField={params.sort}
                activeDir={params.dir}
              >
                Statut
              </SortableHeader>
              <th className="p-4 text-right text-[11px] uppercase tracking-[0.18em] text-smoke">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-secondary/40"
              >
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium tabular-nums hover:underline"
                  >
                    #{order.id.slice(0, 8)}
                  </Link>
                  {order.payment_method && (
                    <div className="mt-2">
                      <StatusBadge status={order.payment_method} />
                    </div>
                  )}
                </td>
                <td className="p-4 text-smoke">
                  <p>{order.email ?? "—"}</p>
                  <p className="mt-1 text-xs">{order.shipping_phone ?? "—"}</p>
                </td>
                <td className="p-4 text-smoke">
                  {order.shipping_city ?? "—"}
                </td>
                <td className="p-4 text-smoke">
                  {formatDate(order.created_at)}
                </td>
                <td className="p-4 font-medium tabular-nums">
                  {formatPrice(order.total_cents, order.currency)}
                </td>
                <td className="p-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
                  >
                    Ouvrir
                    <ChevronRight className="size-3" strokeWidth={1.5} />
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7}>
                  {params.q || params.status ? (
                    <EmptyState
                      icon={ShoppingBag}
                      title="Aucun résultat"
                      description="Essayez d'élargir les filtres ou la recherche."
                    />
                  ) : (
                    <EmptyState
                      icon={ShoppingBag}
                      title="Aucune commande"
                      description="Les commandes apparaîtront ici dès la première vente."
                    />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          basePath={basePath}
          currentParams={currentParams}
          page={params.page}
          pageSize={PAGE_SIZE}
          total={total}
          itemNoun="commandes"
        />
      </div>
    </div>
  )
}
