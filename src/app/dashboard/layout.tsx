import { DashboardShell } from "@/components/dashboard/dashboard-shell"

// One shared shell for every /dashboard/* route: navbar, sidebar and footer stay mounted while sections change.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
