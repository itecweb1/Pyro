import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { adminKpis } from "@/lib/content"
import { getAdminMetrics, getAdminOrders } from "@/lib/admin"
import { formatPrice } from "@/lib/format"

export const metadata = { title: "Admin" }

export default async function AdminPage() {
  const [metrics, orders] = await Promise.all([
    getAdminMetrics(),
    getAdminOrders(),
  ])

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Dashboard</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Pilotage Pyro Wear.
        </h1>
      </header>

      {!metrics && <AdminSetupNotice />}

      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["Produits", metrics?.products ?? 0],
          ["Categories", metrics?.categories ?? 0],
          ["Commandes", metrics?.orders ?? 0],
          ["Clients", metrics?.customers ?? 0],
          ["Newsletter", metrics?.subscribers ?? 0],
        ].map(([label, value]) => (
          <article key={label} className="border border-border p-5">
            <p className="label-eyebrow">{label}</p>
            <p className="mt-4 font-serif text-4xl">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {adminKpis.map((item) => (
          <article key={item.label} className="border border-border p-6">
            <item.icon className="size-5 text-smoke" strokeWidth={1.3} />
            <p className="mt-5 label-eyebrow">{item.label}</p>
            <p className="mt-2 font-serif text-3xl">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="border border-border">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="label-eyebrow">Dernieres commandes</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-smoke hover:text-foreground"
          >
            Tout voir <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="grid gap-2 p-5 text-[13px] md:grid-cols-[1fr_auto_auto]"
            >
              <span className="font-medium">#{order.id.slice(0, 8)}</span>
              <span className="text-smoke">{order.status}</span>
              <span className="tabular-nums">
                {formatPrice(order.total_cents, order.currency)}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="p-5 text-sm text-smoke">
              Aucune commande pour l&apos;instant.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
