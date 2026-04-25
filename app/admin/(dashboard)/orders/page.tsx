import Link from "next/link"
import { updateOrderStatus } from "@/app/admin/actions"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { FormToast } from "@/components/admin/form-toast"
import { SubmitButton } from "@/components/admin/submit-button"
import { getAdminOrders } from "@/lib/admin"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata = { title: "Admin commandes" }

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]

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
          <thead className="border-b border-border text-[11px] uppercase tracking-[0.18em] text-smoke">
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
              <tr key={order.id}>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium hover:underline"
                  >
                    #{order.id.slice(0, 8)}
                  </Link>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-smoke">
                    {order.payment_method === "cod" ? "Paiement livraison" : order.payment_method ?? "-"}
                  </p>
                </td>
                <td className="p-4 text-smoke">
                  <p>{order.email ?? "-"}</p>
                  <p className="mt-1 text-xs">{order.shipping_phone ?? "-"}</p>
                </td>
                <td className="p-4 text-smoke">{order.shipping_city ?? "-"}</td>
                <td className="p-4">{formatDate(order.created_at)}</td>
                <td className="p-4 tabular-nums">
                  {formatPrice(order.total_cents, order.currency)}
                </td>
                <td className="p-4">
                  <FormToast
                    action={updateOrderStatus}
                    successMessage="Statut mis à jour"
                    className="flex gap-2"
                  >
                    <input type="hidden" name="id" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="h-9 border border-border bg-background px-2 text-xs"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <SubmitButton
                      variant="secondary"
                      pendingLabel="…"
                      className="!px-3 !py-0 !text-[10px]"
                    >
                      OK
                    </SubmitButton>
                  </FormToast>
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="border border-border px-3 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
                  >
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="p-5 text-smoke" colSpan={7}>
                  Aucune commande.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
