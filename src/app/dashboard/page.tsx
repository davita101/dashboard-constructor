import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { WidgetBoard } from "@/components/dashboard/widgets/widget-board"
import { WidgetDataProvider } from "@/components/dashboard/widgets/widget-data"
import { getDashboardCharts, getProjectFinance, getProjects, getProjectTotals } from "@/lib/projects/data"

// Widgets read the signed-in user's project numbers (cached, user-scoped); the layout's Suspense covers the auth read.
export default async function DashboardHomePage() {
  const [totals, finance, charts, projects] = await Promise.all([getProjectTotals(), getProjectFinance(), getDashboardCharts(), getProjects()])
  return (
    <DashboardPage title="Dashboard" widgets>
      <WidgetDataProvider value={{ totals, finance, charts, projects }}>
        <WidgetBoard />
      </WidgetDataProvider>
    </DashboardPage>
  )
}
