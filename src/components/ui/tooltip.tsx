"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * Figma Tooltip `Content` (462:38). `variant` = Figma Style, `layout` = Figma Type:
 * `label` = Default, `list` = 2 Lines, `list-icon` = Multilines Icon.
 * Figma Arrow (Bottom/Left/Top/Right) = the `side` the tooltip opens on.
 */
const tooltipContentVariants = cva(
  "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) rounded-r10 font-default text-11 leading-20 font-bold data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      variant: {
        // White fill, 1px inside stroke + soft drop shadow (one inset shadow so the arrow paints over it).
        default:
          "bg-background-0 text-base-700 shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)]",
        // Figma: black fill at 80% opacity.
        black: "bg-base-900/80 text-base-0 shadow-[0_16px_32px_0_var(--shadow-base)]",
        white: "bg-background-0 text-base-900",
      },
      layout: {
        label: "items-center px-3 py-1.5",
        list: "flex-col items-stretch py-1",
        "list-icon": "flex-col items-stretch gap-2 py-2",
      },
    },
    defaultVariants: { variant: "default", layout: "label" },
  }
)

/** Figma notch: about 8px wide, 4px out, centered on the edge. White has none. */
const tooltipArrowVariants = cva(
  "z-50 size-1.5 rotate-45 rounded-[1px] data-[side=bottom]:-top-[3px] data-[side=top]:-bottom-[3px] data-[side=left]:-right-[3px] data-[side=inline-start]:-right-[3px] data-[side=right]:-left-[3px] data-[side=inline-end]:-left-[3px]",
  {
    variants: {
      variant: {
        // Opaque: the inner half covers the content's stroke, outer edges carry the stroke.
        default:
          "border-base-100 bg-background-0 data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=top]:border-r data-[side=top]:border-b data-[side=left]:border-t data-[side=left]:border-r data-[side=inline-start]:border-t data-[side=inline-start]:border-r data-[side=right]:border-b data-[side=right]:border-l data-[side=inline-end]:border-b data-[side=inline-end]:border-l",
        // Translucent: clip the inner half so the overlap does not double the alpha.
        black:
          "bg-base-900/80 data-[side=bottom]:[clip-path:polygon(0_0,100%_0,0_100%)] data-[side=top]:[clip-path:polygon(100%_0,100%_100%,0_100%)] data-[side=left]:[clip-path:polygon(0_0,100%_0,100%_100%)] data-[side=inline-start]:[clip-path:polygon(0_0,100%_0,100%_100%)] data-[side=right]:[clip-path:polygon(0_0,100%_100%,0_100%)] data-[side=inline-end]:[clip-path:polygon(0_0,100%_100%,0_100%)]",
        white: "hidden",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TooltipContent({
  className,
  variant = "default",
  layout = "label",
  side = "top",
  sideOffset = 8,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > &
  VariantProps<typeof tooltipContentVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          data-variant={variant}
          data-layout={layout}
          className={cn(tooltipContentVariants({ variant, layout }), className)}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className={tooltipArrowVariants({ variant })}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

/** Figma `Heading` of the Multilines Icon type. */
function TooltipHeading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-heading"
      className={cn("px-2", className)}
      {...props}
    />
  )
}

/** Figma `Line`: label group on the left, right-aligned value. */
function TooltipRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-row"
      className={cn("flex items-center justify-between gap-5 pr-4 pl-2", className)}
      {...props}
    />
  )
}

/** Figma `Left` frame of a Line: optional Dot + label, 8px apart. */
function TooltipLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tooltip-label"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function TooltipValue({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tooltip-value"
      className={cn("text-right tabular-nums", className)}
      {...props}
    />
  )
}

/** Figma `Dot` (4317:18176): 6px circle, 600 shade of the chosen color. */
const tooltipDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    color: {
      primary: "bg-primary-600",
      base: "bg-base-600",
      orange: "bg-orange-600",
      purple: "bg-purple-600",
      red: "bg-red-600",
      yellow: "bg-yellow-600",
      green: "bg-green-600",
      sky: "bg-sky-600",
      pink: "bg-pink-600",
      amber: "bg-amber-600",
      teal: "bg-teal-600",
      lime: "bg-lime-600",
      cyan: "bg-cyan-600",
      emerald: "bg-emerald-600",
      rose: "bg-rose-600",
      fuchsia: "bg-fuchsia-600",
      blue: "bg-blue-600",
      indigo: "bg-indigo-600",
      violet: "bg-violet-600",
    },
  },
  defaultVariants: { color: "primary" },
})

function TooltipDot({
  className,
  color,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof tooltipDotVariants>) {
  return (
    <span
      data-slot="tooltip-dot"
      aria-hidden
      className={cn(tooltipDotVariants({ color }), className)}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipHeading,
  TooltipRow,
  TooltipLabel,
  TooltipValue,
  TooltipDot,
  tooltipContentVariants,
}
