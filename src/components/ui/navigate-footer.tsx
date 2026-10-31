import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Navigate Footer (6921:244527): Type=Desktop 1026, Tablet 768, Mobile 360.
// Desktop/Tablet: one row (copyright, social, language, actions). Mobile: three stacked rows.

const navigateFooterVariants = cva("group/footer flex w-full font-default tracking-default text-base-700", {
  variants: {
    size: {
      desktop: "flex-col px-0 py-4 outline outline-background-100 -outline-offset-1 [--footer-px:--spacing(8)]",
      tablet: "flex-col py-4 outline outline-background-100 -outline-offset-1 [--footer-px:--spacing(9)]",
      mobile: "flex-col outline outline-background-100 -outline-offset-1",
    },
  },
  defaultVariants: { size: "desktop" },
})

type NavigateFooterSize = NonNullable<VariantProps<typeof navigateFooterVariants>["size"]>

/** Figma Footer root. `size` = Figma Type. */
function NavigateFooter({
  className,
  size = "desktop",
  ...props
}: React.ComponentProps<"footer"> & { size?: NavigateFooterSize }) {
  return (
    <footer
      data-slot="navigate-footer"
      data-size={size}
      className={cn(navigateFooterVariants({ size }), className)}
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

export {
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
