// Exports every variant of one component set as a PNG (no LLM, no tokens).
// Run: node scripts/figma-export-variants.mjs <set-node-id> <out-dir> [scale] [PNG|SVG]
// SVG needs the patched TalkToFigma plugin (export_node_as_image `format` param); reload the plugin in Figma.
// Needs the TalkToFigma socket server (:3055) with the plugin connected.
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const [setId, outDir, scaleArg, formatArg] = process.argv.slice(2)
if (!setId || !outDir) {
  console.error("usage: node scripts/figma-export-variants.mjs <set-node-id> <out-dir> [scale]")
  process.exit(2)
}
const scale = Number(scaleArg ?? 1)
const format = (formatArg ?? "PNG").toUpperCase()
const ext = format.toLowerCase()
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
await send("join", "join", { channel }, 10000)

const info = await send("message", "get_node_info", { nodeId: setId })
const kids = info.children ?? []
fs.mkdirSync(outDir, { recursive: true })
let ok = 0
const failed = []
for (const k of kids) {
  const name = k.name.replace(/^[^=]*=/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()
  try {
    const r = await send("message", "export_node_as_image", { nodeId: k.id, scale, format }, 60000)
    fs.writeFileSync(path.join(outDir, `${name}.${ext}`), Buffer.from(r.imageData, "base64"))
    ok++
  } catch (e) {
    failed.push(`${k.name}: ${e.message}`)
  }
}
console.log(`${ok}/${kids.length} exported to ${outDir}`)
if (failed.length) console.log("failed:\n" + failed.join("\n"))
process.exit(0)
