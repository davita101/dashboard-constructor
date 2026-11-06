import { notFound } from "next/navigation"

import { ProjectPageView } from "@/components/projects/ProjectPageView"
import { getProjectDetail, getProjectEvents, getProjects } from "@/lib/projects/data"

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const [{ slug }, { tab }] = await Promise.all([params, searchParams])
  const [detail, events, projects] = await Promise.all([getProjectDetail(slug), getProjectEvents(), getProjects()])
  if (!detail) notFound()

  return <ProjectPageView detail={detail} events={events} projects={projects} tab={tab} />
}
