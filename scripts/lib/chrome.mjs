// Headless Chrome over the DevTools protocol, shared by scripts that need a real
// browser in unattended agent sessions (the claude-in-chrome extension is not there).

import { spawn } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const PORT = 9333
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Exits with a clear message when the dev server is down or the page is missing. */
export async function requirePage(url) {
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
}

/**
 * Opens `url` in headless Chrome at `width` px and waits for load plus hydration.
 * Returns `send` (a DevTools command), the console `errors` seen so far, and `close`.
 */
export async function openPage(url, { width = 1440 } = {}) {
  const chromePath = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find((p) => fs.existsSync(p))
  if (!chromePath) throw new Error("no Chrome or Edge found")

  const profile = path.join(os.tmpdir(), "shots", "profile")
  fs.mkdirSync(profile, { recursive: true })
  const chrome = spawn(
    chromePath,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"],
    { stdio: "ignore" },
  )
  const close = () => chrome.kill()

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
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await send("Page.navigate", { url })
    await Promise.race([loadedPromise, sleep(15000)])
    await sleep(1500) // hydration, fonts, images

    const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value
    return {
      send,
      evaluate,
      errors,
      close: () => {
        ws.close()
        close()
      },
    }
  } catch (e) {
    close()
    throw e
  }
}
