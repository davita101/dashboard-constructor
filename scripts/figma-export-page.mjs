// Exports every component set on a Figma page as SVG/PNG, one file per variant (no LLM, no tokens).
// One-variant sets are named after the set; multi-variant sets "<set>-<variant>".
// Run: node scripts/figma-export-page.mjs <page-id> <out-dir> [SVG|PNG] [scale]
// SVG needs the patched TalkToFigma plugin (export_node_as_image `format` param).
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const [pageId, outDir, formatArg, scaleArg] = process.argv.slice(2)
if (!pageId || !outDir) {
  console.error("usage: node scripts/figma-export-page.mjs <page-id> <out-dir> [SVG|PNG] [scale]")
  process.exit(2)
}
const format = (formatArg ?? "SVG").toUpperCase()
const scale = Number(scaleArg ?? 1)
const slug = (s) => s.replace(/^[^=]*=/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()
const channel = (await (await fetch("http://127.0.0.1:3055/figma-channel")).text()).trim()
if (!channel) throw new Error("no Figma plugin on :3055")
const ws = new WebSocket("ws://localhost:3055")
const waiting = new Map()
ws.onmessage = ({ data }) => {
  const body = JSON.parse(data).message
  if (!body || typeof body !== "object" || !waiting.has(body.id)) return
  const w = waiting.get(body.id)
  if (body.error) w.reject(new Error(body.error))
  else if ("result" in body) w.resolve(body.result)
  else return
  waiting.delete(body.id)
}
await new Promise((res, rej) => ((ws.onopen = res), (ws.onerror = () => rej(new Error("ws connect failed")))))
const send = (type, command, params = {}, timeout = 60000) =>
  new Promise((resolve, reject) => {
    const id = crypto.randomUUID()
    const t = setTimeout(() => (waiting.delete(id), reject(new Error(`${command} timed out`))), timeout)
    waiting.set(id, { resolve: (r) => (clearTimeout(t), resolve(r)), reject: (e) => (clearTimeout(t), reject(e)) })
    ws.send(JSON.stringify({ id, type, channel, message: { id, command, params: { ...params, commandId: id } } }))
  })
const figma = (c, p, t) => send("message", c, p, t)
await send("join", "join", { channel }, 10000)
await figma("set_focus", { nodeId: pageId }).catch(() => figma("set_focus", { nodeId: pageId }))

const { matchingNodes: sets } = await figma("scan_nodes_by_types", { nodeId: pageId, types: ["COMPONENT_SET"] }, 120000)
fs.mkdirSync(outDir, { recursive: true })
let ok = 0, total = 0
const failed = []
const used = new Set()
const unique = (n) => {
  let u = n, i = 2
  while (used.has(u)) u = `${n}-${i++}`
  used.add(u)
  return u
}
const inSet = new Set()
for (const set of sets) {
  const info = await figma("get_node_info", { nodeId: set.id })
  const kids = info.children ?? []
  for (const k of kids) {
    inSet.add(k.id)
    total++
    const name = unique(kids.length === 1 ? slug(set.name) : `${slug(set.name)}-${slug(k.name)}`)
    try {
      const r = await figma("export_node_as_image", { nodeId: k.id, scale, format }, 60000)
      fs.writeFileSync(path.join(outDir, `${name}.${format.toLowerCase()}`), Buffer.from(r.imageData, "base64"))
      ok++
    } catch (e) {
      failed.push(`${name}: ${e.message}`)
    }
  }
}
// Standalone components (icon pages without variants), one file each.
const { matchingNodes: comps } = await figma("scan_nodes_by_types", { nodeId: pageId, types: ["COMPONENT"] }, 300000)
for (const c of comps) {
  if (inSet.has(c.id)) continue
  total++
  const name = unique(slug(c.name) || c.id.replace(":", "-"))
  try {
    const r = await figma("export_node_as_image", { nodeId: c.id, scale, format }, 60000)
    fs.writeFileSync(path.join(outDir, `${name}.${format.toLowerCase()}`), Buffer.from(r.imageData, "base64"))
    ok++
  } catch (e) {
    failed.push(`${name}: ${e.message}`)
  }
}
console.log(`${ok}/${total} exported to ${outDir}`)
if (failed.length) console.log("failed:\n" + failed.join("\n"))
process.exit(0)
