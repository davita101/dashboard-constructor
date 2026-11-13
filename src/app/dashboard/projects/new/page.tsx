import { Suspense } from "react"

import { ProjectPageView } from "@/components/projects/ProjectPageView"
import { Skeleton } from "@/components/ui/skeleton"
import { getNewProjectDetail, getProjects } from "@/lib/projects/data"

type SearchParams = Promise<{ tab?: string }>

// "Add New Project": the project page with a blank project ("Project Name" in the head, as in the Figma frame).
// searchParams and the user's projects are request-time data, so they are read inside Suspense.
export default function NewProjectPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<NewProjectSkeleton />}>
      <NewProject searchParams={searchParams} />
    </Suspense>
  )
}

async function NewProject({ searchParams }: { searchParams: SearchParams }) {
  const { tab } = await searchParams
  const [detail, projects] = await Promise.all([getNewProjectDetail(), getProjects()])

  return <ProjectPageView detail={detail} events={[]} projects={projects} tab={tab} />
}

function NewProjectSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-282 flex-col gap-6 px-5 py-5 md:gap-8 md:px-9 md:py-8 lg:px-0 lg:py-12" role="status" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 rounded-r20" />
    </div>
  )
}
