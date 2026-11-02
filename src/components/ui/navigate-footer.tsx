import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Navigate Footer (6921:244527): Type=Desktop 1026, Tablet 768, Mobile 360.
// Desktop/Tablet: one row (copyright, social, language, actions). Mobile: three stacked rows.

const navigateFooterVariants = cva("group/footer flex w-full font-default tracking-default text-base-700", {
  variants: {
    variant: { default: "", commerce: "" },
    size: {
      desktop: "flex-col px-0 py-4 outline outline-background-100 -outline-offset-1 [--footer-px:--spacing(8)]",
      tablet: "flex-col py-4 outline outline-background-100 -outline-offset-1 [--footer-px:--spacing(9)]",
      mobile: "flex-col outline outline-background-100 -outline-offset-1",
    },
  },
  compoundVariants: [
    // Figma Footer-Commerce (6831:13132): Desktop 1068 (p 40, gap 60), Tablet 768 (p 40, gap 40), Mobile 320 (p 20, gap 20)
    { variant: "commerce", size: "desktop", className: "gap-15 p-10" },
    { variant: "commerce", size: "tablet", className: "gap-10 p-10" },
    { variant: "commerce", size: "mobile", className: "gap-5 p-5" },
  ],
  defaultVariants: { size: "desktop", variant: "default" },
})

type NavigateFooterSize = NonNullable<VariantProps<typeof navigateFooterVariants>["size"]>

/** Figma Footer root. `size` = Figma Type. */
function NavigateFooter({
  className,
  size = "desktop",
  variant = "default",
  ...props
}: React.ComponentProps<"footer"> & { size?: NavigateFooterSize; variant?: "default" | "commerce" }) {
  return (
    <footer
      data-slot="navigate-footer"
      data-size={size}
      className={cn(navigateFooterVariants({ size, variant }), className)}
      {...props}
    />
  )
}

/** Figma "Content" row (Desktop/Tablet) or one stacked "Group" row (Mobile). */
function NavigateFooterContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigate-footer-content"
      className={cn(
        "flex items-center justify-between px-(--footer-px,0px) group-data-[size=mobile]/footer:flex-col group-data-[size=mobile]/footer:justify-center group-data-[size=mobile]/footer:gap-5 group-data-[size=mobile]/footer:px-0 group-data-[size=mobile]/footer:py-5",
        className
      )}
      {...props}
    />
  )
}

/** Mobile row with a bottom/top stroke (Figma Group with stroke background-100). */
function NavigateFooterRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigate-footer-row"
      className={cn(
        "flex items-center justify-center gap-5 py-5 outline outline-background-100 -outline-offset-1 first:outline-0",
        className
      )}
      {...props}
    />
  )
}

/** Figma "© 2078 Global Inc." text. */
function NavigateFooterCopyright({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="navigate-footer-copyright"
      className={cn("text-11 leading-20 font-bold text-base-700", className)}
      {...props}
    />
  )
}

/** Figma "Social" slot / action Group: row of 32px outline icon buttons. */
function NavigateFooterGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="navigate-footer-group" className={cn("flex items-center gap-2", className)} {...props} />
  )
}

/** Figma Outline-Button 32x32 round with a 16px icon. */
function NavigateFooterIconButton({
  icon,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & { icon: string; "aria-label": string }) {
  return (
    <Button
      data-slot="navigate-footer-icon-button"
      variant="outline"
      size="icon-32"
      shape="pill"
      className={className}
      {...props}
    >
      <ButtonIcon src={icon} className="size-4 text-base-600" />
    </Button>
  )
}

/** Figma 148x32 language Outline-Button: label plus dropdown chevron. */
function NavigateFooterLanguage({
  className,
  children = "English Language",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "shape">) {
  return (
    <Button
      data-slot="navigate-footer-language"
      variant="outline"
      size="32"
      shape="pill"
      className={cn(className)}
      {...props}
    >
      {children}
      <ButtonIcon src="/icons/material-expand-more.svg" position="end" className="size-4 text-base-500" />
    </Button>
  )
}

/** Footer-Commerce row (Head / Content / Footer): desktop and tablet in a row, mobile stacked. */
function NavigateFooterSection({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigate-footer-section"
      className={cn(
        "flex items-start justify-between gap-14 group-data-[size=tablet]/footer:gap-7 group-data-[size=mobile]/footer:flex-col group-data-[size=mobile]/footer:gap-5",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Constructor X" brand text, 16/24 bold. */
function NavigateFooterBrand({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="navigate-footer-brand"
      className={cn("text-16 leading-24 font-bold whitespace-nowrap text-base-800", className)}
      {...props}
    />
  )
}

/** Figma Menu slot: 240 wide, links wrap in two columns. */
function NavigateFooterMenu({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="navigate-footer-menu" className={cn("grid w-60 grid-cols-2 gap-x-3", className)} {...props} />
}

/** Figma menu / legal link: 11/20 bold base-600. */
function NavigateFooterLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      data-slot="navigate-footer-link"
      className={cn("text-11 leading-20 font-bold whitespace-nowrap text-base-600 hover:text-base-800", className)}
      {...props}
    />
  )
}

/** Figma Footer row item (city, legal text, email): optional icon + 11/20 label. */
function NavigateFooterMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigate-footer-meta"
      className={cn("flex items-center gap-3 text-11 leading-20 font-bold whitespace-nowrap text-base-600", className)}
      {...props}
    />
  )
}

/** Masked Material icon (20px; pass a size class for the 24px arrows). */
function NavigateFooterIcon({
  icon,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { icon: string }) {
  return (
    <span
      data-slot="navigate-footer-icon"
      aria-hidden
      className={cn("size-5 shrink-0 bg-base-500 mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${icon})`, ...style }}
      {...props}
    />
  )
}

export {
  NavigateFooterSection,
  NavigateFooterBrand,
  NavigateFooterMenu,
  NavigateFooterLink,
  NavigateFooterMeta,
  NavigateFooterIcon,
  NavigateFooter,
  NavigateFooterContent,
  NavigateFooterRow,
  NavigateFooterCopyright,
  NavigateFooterGroup,
  NavigateFooterIconButton,
  NavigateFooterLanguage,
  navigateFooterVariants,
}
export type { NavigateFooterSize }
