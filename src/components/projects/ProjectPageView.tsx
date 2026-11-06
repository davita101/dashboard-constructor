import { getTranslations } from "next-intl/server"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ProjectDashboardCard } from "@/components/projects/ProjectDashboardCard"
import { ProjectPageHead } from "@/components/projects/ProjectPageHead"
import { isProjectTab } from "@/lib/projects/tabs"
import type { Project, ProjectDetail, ProjectEvent } from "@/lib/projects/types"

// Figma "Projects (1600)" 14061:76419: per-project dashboard, also the "Add New Project" editor.
// Below lg everything stacks in one column (no 360 frame yet).
async function ProjectPageView({
  detail,
  events,
  projects,
  tab,
}: {
  detail: ProjectDetail
  events: ProjectEvent[]
  projects: Project[]
  tab?: string
}) {
  const [tNav, tHead] = await Promise.all([getTranslations("nav"), getTranslations("projectPage.head")])
  const name = detail.project.name || tHead("untitled")

  return (
    <DashboardPage
      title={tNav("projects")}
      crumbs={[{ label: tNav("projects"), icon: "/icons/material-home.svg", href: "/dashboard/projects" }, { label: name }]}
      topBar="full"
      panel={false}
      head={<ProjectPageHead name={name} logo={detail.project.logo} />}
    >
      <ProjectDashboardCard detail={detail} events={events} projects={projects} tab={isProjectTab(tab) ? tab : "dashboard"} />
    </DashboardPage>
  )
}

export { ProjectPageView }
