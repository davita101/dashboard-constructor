// Prints a compact index of src/components/ui: exports and cva variant keys per file,
// so agents can look up what exists without reading whole component files.
// Run: pnpm -s ui:index            (every file)
//      pnpm -s ui:index button badge   (only those files)

import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const dir = path.join(process.cwd(), "src/components/ui")
const only = process.argv.slice(2).map((n) => n.replace(/\.tsx$/, ""))
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".tsx"))
  .filter((f) => !only.length || only.includes(f.replace(/\.tsx$/, "")))

const keyName = (p) => (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) || ts.isNumericLiteral(p.name) ? p.name.text : p.name.getText())

for (const file of files) {
  const src = ts.createSourceFile(file, fs.readFileSync(path.join(dir, file), "utf8"), ts.ScriptTarget.Latest, true)
  const exports = []
  const cvas = []

  const visit = (node) => {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const el of node.exportClause.elements) exports.push(el.name.text)
    }
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText() === "cva") {
      const config = node.initializer.arguments[1]
      const groups = []
      const defaults = {}
      if (config && ts.isObjectLiteralExpression(config)) {
        for (const prop of config.properties) {
          if (!ts.isPropertyAssignment(prop) || !ts.isObjectLiteralExpression(prop.initializer)) continue
          if (keyName(prop) === "variants") {
            for (const group of prop.initializer.properties) {
              if (ts.isPropertyAssignment(group) && ts.isObjectLiteralExpression(group.initializer)) {
                groups.push(`${keyName(group)}: ${group.initializer.properties.map(keyName).join("|")}`)
              }
            }
          }
          if (keyName(prop) === "defaultVariants") {
            for (const d of prop.initializer.properties) if (ts.isPropertyAssignment(d)) defaults[keyName(d)] = d.initializer.getText().replace(/"/g, "")
          }
        }
      }
      cvas.push({ name: node.name.getText(), groups, defaults })
    }
    ts.forEachChild(node, visit)
  }
  visit(src)

  console.log(`${file}: ${exports.join(", ") || "(no named exports)"}`)
  for (const c of cvas) {
    const def = Object.entries(c.defaults).map(([k, v]) => `${k}=${v}`).join(" ")
    console.log(`  ${c.name}${def ? ` (default ${def})` : ""}`)
    for (const g of c.groups) console.log(`    ${g}`)
  }
}
