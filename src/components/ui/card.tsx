import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { ChartDot, ChartTrend, type ChartShade, type ChartTone } from "@/components/ui/chart-parts"
import { Link, LinkIcon } from "@/components/ui/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; variant?: "default" | "panel" | "stat" | "item" | "tile" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[variant=panel]:rounded-none data-[variant=panel]:bg-background-0 data-[variant=panel]:py-0 data-[variant=panel]:ring-0 data-[variant=panel]:outline data-[variant=panel]:outline-background-100 data-[variant=panel]:-outline-offset-1 md:data-[variant=panel]:rounded-r20 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 data-[variant=stat]:h-16 data-[variant=stat]:flex-row data-[variant=stat]:items-center data-[variant=stat]:justify-between data-[variant=stat]:rounded-r36 data-[variant=stat]:bg-background-0 data-[variant=stat]:py-0 data-[variant=stat]:ps-7 data-[variant=stat]:pe-5 data-[variant=stat]:ring-0 data-[variant=stat]:outline data-[variant=stat]:outline-background-100 data-[variant=stat]:-outline-offset-1 data-[variant=item]:gap-0 data-[variant=item]:rounded-r12 data-[variant=item]:bg-background-0 data-[variant=item]:p-2 data-[variant=item]:ring-0 data-[variant=item]:outline data-[variant=item]:outline-background-100 data-[variant=item]:-outline-offset-1 data-[variant=tile]:gap-0 data-[variant=tile]:rounded-r16 data-[variant=tile]:bg-background-0 data-[variant=tile]:py-0 data-[variant=tile]:ring-0 data-[variant=tile]:outline data-[variant=tile]:outline-background-100 data-[variant=tile]:-outline-offset-1 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

/* ---------------------------------- Chart-Card ---------------------------------- */

// Figma Charts Cards page (9903:12833): 320px card, Head (icon, title, more), Content (switcher,
// metrics, chart, legend) and Footer (View More, Download). `dark` is the "White" card on a black image.
const chartCardVariants = cva("group/chart-card flex w-80 flex-col font-default overflow-hidden rounded-r20 outline -outline-offset-1", {
  variants: {
    appearance: {
      default: "bg-background-0 outline-background-100",
      dark: "bg-linear-to-b from-black from-75% to-blue-900 outline-white-alpha-10",
    },
  },
  defaultVariants: { appearance: "default" },
})

function ChartCard({
  className,
  appearance = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof chartCardVariants>) {
  return (
    <div
      data-slot="chart-card"
      data-appearance={appearance}
      className={cn(chartCardVariants({ appearance }), className)}
      {...props}
    />
  )
}

function ChartCardHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="chart-card-head" className={cn("flex items-center justify-between px-5 pt-5 pb-2", className)} {...props} />
  )
}

function ChartCardTitle({
  className,
  icon = "/icons/material-bar_chart.svg",
  children,
  ...props
}: React.ComponentProps<"div"> & { icon?: string }) {
  return (
    <div data-slot="chart-card-title" className={cn("flex items-center gap-2", className)} {...props}>
      {icon ? (
        <span
          aria-hidden
          className="size-5 shrink-0 bg-base-700 mask-(--chart-card-icon) mask-contain mask-center mask-no-repeat group-data-[appearance=dark]/chart-card:bg-background-0"
          style={{ "--chart-card-icon": `url(${icon})` } as React.CSSProperties}
        />
      ) : null}
      <span className="font-default text-11 leading-20 font-bold text-base-700 group-data-[appearance=dark]/chart-card:text-background-0">
        {children}
      </span>
    </div>
  )
}

function ChartCardAction({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="chart-card-action"
      aria-label="More"
      className={cn(
        "size-5 shrink-0 cursor-pointer bg-base-700 mask-[url(/icons/material-more-horiz.svg)] mask-contain mask-center mask-no-repeat outline-0 focus-visible:bg-primary-500 group-data-[appearance=dark]/chart-card:bg-background-0",
        className
      )}
      {...props}
    />
  )
}

function ChartCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chart-card-content" className={cn("flex flex-col gap-4 p-5", className)} {...props} />
}

const chartCardRanges = ["Hour", "Day", "Week", "Month"]

function ChartCardSwitcher({
  className,
  items = chartCardRanges,
  defaultValue,
  ...props
}: Omit<React.ComponentProps<typeof Tabs>, "children"> & { items?: string[] }) {
  return (
    <Tabs data-slot="chart-card-switcher" defaultValue={defaultValue ?? items[0]} className={cn("w-fit", className)} {...props}>
      <TabsList
        variant="pill"
        size="sm"
        className="bg-background-20 outline -outline-offset-1 outline-background-100 group-data-[appearance=dark]/chart-card:bg-black-alpha-50 group-data-[appearance=dark]/chart-card:outline-0"
      >
        {items.map((item) => (
          <TabsTrigger key={item} value={item}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

type ChartCardMetricData = {
  tone: ChartTone
  shade?: ChartShade
  heading: string
  value: string
  /** "" hides the trend row. */
  trend: string
  /** Arrow and color of the trend; default up. */
  trendDirection?: "up" | "down"
  additionalText: string
}

const chartCardMetricData: ChartCardMetricData[] = [
  { tone: "pink", heading: "Revenue", value: "$20,560", trend: "4.2%", additionalText: "vs. $19.432 last" },
  { tone: "blue", heading: "Views", value: "32,540", trend: "1,05%", additionalText: "vs. 28,540 last" },
  { tone: "violet", heading: "Sales", value: "645", trend: "4.2%", additionalText: "vs. 585 last" },
]

function ChartCardMetrics({
  className,
  items = chartCardMetricData,
  ...props
}: React.ComponentProps<"div"> & { items?: ChartCardMetricData[] }) {
  return (
    <div data-slot="chart-card-metrics" className={cn("flex h-24 gap-6 overflow-hidden", className)} {...props}>
      {items.map((item) => (
        <div key={item.heading} data-slot="chart-card-metric" className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ChartDot tone={item.tone} shade={item.shade ?? 600} />
            <span className="text-10 leading-16 font-bold text-base-500 group-data-[appearance=dark]/chart-card:text-white-alpha-50">
              {item.heading}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-20 leading-28 font-semibold text-base-800 group-data-[appearance=dark]/chart-card:text-background-0">
              {item.value}
            </span>
            {item.trend ? <ChartTrend direction={item.trendDirection ?? "up"}>{item.trend}</ChartTrend> : null}
          </div>
          <span className="text-10 leading-16 font-bold text-base-400 group-data-[appearance=dark]/chart-card:text-white-alpha-50">
            {item.additionalText}
          </span>
        </div>
      ))}
    </div>
  )
}

// Chart area. `inset` is the plot padding: Figma pads 8 on the light card, 0 on the dark one.
const chartCardPlotVariants = cva("flex justify-center", {
  variants: {
    inset: {
      none: "px-0 py-4",
      md: "px-2 py-4",
    },
  },
  defaultVariants: { inset: "md" },
})

function ChartCardPlot({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof chartCardPlotVariants>) {
  return <div data-slot="chart-card-plot" className={cn(chartCardPlotVariants({ inset }), className)} {...props} />
}

type ChartCardLegendItem = { label: string; tone: ChartTone; shade?: ChartShade }

const chartCardLegendData: ChartCardLegendItem[] = [
  { label: "Month", tone: "pink" },
  { label: "Avr. Month", tone: "orange" },
  { label: "Last Month", tone: "green" },
]

const chartCardLegendVariants = cva("flex px-5", {
  variants: {
    type: {
      horizontal: "flex-row flex-wrap items-center justify-center gap-4",
      vertical: "flex-col items-center gap-3",
    },
  },
  defaultVariants: { type: "horizontal" },
})

function ChartCardLegend({
  className,
  type,
  items = chartCardLegendData,
  ...props
}: React.ComponentProps<"ul"> & VariantProps<typeof chartCardLegendVariants> & { items?: ChartCardLegendItem[] }) {
  return (
    <ul data-slot="chart-card-legend" className={cn(chartCardLegendVariants({ type }), className)} {...props}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <ChartDot tone={item.tone} shade={item.shade ?? 600} />
          <span className="text-10 leading-16 font-semibold text-base-700 group-data-[appearance=dark]/chart-card:text-white-alpha-70">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ChartCardFooter({
  className,
  viewMoreHref,
  onDownload,
  ...props
}: React.ComponentProps<"div"> & { viewMoreHref?: string; onDownload?: () => void }) {
  return (
    <div
      data-slot="chart-card-footer"
      className={cn(
        "flex items-center justify-between gap-4 border-t border-background-100 p-5 group-data-[appearance=dark]/chart-card:border-transparent",
        className
      )}
      {...props}
    >
      <Link
        href={viewMoreHref ?? "#"}
        variant="700"
        size="11"
        className="group-data-[appearance=dark]/chart-card:text-white-alpha-70"
      >
        View More
        <LinkIcon icon="/icons/material-chevron-right.svg" />
      </Link>
      <Link
        {...(onDownload
          ? { render: <button type="button" onClick={onDownload} /> }
          : { href: "#" })}
        variant="blue"
        size="11"
        className="group-data-[appearance=dark]/chart-card:text-background-0"
      >
        <LinkIcon icon="/icons/material-file-download.svg" />
        Download
      </Link>
    </div>
  )
}

const cardStatValueVariants = cva("font-default", {
  variants: {
    // 20: Projects KPI Item. 30: project page stat tile (Figma 30/400, centered in the 100px content).
    size: {
      "20": "text-20 leading-28 font-medium",
      "30": "text-30 leading-48 font-normal",
    },
    tone: {
      default: "text-base-700",
      blue: "text-blue-600",
      yellow: "text-yellow-600",
      green: "text-green-600",
      red: "text-danger-600",
    },
  },
  compoundVariants: [{ size: "20", tone: "default", className: "text-base-800" }],
  defaultVariants: { size: "20", tone: "default" },
})

/** Card `stat` / `tile`: the number. Size 20/28 medium (KPI Item) or 30/48 regular (stat tile); `tone` colors the number. */
function CardStatValue({
  className,
  size,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof cardStatValueVariants>) {
  return <span data-slot="card-stat-value" className={cn(cardStatValueVariants({ size, tone }), className)} {...props} />
}

/** Card `stat`: the label after the number, 11/20 bold. */
function CardStatLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="card-stat-label" className={cn("font-default text-11 leading-20 font-bold text-base-700", className)} {...props} />
}

export {
  Card,
  CardStatValue,
  CardStatLabel,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ChartCard,
  ChartCardHead,
  ChartCardTitle,
  ChartCardAction,
  ChartCardContent,
  ChartCardSwitcher,
  ChartCardMetrics,
  ChartCardPlot,
  ChartCardLegend,
  ChartCardFooter,
  chartCardVariants,
  chartCardPlotVariants,
  chartCardLegendVariants,
}
