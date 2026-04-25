import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { FormToast } from "@/components/admin/form-toast"
import { SubmitButton } from "@/components/admin/submit-button"
import { updateOrderStatus } from "@/app/admin/actions"
import { getAdminOrderById } from "@/lib/admin"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata = { title: "Detail commande" }

const STATUSES = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getAdminOrderById(id)
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !order) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">Operations</p>
          <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
            Commande #{order ? order.id.slice(0, 8) : "—"}.
          </h1>
          {order && (
            <p className="mt-2 text-sm text-smoke">
              {formatDate(order.created_at)} ·{" "}
              {order.payment_method === "cod" ? "Paiement livraison" : "Carte"}{" "}
              · {order.status}
            </p>
          )}
        </div>
        <Link
          href="/admin/orders"
          className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Retour
        </Link>
      </header>

      {!configured && <AdminSetupNotice />}

      {order && (
        <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8">
            <section className="border border-border">
              <div className="border-b border-border p-5">
                <h2 className="label-eyebrow">
                  Articles ({order.items.length})
                </h2>
              </div>
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="grid items-center gap-4 p-5 md:grid-cols-[1fr_120px_80px_120px]"
                  >
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      {item.variant_label && (
                        <p className="mt-1 text-sm text-smoke">
                          {item.variant_label}
                        </p>
                      )}
                    </div>
                    <p className="text-sm tabular-nums">
                      {formatPrice(item.unit_price_cents, order.currency)}
                    </p>
                    <p className="text-sm tabular-nums text-smoke">
                      x{item.quantity}
                    </p>
                    <p className="text-sm tabular-nums md:text-right">
                      {formatPrice(
                        item.unit_price_cents * item.quantity,
                        order.currency,
                      )}
                    </p>
                  </li>
                ))}
                {order.items.length === 0 && (
                  <li className="p-5 text-sm text-smoke">
                    Aucun article enregistre.
                  </li>
                )}
              </ul>
              <dl className="grid gap-2 border-t border-border p-5 text-sm md:grid-cols-2">
                <Total
                  label="Sous-total"
                  value={formatPrice(order.subtotal_cents, order.currency)}
                />
                <Total
                  label="Livraison"
                  value={formatPrice(order.shipping_cents, order.currency)}
                />
                {order.discount_cents > 0 && (
                  <Total
                    label={
                      order.coupon_code
                        ? `Remise (${order.coupon_code})`
                        : "Remise"
                    }
                    value={`- ${formatPrice(order.discount_cents, order.currency)}`}
                  />
                )}
                <Total
                  label="Total"
                  value={formatPrice(order.total_cents, order.currency)}
                  emphasize
                />
              </dl>
            </section>

            <section className="border border-border p-5 md:p-6">
              <h2 className="label-eyebrow">Mettre a jour le statut</h2>
              <FormToast
                action={updateOrderStatus}
                successMessage="Statut mis à jour"
                className="mt-4 flex flex-wrap items-center gap-3"
              >
                <input type="hidden" name="id" value={order.id} />
                <select
                  name="status"
                  defaultValue={order.status}
                  className="h-11 border border-border bg-background px-3 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <SubmitButton>Enregistrer</SubmitButton>
              </FormToast>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-border p-5">
              <p className="label-eyebrow">Client</p>
              <div className="mt-3 grid gap-1 text-sm">
                <p className="font-medium">
                  {order.customer
                    ? `${order.customer.first_name ?? ""} ${order.customer.last_name ?? ""}`.trim() ||
                      "Sans nom"
                    : order.shipping_name ?? "Sans nom"}
                </p>
                <p className="text-smoke">{order.email ?? "Sans email"}</p>
                <p className="text-smoke">
                  {order.customer?.phone ?? order.shipping_phone ?? "Sans tel"}
                </p>
              </div>
            </section>

            <section className="border border-border p-5">
              <p className="label-eyebrow">Adresse de livraison</p>
              <div className="mt-3 grid gap-1 text-sm">
                <p>{order.shipping_name ?? "—"}</p>
                {order.shipping_line1 && <p>{order.shipping_line1}</p>}
                {order.shipping_line2 && <p>{order.shipping_line2}</p>}
                <p>
                  {[order.shipping_postal_code, order.shipping_city]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </p>
                {order.shipping_country && <p>{order.shipping_country}</p>}
                <p className="mt-2 text-smoke">{order.shipping_phone ?? "—"}</p>
              </div>
            </section>

            <section className="border border-border p-5">
              <p className="label-eyebrow">Paiement</p>
              <div className="mt-3 grid gap-2 text-sm">
                <p>
                  Methode :{" "}
                  <span className="font-medium">
                    {order.payment_method === "cod"
                      ? "Cash a la livraison"
                      : "Carte (Stripe)"}
                  </span>
                </p>
                {order.stripe_checkout_session_id && (
                  <p className="break-all font-mono text-xs text-smoke">
                    session: {order.stripe_checkout_session_id}
                  </p>
                )}
                {order.stripe_payment_intent_id && (
                  <p className="break-all font-mono text-xs text-smoke">
                    intent: {order.stripe_payment_intent_id}
                  </p>
                )}
                {order.coupon_code && (
                  <p>
                    Coupon :{" "}
                    <span className="font-medium">{order.coupon_code}</span>
                  </p>
                )}
              </div>
            </section>

            <section className="border border-border p-5">
              <p className="label-eyebrow">Identifiant</p>
              <p className="mt-3 break-all font-mono text-xs text-smoke">
                {order.id}
              </p>
            </section>
          </aside>
        </div>
      )}
    </div>
  )
}

function Total({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${
        emphasize
          ? "border-t border-border pt-3 text-base font-medium md:col-span-2"
          : "text-smoke md:col-span-2"
      }`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
