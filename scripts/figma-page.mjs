// Reads one Figma page FRAME through TalkToFigma and lists which components it uses,
// matched against what we already built in src/components. No LLM, no tokens.
// Run: pnpm -s figma:page <frame-node-id> <slug>
// Writes design/handoff/<slug>/page.md: table of Figma component -> our file | MISSING,
// with count, variant props seen, and a layout outline (top 2 levels).

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"

const [frameId, slug] = process.argv.slice(2)
if (!frameId || !slug) {
  console.error("usage: pnpm -s figma:page <frame-node-id> <slug>")
  process.exit(2)
}
const fail = (m) => (console.error(m), process.exit(1))

// --- Our components: exported name -> file -------------------------------------------
const ours = new Map()
const walkDir = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walkDir(p)
    else if (/\.tsx$/.test(e.name)) {
      const src = fs.readFileSync(p, "utf8")
      for (const m of src.matchAll(/export\s+(?:default\s+)?(?:function|const)\s+([A-Z]\w*)/g)) ours.set(norm(m[1]), path.relative(process.cwd(), p).replaceAll("\\", "/") + `#${m[1]}`)
      for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) for (const n of m[1].split(",")) { const x = n.trim().split(/\s+as\s+/).pop(); if (/^[A-Z]/.test(x)) ours.set(norm(x), path.relative(process.cwd(), p).replaceAll("\\", "/") + `#${x}`) }
    }
  }
}
walkDir(path.join(process.cwd(), "src/components"))
function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "")
}

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

// --- Read the frame ----------------------------------------------------------------------
const root = (await figma("get_nodes_info", { nodeIds: [frameId] }, 300000))[0]?.document
if (!root) fail(`node ${frameId} not found`)

const setNameCache = new Map()
async function mainName(inst) {
  const id = inst.componentId ?? inst.mainComponent?.id
  if (!id) return { name: inst.name, props: "" }
  if (!setNameCache.has(id)) {
    const c = (await figma("get_nodes_info", { nodeIds: [id] }).catch(() => []))[0]?.document
    // variant component name looks like "Size=md, State=default"; its parent set holds the real name
    setNameCache.set(id, c ? { name: /=/.test(c.name) ? null : c.name, variant: /=/.test(c.name) ? c.name : "", parent: c.parentId ?? null } : { name: inst.name, variant: "" })
  }
  const e = setNameCache.get(id)
  if (e.name === null && e.parent) {
    const p = (await figma("get_nodes_info", { nodeIds: [e.parent] }).catch(() => []))[0]?.document
    e.name = p?.name ?? inst.name
  }
  return { name: e.name ?? inst.name, props: e.variant }
}

const used = new Map() // name -> { count, props:Set }
const outline = []
async function walk(node, depth) {
  if (!node?.type) return
  if (depth <= 2 && node.type !== "TEXT") {
    const b = node.absoluteBoundingBox
    outline.push(`${"  ".repeat(depth)}${node.name} [${node.type.toLowerCase()}]${b ? ` ${Math.round(b.width)}x${Math.round(b.height)}` : ""}`)
  }
  if (node.type === "INSTANCE") {
    const { name, props } = await mainName(node)
    const u = used.get(name) ?? { count: 0, props: new Set() }
    u.count++
    if (props) u.props.add(props)
    used.set(name, u)
    return // do not descend: nested parts belong to the component
  }
  for (const c of node.children ?? []) await walk(c, depth + 1)
}
await walk(root, 0)
ws.close()

const rows = [...used.entries()].sort((a, b) => b[1].count - a[1].count).map(([name, u]) => {
  const hit = ours.get(norm(name))
  return `| ${name} | ${u.count} | ${hit ?? "**MISSING**"} | ${[...u.props].slice(0, 6).join("; ")} |`
})
const missing = [...used.keys()].filter((n) => !ours.has(norm(n)))
const outDir = path.join(process.cwd(), "design/handoff", slug)
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, "page.md"),
  [`# Page: ${slug} (frame ${frameId})`, "", "| Figma component | Uses | Ours | Variants seen |", "|---|---|---|---|", ...rows, "", `Missing: ${missing.join(", ") || "none"}`, "", "## Layout (top levels)", "", ...outline, ""].join("\n"),
)
console.log(`design/handoff/${slug}/page.md: ${used.size} components, ${missing.length} missing`)
process.exit(0)
