import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getProjects } from "@/lib/projects/data"

// One shared shell for every /dashboard/* route: navbar, sidebar and footer stay mounted while sections change.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const projects = (await getProjects()).map(({ id, slug, name, logo }) => ({ id, slug, name, logo }))
  return <DashboardShell projects={projects}>{children}</DashboardShell>
}
