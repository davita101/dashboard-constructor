"use client"

import { useTranslations } from "next-intl"
import * as React from "react"

import { CartesianChart, type CartesianKind } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"
import { ProductTable } from "@/components/table/product-table"
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
import { useWidgetData, type WidgetData } from "@/components/dashboard/widgets/widget-data"
import { useWidgetFluid } from "@/components/dashboard/widgets/widget-fluid"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { cn } from "@/lib/utils"

type WidgetSize = "sm" | "md" | "lg" | "wide" | "full"

type WidgetCategory = "charts" | "metrics" | "tables"

type WidgetDef = {
  id: string
  category: WidgetCategory
  /** Figma-derived icon from public/icons. */
  icon: string
  /** Extra words the search matches besides the translated name / description. */
  keywords: string[]
  preview: React.ReactNode
  /** Grid footprint on the 8-track dashboard (see SPAN in widget-board): sm = 2 x 1 (264 x 164 metric tiles), md = 3 x 2, lg = 3 x 3 (408 x 540, default, all charts), wide = full row x 540, full = the whole row at its own height. */
  size?: WidgetSize
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

const liveCartesianKinds = new Set<CartesianKind>(["line", "line-area", "line-step", "line-gradient", "column-1", "column-2", "column-3", "column-6"])

const statusKeys = ["new", "inWork", "done", "failed"] as const

/** Signed percent → ChartCardMetrics trend fields ("" when flat). */
const trendOf = (pct: number) => ({
  trend: pct ? `${Math.abs(pct)}%` : "",
  trendDirection: pct < 0 ? ("down" as const) : ("up" as const),
})
// Same colours as the slices / rings in RadialChart (donut and progress: blue green orange sky; pie starts with purple).
const donutTones = ["blue", "green", "orange", "sky"] as const
const pieTones = ["purple", "green", "orange", "sky"] as const

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
  const fluid = useWidgetFluid()
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  const live = data && liveCartesianKinds.has(kind) ? data.charts.months : null
  const legendItems = live
    ? [
        { label: t("income"), tone: "purple" as const },
        { label: t("cost"), tone: "orange" as const },
      ]
    : legend === "labels"
      ? [...labelLegend]
      : undefined
  // Real numbers above a real plot: all-time income / cost / profit with the 30-day trends. The Hour/Day/Week/Month
  // switcher is Figma decoration with no data behind it, so it is hidden on live cards.
  const finance = live ? data!.finance : null
  const metrics: React.ComponentProps<typeof ChartCardMetrics>["items"] = finance
    ? [
        { tone: "purple", heading: t("income"), value: formatUsd(finance.income), ...trendOf(finance.incomeTrend), additionalText: t("last30") },
        { tone: "orange", heading: t("cost"), value: formatUsd(finance.cost), trend: "", additionalText: "" },
        { tone: "green", heading: t("profit"), value: formatUsd(finance.profit), ...trendOf(finance.profitTrend), additionalText: t("last30") },
      ]
    : undefined
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>{live ? t("incomeCost") : "Chart"}</ChartCardTitle>
        <ChartCardAction data-soon />
      </ChartCardHead>
      <ChartCardContent className={cn(fluid && "min-h-0 flex-1")}>
        {live ? null : <ChartCardSwitcher />}
        <ChartCardMetrics items={metrics} />
        <ChartCardPlot inset={wide ? "none" : "md"} className={cn(fluid && "min-h-0 flex-1")}>
          <CartesianChart
            preset="card"
            kind={kind}
            points={live?.map((m) => ({ label: m.label, values: [m.income, m.cost] }))}
            seriesLabels={live ? [t("income"), t("cost")] : undefined}
            className={fluid ? "h-full min-h-40 w-full" : cn(tall ? "h-97" : "h-79", wide ? "w-70" : "w-66")}
          />
        </ChartCardPlot>
        {legend !== "none" && <ChartCardLegend items={legendItems} />}
      </ChartCardContent>
      <ChartCardFooter />
    </ChartCard>
  )
}

function RadialCardPreview({ kind }: { kind: "donut" | "pie" | "progress" | "progress-half" }) {
  const fluid = useWidgetFluid()
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  const plot = cn(fluid && "min-h-0 flex-1 items-center")
  const counts = data ? statusKeys.map((k) => data.charts.tasksByStatus[k]) : null
  const sum = counts ? counts.reduce((a, b) => a + b, 0) : 0
  const tones = kind === "pie" ? pieTones : donutTones
  const half = kind === "progress-half"
  const live = data && counts
  const tasks = data?.totals.tasks ?? 0
  const ratio = tasks ? (data?.totals.tasksDone ?? 0) / tasks : 0
  const legendItems = live
    ? half
      ? [
          { label: t("done"), tone: "blue" as const },
          { label: t("remaining"), tone: "gray" as const },
        ]
      : statusKeys.map((k, i) => ({ label: t(`status.${k}`), tone: tones[i] }))
    : half
      ? [...halfLegend]
      : [...sliceLegend]
  const liveProps = live ? { total: sum, totalLabel: t("tasks") } : {}
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>{live ? (half ? t("taskCompletion") : t("tasksByStatus")) : "Chart"}</ChartCardTitle>
        <ChartCardAction data-soon />
      </ChartCardHead>
      <ChartCardContent className={cn(fluid && "min-h-0 flex-1")}>
        {/* Live: the plot and legend carry the numbers; the Figma switcher and sample metrics would be fake. */}
        {live ? null : (
          <>
            <ChartCardSwitcher />
            <ChartCardMetrics />
          </>
        )}
        {kind === "progress-half" ? (
          <ChartCardPlot className={cn("py-4", plot)}>
            <RadialChart
              preset="card"
              kind="progress-half"
              text
              className="h-33 w-66"
              {...(live ? { ratio, total: `${Math.round(ratio * 100)}%`, totalLabel: t("completed") } : {})}
            />
          </ChartCardPlot>
        ) : kind === "progress" ? (
          <ChartCardPlot inset="none" className={cn("py-4", plot)}>
            <RadialChart
              preset="card"
              kind="progress"
              text
              className={fluid ? "size-36" : "size-66"}
              progress={counts ? counts.map((c, i) => ({ color: donutTones[i], value: sum ? c / sum : 0 })) : undefined}
              {...liveProps}
            />
          </ChartCardPlot>
        ) : (
          <ChartCardPlot inset="none" className={cn("py-4", plot)}>
            <RadialChart preset="card" kind={kind} count={kind === "donut" ? 4 : 7} values={counts ?? undefined} className="size-49" {...liveProps} />
          </ChartCardPlot>
        )}
        <ChartCardLegend type={kind === "progress" ? "vertical" : undefined} items={legendItems} />
      </ChartCardContent>
      <ChartCardFooter />
    </ChartCard>
  )
}

type MetricChart = "line" | "area" | "column" | "progress"

const formatCount = (n: number) => new Intl.NumberFormat("en-US").format(n)
const formatUsd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)

/** The real metric behind each tile (user's projects): Projects, Income (30-day trend), Tasks, Tasks done. */
function liveMetric(chart: MetricChart, { totals, finance }: WidgetData) {
  const donePercent = totals.tasks ? Math.round((totals.tasksDone / totals.tasks) * 100) : 0
  const trend = finance.incomeTrend
  switch (chart) {
    case "line":
      return { key: "projects", value: formatCount(totals.projects), up: "", down: "", percent: 0 } as const
    case "area":
      return {
        key: "income",
        value: formatUsd(finance.income),
        up: trend > 0 ? `+${trend}%` : "",
        down: trend < 0 ? `${Math.abs(trend)}%` : "",
        percent: 0,
      } as const
    case "column":
      return { key: "tasks", value: formatCount(totals.tasks), up: "", down: "", percent: 0 } as const
    case "progress":
      return { key: "tasksDone", value: formatCount(totals.tasksDone), up: "", down: "", percent: donePercent } as const
  }
}

/** Figma dashboard metric cards (264 x 164): head and a 128px content row, footer clipped by the row height. */
function MetricTile({ chart }: { chart: MetricChart }) {
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  const live = data ? liveMetric(chart, data) : null
  const percent = live ? live.percent : 64
  const body = {
    line: { value: "87", up: "+20%", down: "", node: <ChartLine tone="purple" type={1} className="h-27 w-23.25" preserveAspectRatio="none" /> },
    area: { value: "72,550", up: "+6,11%", down: "", node: <ChartLineArea tone="blue" type={1} className="h-24 w-23.25" preserveAspectRatio="none" /> },
    column: { value: "425", up: "+2.45%", down: "", node: <ChartColumnsMini tone="blue" type={4} /> },
    progress: { value: "72,550", up: "", down: "21,33%", node: <ProgressCircle size="56" value={percent} color="blue" aria-label={`${percent}%`} /> },
  }[chart]
  return (
    <ChartMetricCard size="tile" className="lg:max-w-none">
      <ChartMetricHead title={live ? t(live.key) : undefined} />
      <ChartMetricBody layout="tile">
        <ChartMetricStats
          value={live?.value ?? body.value}
          heading=""
          up={live ? live.up : body.up}
          down={live ? live.down : body.down}
          className="h-auto"
        />
        <ChartMetricChart>{body.node}</ChartMetricChart>
      </ChartMetricBody>
    </ChartMetricCard>
  )
}

const metricTile = (chart: "line" | "area" | "column" | "progress") => ({
  preview: (
    <div className="w-66">
      <MetricTile chart={chart} />
    </div>
  ),
  board: <MetricTile chart={chart} />,
})

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
  { id: "line-area-chart", category: "charts", icon: ICON("trending_up"), keywords: ["area", "line", "trend"], preview: <CartesianCardPreview kind="line-area" />, size: "wide" },
  { id: "line-step-chart", category: "charts", icon: ICON("alt-route"), keywords: ["step", "line"], preview: <CartesianCardPreview kind="line-step" legend="labels" /> },
  { id: "column-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-2" /> },
  { id: "bar-chart", category: "charts", icon: ICON("sort"), keywords: ["bar", "horizontal"], preview: <CartesianCardPreview kind="bar" legend="none" wide={true} tall={true} /> },
  { id: "stacked-bar-chart", category: "charts", icon: ICON("list"), keywords: ["stacked", "bar"], preview: <CartesianCardPreview kind="bar-stacked" legend="none" wide={true} tall={true} /> },
  { id: "candle-chart", category: "charts", icon: ICON("balance"), keywords: ["candle", "stock", "finance"], preview: <CartesianCardPreview kind="candle" legend="none" wide={true} tall={true} /> },
  { id: "donut-chart", category: "charts", icon: ICON("refresh"), keywords: ["donut", "ring", "share"], preview: <RadialCardPreview kind="donut" /> },
  { id: "pie-chart", category: "charts", icon: ICON("monetization-on"), keywords: ["pie", "share"], preview: <RadialCardPreview kind="pie" /> },
  { id: "progress-chart", category: "charts", icon: ICON("done-all"), keywords: ["progress", "rings", "goal"], preview: <RadialCardPreview kind="progress" /> },
  { id: "progress-half-chart", category: "charts", icon: ICON("done-all"), keywords: ["progress", "half", "gauge", "goal"], preview: <RadialCardPreview kind="progress-half" /> },
  { id: "metric-line", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "line", "number"], ...metricTile("line"), size: "sm" },
  { id: "metric-area", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "area", "number"], ...metricTile("area"), size: "sm" },
  { id: "line-gradient-chart", category: "charts", icon: ICON("trending_up"), keywords: ["gradient", "line", "trend"], preview: <CartesianCardPreview kind="line-gradient" /> },
  { id: "column-type-1-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-1" legend="labels" /> },
  { id: "column-type-3-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-3" /> },
  { id: "column-type-5-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-5" /> },
  { id: "column-type-6-chart", category: "charts", icon: ICON("apps"), keywords: ["column", "bar", "vertical"], preview: <CartesianCardPreview kind="column-6" /> },
  { id: "metric-column", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "column", "number"], ...metricTile("column"), size: "sm" },
  { id: "metric-progress", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "progress", "number"], ...metricTile("progress"), size: "sm" },
  { id: "metric-line-2", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "revenue", "line", "two"], preview: <MetricLine2Preview /> },
  { id: "metric-chart", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "chart", "amounts", "list"], preview: <MetricLargePreview kind="chart" /> },
  { id: "metric-map", category: "metrics", icon: ICON("language"), keywords: ["metric", "map", "countries", "geo"], preview: <MetricLargePreview kind="map" /> },
  { id: "metric-card", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "wide", "strip"], preview: <MetricWidePreview />, size: "full" },
  { id: "table", category: "tables", icon: ICON("list"), keywords: ["table", "grid", "products", "rows", "data", "orders"], preview: <div className="w-210"><ProductTable /></div>, size: "full", board: <ProductTable /> },
]

const widgetsById = new Map(widgetCatalog.map((w) => [w.id, w]))
const getWidget = (id: string) => widgetsById.get(id)
const widgetSize = (id: string): WidgetSize => getWidget(id)?.size ?? "lg"
const isFullWidget = (id: string) => widgetSize(id) === "full"

const widgetCategories: WidgetCategory[] = ["charts", "metrics", "tables"]

export { getWidget, isFullWidget, widgetSize, widgetCatalog, widgetCategories }
export type { WidgetCategory, WidgetDef, WidgetSize }
