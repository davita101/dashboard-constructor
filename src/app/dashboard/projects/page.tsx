import { getTranslations } from "next-intl/server"

import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { FinancialStatsCard } from "@/components/projects/FinancialStatsCard"
import { FinanceMetricCard } from "@/components/projects/FinanceMetricCard"
import { ProjectListCard } from "@/components/projects/ProjectListCard"
import { ProjectEventsCard } from "@/components/projects/ProjectEventsCard"
import { ProjectStats } from "@/components/projects/ProjectStats"
import { ProjectsGreeting } from "@/components/projects/ProjectsGreeting"
import { QuickAddCard } from "@/components/projects/QuickAddCard"
import { getProjectEvents, getProjectFinance, getProjectOptions, getProjects, getProjectTotals } from "@/lib/projects/data"

// Figma "Dashboard: Projects" → Projects (1600) 14061:68482. Content is built step by step (design/handoff/projects-1600/audit.md).
// Desktop body: KPI row (4 × 264, gap 24) above three columns 264 | 456 | 360 (gap 24) = the 1128 column.
// Columns keep the Figma ratio (fr) so narrower desktops shrink instead of overflowing; below xl Events drops under the first two.
export default async function ProjectsPage() {
  const [t, tFinance, totals, finance, projects, events, options] = await Promise.all([
    getTranslations("nav"),
    getTranslations("projects.finance"),
    getProjectTotals(),
    getProjectFinance(),
    getProjects(),
    getProjectEvents(),
    getProjectOptions(),
  ])

  return (
    <DashboardPage title={t("projects")} topBar="full" panel={false} head={<ProjectsGreeting />}>
      <div className="flex flex-col gap-6">
        <ProjectStats totals={totals} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,264fr)_minmax(0,456fr)_minmax(0,360fr)]">
          <div className="flex flex-col gap-6">
            <QuickAddCard projects={options} />
            <FinanceMetricCard title={tFinance("income")} amount={finance.income} trend={finance.incomeTrend} tone="green" />
            <FinanceMetricCard title={tFinance("profit")} amount={finance.profit} trend={finance.profitTrend} tone="purple" />
            <FinancialStatsCard finance={finance} />
          </div>
          <ProjectListCard projects={projects} />
          <ProjectEventsCard events={events} projects={projects} className="lg:col-span-2 xl:col-span-1" />
        </div>
      </div>
    </DashboardPage>
  )
}
