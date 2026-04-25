import Link from "next/link"
import { ChevronRight, Users } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { getAdminCustomers } from "@/lib/admin"
import { formatDate } from "@/lib/format"

export const metadata = { title: "Admin clients" }

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers()
  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">CRM</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Clients.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <div className="grid gap-3">
        {customers.map((customer) => (
          <article
            key={customer.id}
            className="grid gap-3 border border-border p-5 transition-colors hover:bg-secondary/40 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center"
          >
            <div>
              <p className="font-medium">
                {[customer.first_name, customer.last_name]
                  .filter(Boolean)
                  .join(" ") || "Client Pyro"}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-smoke">
                {customer.id}
              </p>
            </div>
            {customer.role === "admin" ? (
              <StatusBadge status="active" label="Admin" />
            ) : (
              <span className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                Client
              </span>
            )}
            <p className="text-sm text-smoke">{customer.phone ?? "—"}</p>
            <p className="text-sm">{formatDate(customer.created_at)}</p>
            <Link
              href={`/admin/customers/${customer.id}`}
              className="inline-flex items-center gap-1.5 border border-border px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
            >
              Ouvrir
              <ChevronRight className="size-3" strokeWidth={1.5} />
            </Link>
          </article>
        ))}
        {customers.length === 0 && (
          <div className="border border-border">
            <EmptyState
              icon={Users}
              title="Aucun client"
              description="Les clients apparaîtront ici dès la première inscription."
            />
          </div>
        )}
      </div>
    </div>
  )
}
