import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma List-Item (State: Default / Hover / Active) and List (Size: 12 / 11 / 10, Style: Base 500).
// Icon is the material-default-icon ring, masked so the text color drives it.

const listItemVariants = cva(
  "group/list-item inline-flex h-5 items-center gap-2 rounded-r4 font-default text-12 leading-20 font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      state: {
        default: "text-base-500 hover:text-blue-600 active:text-blue-800",
        hover: "text-blue-600",
        active: "rounded-r4 text-blue-800",
      },
    },
    defaultVariants: { state: "default" },
  }
)

function ListItem({
  className,
  state = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof listItemVariants>) {
  return (
    <div
      data-slot="list-item"
      data-state={state}
      className={cn(listItemVariants({ state }), className)}
      {...props}
    />
  )
}

const listVariants = cva("group/list inline-flex items-center font-default gap-1.5 font-semibold whitespace-nowrap text-base-500", {
  variants: {
    size: {
      "12": "h-5 text-12 leading-20",
      "11": "h-5 text-11 leading-20",
      "10": "h-4 text-10 leading-16",
    },
  },
  defaultVariants: { size: "12" },
})

function List({
  className,
  size = "12",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof listVariants>) {
  return (
    <div
      data-slot="list"
      data-size={size}
      className={cn(listVariants({ size }), className)}
      {...props}
    />
  )
}

function ListIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="list-icon"
      className={cn(
        "inline-block size-5 shrink-0 bg-current mask-[url(/icons/material-default-icon.svg)] mask-contain mask-center mask-no-repeat group-data-[size=10]/list:size-4",
        className
      )}
      {...props}
    />
  )
}

function ListText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="list-text" className={cn("inline-block", className)} {...props} />
}

export { List, ListIcon, ListItem, ListText, listItemVariants, listVariants }
