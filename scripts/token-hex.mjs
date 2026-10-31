// Maps Figma hex colors to design-token names (Light mode, default theme), so specs
// and components use the existing tokens from src/styles/ instead of guesses.
// Run: pnpm -s token:hex "#e6e6e6" "#4d4d4d@20" "rgba(0,0,0,0.5)"
//      (`@20` = 20% layer/fill opacity). Prints exact matches (best first), else the 3 nearest.

import { matchColor, parseColor } from "./lib/tokens.mjs"

const inputs = process.argv.slice(2)
if (!inputs.length) {
  console.error('usage: pnpm -s token:hex "#e6e6e6" "#4d4d4d@20" "rgba(0,0,0,0.5)"')
  process.exit(2)
}

for (const input of inputs) {
  const color = parseColor(input)
  if (!color) {
    console.log(`${input}: not a color`)
    continue
  }
  const { exact, nearest } = await matchColor(color)
  if (exact.length) console.log(`${input}: ${exact.slice(0, 6).join(", ")}`)
  else console.log(`${input}: no exact token; nearest ${nearest.map((t) => `${t.name} (${t.hex}, off ${t.d.toFixed(0)})`).join(", ")}`)
}
