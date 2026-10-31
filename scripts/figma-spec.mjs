// Reads one Figma page through the TalkToFigma plugin and writes a complete, compact
// spec of every component set: variants, layer tree, sizes, radius, padding/gap
// (computed from bounding boxes), typography and colors as existing tokens.
// No LLM involved, so reading the whole page costs no tokens.
// Run: pnpm -s figma:spec <page-id> <slug>
// Needs the TalkToFigma socket server (:3055) with the plugin connected, and the
// token index (design/tokens/hex-index.json, see scripts/lib/tokens.mjs).
// Writes design/handoff/<slug>/figma.md and one PNG per set in design/handoff/<slug>/img/.

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { matchColor } from "./lib/tokens.mjs"

const [pageId, slug] = process.argv.slice(2)
if (!pageId || !slug) {
  console.error("usage: pnpm -s figma:spec <page-id> <slug>")
  process.exit(2)
}
const outDir = path.join(process.cwd(), "design/handoff", slug)
const imgDir = path.join(outDir, "img")
fs.mkdirSync(imgDir, { recursive: true })

// --- TalkToFigma socket ---------------------------------------------------------

let channel
try {
  channel = (await (await fetch("http://127.0.0.1:3055/figma-channel")).text()).trim()
} catch {}
if (!channel) fail("no Figma plugin on the TalkToFigma socket server (:3055)")

const ws = new WebSocket("ws://localhost:3055")
const waiting = new Map()
ws.onmessage = ({ data }) => {
  const msg = JSON.parse(data)
  const body = msg.message
  if (!body || typeof body !== "object" || !waiting.has(body.id)) return
  if (body.error) waiting.get(body.id).reject(new Error(body.error))
  else if ("result" in body) waiting.get(body.id).resolve(body.result)
  else return
  waiting.delete(body.id)
}
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = () => reject(new Error("cannot connect to ws://localhost:3055"))
}).catch((e) => fail(e.message))

function send(type, command, params = {}, timeout = 120000) {
  const id = crypto.randomUUID()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      waiting.delete(id)
      reject(new Error(`${command} timed out`))
    }, timeout)
    waiting.set(id, {
      resolve: (r) => (clearTimeout(timer), resolve(r)),
      reject: (e) => (clearTimeout(timer), reject(e)),
    })
    ws.send(JSON.stringify({ id, type, channel, message: { id, command, params: { ...params, commandId: id } } }))
  })
}
const figma = (command, params, timeout) => send("message", command, params, timeout)

// --- Read the page ----------------------------------------------------------------

try {
  await send("join", "join", { channel }, 10000)
  // set_focus loads and opens the page; it can fail once while Figma loads it.
  await figma("set_focus", { nodeId: pageId }).catch(() => figma("set_focus", { nodeId: pageId }))
} catch (e) {
  fail(`FIGMA DOWN: ${e.message}`)
}

const { matchingNodes: sets } = await figma("scan_nodes_by_types", { nodeId: pageId, types: ["COMPONENT_SET"] })
const { matchingNodes: components } = await figma("scan_nodes_by_types", { nodeId: pageId, types: ["COMPONENT"] })

const colors = new Map() // "#hex@alpha" -> token or null
const lines = []
const setRows = []
const inSet = new Set()

for (const set of sets) {
  const tree = (await figma("get_nodes_info", { nodeIds: [set.id] }, 300000))[0]?.document
  const variants = (tree?.children ?? []).filter((c) => c && c.type === "COMPONENT")
  variants.forEach((v) => inSet.add(v.id))
  const props = {}
  for (const v of variants) {
    for (const part of v.name.split(",")) {
      const [k, val] = part.split("=").map((s) => s.trim())
      if (val === undefined) continue
      ;(props[k] ??= new Set()).add(val)
    }
  }
  const img = await exportPng(set)
  setRows.push(
    `| ${set.name} | ${set.id} | ${variants.length} | ${Object.entries(props).map(([k, v]) => `${k}: ${[...v].join("/")}`).join("; ")} | ${img} |`,
  )

  lines.push(`\n## ${set.name} (${set.id}, ${variants.length} variants)`)
  let first
  for (const v of variants) {
    const layer = await describe(v)
    if (!first) {
      first = layer
      lines.push(`\n### ${v.name} (${v.id}): full tree`)
      lines.push(...layer.map((l) => l.text))
      continue
    }
    const base = new Map(first.map((l) => [l.key, l.text]))
    const diff = layer.filter((l) => base.get(l.key) !== l.text)
    const missing = first.filter((l) => !layer.some((x) => x.key === l.key))
    lines.push(`\n### ${v.name} (${v.id}): differs from first`)
    if (!diff.length && !missing.length) lines.push("same as first")
    lines.push(...diff.map((l) => l.text))
    lines.push(...missing.map((l) => `${l.text.match(/^\s*/)[0]}(no ${l.key.split("/").pop()})`))
  }
}

const loose = components.filter((c) => !inSet.has(c.id))
for (const c of loose) {
  const tree = (await figma("get_nodes_info", { nodeIds: [c.id] }, 120000))[0]?.document
  if (!tree) continue
  const img = await exportPng(c)
  setRows.push(`| ${c.name} (single component) | ${c.id} | 1 | | ${img} |`)
  lines.push(`\n## ${c.name} (${c.id}, single component)`)
  lines.push(...(await describe(tree)).map((l) => l.text))
}
ws.close()

// --- Colors → tokens ------------------------------------------------------------

const unresolved = []
for (const key of colors.keys()) {
  const [hex, alpha] = key.split("@")
  const n = parseInt(hex.slice(1), 16)
  const { exact, nearest } = await matchColor({ r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: Number(alpha) })
  if (exact.length) colors.set(key, exact[0])
  else {
    colors.set(key, null)
    unresolved.push(`- ${key}: nearest ${nearest.map((t) => `${t.name} (${t.hex})`).join(", ")}`)
  }
}
const text = lines.join("\n").replace(/\{\{(#[0-9a-f]{6}@[\d.]+)\}\}/g, (_, k) => colors.get(k) ?? `${k.replace("@1", "")}(no token)`)

const doc = [
  `# Figma spec: ${slug} (page ${pageId})`,
  "",
  "Generated by `pnpm figma:spec` from TalkToFigma, every set on the page. Sizes in px.",
  "`pad` (top right bottom left) and `gap` are computed from bounding boxes. Colors are",
  "existing tokens (`pnpm token:hex`); `(no token)` = no exact match, see Unresolved.",
  "The plugin does not expose stroke width, effects (shadows/blur), opacity of",
  "layers or auto-layout settings: read those from the images.",
  "",
  "## Sets",
  "",
  "| Set | Node | Variants | Properties | Image |",
  "|---|---|---|---|---|",
  ...setRows,
  text,
  "",
  "## Unresolved colors",
  "",
  ...(unresolved.length ? unresolved : ["none"]),
  "",
].join("\n")
fs.writeFileSync(path.join(outDir, "figma.md"), doc)
console.log(
  `${path.relative(process.cwd(), path.join(outDir, "figma.md"))}: ${sets.length} sets, ${loose.length} single components, ` +
    `${colors.size} colors (${unresolved.length} without exact token), ${Math.round(doc.length / 1024)} KB, images in ${path.relative(process.cwd(), imgDir)}`,
)
process.exit(0)

// --- Helpers ----------------------------------------------------------------------

function fail(message) {
  console.error(message)
  process.exit(1)
}

async function exportPng(node) {
  const big = node.bbox ? node.bbox.width * node.bbox.height > 1200 * 1200 : false
  try {
    const res = await figma("export_node_as_image", { nodeId: node.id, scale: big ? 0.25 : 0.5 }, 120000)
    const file = path.join(imgDir, `${node.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || node.id.replace(":", "-")}.png`)
    fs.writeFileSync(file, Buffer.from(res.imageData, "base64"))
    return path.relative(outDir, file).replaceAll("\\", "/")
  } catch (e) {
    return `export failed: ${e.message}`
  }
}

/** Placeholder replaced by the token name once all colors are matched in one pass. */
function color(value, opacity = 1) {
  // The plugin sends hex for most paints but raw { r, g, b, a } (0-1) for some.
  const hex =
    typeof value === "string"
      ? value
      : "#" + [value.r, value.g, value.b, value.a ?? 1].map((c) => Math.round(c * 255).toString(16).padStart(2, "0")).join("")
  const n = hex.slice(1, 7)
  const a = (hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1) * opacity
  const key = `#${n.toLowerCase()}@${Math.round(a * 100) / 100}`
  colors.set(key, colors.get(key))
  return `{{${key}}}`
}

function paints(list = []) {
  return list
    .filter((p) => p.visible !== false)
    .map((p) => {
      if (p.type === "SOLID") return color(p.color, p.opacity ?? 1)
      if (p.type?.startsWith("GRADIENT")) return `${p.type.replace("GRADIENT_", "").toLowerCase()}(${(p.gradientStops ?? []).map((s) => `${color(s.color, p.opacity ?? 1)} ${Math.round(s.position * 100)}%`).join(", ")})`
      return p.type?.toLowerCase()
    })
    .join(" + ")
}

/** One line per layer: key (path of names) for diffing, text for the spec. */
async function describe(root) {
  const out = []
  const walk = (node, depth, keyPath) => {
    if (!node || !node.type) return
    const key = `${keyPath}/${node.name}`
    const box = node.absoluteBoundingBox
    const parts = [`${"  ".repeat(depth)}${node.name} [${node.type.toLowerCase()}]`]
    if (box) parts.push(`${r(box.width)}x${r(box.height)}`)
    if (node.cornerRadius) parts.push(`r${r(node.cornerRadius)}`)
    if (node.fills?.length && node.type !== "TEXT") parts.push(`fill ${paints(node.fills)}`)
    if (node.strokes?.length) parts.push(`stroke ${paints(node.strokes)}`)
    if (node.type === "TEXT") {
      const s = node.style ?? {}
      parts.push(
        `text "${(node.characters ?? "").replace(/\s+/g, " ").slice(0, 60)}" ${s.fontFamily ?? ""} ${s.fontWeight ?? ""} ${s.fontSize ?? ""}/${s.lineHeightPx ? r(s.lineHeightPx) : "auto"}` +
          `${s.letterSpacing ? ` ls${r(s.letterSpacing)}` : ""} ${paints(node.fills)}`,
      )
    }
    const kids = (node.children ?? []).filter((c) => c && c.absoluteBoundingBox)
    if (box && kids.length && node.type !== "TEXT") {
      const k = kids.map((c) => c.absoluteBoundingBox)
      const pad = [
        Math.min(...k.map((c) => c.y)) - box.y,
        box.x + box.width - Math.max(...k.map((c) => c.x + c.width)),
        box.y + box.height - Math.max(...k.map((c) => c.y + c.height)),
        Math.min(...k.map((c) => c.x)) - box.x,
      ].map(r)
      if (pad.some((p) => p > 0)) parts.push(`pad ${pad.join(" ")}`)
      if (k.length > 1) {
        const byX = [...k].sort((a, b) => a.x - b.x)
        const byY = [...k].sort((a, b) => a.y - b.y)
        const gapsX = byX.slice(1).map((c, i) => c.x - (byX[i].x + byX[i].width))
        const gapsY = byY.slice(1).map((c, i) => c.y - (byY[i].y + byY[i].height))
        const row = gapsX.every((g) => g >= -0.5)
        const gaps = (row ? gapsX : gapsY).map(r)
        if (gaps.every((g) => g >= 0)) parts.push(`${row ? "row" : "col"} gap ${new Set(gaps).size === 1 ? gaps[0] : gaps.join("/")}`)
      }
    }
    if (node.type === "INSTANCE" && box && box.width <= 48 && box.height <= 48) parts.push("(icon?)")
    out.push({ key, text: parts.join(" ") })
    node.children?.forEach((c) => walk(c, depth + 1, key))
  }
  walk(root, 0, "")
  return out
}

function r(n) {
  return Math.round(n * 10) / 10
}
