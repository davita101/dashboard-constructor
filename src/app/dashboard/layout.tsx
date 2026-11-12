import { Suspense } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { getProjects } from "@/lib/projects/data"

// One shared shell for every /dashboard/* route: navbar, sidebar and footer stay mounted while sections change.
// The sidebar's project tree is the signed-in user's (auth() = runtime data), so the shell streams inside Suspense.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ShellWithProjects>{children}</ShellWithProjects>
    </Suspense>
  )
}

async function ShellWithProjects({ children }: { children: React.ReactNode }) {
  const projects = (await getProjects()).map(({ id, slug, name, logo }) => ({ id, slug, name, logo }))
  return <DashboardShell projects={projects}>{children}</DashboardShell>
}
