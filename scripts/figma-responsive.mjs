// Reads the desktop and mobile frames of one Figma page and writes
// design/handoff/<slug>/responsive.md: per frame a layer outline (size + position
// relative to the frame, instances named but not entered) plus a desktop-vs-mobile diff,
// and a PNG of each frame in img/. No LLM, no tokens.
// Run: pnpm -s figma:responsive <slug> <desktop-frame-id> <mobile-frame-id>

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const [slug, desktopId, mobileId] = process.argv.slice(2)
if (!slug || !desktopId || !mobileId) {
  console.error("usage: pnpm -s figma:responsive <slug> <desktop-frame-id> <mobile-frame-id>")
  process.exit(2)
}
const fail = (m) => (console.error(m), process.exit(1))

// --- TalkToFigma socket ----------------------------------------------------------------
let channel
try { channel = (await (await fetch("http://127.0.0.1:3055/figma-channel")).text()).trim() } catch {}
if (!channel) fail("no Figma plugin on the TalkToFigma socket server (:3055)")
const ws = new WebSocket("ws://localhost:3055")
const waiting = new Map()
ws.onmessage = ({ data }) => {
  const body = JSON.parse(data).message
  if (!body || typeof body !== "object" || !waiting.has(body.id)) return
  if (body.error) waiting.get(body.id).reject(new Error(body.error))
  else if ("result" in body) waiting.get(body.id).resolve(body.result)
  else return
  waiting.delete(body.id)
}
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("cannot connect to ws://localhost:3055")) }).catch((e) => fail(e.message))
function send(type, command, params = {}, timeout = 120000) {
  const id = crypto.randomUUID()
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => (waiting.delete(id), reject(new Error(`${command} timed out`))), timeout)
    waiting.set(id, { resolve: (r) => (clearTimeout(t), resolve(r)), reject: (e) => (clearTimeout(t), reject(e)) })
    ws.send(JSON.stringify({ id, type, channel, message: { id, command, params: { ...params, commandId: id } } }))
  })
}
const figma = (c, p, t) => send("message", c, p, t)
try { await send("join", "join", { channel }, 10000) } catch (e) { fail(`FIGMA DOWN: ${e.message}`) }

const outDir = path.join(process.cwd(), "design/handoff", slug)
const imgDir = path.join(outDir, "img")
fs.mkdirSync(imgDir, { recursive: true })

const r = (n) => Math.round(n)
async function outline(id, label) {
  const root = (await figma("get_nodes_info", { nodeIds: [id] }, 300000))[0]?.document
  if (!root) fail(`node ${id} not found`)
  const ox = root.absoluteBoundingBox.x
  const oy = root.absoluteBoundingBox.y
  const lines = []
  const walk = (n, depth) => {
    if (!n?.type || n.visible === false) return
    const b = n.absoluteBoundingBox
    const text = n.type === "TEXT" ? ` "${(n.characters ?? "").replace(/\s+/g, " ").slice(0, 40)}" ${n.style?.fontSize ?? ""}/${r(n.style?.lineHeightPx ?? 0)}` : ""
    const img = (n.fills ?? []).some((f) => f.type === "IMAGE") ? " [photo]" : ""
    lines.push({ depth, key: n.name, text: `${"  ".repeat(depth)}${n.name} [${n.type.toLowerCase()}]${b ? ` ${r(b.width)}x${r(b.height)} @${r(b.x - ox)},${r(b.y - oy)}` : ""}${img}${text}` })
    if (n.type === "INSTANCE" || depth >= 6) return
    for (const c of n.children ?? []) walk(c, depth + 1)
  }
  walk(root, 0)
  const png = await figma("export_node_as_image", { nodeId: id, format: "PNG", scale: 0.5 }, 180000)
  const file = `${label}.png`
  fs.writeFileSync(path.join(imgDir, file), Buffer.from(png.imageData, "base64"))
  return { lines, file, width: r(root.absoluteBoundingBox.width), height: r(root.absoluteBoundingBox.height) }
}

try { await send("join", "join", { channel }, 10000) } catch (e) { fail(`FIGMA DOWN: ${e.message}`) }
const desktop = await outline(desktopId, "desktop")
const mobile = await outline(mobileId, "mobile")
ws.close()

const names = (o) => new Set(o.lines.map((l) => l.key))
const onlyDesktop = [...names(desktop)].filter((n) => !names(mobile).has(n))
const onlyMobile = [...names(mobile)].filter((n) => !names(desktop).has(n))

fs.writeFileSync(
  path.join(outDir, "responsive.md"),
  [
    `# Responsive: ${slug}`,
    "",
    `Desktop ${desktop.width}x${desktop.height} (${desktopId}), mobile ${mobile.width}x${mobile.height} (${mobileId}). Positions are relative to the frame. Instances are named, not entered.`,
    "Images: img/desktop.png, img/mobile.png (scale 0.5). `[photo]` = layer with an image fill.",
    "",
    "## Only on desktop",
    ...(onlyDesktop.length ? onlyDesktop.map((n) => `- ${n}`) : ["- none"]),
    "",
    "## Only on mobile",
    ...(onlyMobile.length ? onlyMobile.map((n) => `- ${n}`) : ["- none"]),
    "",
    `## Desktop outline (${desktop.width})`,
    "```",
    ...desktop.lines.map((l) => l.text),
    "```",
    "",
    `## Mobile outline (${mobile.width})`,
    "```",
    ...mobile.lines.map((l) => l.text),
    "```",
    "",
  ].join("\n"),
)
console.log(`design/handoff/${slug}/responsive.md: desktop ${desktop.lines.length} layers, mobile ${mobile.lines.length} layers, only-desktop ${onlyDesktop.length}, only-mobile ${onlyMobile.length}`)
process.exit(0)
