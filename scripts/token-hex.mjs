// Maps Figma hex colors to design-token utility names (Light mode, default theme),
// so specs and components use exact tokens instead of guesses.
// Run: pnpm -s token:hex "#e6e6e6" "#4d4d4d@20" "rgba(0,0,0,0.5)"
//      (`@20` = 20% layer/fill opacity). Prints exact matches, else the 3 nearest.
// The index (design/tokens/hex-index.json) is built by resolving every color CSS
// variable (src/styles/ tokens) in headless Chrome, so themes, aliases and alpha composites are real values.
// It rebuilds itself when src/styles/ is newer (needs `pnpm dev` on :3000 then).

import fs from "node:fs"
import path from "node:path"
import { openPage, requirePage } from "./lib/chrome.mjs"

const INDEX = path.join(process.cwd(), "design/tokens/hex-index.json")
const STYLES = path.join(process.cwd(), "src/styles")

const inputs = process.argv.slice(2)
if (!inputs.length) {
  console.error('usage: pnpm -s token:hex "#e6e6e6" "#4d4d4d@20" "rgba(0,0,0,0.5)"')
  process.exit(2)
}

const stylesTime = Math.max(...fs.readdirSync(STYLES).map((f) => fs.statSync(path.join(STYLES, f)).mtimeMs))
if (!fs.existsSync(INDEX) || fs.statSync(INDEX).mtimeMs < stylesTime) await buildIndex()
const index = JSON.parse(fs.readFileSync(INDEX, "utf8"))

for (const input of inputs) {
  const color = parse(input)
  if (!color) {
    console.log(`${input}: not a color`)
    continue
  }
  const scored = index
    .map((t) => ({ ...t, d: Math.hypot(t.r - color.r, t.g - color.g, t.b - color.b) + 255 * Math.abs(t.a - color.a) }))
    .sort((x, y) => x.d - y.d)
  const exact = scored.filter((t) => t.d < 1.5)
  if (exact.length) {
    console.log(`${input}: ${exact.slice(0, 6).map((t) => t.name).join(", ")}`)
  } else {
    console.log(`${input}: no exact token; nearest ${scored.slice(0, 3).map((t) => `${t.name} (${t.hex}, off ${t.d.toFixed(0)})`).join(", ")}`)
  }
}

function parse(s) {
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
    let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : Number(m[4])
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a }
  }
  return null
}

async function buildIndex() {
  const url = "http://localhost:3000/design-system/button"
  await requirePage(url)
  const page = await openPage(url)
  try {
    const tokens = await page.evaluate(`(() => {
      const names = new Set()
      const walk = (rules) => {
        for (const rule of rules) {
          if (rule.cssRules) walk(rule.cssRules)
          if (rule.style) for (const p of rule.style) if (p.startsWith("--") && !p.startsWith("--tw-")) names.add(p)
        }
      }
      for (const sheet of document.styleSheets) { try { walk(sheet.cssRules) } catch {} }
      const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })
      const css = getComputedStyle(document.documentElement)
      const out = []
      for (const name of names) {
        const value = css.getPropertyValue(name).trim()
        if (!value) continue
        ctx.fillStyle = "#010203"
        ctx.fillStyle = value
        if (ctx.fillStyle === "#010203" && value !== "#010203") continue
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
        const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
        out.push({ name: name.replace(/^--(color-)?/, ""), hex, r, g, b, a: Math.round((a / 255) * 100) / 100 })
      }
      return out
    })()`)
    // Semantic names first, raw palette (default-*) last, so exact matches list the token to use.
    const unique = [...new Map(tokens.map((t) => [t.name, t])).values()]
    unique.sort((x, y) => x.name.startsWith("default-") - y.name.startsWith("default-") || x.name.localeCompare(y.name))
    fs.writeFileSync(INDEX, JSON.stringify(unique, null, 0).replace(/},{/g, "},\n{") + "\n")
    console.error(`hex index: ${unique.length} color tokens -> ${path.relative(process.cwd(), INDEX)}`)
  } finally {
    page.close()
  }
}
