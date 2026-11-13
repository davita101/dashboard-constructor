"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// Figma Dropdown page (4290:12174). Every set comes in two shape families, Rounded and Pilled:
// Item (2692:137241 / 16281:15167), Item-2 (12855:24785 / 16292:266882), Menu (4292:13287 /
// 16281:15693), Menu-2 (12865:345558 / 16294:267333), Head-Footer (7120:55116 / 16281:20393) and
// Divider (14146:1331 / 16281:20389). The shape is set once on the menu surface and read by the
// parts through context; Item-2 (title + description) is the "double" layout of Item.
type DropdownShape = "rounded" | "pilled"
type DropdownLayout = "single" | "double"
const ShapeContext = React.createContext<DropdownShape>("rounded")
const LayoutContext = React.createContext<DropdownLayout>("single")
const StaticContext = React.createContext(false)

/** Shape of the surrounding menu, for parts that compose other primitives (Button, Avatar). */
function useDropdownMenuShape() {
  return React.useContext(ShapeContext)
}

/** Layout of the surrounding item: "single" (Item) or "double" (Item-2). */
function useDropdownMenuLayout() {
  return React.useContext(LayoutContext)
}

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
  const isStatic = React.useContext(StaticContext)
  if (isStatic) {
    const { children, className } = props as { children?: React.ReactNode; className?: string }
    return (
      <div role="group" data-slot="dropdown-menu-group" className={className}>
        {children}
      </div>
    )
  }
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

// Menu / Menu-2: white card, 1px inside stroke base-100, radius 16 (Rounded) / 24 (Pilled).
// Rounded keeps 4px above and below the stack, Pilled 8px (Menu-2 Pilled: none).
// Width: Menu 280, Menu-2 320. Shadow: Figma effect unreadable, same drop shadow as Popover.
const dropdownMenuContentVariants = cva(
  "flex flex-col overflow-x-hidden overflow-y-auto bg-background-0 font-default text-base-700 outline -outline-offset-1 outline-base-100",
  {
    variants: {
      shape: { rounded: "rounded-r16 py-1", pilled: "rounded-r24 py-2" },
      size: { default: "w-70", wide: "w-80" },
      surface: {
        card: "shadow-[0_16px_32px_0_var(--shadow-base)]",
        // Bare set frame (component previews): no card chrome
        none: "rounded-none bg-transparent py-0 outline-0",
      },
    },
    compoundVariants: [{ shape: "pilled", size: "wide", surface: "card", className: "py-0" }],
    defaultVariants: { shape: "rounded", size: "default", surface: "card" },
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
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> &
  Omit<VariantProps<typeof dropdownMenuContentVariants>, "surface">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          data-surface="card"
          className={cn(
            dropdownMenuContentVariants({ shape, size, surface: "card" }),
            "max-h-(--available-height) origin-(--transform-origin) duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <ShapeContext.Provider value={shape ?? "rounded"}>{children}</ShapeContext.Provider>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/** Static menu surface for previews and inline menus (same chrome, no popup behaviour). */
function DropdownMenuPanel({
  shape = "rounded",
  size,
  surface = "card",
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof dropdownMenuContentVariants>) {
  return (
    <ShapeContext.Provider value={shape ?? "rounded"}>
      <StaticContext.Provider value>
        <div
          role="menu"
          data-slot="dropdown-menu-panel"
          data-surface={surface}
          className={cn(dropdownMenuContentVariants({ shape, size, surface }), className)}
          {...props}
        />
      </StaticContext.Provider>
    </ShapeContext.Provider>
  )
}

// Item frame: 280 wide, the coloured Content box is inset 8px left/right.
// Item: Rounded 36 high (Content 28, padding 4, r8), Pilled 40 (Content 36, padding 8, pill).
// Item-2: Rounded 74 (66 inside a menu card; Content 58, padding 8, r8), Pilled 82 (Content 66,
// padding 12, r16). States drive CSS vars that Content, title, icons and value read:
// Default: no fill, title base-700, icon base-500, value base-600.
// Hover (pointer or keyboard highlight): fill base-40, title + icon base-800.
// Active (pressed / submenu open): fill base-100, title + icon + value base-800.
// Disabled: no fill, title + icon base-800, value base-400, faded (opacity unreadable: 50%).
// Item-2 keeps title base-800 and value base-400 in every state.
const dropdownMenuItemVariants = cva(
  "group/dropdown-menu-item relative flex w-full cursor-default px-2 font-default outline-hidden select-none " +
    "[--dd-fill:transparent] [--dd-icon:var(--base-500)] [--dd-title:var(--base-700)] [--dd-value:var(--base-600)] " +
    "hover:[--dd-fill:var(--base-40)] hover:[--dd-icon:var(--base-800)] hover:[--dd-title:var(--base-800)] " +
    "data-highlighted:[--dd-fill:var(--base-40)] data-highlighted:[--dd-icon:var(--base-800)] data-highlighted:[--dd-title:var(--base-800)] " +
    "data-[force=hover]:[--dd-fill:var(--base-40)] data-[force=hover]:[--dd-icon:var(--base-800)] data-[force=hover]:[--dd-title:var(--base-800)] " +
    "active:[--dd-fill:var(--base-100)] active:[--dd-icon:var(--base-800)] active:[--dd-title:var(--base-800)] active:[--dd-value:var(--base-800)] " +
    "data-popup-open:[--dd-fill:var(--base-100)] data-popup-open:[--dd-icon:var(--base-800)] data-popup-open:[--dd-title:var(--base-800)] data-popup-open:[--dd-value:var(--base-800)] " +
    "data-[force=active]:[--dd-fill:var(--base-100)] data-[force=active]:[--dd-icon:var(--base-800)] data-[force=active]:[--dd-title:var(--base-800)] data-[force=active]:[--dd-value:var(--base-800)] " +
    "data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:[--dd-icon:var(--base-800)] data-disabled:[--dd-title:var(--base-800)] data-disabled:[--dd-value:var(--base-400)]",
  {
    variants: {
      shape: { rounded: "", pilled: "" },
      layout: {
        single: "",
        double:
          "[--dd-title:var(--base-800)]! [--dd-value:var(--base-400)]!",
      },
    },
    compoundVariants: [
      { shape: "rounded", layout: "single", className: "py-1" },
      { shape: "pilled", layout: "single", className: "py-0.5" },
      { shape: "rounded", layout: "double", className: "py-2 in-data-[surface=card]:py-1" },
      { shape: "pilled", layout: "double", className: "py-2" },
    ],
    defaultVariants: { shape: "rounded", layout: "single" },
  }
)

// Figma "Content": the box that takes the state fill. Row = Left + Right, space-between.
const dropdownMenuItemContentVariants = cva(
  "flex w-full min-w-0 items-center justify-between gap-2 bg-(--dd-fill) transition-colors",
  {
    variants: {
      shape: { rounded: "", pilled: "" },
      layout: { single: "", double: "" },
    },
    compoundVariants: [
      { shape: "rounded", layout: "single", className: "rounded-r8 p-1" },
      { shape: "pilled", layout: "single", className: "rounded-full p-2" },
      { shape: "rounded", layout: "double", className: "rounded-r8 p-2" },
      { shape: "pilled", layout: "double", className: "rounded-r16 p-3" },
    ],
    defaultVariants: { shape: "rounded", layout: "single" },
  }
)

type DropdownMenuItemState = "default" | "hover" | "active" | "disabled"

function DropdownMenuItem({
  className,
  layout = "single",
  state,
  children,
  ...props
}: MenuPrimitive.Item.Props &
  Pick<VariantProps<typeof dropdownMenuItemVariants>, "layout"> & {
    /** Pin a Figma state (previews). Real menus get Hover / Active / Disabled from interaction. */
    state?: DropdownMenuItemState
  }) {
  const shape = React.useContext(ShapeContext)
  const isStatic = React.useContext(StaticContext)
  const resolvedLayout = layout ?? "single"
  const disabled = props.disabled || state === "disabled"
  const force = state === "hover" || state === "active" ? state : undefined
  const content = (
    <LayoutContext.Provider value={resolvedLayout}>
      <span
        data-slot="dropdown-menu-item-content"
        className={dropdownMenuItemContentVariants({ shape, layout: resolvedLayout })}
      >
        {children as React.ReactNode}
      </span>
    </LayoutContext.Provider>
  )
  const itemClassName = cn(dropdownMenuItemVariants({ shape, layout: resolvedLayout }), className)
  if (isStatic) {
    return (
      <div
        role="menuitem"
        tabIndex={disabled ? undefined : -1}
        aria-disabled={disabled || undefined}
        data-slot="dropdown-menu-item"
        data-layout={resolvedLayout}
        data-force={force}
        data-disabled={disabled ? "" : undefined}
        className={itemClassName}
      >
        {content}
      </div>
    )
  }
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-layout={resolvedLayout}
      data-force={force}
      className={itemClassName}
      {...props}
      disabled={disabled}
    >
      {content}
    </MenuPrimitive.Item>
  )
}

/** Figma "Left": lead addon + text. */
function DropdownMenuItemLeft({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-left"
      className={cn("flex min-w-0 flex-1 items-center", className)}
      {...props}
    />
  )
}

/** Figma "Right": value text, button, icon or a trailing addon. */
function DropdownMenuItemRight({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-right"
      className={cn("flex shrink-0 items-center gap-1 pr-1", className)}
      {...props}
    />
  )
}

// Lead / trail slots of Figma Left and Right: Icon, Payment, Avatar, Flag, Checkbox, Radio,
// Switcher. Lead frames add 8px after the control (Icon 20 -> 28, Payment 32 -> 40, Avatar 24 -> 32,
// Switcher 36 -> 44); trail frames sit flush in the Right row.
const dropdownMenuItemAddonVariants = cva("flex shrink-0 items-center", {
  variants: {
    side: { start: "pr-2", end: "" },
  },
  defaultVariants: { side: "start" },
})

function DropdownMenuItemAddon({
  side,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof dropdownMenuItemAddonVariants>) {
  return (
    <span
      data-slot="dropdown-menu-item-addon"
      data-side={side ?? "start"}
      className={cn(dropdownMenuItemAddonVariants({ side }), className)}
      {...props}
    />
  )
}

// Typed slots over the Addon. Start frames add 8px after the control; end frames are right-aligned
// in the Right row and carry the same 8px on their left, so frame widths match Figma (Avatar/Flag
// 32x24, Checkbox/Radio 28x20, Switcher 44x20, Payment 32x20 end). Controls are visuals only:
// the menu item handles the click, the caller drives `checked`.
type DropdownMenuItemSlotProps = { side?: "start" | "end" }

const slotSideClass = (side: "start" | "end" | undefined) => (side === "end" ? "pl-2" : undefined)

const inertControl = { tabIndex: -1, "aria-hidden": true } as const

/** Figma Avatar slot: 24 avatar (32 in Item-2), circle in Pilled menus, rounded corners otherwise. */
function DropdownMenuItemAvatar({
  side,
  size,
  shape,
  ...props
}: React.ComponentProps<typeof Avatar> & DropdownMenuItemSlotProps) {
  const menuShape = useDropdownMenuShape()
  const layout = useDropdownMenuLayout()
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <Avatar
        size={size ?? (layout === "double" ? "32" : "24")}
        shape={shape ?? (menuShape === "pilled" ? "circle" : "rounded")}
        {...props}
      />
    </DropdownMenuItemAddon>
  )
}

/** Figma Flag slot: 24x24 round box for the caller's flag image (`next/image`, `<img>`). */
function DropdownMenuItemFlag({
  side,
  className,
  ...props
}: React.ComponentProps<typeof Avatar> & DropdownMenuItemSlotProps) {
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <Avatar size="24" shape="circle" className={cn("overflow-hidden", className)} {...props} />
    </DropdownMenuItemAddon>
  )
}

function DropdownMenuItemCheckbox({
  side,
  ...props
}: React.ComponentProps<typeof Checkbox> & DropdownMenuItemSlotProps) {
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <Checkbox {...inertControl} className="pointer-events-none" {...props} />
    </DropdownMenuItemAddon>
  )
}

function DropdownMenuItemRadio({
  side,
  ...props
}: React.ComponentProps<typeof RadioGroupItem> & DropdownMenuItemSlotProps) {
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <RadioGroupItem {...inertControl} className="pointer-events-none" {...props} />
    </DropdownMenuItemAddon>
  )
}

function DropdownMenuItemSwitch({
  side,
  ...props
}: React.ComponentProps<typeof Switch> & DropdownMenuItemSlotProps) {
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <Switch {...inertControl} className="pointer-events-none" {...props} />
    </DropdownMenuItemAddon>
  )
}

/** Figma Payment slot: 32x20 white tile, 1px inside stroke base-100, radius 6. `children` = card logo. */
function DropdownMenuItemPayment({
  side,
  className,
  ...props
}: React.ComponentProps<"span"> & DropdownMenuItemSlotProps) {
  return (
    <DropdownMenuItemAddon side={side} className={slotSideClass(side)}>
      <span
        data-slot="dropdown-menu-item-payment"
        className={cn(
          "flex h-5 w-8 shrink-0 items-center justify-center overflow-hidden rounded-r6 bg-background-0 outline -outline-offset-1 outline-base-100",
          className
        )}
        {...props}
      />
    </DropdownMenuItemAddon>
  )
}

// Item title: Inter Bold 11/20, text starts 4px after the lead frame. Item-2 title: Bold 12/20.
const dropdownMenuItemTitleVariants = cva("truncate font-bold text-(--dd-title)", {
  variants: {
    layout: {
      single: "px-1 text-11 leading-20",
      double: "text-12 leading-20",
    },
  },
  defaultVariants: { layout: "single" },
})

function DropdownMenuItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  const layout = React.useContext(LayoutContext)
  return (
    <span
      data-slot="dropdown-menu-item-title"
      className={cn(dropdownMenuItemTitleVariants({ layout }), className)}
      {...props}
    />
  )
}

/** Item-2 text block (Figma Group): title over description. */
function DropdownMenuItemText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-text"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

/** Item-2 description: Inter Semi Bold 11/20, base-500. */
function DropdownMenuItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-item-description"
      className={cn("truncate text-11 font-semibold leading-20 text-base-500", className)}
      {...props}
    />
  )
}

/** Figma Right "Text" (count "140", shortcut text): Inter Bold 11/20 in the state value colour. */
function DropdownMenuValue({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-value"
      className={cn(
        "shrink-0 pr-1 text-11 font-bold leading-20 text-(--dd-value,var(--base-400))",
        className
      )}
      {...props}
    />
  )
}

// Single-colour Figma icon asset from /icons, coloured by the state token (CSS mask).
// Item icons are 20px; the Item-2 lead icon is 28px.
const dropdownMenuIconVariants = cva(
  "inline-block shrink-0 bg-(--dd-icon,var(--base-500)) mask-contain mask-center mask-no-repeat",
  {
    variants: { size: { "20": "size-5", "28": "size-7" } },
    defaultVariants: { size: "20" },
  }
)

function DropdownMenuIcon({
  name,
  size,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof dropdownMenuIconVariants> & { name: string }) {
  return (
    <span
      aria-hidden
      data-slot="dropdown-menu-icon"
      style={{ maskImage: `url(/icons/${name}.svg)`, ...style }}
      className={cn(dropdownMenuIconVariants({ size }), className)}
      {...props}
    />
  )
}

// Head-Footer (7120:55116 / 16281:20393): heading or footer row of a menu.
// Default 40 high: bold heading left (Rounded starts 16px in, Pilled 18px), value/button/icon right.
// Button 48: full-width Outline-Button 28 (inset 12 Rounded / 16 Pilled).
// Form 48: full-width Input 32 (same insets). User 64: name + email left, Avatar 40 right.
const dropdownMenuHeadVariants = cva(
  "flex w-full items-center justify-between gap-2 font-default text-11 font-bold leading-20 text-base-800",
  {
    variants: {
      shape: { rounded: "", pilled: "" },
      type: {
        default: "h-10 pr-3",
        button: "h-12 py-2.5",
        form: "h-12 py-2",
        user: "h-16 py-3",
      },
    },
    compoundVariants: [
      { shape: "rounded", type: "default", className: "pl-4" },
      { shape: "pilled", type: "default", className: "pl-4.5" },
      { shape: "rounded", type: ["button", "form", "user"], className: "px-3" },
      { shape: "pilled", type: ["button", "form", "user"], className: "px-4" },
    ],
    defaultVariants: { shape: "rounded", type: "default" },
  }
)

function DropdownMenuHead({
  type,
  className,
  ...props
}: React.ComponentProps<"div"> & Omit<VariantProps<typeof dropdownMenuHeadVariants>, "shape">) {
  const shape = React.useContext(ShapeContext)
  return (
    <div
      data-slot="dropdown-menu-head"
      data-type={type ?? "default"}
      className={cn(dropdownMenuHeadVariants({ shape, type }), className)}
      {...props}
    />
  )
}

/** Head-Footer Type=Default heading text ("Text Heading", "Text Footer"). */
function DropdownMenuHeadTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-head-title"
      className={cn("min-w-0 truncate", className)}
      {...props}
    />
  )
}

/** Head-Footer Type=User text block: name row over email (starts 4px in). */
function DropdownMenuUser({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-user"
      className={cn("flex min-w-0 flex-1 flex-col pl-1", className)}
      {...props}
    />
  )
}

/** User name: Inter Bold 12/20 base-900, optional chevron 8px after. */
function DropdownMenuUserName({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-user-name"
      className={cn("flex items-center gap-2 text-12 font-bold leading-20 text-base-900", className)}
      {...props}
    />
  )
}

/** User email: Inter Bold 11/20 base-500. */
function DropdownMenuUserEmail({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-user-email"
      className={cn("truncate text-11 font-bold leading-20 text-base-500", className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  const shape = React.useContext(ShapeContext)
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn(dropdownMenuHeadVariants({ shape, type: "default" }), className)}
      {...props}
    />
  )
}

// Divider-Dropdown: Rounded 8 high with the line inset 12, Pilled 12 high inset 16.
// Line = Divider-Horizontal, filled base-100 in this set.
const dropdownMenuSeparatorVariants = cva(
  "flex w-full shrink-0 items-center *:data-[slot=separator]:bg-base-100",
  {
    variants: { shape: { rounded: "h-2 px-3", pilled: "h-3 px-4" } },
    defaultVariants: { shape: "rounded" },
  }
)

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
      <span
        data-slot="dropdown-menu-item-content"
        className={dropdownMenuItemContentVariants({ shape })}
      >
        {children as React.ReactNode}
        <DropdownMenuItemRight>
          <DropdownMenuIcon name="material-chevron-right" />
        </DropdownMenuItemRight>
      </span>
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
  DropdownMenuItemLeft,
  DropdownMenuItemRight,
  DropdownMenuItemAddon,
  DropdownMenuItemAvatar,
  DropdownMenuItemFlag,
  DropdownMenuItemCheckbox,
  DropdownMenuItemRadio,
  DropdownMenuItemSwitch,
  DropdownMenuItemPayment,
  DropdownMenuItemTitle,
  DropdownMenuItemText,
  DropdownMenuItemDescription,
  DropdownMenuValue,
  DropdownMenuIcon,
  DropdownMenuHead,
  DropdownMenuHeadTitle,
  DropdownMenuUser,
  DropdownMenuUserName,
  DropdownMenuUserEmail,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  useDropdownMenuShape,
  useDropdownMenuLayout,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  type DropdownMenuItemState,
}
