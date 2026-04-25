import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { updateCustomerProfile } from "@/app/admin/actions"
import { getAdminCustomerById } from "@/lib/admin"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata = { title: "Detail client" }

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getAdminCustomerById(id)
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (configured && !customer) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-eyebrow">CRM</p>
          <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
            {customer
              ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
                "Client Pyro"
              : "Client"}
            .
          </h1>
          {customer && (
            <p className="mt-2 text-sm text-smoke">
              Inscrit le {formatDate(customer.created_at)} ·{" "}
              {customer.role === "admin" ? "Admin" : "Client"}
            </p>
          )}
        </div>
        <Link
          href="/admin/customers"
          className="border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
        >
          Retour
        </Link>
      </header>

      {!configured && <AdminSetupNotice />}

      {customer && (
        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="border border-border">
              <div className="border-b border-border p-5">
                <h2 className="label-eyebrow">
                  Commandes ({customer.orders.length})
                </h2>
              </div>
              <ul className="divide-y divide-border">
                {customer.orders.map((order) => (
                  <li
                    key={order.id}
                    className="grid items-center gap-4 p-5 md:grid-cols-[120px_1fr_140px_120px_auto]"
                  >
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-smoke">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                      {order.payment_method === "cod"
                        ? "Paiement livraison"
                        : "Carte"}
                    </p>
                    <p className="text-sm tabular-nums">
                      {formatPrice(order.total_cents, order.currency)}
                    </p>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="border border-border px-3 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-secondary"
                    >
                      Ouvrir
                    </Link>
                  </li>
                ))}
                {customer.orders.length === 0 && (
                  <li className="p-5 text-sm text-smoke">
                    Aucune commande pour ce client.
                  </li>
                )}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <form
              action={updateCustomerProfile}
              className="border border-border p-5"
            >
              <input type="hidden" name="id" value={customer.id} />
              <p className="label-eyebrow">Profil</p>
              <div className="mt-4 grid gap-4">
                <Input
                  name="first_name"
                  label="Prenom"
                  defaultValue={customer.first_name ?? ""}
                />
                <Input
                  name="last_name"
                  label="Nom"
                  defaultValue={customer.last_name ?? ""}
                />
                <Input
                  name="phone"
                  label="Telephone"
                  defaultValue={customer.phone ?? ""}
                />
                <label className="grid gap-2">
                  <span className="label-eyebrow">Role</span>
                  <select
                    name="role"
                    defaultValue={customer.role ?? "customer"}
                    className="h-11 border border-border bg-background px-3 text-sm"
                  >
                    <option value="customer">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background"
                >
                  Enregistrer
                </button>
              </div>
            </form>

            <section className="border border-border p-5">
              <p className="label-eyebrow">Compte</p>
              <div className="mt-3 grid gap-1 text-sm">
                <p className="text-smoke">Email</p>
                <p>{customer.email ?? "—"}</p>
              </div>
              <div className="mt-4 grid gap-1 text-sm">
                <p className="text-smoke">Identifiant</p>
                <p className="break-all font-mono text-xs">{customer.id}</p>
              </div>
            </section>
          </aside>
        </div>
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
