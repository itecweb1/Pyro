import Link from "next/link"
import { ChevronRight, Users } from "lucide-react"
import { AdminSetupNotice } from "@/components/admin-empty-state"
import { EmptyState } from "@/components/admin/empty-state"
import { Pagination } from "@/components/admin/pagination"
import { SearchInput } from "@/components/admin/search-input"
import { SortableHeader } from "@/components/admin/sortable-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { getAdminCustomers } from "@/lib/admin"
import { formatDate } from "@/lib/format"
import { parseListParams } from "@/lib/list-params"

export const metadata = { title: "Admin clients" }

const PAGE_SIZE = 50
const ALLOWED_SORTS = ["created_at", "last_name"] as const

export default async function AdminCustomersPage({
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

  const { rows: customers, total } = await getAdminCustomers({
    page: params.page,
    limit: PAGE_SIZE,
    q: params.q,
    sort: params.sort,
    dir: params.dir,
  })

  const configured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const basePath = "/admin/customers"
  const currentParams = {
    q: params.q || null,
    sort: params.sort,
    dir: params.dir,
    page: params.page > 1 ? params.page : null,
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="label-eyebrow">CRM</p>
        <h1 className="mt-3 font-serif text-[44px] leading-none tracking-tight md:text-[64px]">
          Clients.
        </h1>
      </header>
      {!configured && <AdminSetupNotice />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput placeholder="Rechercher (nom, prénom, téléphone)…" />
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/30">
            <tr>
              <SortableHeader
                basePath={basePath}
                currentParams={currentParams}
                field="last_name"
                activeField={params.sort}
                activeDir={params.dir}
              >
                Client
              </SortableHeader>
              <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                Rôle
              </th>
              <th className="p-4 text-[11px] uppercase tracking-[0.18em] text-smoke">
                Téléphone
              </th>
              <SortableHeader
                basePath={basePath}
                currentParams={currentParams}
                field="created_at"
                activeField={params.sort}
                activeDir={params.dir}
              >
                Inscrit le
              </SortableHeader>
              <th className="p-4 text-right text-[11px] uppercase tracking-[0.18em] text-smoke">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="transition-colors hover:bg-secondary/40"
              >
                <td className="p-4">
                  <p className="font-medium">
                    {[customer.first_name, customer.last_name]
                      .filter(Boolean)
                      .join(" ") || "Client Pyro"}
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-smoke">
                    {customer.id}
                  </p>
                </td>
                <td className="p-4">
                  {customer.role === "admin" ? (
                    <StatusBadge status="active" label="Admin" />
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-smoke">
                      Client
                    </span>
                  )}
                </td>
                <td className="p-4 text-smoke">{customer.phone ?? "—"}</td>
                <td className="p-4 text-smoke">
                  {formatDate(customer.created_at)}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-secondary"
                  >
                    Ouvrir
                    <ChevronRight className="size-3" strokeWidth={1.5} />
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5}>
                  {params.q ? (
                    <EmptyState
                      icon={Users}
                      title="Aucun résultat"
                      description={`Aucun client ne correspond à « ${params.q} ».`}
                    />
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="Aucun client"
                      description="Les clients apparaîtront ici dès la première inscription."
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
          itemNoun="clients"
        />
      </div>
    </div>
  )
}
