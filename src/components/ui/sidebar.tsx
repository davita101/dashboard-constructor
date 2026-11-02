import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// Figma Sidebar-01…09 (page 15260:53844). Slots: Logo-Head, Head-Item (group), List-Item (item),
// User-Component (user), User-List-Component (chat), Navigate-Avatar-Group cell (rail item).
// Icons are masked SVGs from public/icons so text color drives them.

const sidebarVariants = cva("group/sidebar flex flex-col font-default tracking-default text-base-800", {
  variants: {
    // Figma widths: panel 248 (p 12), wide 272 (p 20/12), rail 64 (p 8), icon 64 (p 20/12), flush 248 (p 0)
    layout: {
      panel: "w-62 gap-4 p-3",
      wide: "w-68 gap-2 px-3 py-5",
      rail: "w-16 gap-0 p-2",
      icon: "w-16 items-center gap-2 px-3 py-5",
      flush: "w-62 gap-0 p-0",
      // Figma Sidebar-Commerce-01 (296, p 12/20, gap 40), -02/-04 (296, p 24, gap 16), -03 (296, p 20, gap 16)
      commerce: "w-74 gap-10 px-5 py-3",
      "commerce-card": "w-74 gap-4 p-6",
      "commerce-card-sm": "w-74 gap-4 p-5",
    },
    bordered: {
      true: "outline outline-background-100 -outline-offset-1",
      false: "",
    },
  },
  defaultVariants: { layout: "panel", bordered: false },
})

type SidebarLayout = NonNullable<VariantProps<typeof sidebarVariants>["layout"]>

/** Figma Sidebar root. `layout` picks the width and padding of each Sidebar-0N set. */
function Sidebar({
  className,
  layout = "panel",
  bordered = false,
  ...props
}: React.ComponentProps<"aside"> & VariantProps<typeof sidebarVariants>) {
  return (
    <aside
      data-slot="sidebar"
      data-layout={layout}
      className={cn(sidebarVariants({ layout, bordered }), className)}
      {...props}
    />
  )
}

/** Masked Material icon: `name` is the file in public/icons without `material-` and `.svg`. */
const sidebarIconVariants = cva("shrink-0 bg-current mask-contain mask-center mask-no-repeat", {
  variants: {
    size: { "12": "size-3", "16": "size-4", "20": "size-5", "24": "size-6" },
  },
  defaultVariants: { size: "20" },
})

function SidebarIcon({
  name,
  size = "20",
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof sidebarIconVariants> & { name: string }) {
  return (
    <span
      data-slot="sidebar-icon"
      aria-hidden
      className={cn(sidebarIconVariants({ size }), className)}
      style={{ maskImage: `url(/icons/material-${name}.svg)`, ...style }}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex h-8 w-full items-center justify-between gap-3 px-0 group-data-[layout=wide]/sidebar:px-2", className)}
      {...props}
    />
  )
}

/** Figma Logo-Head-Sidebar: gradient disc (base-900 → base-700) with the material-default-icon ring. */
const sidebarLogoVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full bg-linear-to-b from-base-900 to-base-700 p-0.5",
  {
    variants: { size: { "32": "size-8", "40": "size-10" } },
    defaultVariants: { size: "32" },
  }
)

function SidebarLogo({
  className,
  size = "32",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof sidebarLogoVariants>) {
  return (
    <span data-slot="sidebar-logo" className={cn(sidebarLogoVariants({ size }), className)} {...props}>
      <SidebarIcon name="default-icon" size={size === "40" ? "24" : "20"} className="text-background-0" />
    </span>
  )
}

function SidebarBrand({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-brand" className={cn("flex items-center gap-3", className)} {...props} />
}

function SidebarTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="sidebar-title" className={cn("text-13 leading-24 font-bold whitespace-nowrap text-base-800", className)} {...props} />
  )
}

function SidebarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-actions" className={cn("flex items-center gap-2 text-base-500", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("mt-auto flex flex-col gap-1", className)} {...props} />
}

/** Figma Menu / Head-Item-Component: heading with a collapse chevron. */
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("flex w-full flex-col", className)} {...props} />
}

// Figma Head-Item-Component: Default 36 (11/20 semibold), Big 44 (12/20 bold); `line` adds a top/bottom Divider.
const sidebarGroupHeadVariants = cva("group/head relative flex items-center font-default justify-between pr-4 pl-3 text-base-500", {
  variants: {
    size: { "36": "h-9 py-2", "44": "h-11 py-3" },
    line: { none: "", top: "", bottom: "" },
  },
  compoundVariants: [{ size: "36", line: "top", className: "h-15 py-5" }],
  defaultVariants: { size: "44", line: "none" },
})

function SidebarGroupHead({
  className,
  size = "44",
  line = "none",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof sidebarGroupHeadVariants>) {
  return (
    <div
      data-slot="sidebar-group-head"
      data-size={size}
      className={cn(sidebarGroupHeadVariants({ size, line }), className)}
      {...props}
    >
      {line === "top" && <Separator className="absolute inset-x-0 top-0" />}
      {children}
      {line === "bottom" && <Separator className="absolute inset-x-0 bottom-0" />}
    </div>
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="sidebar-group-label" className={cn("text-12 leading-20 font-bold text-base-800 group-data-[size=36]/head:text-11 group-data-[size=36]/head:font-semibold", className)} {...props} />
  )
}

const sidebarMenuVariants = cva("flex w-full flex-col", {
  variants: { gap: { "0": "gap-0", "1": "gap-1" } },
  defaultVariants: { gap: "0" },
})

function SidebarMenu({
  className,
  gap = "0",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof sidebarMenuVariants>) {
  return <div data-slot="sidebar-menu" role="list" className={cn(sidebarMenuVariants({ gap }), className)} {...props} />
}

// Figma List-Item-Component: 40px row, active = pill with stroke. `collapsed` = List-Icon-Item (40x40 icon only).
const sidebarItemVariants = cva(
  "group/sidebar-item relative flex items-center text-left font-default text-11 leading-20 font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      active: {
        true: "bg-background-0 text-base-800 outline outline-background-100 -outline-offset-1",
        false: "text-base-600 hover:bg-background-20 hover:text-base-800",
      },
      collapsed: {
        true: "size-10 shrink-0 justify-center p-2.5",
        false: "my-1 mr-1 h-8 w-[calc(100%-4px)] gap-2 px-3 py-1.5",
      },
      // Figma List-Item / Icon-Item selected looks: Select 1 outline, Select 2 primary, Select 3 soft, Select 4 dark.
      tone: {
        none: "",
        text: "text-base-800",
        outline: "bg-background-0 text-base-800 outline outline-background-100 -outline-offset-1 hover:bg-background-0",
        soft: "bg-background-0 text-base-800 hover:bg-background-0",
        primary: "bg-blue-600 text-background-0 outline outline-blue-700 -outline-offset-1 hover:bg-blue-600 hover:text-background-0",
        dark: "bg-base-900 text-background-0 outline outline-base-900 -outline-offset-1 hover:bg-base-900 hover:text-background-0",
      },
      shape: { pilled: "rounded-r32", rounded: "rounded-r8", square: "rounded-r6" },
    },
    defaultVariants: { active: false, collapsed: false, tone: "none", shape: "pilled" },
  }
)

function SidebarItem({
  className,
  active = false,
  collapsed = false,
  tone = "none",
  shape = "pilled",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarItemVariants>) {
  return (
    <button
      type="button"
      role="listitem"
      data-slot="sidebar-item"
      data-active={active || undefined}
      data-tone={tone}
      aria-current={active || (tone !== "none" && tone !== "text") ? "page" : undefined}
      className={cn(sidebarItemVariants({ active, collapsed, tone, shape }), className)}
      {...props}
    />
  )
}

/** Non-interactive row that holds its own control (Night Mode switch), so no button nests in a button. */
function SidebarItemRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="listitem"
      data-slot="sidebar-item-row"
      className={cn(sidebarItemVariants({ active: false, collapsed: false }), "cursor-default", className)}
      {...props}
    />
  )
}

function SidebarItemLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-item-label" className={cn("min-w-0 flex-1 truncate", className)} {...props} />
}

/** Left slot of a List-Item: swap in Checkbox, Radio, Switch, Avatar, flag or payment icon. */
function SidebarItemLeading({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-item-leading" className={cn("flex shrink-0 items-center", className)} {...props} />
}

/** Right side of an item: counter badge, chevron. */
function SidebarItemEnd({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-item-end" className={cn("flex shrink-0 items-center gap-1 text-base-500", className)} {...props} />
}

/** Figma List-Item Level 2-4: 40px arrow cell, +20px per level. */
const sidebarItemIndentVariants = cva("flex h-4 shrink-0 items-center text-base-500", {
  variants: { level: { "2": "w-10 pl-1", "3": "w-15 pl-6", "4": "w-20 pl-11" } },
  defaultVariants: { level: "2" },
})

function SidebarItemIndent({
  className,
  level = "2",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof sidebarItemIndentVariants>) {
  return (
    <span data-slot="sidebar-item-indent" aria-hidden className={cn(sidebarItemIndentVariants({ level }), className)} {...props}>
      <SidebarIcon name="subdirectory-arrow-right" size="16" />
    </span>
  )
}

/** Figma text-only chat row (Sidebar-08 "Chats"): 12px base-600 label, active gets the pill. */
const sidebarTextItemVariants = cva(
  "block w-full truncate text-left font-default text-11 leading-20 font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      active: {
        true: "my-1 rounded-r32 bg-background-0 px-3 py-1.5 text-base-800 outline outline-background-100 -outline-offset-1",
        false: "px-4 py-2 text-base-600 hover:text-base-800",
      },
    },
    defaultVariants: { active: false },
  }
)

function SidebarTextItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarTextItemVariants>) {
  return (
    <button
      type="button"
      data-slot="sidebar-text-item"
      data-active={active || undefined}
      className={cn(sidebarTextItemVariants({ active }), className)}
      {...props}
    />
  )
}

/** Padded section of the profile sidebars (Sidebar-03/04/06): `Head` + content. */
const sidebarBlockVariants = cva("flex w-full flex-col", {
  variants: {
    gap: { "12": "gap-3", "16": "gap-4", "20": "gap-5" },
    pad: { default: "p-4", user: "px-4 pt-4 pb-5", x: "px-4", none: "p-0" },
  },
  defaultVariants: { gap: "12", pad: "default" },
})

function SidebarBlock({
  className,
  gap = "12",
  pad = "default",
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof sidebarBlockVariants>) {
  return <section data-slot="sidebar-block" className={cn(sidebarBlockVariants({ gap, pad }), className)} {...props} />
}

function SidebarBlockHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-block-head" className={cn("flex h-5 items-center justify-between gap-2", className)} {...props} />
  )
}

function SidebarBlockTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="sidebar-block-title"
      className={cn("flex items-center gap-2 text-11 leading-20 font-bold text-base-700", className)}
      {...props}
    />
  )
}

/** Figma User Block: centered avatar + name + role. */
function SidebarProfile({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-profile" className={cn("flex flex-col items-center gap-4", className)} {...props} />
}

function SidebarProfileName({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-profile-name" className={cn("text-center text-14 leading-24 font-bold text-base-900", className)} {...props} />
}

function SidebarProfileRole({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-profile-role" className={cn("text-center text-12 leading-20 font-semibold text-base-400", className)} {...props} />
}

/** Figma User-List-Component (chat row). `pilled` = 40px pill with stroke (Sidebar-07). */
const sidebarChatVariants = cva(
  "group/chat flex w-full items-center justify-between text-left font-default transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      variant: {
        plain: "gap-5 rounded-r8 px-0",
        // Figma User-List Default: 40px avatar, 11/20 name, active only darkens the text
        list: "gap-5 px-0",
        pilled: "gap-5 rounded-r32 p-1 outline outline-background-100 -outline-offset-1",
      },
      active: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: ["plain", "pilled"], active: true, className: "bg-base-alpha-5 outline outline-base-alpha-20 -outline-offset-1" },
    ],
    defaultVariants: { variant: "plain", active: false },
  }
)

function SidebarChat({
  className,
  variant = "plain",
  active = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarChatVariants>) {
  return (
    <button
      type="button"
      data-slot="sidebar-chat"
      data-variant={variant}
      data-active={active || undefined}
      className={cn(sidebarChatVariants({ variant, active }), className)}
      {...props}
    />
  )
}

function SidebarChatMain({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-main" className={cn("flex min-w-0 flex-1 items-center gap-3", className)} {...props} />
}

function SidebarChatBody({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-body" className={cn("flex min-w-0 flex-col", className)} {...props} />
}

function SidebarChatName({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-name" className={cn("truncate text-10 leading-16 font-bold text-base-700 group-data-[variant=list]/chat:text-11 group-data-[variant=list]/chat:leading-20 group-data-[active]/chat:text-base-800 group-data-[variant=list]/chat:group-data-[active]/chat:text-base-900", className)} {...props} />
}

function SidebarChatText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-text" className={cn("truncate text-10 leading-16 font-semibold text-base-500 group-data-[variant=pilled]/chat:text-9 group-data-[active]/chat:text-base-700", className)} {...props} />
}

function SidebarChatTime({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-time" className={cn("shrink-0 text-10 leading-16 font-bold text-base-500 group-data-[variant=pilled]/chat:text-9 group-data-[active]/chat:text-base-700", className)} {...props} />
}

/** Figma User-Component: Type Default (48, or the 40px footer) or Compact, State Default / Ghost / Open. */
const sidebarUserVariants = cva(
  "group/user flex items-center font-default text-left outline -outline-offset-1 focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      size: {
        "40": "h-10 w-full gap-3 rounded-r32 p-1 pr-3",
        "48": "h-12 w-full gap-3 rounded-r24 p-2",
        compact: "size-10 justify-center rounded-r24 p-1.5",
      },
      state: {
        default: "bg-background-0 outline-background-100",
        ghost: "bg-transparent outline-background-100",
        open: "bg-base-alpha-5 outline-base-alpha-20",
      },
    },
    defaultVariants: { size: "40", state: "default" },
  }
)

function SidebarUser({
  className,
  size = "40",
  state = "default",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarUserVariants>) {
  return (
    <button
      type="button"
      data-slot="sidebar-user"
      data-state={state}
      className={cn(sidebarUserVariants({ size, state }), className)}
      {...props}
    />
  )
}

function SidebarUserText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-user-text" className={cn("flex min-w-0 flex-1 flex-col text-left", className)} {...props} />
}

function SidebarUserName({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-user-name"
      className={cn("truncate text-10 leading-16 font-bold text-base-800 group-data-[state=open]/user:text-base-700", className)}
      {...props}
    />
  )
}

function SidebarUserEmail({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-user-email"
      className={cn("truncate text-9 leading-16 font-bold text-base-500 group-data-[state=open]/user:text-base-700", className)}
      {...props}
    />
  )
}

/** Figma Message-Component: two-line notice, strong then muted. */
function SidebarMessage({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-message" className={cn("flex w-full flex-col gap-2 px-3 py-2 font-default", className)} {...props} />
}

const sidebarMessageTextVariants = cva("text-11 leading-20 font-semibold", {
  variants: { tone: { strong: "text-base-600", muted: "text-base-300" } },
  defaultVariants: { tone: "strong" },
})

function SidebarMessageText({
  className,
  tone = "strong",
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof sidebarMessageTextVariants>) {
  return <p data-slot="sidebar-message-text" className={cn(sidebarMessageTextVariants({ tone }), className)} {...props} />
}

/** Figma File-Storage-Component: card with icon, title, progress line and usage text. */
function SidebarStorage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-storage"
      className={cn("flex w-full flex-col gap-4 rounded-r12 font-default bg-background-20 p-3 outline outline-background-100 -outline-offset-1", className)}
      {...props}
    />
  )
}

function SidebarStorageHead({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-storage-head" className={cn("flex items-center gap-3 text-base-500", className)} {...props} />
}

function SidebarStorageTitle({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-storage-title" className={cn("text-10 leading-16 font-bold text-base-700", className)} {...props} />
}

function SidebarStorageText({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="sidebar-storage-text" className={cn("text-10 leading-16 font-bold text-base-500", className)} {...props} />
}

/** Figma Icons-Component: pill strip of colored 24px icons. */
function SidebarIconBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-icon-bar"
      className={cn("flex w-fit items-center gap-5 rounded-r32 font-default px-4 py-2 outline outline-background-100 -outline-offset-1", className)}
      {...props}
    />
  )
}

/** Avatar cell of the rail (Sidebar-02): 48x48 with the avatar centered. */
function SidebarRail({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-rail" className={cn("flex flex-col", className)} {...props} />
}

// Figma Avatar-Item (48), Icon-Button (44) and the `-Text` forms (72, with a Name). `selected` = Select state.
const sidebarRailItemVariants = cva(
  "group/rail relative flex shrink-0 font-default items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      kind: {
        avatar: "size-12 p-2",
        button: "size-11 p-1.5",
        labeled: "size-18 flex-col gap-1 px-5 py-2.5",
      },
      selected: {
        true: "text-blue-600 *:data-[slot=avatar]:outline-2 *:data-[slot=avatar]:outline-blue-600",
        false: "text-base-500",
      },
    },
    defaultVariants: { kind: "avatar", selected: false },
  }
)

function SidebarRailItem({
  className,
  kind = "avatar",
  selected = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarRailItemVariants>) {
  return (
    <button
      type="button"
      data-slot="sidebar-rail-item"
      data-selected={selected || undefined}
      aria-current={selected ? "page" : undefined}
      className={cn(sidebarRailItemVariants({ kind, selected }), className)}
      {...props}
    />
  )
}

function SidebarRailLabel({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-rail-label" className={cn("text-10 leading-16 font-bold", className)} {...props} />
}

/** Figma Outline-Button inside a rail cell: a 32px circle (not a nested button) that holds the icon. */
function SidebarRailButton({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-rail-button"
      className={cn(
        "flex size-8 items-center justify-center rounded-full bg-linear-to-b from-background-0 to-background-20 text-base-600 outline outline-background-100 -outline-offset-1",
        className
      )}
      {...props}
    />
  )
}

/** Figma Dot: 6px selected marker on the right edge of a rail cell. */
function SidebarRailDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-rail-dot"
      aria-hidden
      className={cn("absolute top-1/2 -right-0.5 size-1.5 -translate-y-1/2 rounded-full bg-blue-600", className)}
      {...props}
    />
  )
}

/** Figma Sidebar-Commerce card: r20 box with a 1px stroke holding a menu (Content slot). */
const sidebarCardVariants = cva(
  "flex w-full flex-col rounded-r20 bg-background-0 outline outline-background-100 -outline-offset-1",
  {
    variants: { pad: { wide: "px-4 py-2", narrow: "p-2", list: "px-2 py-3", news: "px-2 pt-2 pb-4" } },
    defaultVariants: { pad: "wide" },
  }
)

function SidebarCard({
  className,
  pad = "wide",
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof sidebarCardVariants>) {
  return <section data-slot="sidebar-card" className={cn(sidebarCardVariants({ pad }), className)} {...props} />
}

/** Figma Navigate-List-Group: nested category list; `guide` draws the vertical line of the open branch. */
const sidebarTreeVariants = cva("flex w-full flex-col", {
  variants: { guide: { true: "ml-6 w-[calc(100%-1.5rem)] border-l border-background-100", false: "" } },
  defaultVariants: { guide: false },
})

function SidebarTree({
  className,
  guide = false,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof sidebarTreeVariants>) {
  return <div data-slot="sidebar-tree" role="list" className={cn(sidebarTreeVariants({ guide }), className)} {...props} />
}

/** Figma List Item Component Level 1-3: 40 high row, `active` = bold label with a 2px left bar. */
const sidebarTreeItemVariants = cva(
  "group/tree relative flex h-10 w-full items-center gap-2 pr-3 text-left font-default text-11 leading-20 font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      level: { "1": "pl-3", "2": "pl-6", "3": "pl-6" },
      active: {
        true: "text-base-800 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-base-800",
        false: "text-base-600 hover:text-base-800",
      },
    },
    defaultVariants: { level: "1", active: false },
  }
)

function SidebarTreeItem({
  className,
  level = "1",
  active = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarTreeItemVariants>) {
  return (
    <button
      type="button"
      role="listitem"
      data-slot="sidebar-tree-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(sidebarTreeItemVariants({ level, active }), className)}
      {...props}
    />
  )
}

export {
  SidebarItemLeading,
  SidebarCard,
  SidebarTree,
  SidebarTreeItem,
  Sidebar,
  SidebarActions,
  SidebarBlock,
  SidebarBlockHead,
  SidebarBlockTitle,
  SidebarBrand,
  SidebarChat,
  SidebarChatBody,
  SidebarChatMain,
  SidebarChatName,
  SidebarChatText,
  SidebarChatTime,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  SidebarItem,
  SidebarItemEnd,
  SidebarIconBar,
  SidebarItemIndent,
  SidebarItemLabel,
  SidebarItemRow,
  SidebarMessage,
  SidebarMessageText,
  SidebarStorage,
  SidebarStorageHead,
  SidebarStorageText,
  SidebarStorageTitle,
  SidebarLogo,
  SidebarMenu,
  SidebarProfile,
  SidebarProfileName,
  SidebarProfileRole,
  SidebarRail,
  SidebarRailButton,
  SidebarRailDot,
  SidebarRailItem,
  SidebarRailLabel,
  SidebarTextItem,
  SidebarTitle,
  SidebarUser,
  SidebarUserEmail,
  SidebarUserName,
  SidebarUserText,
  sidebarGroupHeadVariants,
  sidebarItemIndentVariants,
  sidebarMenuVariants,
  sidebarMessageTextVariants,
  sidebarRailItemVariants,
  sidebarUserVariants,
  sidebarBlockVariants,
  sidebarChatVariants,
  sidebarIconVariants,
  sidebarItemVariants,
  sidebarLogoVariants,
  sidebarTextItemVariants,
  sidebarVariants,
  sidebarCardVariants,
  sidebarTreeVariants,
  sidebarTreeItemVariants,
  type SidebarLayout,
}
