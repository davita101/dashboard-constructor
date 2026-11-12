import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ProjectPageView } from "@/components/projects/ProjectPageView"
import { Skeleton } from "@/components/ui/skeleton"
import { getProjectDetail, getProjectEvents, getProjects, getProjectSlugs } from "@/lib/projects/data"
import { isProjectTab, projectTabKeys } from "@/lib/projects/tabs"

type Params = Promise<{ slug: string; tab: string }>

// Route shells only (data is per user, read at request time). Cache Components needs at least one param.
export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return (slugs.length ? slugs : ["_"]).flatMap((slug) => projectTabKeys.map((tab) => ({ slug, tab })))
}

// params are read inside Suspense: with partialPrefetching the App Shell is shared by every project link, so it
// can't hold URL data. Unlisted slugs/tabs render on request and 404 from inside the boundary.
export default function ProjectTabPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<ProjectTabSkeleton />}>
      <ProjectTab params={params} />
    </Suspense>
  )
}

async function ProjectTab({ params }: { params: Params }) {
  const { slug, tab } = await params
  if (!isProjectTab(tab)) notFound()
  const [detail, events, projects] = await Promise.all([getProjectDetail(slug), getProjectEvents(), getProjects()])
  if (!detail) notFound()

  return <ProjectPageView detail={detail} events={events} projects={projects} tab={tab} />
}

function ProjectTabSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-282 flex-col gap-6 px-5 py-5 md:gap-8 md:px-9 md:py-8 lg:px-0 lg:py-12" role="status" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 rounded-r20" />
    </div>
  )
}
