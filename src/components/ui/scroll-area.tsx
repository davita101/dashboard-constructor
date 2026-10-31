"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-500"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

// Figma Scroll: 4px pill thumb, Default idle, Active on hover/drag.
const scrollThumbVariants = cva(
  "relative flex-1 rounded-r8 bg-base-150 transition-colors hover:bg-base-500 data-[scrolling]:bg-base-500",
  {
    variants: {
      state: {
        default: "",
        active: "bg-base-500",
      },
    },
    defaultVariants: { state: "default" },
  }
)

const scrollBarVariants = cva("flex touch-none select-none", {
  variants: {
    orientation: {
      vertical: "h-full w-1 flex-col",
      horizontal: "h-1 w-full flex-row",
    },
  },
  defaultVariants: { orientation: "vertical" },
})

function ScrollBar({
  className,
  orientation = "vertical",
  state,
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props & VariantProps<typeof scrollThumbVariants>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(scrollBarVariants({ orientation }), className)}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={scrollThumbVariants({ state })}
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

// Static scroll indicator (Figma Scroll set), size comes from the container.
function Scroll({
  className,
  orientation = "vertical",
  state,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof scrollThumbVariants> & {
    orientation?: "vertical" | "horizontal"
  }) {
  return (
    <div
      data-slot="scroll"
      aria-hidden="true"
      className={cn(scrollBarVariants({ orientation }), className)}
      {...props}
    >
      <div className={scrollThumbVariants({ state })} />
    </div>
  )
}

export { ScrollArea, ScrollBar, Scroll, scrollBarVariants, scrollThumbVariants }
