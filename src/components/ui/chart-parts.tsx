import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Progress } from "@/components/ui/progress"
import type { ProgressColor } from "@/components/ui/progress-colors"
import { cn } from "@/lib/utils"

// Figma Charts Components page (5035:13716): the small parts every chart card is built from.

const hues = [
  "primary",
  "green",
  "orange",
  "sky",
  "purple",
  "pink",
  "red",
  "amber",
  "yellow",
  "teal",
  "blue",
  "lime",
  "cyan",
  "emerald",
  "rose",
  "fuchsia",
  "violet",
  "indigo",
  "gray",
] as const

type ChartHue = (typeof hues)[number]
type ChartShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
type ChartWhite = "white" | "white-80" | "white-60" | "white-40" | "white-20"
type ChartTone = ChartHue | "dark" | ChartWhite

/** CSS color of a Figma `Style` (hue + shade, Dark, White and the White alpha steps). */
function toneColor(tone: ChartTone, shade: ChartShade = 500) {
  if (tone === "dark") return "var(--base-900)"
  if (tone === "white") return "var(--background-0)"
  if (tone.startsWith("white-")) return `var(--white-alpha-${tone.slice(6)})`
  return `var(--${tone}-${shade})`
}

function toneAlpha(tone: ChartTone, alpha: 5 | 10 | 15 | 20 | 30) {
  if (tone === "dark") return `var(--base-alpha-${alpha})`
  if (tone === "white") return `var(--white-alpha-${alpha})`
  if (tone.startsWith("white-")) return `var(--white-alpha-${alpha})`
  return `var(--${tone}-alpha-${alpha})`
}

/** Deterministic noise so previews render the same on every load. */
function random(seed: number) {
  let s = seed * 9301 + 49297
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

type Shape = { slope: number; amp: number; wave: number; smooth: boolean }

function curve(shape: Shape, seed: number, count: number) {
  const next = random(seed)
  const phase = next() * Math.PI * 2
  const points: number[] = []
  let noise = 0.5
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1)
    noise = shape.smooth ? 0.5 : noise * 0.35 + next() * 0.65
    const wave = Math.sin(t * Math.PI * 2 * shape.wave + phase) * 0.5 + 0.5
    const value = shape.slope * t + (1 - Math.abs(shape.slope)) * (shape.smooth ? wave : noise) * shape.amp + (1 - shape.amp) * 0.5
    points.push(Math.min(1, Math.max(0, value)))
  }
  return points
}

function linePath(points: number[], width: number, height: number, pad = 2) {
  return points
    .map((p, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * width).toFixed(1)} ${(pad + (1 - p) * (height - pad * 2)).toFixed(1)}`)
    .join(" ")
}

/* ---------------------------------- Chart-Dot ---------------------------------- */

const chartDotVariants = cva("inline-block size-2 shrink-0 rounded-full", {
  variants: {
    type: {
      border: "bg-background-0 outline -outline-offset-1",
      center: "outline -outline-offset-1",
    },
    border: {
      1: "outline-1",
      2: "outline-2",
    },
  },
  defaultVariants: { type: "center", border: 1 },
})

type ChartDotProps = Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof chartDotVariants> & { tone?: ChartTone; shade?: ChartShade }

/** Figma Chart-Dot-Component: 8px dot. Type Color Border = ring on the page color, Color Center = filled dot with a halo. */
function ChartDot({ className, tone = "primary", shade = 600, type = "center", border = 1, style, ...props }: ChartDotProps) {
  const lighter = Math.max(100, shade - 100) as ChartShade
  return (
    <span
      data-slot="chart-dot"
      data-tone={tone}
      aria-hidden
      className={cn(chartDotVariants({ type, border }), className)}
      style={{
        backgroundColor: type === "center" ? toneColor(tone, shade) : undefined,
        outlineColor: type === "center" ? toneColor(tone, lighter) : toneColor(tone, shade),
        ...style,
      }}
      {...props}
    />
  )
}

/* ---------------------------------- Legend ---------------------------------- */

const chartLegendVariants = cva("flex", {
  variants: {
    type: {
      horizontal: "flex-row flex-wrap items-center gap-4",
      vertical: "flex-col items-start gap-3",
    },
  },
  defaultVariants: { type: "horizontal" },
})

const chartLegendLabelVariants = cva("text-10 leading-16", {
  variants: {
    style: {
      default: "text-base-700",
      image: "text-white-alpha-70",
    },
    type: {
      horizontal: "font-semibold",
      vertical: "font-bold",
    },
  },
  defaultVariants: { style: "default", type: "horizontal" },
})

const legendTones: [ChartTone, ChartShade][] = [
  ["primary", 600],
  ["orange", 600],
  ["purple", 600],
  ["yellow", 600],
  ["green", 600],
  ["sky", 600],
  ["pink", 600],
  ["amber", 500],
  ["violet", 600],
  ["cyan", 600],
]

type ChartLegendListProps = React.ComponentProps<"ul"> &
  VariantProps<typeof chartLegendVariants> & {
    style?: never
    appearance?: "default" | "image"
    labels?: string[]
  }

/** Figma Legend-Component: dot + label rows, Type Horizontal / Vertical, Style Default / Image. */
function ChartLegendList({ className, type = "horizontal", appearance = "default", labels, ...props }: ChartLegendListProps) {
  const items = labels ?? legendTones.map(() => "Label")
  return (
    <ul data-slot="chart-legend-list" data-type={type} className={cn(chartLegendVariants({ type }), className)} {...props}>
      {items.map((label, i) => {
        const [tone, shade] = legendTones[i % legendTones.length]
        return (
          <li key={i} className="flex items-center gap-2">
            <ChartDot tone={tone} shade={shade} />
            <span className={chartLegendLabelVariants({ style: appearance, type })}>{label}</span>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------------------------------- Amount ---------------------------------- */

const chartAmountValueVariants = cva("font-semibold", {
  variants: {
    size: {
      12: "text-12 leading-20",
      14: "text-14 leading-24",
      16: "text-16 leading-24",
      18: "text-18 leading-28",
      20: "text-20 leading-28",
      24: "text-24 leading-36",
      30: "text-30 leading-48",
    },
    style: {
      default: "text-base-800",
      image: "text-background-0",
    },
  },
  defaultVariants: { size: 12, style: "default" },
})

const chartAmountVariants = cva("flex flex-col", {
  variants: {
    size: {
      12: "gap-1",
      14: "gap-1",
      16: "gap-1",
      18: "gap-1",
      20: "gap-2",
      24: "gap-2",
      30: "gap-2",
    },
  },
  defaultVariants: { size: 12 },
})

const chartAmountMutedVariants = cva("text-10 leading-16 font-bold", {
  variants: {
    style: {
      default: "text-base-500",
      image: "text-white-alpha-50",
    },
    tone: {
      heading: "",
      additional: "",
    },
  },
  compoundVariants: [{ style: "default", tone: "additional", className: "text-base-400" }],
  defaultVariants: { style: "default", tone: "heading" },
})

type ChartAmountProps = Omit<React.ComponentProps<"div">, "style"> & {
  size?: NonNullable<VariantProps<typeof chartAmountVariants>["size"]>
  appearance?: "default" | "image"
  heading?: string
  value?: string
  additionalText?: string
  up?: string
  down?: string
}

/** Figma Amount-Component: heading with dot, big value, Up / Down trend rows and additional text. Size 12-30, Style Default / Image. */
function ChartAmount({
  className,
  size = 12,
  appearance = "default",
  heading = "Heading",
  value = "$20,560",
  additionalText = "Additional Text",
  up = "Text",
  down = "Text",
  ...props
}: ChartAmountProps) {
  return (
    <div data-slot="chart-amount" data-size={size} className={cn(chartAmountVariants({ size }), className)} {...props}>
      <div className="flex items-center gap-2 pr-4">
        <ChartDot tone="primary" shade={600} />
        <span className={chartAmountMutedVariants({ style: appearance })}>{heading}</span>
        <span
          aria-hidden
          className={cn(
            "size-4 shrink-0 mask-[url(/icons/material-keyboard-arrow-down.svg)] mask-contain mask-center mask-no-repeat",
            appearance === "image" ? "bg-white-alpha-50" : "bg-base-500",
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className={chartAmountValueVariants({ size, style: appearance })}>{value}</span>
        <ChartTrend direction="up">{up}</ChartTrend>
        <ChartTrend direction="down">{down}</ChartTrend>
      </div>
      <span className={chartAmountMutedVariants({ style: appearance, tone: "additional" })}>{additionalText}</span>
    </div>
  )
}

/** Up / Down delta row used by Amount and Progress-Card. */
function ChartTrend({
  className,
  direction,
  icon = "trend",
  size = "sm",
  children,
  ...props
}: React.ComponentProps<"span"> & { direction: "up" | "down"; icon?: "trend" | "arrow"; size?: "sm" | "md" | "stack" }) {
  return (
    <span
      data-slot="chart-trend"
      data-direction={direction}
      className={cn(
        "inline-flex items-center text-10 leading-16 font-bold",
        size === "md" ? "gap-2" : size === "stack" ? "flex-col items-start" : "gap-1",
        direction === "up" ? "text-green-600" : "text-danger-600",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "shrink-0 bg-current mask-contain",
          size === "md" ? "size-5" : size === "stack" ? "size-6" : "size-4",
          " mask-center mask-no-repeat",
          icon === "arrow"
            ? direction === "up"
              ? "mask-[url(/icons/material-arrow-upward.svg)]"
              : "mask-[url(/icons/material-arrow-downward.svg)]"
            : direction === "up"
              ? "mask-[url(/icons/material-trending_up.svg)]"
              : "mask-[url(/icons/material-trending_down.svg)]",
        )}
      />
      {children}
    </span>
  )
}

const chartValueVariants = cva("font-default text-24 leading-36 font-medium tracking-default", {
  variants: {
    tone: {
      green: "text-green-600",
      purple: "text-purple-600",
      danger: "text-danger-600",
    },
  },
  defaultVariants: { tone: "green" },
})

/** Figma Finance card amount: 24/36 medium number in a palette color (Projects Income / Profit). */
function ChartValue({ className, tone, ...props }: React.ComponentProps<"span"> & VariantProps<typeof chartValueVariants>) {
  return <span data-slot="chart-value" className={cn(chartValueVariants({ tone }), className)} {...props} />
}

/* ---------------------------------- Progress-Card ---------------------------------- */

const chartProgressCardVariants = cva("flex w-27 flex-col", {
  variants: {
    type: {
      progress: "gap-3",
      // Figma Head: bottom-only 1px stroke, 16px below the labels (15px padding + 1px border = 32px).
      head: "gap-0 border-b pb-3.75",
    },
    appearance: {
      default: "",
      image: "",
    },
  },
  compoundVariants: [
    { type: "head", appearance: "default", className: "border-background-100" },
    { type: "head", appearance: "image", className: "border-white-alpha-20" },
  ],
  defaultVariants: { type: "progress", appearance: "default" },
})

type ChartProgressCardProps = Omit<React.ComponentProps<"div">, "style"> &
  VariantProps<typeof chartProgressCardVariants> & {
    appearance?: "default" | "image"
    heading?: string
    count?: string
    /** Right label of the Head row (Figma default "Views"). */
    countHeading?: string
    trend?: "up" | "down"
    value?: number
    color?: ProgressColor
  }

/** Figma Progress-Card-Component: Type Progress (heading, count, trend, progress line) or Head (Head / Views row). */
function ChartProgressCard({
  className,
  type = "progress",
  appearance = "default",
  heading,
  count = "256",
  countHeading = "Views",
  trend,
  value = 100,
  color = "blue",
  ...props
}: ChartProgressCardProps) {
  const image = appearance === "image"
  if (type === "head") {
    return (
      <div
        data-slot="chart-progress-card"
        data-type="head"
        className={cn(chartProgressCardVariants({ type, appearance }), className)}
        {...props}
      >
        <div className="flex items-center justify-between text-10 leading-16 font-bold">
          <span className={image ? "text-white-alpha-70" : "text-base-700"}>{heading ?? "Head"}</span>
          <span className={image ? "text-white-alpha-50" : "text-base-500"}>{countHeading}</span>
        </div>
      </div>
    )
  }
  return (
    <div data-slot="chart-progress-card" data-type="progress" className={cn(chartProgressCardVariants({ type }), className)} {...props}>
      <div className="flex items-center justify-between text-10 leading-16 font-bold">
        <span className={image ? "text-background-0" : "text-base-700"}>{heading ?? "Heading"}</span>
        <span className="flex items-center">
          <span className={image ? "text-white-alpha-70" : "text-base-700"}>{count}</span>
          {trend && !image ? <ChartTrend direction={trend} icon="arrow">{count}</ChartTrend> : null}
        </span>
      </div>
      <Progress value={value} color={color} size="small" aria-label={heading ?? "Heading"} />
    </div>
  )
}

/* ---------------------------------- Candle ---------------------------------- */

const chartCandleVariants = cva("flex w-1 flex-col items-center", {
  variants: {
    style: {
      1: "h-4.5",
      2: "h-6.5",
      3: "h-9",
    },
  },
  defaultVariants: { style: 1 },
})

const candleParts = {
  1: [4, 10, 4],
  2: [8, 10, 8],
  3: [12, 12, 12],
} as const

/** Figma Candle-Chart-Component: wick, 4px body, wick. Type Up green, Down danger; Style 1-3 height. */
function ChartCandle({
  className,
  type = "up",
  style = 1,
  ...props
}: Omit<React.ComponentProps<"span">, "style"> &
  Omit<VariantProps<typeof chartCandleVariants>, "style"> & { style?: 1 | 2 | 3; type?: "up" | "down" }) {
  const [top, body, bottom] = candleParts[style]
  const color = type === "up" ? "bg-green-500" : "bg-danger-500"
  return (
    <span data-slot="chart-candle" data-type={type} aria-hidden className={cn(chartCandleVariants({ style }), className)} {...props}>
      <span className={cn("w-px", color)} style={{ height: top }} />
      <span className={cn("w-1", color)} style={{ height: body }} />
      <span className={cn("w-px", color)} style={{ height: bottom }} />
    </span>
  )
}

/* ---------------------------------- Column / Columns-Mini ---------------------------------- */

const chartColumnVariants = cva("inline-block size-1.25 shrink-0", {
  variants: {
    fill: {
      solid: "",
      right: "",
      left: "",
      top: "",
      bottom: "",
      "alpha-30": "",
      "alpha-10": "",
    },
  },
  defaultVariants: { fill: "solid" },
})

const gradientDirection = { right: "to right", left: "to left", top: "to top", bottom: "to bottom" } as const

type ChartColumnProps = Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof chartColumnVariants> & { tone?: ChartTone; shade?: ChartShade }

/** Figma Chart-Column-Component: 5px bar fill. Solid shade, Right/Left/Top/Bottom gradient (700 to 400), alpha 30% / 10%. */
function ChartColumn({ className, tone = "primary", shade = 500, fill = "solid", style, ...props }: ChartColumnProps) {
  let background: string
  if (fill === "solid") background = toneColor(tone, shade)
  else if (fill === "alpha-30") background = toneAlpha(tone, 30)
  else if (fill === "alpha-10") background = toneAlpha(tone, 10)
  else {
    const dir = fill ?? "right"
    const [from, to] = dir === "right" || dir === "bottom" ? [700, 400] : [400, 700]
    background = `linear-gradient(${gradientDirection[dir]}, ${toneColor(tone, from as ChartShade)}, ${toneColor(tone, to as ChartShade)})`
  }
  return (
    <span
      data-slot="chart-column"
      data-tone={tone}
      aria-hidden
      className={cn(chartColumnVariants({ fill }), className)}
      style={{ background, ...style }}
      {...props}
    />
  )
}

const miniTypes: Record<1 | 2 | 3 | 4 | 5 | 6, { height: number; bars: number[] }> = {
  1: { height: 64, bars: [48, 32, 48, 64, 48, 64, 32, 16, 48, 64, 48, 32] },
  2: { height: 64, bars: [32, 48, 32, 56, 40, 64, 24, 48, 56, 32, 48, 40] },
  3: { height: 66, bars: [40, 56, 36, 66, 44, 52, 40, 60, 48, 66, 40, 52] },
  4: { height: 60, bars: [36, 52, 44, 60, 40, 56, 48, 52, 60, 44, 56, 48] },
  5: { height: 59, bars: [48, 52, 56, 44, 59, 52, 56, 48, 59, 52, 44, 56] },
  6: { height: 50, bars: [6, 12, 18, 14, 24, 20, 30, 26, 38, 32, 44, 50] },
}

/** Figma Chart-Columns-Mini-Component: 12 rounded 4px bars, gradient 400 to 600 (White / Dark are solid). Type 1-6. */
function ChartColumnsMini({
  className,
  tone = "primary",
  type = 1,
  ...props
}: React.ComponentProps<"div"> & { tone?: ChartTone; type?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const { height, bars } = miniTypes[type]
  const solid = tone === "dark" || tone.startsWith("white")
  return (
    <div
      data-slot="chart-columns-mini"
      data-tone={tone}
      role="img"
      aria-label="Columns chart"
      className={cn("flex w-23 items-end gap-1", className)}
      style={{ height }}
      {...props}
    >
      {bars.map((bar, i) => (
        <span
          key={i}
          className="w-1 rounded-r2"
          style={{
            height: bar,
            background: solid ? toneColor(tone) : `linear-gradient(${toneColor(tone, 400)}, ${toneColor(tone, 600)})`,
          }}
        />
      ))}
    </div>
  )
}

/* ---------------------------------- Sparklines ---------------------------------- */

const lineShapes: Record<1 | 2 | 3, Shape> = {
  1: { slope: 0.55, amp: 0.55, wave: 3, smooth: false },
  2: { slope: 0, amp: 0.45, wave: 3, smooth: false },
  3: { slope: 0, amp: 0.7, wave: 3, smooth: false },
}

const areaShapes: Shape[] = [
  { slope: 0.7, amp: 0.4, wave: 2, smooth: false },
  { slope: 0.1, amp: 0.3, wave: 3, smooth: false },
  { slope: 0.1, amp: 0.8, wave: 2.5, smooth: true },
  { slope: 0.2, amp: 0.8, wave: 3, smooth: true },
  { slope: 0, amp: 0.8, wave: 4, smooth: true },
  { slope: 0, amp: 0.6, wave: 5, smooth: true },
  { slope: 0.1, amp: 0.2, wave: 6, smooth: false },
  { slope: 0, amp: 0.5, wave: 4, smooth: false },
  { slope: 0.1, amp: 0.7, wave: 5, smooth: false },
  { slope: 0.05, amp: 0.8, wave: 3, smooth: true },
]

type ChartTypeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Figma Line-Chart-Component: 200px sparkline. Style hue / Dark, Type 1 (rising), 2 (flat, 55px), 3 (noisy). */
function ChartLine({
  className,
  tone = "primary",
  type = 1,
  ...props
}: Omit<React.ComponentProps<"svg">, "type"> & { tone?: ChartTone; type?: 1 | 2 | 3 }) {
  const height = type === 2 ? 55 : 96
  return (
    <svg
      data-slot="chart-line"
      data-tone={tone}
      role="img"
      aria-label="Line chart"
      viewBox={`0 0 200 ${height}`}
      width={200}
      height={height}
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        d={linePath(curve(lineShapes[type], type * 7 + tone.length, 40), 200, height)}
        fill="none"
        stroke={toneColor(tone)}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Figma Line-Area-Chart-Component: 200x96 line with a fading fill. Type 1-7, 9, 10 (Figma has no 8). */
function ChartLineArea({
  className,
  tone = "primary",
  type = 1,
  ...props
}: Omit<React.ComponentProps<"svg">, "type"> & { tone?: ChartTone; type?: Exclude<ChartTypeNumber, 8> }) {
  const id = React.useId()
  const d = linePath(curve(areaShapes[type - 1], type * 5 + tone.length, 48), 200, 96)
  return (
    <svg
      data-slot="chart-line-area"
      data-tone={tone}
      role="img"
      aria-label="Line area chart"
      viewBox="0 0 200 96"
      width={200}
      height={96}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={toneAlpha(tone, 15)} />
          <stop offset="100%" stopColor={toneAlpha(tone, 5)} stopOpacity={0.2} />
        </linearGradient>
      </defs>
      <path d={`${d} L200 96 L0 96 Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={toneColor(tone)} strokeWidth={1} strokeLinejoin="round" />
    </svg>
  )
}

const areaHeights: Record<ChartTypeNumber, number> = {
  1: 114,
  2: 128,
  3: 142,
  4: 191,
  5: 217,
  6: 215,
  7: 235,
  8: 245,
  9: 248,
  10: 265,
}

/** Figma Area-Chart-Component: 202px solid area, Type 1-10 (height 114 to 265). */
function ChartArea({
  className,
  tone = "primary",
  type = 1,
  ...props
}: Omit<React.ComponentProps<"svg">, "type"> & { tone?: ChartTone; type?: ChartTypeNumber }) {
  const height = areaHeights[type]
  const points = curve({ slope: 0.45, amp: 0.5, wave: 3, smooth: false }, type * 3 + tone.length, 44).map((p) => 0.55 + p * 0.4)
  const d = linePath(points, 202, height, 0)
  return (
    <svg
      data-slot="chart-area"
      data-tone={tone}
      role="img"
      aria-label="Area chart"
      viewBox={`0 0 202 ${height}`}
      width={202}
      height={height}
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d={`${d} L202 ${height} L0 ${height} Z`} fill={toneColor(tone)} />
    </svg>
  )
}

/** Figma Chart-Step-Component: 288px step line. Style hue / Dark / White. */
function ChartStep({
  className,
  tone = "primary",
  tall = true,
  ...props
}: React.ComponentProps<"svg"> & { tone?: ChartTone; tall?: boolean }) {
  const height = tall ? 108 : 72
  const next = random(tone.length * 11 + (tall ? 1 : 2))
  const steps = 14
  const ys: number[] = []
  let level = 0.5
  for (let i = 0; i < steps; i += 1) {
    level = Math.min(0.9, Math.max(0.1, level + (next() - 0.5) * 0.7))
    ys.push(2 + level * (height - 4))
  }
  const d = ys
    .map((y, i) => `${i ? `V${y.toFixed(1)}` : `M0 ${y.toFixed(1)}`}H${(((i + 1) / steps) * 288).toFixed(1)}`)
    .join("")
  return (
    <svg
      data-slot="chart-step"
      data-tone={tone}
      role="img"
      aria-label="Step chart"
      viewBox={`0 0 288 ${height}`}
      width={288}
      height={height}
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d={d} fill="none" stroke={toneColor(tone, 400)} strokeWidth={1} />
    </svg>
  )
}

/* ---------------------------------- Pie / Donut ---------------------------------- */

const chartPieVariants = cva("shrink-0", {
  variants: {
    type: {
      pie: "",
      donut: "",
    },
  },
  defaultVariants: { type: "pie" },
})

type ChartPieProps = Omit<React.ComponentProps<"svg">, "type"> &
  VariantProps<typeof chartPieVariants> & {
    tone?: ChartTone
    shade?: ChartShade
    percent?: 100 | 90 | 76 | 64 | 48 | 36 | 16
  }

/** Figma Chart-Pie-Component / Chart-Pie-Donut-Component: 24px slice, Style hue 300-900, Percent 100-16. */
function ChartPie({ className, type = "pie", tone = "primary", shade = 500, percent = 100, ...props }: ChartPieProps) {
  const color = toneColor(tone, shade)
  const r = type === "donut" ? 10 : 12
  const angle = (percent / 100) * 360
  const rad = ((angle - 90) * Math.PI) / 180
  const end = [12 + r * Math.cos(rad), 12 + r * Math.sin(rad)]
  const large = angle > 180 ? 1 : 0
  const arc = `A${r} ${r} 0 ${large} 1 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`
  return (
    <svg
      data-slot="chart-pie"
      data-type={type}
      data-tone={tone}
      role="img"
      aria-label={`${percent}%`}
      viewBox="0 0 24 24"
      width={24}
      height={24}
      className={cn(chartPieVariants({ type }), className)}
      {...props}
    >
      {percent === 100 ? (
        type === "donut" ? (
          <circle cx={12} cy={12} r={10} fill="none" stroke={color} strokeWidth={4} />
        ) : (
          <circle cx={12} cy={12} r={12} fill={color} />
        )
      ) : type === "donut" ? (
        <path d={`M12 2 ${arc}`} fill="none" stroke={color} strokeWidth={4} />
      ) : (
        <path d={`M12 12 L12 0 ${arc} Z`} fill={color} />
      )}
    </svg>
  )
}

/* ---------------------------------- Map ---------------------------------- */

// Rough continent outlines in the 270x146 Figma map frame; dots sit on a 4px grid.
const land: number[][][] = [
  [[18, 22], [60, 12], [88, 24], [84, 44], [66, 64], [46, 62], [28, 46]],
  [[62, 70], [82, 72], [92, 92], [84, 124], [72, 130], [64, 100]],
  [[118, 24], [150, 18], [152, 40], [138, 52], [120, 46]],
  [[120, 54], [152, 54], [162, 80], [150, 112], [134, 112], [122, 84]],
  [[154, 20], [226, 14], [248, 36], [236, 60], [200, 70], [172, 64], [158, 44]],
  [[210, 98], [244, 96], [248, 118], [220, 124], [208, 112]],
]

function inside(x: number, y: number, poly: number[][]) {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

const mapHighlights: [number, number, number][] = [
  [58, 40, 11],
  [70, 100, 9],
  [196, 36, 16],
  [228, 108, 8],
]

/** Figma Map-Component / Map-White-Component: 280x151 dot-grid world map, highlighted regions in primary. */
function ChartMap({ className, appearance = "default", ...props }: React.ComponentProps<"div"> & { appearance?: "default" | "white" }) {
  const dots: { x: number; y: number; hot: boolean }[] = []
  for (let y = 2; y < 146; y += 4) {
    for (let x = 2; x < 270; x += 4) {
      if (land.some((poly) => inside(x, y, poly))) {
        dots.push({ x, y, hot: mapHighlights.some(([hx, hy, hr]) => (x - hx) ** 2 + (y - hy) ** 2 < hr * hr) })
      }
    }
  }
  return (
    <div
      data-slot="chart-map"
      data-appearance={appearance}
      role="img"
      aria-label="World map"
      className={cn("h-37.75 w-70 shrink-0 pr-2.5 pb-1.25", appearance === "white" && "bg-base-900", className)}
      {...props}
    >
      <svg viewBox="0 0 270 146" className="size-full">
        {dots.map((d) => (
          <circle
            key={`${d.x}-${d.y}`}
            cx={d.x}
            cy={d.y}
            r={1.5}
            fill={d.hot ? "var(--primary-600)" : appearance === "white" ? "var(--white-alpha-15)" : "var(--background-100)"}
          />
        ))}
      </svg>
    </div>
  )
}

export {
  ChartAmount,
  ChartArea,
  ChartCandle,
  ChartColumn,
  ChartColumnsMini,
  ChartDot,
  ChartLegendList,
  ChartLine,
  ChartLineArea,
  ChartMap,
  ChartPie,
  ChartProgressCard,
  ChartStep,
  ChartTrend,
  ChartValue,
  chartAmountVariants,
  chartCandleVariants,
  chartColumnVariants,
  chartDotVariants,
  chartLegendVariants,
  chartPieVariants,
  chartProgressCardVariants,
  hues as chartHues,
}
export type { ChartHue, ChartShade, ChartTone }
