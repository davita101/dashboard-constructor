import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const radialChartVariants = cva("relative inline-flex shrink-0 items-center justify-center", {
  variants: {
    kind: {
      donut: "size-32",
      pie: "size-32",
      progress: "",
      "progress-half": "",
    },
    text: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { kind: "progress", text: true, className: "size-66" },
    { kind: "progress", text: false, className: "size-40" },
    { kind: "progress-half", text: true, className: "h-33 w-66" },
    { kind: "progress-half", text: false, className: "h-7 w-14" },
  ],
  defaultVariants: { kind: "donut", text: false },
})

const sliceColors = [
  "var(--blue-500)",
  "var(--green-500)",
  "var(--orange-500)",
  "var(--info-500)",
  "var(--yellow-500)",
  "var(--danger-500)",
  "var(--purple-500)",
]
const pieColors = [sliceColors[6], ...sliceColors.slice(1, 6), sliceColors[0]]
const shares = [20, 16, 14, 13, 12, 14, 11]

const rings = [
  { color: "blue", value: 0.68 },
  { color: "green", value: 0.6 },
  { color: "orange", value: 0.52 },
  { color: "sky", value: 0.44 },
  { color: "purple", value: 0.36 },
  { color: "pink", value: 0.28 },
]

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(cx, cy, r, from)
  const [x2, y2] = polar(cx, cy, r, to)
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`
}

function slices(count: number) {
  const parts = shares.slice(0, count)
  const total = parts.reduce((a, b) => a + b, 0)
  let angle = 0
  return parts.map((p, i) => {
    const sweep = (p / total) * 360
    const from = angle
    angle += sweep
    return { from, to: angle, pct: Math.round((p / total) * 100), i }
  })
}

type Props = VariantProps<typeof radialChartVariants> & {
  count?: number
  theme?: "default" | "white"
  className?: string
}

function RadialChart({ kind = "donut", text = false, count = 7, theme = "default", className }: Props) {
  const white = theme === "white"
  const label = (
    <span className="absolute inset-0 flex flex-col items-center justify-center">
      <span
        className={cn(
          "font-default font-bold",
          white ? "text-white" : "text-base-800",
          kind === "progress-half" ? "text-24 leading-36" : "text-18 leading-28",
        )}
      >
        56
      </span>
      <span
        className={cn(
          "font-default font-bold",
          white
            ? "text-white-alpha-50"
            : kind === "progress"
              ? "text-base-700"
              : kind === "progress-half"
                ? "text-base-700"
                : "text-base-500",
          kind === "progress" ? "text-16 leading-24" : "",
          kind === "progress-half" ? "text-12 leading-20" : kind === "progress" ? "" : "text-10 leading-16",
        )}
      >
        Total
      </span>
    </span>
  )

  if (kind === "donut" || kind === "pie") {
    const parts = slices(count)
    const colors = kind === "pie" ? pieColors : sliceColors
    return (
      <span className={cn(radialChartVariants({ kind, text }), className)}>
        <svg viewBox="0 0 128 128" className="size-full -rotate-0" role="img" aria-label={`${kind} chart`}>
          {parts.map((s) =>
            kind === "pie" ? (
              <path
                key={s.i}
                d={`${arc(64, 64, 32, s.from, s.to).replace("M", "M 64 64 L")} Z`}
                fill={colors[s.i]}
                stroke="var(--background-0)"
                strokeWidth={1}
              />
            ) : (
              <path
                key={s.i}
                d={arc(64, 64, 56, s.from + 2, s.to - 2)}
                fill="none"
                stroke={colors[s.i]}
                strokeWidth={4}
                strokeLinecap="round"
              />
            ),
          )}
          {parts.map((s) => {
            const [bx, by] = polar(64, 64, kind === "pie" ? 40 : 56, (s.from + s.to) / 2)
            return (
              <g key={`b${s.i}`}>
                <rect x={bx - 11} y={by - 8} width={22} height={16} rx={6} fill={white ? "var(--default-gray-800)" : "var(--base-900)"} />
                <text x={bx} y={by + 3} textAnchor="middle" fontSize={7} fontWeight={700} fill={white ? "var(--white)" : "var(--background-0)"}>
                  {s.pct}%
                </text>
              </g>
            )
          })}
        </svg>
        {kind === "donut" && label}
      </span>
    )
  }

  if (kind === "progress") {
    const size = text ? 66 * 4 : 160
    const step = 12
    const base = text ? 126 : 75
    return (
      <span className={cn(radialChartVariants({ kind, text }), className)}>
        <svg viewBox={`0 0 ${size} ${size}`} className="size-full" role="img" aria-label="progress chart">
          {rings.map((r, i) => {
            const radius = base - i * step
            return (
              <g key={r.color}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`var(--${r.color}-alpha-15)`} strokeWidth={text ? 6 : 4} />
                <path d={arc(size / 2, size / 2, radius, 0, 360 * r.value)} fill="none" stroke={`var(--${r.color}-500)`} strokeWidth={text ? 6 : 4} strokeLinecap="round" />
              </g>
            )
          })}
        </svg>
        {text && label}
      </span>
    )
  }

  const h = text ? 132 : 28
  const w = text ? 264 : 56
  const radius = text ? 126 : 25
  return (
    <span className={cn(radialChartVariants({ kind, text }), className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="size-full" role="img" aria-label="half progress chart">
        <defs>
          <linearGradient id={`half-${text}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--blue-600)" />
            <stop offset="100%" stopColor="var(--blue-400)" />
          </linearGradient>
        </defs>
        <path d={arc(w / 2, h, radius, -90, 90).replace(/ 0 0 1/, " 0 0 1")} fill="none" stroke="var(--blue-alpha-15)" strokeWidth={text ? 2 : 2} />
        <path d={arc(w / 2, h, radius, -90, -90 + 180 * 0.56)} fill="none" stroke={`url(#half-${text})`} strokeWidth={text ? 3 : 2} strokeLinecap="round" />
      </svg>
      {text && label}
    </span>
  )
}

export { RadialChart, radialChartVariants }
