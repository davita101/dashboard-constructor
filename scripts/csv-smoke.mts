import { toCsv } from "../src/lib/csv"

const cases: [string, (string | number)[][], string][] = [
  ["plain row", [["a", "b"]], "a,b"],
  ["comma", [["a,b", "c"]], '"a,b",c'],
  ["quote", [['say "hi"', "x"]], '"say ""hi""",x'],
  ["newline", [["a\nb", "c"]], '"a\nb",c'],
  ["numbers", [["n", 1, 2.5, 0]], "n,1,2.5,0"],
  ["multi row", [["h1", "h2"], [1, 2]], "h1,h2\n1,2"],
]

let failed = false
for (const [name, rows, expected] of cases) {
  const got = toCsv(rows)
  if (got === expected) console.log(`PASS ${name}`)
  else {
    failed = true
    console.log(`FAIL ${name}: got ${JSON.stringify(got)} expected ${JSON.stringify(expected)}`)
  }
}
process.exit(failed ? 1 : 0)
