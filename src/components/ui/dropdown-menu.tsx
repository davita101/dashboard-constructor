"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Figma Dropdown set (4290:12174). Every part has two shape families: Rounded and Pilled.
type DropdownShape = "rounded" | "pilled"
const ShapeContext = React.createContext<DropdownShape>("rounded")
const StaticContext = React.createContext(false)

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

// Menu card: 280 wide (Menu-2: 320), white, soft shadow.
const dropdownMenuContentVariants = cva(
  "z-50 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto bg-background-0 p-1 text-base-700 shadow-[inset_0_0_0_1px_var(--base-100),0_16px_32px_0_var(--shadow-base)] duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      shape: { rounded: "rounded-r12", pilled: "rounded-r20" },
      size: { default: "w-70", wide: "w-80" },
    },
    defaultVariants: { shape: "rounded", size: "default" },
  }
)

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  shape = "rounded",
  size,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > &
  VariantProps<typeof dropdownMenuContentVariants>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ShapeContext.Provider value={shape ?? "rounded"}>
          <MenuPrimitive.Popup
            data-slot="dropdown-menu-content"
            className={cn(dropdownMenuContentVariants({ shape, size }), className)}
            {...props}
          />
        </ShapeContext.Provider>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

// Static menu surface for previews (same chrome, no popup behaviour).
function DropdownMenuPanel({
  shape = "rounded",
  size,
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dropdownMenuContentVariants>) {
  return (
    <ShapeContext.Provider value={shape ?? "rounded"}>
      <StaticContext.Provider value>
        <div
          data-slot="dropdown-menu-panel"
          className={cn(dropdownMenuContentVariants({ shape, size }), "animate-none", className)}
          {...props}
        />
      </StaticContext.Provider>
    </ShapeContext.Provider>
  )
}

// Item: 36 high (pilled 40), Item-2 with description 74 (pilled 82).
// States: hover = base-50, active (highlighted/open) = base-100, disabled = faded.
const dropdownMenuItemVariants = cva(
  "group/dropdown-menu-item relative flex w-full cursor-default items-center justify-between gap-1 px-2 text-11 font-bold leading-20 text-base-700 outline-hidden select-none hover:bg-base-50 focus-visible:bg-base-50 data-highlighted:bg-base-50 data-popup-open:bg-base-100 active:bg-base-100 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5 [&_svg]:text-base-500",
  {
    variants: {
      shape: { rounded: "rounded-r8", pilled: "rounded-r12" },
      layout: {
        single: "",
        double: "items-start py-2",
      },
    },
    compoundVariants: [
      { shape: "rounded", layout: "single", className: "h-9" },
      { shape: "pilled", layout: "single", className: "h-10" },
      { shape: "rounded", layout: "double", className: "min-h-18.5" },
      { shape: "pilled", layout: "double", className: "min-h-20.5 py-3" },
    ],
    defaultVariants: { shape: "rounded", layout: "single" },
  }
)

function DropdownMenuItem({
  className,
  layout,
  ...props
}: MenuPrimitive.Item.Props & Pick<VariantProps<typeof dropdownMenuItemVariants>, "layout">) {
  const shape = React.useContext(ShapeContext)
  const isStatic = React.useContext(StaticContext)
  if (isStatic) {
    const { disabled, children } = props
    return (
      <div
        role="menuitem"
        data-slot="dropdown-menu-item"
        data-disabled={disabled ? "" : undefined}
        className={cn(dropdownMenuItemVariants({ shape, layout }), className)}
      >
        {children as React.ReactNode}
      </div>
    )
  }
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemVariants({ shape, layout }), className)}
      {...props}
    />
  )
}

/** Left cluster of an item: lead slot + text. */
function DropdownMenuItemMain({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-main"
      className={cn("flex min-w-0 items-center gap-1 px-1", className)}
      {...props}
    />
  )
}

/** Right cluster of an item: value text + trail slot. */
function DropdownMenuItemTrail({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-trail"
      className={cn("ml-auto flex shrink-0 items-center gap-1 px-1 text-base-600", className)}
      {...props}
    />
  )
}

/** Single-colour Figma icon asset from /icons, coloured by the token (CSS mask). */
function DropdownMenuIcon({
  name,
  className,
  ...props
}: React.ComponentProps<"span"> & { name: string }) {
  return (
    <span
      aria-hidden
      data-slot="dropdown-menu-icon"
      style={{ maskImage: `url(/icons/${name}.svg)` }}
      className={cn(
        "inline-block size-5 shrink-0 bg-base-500 mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

/** Item-2 text block: title + description. */
function DropdownMenuItemText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-text"
      className={cn("flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function DropdownMenuItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-description"
      className={cn("text-11 font-medium leading-20 text-base-500", className)}
      {...props}
    />
  )
}

/** Head-Footer Type=Default: bold heading left, value/trail right. */
const dropdownMenuHeadVariants = cva(
  "flex min-h-10 w-full items-center justify-between gap-2 px-3 text-11 font-bold leading-20 text-base-800"
)

function DropdownMenuHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-head"
      className={cn(dropdownMenuHeadVariants(), className)}
      {...props}
    />
  )
}

/** Head-Footer Type=Button / Form / User: 48 or 64 high slot for a full-width control. */
const dropdownMenuSlotVariants = cva("flex w-full items-center justify-between gap-2 px-2", {
  variants: { type: { control: "min-h-12", user: "min-h-16" } },
  defaultVariants: { type: "control" },
})

function DropdownMenuSlot({
  type,
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dropdownMenuSlotVariants>) {
  return (
    <div
      data-slot="dropdown-menu-slot"
      className={cn(dropdownMenuSlotVariants({ type }), className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn("flex min-h-10 items-center px-3 text-11 font-bold leading-20 text-base-800", className)}
      {...props}
    />
  )
}

// Divider-Dropdown: 8 high (pilled 12), 1px line centred.
const dropdownMenuSeparatorVariants = cva("flex w-full items-center", {
  variants: { shape: { rounded: "h-2", pilled: "h-3" } },
  defaultVariants: { shape: "rounded" },
})

function DropdownMenuSeparator({ className }: { className?: string }) {
  const shape = React.useContext(ShapeContext)
  return (
    <div
      data-slot="dropdown-menu-separator"
      role="presentation"
      className={cn(dropdownMenuSeparatorVariants({ shape }), className)}
    >
      <Separator />
    </div>
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props) {
  const shape = React.useContext(ShapeContext)
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(dropdownMenuItemVariants({ shape }), className)}
      {...props}
    >
      {children}
      <DropdownMenuIcon name="material-chevron-right" className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent(props: React.ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent side="right" align="start" sideOffset={4} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPanel,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuItemMain,
  DropdownMenuItemTrail,
  DropdownMenuItemText,
  DropdownMenuItemDescription,
  DropdownMenuIcon,
  DropdownMenuHead,
  DropdownMenuSlot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
}
