"use client"

import { DashboardHeadMain, DashboardHeadTop } from "@/components/dashboard/dashboard-head"
import { useDashboardSize } from "@/components/dashboard/use-dashboard-size"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

/**
 * Figma "Content" of New Page: Head-Dashboard-01, Head-Dashboard-02 and the content panel.
 * Page spacing (Figma): 1600 = 48 top, 112 sides (1128 column), 32 gaps; 768 = 32 top, 36 sides; 360 = 20 top and sides, 24 gap, panel full bleed.
 */
/**
 * `widgets` turns on the Customize and Add Widget actions (pages that render a WidgetBoard).
 * `head` replaces Head-Dashboard-02 (e.g. Projects' Head-Dashboard-11 greeting).
 * `topBar="full"`: Head-Dashboard-01 spans the content width in a 56 bar (20 inset) above a divider, as in Figma Projects (1600).
 */
function DashboardPage({
  title,
  children,
  widgets = false,
  head,
  topBar = "column",
  panel = true,
}: {
  title: string
  children?: React.ReactNode
  widgets?: boolean
  head?: React.ReactNode
  topBar?: "column" | "full"
  /** false: content sits on the page background instead of the white panel. */
  panel?: boolean
}) {
  const size = useDashboardSize() ?? "desktop"
  const full = topBar === "full"
  const mainHead = head ?? <DashboardHeadMain size={size} title={title} widgets={widgets} />

  const column = (
    <div className="mx-auto flex w-full max-w-282 flex-col gap-6 md:gap-8 md:px-9 md:py-8 lg:px-0 lg:py-12">
      <div className="flex flex-col gap-6 px-5 pt-5 md:gap-8 md:p-0">
        {!full && <DashboardHeadTop size={size} title={title} />}
        {mainHead}
      </div>
      {widgets || !panel ? (
        // Figma "Dashboard: Home" and "Projects": cards sit directly on the page background, not inside the panel.
        <div className="min-h-210 px-5 md:px-0">{children}</div>
      ) : (
        <Card variant="panel" className="min-h-210">
          {children}
        </Card>
      )}
    </div>
  )

  if (!full) return column

  return (
    <>
      <div className="flex flex-col">
        <div className="px-5 py-3">
          <DashboardHeadTop size={size} title={title} />
        </div>
        <Separator className="bg-background-100" />
      </div>
      {column}
    </>
  )
}

export { DashboardPage }
