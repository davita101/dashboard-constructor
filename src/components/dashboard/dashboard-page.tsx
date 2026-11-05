"use client"

import { DashboardHeadMain, DashboardHeadTop } from "@/components/dashboard/dashboard-head"
import { useDashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Card } from "@/components/ui/card"

/**
 * Figma "Content" of New Page: Head-Dashboard-01, Head-Dashboard-02 and the content panel.
 * Page spacing (Figma): 1600 = 48 top, 112 sides (1128 column), 32 gaps; 768 = 32 top, 36 sides; 360 = 20 top and sides, 24 gap, panel full bleed.
 */
/** `widgets` turns on the Customize and Add Widget actions (pages that render a WidgetBoard). */
function DashboardPage({ title, children, widgets = false }: { title: string; children?: React.ReactNode; widgets?: boolean }) {
  const size = useDashboardSize() ?? "desktop"

  return (
    <div className="mx-auto flex w-full max-w-282 flex-col gap-6 md:gap-8 md:px-9 md:py-8 lg:px-0 lg:py-12">
      <div className="flex flex-col gap-6 px-5 pt-5 md:gap-8 md:p-0">
        <DashboardHeadTop size={size} title={title} />
        <DashboardHeadMain size={size} title={title} widgets={widgets} />
      </div>
      {widgets ? (
        // Figma "Dashboard: Home": widgets sit directly on the page background, not inside the panel.
        <div className="min-h-210 px-5 md:px-0">{children}</div>
      ) : (
        <Card variant="panel" className="min-h-210">
          {children}
        </Card>
      )}
    </div>
  )
}

export { DashboardPage }
