"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Divider-Horizontal (7060:313004) / Divider-Vertical (11946:3596).
// Line: 1px, Figma gray-150 → base-150.
const separatorVariants = cva(
  "shrink-0 bg-base-150 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"
)

/** Figma Type=Default: a single 1px line. */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separatorVariants(), className)}
      {...props}
    />
  )
}

// Types with a centre element: line / element / line (or element / line for Left Center),
// 20px apart. Lines take the remaining space, so a wide element (Button Group in a 180px
// frame) squeezes them to nothing, like in Figma.
const separatorGroupVariants = cva(
  "flex items-center justify-center gap-5 [&>:not([data-slot=separator])]:shrink-0",
  {
    variants: {
      orientation: {
        horizontal: "w-full",
        vertical: "h-full flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

type SeparatorGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof separatorGroupVariants> & {
    /** `center`: Text Center, Icon, Button, Button Group, Button Icon. `start`: Left Center (Vertical: top). */
    align?: "center" | "start"
  }

/** Figma Divider with a centre element (`SeparatorLabel`, `SeparatorIcon`, `Button`, `ButtonGroup`). */
function SeparatorGroup({
  className,
  orientation = "horizontal",
  align = "center",
  children,
  ...props
}: SeparatorGroupProps) {
  const o = orientation ?? "horizontal"
  const line = (
    <Separator
      orientation={o}
      className="flex-1 data-horizontal:w-auto data-vertical:h-auto data-vertical:self-auto"
    />
  )
  return (
    <div
      role="group"
      data-slot="separator-group"
      data-orientation={o}
      data-align={align}
      className={cn(separatorGroupVariants({ orientation: o }), className)}
      {...props}
    >
      {align === "center" && line}
      {children}
      {line}
    </div>
  )
}

/** Figma "Text": Inter Bold 10/16, Figma gray-700 → base-700. */
function SeparatorLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="separator-label"
      className={cn("font-default text-10 leading-16 font-bold tracking-default text-base-700", className)}
      {...props}
    />
  )
}

/** Figma icon (material-add_circle by default), 16px, Figma gray-500 → base-500, drawn as a mask. */
function SeparatorIcon({
  src = "/icons/material-add-circle.svg",
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { src?: string }) {
  return (
    <span
      data-slot="separator-icon"
      aria-hidden
      className={cn("size-4 bg-base-500 mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

export { Separator, SeparatorGroup, SeparatorIcon, SeparatorLabel, separatorGroupVariants, separatorVariants }
