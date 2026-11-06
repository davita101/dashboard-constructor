import { ProjectPageView } from "@/components/projects/ProjectPageView"
import { getNewProjectDetail, getProjects } from "@/lib/projects/data"

// "Add New Project": the project page with a blank project ("Project Name" in the head, as in the Figma frame).
export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  // searchParams first: it makes the render request-time, so the blank project may read the current date.
  const { tab } = await searchParams
  const [detail, projects] = await Promise.all([getNewProjectDetail(), getProjects()])

  return <ProjectPageView detail={detail} events={[]} projects={projects} tab={tab} />
}
