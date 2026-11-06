import { redirect } from "next/navigation"

import { isProjectTab } from "@/lib/projects/tabs"

// /dashboard/projects/<slug> lands on the Dashboard tab; old `?tab=x` links redirect to /<slug>/x.
export default async function ProjectIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const [{ slug }, { tab }] = await Promise.all([params, searchParams])
  redirect(`/dashboard/projects/${slug}/${isProjectTab(tab) ? tab : "dashboard"}`)
}
