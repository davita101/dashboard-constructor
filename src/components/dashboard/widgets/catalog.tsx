import * as React from "react"

import { CartesianChart, type CartesianKind } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"
import { ProductTable } from "@/components/table/product-table"
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
import { ChartColumnsMini, ChartLine, ChartLineArea, ChartMap } from "@/components/ui/chart-parts"
import {
  ChartMetricActions,
  ChartMetricAmount,
  ChartMetricAmounts,
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricFooter,
  ChartMetricHead,
  ChartMetricList,
  ChartMetricPlot,
  ChartMetricStats,
  ChartMetricWideBody,
} from "@/components/ui/chart-metric"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { cn } from "@/lib/utils"

type WidgetCategory = "charts" | "metrics" | "tables" | "tasks"

type WidgetDef = {
  id: string
  category: WidgetCategory
  /** Figma-derived icon from public/icons. */
  icon: string
  /** Extra words the search matches besides the translated name / description. */
  keywords: string[]
  preview: React.ReactNode
  /** Natural width in px (Figma), used to fill rows. Defaults to a chart card, 320. */
  width?: number
  /** Natural height in px, used to stack small widgets beside a tall one. Defaults to a line chart card, 689. */
  height?: number
  /** Takes a whole row on the dashboard (tables, wide strips); never shares one. */
  full?: boolean
  /** What the dashboard renders when it differs from the picker preview (e.g. fluid width). */
  board?: React.ReactNode
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

function RadialCardPreview({ kind }: { kind: "donut" | "pie" | "progress" | "progress-half" }) {
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
        ) : kind === "progress" ? (
          <ChartCardPlot inset="none" className="py-4">
            <RadialChart preset="card" kind="progress" text className="size-66" />
          </ChartCardPlot>
        ) : (
          <ChartCardPlot inset="none" className="py-4">
            <RadialChart preset="card" kind={kind} count={kind === "donut" ? 4 : 7} className="size-49" />
          </ChartCardPlot>
        )}
        <ChartCardLegend type={kind === "progress" ? "vertical" : undefined} items={kind === "progress-half" ? [...halfLegend] : [...sliceLegend]} />
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

/** Metric-Column-Chart-Card and Metric-Progress-Chart-Card: compact card, chart on the right. */
function MetricCompactPreview({ chart }: { chart: "column" | "progress" }) {
  return (
    <ChartMetricCard size="sm">
      <ChartMetricHead />
      <ChartMetricBody>
        <ChartMetricStats />
        <ChartMetricChart>
          {chart === "column" ? (
            <ChartColumnsMini tone="blue" type={4} />
          ) : (
            <ProgressCircle size="56" value={50} color="green" aria-label="50%" />
          )}
        </ChartMetricChart>
      </ChartMetricBody>
      <ChartMetricFooter />
    </ChartMetricCard>
  )
}

/** Metric-Line-2-Chart-Card: amount, two lines with a tooltip, actions. */
function MetricLine2Preview() {
  return (
    <ChartMetricCard size="lg">
      <div className="flex flex-col gap-4 p-5">
        <ChartMetricAmount />
        <ChartMetricPlot>
          <ChartLineArea tone="green" type={2} preserveAspectRatio="none" />
          <ChartLine tone="orange" type={2} preserveAspectRatio="none" />
        </ChartMetricPlot>
      </div>
      <ChartMetricActions />
    </ChartMetricCard>
  )
}

/** Metric-Chart-Card (amounts and list) and Metric-Map-Card (map and list). */
function MetricLargePreview({ kind }: { kind: "chart" | "map" }) {
  return (
    <ChartMetricCard size="lg">
      <ChartMetricHead size="large" title={kind === "chart" ? "Line Chart Sample" : "Map"} />
      <ChartMetricBody layout="stack" className="pt-5">
        {kind === "chart" ? (
          <ChartMetricAmounts>
            <ChartMetricAmount size="lg" heading="Revenue" tone="pink" />
            <ChartMetricAmount size="lg" heading="Views" tone="blue" value="32,540" delta="1,05%" additionalText="vs. 28,540 last" />
          </ChartMetricAmounts>
        ) : (
          <div className="relative pt-5">
            <ChartMap appearance="default" />
          </div>
        )}
        <ChartMetricList />
      </ChartMetricBody>
      <ChartMetricActions size="lg" divider={false} />
    </ChartMetricCard>
  )
}

/** Metric-Card: the wide KPI strip. */
function MetricWidePreview() {
  return (
    <ChartMetricCard size="wide">
      <ChartMetricWideBody />
      <ChartMetricFooter size="wide" link="Heading" />
    </ChartMetricCard>
  )
}

const widgetCatalog: WidgetDef[] = [
  { id: "line-chart", category: "charts", icon: ICON("trending_up"), keywords: ["line", "trend", "graph"], preview: <CartesianCardPreview kind="line" /> },
  { id: "line-area-chart", category: "charts", icon: ICON("trending_up"), keywords: ["area", "line", "trend"], preview: <CartesianCardPreview kind="line-area" /> },
  { id: "line-step-chart", category: "charts", icon: ICON("alt-route"), keywords: ["step", "line"], preview: <CartesianCardPreview kind="line-step" legend="labels" /> },
  { id: "column-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-2" /> },
  { id: "bar-chart", category: "charts", icon: ICON("sort"), keywords: ["bar", "horizontal"], preview: <CartesianCardPreview kind="bar" legend="none" wide={true} tall={true} />, height: 729 },
  { id: "stacked-bar-chart", category: "charts", icon: ICON("list"), keywords: ["stacked", "bar"], preview: <CartesianCardPreview kind="bar-stacked" legend="none" wide={true} tall={true} />, height: 729 },
  { id: "candle-chart", category: "charts", icon: ICON("balance"), keywords: ["candle", "stock", "finance"], preview: <CartesianCardPreview kind="candle" legend="none" wide={true} tall={true} />, height: 729 },
  { id: "donut-chart", category: "charts", icon: ICON("refresh"), keywords: ["donut", "ring", "share"], preview: <RadialCardPreview kind="donut" />, height: 569 },
  { id: "pie-chart", category: "charts", icon: ICON("monetization-on"), keywords: ["pie", "share"], preview: <RadialCardPreview kind="pie" />, height: 569 },
  { id: "progress-chart", category: "charts", icon: ICON("done-all"), keywords: ["progress", "rings", "goal"], preview: <RadialCardPreview kind="progress" />, height: 693 },
  { id: "progress-half-chart", category: "charts", icon: ICON("done-all"), keywords: ["progress", "half", "gauge", "goal"], preview: <RadialCardPreview kind="progress-half" />, height: 505 },
  { id: "metric-line", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "line", "number"], preview: <MetricCardPreview chart="line" />, width: 230, height: 260 },
  { id: "metric-area", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "area", "number"], preview: <MetricCardPreview chart="area" />, width: 230, height: 260 },
  { id: "line-gradient-chart", category: "charts", icon: ICON("trending_up"), keywords: ["gradient", "line", "trend"], preview: <CartesianCardPreview kind="line-gradient" /> },
  { id: "column-type-1-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-1" legend="labels" /> },
  { id: "column-type-3-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-3" /> },
  { id: "column-type-5-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-5" /> },
  { id: "column-type-6-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-6" /> },
  { id: "metric-column", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "column", "number"], preview: <MetricCompactPreview chart="column" />, width: 230, height: 260 },
  { id: "metric-progress", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "progress", "number"], preview: <MetricCompactPreview chart="progress" />, width: 230, height: 260 },
  { id: "metric-line-2", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "revenue", "line", "two"], preview: <MetricLine2Preview />, width: 320, height: 309 },
  { id: "metric-chart", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "chart", "amounts", "list"], preview: <MetricLargePreview kind="chart" />, width: 320, height: 684 },
  { id: "metric-map", category: "metrics", icon: ICON("language"), keywords: ["metric", "map", "countries", "geo"], preview: <MetricLargePreview kind="map" />, width: 320, height: 751 },
  { id: "metric-card", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "wide", "strip"], preview: <MetricWidePreview />, full: true, height: 168 },
  { id: "table", category: "tables", icon: ICON("list"), keywords: ["table", "grid", "products", "rows", "data", "orders"], preview: <div className="w-210"><ProductTable /></div>, full: true, board: <ProductTable />, height: 250 },
  { id: "task-card", category: "tasks", icon: ICON("event"), keywords: ["task", "todo", "kanban", "card"], preview: <TaskCard />, width: 264, height: 304 },
]

const widgetsById = new Map(widgetCatalog.map((w) => [w.id, w]))
const getWidget = (id: string) => widgetsById.get(id)
const widgetWidth = (id: string) => getWidget(id)?.width ?? 320
const widgetHeight = (id: string) => getWidget(id)?.height ?? 689
const isFullWidget = (id: string) => getWidget(id)?.full === true

/** Width / height / full-row facts the layout needs to place widgets. */
const widgetSizing = { isFull: isFullWidget, widthOf: widgetWidth, heightOf: widgetHeight }

const widgetCategories: WidgetCategory[] = ["charts", "metrics", "tables", "tasks"]

export { getWidget, isFullWidget, widgetHeight, widgetSizing, widgetWidth, widgetCatalog, widgetCategories }
export type { WidgetCategory, WidgetDef }
