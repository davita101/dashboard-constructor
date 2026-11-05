import * as React from "react"

import { CartesianChart, type CartesianKind } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"
import { TaskCard } from "@/components/task/task-card"
import {
  ChartCard,
  ChartCardAction,
  ChartCardContent,
  ChartCardFooter,
  ChartCardHead,
  ChartCardLegend,
  ChartCardMetrics,
  ChartCardPlot,
  ChartCardSwitcher,
  ChartCardTitle,
} from "@/components/ui/card"
import { ChartLine, ChartLineArea } from "@/components/ui/chart-parts"
import {
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricFooter,
  ChartMetricHead,
  ChartMetricStats,
} from "@/components/ui/chart-metric"
import { cn } from "@/lib/utils"

type WidgetCategory = "charts" | "metrics" | "tasks"

type WidgetDef = {
  id: string
  category: WidgetCategory
  /** Figma-derived icon from public/icons. */
  icon: string
  /** Extra words the search matches besides the translated name / description. */
  keywords: string[]
  preview: React.ReactNode
}

const ICON = (name: string) => `/icons/material-${name}.svg`

const labelLegend = [
  { label: "Label", tone: "primary" },
  { label: "Label", tone: "orange" },
  { label: "Label", tone: "purple" },
] as const
const sliceLegend = [
  { label: "Label", tone: "blue" },
  { label: "Label", tone: "green" },
  { label: "Label", tone: "orange" },
] as const
const halfLegend = [
  { label: "Views", tone: "blue" },
  { label: "Visits", tone: "gray" },
] as const

/** Same ChartCard composition as /design-system/chart-card, one per widget. */
function CartesianCardPreview({
  kind,
  legend = "months",
  wide = false,
  tall = false,
}: {
  kind: CartesianKind
  legend?: "months" | "labels" | "none"
  wide?: boolean
  tall?: boolean
}) {
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>Chart</ChartCardTitle>
        <ChartCardAction />
      </ChartCardHead>
      <ChartCardContent>
        <ChartCardSwitcher />
        <ChartCardMetrics />
        <ChartCardPlot inset={wide ? "none" : "md"}>
          <CartesianChart preset="card" kind={kind} className={cn(tall ? "h-97" : "h-79", wide ? "w-70" : "w-66")} />
        </ChartCardPlot>
        {legend !== "none" && <ChartCardLegend items={legend === "labels" ? [...labelLegend] : undefined} />}
      </ChartCardContent>
      <ChartCardFooter />
    </ChartCard>
  )
}

function RadialCardPreview({ kind }: { kind: "donut" | "pie" | "progress-half" }) {
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>Chart</ChartCardTitle>
        <ChartCardAction />
      </ChartCardHead>
      <ChartCardContent>
        <ChartCardSwitcher />
        <ChartCardMetrics />
        {kind === "progress-half" ? (
          <ChartCardPlot className="py-4">
            <RadialChart preset="card" kind="progress-half" text className="h-33 w-66" />
          </ChartCardPlot>
        ) : (
          <ChartCardPlot inset="none" className="py-4">
            <RadialChart preset="card" kind={kind} count={kind === "donut" ? 4 : 7} className="size-49" />
          </ChartCardPlot>
        )}
        <ChartCardLegend items={kind === "progress-half" ? [...halfLegend] : [...sliceLegend]} />
      </ChartCardContent>
      <ChartCardFooter />
    </ChartCard>
  )
}

function MetricCardPreview({ chart }: { chart: "line" | "area" }) {
  return (
    <ChartMetricCard size="sm">
      <ChartMetricHead />
      <ChartMetricBody>
        <ChartMetricStats />
        <ChartMetricChart>
          {chart === "line" ? (
            <ChartLine tone="blue" type={1} className="h-27 w-23.25" preserveAspectRatio="none" />
          ) : (
            <ChartLineArea tone="blue" type={1} className="h-30 w-23.25" preserveAspectRatio="none" />
          )}
        </ChartMetricChart>
      </ChartMetricBody>
      <ChartMetricFooter />
    </ChartMetricCard>
  )
}

const widgetCatalog: WidgetDef[] = [
  { id: "line-chart", category: "charts", icon: ICON("trending_up"), keywords: ["line", "trend", "graph"], preview: <CartesianCardPreview kind="line" /> },
  { id: "line-area-chart", category: "charts", icon: ICON("trending_up"), keywords: ["area", "line", "trend"], preview: <CartesianCardPreview kind="line-area" /> },
  { id: "line-step-chart", category: "charts", icon: ICON("alt-route"), keywords: ["step", "line"], preview: <CartesianCardPreview kind="line-step" legend="labels" /> },
  { id: "column-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-2" /> },
  { id: "bar-chart", category: "charts", icon: ICON("sort"), keywords: ["bar", "horizontal"], preview: <CartesianCardPreview kind="bar" legend="none" wide={true} tall={true} /> },
  { id: "stacked-bar-chart", category: "charts", icon: ICON("list"), keywords: ["stacked", "bar"], preview: <CartesianCardPreview kind="bar-stacked" legend="none" wide={true} tall={true} /> },
  { id: "candle-chart", category: "charts", icon: ICON("balance"), keywords: ["candle", "stock", "finance"], preview: <CartesianCardPreview kind="candle" legend="none" wide={true} tall={true} /> },
  { id: "donut-chart", category: "charts", icon: ICON("refresh"), keywords: ["donut", "ring", "share"], preview: <RadialCardPreview kind="donut" /> },
  { id: "pie-chart", category: "charts", icon: ICON("monetization-on"), keywords: ["pie", "share"], preview: <RadialCardPreview kind="pie" /> },
  { id: "progress-chart", category: "charts", icon: ICON("done-all"), keywords: ["progress", "gauge", "goal"], preview: <RadialCardPreview kind="progress-half" /> },
  { id: "metric-line", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "line", "number"], preview: <MetricCardPreview chart="line" /> },
  { id: "metric-area", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "area", "number"], preview: <MetricCardPreview chart="area" /> },
  { id: "task-card", category: "tasks", icon: ICON("event"), keywords: ["task", "todo", "kanban", "card"], preview: <TaskCard /> },
]

const widgetCategories: WidgetCategory[] = ["charts", "metrics", "tasks"]

export { widgetCatalog, widgetCategories }
export type { WidgetCategory, WidgetDef }
