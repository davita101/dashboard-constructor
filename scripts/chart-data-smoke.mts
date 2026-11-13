import assert from "node:assert/strict"

import { categoriesMax, formatCompact, toStackRows, niceMax, niceTicks, pointsMax, toRows } from "../src/components/charts/chart-data"

assert.equal(niceMax(0), 10)
console.log("PASS niceMax(0) = 10")
assert.equal(niceMax(1234), 1500)
console.log("PASS niceMax(1234) = 1500")
assert.equal(niceMax(80000), 80000)
console.log("PASS niceMax(80000) = 80000")
assert.deepEqual(niceTicks(80000), [0, 20000, 40000, 60000, 80000])
console.log("PASS niceTicks(80000)")
assert.equal(formatCompact(1500), "1.5k")
assert.equal(formatCompact(0), "0")
console.log("PASS formatCompact")

const pts = [
  { label: "Jan", values: [1, 2] },
  { label: "Feb", values: [3] },
]
assert.deepEqual(toRows(pts, ["a", "b"]), [
  { month: "Jan", a: 1, b: 2 },
  { month: "Feb", a: 3, b: 0 },
])
console.log("PASS toRows mapping")
assert.deepEqual(toRows([], ["a"]), [])
assert.equal(pointsMax([]), 0)
assert.equal(pointsMax([{ label: "x", values: [] }]), 0)
console.log("PASS empty values")
assert.equal(pointsMax(pts, true), 3)
assert.equal(pointsMax(pts), 3)
console.log("PASS pointsMax")

const cats = [
  { name: "A", values: [1, 2, 3, 4] },
  { name: "B", values: [5] },
]
assert.equal(categoriesMax(cats), 5)
assert.equal(categoriesMax(cats, true), 10)
assert.equal(categoriesMax([]), 0)
console.log("PASS categoriesMax")
assert.deepEqual(toStackRows(cats, 4), [
  { name: "A", p0: 1, p1: 2, p2: 3, p3: 4 },
  { name: "B", p0: 5, p1: 0, p2: 0, p3: 0 },
])
assert.deepEqual(toStackRows([], 4), [])
console.log("PASS toStackRows")
