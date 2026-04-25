import Link from "next/link"
import {
  ArrowUpRight,
  Package,
  FolderOpen,
  ShoppingBag,
  Users,
  Mail,
} from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { EmptyState } from "@/components/admin/empty-state"
import { KpiCard } from "@/components/admin/kpi-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { adminKpis } from "@/lib/content"
import { getAdminMetrics, getAdminOrders } from "@/lib/admin"
import { formatPrice } from "@/lib/format"

export const metadata = { title: "Admin" }

export default async function AdminPage() {
  const [metrics, ordersResult] = await Promise.all([
    getAdminMetrics(),
    getAdminOrders({ page: 1, limit: 5 }),
  ])
  const orders = ordersResult.rows

  return (
    <div className="space-y-8">
      <header>
        <p className="label-eyebrow">Dashboard</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Pilotage Pyro Wear.
        </h1>
      </header>

      {!metrics && <AdminSetupNotice />}

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Produits"
          icon={Package}
          value={metrics?.products ?? 0}
        />
        <KpiCard
          label="Catégories"
          icon={FolderOpen}
          value={metrics?.categories ?? 0}
        />
        <KpiCard
          label="Commandes"
          icon={ShoppingBag}
          value={metrics?.orders ?? 0}
        />
        <KpiCard label="Clients" icon={Users} value={metrics?.customers ?? 0} />
        <KpiCard
          label="Newsletter"
          icon={Mail}
          value={metrics?.subscribers ?? 0}
        />
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
          <h2 className="label-eyebrow">Dernières commandes</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-smoke transition-colors hover:text-foreground"
          >
            Tout voir <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {orders.slice(0, 5).map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="grid items-center gap-3 p-5 text-[13px] transition-colors hover:bg-secondary/40 md:grid-cols-[140px_1fr_auto_auto]"
            >
              <span className="font-medium tabular-nums">
                #{order.id.slice(0, 8)}
              </span>
              <StatusBadge status={order.status} />
              <span className="text-smoke">{order.shipping_city ?? "—"}</span>
              <span className="font-medium tabular-nums">
                {formatPrice(order.total_cents, order.currency)}
              </span>
            </Link>
          ))}
          {orders.length === 0 && (
            <EmptyState
              icon={ShoppingBag}
              title="Aucune commande"
              description="Les commandes apparaîtront ici dès la première vente."
            />
          )}
        </div>
      </section>
    </div>
  )
}
