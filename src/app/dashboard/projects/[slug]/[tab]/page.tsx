import { notFound } from "next/navigation"

import { ProjectPageView } from "@/components/projects/ProjectPageView"
import { getProjectDetail, getProjectEvents, getProjects } from "@/lib/projects/data"
import { isProjectTab, projectTabKeys } from "@/lib/projects/tabs"

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.flatMap((p) => projectTabKeys.map((tab) => ({ slug: p.slug, tab })))
}

export default async function ProjectTabPage({ params }: { params: Promise<{ slug: string; tab: string }> }) {
  const { slug, tab } = await params
  if (!isProjectTab(tab)) notFound()
  const [detail, events, projects] = await Promise.all([getProjectDetail(slug), getProjectEvents(), getProjects()])
  if (!detail) notFound()

  return <ProjectPageView detail={detail} events={events} projects={projects} tab={tab} />
}
