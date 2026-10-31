// Headless screenshot of a design-system preview page, plus its console errors.
// Replaces the claude-in-chrome extension in unattended agent sessions.
// Run: pnpm -s shot <slug> [width] [height]   (dev server must be on :3000)
// Prints the PNG path and any console errors; read the PNG once to compare with Figma.

import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const [slug, width = "1000", height = "1200"] = process.argv.slice(2)
if (!slug) {
  console.error("usage: pnpm -s shot <slug> [width] [height]")
  process.exit(2)
}

const url = `http://localhost:3000/design-system/${slug}`
try {
  const res = await fetch(url)
  if (!res.ok) {
    console.error(`page ${url} returned ${res.status}`)
    process.exit(1)
  }
} catch {
  console.error("dev server not running on :3000 (start `pnpm dev` in the background)")
  process.exit(1)
}

const chrome = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p))
if (!chrome) {
  console.error("no Chrome or Edge found")
  process.exit(1)
}

const dir = path.join(os.tmpdir(), "shots")
fs.mkdirSync(dir, { recursive: true })
const file = path.join(dir, `${slug}.png`)
fs.rmSync(file, { force: true })

const run = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--enable-logging=stderr",
    "--v=0",
    "--virtual-time-budget=8000",
    `--user-data-dir=${path.join(dir, "profile")}`,
    `--window-size=${width},${height}`,
    `--screenshot=${file}`,
    url,
  ],
  { encoding: "utf8", timeout: 60000 },
)

const errors = (run.stderr || "")
  .split("\n")
  .filter((l) => /CONSOLE/.test(l) && /error|warn|uncaught/i.test(l))
  .map((l) => l.replace(/^.*?CONSOLE/, "CONSOLE").slice(0, 300))

if (!fs.existsSync(file)) {
  console.error(`screenshot failed (exit ${run.status})`)
  process.exit(1)
}
console.log(`screenshot: ${file}`)
console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "console: clean")
