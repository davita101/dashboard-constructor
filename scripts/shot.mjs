// Full-page headless screenshot of a design-system preview page, plus its console errors.
// Replaces the claude-in-chrome extension in unattended agent sessions.
// Run: pnpm -s shot <slug> [width]   (dev server must be on :3000)
// Captured at 0.6 scale (Figma exports are 0.5) and split into parts of 2400 CSS px
// (1440px images); read each part once and compare with Figma.

import { spawn } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const [slug, width = "1440"] = process.argv.slice(2)
if (!slug) {
  console.error("usage: pnpm -s shot <slug> [width]")
  process.exit(2)
}
const SCALE = 0.6
const PART = 2400 // CSS px per part, 1440px tall at SCALE
const MAX_PARTS = 6
const PORT = 9333

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

const chromePath = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((p) => fs.existsSync(p))
if (!chromePath) {
  console.error("no Chrome or Edge found")
  process.exit(1)
}

const dir = path.join(os.tmpdir(), "shots")
fs.mkdirSync(dir, { recursive: true })
for (const f of fs.readdirSync(dir)) if (f.startsWith(`${slug}`) && f.endsWith(".png")) fs.rmSync(path.join(dir, f))

const chrome = spawn(
  chromePath,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.join(dir, "profile")}`, "about:blank"],
  { stdio: "ignore" },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

try {
  let target
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200)
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      target = list.find((t) => t.type === "page")
    } catch {}
  }
  if (!target) throw new Error("Chrome DevTools did not start")

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })
  let seq = 0
  const waiting = new Map()
  const errors = []
  let loaded
  const loadedPromise = new Promise((r) => (loaded = r))
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.id && waiting.has(msg.id)) {
      waiting.get(msg.id)(msg)
      waiting.delete(msg.id)
    } else if (msg.method === "Page.loadEventFired") loaded()
    else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
      errors.push(`console.${msg.params.type}: ${msg.params.args.map((a) => a.value ?? a.description ?? "").join(" ")}`)
    } else if (msg.method === "Runtime.exceptionThrown") {
      const d = msg.params.exceptionDetails
      errors.push(`exception: ${d.exception?.description ?? d.text}`)
    } else if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
      errors.push(`${msg.params.entry.source}: ${msg.params.entry.text} ${msg.params.entry.url ?? ""}`.trim())
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq
      waiting.set(id, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)))
      ws.send(JSON.stringify({ id, method, params }))
    })

  await send("Page.enable")
  await send("Runtime.enable")
  await send("Log.enable")
  await send("Emulation.setDeviceMetricsOverride", { width: Number(width), height: 900, deviceScaleFactor: 1, mobile: false })
  await send("Page.navigate", { url })
  await Promise.race([loadedPromise, sleep(15000)])
  await sleep(1500) // hydration, fonts, images

  // Widen the viewport when content overflows to the right, so no column is cut off.
  const measure = async () =>
    (await send("Runtime.evaluate", { expression: "[document.documentElement.scrollWidth, document.documentElement.scrollHeight]", returnByValue: true })).result.value
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
    const file = path.join(dir, parts > 1 ? `${slug}-${i + 1}.png` : `${slug}.png`)
    fs.writeFileSync(file, Buffer.from(data, "base64"))
    files.push(file)
  }
  ws.close()

  console.log(`page ${pageWidth}x${height}px, ${files.length} part(s)${height > PART * MAX_PARTS ? ` (cut at ${PART * MAX_PARTS}px)` : ""}:`)
  for (const f of files) console.log(`screenshot: ${f}`)
  console.log(errors.length ? `console errors:\n${[...new Set(errors)].map((e) => e.slice(0, 300)).join("\n")}` : "console: clean")
} catch (e) {
  console.error(`screenshot failed: ${e.message}`)
  process.exitCode = 1
} finally {
  chrome.kill()
}
