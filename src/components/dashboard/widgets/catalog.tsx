"use client"

import { useTranslations } from "next-intl"
import * as React from "react"

import { CartesianChart, type CartesianKind } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"
import { ProductTable } from "@/components/table/product-table"
import { ProjectsTable } from "@/components/table/projects-table"
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
import { downloadCsv, type CsvCell } from "@/lib/csv"
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
  /** Demo data only: hidden from the picker, still renders when already on a board. */
  demoOnly?: boolean
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

const liveCartesianKinds = new Set<CartesianKind>(["line", "line-area", "line-step", "line-gradient", "column-1", "column-2", "column-3", "column-5", "column-6"])

const statusKeys = ["new", "inWork", "done", "failed"] as const

const VIEW_MORE_HREF = "/dashboard/projects"
type CsvExport = { file: string; data: CsvCell[][] }

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
  const isBar = kind === "bar" || kind === "bar-stacked"
  const isIncomeOnly = kind === "column-5"
  const live = data && liveCartesianKinds.has(kind) ? data.charts.months : null
  const liveBars = data && isBar ? data.charts.tasksByProject : null
  const isLive = !!live || !!liveBars
  const legendItems = liveBars
    ? kind === "bar-stacked"
      ? statusKeys.map((k, i) => ({ label: t(`status.${k}`), tone: donutTones[i] }))
      : undefined
    : live
      ? isIncomeOnly
        ? [{ label: t("income"), tone: "purple" as const }]
        : [
            { label: t("income"), tone: "purple" as const },
            { label: t("cost"), tone: "orange" as const },
          ]
      : legend === "labels"
        ? [...labelLegend]
        : undefined
  // Real numbers above a real plot: all-time income / cost / profit with the 30-day trends. The Hour/Day/Week/Month
  // switcher is Figma decoration with no data behind it, so it is hidden on live cards.
  const finance = live && !isIncomeOnly ? data!.finance : null
  const metrics: React.ComponentProps<typeof ChartCardMetrics>["items"] = finance
    ? [
        { tone: "purple", heading: t("income"), value: formatUsd(finance.income), ...trendOf(finance.incomeTrend), additionalText: t("last30") },
        { tone: "orange", heading: t("cost"), value: formatUsd(finance.cost), trend: "", additionalText: "" },
        { tone: "green", heading: t("profit"), value: formatUsd(finance.profit), ...trendOf(finance.profitTrend), additionalText: t("last30") },
      ]
    : undefined
  const rows: CsvExport | null = liveBars
    ? {
        file: "tasks-by-project.csv",
        data: [
          ["Project", ...statusKeys.map((k) => t(`status.${k}`)), "Total"],
          ...liveBars.map((p) => [p.name, ...statusKeys.map((k) => p[k]), p.total]),
        ],
      }
    : live
      ? {
          file: isIncomeOnly ? "income-per-month.csv" : "income-cost.csv",
          data: isIncomeOnly
            ? [["Month", t("income")], ...live.map((m) => [m.label, m.income])]
            : [["Month", t("income"), t("cost")], ...live.map((m) => [m.label, m.income, m.cost])],
        }
      : null
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>
          {liveBars ? t("tasksByProject") : live ? (isIncomeOnly ? t("incomePerMonth") : t("incomeCost")) : "Chart"}
        </ChartCardTitle>
        {isLive ? null : <ChartCardAction data-soon />}
      </ChartCardHead>
      <ChartCardContent className={cn(fluid && "min-h-0 flex-1")}>
        {isLive ? null : <ChartCardSwitcher />}
        {liveBars || (isIncomeOnly && live) ? null : <ChartCardMetrics items={metrics} />}
        <ChartCardPlot inset={wide ? "none" : "md"} className={cn(fluid && "min-h-0 flex-1")}>
          <CartesianChart
            preset="card"
            kind={kind}
            points={live?.map((m) => ({ label: m.label, values: isIncomeOnly ? [m.income] : [m.income, m.cost] }))}
            categories={liveBars?.map((p) => ({
              name: p.name,
              values: kind === "bar" ? [p.total] : statusKeys.map((k) => p[k]),
            }))}
            seriesLabels={
              liveBars
                ? kind === "bar"
                  ? [t("tasks")]
                  : statusKeys.map((k) => t(`status.${k}`))
                : live
                  ? isIncomeOnly
                    ? [t("income")]
                    : [t("income"), t("cost")]
                  : undefined
            }
            className={fluid ? "h-full min-h-40 w-full" : cn(tall ? "h-97" : "h-79", wide ? "w-70" : "w-66")}
          />
        </ChartCardPlot>
        {(legend !== "none" || legendItems) && <ChartCardLegend items={legendItems} />}
      </ChartCardContent>
      <ChartCardFooter
        {...(rows
          ? { viewMoreHref: VIEW_MORE_HREF, onDownload: () => downloadCsv(rows.file, rows.data) }
          : {})}
      />
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
  const rows: CsvExport | null =
    data && counts
      ? half
        ? {
            file: "task-completion.csv",
            data: [
              ["Metric", t("tasks")],
              [t("done"), data.totals.tasksDone],
              [t("remaining"), data.totals.tasks - data.totals.tasksDone],
            ],
          }
        : {
            file: "tasks-by-status.csv",
            data: [["Status", t("tasks")], ...statusKeys.map((k, i) => [t(`status.${k}`), counts[i]])],
          }
      : null
  return (
    <ChartCard>
      <ChartCardHead>
        <ChartCardTitle>{live ? (half ? t("taskCompletion") : t("tasksByStatus")) : "Chart"}</ChartCardTitle>
        {live ? null : <ChartCardAction data-soon />}
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
      <ChartCardFooter
        {...(rows
          ? { viewMoreHref: VIEW_MORE_HREF, onDownload: () => downloadCsv(rows.file, rows.data) }
          : {})}
      />
    </ChartCard>
  )
}

type MetricChart = "line" | "area" | "column" | "progress"

const formatCount = (n: number) => new Intl.NumberFormat("en-US").format(n)
/** Live board table: the user's projects; the Figma product sample outside the data provider. */
function ProjectsTableWidget() {
  const data = useWidgetData()
  return data ? <ProjectsTable projects={data.projects} /> : <ProductTable />
}

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
      <ChartMetricHead title={live ? t(live.key) : undefined} action={!live} />
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
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  const trend = data?.finance.incomeTrend ?? 0
  const months = data?.charts.months.slice(-9)
  return (
    <ChartMetricCard size="lg">
      <div className="flex flex-col gap-4 p-5">
        {data ? (
          <ChartMetricAmount
            tone="purple"
            heading={t("income")}
            value={formatUsd(data.finance.income)}
            delta={trend ? `${Math.abs(trend)}%` : ""}
            deltaDirection={trend < 0 ? "down" : "up"}
            additionalText={t("last30")}
          />
        ) : (
          <ChartMetricAmount />
        )}
        <ChartMetricPlot>
          {months ? (
            <CartesianChart
              preset="card"
              kind="line"
              yAxis="none"
              lines="none"
              points={months.map((m) => ({ label: m.label, values: [m.income, m.cost] }))}
              seriesLabels={[t("income"), t("cost")]}
              className="h-24 w-70"
            />
          ) : (
            <>
              <ChartLineArea tone="green" type={2} preserveAspectRatio="none" />
              <ChartLine tone="orange" type={2} preserveAspectRatio="none" />
            </>
          )}
        </ChartMetricPlot>
      </div>
      <ChartMetricActions
        {...(data
          ? {
              viewMoreHref: VIEW_MORE_HREF,
              onDownload: () =>
                downloadCsv("income-cost.csv", [
                  ["Month", t("income"), t("cost")],
                  ...data.charts.months.map((m) => [m.label, m.income, m.cost]),
                ]),
            }
          : {})}
      />
    </ChartMetricCard>
  )
}

/** Metric-Chart-Card (amounts and list) and Metric-Map-Card (map and list). */
function MetricLargePreview({ kind }: { kind: "chart" | "map" }) {
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  if (kind === "chart" && data) {
    const { finance, charts } = data
    const income = trendOf(finance.incomeTrend)
    const max = Math.max(0, ...charts.tasksByProject.map((p) => p.total))
    const items = charts.tasksByProject.map((p) => ({
      name: p.name,
      value: max ? Math.round((p.total / max) * 100) : 0,
      label: formatCount(p.total),
    }))
    return (
      <ChartMetricCard size="lg">
        <ChartMetricHead size="large" title={t("incomeCost")} action={false} />
        <ChartMetricBody layout="stack" className="pt-5">
          <ChartMetricAmounts>
            <ChartMetricAmount
              size="lg"
              tone="purple"
              heading={t("income")}
              value={formatUsd(finance.income)}
              delta={income.trend}
              deltaDirection={income.trendDirection}
              additionalText={t("last30")}
            />
            <ChartMetricAmount size="lg" tone="orange" heading={t("cost")} value={formatUsd(finance.cost)} delta="" additionalText="" />
          </ChartMetricAmounts>
          {items.length ? <ChartMetricList items={items} heading={t("tasksByProject")} countHeading={t("tasks")} /> : null}
        </ChartMetricBody>
        <ChartMetricActions
          size="lg"
          divider={false}
          viewMoreHref={VIEW_MORE_HREF}
          onDownload={() =>
            downloadCsv("tasks-by-project.csv", [
              ["Project", t("tasks")],
              ...charts.tasksByProject.map((p) => [p.name, p.total]),
            ])
          }
        />
      </ChartMetricCard>
    )
  }
  return (
    <ChartMetricCard size="lg">
      <ChartMetricHead size="large" title={kind === "chart" ? "Line Chart Sample" : "Map"} action={!data} />
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
  const t = useTranslations("widgets.data")
  const data = useWidgetData()
  const items = data
    ? [
        { heading: t("projects"), value: formatCount(data.totals.projects), icon: "/icons/material/material-assignment.svg" },
        { heading: t("tasks"), value: formatCount(data.totals.tasks), icon: "/icons/material/material-restore-page.svg" },
        { heading: t("members"), value: formatCount(data.totals.members), icon: "/icons/material-account-circle.svg" },
        { heading: t("files"), value: formatCount(data.totals.files), icon: "/icons/material-file-download.svg" },
        {
          icon: "/icons/material-account-balance-wallet.svg",
          heading: t("income"),
          value: formatUsd(data.finance.income),
          delta: trendOf(data.finance.incomeTrend).trend,
          deltaDirection: trendOf(data.finance.incomeTrend).trendDirection,
          additionalText: t("last30"),
        },
      ]
    : undefined
  return (
    <ChartMetricCard size="wide">
      <ChartMetricWideBody items={items} />
      {data ? (
        <ChartMetricFooter
          size="wide"
          primary={t("profit")}
          amount={formatUsd(data.finance.profit)}
          up={data.finance.profitTrend > 0 ? trendOf(data.finance.profitTrend).trend : ""}
          down={data.finance.profitTrend < 0 ? trendOf(data.finance.profitTrend).trend : ""}
          link={t("viewProjects")}
          linkHref="/dashboard/projects"
        />
      ) : (
        <ChartMetricFooter size="wide" link="Heading" />
      )}
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
  { id: "candle-chart", demoOnly: true /* no project data source */, category: "charts", icon: ICON("balance"), keywords: ["candle", "stock", "finance"], preview: <CartesianCardPreview kind="candle" legend="none" wide={true} tall={true} /> },
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
  { id: "metric-map", demoOnly: true /* no project data source */, category: "metrics", icon: ICON("language"), keywords: ["metric", "map", "countries", "geo"], preview: <MetricLargePreview kind="map" /> },
  { id: "metric-card", category: "metrics", icon: ICON("account-balance-wallet"), keywords: ["metric", "kpi", "wide", "strip"], preview: <MetricWidePreview />, size: "full" },
  { id: "table", category: "tables", icon: ICON("list"), keywords: ["table", "grid", "products", "rows", "data", "orders"], preview: <div className="w-210"><ProductTable /></div>, size: "full", board: <ProjectsTableWidget /> },
]

const widgetsById = new Map(widgetCatalog.map((w) => [w.id, w]))
const getWidget = (id: string) => widgetsById.get(id)
const widgetSize = (id: string): WidgetSize => getWidget(id)?.size ?? "lg"
const isFullWidget = (id: string) => widgetSize(id) === "full"

const widgetCategories: WidgetCategory[] = ["charts", "metrics", "tables"]

export { getWidget, isFullWidget, widgetSize, widgetCatalog, widgetCategories }
export type { WidgetCategory, WidgetDef, WidgetSize }
