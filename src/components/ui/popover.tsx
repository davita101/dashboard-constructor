"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type PopoverVariant = "default" | "black"

/** Figma Type, shared with the slots so badge, close and buttons follow it. */
const PopoverVariantContext = React.createContext<PopoverVariant>("default")

function usePopoverVariant() {
  return React.useContext(PopoverVariantContext)
}

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/**
 * Figma Popover (9494:47023), 280x136, radius 12. `variant` = Figma Type,
 * `side` = Figma Direction (Bottom = notch on the top edge, popover below the trigger).
 * Default: background-0 fill, 1px base-100 inside stroke, soft drop shadow.
 * Black: black-alpha-80 fill, no stroke, no shadow.
 * The stroke is an inset box-shadow (not an outline) so the notch can paint over it.
 * Slot colors: --popover-icon (leading icon, close), --popover-text (content),
 * --popover-foot (footer counter).
 */
const popoverContentVariants = cva(
  "relative z-50 flex w-70 origin-(--transform-origin) flex-col rounded-r12 font-default outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      variant: {
        default:
          "bg-background-0 text-base-700 shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)] [--popover-foot:var(--base-800)] [--popover-icon:var(--base-500)] [--popover-text:var(--base-600)]",
        black:
          "bg-black-alpha-80 text-base-0 [--popover-foot:var(--base-0)] [--popover-icon:var(--base-0)] [--popover-text:var(--base-200)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

/**
 * Figma `Arrow` notch: 12x6 triangle centered on the edge, card fill.
 * Drawn pointing up in a 12x12 box whose bottom row sits on the card edge; rotated per side.
 */
const popoverArrowVariants = cva(
  "pointer-events-none size-3 overflow-visible data-[side=bottom]:-top-[11px] data-[side=inline-end]:-left-[11px] data-[side=inline-end]:-rotate-90 data-[side=inline-start]:-right-[11px] data-[side=inline-start]:rotate-90 data-[side=left]:-right-[11px] data-[side=left]:rotate-90 data-[side=right]:-left-[11px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-[11px] data-[side=top]:rotate-180",
  {
    variants: {
      variant: {
        default: "fill-background-0 stroke-base-100",
        black: "fill-black-alpha-80 stroke-none",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function PopoverArrowShape({ variant }: { variant: PopoverVariant }) {
  return (
    <svg viewBox="0 0 12 12" className="size-full overflow-visible" aria-hidden>
      <path d="M0 11 L6 5 L12 11 Z" strokeWidth={0} />
      {variant === "default" ? (
        <>
          {/* covers the card's 1px stroke under the notch base */}
          <rect x="0.5" y="11" width="11" height="1" strokeWidth={0} />
          <path d="M0 11 L6 5 L12 11" fill="none" strokeWidth={1} strokeLinejoin="round" />
        </>
      ) : null}
    </svg>
  )
}

function PopoverContent({
  className,
  variant,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  collisionAvoidance,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "collisionAvoidance"
  > &
  VariantProps<typeof popoverContentVariants>) {
  const type: PopoverVariant = variant ?? "default"
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionAvoidance={collisionAvoidance}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-variant={type}
          className={cn(popoverContentVariants({ variant: type }), className)}
          {...props}
        >
          <PopoverVariantContext.Provider value={type}>
            {children}
          </PopoverVariantContext.Provider>
          <PopoverPrimitive.Arrow
            data-slot="popover-arrow"
            className={popoverArrowVariants({ variant: type })}
          >
            <PopoverArrowShape variant={type} />
          </PopoverPrimitive.Arrow>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/** Figma `Head` (280x52): leading Group (icon, heading, badge) + Close, 16px padding. */
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

/** Figma `Heading`: Inter 12/20 bold, base-700 (Default) / base-0 (Black). */
function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("truncate text-12 leading-20 font-bold", className)}
      {...props}
    />
  )
}

/**
 * Figma Badge-Default-Pilled (20h). Default: soft-border primary (primary-alpha-5 to 15
 * fill, primary-alpha-10 to 20 stroke, primary-600 text). Black: white-soft (white-alpha-20).
 */
function PopoverBadge({ variant, ...props }: React.ComponentProps<typeof Badge>) {
  const type = usePopoverVariant()
  return (
    <Badge
      data-slot="popover-badge"
      size="20"
      variant={variant ?? (type === "black" ? "white-soft" : "soft-border")}
      {...props}
    />
  )
}

const popoverCloseIconVariants = cva(
  "bg-(--popover-icon) mask-[url(/icons/material-close.svg)] mask-contain mask-center mask-no-repeat",
  {
    variants: {
      size: { "16": "size-4", "20": "size-5" },
    },
    defaultVariants: { size: "16" },
  }
)

/** Figma material-close: 16px (20px on Default/Top), base-500 / base-0. */
function PopoverClose({
  className,
  size = "16",
  ...props
}: PopoverPrimitive.Close.Props & VariantProps<typeof popoverCloseIconVariants>) {
  return (
    <PopoverPrimitive.Close
      data-slot="popover-close"
      aria-label="Close"
      render={<Button variant="bare" size={size === "20" ? "icon-20" : "icon-16"} />}
      className={className}
      {...props}
    >
      <span aria-hidden className={popoverCloseIconVariants({ size })} />
    </PopoverPrimitive.Close>
  )
}

/** Figma `Content` (280x36): 11/20 semibold body text, 16px sides and bottom. */
function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn(
        "px-4 pb-4 text-11 leading-20 font-semibold text-(--popover-text)",
        className
      )}
      {...props}
    />
  )
}

/** Figma `Footer` (280x48): counter text left, buttons right, 32px row + 16px bottom. */
function PopoverFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-footer"
      className={cn("flex h-12 items-center justify-between gap-2 px-4 pb-4", className)}
      {...props}
    />
  )
}

/** Figma `1 from 10`: 12/20 semibold, base-800 / base-0. */
function PopoverFooterText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="popover-footer-text"
      className={cn("text-12 leading-20 font-semibold text-(--popover-foot)", className)}
      {...props}
    />
  )
}

/** Figma `Buttons` frame, right aligned. */
function PopoverActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/** Figma Back: Ghost-Button 32 (Default) / White-Soft-Button 28 (Black). */
function PopoverBack({ ...props }: React.ComponentProps<typeof Button>) {
  const type = usePopoverVariant()
  return type === "black" ? (
    <Button data-slot="popover-back" variant="white-soft" size="28-loose" {...props} />
  ) : (
    <Button data-slot="popover-back" variant="ghost" size="32" shape="rounded" {...props} />
  )
}

/** Figma Next: Dark-Button 28 (Default) / White-Button 28 (Black), pill. */
function PopoverNext({ ...props }: React.ComponentProps<typeof Button>) {
  const type = usePopoverVariant()
  return (
    <Button
      data-slot="popover-next"
      variant={type === "black" ? "white" : "dark"}
      size="28-loose"
      {...props}
    />
  )
}

export {
  Popover,
  PopoverActions,
  PopoverBack,
  PopoverBadge,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverFooterText,
  PopoverGroup,
  PopoverHeader,
  PopoverIcon,
  PopoverNext,
  PopoverTitle,
  PopoverTrigger,
  popoverArrowVariants,
  popoverCloseIconVariants,
  popoverContentVariants,
}
