import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { WidgetBoard } from "@/components/dashboard/widgets/widget-board"

export default function DashboardHomePage() {
  return (
    <DashboardPage title="Dashboard" widgets>
      <WidgetBoard />
    </DashboardPage>
  )
}
