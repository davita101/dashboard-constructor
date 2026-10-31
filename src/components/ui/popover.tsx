"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Figma Popover (9494:47023). `variant` = Figma Type, `side` = Figma Direction
 * (Bottom = notch on the top edge, i.e. popover opens below the trigger).
 * Sets --popover-icon (leading icon / close), --popover-text (content) and
 * --popover-foot (footer text) for the slots.
 */
const popoverContentVariants = cva(
  "z-50 flex w-70 origin-(--transform-origin) flex-col rounded-r12 font-default outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      variant: {
        default:
          "bg-background-0 text-base-700 [--popover-icon:var(--base-500)] [--popover-text:var(--base-600)] [--popover-foot:var(--base-800)] shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)]",
        black:
          "bg-base-900/80 text-base-0 [--popover-icon:var(--base-0)] [--popover-text:var(--base-200)] [--popover-foot:var(--base-0)] shadow-[0_16px_32px_0_var(--shadow-base)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/** Figma notch: about 8px wide, 4px out, centered on the edge. */
const popoverArrowVariants = cva(
  "z-50 size-1.5 rotate-45 rounded-[1px] data-[side=bottom]:-top-[3px] data-[side=top]:-bottom-[3px] data-[side=left]:-right-[3px] data-[side=inline-start]:-right-[3px] data-[side=right]:-left-[3px] data-[side=inline-end]:-left-[3px]",
  {
    variants: {
      variant: {
        default:
          "border-base-100 bg-background-0 data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=top]:border-r data-[side=top]:border-b data-[side=left]:border-t data-[side=left]:border-r data-[side=inline-start]:border-t data-[side=inline-start]:border-r data-[side=right]:border-b data-[side=right]:border-l data-[side=inline-end]:border-b data-[side=inline-end]:border-l",
        black:
          "bg-base-900/80 data-[side=bottom]:[clip-path:polygon(0_0,100%_0,0_100%)] data-[side=top]:[clip-path:polygon(100%_0,100%_100%,0_100%)] data-[side=left]:[clip-path:polygon(0_0,100%_0,100%_100%)] data-[side=inline-start]:[clip-path:polygon(0_0,100%_0,100%_100%)] data-[side=right]:[clip-path:polygon(0_0,100%_100%,0_100%)] data-[side=inline-end]:[clip-path:polygon(0_0,100%_100%,0_100%)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function PopoverContent({
  className,
  variant = "default",
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > &
  VariantProps<typeof popoverContentVariants>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-variant={variant}
          className={cn(popoverContentVariants({ variant }), className)}
          {...props}
        >
          {children}
          <PopoverPrimitive.Arrow
            data-slot="popover-arrow"
            className={popoverArrowVariants({ variant })}
          />
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/** Figma `Head` (280x52): leading Group (icon, heading, badge) + Close. */
function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex h-13 items-center justify-between gap-2 p-4", className)}
      {...props}
    />
  )
}

/** Figma `Group` (232x20): optional icon, heading, badge, 8px apart. */
function PopoverGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-group"
      className={cn("flex min-w-0 flex-1 items-center gap-2", className)}
      {...props}
    />
  )
}

/** Figma leading Icon (20px), tinted by the variant. Default: circle-dot placeholder. */
function PopoverIcon({
  className,
  src = "/icons/material-default-icon.svg",
  style,
  ...props
}: React.ComponentProps<"span"> & { src?: string }) {
  return (
    <span
      data-slot="popover-icon"
      aria-hidden
      style={{ maskImage: `url(${src})`, ...style }}
      className={cn(
        "size-5 shrink-0 bg-(--popover-icon) mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("truncate text-12 leading-20 font-bold", className)}
      {...props}
    />
  )
}

/** Figma pilled Badge in the head; use `variant="gray"` on the black type. */
function PopoverBadge({ ...props }: React.ComponentProps<typeof Badge>) {
  return <Badge data-slot="popover-badge" size="20" {...props} />
}

/** Figma material-close (16px). */
function PopoverClose({ className, ...props }: PopoverPrimitive.Close.Props) {
  return (
    <PopoverPrimitive.Close
      data-slot="popover-close"
      aria-label="Close"
      render={<Button variant="bare" size="icon-16" />}
      className={className}
      {...props}
    >
      <span
        aria-hidden
        className="size-4 bg-(--popover-icon) mask-[url(/icons/material-close.svg)] mask-contain mask-center mask-no-repeat"
      />
    </PopoverPrimitive.Close>
  )
}

/** Figma `Content` (280x36): 11px semibold body text. */
function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn(
        "px-4 py-2 text-11 leading-20 font-semibold text-(--popover-text)",
        className
      )}
      {...props}
    />
  )
}

/** Figma `Footer` (280x48): counter text left, buttons right. */
function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn("flex h-12 items-center justify-between gap-2 px-4", className)}
      {...props}
    />
  )
}

function PopoverFooterText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="popover-footer-text"
      className={cn("text-12 leading-20 font-semibold text-(--popover-foot)", className)}
      {...props}
    />
  )
}

function PopoverActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverActions,
  PopoverBadge,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverFooterText,
  PopoverGroup,
  PopoverHeader,
  PopoverIcon,
  PopoverTitle,
  PopoverTrigger,
  popoverArrowVariants,
  popoverContentVariants,
}
