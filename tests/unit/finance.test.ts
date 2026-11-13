import { describe, expect, it } from "vitest"

import { percentTrend } from "@/lib/projects/finance"

describe("percentTrend", () => {
  it("returns the rounded percent change", () => {
    expect(percentTrend(150, 100)).toBe(50)
    expect(percentTrend(50, 100)).toBe(-50)
    expect(percentTrend(1001, 3000)).toBe(-67)
  })

  it("is 0 when nothing changed", () => {
    expect(percentTrend(420, 420)).toBe(0)
  })

  it("treats an empty previous period as +100% growth, or 0 when still empty", () => {
    expect(percentTrend(5000, 0)).toBe(100)
    expect(percentTrend(0, 0)).toBe(0)
  })

  it("measures change against the size of a negative previous value", () => {
    // Profit going from -200 to 100 is an improvement, so the trend stays positive.
    expect(percentTrend(100, -200)).toBe(150)
    expect(percentTrend(-300, -200)).toBe(-50)
  })
})
