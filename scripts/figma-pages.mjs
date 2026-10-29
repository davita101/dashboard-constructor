// Lists every page of the Figma file and its top-level component sets, for the agent queue.
// Run: pnpm figma:pages      (needs FIGMA_TOKEN, like figma:fetch)
//
// Prints one line per component set: <page id>\t<page name>\t<node id>\t<component set name>

import { existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
if (existsSync(join(root, ".env.local"))) process.loadEnvFile(join(root, ".env.local"))

const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "bufdHvUnBhRxUPrIgDYoLw"
const token = process.env.FIGMA_TOKEN
if (!token) {
  console.error("FIGMA_TOKEN is not set")
  process.exit(1)
}

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=2`, {
  headers: { "X-Figma-Token": token },
})
if (!res.ok) {
  console.error(`Figma API ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const { document } = await res.json()
for (const page of document.children) {
  const name = page.name.trim()
  for (const node of page.children ?? []) {
    if (node.type === "COMPONENT_SET") console.log(`${page.id}\t${name}\t${node.id}\t${node.name}`)
  }
}
