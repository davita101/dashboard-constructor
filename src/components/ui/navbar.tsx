import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

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

export {
  Navbar,
  NavbarHeading,
  NavbarLogo,
  NavbarTitle,
  NavbarMenu,
  NavbarMenuLink,
  NavbarActions,
  NavbarIconButton,
  NavbarSearch,
  navbarVariants,
}
