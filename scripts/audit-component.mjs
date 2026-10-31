// One audit for builder and director, so both judge a component the same way.
// Run: pnpm -s audit:component <file> [<file>…]
// Runs tsc and eslint, then greps the given files for rule breaks from CLAUDE.md.
// Prints only exit codes, failures and hits; exits 1 if anything fails.

import { spawnSync } from "node:child_process"
import fs from "node:fs"

const files = process.argv.slice(2).filter((f) => fs.existsSync(f))
if (!files.length) {
  console.error("usage: pnpm -s audit:component <file> [<file>…]")
  process.exit(2)
}

let failed = false
const tail = (s, n = 20) => s.trim().split("\n").slice(-n).join("\n")

for (const [name, cmd, args] of [
  ["tsc", "pnpm", ["exec", "tsc", "--noEmit"]],
  ["lint", "pnpm", ["exec", "eslint", ...files]],
]) {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: true })
  if (r.status === 0) {
    console.log(`${name}: pass`)
  } else {
    failed = true
    console.log(`${name}: fail\n${tail(`${r.stdout}\n${r.stderr}`)}`)
  }
}

// `dark:` only as a Tailwind class prefix (dark:bg-…, dark:[…]), not a cva key like `dark: "…"`.
const rules = [
  ["space-x/y (use gap)", /\bspace-[xy]-/],
  ["w-N h-N pair (use size-N)", /\bw-(\d+(?:\.\d+)?)\s+h-\1\b/],
  ["dark: variant (tokens handle dark mode)", /(?<![\w-])dark:[a-z[]/],
  ["hex color (use tokens)", /(?<![\w&/])#[0-9a-fA-F]{3,8}\b/],
  ['cn from "cn" (use @/lib/utils)', /from\s+["']cn["']/],
]

const hits = []
for (const file of files) {
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const [label, re] of rules) if (re.test(line)) hits.push(`${file}:${i + 1}: ${label}: ${line.trim().slice(0, 120)}`)
    })
}
if (hits.length) {
  failed = true
  console.log(`grep: ${hits.length} hit(s)\n${hits.join("\n")}`)
} else {
  console.log("grep: clean")
}

process.exit(failed ? 1 : 0)
