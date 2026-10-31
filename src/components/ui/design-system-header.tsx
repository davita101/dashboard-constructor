import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Misc > Head-Design-System (13771:13296): page title block, Size 84 / 72 / 64 / 52 / 40.
// 1px inside stroke background-100, soft base shadow (read from the export).
const designSystemHeaderVariants = cva(
  "group/ds-header flex w-full flex-col bg-background font-default font-semibold tracking-default shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-background-100",
  {
    variants: {
      size: {
        "84": "gap-10 rounded-r72 p-30",
        "72": "gap-10 rounded-r72 p-27",
        "64": "gap-10 rounded-r72 p-23",
        "52": "gap-5 rounded-r56 p-15",
        "40": "gap-4 rounded-r36 px-12 py-10",
      },
    },
    defaultVariants: { size: "84" },
  }
)

function DesignSystemHeader({
  className,
  size = "84",
  ...props
}: React.ComponentProps<"header"> & VariantProps<typeof designSystemHeaderVariants>) {
  return (
    <header
      data-slot="design-system-header"
      data-size={size}
      className={cn(designSystemHeaderVariants({ size }), className)}
      {...props}
    />
  )
}

function DesignSystemHeaderTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="design-system-header-title"
      className={cn(
        "text-base-900 group-data-[size=40]/ds-header:text-30 group-data-[size=40]/ds-header:leading-48 group-data-[size=52]/ds-header:text-52 group-data-[size=52]/ds-header:leading-72 group-data-[size=64]/ds-header:text-64 group-data-[size=64]/ds-header:leading-92 group-data-[size=72]/ds-header:text-72 group-data-[size=72]/ds-header:leading-92 group-data-[size=84]/ds-header:text-84 group-data-[size=84]/ds-header:leading-92",
        className
      )}
      {...props}
    />
  )
}

function DesignSystemHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="design-system-header-description"
      className={cn(
        "text-base-500 group-data-[size=40]/ds-header:text-20 group-data-[size=40]/ds-header:leading-28 group-data-[size=52]/ds-header:text-24 group-data-[size=52]/ds-header:leading-36 group-data-[size=64]/ds-header:text-28 group-data-[size=64]/ds-header:leading-44 group-data-[size=72]/ds-header:text-36 group-data-[size=72]/ds-header:leading-60 group-data-[size=84]/ds-header:text-40 group-data-[size=84]/ds-header:leading-60",
        className
      )}
      {...props}
    />
  )
}

export {
  DesignSystemHeader,
  DesignSystemHeaderTitle,
  DesignSystemHeaderDescription,
  designSystemHeaderVariants,
}
