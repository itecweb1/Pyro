import { AdminShell } from "@/components/admin-shell"
import { requireAdmin } from "@/lib/admin"

export const dynamic = "force-dynamic"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireAdmin()

  return <AdminShell email={user.email}>{children}</AdminShell>
}
