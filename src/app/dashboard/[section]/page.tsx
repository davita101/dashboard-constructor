import { notFound } from "next/navigation"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { dashboardNav } from "@/components/dashboard/nav"

// Every sidebar section lives at /dashboard/<slug>. Each one gets its own folder here once it has real content.
export function generateStaticParams() {
  return dashboardNav.filter((n) => n.slug).map((n) => ({ section: n.slug }))
}

export default async function DashboardSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const item = dashboardNav.find((n) => n.slug === section)
  if (!item) notFound()
  return <DashboardPage title={item.label} />
}
