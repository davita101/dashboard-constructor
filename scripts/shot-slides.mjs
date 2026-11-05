// Steps through every slide of the auth carousel and prints numbers instead of images:
// panel height, lowest leaf edge per slide, overflow and dots position. Saves one PNG
// per slide (not returned to the model) in the temp "shots" folder.
// Run: pnpm -s shot:slides [route=/sign-in] [width=1600]   (dev server on :3000)
// Under Git Bash prefix MSYS_NO_PATHCONV=1 when the route starts with "/".

import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { openPage, sleep } from "./lib/chrome.mjs"

const [route = "/sign-in", width = "1600"] = process.argv.slice(2)
const dir = path.join(os.tmpdir(), "shots")
fs.mkdirSync(dir, { recursive: true })

const page = await openPage(`http://localhost:3000${route}`, { width: Number(width) })
await sleep(800)

const box = JSON.parse(await page.evaluate(`JSON.stringify((() => { const r = document.querySelector('aside').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } })())`))
// Autoplay pauses while the pointer is over the panel.
await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: box.x + 4, y: box.y + 4 })

const count = Number(await page.evaluate(`document.querySelectorAll('[role=tab]').length`))
const name = route.replace(/\W+/g, "-").replace(/^-|-$/g, "")
console.log(`panel ${Math.round(box.w)}x${Math.round(box.h)} at ${width}px, ${count} slides`)
console.log("slide | panelH | lowest leaf edge | dots top | overflow | file")
for (let i = 0; i < count; i++) {
  await page.evaluate(`document.querySelectorAll('[role=tab]')[${i}].click()`)
  await sleep(700)
  const m = JSON.parse(
    await page.evaluate(`JSON.stringify((() => {
      const aside = document.querySelector('aside').getBoundingClientRect()
      const tab = document.querySelectorAll('[role=tab]')[${i}].getBoundingClientRect()
      const slides = [...document.querySelectorAll('[data-slot=carousel-item]')]
      const slide = slides.find((s) => { const r = s.getBoundingClientRect(); return r.left >= aside.left - 2 && r.left < aside.left + aside.width - 2 })
      let low = 0
      if (slide) for (const el of slide.querySelectorAll('*')) { if (el.tagName === 'IMG' || el.getAttribute('aria-hidden') || el.childElementCount > 0 || el.closest('[aria-hidden=true]')) continue; const r = el.getBoundingClientRect(); if (r.height > 0 && r.width > 0) low = Math.max(low, r.bottom) }
      return { panelH: aside.height, low: low - aside.top, dots: tab.top - aside.top }
    })())`),
  )
  const { data } = await page.send("Page.captureScreenshot", { format: "png", clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 0.5 } })
  const file = path.join(dir, `${name}-slide-${i + 1}.png`)
  fs.writeFileSync(file, Buffer.from(data, "base64"))
  const overflow = m.low > m.dots ? `YES by ${Math.round(m.low - m.dots)}px` : "no"
  console.log(`${i + 1} | ${Math.round(m.panelH)} | ${Math.round(m.low)} | ${Math.round(m.dots)} | ${overflow} | ${file}`)
}
process.exit(0)
