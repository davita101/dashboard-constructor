// Temporary: keep a dashboard tab open and ask the dev server's MCP endpoint for errors (deleted after use).
const { chromium } = require("@playwright/test")
const BASE = "http://localhost:3000"

async function mcp(method, params, id) {
  const res = await fetch(`${BASE}/_next/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  })
  return res.text()
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${BASE}/sign-in`)
  await page.getByRole("button", { name: "Try the demo account" }).click()
  await page.waitForURL("**/dashboard**", { timeout: 60000 })
  await page.getByRole("button", { name: /Add widget/ }).waitFor({ timeout: 90000 })
  await page.waitForTimeout(5000)
  console.log(await mcp("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "debug", version: "1" } }, 1))
  const out = await mcp("tools/call", { name: "get_errors", arguments: {} }, 2)
  require("fs").writeFileSync(".mcp-errors.txt", out)
  await browser.close()
})()
