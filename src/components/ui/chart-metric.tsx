import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { ChartDot, ChartProgressCard, ChartTrend, type ChartTone } from "@/components/ui/chart-parts"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Charts Metrics page (9880:5306): metric cards. Every card is a ChartMetricCard
// (Type Default / Image) with Head, Body and Footer slots; the chart itself is a part from chart-parts.

const maskIcon = "shrink-0 bg-current mask-contain mask-center mask-no-repeat"

/* ---------------------------------- Card ---------------------------------- */

const chartMetricCardVariants = cva("group/metric relative flex flex-col overflow-hidden font-default outline -outline-offset-1", {
  variants: {
    appearance: {
      default: "bg-background-0 outline-background-100",
      image: "bg-linear-to-b from-black from-55% to-blue-800 outline-white-alpha-10",
    },
    size: {
      sm: "w-57.5 rounded-r20",
      md: "w-60 rounded-r20",
      lg: "w-80 rounded-r20",
      // Sign-In "New Features" tiles: 250x164, footer clipped by the fixed height.
      tile: "h-41 w-full min-w-0 rounded-r20 lg:max-w-62.5",
      wide: "w-196.25 rounded-r16 data-[appearance=image]:outline-white-alpha-20",
    },
  },
  defaultVariants: { appearance: "default", size: "md" },
})

type ChartMetricCardProps = Omit<React.ComponentProps<"div">, "style"> & VariantProps<typeof chartMetricCardVariants>

/** Figma Metric-*-Card: Type Default (white card) / Image (dark card on a picture). Width sm 230, md 240, lg 320, wide 785. */
function ChartMetricCard({ className, appearance = "default", size = "md", ...props }: ChartMetricCardProps) {
  return (
    <div
      data-slot="chart-metric-card"
      data-appearance={appearance}
      className={cn(chartMetricCardVariants({ appearance, size }), className)}
      {...props}
    />
  )
}

/* ---------------------------------- Head ---------------------------------- */

const chartMetricHeadVariants = cva("flex items-start justify-between", {
  variants: {
    size: {
      compact: "h-9 px-4 pt-4",
      large: "h-14 px-5 pt-5 pb-4",
    },
  },
  defaultVariants: { size: "compact" },
})

type ChartMetricHeadProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof chartMetricHeadVariants> & { title?: React.ReactNode; icon?: React.ReactNode }

/** Figma Head: icon + title and the more button (more_horiz in compact cards, more_vert in large ones). */
function ChartMetricHead({ className, size = "compact", title = "Heading", icon, ...props }: ChartMetricHeadProps) {
  return (
    <div data-slot="chart-metric-head" className={cn(chartMetricHeadVariants({ size }), className)} {...props}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-12 leading-20 font-bold text-base-700 group-data-[appearance=image]/metric:text-background-0">
          {title}
        </span>
      </div>
      <span
        aria-hidden
        className={cn(
          "size-5 text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70",
          maskIcon,
          size === "large" ? "mask-[url(/icons/material-more-vert.svg)]" : "mask-[url(/icons/material-more-horiz.svg)]",
        )}
      />
    </div>
  )
}

/* ---------------------------------- Body ---------------------------------- */

const chartMetricBodyVariants = cva("flex", {
  variants: {
    layout: {
      split: "gap-5 px-6 py-4",
      stack: "flex-col gap-7 p-5",
      // 128px Content of the Sign-In tiles: stats and chart side by side, vertically centered.
      tile: "h-32 items-center gap-4 px-4",
    },
  },
  defaultVariants: { layout: "split" },
})

/** Figma Content: `split` = stats on the left, chart on the right; `stack` = metrics, chart and list in a column. */
function ChartMetricBody({
  className,
  layout = "split",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof chartMetricBodyVariants>) {
  return <div data-slot="chart-metric-body" className={cn(chartMetricBodyVariants({ layout }), className)} {...props} />
}

/* ---------------------------------- Stats (left column) ---------------------------------- */

type ChartMetricStatsProps = React.ComponentProps<"div"> & {
  value?: string
  heading?: string
  up?: string
  down?: string
  icon?: React.ReactNode
}

/** Figma Content (69x144): leading icon, then value, caption and the Up / Down trend rows. */
function ChartMetricStats({
  className,
  value = "72,550",
  heading = "Heading",
  up = "Text",
  down = "Text",
  icon,
  ...props
}: ChartMetricStatsProps) {
  return (
    <div data-slot="chart-metric-stats" className={cn("flex h-36 w-17.25 shrink-0 flex-col justify-between", className)} {...props}>
      <span className="flex size-6 items-center">{icon}</span>
      <div className="flex flex-col gap-2">
        <span className="text-20 leading-28 font-semibold text-base-900 group-data-[appearance=image]/metric:text-background-0">
          {value}
        </span>
        {heading && (
          <span className="text-10 leading-16 font-bold text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70">
            {heading}
          </span>
        )}
        {up && <ChartTrend direction="up" size="md">{up}</ChartTrend>}
        {down && <ChartTrend direction="down" size="md">{down}</ChartTrend>}
      </div>
    </div>
  )
}

/** Figma chart slot of the compact cards (right column, chart sits at the bottom). */
function ChartMetricChart({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chart-metric-chart" className={cn("flex min-w-0 flex-1 items-end justify-end", className)} {...props} />
}

/* ---------------------------------- Footer (compact) ---------------------------------- */

const chartMetricFooterVariants = cva("flex items-center gap-2", {
  variants: {
    size: {
      compact:
        "h-12 px-4 outline -outline-offset-1 bg-background-20 outline-background-100 group-data-[appearance=image]/metric:bg-white-alpha-5 group-data-[appearance=image]/metric:outline-0",
      wide: "h-10 px-5 py-3 bg-background-0 outline -outline-offset-1 outline-background-100 group-data-[appearance=image]/metric:bg-transparent group-data-[appearance=image]/metric:outline-white-alpha-20",
    },
  },
  defaultVariants: { size: "compact" },
})

type ChartMetricFooterProps = React.ComponentProps<"div"> &
  VariantProps<typeof chartMetricFooterVariants> & {
    primary?: string
    secondary?: string
    up?: string
    down?: string
    link?: string
  }

/** Figma Footer: two headings and the Up / Down trends; `wide` adds the blue Link on the right. */
function ChartMetricFooter({
  className,
  size = "compact",
  primary = "Heading",
  secondary,
  up = "Text",
  down = "Text",
  link,
  ...props
}: ChartMetricFooterProps) {
  const wide = size === "wide"
  return (
    <div data-slot="chart-metric-footer" className={cn(chartMetricFooterVariants({ size }), className)} {...props}>
      <span
        className={cn(
          "text-10 leading-16 font-semibold",
          wide
            ? "font-bold text-base-700 group-data-[appearance=image]/metric:text-background-0"
            : "text-blue-600 group-data-[appearance=image]/metric:text-background-0",
        )}
      >
        {primary}
      </span>
      {wide ? null : (
        <span className="text-10 leading-16 font-semibold text-base-700 group-data-[appearance=image]/metric:text-white-alpha-50">
          {secondary ?? "Heading"}
        </span>
      )}
      <ChartTrend direction="up" className="gap-2 font-semibold">{up}</ChartTrend>
      <ChartTrend direction="down" className="gap-2 font-semibold">{down}</ChartTrend>
      {link ? <span className="ml-auto text-10 leading-16 font-bold text-blue-600">{link}</span> : null}
    </div>
  )
}

/* ---------------------------------- Amount (Revenue cards) ---------------------------------- */

const chartMetricAmountValueVariants = cva("font-semibold text-base-800 group-data-[appearance=image]/metric:text-background-0", {
  variants: {
    size: {
      md: "text-20 leading-28",
      lg: "text-24 leading-36",
    },
  },
  defaultVariants: { size: "md" },
})

type ChartMetricAmountProps = React.ComponentProps<"div"> &
  VariantProps<typeof chartMetricAmountValueVariants> & {
    tone?: ChartTone
    heading?: string
    value?: string
    delta?: string
    additionalText?: string
  }

/** Figma Amount (Head dot + heading, value, Up delta, Additional Text). */
function ChartMetricAmount({
  className,
  size = "md",
  tone = "pink",
  heading = "Revenue",
  value = "$20,560",
  delta = "4.2%",
  additionalText = "vs. $19.432 last",
  ...props
}: ChartMetricAmountProps) {
  return (
    <div data-slot="chart-metric-amount" className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex items-center gap-2">
        <ChartDot tone={tone} shade={600} />
        <span className="text-10 leading-16 font-bold text-base-500 group-data-[appearance=image]/metric:text-white-alpha-50">
          {heading}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className={chartMetricAmountValueVariants({ size })}>{value}</span>
        <ChartTrend direction="up" className="gap-2">{delta}</ChartTrend>
      </div>
      <span className="text-10 leading-16 font-bold text-base-400 group-data-[appearance=image]/metric:text-white-alpha-50">
        {additionalText}
      </span>
    </div>
  )
}

/** Figma Metrics row: Amount 1…n side by side. */
function ChartMetricAmounts({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chart-metric-amounts" className={cn("flex gap-10", className)} {...props} />
}

/* ---------------------------------- Plot + Tooltip ---------------------------------- */

/** Figma 280x96 chart canvas: stacked chart parts plus a tooltip. */
function ChartMetricPlot({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="chart-metric-plot" className={cn("relative h-24 w-70 [&>svg]:absolute [&>svg]:inset-x-0 [&>svg]:bottom-0 [&>svg]:size-full", className)} {...props} />
}

/** Figma Tooltip (54x32): dark bubble with a caret; Image cards use the white one. */
function ChartMetricTooltip({ className, children = "$345", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-metric-tooltip"
      role="tooltip"
      className={cn(
        "absolute flex h-8 min-w-13.5 items-center justify-center rounded-r8 bg-base-900 px-3 text-11 leading-20 font-bold text-background-0",
        "group-data-[appearance=image]/metric:bg-background-0 group-data-[appearance=image]/metric:text-base-900",
        "after:absolute after:top-full after:left-1/2 after:size-2 after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:rounded-r2 after:bg-inherit",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ---------------------------------- List ---------------------------------- */

const listColors = ["blue", "rose", "green", "amber", "fuchsia", "lime", "cyan", "purple"] as const

/** Figma Head row + Item 1…8 (Progress-Card with a colored Progress-Line). */
function ChartMetricList({ className, appearance = "default", ...props }: React.ComponentProps<"div"> & { appearance?: "default" | "image" }) {
  return (
    <div data-slot="chart-metric-list" className={cn("flex flex-col gap-4", className)} {...props}>
      <ChartProgressCard type="head" appearance={appearance} className="w-full" />
      {listColors.map((color, i) => (
        <ChartProgressCard key={color} className="w-full" appearance={appearance} color={color} heading={`Name Item ${i + 1}`} value={[92, 76, 64, 48, 28, 16, 12, 6][i]} />
      ))}
    </div>
  )
}

/* ---------------------------------- Actions footer ---------------------------------- */

const chartMetricActionsVariants = cva("flex items-center justify-between", {
  variants: {
    size: {
      md: "h-15 px-6 py-5",
      lg: "h-14 px-5 pt-4 pb-5",
    },
  },
  defaultVariants: { size: "md" },
})

type ChartMetricActionsProps = React.ComponentProps<"div"> &
  VariantProps<typeof chartMetricActionsVariants> & { divider?: boolean }

/** Figma Footer with View More (chevron) and Download (icon) actions. */
function ChartMetricActions({ className, size = "md", divider = true, ...props }: ChartMetricActionsProps) {
  return (
    <div data-slot="chart-metric-actions" className="flex flex-col">
      {divider ? <Separator className="group-data-[appearance=image]/metric:bg-white-alpha-10" /> : null}
      <div className={cn(chartMetricActionsVariants({ size }), className)} {...props}>
        <button
          type="button"
          data-soon
          className="flex items-center gap-4 rounded-r4 text-11 leading-20 font-bold text-base-700 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 group-data-[appearance=image]/metric:text-white-alpha-50"
        >
          View More
          <span aria-hidden className={cn("size-4 mask-[url(/icons/material-chevron-right.svg)]", maskIcon)} />
        </button>
        <button
          type="button"
          data-soon
          className="flex items-center gap-2 rounded-r4 text-11 leading-20 font-bold text-base-700 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 group-data-[appearance=image]/metric:text-background-0"
        >
          <span aria-hidden className={cn("size-4 mask-[url(/icons/material-file-download.svg)]", maskIcon)} />
          Download
        </button>
      </div>
    </div>
  )
}

/* ---------------------------------- Color card ---------------------------------- */

const colorCardTones = [
  "primary", "green", "indigo", "cyan", "orange", "purple", "violet", "lime", "red", "yellow",
  "fuchsia", "blue", "sky", "pink", "rose", "dark", "amber", "teal", "emerald",
] as const
type ChartMetricColorTone = (typeof colorCardTones)[number]

/** Figma Metric-Color-Card colors per Type (solid gradient or Soft alpha fill), as CSS variables of the card. */
function colorCardVars(tone: ChartMetricColorTone, soft: boolean): React.CSSProperties {
  const vars: Record<string, string> = {}
  if (tone === "dark") {
    if (soft) {
      Object.assign(vars, {
        "--mc-bg": "linear-gradient(to bottom, var(--base-alpha-15), var(--base-alpha-5))",
        "--mc-stroke": "var(--base-150)",
        "--mc-footer": "var(--base-150)",
        "--mc-head": "var(--base-600)",
        "--mc-value": "var(--base-700)",
        "--mc-trend": "var(--base-600)",
        "--mc-footer-title": "var(--base-700)",
        "--mc-footer-text": "var(--base-600)",
      })
    } else {
      Object.assign(vars, {
        "--mc-bg": "linear-gradient(to bottom, var(--base-900), var(--base-800))",
        "--mc-stroke": "transparent",
        "--mc-footer": "var(--black-alpha-10)",
        "--mc-head": "var(--base-200)",
        "--mc-value": "var(--background-50)",
        "--mc-trend": "var(--base-300)",
        "--mc-footer-title": "var(--background-50)",
        "--mc-footer-text": "var(--base-200)",
      })
    }
  } else if (soft) {
    Object.assign(vars, {
      "--mc-bg": `linear-gradient(to bottom, var(--${tone}-alpha-15), var(--${tone}-alpha-5))`,
      "--mc-stroke": `var(--${tone}-alpha-10)`,
      "--mc-footer": `var(--${tone}-alpha-10)`,
      "--mc-head": `var(--${tone}-600)`,
      "--mc-value": `var(--${tone}-700)`,
      "--mc-trend": `var(--${tone}-600)`,
      "--mc-footer-title": `var(--${tone}-700)`,
      "--mc-footer-text": `var(--${tone}-600)`,
    })
  } else {
    Object.assign(vars, {
      "--mc-bg": `linear-gradient(to bottom, var(--${tone}-700), var(--${tone}-550))`,
      "--mc-stroke": "transparent",
      "--mc-footer": "var(--black-alpha-10)",
      "--mc-head": `var(--${tone}-200)`,
      "--mc-value": `var(--${tone}-50)`,
      "--mc-trend": `var(--${tone}-300)`,
      "--mc-footer-title": `var(--${tone}-50)`,
      "--mc-footer-text": `var(--${tone}-200)`,
    })
  }
  return vars as React.CSSProperties
}

type ChartMetricColorCardProps = Omit<React.ComponentProps<"div">, "style"> & {
  tone?: ChartMetricColorTone
  soft?: boolean
  heading?: string
  value?: string
  up?: string
  down?: string
}

/** Figma Metric-Color-Card (345x166): Type = hue, solid or Soft. */
function ChartMetricColorCard({
  className,
  tone = "primary",
  soft = false,
  heading = "Heading",
  value = "72,550",
  up = "Text",
  down = "Text",
  ...props
}: ChartMetricColorCardProps) {
  return (
    <div
      data-slot="chart-metric-color-card"
      data-tone={tone}
      data-soft={soft || undefined}
      style={colorCardVars(tone, soft)}
      className={cn(
        "flex w-86.25 flex-col overflow-hidden rounded-r20 font-default bg-(image:--mc-bg) outline -outline-offset-1 outline-(--mc-stroke)",
        className,
      )}
      {...props}
    >
      <div className="flex gap-5 p-5">
        <span aria-hidden className={cn("size-6 text-(--mc-head)", maskIcon, "mask-[url(/icons/material-default-icon.svg)]")} />
        <div className="flex flex-col gap-3 pr-16.5">
          <div className="flex items-center gap-2">
            <span aria-hidden className={cn("size-5 text-(--mc-head)", maskIcon, "mask-[url(/icons/material-default-icon.svg)]")} />
            <span className="text-10 leading-16 font-bold text-(--mc-head)">{heading}</span>
          </div>
          <div className="flex items-center gap-3.25">
            <span className="text-20 leading-28 font-semibold text-(--mc-value)">{value}</span>
            <ChartTrend direction="up" size="md" className="text-(--mc-trend)">{up}</ChartTrend>
            <ChartTrend direction="down" size="md" className="text-(--mc-trend)">{down}</ChartTrend>
          </div>
          <span className="text-10 leading-16 font-bold text-(--mc-head)">{heading}</span>
        </div>
      </div>
      <div className="flex h-9.5 items-center gap-2 bg-(--mc-footer) px-4">
        <span className="text-10 leading-16 font-semibold text-(--mc-footer-title)">Heading</span>
        <span className="text-10 leading-16 font-semibold text-(--mc-footer-text)">Heading</span>
        <ChartTrend direction="up" className="gap-2 font-semibold text-(--mc-trend)">{up}</ChartTrend>
        <ChartTrend direction="down" className="gap-2 font-semibold text-(--mc-trend)">{down}</ChartTrend>
      </div>
    </div>
  )
}

/* ---------------------------------- Wide card inline content ---------------------------------- */

/** Figma Metric-Card Content (785x128): icon, Head, value row (value, caption, Up, Down), caption. */
function ChartMetricWideBody({
  className,
  heading = "Heading",
  value = "72,550",
  up = "Text",
  down = "Text",
  ...props
}: React.ComponentProps<"div"> & { heading?: string; value?: string; up?: string; down?: string }) {
  return (
    <div data-slot="chart-metric-wide-body" className={cn("flex gap-5 p-5", className)} {...props}>
      <span aria-hidden className={cn("size-5 text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70", maskIcon, "mask-[url(/icons/material-default-icon.svg)]")} />
      <div className="flex flex-col gap-3 pr-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className={cn("size-5 text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70", maskIcon, "mask-[url(/icons/material-default-icon.svg)]")} />
          <span className="text-10 leading-16 font-bold text-base-700 group-data-[appearance=image]/metric:text-background-0">{heading}</span>
        </div>
        <div className="flex items-center gap-3.25">
          <span className="text-20 leading-28 font-semibold text-base-900 group-data-[appearance=image]/metric:text-background-0">{value}</span>
          <span className="text-10 leading-16 font-bold text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70">{heading}</span>
          <ChartTrend direction="up" size="md">{up}</ChartTrend>
          <ChartTrend direction="down" size="md">{down}</ChartTrend>
        </div>
        <span className="text-10 leading-16 font-bold text-base-500 group-data-[appearance=image]/metric:text-white-alpha-70">{heading}</span>
      </div>
    </div>
  )
}

export {
  ChartMetricActions,
  ChartMetricAmount,
  ChartMetricAmounts,
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricColorCard,
  ChartMetricFooter,
  ChartMetricHead,
  ChartMetricList,
  ChartMetricPlot,
  ChartMetricStats,
  ChartMetricTooltip,
  ChartMetricWideBody,
  chartMetricCardVariants,
  colorCardTones,
}
export type { ChartMetricColorTone }
