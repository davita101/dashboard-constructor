// Fetches Figma nodes over the REST API (no MCP call limit) for design-to-code work.
// Run: pnpm figma:fetch <node-id> [<node-id> ...]      e.g. pnpm figma:fetch 6978-36557
//
// Needs FIGMA_TOKEN in the environment or in .env.local (Figma → Settings → Security → Personal access token, read-only).
//
// Writes design/figma-dump/<node-id>/:
//   node.json   raw REST response
//   tree.txt    compact layer tree: layout, sizes, token names for colors, text styles, text content
//   assets/     icon SVGs (one per icon component) and image fills, named after the Figma layer

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const API = "https://api.figma.com/v1"
const root = join(dirname(fileURLToPath(import.meta.url)), "..")

if (existsSync(join(root, ".env.local"))) process.loadEnvFile(join(root, ".env.local"))

const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "bufdHvUnBhRxUPrIgDYoLw"

const token = process.env.FIGMA_TOKEN
if (!token) {
  console.error("FIGMA_TOKEN is not set.")
  process.exit(1)
}
const ids = process.argv.slice(2).map((id) => id.replace("-", ":"))
if (ids.length === 0) {
  console.error("Usage: pnpm figma:fetch <node-id> [<node-id> ...]")
  process.exit(1)
}

async function api(path) {
  const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}: ${await res.text()}`)
  return res.json()
}

const slug = (s) =>
  String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

// ---------------------------------------------------------------------------
// Color → token name, resolved from the variables export (Color Mode: Light, first mode elsewhere)

const exportJson = JSON.parse(readFileSync(join(root, "design/tokens/figma-variables.json"), "utf8"))
const composites = JSON.parse(readFileSync(join(root, "design/tokens/figma-composites.json"), "utf8"))
const collections = Object.fromEntries(exportJson.map((e) => Object.entries(e)[0]))

function leaves(tree, path = []) {
  if (tree && tree.$type !== undefined) return [[path, tree]]
  return Object.entries(tree).flatMap(([k, v]) => leaves(v, [...path, k]))
}

// leaf name → token, first mode of every collection (Color Mode → Light)
const byName = new Map()
for (const [name, c] of Object.entries(collections)) {
  const mode = name === "Color Mode" ? c.modes.Light : Object.values(c.modes)[0]
  for (const [path, tok] of leaves(mode)) {
    const leaf = path.at(-1)
    if (!byName.has(leaf)) byName.set(leaf, tok)
    byName.set(path.join("."), tok)
  }
}

function resolveHex(value, depth = 0) {
  if (depth > 10 || typeof value !== "string") return null
  const m = /^\{(.+)\}$/.exec(value)
  if (!m) return value.toLowerCase()
  const target = byName.get(m[1]) ?? byName.get(m[1].split(".").at(-1))
  return target ? resolveHex(target.$value, depth + 1) : null
}

const toHex2 = (n) => Math.round(n * 255).toString(16).padStart(2, "0")
const hexOf = ({ r, g, b, a = 1 }, opacity = 1) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}${toHex2(a * opacity)}`

// hex8 → semantic token names (Color Mode leaves, e.g. base-0, primary-600, green-alpha-10)
const tokensByHex = new Map()
const addToken = (hex8, name) => {
  if (!tokensByHex.has(hex8)) tokensByHex.set(hex8, [])
  if (!tokensByHex.get(hex8).includes(name)) tokensByHex.get(hex8).push(name)
}
for (const [path, tok] of leaves(collections["Color Mode"].modes.Light)) {
  const hex = resolveHex(tok.$value)
  if (hex) addToken(hex.length === 7 ? `${hex}ff` : hex, path.at(-1))
}
// <group>-alpha-<N>: base color at N% (see figma-composites.json)
for (const [path] of leaves(collections["Color Mode"].modes.Light)) {
  const leaf = path.at(-1)
  const m = /^(.+)-alpha-(\d+)$/.exec(leaf)
  if (!m) continue
  const group = path.length > 1 ? path[0] : m[1]
  const baseName = composites.alphaBase?.[group] ?? composites.alphaBase?.[group.charAt(0).toUpperCase() + group.slice(1)]
  const base = baseName && resolveHex(`{${baseName}}`)
  if (base) addToken(`${base.slice(0, 7)}${toHex2(Number(m[2]) / 100)}`, leaf)
}

function colorName(paint) {
  if (!paint || paint.visible === false) return null
  if (paint.type === "SOLID") {
    const hex = hexOf(paint.color, paint.opacity ?? 1)
    const names = tokensByHex.get(hex)
    return names ? `${names.slice(0, 3).join("|")}` : hex
  }
  if (paint.type.startsWith("GRADIENT")) {
    const stops = paint.gradientStops.map((s) => colorName({ type: "SOLID", color: s.color }))
    return `${paint.type.replace("GRADIENT_", "").toLowerCase()}(${stops.join(" → ")})`
  }
  if (paint.type === "IMAGE") return `image(${paint.imageRef})`
  return paint.type.toLowerCase()
}

// ---------------------------------------------------------------------------
// Compact tree

function describe(node, styles) {
  const parts = [`${node.type.toLowerCase()} "${node.name}" #${node.id}`]
  if (node.visible === false) parts.push("HIDDEN")
  const box = node.absoluteBoundingBox
  if (box) parts.push(`${Math.round(box.width)}×${Math.round(box.height)}`)
  if (node.layoutMode && node.layoutMode !== "NONE") {
    const pad = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft].map((p) => p ?? 0)
    parts.push(
      `${node.layoutMode === "HORIZONTAL" ? "row" : "col"} gap=${node.itemSpacing ?? 0} pad=${pad.join("/")} main=${node.primaryAxisAlignItems ?? "MIN"} cross=${node.counterAxisAlignItems ?? "MIN"}`
    )
    if (node.layoutWrap === "WRAP") parts.push("wrap")
  }
  if (node.layoutSizingHorizontal || node.layoutSizingVertical)
    parts.push(`sizing=${node.layoutSizingHorizontal ?? "-"}/${node.layoutSizingVertical ?? "-"}`)
  if (node.layoutGrow === 1) parts.push("grow")
  if (node.layoutPositioning === "ABSOLUTE") parts.push("absolute")
  if (node.cornerRadius) parts.push(`r=${node.cornerRadius}`)
  if (node.rectangleCornerRadii) parts.push(`r=${node.rectangleCornerRadii.join("/")}`)
  const fills = (node.fills ?? []).map(colorName).filter(Boolean)
  if (fills.length) parts.push(`fill=${fills.join(",")}`)
  const strokes = (node.strokes ?? []).map(colorName).filter(Boolean)
  if (strokes.length) parts.push(`stroke=${strokes.join(",")} ${node.strokeWeight ?? 1}px ${node.strokeAlign?.toLowerCase() ?? ""}`)
  for (const [kind, id] of Object.entries(node.styles ?? {})) {
    const name = styles[id]?.name
    if (name && kind !== "fill" && kind !== "stroke") parts.push(`${kind}Style="${name}"`)
  }
  const effects = (node.effects ?? []).filter((e) => e.visible !== false)
  if (effects.length && !node.styles?.effect)
    parts.push(
      `effects=${effects.map((e) => `${e.type.toLowerCase()}(${e.offset?.x ?? 0},${e.offset?.y ?? 0},${e.radius},${e.spread ?? 0},${e.color ? colorName({ type: "SOLID", color: e.color }) : ""})`).join(",")}`
    )
  if (node.opacity !== undefined && node.opacity < 1) parts.push(`opacity=${node.opacity}`)
  if (node.clipsContent) parts.push("clip")
  if (node.type === "TEXT") {
    const s = node.style ?? {}
    parts.push(`font=${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${Math.round(s.lineHeightPx ?? 0)} ls=${s.letterSpacing ?? 0} align=${s.textAlignHorizontal}`)
    parts.push(`text=${JSON.stringify(node.characters)}`)
  }
  if (node.componentProperties) {
    const props = Object.entries(node.componentProperties).map(([k, v]) => `${k.split("#")[0]}=${v.value}`)
    parts.push(`props{${props.join(", ")}}`)
  }
  if (node.componentPropertyDefinitions) {
    const defs = Object.entries(node.componentPropertyDefinitions).map(
      ([k, v]) => `${k.split("#")[0]}:${v.type}${v.variantOptions ? `[${v.variantOptions.join("|")}]` : ""}=${v.defaultValue}`
    )
    parts.push(`defs{${defs.join(", ")}}`)
  }
  return parts.join(" ")
}

function walk(node, styles, visit, depth = 0, lines = []) {
  lines.push(`${"  ".repeat(depth)}${describe(node, styles)}`)
  visit(node)
  // Icons are exported as SVG files; their vector internals are noise in the tree.
  if (!isIcon(node)) for (const child of node.children ?? []) walk(child, styles, visit, depth + 1, lines)
  return lines
}

const isIcon = (node) =>
  /^(material-|icon$|Icon$)/.test(node.name) ||
  ((node.type === "INSTANCE" || node.type === "COMPONENT" || node.type === "FRAME") &&
    node.children?.length > 0 &&
    node.children.every((c) => ["VECTOR", "BOOLEAN_OPERATION", "ELLIPSE", "STAR", "LINE", "POLYGON"].includes(c.type)))

// ---------------------------------------------------------------------------

async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} downloading ${url}`)
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
}

const data = await api(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids.join(","))}`)
let imageFills = null

for (const id of ids) {
  const entry = data.nodes[id]
  if (!entry) {
    console.error(`Node ${id} not found`)
    continue
  }
  const outDir = join(root, "design/figma-dump", id.replace(":", "-"))
  const assetDir = join(outDir, "assets")
  mkdirSync(assetDir, { recursive: true })
  writeFileSync(join(outDir, "node.json"), JSON.stringify(entry, null, 1))

  const icons = new Map() // key (componentId or node id) → { id, name }
  const imageRefs = new Map() // imageRef → layer name
  const lines = walk(entry.document, entry.styles ?? {}, (node) => {
    if (isIcon(node) && node.visible !== false) {
      const key = node.componentId ?? node.id
      if (!icons.has(key)) icons.set(key, { id: node.id, name: node.name })
    }
    for (const f of node.fills ?? []) if (f.type === "IMAGE" && f.imageRef) imageRefs.set(f.imageRef, node.name)
  })
  writeFileSync(join(outDir, "tree.txt"), lines.join("\n") + "\n")

  // Icon SVGs, batched
  const iconList = [...icons.values()]
  const names = new Map()
  for (let i = 0; i < iconList.length; i += 50) {
    const batch = iconList.slice(i, i + 50)
    const { images } = await api(`/images/${FILE_KEY}?ids=${encodeURIComponent(batch.map((b) => b.id).join(","))}&format=svg`)
    for (const icon of batch) {
      if (!images[icon.id]) continue
      let name = slug(icon.name) || "icon"
      if (names.has(name)) name = `${name}-${icon.id.replace(/[:;]/g, "-")}`
      names.set(name, icon.id)
      await download(images[icon.id], join(assetDir, `${name}.svg`))
    }
  }

  // Image fills
  if (imageRefs.size) {
    imageFills ??= (await api(`/files/${FILE_KEY}/images`)).meta.images
    for (const [ref, layer] of imageRefs) {
      if (imageFills[ref]) await download(imageFills[ref], join(assetDir, `${slug(layer)}-${ref.slice(0, 6)}.img`))
    }
  }

  writeFileSync(
    join(assetDir, "index.json"),
    JSON.stringify({ icons: Object.fromEntries([...names].map(([n, nodeId]) => [n, nodeId])), images: Object.fromEntries(imageRefs) }, null, 1)
  )
  console.log(`${id}: ${lines.length} layers, ${names.size} icons, ${imageRefs.size} images → ${outDir}`)
}
