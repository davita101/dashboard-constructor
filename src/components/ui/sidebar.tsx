import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

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
    <span data-slot="sidebar-title" className={cn("text-13 leading-24 font-bold text-base-800", className)} {...props} />
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

function SidebarGroupHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-head"
      className={cn("flex h-11 items-center justify-between py-3 pr-4 pl-3 text-base-500", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="sidebar-group-label" className={cn("text-12 leading-20 font-bold text-base-800", className)} {...props} />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-menu" role="list" className={cn("flex w-full flex-col", className)} {...props} />
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
        true: "size-10 shrink-0 justify-center rounded-r32 p-2.5",
        false: "my-1 mr-1 h-8 w-[calc(100%-4px)] gap-2 rounded-r32 px-3 py-1.5",
      },
    },
    defaultVariants: { active: false, collapsed: false },
  }
)

function SidebarItem({
  className,
  active = false,
  collapsed = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof sidebarItemVariants>) {
  return (
    <button
      type="button"
      role="listitem"
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(sidebarItemVariants({ active, collapsed }), className)}
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

/** Right side of an item: counter badge, chevron. */
function SidebarItemEnd({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-item-end" className={cn("flex shrink-0 items-center gap-1 text-base-500", className)} {...props} />
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
  "flex w-full items-center justify-between text-left font-default transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
  {
    variants: {
      variant: {
        plain: "gap-5 rounded-r8 px-0",
        pilled: "gap-5 rounded-r32 p-1 outline outline-background-100 -outline-offset-1",
      },
      active: {
        true: "bg-base-alpha-5 outline outline-base-alpha-20 -outline-offset-1",
        false: "",
      },
    },
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
  return <span data-slot="sidebar-chat-name" className={cn("truncate text-10 leading-16 font-bold text-base-700", className)} {...props} />
}

function SidebarChatText({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-text" className={cn("truncate text-10 leading-16 font-semibold text-base-500", className)} {...props} />
}

function SidebarChatTime({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="sidebar-chat-time" className={cn("shrink-0 text-10 leading-16 font-bold text-base-500", className)} {...props} />
}

/** Figma User-Component: pill footer with avatar, name, plan and a chevron. */
function SidebarUser({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="sidebar-user"
      className={cn(
        "flex h-10 w-full items-center gap-3 rounded-r32 bg-background-0 p-1 pr-3 text-left outline outline-background-100 -outline-offset-1 focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
      {...props}
    />
  )
}

/** Avatar cell of the rail (Sidebar-02): 48x48 with the avatar centered. */
function SidebarRail({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-rail" className={cn("flex flex-col", className)} {...props} />
}

function SidebarRailItem({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="sidebar-rail-item"
      className={cn("relative flex size-12 shrink-0 items-center justify-center p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary-500", className)}
      {...props}
    />
  )
}

export {
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
  SidebarItemLabel,
  SidebarItemRow,
  SidebarLogo,
  SidebarMenu,
  SidebarProfile,
  SidebarProfileName,
  SidebarProfileRole,
  SidebarRail,
  SidebarRailItem,
  SidebarTextItem,
  SidebarTitle,
  SidebarUser,
  sidebarBlockVariants,
  sidebarChatVariants,
  sidebarIconVariants,
  sidebarItemVariants,
  sidebarLogoVariants,
  sidebarTextItemVariants,
  sidebarVariants,
  type SidebarLayout,
}
