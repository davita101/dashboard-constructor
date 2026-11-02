import { CartesianChart, type CartesianKind } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"
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
import { cn } from "@/lib/utils"

// Mirrors the Figma Charts Cards page (9903:12833): every chart as a card, light and dark ("White") appearance.

type Legend = "months" | "labels" | "slices" | "views" | "none"
type CardDef = {
  name: string
  title: string
  kind: CartesianKind | "donut" | "pie" | "progress" | "progress-half"
  legend: Legend
  /** vertical legend (two or three rows) */
  vertical?: boolean
  tooltip?: boolean
}

const cards: CardDef[] = [
  { name: "Line-Chart", title: "Line Chart Sample", kind: "line", legend: "months", tooltip: true },
  { name: "Line-Gradient-Chart", title: "Line Chart Sample", kind: "line-gradient", legend: "months", tooltip: true },
  { name: "Line-Area-Chart", title: "Line Chart Sample", kind: "line-area", legend: "months", tooltip: true },
  { name: "Line-Step-Chart", title: "Line Step Chart", kind: "line-step", legend: "labels", vertical: true, tooltip: true },
  { name: "Column-Type-1-Chart", title: "Column Chart Card", kind: "column-1", legend: "labels" },
  { name: "Column-Type-2-Chart", title: "Column Chart Card", kind: "column-2", legend: "months", tooltip: true },
  { name: "Column-Type-3-Chart", title: "Column Chart Card", kind: "column-3", legend: "months", tooltip: true },
  { name: "Column-Type-4-Chart", title: "Column Chart Card", kind: "column-4", legend: "labels" },
  { name: "Column-Type-5-Chart", title: "Column Chart Card", kind: "column-5", legend: "months", tooltip: true },
  { name: "Column-Type-6-Chart", title: "Column Chart Card", kind: "column-6", legend: "months", tooltip: true },
  { name: "Bar-Chart", title: "Column Chart Card", kind: "bar", legend: "none" },
  { name: "Bar-Double-Chart", title: "Column Chart Card", kind: "bar-double", legend: "none" },
  { name: "Bar-Stacked-Chart", title: "Bar Stacked Chart", kind: "bar-stacked", legend: "none" },
  { name: "Bar-Negative-Values-Chart", title: "Bar Negative Chart", kind: "bar-negative", legend: "none" },
  { name: "Candle-Chart", title: "Candle Chart Card", kind: "candle", legend: "none" },
  { name: "Donut-Chart", title: "Chart Donut", kind: "donut", legend: "slices" },
  { name: "Pie-Chart", title: "Chart Pie", kind: "pie", legend: "slices" },
  { name: "Progress-Chart", title: "Progress Chart", kind: "progress", legend: "slices", vertical: true },
  { name: "Progress-Half-Chart", title: "Progress Half Chart Card", kind: "progress-half", legend: "months" },
]

const legends = {
  months: undefined,
  labels: [
    { label: "Label", tone: "primary" },
    { label: "Label", tone: "orange" },
    { label: "Label", tone: "purple" },
  ],
  slices: [
    { label: "Label", tone: "blue" },
    { label: "Label", tone: "green" },
    { label: "Label", tone: "orange" },
  ],
  views: [{ label: "Views", tone: "blue" }],
  none: undefined,
} as const

const lightLegends = {
  "Progress-Half-Chart": [
    { label: "Views", tone: "blue" },
    { label: "Visits", tone: "gray" },
  ],
} as const

const sliceLegend = [
  { label: "Views", tone: "purple" },
  { label: "Visits", tone: "green" },
  { label: "Last Month", tone: "blue" },
  { label: "Label", tone: "orange" },
  { label: "Label", tone: "yellow" },
] as const

const darkTitles: Record<string, string> = {
  "Line-Step-Chart": "Line Step Chart",
  "Candle-Chart": "Chart Pie Image",
  "Donut-Chart": "Chart Donut Image",
  "Pie-Chart": "Chart Pie Image",
  "Progress-Chart": "Progress Chart Image",
  "Progress-Half-Chart": "Progress Half Chart",
}

const darkChart =
  "[&_.recharts-cartesian-axis-tick_text]:fill-white-alpha-80 [&_.recharts-cartesian-grid_line]:stroke-white-alpha-15"

function Plot({ def, dark }: { def: CardDef; dark: boolean }) {
  const { kind } = def
  if (kind === "donut" || kind === "pie") {
    return (
      <ChartCardPlot inset="none" className="py-4">
        <RadialChart preset="card" kind={kind} count={kind === "donut" ? 4 : 7} className="size-49" />
      </ChartCardPlot>
    )
  }
  if (kind === "progress") {
    return (
      <ChartCardPlot inset="none" className="py-4">
        <RadialChart preset="card" kind="progress" text className="size-66" />
      </ChartCardPlot>
    )
  }
  if (kind === "progress-half") {
    return (
      <ChartCardPlot className="py-4">
        <RadialChart preset="card" kind="progress-half" text className="h-33 w-66" />
      </ChartCardPlot>
    )
  }
  const horizontal = kind.startsWith("bar")
  const wide = dark || horizontal || kind === "candle"
  return (
    <ChartCardPlot inset={wide ? "none" : "md"}>
      <CartesianChart
        preset="card"
        kind={kind}
        tooltip={def.tooltip && !horizontal}
        className={cn(horizontal ? "h-97" : "h-79", wide ? "w-70" : "w-66", dark && darkChart)}
      />
    </ChartCardPlot>
  )
}

function SampleCard({ def, dark }: { def: CardDef; dark: boolean }) {
  const legend =
    def.name === "Progress-Half-Chart"
      ? dark
        ? legends.views
        : lightLegends["Progress-Half-Chart"]
      : dark && (def.kind === "donut" || def.kind === "pie" || def.kind === "progress")
        ? sliceLegend
        : legends[def.legend]
  return (
    <ChartCard appearance={dark ? "dark" : "default"}>
      <ChartCardHead>
        <ChartCardTitle>{dark ? (darkTitles[def.name] ?? def.title) : def.title}</ChartCardTitle>
        <ChartCardAction />
      </ChartCardHead>
      <ChartCardContent>
        <ChartCardSwitcher />
        <ChartCardMetrics />
        <Plot def={def} dark={dark} />
        {def.legend !== "none" ? (
          <ChartCardLegend type={def.vertical ? "vertical" : "horizontal"} items={legend ? [...legend] : undefined} />
        ) : null}
      </ChartCardContent>
      <ChartCardFooter />
    </ChartCard>
  )
}

export default function ChartCardPreviewPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-12 p-8">
      {[false, true].map((dark) => (
        <section key={String(dark)} className="flex flex-col gap-6">
          <h2 className="font-default text-14 leading-24 font-bold text-base-800">
            {dark ? "Chart-White-Card (dark image)" : "Chart-Card"}
          </h2>
          <div className="flex flex-wrap items-start gap-8">
            {cards.map((def) => (
              <div key={def.name} className="flex flex-col gap-2">
                <p className="font-default text-12 leading-20 text-base-500">
                  {def.name.replace("Chart", dark ? "Chart-White-Card" : "Chart-Card")}
                </p>
                <SampleCard def={def} dark={dark} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
