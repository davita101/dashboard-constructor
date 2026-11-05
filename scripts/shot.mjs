// Full-page headless screenshot of a design-system preview page, plus its console errors.
// Replaces the claude-in-chrome extension in unattended agent sessions.
// Run: pnpm -s shot <slug> [width]   (dev server must be on :3000)
// Captured at 0.6 scale (Figma exports are 0.5) and split into parts of 2400 CSS px
// (1440px images); read each part once and compare with Figma.

import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { openPage, requirePage, sleep } from "./lib/chrome.mjs"

const [arg, width = "1440"] = process.argv.slice(2)
const slug = arg
const name = arg?.replace(/\W+/g, "-").replace(/^-/, "")
if (!slug) {
  console.error("usage: pnpm -s shot <slug> [width]")
  process.exit(2)
}
const SCALE = 0.6
const PART = 2400 // CSS px per part, 1440px tall at SCALE
const MAX_PARTS = 6

const url = slug.startsWith("/") ? `http://localhost:3000${slug}` : `http://localhost:3000/design-system/${slug}`
await requirePage(url)

const dir = path.join(os.tmpdir(), "shots")
fs.mkdirSync(dir, { recursive: true })
for (const f of fs.readdirSync(dir)) if (f.startsWith(name) && f.endsWith(".png")) fs.rmSync(path.join(dir, f))

let page
try {
  page = await openPage(url, { width: Number(width) })
  const { send, evaluate, errors } = page

  // Widen the viewport when content overflows to the right, so no column is cut off.
  const measure = () => evaluate("[document.documentElement.scrollWidth, document.documentElement.scrollHeight]")
  let [pageWidth, height] = await measure()
  if (pageWidth > Number(width)) {
    await send("Emulation.setDeviceMetricsOverride", { width: pageWidth, height: 900, deviceScaleFactor: 1, mobile: false })
    await sleep(500)
    ;[pageWidth, height] = await measure()
  }
  pageWidth = Math.max(pageWidth, Number(width))
  const parts = Math.min(MAX_PARTS, Math.ceil(height / PART))
  const files = []
  for (let i = 0; i < parts; i++) {
    const y = i * PART
    const { data } = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: 0, y, width: pageWidth, height: Math.min(PART, height - y), scale: SCALE },
    })
    const file = path.join(dir, parts > 1 ? `${name}-${i + 1}.png` : `${name}.png`)
    fs.writeFileSync(file, Buffer.from(data, "base64"))
    files.push(file)
  }

  console.log(`page ${pageWidth}x${height}px, ${files.length} part(s)${height > PART * MAX_PARTS ? ` (cut at ${PART * MAX_PARTS}px)` : ""}:`)
  for (const f of files) console.log(`screenshot: ${f}`)
  console.log(errors.length ? `console errors:\n${[...new Set(errors)].map((e) => e.slice(0, 300)).join("\n")}` : "console: clean")
} catch (e) {
  console.error(`screenshot failed: ${e.message}`)
  process.exitCode = 1
} finally {
  page?.close()
}
