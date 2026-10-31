import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge, type BadgeSize } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Links page (12123:27015), component set Link 12123:27019: Style x Size x State.
// shadcn has no Link (only Button variant="link"); Figma's link is a text-only element with 8
// type sizes and 9 color styles, so it is its own primitive on Base UI `useRender`
// (pass `render={<NextLink href="…" />}` to route with next/link).
// `variant` sets the colors as CSS vars: --link-fg (Default), --link-hover, --link-active
// (Active and Active 2 text), --link-pill (Active 2 background).
// `size` sets the type, the Active 2 pill padding/radius and the slot sizes.
const linkVariants = cva(
  "group/link inline-flex w-fit shrink-0 items-center gap-1 font-default tracking-default whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-primary-alpha-30 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        "900":
          "[--link-active:var(--primary-700)] [--link-fg:var(--base-900)] [--link-hover:var(--primary-500)] [--link-pill:var(--base-50)]",
        "600":
          "[--link-active:var(--primary-700)] [--link-fg:var(--base-600)] [--link-hover:var(--primary-500)] [--link-pill:var(--base-50)]",
        "700":
          "[--link-active:var(--primary-700)] [--link-fg:var(--base-700)] [--link-hover:var(--primary-500)] [--link-pill:var(--base-50)]",
        "500":
          "[--link-active:var(--primary-700)] [--link-fg:var(--base-500)] [--link-hover:var(--primary-500)] [--link-pill:var(--base-50)]",
        white:
          "[--link-active:var(--primary-700)] [--link-fg:var(--white)] [--link-hover:var(--primary-500)] [--link-pill:var(--white)]",
        "white-50":
          "[--link-active:var(--primary-700)] [--link-fg:var(--white-alpha-50)] [--link-hover:var(--primary-500)] [--link-pill:var(--white)]",
        "white-30":
          "[--link-active:var(--primary-700)] [--link-fg:var(--white-alpha-30)] [--link-hover:var(--primary-500)] [--link-pill:var(--white)]",
        danger:
          "[--link-active:var(--danger-700)] [--link-fg:var(--danger-600)] [--link-hover:var(--danger-400)] [--link-pill:var(--danger-alpha-10)]",
        primary:
          "[--link-active:var(--primary-700)] [--link-fg:var(--primary-600)] [--link-hover:var(--primary-500)] [--link-pill:var(--primary-alpha-5)]",
        blue:
          "[--link-active:var(--blue-700)] [--link-fg:var(--blue-600)] [--link-hover:var(--blue-500)] [--link-pill:var(--blue-alpha-20)]",
        success:
          "[--link-active:var(--success-700)] [--link-fg:var(--success-600)] [--link-hover:var(--success-500)] [--link-pill:var(--success-alpha-10)]",
      },
      size: {
        "24": "text-24 leading-36 font-semibold [--link-chevron:--spacing(6)] [--link-pill-px:--spacing(2)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r8)]",
        "20": "text-20 leading-28 font-semibold [--link-chevron:--spacing(6)] [--link-pill-px:--spacing(2)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r8)]",
        "16": "text-16 leading-24 font-semibold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1.5)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r4)]",
        "15": "text-15 leading-24 font-bold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1.5)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r4)]",
        "14": "text-14 leading-24 font-bold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1.5)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r4)]",
        "13": "text-13 leading-24 font-bold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1.5)] [--link-pill-py:--spacing(1)] [--link-pill-r:var(--radius-r4)]",
        "12": "text-12 leading-20 font-bold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1)] [--link-pill-py:--spacing(0.5)] [--link-pill-r:var(--radius-r4)]",
        "11": "text-11 leading-20 font-bold [--link-chevron:--spacing(4)] [--link-pill-px:--spacing(1)] [--link-pill-py:--spacing(0.5)] [--link-pill-r:var(--radius-r4)]",
      },
      // Pinned states for previews; `default` follows :hover, :active and aria-current.
      state: {
        default:
          "rounded-r20 text-(--link-fg) hover:text-(--link-hover) active:text-(--link-active) aria-[current]:text-(--link-active)",
        hover: "rounded-r20 text-(--link-hover)",
        active: "rounded-r20 text-(--link-active)",
        "active-2":
          "rounded-(--link-pill-r) bg-(--link-pill) px-(--link-pill-px) py-(--link-pill-py) text-(--link-active)",
      },
    },
    compoundVariants: [
      // Figma: Style 700 at size 11 is one shade lighter (base-600), and Danger/Primary/Succes at size 12 are Semi Bold.
      { variant: "700", size: "11", className: "[--link-fg:var(--base-600)]" },
      { variant: ["danger", "primary", "success"], size: "12", className: "font-semibold" },
    ],
    defaultVariants: {
      variant: "900",
      size: "14",
      state: "default",
    },
  }
)

type LinkVariantProps = VariantProps<typeof linkVariants>
type LinkVariant = NonNullable<LinkVariantProps["variant"]>
type LinkSize = NonNullable<LinkVariantProps["size"]>
type LinkState = NonNullable<LinkVariantProps["state"]>

function Link({
  className,
  variant = "900",
  size = "14",
  state = "default",
  render,
  ...props
}: useRender.ComponentProps<"a"> & LinkVariantProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(linkVariants({ variant, size, state }), className),
      },
      props
    ),
    render,
    state: {
      slot: "link",
      variant,
      size,
      state,
    },
  })
}

/**
 * Figma Left Icon / Right Icon (20x20 instances). `icon` is the URL of a single-color SVG,
 * painted as a mask in the link's current text color.
 */
function LinkIcon({
  className,
  icon = "/icons/material-default-icon.svg",
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { icon?: string }) {
  return (
    <span
      data-slot="link-icon"
      aria-hidden
      className={cn(
        "size-5 shrink-0 bg-current mask-(--link-icon) mask-contain mask-center mask-no-repeat",
        className
      )}
      style={{ "--link-icon": `url(${icon})`, ...style } as React.CSSProperties}
      {...props}
    />
  )
}

// Figma Badge-Square-Pilled inside the link: 24 (sizes 24, 20), 20 (16, 15), 16 (14 and smaller).
const linkBadgeSize: Record<LinkSize, BadgeSize> = {
  "24": "square-24",
  "20": "square-24",
  "16": "square-20",
  "15": "square-20",
  "14": "square-16",
  "13": "square-16",
  "12": "square-16",
  "11": "square-16",
}

/** Figma Badge-Square-Pilled: a white counter with a base-100 stroke. Pass the Link's size. */
function LinkBadge({
  size = "14",
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "size" | "variant" | "shape"> & { size?: LinkSize }) {
  return <Badge data-slot="link-badge" variant="base" shape="pill" size={linkBadgeSize[size]} {...props} />
}

/** Figma Dropdown instance: a chevron after the label, 24px at sizes 24/20 and 16px below. */
function LinkDropdown({ className, ...props }: Omit<React.ComponentProps<"span">, "children">) {
  return (
    <span
      data-slot="link-dropdown"
      aria-hidden
      className={cn(
        "size-(--link-chevron) shrink-0 bg-current mask-[url(/icons/material-expand-more.svg)] mask-contain mask-center mask-no-repeat",
        className
      )}
      {...props}
    />
  )
}

export {
  Link,
  LinkIcon,
  LinkBadge,
  LinkDropdown,
  linkVariants,
  type LinkVariant,
  type LinkSize,
  type LinkState,
}
