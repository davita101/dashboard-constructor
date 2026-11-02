"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type CartesianKind =
  | "line"
  | "line-gradient"
  | "line-step"
  | "line-area"
  | "column-1"
  | "column-2"
  | "column-3"
  | "column-4"
  | "column-5"
  | "column-6"
  | "bar"
  | "bar-double"
  | "bar-stacked"
  | "bar-negative"
  | "candle"

export type ChartYAxis = "left" | "right" | "both" | "none"
export type ChartLines = "grid" | "line" | "none"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
const countries = ["Germany", "USA", "Japan", "France", "Italy", "Netherl.", "UK", "Canada", "Sh Korea"]
const ticks = [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000]
const formatK = (v: number) => (v ? `${v / 1000}k` : "0")

const palette = [
  "var(--purple-500)",
  "var(--orange-500)",
  "var(--blue-500)",
  "var(--green-500)",
  "var(--sky-500)",
  "var(--pink-500)",
]

const series = [
  [62, 72, 66, 70, 58, 68, 74, 78, 80],
  [48, 62, 40, 52, 44, 50, 58, 54, 60],
  [32, 40, 30, 44, 36, 42, 38, 50, 52],
  [22, 28, 20, 30, 26, 24, 34, 30, 36],
  [14, 20, 12, 18, 22, 16, 20, 24, 18],
  [6, 10, 4, 12, 8, 14, 6, 10, 8],
]

// `preset="card"` (Figma Charts Cards): three named series and a fixed Jul tooltip.
const cardPalette = ["var(--pink-500)", "var(--blue-500)", "var(--green-500)"]
const cardLabels = ["Month", "Avr. Month", "Last Month"]
const cardTipValues = ["35,454", "28,454", "19,585"]
const cardSeries = [
  [56, 54, 63, 58, 64, 57, 61, 66, 61],
  [33, 40, 47, 41, 50, 46, 53, 56, 60],
  [26, 30, 34, 29, 36, 28, 33, 40, 31],
]

const toLineData = (rows: number[][]) =>
  months.map((month, i) => ({
    month,
    ...Object.fromEntries(rows.map((s, k) => [`s${k}`, s[i] * 1000])),
  }))
const lineData = toLineData(series)
const cardLineData = toLineData(cardSeries)

const columnData = months.map((month, i) => ({
  month,
  a: [13, 18, 27, 13, 13, 24, 10, 17, 8][i] * 1000,
  b: [51, 31, 30, 47, 46, 40, 37, 34, 30][i] * 1000,
  c: [13, 19, 13, 17, 18, 22, 11, 16, 21][i] * 1000,
  bg: [60, 53, 42, 55, 52, 42, 44, 41, 44][i] * 1000,
  v: [46, 54, 33, 63, 38, 22, 42, 25, 40][i] * 1000,
  v2: [62, 46, 40, 65, 48, 68, 62, 60, 68][i] * 1000,
  v3: [46, 56, 40, 52, 44, 60, 50, 42, 62][i] * 1000,
  p1: [66, 45, 59, 56, 59, 53, 59, 58, 63][i] * 800,
  p2: [22, 28, 18, 18, 22, 24, 20, 22, 22][i] * 800,
  p3: [12, 27, 23, 26, 19, 23, 21, 20, 15][i] * 800,
}))

const thin = Array.from({ length: 30 }, (_, i) => ({
  month: i % 3 === 1 ? (months[Math.floor(i / 3)] ?? "") : "",
  v: (22 + ((i * 37) % 41) + (i === 10 ? 25 : 0)) * 1000,
}))

const horizontalHues = ["blue", "orange", "red", "teal", "amber", "pink", "purple", "green", "blue"]

const horizontal = countries
  .map((name, i) => ({
    name,
    v: [2294, 1905, 1601, 1304, 1105, 956, 910, 894, 711][i],
    w: [1943, 1878, 1476, 1243, 965, 899, 832, 810, 788][i],
    hue: horizontalHues[i],
    i,
  }))
  .reverse()

const stackColors = ["blue", "sky", "teal", "green", "yellow", "orange", "pink", "purple"]

const stacked = countries.map((name, i) => {
  const parts = [14, 11, 13, 12, 9, 15, 8, 18].map((n, k) => ((n + i * (k + 1)) % 15) + 6)
  const sum = parts.reduce((a, b) => a + b, 0)
  return { name, ...Object.fromEntries(parts.map((p, k) => [`p${k}`, (p / sum) * 100])) }
})

const negative = ["10:00", "09:00", "08:00", "07:00", "06:00", "05:00", "04:00", "03:00", "02:00"].map(
  (name, i) => ({
    name,
    pos: 20 + ((i * 7) % 25),
    neg: -(15 + ((i * 11) % 30)),
  }),
)

const candles = Array.from({ length: 28 }, (_, i) => {
  const open = 30000 + ((i * 7919) % 26000)
  const close = open + (((i * 4231) % 18000) - 8000)
  return {
    t: i % 7 === 2 ? ["23:00", "03:00", "07:00", "11:00"][Math.floor(i / 7)] : "",
    open,
    close,
    low: Math.min(open, close) - 4000,
    high: Math.max(open, close) + 5000,
  }
})

function Gradient({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  )
}

type CandleDatum = (typeof candles)[number]

function CandleShape(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: CandleDatum
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props
  if (!payload || !height) return null
  // Bar spans 0..high; map data values onto that pixel span.
  const scale = height / payload.high
  const yOf = (v: number) => y + height - v * scale
  const up = payload.close >= payload.open
  const color = up ? "var(--green-500)" : "var(--red-500)"
  const cx = x + width / 2
  const top = yOf(Math.max(payload.open, payload.close))
  const bottom = yOf(Math.min(payload.open, payload.close))
  return (
    <g>
      <line x1={cx} x2={cx} y1={yOf(payload.high)} y2={yOf(payload.low)} stroke={color} strokeWidth={1} />
      <rect x={x} width={width} y={top} height={Math.max(bottom - top, 1)} fill={color} />
    </g>
  )
}

type Props = {
  kind: CartesianKind
  yAxis?: ChartYAxis
  lines?: ChartLines
  tooltip?: boolean
  theme?: "default" | "white"
  preset?: "default" | "card"
  className?: string
}

function CartesianChart({ kind, yAxis = "both", lines = "grid", tooltip = true, theme = "default", preset = "default", className }: Props) {
  const barBg = theme === "white" ? "var(--white-alpha-10)" : "var(--base-100)"
  const uid = React.useId().replace(/:/g, "")
  const isHorizontal =
    kind === "bar" || kind === "bar-double" || kind === "bar-stacked" || kind === "bar-negative"
  const card = preset === "card"
  const pal = card ? cardPalette : palette
  const data = card ? cardLineData : lineData
  const curve = card ? "linear" : "monotone"
  const config = Object.fromEntries(
    pal.map((color, i) => [`s${i}`, { label: card ? cardLabels[i] : "Tooltip", color }]),
  ) satisfies ChartConfig
  const isLine = card && (kind === "line" || kind === "line-step" || kind === "line-gradient" || kind === "line-area")
  const grid =
    lines === "none" ? null : (
      <CartesianGrid
        stroke={theme === "white" ? "var(--white-alpha-10)" : "var(--background-100)"}
        vertical={lines === "grid"}
        horizontal={!isHorizontal || lines === "grid"}
      />
    )
  const margin = { top: 0, right: 12, bottom: 0, left: 8 }
  const tip = tooltip ? (
    <ChartTooltip
      defaultIndex={isLine ? 6 : 5}
      // Figma Charts Cards: the line tooltip sits over the right of the plot, left edge near Apr.
      position={isLine ? { x: 100, y: 84 } : undefined}
      cursor={false}
      isAnimationActive={false}
      content={
        <ChartTooltipContent
          labelFormatter={isLine ? () => <span className="text-11 leading-20 font-bold">Views Products</span> : undefined}
          formatter={
            isLine
              ? (value, name, item) => (
            <div className="-mr-3 flex w-full items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="flex-1 text-11 leading-20 font-bold">{cardLabels[Number(String(name).slice(1))] ?? name}</span>
              <span className="text-11 leading-20 font-bold">{cardTipValues[Number(String(name).slice(1))] ?? Number(value).toLocaleString("en-US")}</span>
            </div>
          )
              : undefined
          }
          className={isLine ? "w-39 min-w-0 whitespace-nowrap" : undefined}
        />
      }
    />
  ) : null

  const yId = yAxis === "right" ? "r" : "l"
  const vYAxes = (
    <>
      {(yAxis === "left" || yAxis === "both") && (
        <YAxis yAxisId="l" orientation="left" ticks={ticks} domain={[0, 80000]} tickFormatter={formatK} width={30} tickLine={false} axisLine={false} />
      )}
      {(yAxis === "right" || yAxis === "both") && (
        <YAxis yAxisId="r" orientation="right" ticks={ticks} domain={[0, 80000]} tickFormatter={formatK} width={30} tickLine={false} axisLine={false} />
      )}
      {yAxis === "none" && <YAxis yAxisId="l" hide domain={[0, 80000]} />}
    </>
  )
  const x = <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} />

  let chart: React.ReactElement
  if (kind === "line" || kind === "line-step" || kind === "line-gradient") {
    chart = (
      <LineChart data={data} margin={margin}>
        <defs>
          {pal.map((c, i) => (
            <Gradient key={i} id={`${uid}-g${i}`} from={c} to="var(--blue-300)" />
          ))}
        </defs>
        {grid}
        {x}
        {vYAxes}
        {tip}
        {pal.map((c, i) => (
          <Line
            key={i}
            yAxisId={yId}
            dataKey={`s${i}`}
            type={kind === "line-step" ? "stepAfter" : curve}
            stroke={kind === "line-gradient" ? `url(#${uid}-g${i})` : c}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
        {card && (yAxis === "right" || yAxis === "both") && yId === "l" && (
          <Line yAxisId="r" dataKey="s0" stroke="none" dot={false} activeDot={false} isAnimationActive={false} legendType="none" tooltipType="none" />
        )}
      </LineChart>
    )
  } else if (kind === "line-area") {
    chart = (
      <AreaChart data={data} margin={margin}>
        <defs>
          {pal.map((c, i) => (
            <Gradient key={i} id={`${uid}-a${i}`} from={c} to="var(--background-0)" />
          ))}
        </defs>
        {grid}
        {x}
        {vYAxes}
        {tip}
        {pal.map((c, i) => (
          <Area
            key={i}
            yAxisId={yId}
            dataKey={`s${i}`}
            type={curve}
            stroke={c}
            strokeWidth={2}
            fill={`url(#${uid}-a${i})`}
            fillOpacity={0.3}
            isAnimationActive={false}
          />
        ))}
        {card && (yAxis === "right" || yAxis === "both") && yId === "l" && (
          <Area yAxisId="r" dataKey="s0" stroke="none" dot={false} activeDot={false} fill="none" isAnimationActive={false} legendType="none" tooltipType="none" />
        )}
      </AreaChart>
    )
  } else if (kind === "candle") {
    chart = (
      <BarChart data={candles} margin={margin} barCategoryGap={2}>
        {grid}
        <XAxis dataKey="t" tickLine={false} axisLine={false} interval={0} />
        {vYAxes}
        <Bar yAxisId={yId} dataKey="high" isAnimationActive={false} shape={<CandleShape />} />
      </BarChart>
    )
  } else if (kind === "bar" || kind === "bar-double") {
    const label = { position: "right", fontSize: 10, fontWeight: 700, offset: 8 } as const
    chart = (
      <BarChart data={horizontal} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }} barCategoryGap={kind === "bar" ? 14 : 8} barGap={kind === "bar" ? 2 : 10}>
        <defs>
          {horizontal.map((d) => (
            <linearGradient key={d.name} id={`${uid}-h${d.i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={`var(--${d.hue}-700)`} />
              <stop offset="100%" stopColor={`var(--${d.hue}-400)`} />
            </linearGradient>
          ))}
        </defs>
        {grid}
        <XAxis type="number" domain={[0, 3000]} ticks={[0, 600, 1200, 1800, 2300]} tickLine={false} axisLine={false} />
        <YAxis yAxisId="l" type="category" dataKey="name" tickLine={false} axisLine={false} width={58} />
        <YAxis yAxisId="r" type="category" dataKey="name" tickLine={false} axisLine={false} width={58} orientation="right" />
        <Bar yAxisId="l" dataKey="v" barSize={3} radius={2} isAnimationActive={false} label={label}>
          {horizontal.map((d) => (
            <Cell key={d.name} fill={`url(#${uid}-h${d.i})`} />
          ))}
        </Bar>
        {kind === "bar-double" && (
          <Bar yAxisId="l" dataKey="w" barSize={3} radius={2} isAnimationActive={false} label={label}>
            {horizontal.map((d) => (
              <Cell key={d.name} fill={`url(#${uid}-h${d.i})`} fillOpacity={0.4} />
            ))}
          </Bar>
        )}
      </BarChart>
    )
  } else if (kind === "bar-stacked") {
    chart = (
      <BarChart data={stacked} layout="vertical" margin={margin} stackOffset="expand" barCategoryGap={6}>
        {grid}
        <XAxis type="number" tickFormatter={(v: number) => `${Math.round(v * 100)}%`} tickLine={false} axisLine={false} />
        {(yAxis === "left" || yAxis === "both") && (
          <YAxis yAxisId="l" type="category" dataKey="name" tickLine={false} axisLine={false} width={58} />
        )}
        {(yAxis === "right" || yAxis === "both") && (
          <YAxis yAxisId="r" type="category" dataKey="name" tickLine={false} axisLine={false} width={58} orientation="right" />
        )}
        {stackColors.map((c, k) => (
          <Bar key={c} yAxisId={yAxis === "right" ? "r" : "l"} dataKey={`p${k}`} stackId="s" fill={`var(--${c}-${k % 2 ? 400 : 500})`} isAnimationActive={false} barSize={14} />
        ))}
      </BarChart>
    )
  } else if (kind === "bar-negative") {
    chart = (
      <BarChart data={negative} layout="vertical" stackOffset="sign" margin={margin} barCategoryGap={8}>
        {grid}
        <XAxis type="number" tickFormatter={(v: number) => `${Math.abs(v)}%`} tickLine={false} axisLine={false} />
        {(yAxis === "left" || yAxis === "both") && (
          <YAxis yAxisId="l" type="category" dataKey="name" tickLine={false} axisLine={false} width={34} />
        )}
        {(yAxis === "right" || yAxis === "both") && (
          <YAxis yAxisId="r" type="category" dataKey="name" tickLine={false} axisLine={false} width={34} orientation="right" />
        )}
        <Bar yAxisId={yAxis === "right" ? "r" : "l"} dataKey="pos" stackId="n" fill="var(--green-500)" barSize={3} radius={2} isAnimationActive={false} />
        <Bar yAxisId={yAxis === "right" ? "r" : "l"} dataKey="neg" stackId="n" fill="var(--purple-500)" barSize={3} radius={2} isAnimationActive={false} />
      </BarChart>
    )
  } else {
    const t = Number(kind.split("-")[1])
    const gradTop = t === 3 ? "var(--blue-400)" : "var(--blue-600)"
    const gradBottom = t === 3 ? "var(--blue-700)" : "var(--blue-300)"
    const bars =
      t === 1 ? (
        <>
          <Bar yAxisId={yId} dataKey="bg" fill={barBg} barSize={4} radius={2} isAnimationActive={false} />
          <Bar yAxisId={yId} dataKey="b" fill="var(--blue-500)" barSize={4} radius={2} isAnimationActive={false} />
          <Bar yAxisId={yId} dataKey="a" fill="var(--pink-500)" barSize={4} radius={2} isAnimationActive={false} />
          <Bar yAxisId={yId} dataKey="c" fill="var(--green-500)" barSize={4} radius={2} isAnimationActive={false} />
        </>
      ) : t === 2 ? (
        <>
          <Bar yAxisId={yId} dataKey="bg" fill={barBg} barSize={10} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar yAxisId={yId} dataKey="v" fill={`url(#${uid}-c)`} barSize={10} radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </>
      ) : t === 3 ? (
        <Bar yAxisId={yId} dataKey="v" fill={`url(#${uid}-c)`} barSize={10} radius={[4, 4, 0, 0]} isAnimationActive={false} />
      ) : t === 4 ? (
        <>
          {(["p1", "p2", "p3"] as const).map((k, i) => (
            <Bar key={k} yAxisId={yId} dataKey={k} stackId="s" fill={["var(--blue-500)", "var(--green-500)", "var(--purple-500)"][i]} isAnimationActive={false} barSize={14} />
          ))}
        </>
      ) : t === 5 ? (
        <Bar yAxisId={yId} dataKey="v" fill={`url(#${uid}-c)`} barSize={2} isAnimationActive={false} />
      ) : (
        <>
          <Bar yAxisId={yId} dataKey="v2" fill="var(--blue-600)" barSize={4} radius={2} isAnimationActive={false} />
          <Bar yAxisId={yId} dataKey="v3" fill="var(--blue-300)" barSize={4} radius={2} isAnimationActive={false} />
        </>
      )
    chart = (
      <BarChart data={t === 5 ? thin : columnData} margin={margin} barGap={2} barCategoryGap={4}>
        <defs>
          <Gradient id={`${uid}-c`} from={gradTop} to={gradBottom} />
        </defs>
        {grid}
        <XAxis dataKey="month" tickLine={false} axisLine={false} interval={0} />
        {vYAxes}
        {tip}
        {bars}
      </BarChart>
    )
  }

  return (
    <ChartContainer config={config} theme={theme} className={className ?? "h-79 w-70"}>
      {chart}
    </ChartContainer>
  )
}

export { CartesianChart, months }
