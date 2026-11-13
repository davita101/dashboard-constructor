export type ChartPoint = { label: string; values: number[] }

const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]

/** Smallest "nice" number >= max (1234 -> 1500, 80000 -> 80000). 0 / negative / NaN -> 10. */
export function niceMax(max: number): number {
  if (!Number.isFinite(max) || max <= 0) return 10
  const pow = 10 ** Math.floor(Math.log10(max))
  const step = NICE_STEPS.find((s) => s * pow >= max - max * 1e-12) ?? 10
  return step * pow
}

/** Evenly spaced axis ticks 0..niceMax (intervals + 1 values). */
export function niceTicks(niceTop: number, intervals = 4): number[] {
  return Array.from({ length: intervals + 1 }, (_, i) => (niceTop * i) / intervals)
}

/** Compact axis label: 0 -> "0", 1500 -> "1.5k", 2000000 -> "2M". */
export function formatCompact(v: number): string {
  if (!v) return "0"
  const abs = Math.abs(v)
  const trim = (n: number) => String(Number(n.toFixed(2)))
  if (abs >= 1_000_000) return `${trim(v / 1_000_000)}M`
  if (abs >= 1000) return `${trim(v / 1000)}k`
  return trim(v)
}

/** Rows for recharts: `{ month: label, [keys[k]]: values[k] ?? 0 }` per point. */
export function toRows(points: ChartPoint[], keys: string[]): Record<string, string | number>[] {
  return points.map((p) => ({
    month: p.label,
    ...Object.fromEntries(keys.map((key, k) => [key, p.values[k] ?? 0])),
  }))
}

export type ChartCategory = { name: string; values: number[] }

/** Biggest single value (`stacked`: biggest row sum) over all categories. */
export function categoriesMax(categories: ChartCategory[], stacked = false): number {
  let max = 0
  for (const c of categories) {
    const v = stacked ? c.values.reduce((a, b) => a + b, 0) : Math.max(0, ...c.values)
    if (v > max) max = v
  }
  return max
}

/** Rows `{ name, [prefix + k]: values[k] ?? 0 }` for `count` series per category. */
export function toStackRows(categories: ChartCategory[], count: number, prefix = "p"): Record<string, string | number>[] {
  return categories.map((c) => ({
    name: c.name,
    ...Object.fromEntries(Array.from({ length: count }, (_, k) => [`${prefix}${k}`, c.values[k] ?? 0])),
  }))
}

/** Highest value on the axis: stacked sums when `stacked`, else the single biggest value. */
export function pointsMax(points: ChartPoint[], stacked = false): number {
  let max = 0
  for (const p of points) {
    const v = stacked ? p.values.reduce((a, b) => a + b, 0) : Math.max(0, ...p.values)
    if (v > max) max = v
  }
  return max
}
