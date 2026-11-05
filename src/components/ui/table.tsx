import * as React from "react"

import { cn } from "@/lib/utils"

// Figma "(table)" frame (14055:68891, Dashboard: Home): a white panel, 1px base-100 stroke, radius 12,
// a Head row (background-20) over body rows; the selected row is filled background-20.
// This file is the semantic structure (real <table>); every cell's size, padding and bottom stroke come
// from the Figma cell frames in `ui/table-cell.tsx`, placed inside TableHead / TableData with role="presentation":
//   <TableHead><TableCell size="40" style="head" role="presentation" className="w-full">…</TableCell></TableHead>
// The shadcn data cell (`td`) is exported as TableData: `TableCell` already names the Figma cell frame.

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto rounded-r12 bg-background-0 outline -outline-offset-1 outline-background-100"
    >
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse font-default", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("bg-background-20", className)} {...props} />
}

/** Hover and the selected state (`data-state="selected"`) both fill background-20, like the Figma selected row. */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn("transition-colors hover:bg-background-20 data-[state=selected]:bg-background-20", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={cn("p-0 text-left align-middle font-normal", className)} {...props} />
}

function TableData({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-data" className={cn("p-0 align-middle", className)} {...props} />
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("py-3 text-10 leading-16 font-semibold text-base-500", className)} {...props} />
}

export { Table, TableBody, TableCaption, TableData, TableFooter, TableHead, TableHeader, TableRow }
