// Hex → design-token lookup shared by token-hex.mjs and figma-spec.mjs.
// The index (design/tokens/hex-index.json) resolves every color variable defined in
// src/styles/ in headless Chrome (Light mode, default theme), so aliases, themes and
// alpha composites are real values. Rebuilt when src/styles/ is newer (needs `pnpm dev`).

import fs from "node:fs"
import path from "node:path"
import { openPage, requirePage } from "./chrome.mjs"

const INDEX = path.join(process.cwd(), "design/tokens/hex-index.json")
const STYLES = path.join(process.cwd(), "src/styles")

/** `#rrggbb`, `#rrggbbaa`, `#rrggbb@20` (20% opacity) or `rgba(…)` → { r, g, b, a }. */
export function parseColor(s) {
  s = s.trim()
  let m = s.match(/^#?([0-9a-f]{6})([0-9a-f]{2})?(?:@(\d+(?:\.\d+)?))?$/i)
  if (m) {
    const n = parseInt(m[1], 16)
    let a = m[2] ? parseInt(m[2], 16) / 255 : 1
    if (m[3]) a *= Number(m[3]) / 100
    return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a }
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i)
  if (m) {
    const a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : Number(m[4])
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a }
  }
  return null
}

let index
export async function loadIndex() {
  if (index) return index
  const stylesTime = Math.max(...fs.readdirSync(STYLES).map((f) => fs.statSync(path.join(STYLES, f)).mtimeMs))
  if (!fs.existsSync(INDEX) || fs.statSync(INDEX).mtimeMs < stylesTime) await buildIndex()
  index = JSON.parse(fs.readFileSync(INDEX, "utf8"))
  return index
}

/** Exact token names for a color (best first), or the 3 nearest when none is exact. */
export async function matchColor(color) {
  const scored = (await loadIndex())
    .map((t) => ({ ...t, d: Math.hypot(t.r - color.r, t.g - color.g, t.b - color.b) + 255 * Math.abs(t.a - color.a) }))
    .sort((x, y) => x.d - y.d)
  const exact = scored.filter((t) => t.d < 1.5)
  return { exact: exact.map((t) => t.name), nearest: scored.slice(0, 3) }
}

/** Names of the color variables defined in src/styles/ (the design tokens, not shadcn's stock vars). */
function tokenNames() {
  const names = new Set()
  for (const f of fs.readdirSync(STYLES)) {
    for (const m of fs.readFileSync(path.join(STYLES, f), "utf8").matchAll(/--([a-z0-9-]+)\s*:/gi)) {
      names.add(m[1].replace(/^color-/, ""))
    }
  }
  return names
}

async function buildIndex() {
  const url = "http://localhost:3000/design-system/button"
  await requirePage(url)
  const allowed = tokenNames()
  const page = await openPage(url)
  try {
    const tokens = await page.evaluate(`(() => {
      const allowed = new Set(${JSON.stringify([...allowed])})
      const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })
      const css = getComputedStyle(document.documentElement)
      const out = []
      for (const name of allowed) {
        const value = css.getPropertyValue("--" + name).trim()
        if (!value) continue
        ctx.fillStyle = "#010203"
        ctx.fillStyle = value
        if (ctx.fillStyle === "#010203" && value !== "#010203") continue
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
        out.push({ name, hex, r, g, b, a: Math.round((a / 255) * 100) / 100 })
      }
      return out
    })()`)
    // Semantic tokens first, raw palette (default-*) last, so the first exact match is the one to use.
    tokens.sort((x, y) => x.name.startsWith("default-") - y.name.startsWith("default-") || x.name.localeCompare(y.name))
    fs.writeFileSync(INDEX, JSON.stringify(tokens, null, 0).replace(/},{/g, "},\n{") + "\n")
    console.error(`hex index: ${tokens.length} color tokens -> ${path.relative(process.cwd(), INDEX)}`)
  } finally {
    page.close()
  }
}
