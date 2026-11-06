import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ProjectDashboardCard } from "@/components/projects/ProjectDashboardCard"
import { ProjectPageHead } from "@/components/projects/ProjectPageHead"
import { getProjectDetail, getProjectEvents, getProjects } from "@/lib/projects/data"

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

// Figma "Projects (1600)" 14061:76419: per-project dashboard. Below lg everything stacks in one column (no 360 frame yet).
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const detail = await getProjectDetail(slug)
  if (!detail) notFound()
  const [t, events] = await Promise.all([getTranslations("nav"), getProjectEvents()])

  return (
    <DashboardPage
      title={t("projects")}
      topBar="full"
      panel={false}
      head={<ProjectPageHead name={detail.project.name} logo={detail.project.logo} />}
    >
      <ProjectDashboardCard detail={detail} events={events.filter((e) => e.projectId === detail.project.id)} />
    </DashboardPage>
  )
}
