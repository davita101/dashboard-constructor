import * as React from "react"
import Image from "next/image"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge, type BadgeColor } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput, InputGroupJoin, InputGroupKbd } from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import { Link, LinkBadge, LinkDropdown, LinkIcon } from "@/components/ui/link"
import { cn } from "@/lib/utils"

// Figma Navigate-01 (12455:7402) and Navigate-02 (13563:26043): top bars.
// `bar` is the 64 high Navigate-01 frame (16px padding, bottom stroke); `plain` is the
// bare 32 high Navigate-02 row.
const navbarVariants = cva("flex w-full items-center justify-between bg-background-0", {
  variants: {
    variant: {
      bar: "min-h-16 gap-3 border-b border-background-100 p-4",
      plain: "gap-3",
      // Figma Navigate-Commerce (6825:30921): 72 high, padding 20, bottom stroke
      commerce: "h-18 gap-5 border-b border-background-100 p-5",
    },
  },
  defaultVariants: { variant: "bar" },
})

function Navbar({
  className,
  variant,
  ...props
}: React.ComponentProps<"nav"> & VariantProps<typeof navbarVariants>) {
  return <nav data-slot="navbar" className={cn(navbarVariants({ variant }), className)} {...props} />
}

/** Left group: sidebar toggle, logo, title (gap 12). */
function NavbarHeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-heading" className={cn("flex items-center gap-3", className)} {...props} />
}

/** Figma `Default` 32x32: dark gradient disc with a white icon. */
function NavbarLogo({ icon = "/icons/material-default-icon.svg", className, ...props }: React.ComponentProps<"span"> & { icon?: string }) {
  return (
    <span data-slot="navbar-logo" className={cn("flex size-8 shrink-0 items-center justify-center", className)} {...props}>
      <span className="flex size-[26.7px] items-center justify-center rounded-full bg-linear-to-b from-base-900 to-base-700">
        <span
          aria-hidden
          className="size-[10.7px] bg-background-0 mask-contain mask-center mask-no-repeat"
          style={{ maskImage: `url(${icon})` }}
        />
      </span>
    </span>
  )
}

/** Bold 700 13/24. */
function NavbarTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navbar-title"
      className={cn("font-default text-13 leading-24 font-bold tracking-default whitespace-nowrap text-base-800", className)}
      {...props}
    />
  )
}

/** Center link list (gap 12). */
function NavbarMenu({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-menu" className={cn("flex items-center gap-3", className)} {...props} />
}

/** Menu link: Link 11/20 with optional left icon, badge and dropdown caret. */
function NavbarMenuLink({
  icon,
  badge,
  dropdown,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { icon?: string; badge?: React.ReactNode; dropdown?: boolean }) {
  return (
    <Link variant="600" size="11" {...props}>
      {icon && <LinkIcon icon={icon} />}
      {children}
      {badge && <LinkBadge>{badge}</LinkBadge>}
      {dropdown && <LinkDropdown />}
    </Link>
  )
}

/** Right group of buttons (gap 8). */
function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-actions" className={cn("flex items-center gap-2", className)} {...props} />
}

/** Round 32 icon button: Outline-Button, Upgrade Icon Button (`dark`) or Close/Search button. */
function NavbarIconButton({
  icon,
  label,
  variant = "outline",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "shape" | "children"> & { icon: string; label: string }) {
  return (
    <Button variant={variant} size="icon-32" shape="pill" aria-label={label} {...props}>
      <ButtonIcon src={icon} className="size-4" />
    </Button>
  )
}

/** Figma Navigate-Commerce Search: bare 24px search icon with an optional "Search" label (icon only below desktop). */
function NavbarSearchLabel({ children = "Search", className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="navbar-search-label" className={cn("flex items-center gap-3 text-base-500", className)} {...props}>
      <span
        aria-hidden
        className="size-6 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
        style={{ maskImage: "url(/icons/material-search.svg)" }}
      />
      {children ? <span className="text-11 leading-20 font-semibold">{children}</span> : null}
    </div>
  )
}

/** Figma Search: 32 high pill input with search icon and command keys. */
function NavbarSearch({ className, placeholder = "Search ...", ...props }: React.ComponentProps<typeof InputGroupInput>) {
  return (
    <InputGroupJoin size="32" shape="pill" className={cn("w-full max-w-60", className)}>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupIcon src="/icons/material-search.svg" />
        </InputGroupAddon>
        <InputGroupInput placeholder={placeholder} aria-label={placeholder} {...props} />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <InputGroupKbd size="16">⌘</InputGroupKbd>
            <InputGroupKbd size="16">K</InputGroupKbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </InputGroupJoin>
  )
}

// Figma Navbar Menu page (12466:577): Item-Menu-Component (Type x State), the six *-Group sets and
// the Menu-01/02/03 mega-menu panels (Desktop 1056, Tablet 696, Mobile 320).
// CSS vars set per state: --mi-fg title, --mi-sub description, --mi-icon leading icon,
// --mi-ring card stroke, --mi-link footer link.
const navbarMenuItemVariants = cva(
  "group/item flex font-default tracking-default transition-colors focus-visible:ring-3 focus-visible:ring-primary-alpha-30",
  {
    variants: {
      type: {
        default: "items-center gap-4",
        "image-top": "w-40 flex-col gap-2",
        "image-left": "w-50 gap-4",
        video: "w-37.5 flex-col gap-3",
        card: "w-49 flex-col gap-4 rounded-r12 p-3 outline -outline-offset-1 outline-(color:--mi-ring)",
      },
      // Pinned states for previews; `default` follows :hover and aria-current.
      state: {
        default:
          "[--mi-fg:var(--base-700)] [--mi-icon:var(--base-500)] [--mi-link:var(--blue-600)] [--mi-ring:var(--background-100)] [--mi-sub:var(--base-500)] hover:[--mi-fg:var(--blue-600)] hover:[--mi-icon:var(--blue-600)] hover:[--mi-ring:var(--blue-600)] hover:[--mi-sub:var(--blue-600)] aria-[current]:[--mi-fg:var(--blue-800)] aria-[current]:[--mi-icon:var(--blue-800)] aria-[current]:[--mi-link:var(--blue-800)] aria-[current]:[--mi-ring:var(--blue-800)] aria-[current]:[--mi-sub:var(--blue-800)]",
        hover:
          "[--mi-fg:var(--blue-600)] [--mi-icon:var(--blue-600)] [--mi-link:var(--blue-600)] [--mi-ring:var(--blue-600)] [--mi-sub:var(--blue-600)]",
        active:
          "[--mi-fg:var(--blue-800)] [--mi-icon:var(--blue-800)] [--mi-link:var(--blue-800)] [--mi-ring:var(--blue-800)] [--mi-sub:var(--blue-800)]",
      },
    },
    defaultVariants: { type: "default", state: "default" },
  }
)

/** Figma Item-Menu-Component. Renders `<a>`, or `<div>` for `card` (it holds a button). */
function NavbarMenuItem({
  className,
  type = "default",
  state = "default",
  render,
  ...props
}: useRender.ComponentProps<"a"> & VariantProps<typeof navbarMenuItemVariants>) {
  return useRender({
    defaultTagName: type === "card" ? "div" : "a",
    props: mergeProps<"a">(
      { className: cn(navbarMenuItemVariants({ type, state }), className), "data-type": type } as React.ComponentProps<"a">,
      props
    ),
    render,
    state: { slot: "navbar-menu-item", type, state },
  })
}

/** Figma Icon 20x20 in the item color (base-500, blue on hover/active). */
function NavbarMenuItemIcon({ icon, className, style, ...props }: Omit<React.ComponentProps<"span">, "children"> & { icon: string }) {
  return (
    <span
      data-slot="navbar-menu-item-icon"
      aria-hidden
      className={cn("size-5 shrink-0 bg-(--mi-icon) mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${icon})`, ...style }}
      {...props}
    />
  )
}

/** Figma Badge-Icon-Pilled 40x40: a white circle (`base`) or a tinted one (`color`) with a 20 icon. */
function NavbarMenuItemBadge({
  icon,
  color,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "children" | "color" | "variant" | "size" | "shape"> & { icon: string; color?: BadgeColor }) {
  return (
    <Badge
      data-slot="navbar-menu-item-badge"
      variant={color ? "soft-border" : "base"}
      color={color}
      size="square-40"
      shape="pill"
      {...props}
    >
      <span
        aria-hidden
        className={cn("size-5 bg-current mask-contain mask-center mask-no-repeat", !color && "text-base-500")}
        style={{ maskImage: `url(${icon})` }}
      />
    </Badge>
  )
}

/** Text column: heading row + description (gap 4). */
function NavbarMenuItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-menu-item-content" className={cn("flex min-w-0 flex-col gap-1", className)} {...props} />
}

/** Figma Heading row: title + optional tag badge (gap 8). */
function NavbarMenuItemHeading({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-menu-item-heading" className={cn("flex items-center gap-2", className)} {...props} />
}

/** Heading Item: 12/20 600 (11/20 on Image Top). */
function NavbarMenuItemTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navbar-menu-item-title"
      className={cn(
        "text-12 leading-20 font-semibold whitespace-nowrap text-(--mi-fg) group-data-[type=image-top]/item:text-11",
        className
      )}
      {...props}
    />
  )
}

/** Descriptions: 10/16 600. */
function NavbarMenuItemDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navbar-menu-item-description"
      className={cn("text-10 leading-16 font-semibold text-(--mi-sub)", className)}
      {...props}
    />
  )
}

/** Figma Badge-Default-Pilled 16 in blue, next to the heading. */
function NavbarMenuItemTag(props: Omit<React.ComponentProps<typeof Badge>, "variant" | "color" | "size" | "shape">) {
  return <Badge data-slot="navbar-menu-item-tag" variant="soft-border" color="blue" size="16" shape="pill" {...props} />
}

/** Figma Image r8: full width x 100 on Image Top and Video, 80x80 on Image Left. */
function NavbarMenuItemImage({
  className,
  src,
  alt = "",
  ...props
}: Omit<React.ComponentProps<typeof Image>, "fill" | "width" | "height" | "alt"> & { alt?: string }) {
  return (
    <span
      data-slot="navbar-menu-item-image"
      className={cn(
        "relative block h-25 w-full shrink-0 overflow-hidden rounded-r8 bg-base-100 group-data-[type=image-left]/item:size-20",
        className
      )}
    >
      <Image src={src} alt={alt} fill sizes="200px" className="object-cover" {...props} />
    </span>
  )
}

/** Figma Black-Button 32x32: black-alpha-90 disc, white-alpha-20 stroke, play icon. */
function NavbarMenuItemPlay({ className, ...props }: Omit<React.ComponentProps<"span">, "children">) {
  return (
    <span
      data-slot="navbar-menu-item-play"
      aria-hidden
      className={cn(
        "absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black-alpha-90 outline -outline-offset-1 outline-white-alpha-20",
        className
      )}
      {...props}
    >
      <span className="size-4 bg-background-0 mask-[url(/icons/material-play-arrow.svg)] mask-contain mask-center mask-no-repeat" />
    </span>
  )
}

/** Figma Video frame: the image with the play button centered on top. */
function NavbarMenuItemVideo({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="navbar-menu-item-video" className={cn("relative block h-25 w-full shrink-0", className)} {...props}>
      {children}
      <NavbarMenuItemPlay />
    </span>
  )
}

/** Figma Footer: "Learn More" + chevron (gap 4), or play icon + "Watch Video" (`iconPosition="start"`, gap 8). */
function NavbarMenuItemFooter({
  icon = "/icons/material-chevron-right.svg",
  iconPosition = "end",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { icon?: string; iconPosition?: "start" | "end" }) {
  const glyph = (
    <span
      aria-hidden
      className="size-4 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
      style={{ maskImage: `url(${icon})` }}
    />
  )
  return (
    <span
      data-slot="navbar-menu-item-footer"
      className={cn(
        "flex items-center text-10 leading-16 font-semibold text-(--mi-link)",
        iconPosition === "start" ? "gap-2" : "gap-1",
        className
      )}
      {...props}
    >
      {iconPosition === "start" && glyph}
      {children}
      {iconPosition === "end" && glyph}
    </span>
  )
}

/** Card head: leading icon left, action button right. */
function NavbarMenuItemHead({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="navbar-menu-item-head" className={cn("flex items-center justify-between", className)} {...props} />
}

const navbarMenuGroupVariants = cva("flex flex-col bg-background-0 p-3", {
  variants: {
    layout: {
      list: "w-50 gap-5",
      grid: "w-150 gap-5",
      cards: "w-50 gap-4",
      "cards-grid": "w-150 gap-4",
      "image-left": "w-58 gap-5",
    },
  },
  defaultVariants: { layout: "list" },
})

const navbarMenuGroupContentVariants = cva("", {
  variants: {
    layout: {
      list: "flex flex-col gap-5",
      grid: "grid grid-cols-3 gap-6",
      cards: "flex flex-col gap-2",
      "cards-grid": "grid grid-cols-3 gap-2",
      "image-left": "flex flex-col gap-5",
    },
  },
  defaultVariants: { layout: "list" },
})

/** Figma Menu-*-Group: uppercase label + slot of items. `layout` sets width and item arrangement. */
function NavbarMenuGroup({
  label,
  layout = "list",
  className,
  contentClassName,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof navbarMenuGroupVariants> & { label: string; contentClassName?: string; children: React.ReactNode }) {
  return (
    <div data-slot="navbar-menu-group" className={cn(navbarMenuGroupVariants({ layout }), className)} {...props}>
      <span data-slot="navbar-menu-group-label" className="text-11 leading-20 font-semibold text-base-500">
        {label}
      </span>
      <div data-slot="navbar-menu-group-content" className={cn(navbarMenuGroupContentVariants({ layout }), contentClassName)}>
        {children}
      </div>
    </div>
  )
}

const navbarMenuPanelVariants = cva(
  "flex flex-col overflow-hidden rounded-r16 bg-background-0 shadow-[0_16px_32px_0_var(--shadow-base)] outline -outline-offset-1 outline-background-100",
  {
    variants: {
      size: { desktop: "w-264", tablet: "w-174", mobile: "w-80" },
    },
    defaultVariants: { size: "desktop" },
  }
)

/** Figma Menu-01/02/03: the mega-menu panel (r16, 1px background-100 stroke). */
function NavbarMenuPanel({ className, size, ...props }: React.ComponentProps<"div"> & VariantProps<typeof navbarMenuPanelVariants>) {
  return <div data-slot="navbar-menu-panel" className={cn(navbarMenuPanelVariants({ size }), className)} {...props} />
}

/** Panel body: 16 padding, groups side by side (gap 12); `direction="col"` on Tablet/Mobile. */
function NavbarMenuPanelContent({
  direction = "row",
  className,
  ...props
}: React.ComponentProps<"div"> & { direction?: "row" | "col" }) {
  return (
    <div
      data-slot="navbar-menu-panel-content"
      className={cn("flex gap-3 p-4", direction === "col" && "flex-col", className)}
      {...props}
    />
  )
}

/** Panel footer: background-20 strip with a top stroke and the footer links (gap 24). */
function NavbarMenuPanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navbar-menu-panel-footer"
      className={cn("flex flex-wrap items-center gap-6 border-t border-background-100 bg-background-20 px-6 py-5", className)}
      {...props}
    />
  )
}

/** Figma Navigate-Commerce Counter: Badge-Square-Pilled 16 (background-0, stroke background-100) after a button label. */
function NavbarCounter({ className, children = "1", ...props }: Omit<React.ComponentProps<typeof Badge>, "size" | "variant" | "shape">) {
  return (
    <Badge data-slot="navbar-counter" size="square-16" variant="base" shape="pill" className={cn("mx-0.5", className)} {...props}>
      {children}
    </Badge>
  )
}

export {
  Navbar,
  NavbarCounter,
  NavbarHeading,
  NavbarLogo,
  NavbarTitle,
  NavbarMenu,
  NavbarMenuLink,
  NavbarActions,
  NavbarIconButton,
  NavbarSearch,
  NavbarSearchLabel,
  navbarVariants,
  NavbarMenuItem,
  NavbarMenuItemIcon,
  NavbarMenuItemBadge,
  NavbarMenuItemContent,
  NavbarMenuItemHeading,
  NavbarMenuItemTitle,
  NavbarMenuItemDescription,
  NavbarMenuItemTag,
  NavbarMenuItemImage,
  NavbarMenuItemVideo,
  NavbarMenuItemPlay,
  NavbarMenuItemFooter,
  NavbarMenuItemHead,
  NavbarMenuGroup,
  NavbarMenuPanel,
  NavbarMenuPanelContent,
  NavbarMenuPanelFooter,
  navbarMenuItemVariants,
  navbarMenuGroupVariants,
  navbarMenuPanelVariants,
}
