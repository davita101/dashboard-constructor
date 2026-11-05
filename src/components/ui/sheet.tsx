"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// shadcn Sheet (Base UI Dialog) in the design tokens: an edge-docked panel for the mobile sidebar.

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-base-900/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

const sheetContentVariants = cva(
  "fixed z-50 flex flex-col bg-background-0 font-default outline-none transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0",
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 h-full max-w-[calc(100%-3rem)] border-r border-background-100 data-ending-style:-translate-x-10 data-starting-style:-translate-x-10",
        right: "inset-y-0 right-0 h-full max-w-[calc(100%-3rem)] border-l border-background-100 data-ending-style:translate-x-10 data-starting-style:translate-x-10",
      },
    },
    defaultVariants: { side: "left" },
  }
)

function SheetContent({
  className,
  side = "left",
  ...props
}: SheetPrimitive.Popup.Props & VariantProps<typeof sheetContentVariants>) {
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      />
    </SheetPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("sr-only", className)} {...props} />
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger }
