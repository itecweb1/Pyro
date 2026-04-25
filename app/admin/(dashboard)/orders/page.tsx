import Link from "next/link"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { getAdminOrders } from "@/lib/admin"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata = { title: "Admin commandes" }

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Operations</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Commandes.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/30 text-[11px] uppercase tracking-[0.18em] text-smoke">
            <tr>
              <th className="p-4">Commande</th>
              <th className="p-4">Client</th>
              <th className="p-4">Ville</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Detail</th>
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
                  <p className="mt-1 text-xs">
                    {order.shipping_phone ?? "—"}
                  </p>
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
                  <EmptyState
                    icon={ShoppingBag}
                    title="Aucune commande"
                    description="Les commandes apparaîtront ici dès la première vente."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
