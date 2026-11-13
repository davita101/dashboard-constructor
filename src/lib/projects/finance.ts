// Pure finance helpers (no DB), shared by ./queries.ts and the unit tests.

/** Signed percent change from `prev` to `cur`, rounded. Nothing before → +100% if something now, else 0. */
export function percentTrend(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0
  return Math.round(((cur - prev) / Math.abs(prev)) * 100)
}
