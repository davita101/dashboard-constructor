import { ProductTable } from "@/components/table/product-table"

// Mirrors the Figma "(table)" frame (14055:68891, Dashboard: Home): 1128 wide, Head row + 5 rows, 4th row selected.
export default function TablePreviewPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-6 bg-background-10 p-8">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">Table</h2>
      <ProductTable />
    </main>
  )
}
