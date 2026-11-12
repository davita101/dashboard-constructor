#!/usr/bin/env node
// Lists components (src/components, src/lib) and icons (public/icons) that production routes never reach.
//
//   node scripts/find-unused.mjs            report only
//   node scripts/find-unused.mjs --json     machine-readable report
//   node scripts/find-unused.mjs --delete   delete everything reported
//   --keep-design-system                    count /design-system pages as entry points too
//
// Components: import graph walked from every file in src/app (minus /design-system), src/proxy.ts, src/i18n.
// Icons: an icon is used when a reachable file (or messages/*.json) contains its exact path, or when it matches a
// dynamic path like `/icons/material-${name}.svg` AND its middle part ("bolt") appears as a string literal in
// reachable code. Templates with 2+ expressions (`${type}-${variant}`) keep every icon that matches the prefix and suffix.

import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..")
const SRC = path.join(ROOT, "src")
const ICONS = path.join(ROOT, "public", "icons")
const args = new Set(process.argv.slice(2))
const KEEP_DS = args.has("--keep-design-system")
const EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]
const ICON_EXT = /\.(svg|png|webp|jpe?g|gif|avif)$/i

const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/")

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const isCode = (p) => EXTS.includes(path.extname(p))
const isDesignSystem = (p) => rel(p).startsWith("src/app/design-system/")

// ---- entry points ----
const entries = [
  ...walk(path.join(SRC, "app")).filter((p) => isCode(p) && (KEEP_DS || !isDesignSystem(p))),
  ...walk(path.join(SRC, "i18n")).filter(isCode),
  ...["proxy.ts", "middleware.ts", "global.d.ts", "instrumentation.ts"].map((f) => path.join(SRC, f)).filter(fs.existsSync),
]

// ---- import graph ----
const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']|@import\s+["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g

function resolveSpec(spec, fromFile) {
  let base
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec)
  else return null // package
  const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => path.join(base, "index" + e))]
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null
}

const reachable = new Set()
const stack = [...entries]
while (stack.length) {
  const f = stack.pop()
  if (reachable.has(f)) continue
  reachable.add(f)
  const text = fs.readFileSync(f, "utf8")
  for (const m of text.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5]
    const r = resolveSpec(spec, f)
    if (r && isCode(r)) stack.push(r)
  }
}

const candidatesDirs = ["components", "lib"].map((d) => path.join(SRC, d))
const unusedComponents = candidatesDirs.flatMap((d) => walk(d)).filter((p) => isCode(p) && !reachable.has(p))

// ---- icons ----
const scanFiles = [...reachable, ...walk(path.join(ROOT, "messages")).filter((p) => p.endsWith(".json"))]
// Inline path constants per file (`const BRAND = "/icons/brands"` … `${BRAND}/adobe.svg`) so they read as literal paths.
const corpus = scanFiles
  .map((f) => {
    let text = fs.readFileSync(f, "utf8")
    for (const [, name, value] of text.matchAll(/\b(?:const|let|var)\s+(\w+)\s*=\s*["'`](\/icons\/[^"'`$]*)["'`]/g)) {
      text = text.replaceAll("${" + name + "}", value)
    }
    return text
  })
  .join("\n")

const literalPaths = new Set([...corpus.matchAll(/\/icons\/([A-Za-z0-9_\-./]+?\.(?:svg|png|webp|jpe?g|gif|avif))/g)].map((m) => m[1]))
const stringLits = new Set([...corpus.matchAll(/["'`]([A-Za-z0-9_\-./]+)["'`]/g)].map((m) => m[1]))

// Dynamic templates: `/icons/<prefix>${expr}<suffix>` (one or more expressions).
const templates = []
for (const m of corpus.matchAll(/\/icons\/((?:[A-Za-z0-9_\-./]|\$\{[^}]*\})*\$\{[^}]*\}(?:[A-Za-z0-9_\-./]|\$\{[^}]*\})*)/g)) {
  const t = m[1]
  const parts = t.split(/\$\{[^}]*\}/)
  const suffix = parts.at(-1).match(/^[A-Za-z0-9_\-./]*?\.(?:svg|png|webp|jpe?g|gif|avif)/)?.[0] ?? parts.at(-1)
  templates.push({ prefix: parts[0], suffix, multi: parts.length > 2, src: t })
}

const iconFiles = walk(ICONS).filter((p) => ICON_EXT.test(p))
const unusedIcons = []
for (const p of iconFiles) {
  const r = path.relative(ICONS, p).split(path.sep).join("/")
  if (literalPaths.has(r)) continue
  const hit = templates.some(({ prefix, suffix, multi }) => {
    if (!r.startsWith(prefix) || !r.endsWith(suffix) || r.length < prefix.length + suffix.length) return false
    const middle = r.slice(prefix.length, r.length - suffix.length)
    if (multi) return true
    return stringLits.has(middle)
  })
  if (!hit) unusedIcons.push(p)
}

// ---- report ----
const report = {
  entries: entries.length,
  reachable: reachable.size,
  templates: [...new Set(templates.map((t) => t.src))],
  usedIcons: iconFiles.length - unusedIcons.length,
  unusedIcons: unusedIcons.map(rel),
  unusedComponents: unusedComponents.map(rel),
}

if (args.has("--json")) {
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`Entry points: ${report.entries}  reachable source files: ${report.reachable}`)
  console.log(`Dynamic icon templates:\n  ${report.templates.join("\n  ") || "(none)"}`)
  console.log(`\nUnused components (${report.unusedComponents.length}):`)
  for (const f of report.unusedComponents) console.log("  " + f)
  const byDir = {}
  for (const f of report.unusedIcons) {
    const d = path.posix.dirname(f)
    byDir[d] = (byDir[d] ?? 0) + 1
  }
  console.log(`\nIcons: ${report.usedIcons} used, ${report.unusedIcons.length} unused of ${iconFiles.length}`)
  for (const [d, n] of Object.entries(byDir).sort()) console.log(`  ${d}: ${n} unused`)
}

if (args.has("--delete")) {
  for (const f of [...unusedComponents, ...unusedIcons]) fs.rmSync(f)
  // drop folders left empty
  const prune = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name))
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
  }
  ;[ICONS, ...candidatesDirs].forEach(prune)
  console.log(`\nDeleted ${unusedComponents.length} component files and ${unusedIcons.length} icons.`)
}
