import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { Breadcrumbs } from "@/components/admin/breadcrumbs"
import { FormToast } from "@/components/admin/form-toast"
import { StatusBadge } from "@/components/admin/status-badge"
import { SubmitButton } from "@/components/admin/submit-button"
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
      <header className="space-y-4">
        <Breadcrumbs
          items={[
            { label: "Admin", href: "/admin" },
            { label: "Clients", href: "/admin/customers" },
            {
              label: customer
                ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
                  "Client"
                : "—",
            },
          ]}
        />
        <h1 className="font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          {customer
            ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
              "Client Pyro"
            : "Client"}
          .
        </h1>
        {customer && (
          <div className="flex flex-wrap items-center gap-3">
            {customer.role === "admin" ? (
              <StatusBadge status="active" label="Admin" />
            ) : (
              <span className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                Client
              </span>
            )}
            <span className="text-sm text-smoke">
              · Inscrit le {formatDate(customer.created_at)}
            </span>
          </div>
        )}
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
            <FormToast
              action={updateCustomerProfile}
              successMessage="Profil mis à jour"
              className="border border-border p-5"
            >
              <input type="hidden" name="id" value={customer.id} />
              <p className="label-eyebrow">Profil</p>
              <div className="mt-4 grid gap-4">
                <Input
                  name="first_name"
                  label="Prénom"
                  defaultValue={customer.first_name ?? ""}
                />
                <Input
                  name="last_name"
                  label="Nom"
                  defaultValue={customer.last_name ?? ""}
                />
                <Input
                  name="phone"
                  label="Téléphone"
                  defaultValue={customer.phone ?? ""}
                />
                <label className="grid gap-2">
                  <span className="label-eyebrow">Rôle</span>
                  <select
                    name="role"
                    defaultValue={customer.role ?? "customer"}
                    className="h-11 border border-border bg-background px-3 text-sm"
                  >
                    <option value="customer">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <SubmitButton>Enregistrer</SubmitButton>
              </div>
            </FormToast>

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
        className="h-11 border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      />
    </label>
  )
}
