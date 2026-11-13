"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableCell, TableCellImage, TableCellSort, TableCellTitle } from "@/components/ui/table-cell"

// Figma "(table)" frame (14055:68891): select column, Product (image + name), then five text columns.
// Column widths are the Figma ones (50 / flex / 130 / 140 / 140 / 100 / 120).

type ProductRow = {
  id: string
  name: string
  image: string
  orders: string
  views: string
  income: string
  conversion: string
  total: string
}

// Placeholder thumbnail: the Figma product photos are not exported to public/images (design/known-gaps.md).
const thumb = "/images/banners/banner-1.png"

const defaultRows: ProductRow[] = [
  { id: "1", name: "New Balance Men's 608 V5 Casual Comfort", image: thumb, orders: "2,454", views: "68,454", income: "$ 2,544.33", conversion: "3,45%", total: "$ 2,544.33" },
  { id: "2", name: "Sperry Top Spider", image: thumb, orders: "2,454", views: "68,454", income: "$ 1,544.33", conversion: "3,45%", total: "$ 1,544.33" },
  { id: "3", name: "Apple iPhone 26, 512 GB", image: thumb, orders: "2,454", views: "38,454", income: "$ 4,544.33", conversion: "3,45%", total: "$ 4,544.33" },
  { id: "4", name: "Apple Pen, Version", image: thumb, orders: "2,454", views: "78,454", income: "$ 2,544.33", conversion: "3,45%", total: "$ 2,544.33" },
  { id: "5", name: "New Balance Men's v5", image: thumb, orders: "2,454", views: "28,454", income: "$ 3,544.33", conversion: "3,45%", total: "$ 3,544.33" },
]

const columns = [
  { key: "orders", label: "Orders", width: "w-32.5" },
  { key: "views", label: "Total Views", width: "w-35" },
  { key: "income", label: "Income", width: "w-35" },
  { key: "conversion", label: "Conv.", width: "w-25" },
  { key: "total", label: "Income", width: "w-30" },
] as const

type SortKey = "name" | (typeof columns)[number]["key"]
type Sort = { key: SortKey; direction: "up" | "down" } | null

// "$ 2,544.33" and "3,45%" sort as numbers (Figma writes the Conv. decimal with a comma); names sort as text.
const numeric = (v: string) => Number(v.replace(/[^\d,.-]/g, "").replace(/,(?=\d{3})/g, "").replace(",", "."))
const compare = (key: SortKey, a: ProductRow, b: ProductRow) =>
  key === "name" ? a.name.localeCompare(b.name) : numeric(a[key]) - numeric(b[key])

/** Header cell that sorts its column: first click ascending, second descending, third clears. */
function SortHead<K extends string>({ id, className, sort, onSort, children }: { id: K; className?: string; sort: { key: K; direction: "up" | "down" } | null; onSort: (key: K) => void; children: React.ReactNode }) {
  const direction = sort?.key === id ? sort.direction : undefined
  return (
    <TableHead className={className} aria-sort={direction ? (direction === "up" ? "ascending" : "descending") : "none"}>
      {/* The button fills the whole cell (padding lives on it), so a click anywhere in the header cell sorts. */}
      <TableCell size="40" style="head" padding="none" role="presentation" className="w-full">
        <button type="button" onClick={() => onSort(id)} className="flex h-full min-w-0 flex-1 cursor-pointer items-center gap-3 px-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary-alpha-30">
          <TableCellTitle>{children}</TableCellTitle>
          <TableCellSort direction={direction} />
        </button>
      </TableCell>
    </TableHead>
  )
}

function ProductTable({
  rows = defaultRows,
  defaultSelected = ["4"],
}: {
  rows?: ProductRow[]
  defaultSelected?: string[]
}) {
  const [selected, setSelected] = React.useState<string[]>(defaultSelected)
  const [sort, setSort] = React.useState<Sort>(null)
  const all = selected.length === rows.length
  const some = selected.length > 0 && !all

  const onSort = (key: SortKey) =>
    setSort((prev) => (prev?.key !== key ? { key, direction: "up" } : prev.direction === "up" ? { key, direction: "down" } : null))

  const sorted = React.useMemo(() => {
    if (!sort) return rows
    const order = [...rows].sort((a, b) => compare(sort.key, a, b))
    return sort.direction === "up" ? order : order.reverse()
  }, [rows, sort])

  const toggle = (id: string, on: boolean) => setSelected((prev) => (on ? [...prev, id] : prev.filter((s) => s !== id)))

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12.5">
            <TableCell size="40" style="head" padding="loose" role="presentation" className="w-full">
              <Checkbox
                color="primary-dark"
                size="20"
                aria-label="Select all"
                checked={all}
                indeterminate={some}
                onCheckedChange={(on) => setSelected(on ? rows.map((r) => r.id) : [])}
              />
            </TableCell>
          </TableHead>
          <SortHead id="name" sort={sort} onSort={onSort}>
            Product
          </SortHead>
          {columns.map((c) => (
            <SortHead key={c.key} id={c.key} className={c.width} sort={sort} onSort={onSort}>
              {c.label}
            </SortHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
            <TableData>
              <TableCell size="40" style="border" padding="loose" role="presentation" className="w-full">
                <Checkbox
                color="primary-dark"
                  size="20"
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onCheckedChange={(on) => toggle(row.id, on)}
                />
              </TableCell>
            </TableData>
            <TableData>
              <TableCell size="40" style="border" role="presentation" className="w-full">
                <TableCellImage src={row.image} />
                <TableCellTitle>{row.name}</TableCellTitle>
              </TableCell>
            </TableData>
            {columns.map((c) => (
              <TableData key={c.key}>
                <TableCell size="40" style="border" role="presentation" className="w-full">
                  <TableCellTitle>{row[c.key]}</TableCellTitle>
                </TableCell>
              </TableData>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { ProductTable, SortHead }
export type { ProductRow }
