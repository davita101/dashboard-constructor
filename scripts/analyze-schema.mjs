#!/usr/bin/env node
// Scans the frontend for the data it renders and reports the database schema it implies.
// No LLM, no network: TypeScript compiler API over src/.
//
//   pnpm schema:analyze            -> design/backend/schema-analysis.md + .json
//
// What it finds:
//   1. Entity types   - type/interface declarations with an `id` field (src/lib/**, src/components/**)
//   2. Value types     - other object types referenced by entities (embedded objects / computed stats)
//   3. Data getters    - exported async functions in src/lib/**/data.ts and where pages call them
//   4. Hardcoded data  - `const x = [ {...}, ... ]` arrays of object literals inside components (not yet in the data layer)
//   5. Planned modules - sidebar sections (dashboard/nav.ts) and project tabs (lib/projects/tabs.ts) with no route yet
//   6. Client state    - localStorage keys (per-user state that could move to the DB)

import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const ROOT = process.cwd()
const SRC = path.join(ROOT, "src")
const OUT_DIR = path.join(ROOT, "design", "backend")

// ---------- files ----------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(full)
  }
  return out
}

const rel = (file) => path.relative(ROOT, file).replace(/\\/g, "/")
const files = walk(SRC)
const sources = new Map(
  files.map((file) => [file, ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS)]),
)

const lineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
const jsDoc = (node) =>
  (node.jsDoc ?? [])
    .map((d) => (typeof d.comment === "string" ? d.comment : (d.comment ?? []).map((c) => c.text).join("")))
    .join(" ")
    .trim()
const leadingComment = (sf, node) => {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? []
  return ranges
    .map((r) => sf.text.slice(r.pos, r.end).replace(/^\/\/\s?|^\/\*+\s?|\s?\*+\/$/g, "").trim())
    .join(" ")
    .trim()
}

// ---------- 1 + 2. types ----------

/** name -> { name, file, line, kind, fields[], extends[], union?, comment } */
const types = new Map()

function fieldsOf(sf, members) {
  const fields = []
  for (const m of members) {
    if (!ts.isPropertySignature(m) || !m.name) continue
    fields.push({
      name: m.name.getText(sf),
      type: m.type ? m.type.getText(sf).replace(/\s+/g, " ") : "unknown",
      optional: !!m.questionToken,
      comment: jsDoc(m),
      typeNode: m.type,
    })
  }
  return fields
}

for (const [file, sf] of sources) {
  const visit = (node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const name = node.name.text
      const t = node.type
      const base = { name, file: rel(file), line: lineOf(sf, node), comment: leadingComment(sf, node), extends: [], fields: [] }
      if (ts.isTypeLiteralNode(t)) types.set(name, { ...base, kind: "object", fields: fieldsOf(sf, t.members) })
      else if (ts.isIntersectionTypeNode(t)) {
        const fields = []
        const ext = []
        for (const part of t.types) {
          if (ts.isTypeLiteralNode(part)) fields.push(...fieldsOf(sf, part.members))
          else ext.push(part.getText(sf))
        }
        types.set(name, { ...base, kind: "object", fields, extends: ext })
      } else if (ts.isUnionTypeNode(t) && t.types.every((u) => ts.isLiteralTypeNode(u)))
        types.set(name, { ...base, kind: "enum", values: t.types.map((u) => u.getText(sf).replace(/"/g, "")) })
    } else if (ts.isInterfaceDeclaration(node)) {
      types.set(node.name.text, {
        name: node.name.text,
        file: rel(file),
        line: lineOf(sf, node),
        comment: leadingComment(sf, node),
        kind: "object",
        extends: (node.heritageClauses ?? []).flatMap((h) => h.types.map((x) => x.getText(sf))),
        fields: fieldsOf(sf, node.members),
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

// Skip UI-only shapes (props, variants, nav, widget layout): they aren't data.
const UI_NAME = /(Props|Variant|Size|Color|Sort|Filter|Key|Value|Nav|Item|Widget|Layout|Def|Category|Legend|Slide|Tab)$/
const UI_FILE = /src\/components\/ui\/|src\/i18n\/|\/charts\//

function allFields(t, seen = new Set()) {
  if (!t || seen.has(t.name)) return []
  seen.add(t.name)
  const inherited = (t.extends ?? []).flatMap((e) => allFields(types.get(e.replace(/<.*$/, "")), seen))
  return [...inherited, ...t.fields]
}

const isEntity = (t) => t.kind === "object" && !UI_FILE.test(t.file) && !UI_NAME.test(t.name) && allFields(t).some((f) => f.name === "id")

// SQL guess from TS type + comment + name.
function sqlType(field) {
  const { name, type, comment } = field
  const c = comment.toLowerCase()
  const arr = type.match(/^(\w+)\[\]$/)
  if (arr) {
    const inner = types.get(arr[1])
    if (inner && isEntity(inner)) return { sql: null, relation: { kind: "many", target: arr[1] } }
    if (inner) return { sql: "jsonb", note: `array of ${arr[1]}` }
    return { sql: `${sqlType({ name, type: arr[1], comment }).sql}[]` }
  }
  if (types.has(type)) {
    const t = types.get(type)
    if (t.kind === "enum") return { sql: `enum ${toSnake(type)}`, note: t.values.join(" | ") }
    if (isEntity(t)) return { sql: null, relation: { kind: "one", target: type } }
    return { sql: "jsonb", note: `embedded ${type}` }
  }
  if (type.startsWith("{")) return { sql: "jsonb", note: "inline object (table or computed?)" }
  if (/^"[^"]*"( \| "[^"]*")+$/.test(type)) return { sql: `enum`, note: type }
  if (name === "id") return { sql: "uuid primary key" }
  if (/Id$/.test(name)) return { sql: "uuid", relation: { kind: "fk", target: cap(name.replace(/Id$/, "")) } }
  if (type === "string") {
    if (c.includes("iso date-time") || /At$/.test(name)) return { sql: "timestamptz" }
    if (c.includes("iso date") || /^(deadline|start|end|date|due)/i.test(name)) return { sql: "date" }
    if (name === "slug") return { sql: "text unique" }
    if (/(logo|avatar|image|photo|url|icon)$/i.test(name)) return { sql: "text", note: "url / storage path" }
    const formatted = "formatted string in UI → store number, format on render"
    if (/^(orders|views|quantity|qty)$/i.test(name)) return { sql: "integer", note: formatted }
    if (/(income|profit|cost|price|amount|total)$/i.test(name)) return { sql: "numeric(12,2)", note: formatted }
    if (/(conversion|rate|percent)$/i.test(name)) return { sql: "numeric(5,2)", note: `${formatted}; maybe COMPUTED` }
    return { sql: "text" }
  }
  if (type === "number") {
    if (c.includes("currency") || /(income|profit|cost|price|amount|total)$/i.test(name)) return { sql: "numeric(12,2)" }
    if (c.includes("0–100") || c.includes("percent") || /(progress|trend|implementation)$/i.test(name)) return { sql: "numeric(5,2)", note: "percent" }
    if (/^(tasks|stages|members|files|messages|projects|count|index)$/.test(name)) return { sql: "integer", note: name === "index" ? "position" : "count: likely COMPUTED from child rows" }
    return { sql: "integer" }
  }
  if (type === "boolean") return { sql: "boolean" }
  return { sql: "text", note: `unmapped TS type: ${type}` }
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const toSnake = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()

// Which types are referenced by which (to place value types under their parent).
const typeRefs = (t) => allFields(t).flatMap((f) => (f.type.match(/\b[A-Z]\w+\b/g) ?? []).filter((n) => types.has(n)))

const entities = [...types.values()].filter(isEntity)
const entityNames = new Set(entities.map((e) => e.name))
const valueTypes = [...types.values()].filter(
  (t) => !entityNames.has(t.name) && !UI_FILE.test(t.file) && !UI_NAME.test(t.name) && /src\/lib\//.test(t.file),
)

// ---------- 3. getters ----------

const getters = []
for (const [file, sf] of sources) {
  if (!/src[\\/]lib[\\/].*data\.ts$/.test(file)) continue
  sf.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node) && node.name && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      getters.push({
        name: node.name.text,
        file: rel(file),
        line: lineOf(sf, node),
        params: node.parameters.map((p) => p.getText(sf)).join(", "),
        returns: node.type ? node.type.getText(sf) : "?",
        usedBy: [],
      })
    }
  })
}
for (const [file, sf] of sources) {
  for (const g of getters) if (g.file !== rel(file) && new RegExp(`\\b${g.name}\\(`).test(sf.text)) g.usedBy.push(rel(file))
}

// ---------- 4. hardcoded arrays ----------

const hardcoded = []
for (const [file, sf] of sources) {
  // lib = data layer already; ui/auth/charts/widget catalog = primitives, marketing showcase, chart defaults.
  if (/src[\\/](lib|i18n)[\\/]|src[\\/]components[\\/](ui|auth|charts)[\\/]|widgets[\\/]catalog/.test(file)) continue
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      let init = node.initializer
      while (ts.isSatisfiesExpression?.(init) || ts.isAsExpression(init)) init = init.expression
      if (ts.isArrayLiteralExpression(init) && init.elements.length >= 2) {
        const objs = init.elements.filter((e) => ts.isObjectLiteralExpression(e))
        if (objs.length >= 2) {
          const keys = [...new Set(objs.flatMap((o) => o.properties.map((p) => p.name?.getText(sf)).filter(Boolean)))]
          // icons/labels/legends/actions are UI config, not records.
          const uiConfig = keys.every((k) => /^(color|text|label|icon|key|href|path|title|value|width|name|slug|onClick|labelKey|tone)$/.test(k)) && !keys.includes("id")
          hardcoded.push({
            name: node.name.getText(sf),
            file: rel(file),
            line: lineOf(sf, node),
            type: node.type ? node.type.getText(sf) : "",
            rows: objs.length,
            keys,
            likelyData: !uiConfig,
          })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

// ---------- 5. planned modules ----------

const appDir = path.join(SRC, "app", "dashboard")
const builtSections = new Set(fs.readdirSync(appDir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("[")).map((d) => d.name))
const navFile = path.join(SRC, "components", "dashboard", "nav.ts")
const sections = fs.existsSync(navFile)
  ? [...fs.readFileSync(navFile, "utf8").matchAll(/item\("([^"]*)",\s*"([^"]+)"/g)].map(([, slug, label]) => ({ slug, label, built: slug === "" || builtSections.has(slug) }))
  : []
const tabsFile = path.join(SRC, "lib", "projects", "tabs.ts")
const projectTabs = fs.existsSync(tabsFile) ? [...(fs.readFileSync(tabsFile, "utf8").match(/projectTabKeys = \[([^\]]+)\]/)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]) : []
const tabRoute = path.join(SRC, "app", "dashboard", "projects", "[slug]", "[tab]", "page.tsx")
const tabSrc = fs.existsSync(tabRoute) ? fs.readFileSync(tabRoute, "utf8") : ""

// ---------- 6. client state ----------

const clientState = []
for (const [file, sf] of sources) {
  for (const m of sf.text.matchAll(/(?:STORAGE_KEY\s*=\s*|localStorage\.(?:get|set)Item\(\s*)["'`]([^"'`]+)["'`]/g))
  {
    // Resolve `${CONST}` keys to the const's string value in the same file.
    const key = m[1].replace(/\$\{(\w+)\}/g, (all, id) => sf.text.match(new RegExp(`${id}\\s*=\\s*["'\`]([^"'\`]+)`))?.[1] ?? all)
    clientState.push({ key, file: rel(file) })
  }
}

// ---------- report ----------

const entityReport = entities.map((e) => ({
  name: e.name,
  table: toSnake(e.name).replace(/([^s])$/, "$1s"),
  file: e.file,
  line: e.line,
  comment: e.comment,
  extends: e.extends,
  fields: allFields(e).map((f) => ({ name: f.name, ts: f.type, optional: f.optional, comment: f.comment, ...sqlType(f) })),
}))

const relations = entityReport.flatMap((e) =>
  e.fields
    .filter((f) => f.relation)
    .map((f) => ({
      from: e.name,
      field: f.name,
      to: f.relation.target,
      kind: f.relation.kind,
      suggestion:
        f.relation.kind === "many"
          ? `${e.name} ↔ ${f.relation.target}: many-to-many → join table ${toSnake(e.name)}_${toSnake(f.relation.target)}s (or 1-n FK on ${f.relation.target} if exclusive)`
          : f.relation.kind === "fk"
            ? `${e.name}.${f.name} → ${f.relation.target}.id (FK)`
            : `${e.name}.${f.name} → ${f.relation.target} (FK ${f.name}_id)`,
    })),
)

const result = {
  generatedAt: new Date().toISOString(),
  entities: entityReport,
  valueTypes: valueTypes.map((t) => ({
    name: t.name,
    kind: t.kind,
    file: t.file,
    line: t.line,
    values: t.values,
    fields: t.kind === "object" ? allFields(t).map((f) => ({ name: f.name, ts: f.type, comment: f.comment })) : undefined,
    usedBy: [...types.values()].filter((o) => typeRefs(o).includes(t.name)).map((o) => o.name),
  })),
  relations,
  getters,
  hardcoded,
  sections,
  projectTabs: projectTabs.map((tab) => ({ tab, rendered: tab === "dashboard" || new RegExp(`["']${tab}["']`).test(tabSrc) })),
  clientState,
}

const md = []
const p = (s = "") => md.push(s)
p("# Schema analysis (generated)")
p()
p(`Generated by \`pnpm schema:analyze\` (scripts/analyze-schema.mjs) at ${result.generatedAt}. Don't hand-edit; re-run.`)
p()
p("SQL types are guesses from TS type + JSDoc + field name. Count fields marked *COMPUTED* should be derived from child rows (views / aggregate queries), not stored.")
p()
p(`## 1. Entities (${entityReport.length}) — types with an \`id\`, candidate tables`)
for (const e of entityReport) {
  p()
  p(`### ${e.name} → \`${e.table}\``)
  p(`${e.file}:${e.line}${e.extends.length ? ` · extends ${e.extends.join(", ")}` : ""}${e.comment ? ` · ${e.comment}` : ""}`)
  p()
  p("| field | TS | SQL guess | note |")
  p("|---|---|---|---|")
  for (const f of e.fields) {
    const sql = f.relation ? `**relation** ${f.relation.kind} → ${f.relation.target}` : f.sql
    const note = [f.optional ? "optional" : "", f.note, f.comment].filter(Boolean).join(" · ")
    p(`| ${f.name} | \`${f.ts.replace(/\|/g, "\\|")}\` | ${sql} | ${note.replace(/\|/g, "\\|")} |`)
  }
}
p()
p("## 2. Relations")
p()
for (const r of relations) p(`- ${r.suggestion}`)
p()
p(`## 3. Value types (${result.valueTypes.length}) — embedded objects, enums, aggregates`)
p()
p("| type | kind | used by | fields / values | where |")
p("|---|---|---|---|---|")
for (const t of result.valueTypes)
  p(`| ${t.name} | ${t.kind} | ${t.usedBy.join(", ") || "—"} | ${(t.values ?? t.fields?.map((f) => `${f.name}: ${f.ts}`) ?? []).join(", ").replace(/\|/g, "\\|")} | ${t.file}:${t.line} |`)
p()
p("Inline `{ ... }` fields above (ProjectDetail.company / counts / tasks) are either a related table (company → clients) or aggregates computed per request.")
p()
p(`## 4. Data getters (${getters.length}) — API surface the pages already use`)
p()
p("| getter | params | returns | used by |")
p("|---|---|---|---|")
for (const g of getters) p(`| \`${g.name}\` | ${g.params || "—"} | \`${g.returns}\` | ${g.usedBy.join("<br>") || "**unused**"} |`)
p()
p("## 5. Hardcoded arrays in components — data not in the data layer yet")
p()
p("| const | rows | keys | likely data? | where |")
p("|---|---|---|---|---|")
for (const h of hardcoded.sort((a, b) => Number(b.likelyData) - Number(a.likelyData)))
  p(`| \`${h.name}\`${h.type ? `: \`${h.type}\`` : ""} | ${h.rows} | ${h.keys.join(", ")} | ${h.likelyData ? "**yes**" : "ui config"} | ${h.file}:${h.line} |`)
p()
p("## 6. Planned modules — sections and tabs without real content (future tables)")
p()
p("Sidebar sections:")
for (const s of sections) p(`- [${s.built ? "x" : " "}] ${s.label} (\`/dashboard/${s.slug}\`)`)
p()
p("Project tabs:")
for (const t of result.projectTabs) p(`- [${t.rendered ? "x" : " "}] ${t.tab}`)
p()
p("## 7. Client-side state — per-user data that could move to the DB")
p()
for (const c of clientState) p(`- \`${c.key}\` — ${c.file}`)
if (!clientState.length) p("- none")
p()

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, "schema-analysis.md"), md.join("\n"))
fs.writeFileSync(path.join(OUT_DIR, "schema-analysis.json"), JSON.stringify(result, null, 2))
console.log(
  `entities ${entityReport.length} · relations ${relations.length} · value types ${result.valueTypes.length} · getters ${getters.length} · hardcoded ${hardcoded.filter((h) => h.likelyData).length}/${hardcoded.length} · sections todo ${sections.filter((s) => !s.built).length} · tabs todo ${result.projectTabs.filter((t) => !t.rendered).length}`,
)
console.log(`→ ${rel(path.join(OUT_DIR, "schema-analysis.md"))}`)
