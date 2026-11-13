import assert from "node:assert/strict"
import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { Field } from "../src/components/ui/field"
import { InputGroup, InputGroupButton, InputGroupInput, InputGroupSwatch } from "../src/components/ui/input-group"

const h = React.createElement
const html = (el: React.ReactElement) => renderToStaticMarkup(el)

const inherited = html(
  h(Field, { size: "48", shape: "pill" }, h(InputGroup, null, h(InputGroupInput), h(InputGroupButton, null, "x"), h(InputGroupSwatch, { color: "#fff" } as never)))
)
assert.match(inherited, /data-slot="input-group"[^>]*data-size="48"|data-size="48"[^>]*data-slot="input-group"/)
assert.match(inherited, /rounded-r32/)
console.log("PASS field size/shape inherited by InputGroup")

const overridden = html(h(Field, { size: "48", shape: "pill" }, h(InputGroup, { size: "24", shape: "rounded" }, h(InputGroupInput))))
const group = overridden.match(/<div data-slot="input-group"[^>]*>/)?.[0] ?? ""
assert.match(group, /data-size="24"/)
assert.doesNotMatch(group, /rounded-r32/)
console.log("PASS explicit props win")

const alone = html(h(InputGroup, null, h(InputGroupInput)))
assert.match(alone, /data-size="40"/)
console.log("PASS defaults without Field")

const slotPill = html(h(InputGroup, { shape: "pill" }, h(InputGroupButton, null, "x")))
const slotRounded = html(h(InputGroup, { shape: "rounded" }, h(InputGroupButton, null, "x")))
const btn = (s: string) => s.match(/<button[^>]*>/)?.[0]
assert.notEqual(btn(slotPill), btn(slotRounded))
console.log("PASS slot button inherits group shape")
