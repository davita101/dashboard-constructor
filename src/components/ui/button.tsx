import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Figma Button page (321:0): one component set per variant, each with
// Type (Default | Icon | Round) × Size (60…16) × Corner (Pilled | Rounded) × State.
// `size` sets --btn-px (outer padding), --btn-tx (text padding, also the icon gap) and --btn-icon;
// Icon and Round types are the square `icon-*` sizes.
// The 1px stroke is a masked ::before so it sits inside the box, like Figma strokes;
// Focused swaps it for Figma's 4px outside stroke (an outline).
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-(--btn-tx) px-[calc(var(--btn-px)+var(--btn-tx))] font-default font-bold tracking-default whitespace-nowrap transition-all outline-0 outline-solid select-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-b before:p-px before:[mask:linear-gradient(black_0_0)_content-box_exclude,linear-gradient(black_0_0)] focus-visible:outline-4 focus-visible:before:hidden data-disabled:pointer-events-none has-data-[icon=inline-end]:pe-(--btn-px) has-data-[icon=inline-start]:ps-(--btn-px) has-data-[slot=button-counter]:pe-(--btn-px) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--btn-icon) *:data-icon:size-(--btn-icon)",
  {
    variants: {
      variant: {
        // Primary-Button
        primary:
          "bg-linear-to-b from-primary-500 to-primary-550 text-primary-50 shadow-[0_1px_2px_0_var(--shadow-primary)] outline-primary-300 before:from-primary-450 before:to-primary-600 hover:from-primary-550 hover:to-primary-600 hover:before:to-primary-650 active:from-primary-600 active:to-primary-700 active:before:from-primary-500 active:before:to-primary-750 data-disabled:bg-none data-disabled:bg-primary-alpha-20 data-disabled:shadow-none data-disabled:before:hidden",
        // Primary-Soft-Button
        "primary-soft":
          "bg-linear-to-b from-primary-alpha-5 to-primary-alpha-15 text-primary-600 outline-primary-300 before:from-primary-alpha-5 before:to-primary-alpha-10 hover:from-primary-alpha-30 hover:to-primary-alpha-15 hover:shadow-[0_1px_2px_0_var(--shadow-primary)] hover:before:to-primary-alpha-20 active:from-primary-alpha-50 active:to-primary-alpha-30 active:before:to-primary-alpha-20 data-disabled:bg-none data-disabled:bg-primary-alpha-5 data-disabled:text-primary-400 data-disabled:before:from-primary-alpha-15 data-disabled:before:to-primary-alpha-15",
        // Success-Button
        success:
          "bg-linear-to-b from-success-500 to-success-550 text-success-25 shadow-[0_1px_2px_0_var(--shadow-success)] outline-success-alpha-30 before:from-success-450 before:to-success-600 hover:from-success-550 hover:to-success-600 hover:before:to-success-650 active:from-success-600 active:to-success-700 active:before:from-success-500 active:before:to-success-750 data-disabled:opacity-50",
        // Success-Soft-Button (11698:376242)
        "success-soft":
          "bg-linear-to-b from-success-alpha-5 to-success-alpha-10 text-success-650 outline-success-alpha-30 before:from-success-alpha-10 before:to-success-alpha-20 hover:from-success-alpha-15 hover:to-success-alpha-20 hover:before:from-success-alpha-20 hover:before:to-success-alpha-30 active:from-success-alpha-20 active:to-success-alpha-25 active:before:from-success-alpha-25 active:before:to-success-alpha-40 data-disabled:bg-none data-disabled:bg-success-alpha-5 data-disabled:opacity-50 data-disabled:before:from-success-alpha-15 data-disabled:before:to-success-alpha-15",
        // Warning-Button
        warning:
          "bg-linear-to-b from-warning-500 to-warning-550 text-warning-25 shadow-[0_1px_2px_0_var(--shadow-warning)] outline-warning-alpha-30 before:from-warning-400 before:to-warning-600 hover:from-warning-550 hover:to-warning-600 hover:before:from-warning-450 hover:before:to-warning-650 active:from-warning-600 active:to-warning-700 active:before:from-warning-500 active:before:to-warning-750 data-disabled:opacity-50",
        // Warning soft (Figma set named "Success-Soft-Button", 11698:377667)
        "warning-soft":
          "bg-linear-to-b from-warning-alpha-5 to-warning-alpha-10 text-warning-600 outline-warning-alpha-30 before:from-warning-alpha-10 before:to-warning-alpha-20 hover:from-warning-alpha-15 hover:to-warning-alpha-20 hover:before:from-warning-alpha-20 hover:before:to-warning-alpha-30 active:from-warning-alpha-20 active:to-warning-alpha-25 active:before:from-warning-alpha-25 active:before:to-warning-alpha-40 data-disabled:bg-none data-disabled:bg-warning-alpha-5 data-disabled:opacity-50 data-disabled:before:from-warning-alpha-15 data-disabled:before:to-warning-alpha-15",
        // Danger-Button (11188:22157)
        danger:
          "bg-linear-to-b from-danger-500 to-danger-550 text-danger-25 shadow-[0_1px_2px_0_var(--shadow-danger)] outline-danger-alpha-50 before:from-danger-400 before:to-danger-600 hover:from-danger-550 hover:to-danger-600 hover:before:from-danger-450 hover:before:to-danger-650 active:from-danger-600 active:to-danger-700 active:before:from-danger-500 active:before:to-danger-750 data-disabled:opacity-50",
        // Danger soft (Figma set named "Danger-Button", 11696:366102)
        "danger-soft":
          "bg-linear-to-b from-danger-alpha-5 to-danger-alpha-10 text-danger-600 outline-danger-alpha-30 before:from-danger-alpha-10 before:to-danger-alpha-20 hover:from-danger-alpha-15 hover:to-danger-alpha-20 hover:before:from-danger-alpha-20 hover:before:to-danger-alpha-30 active:from-danger-alpha-20 active:to-danger-alpha-25 active:before:from-danger-alpha-25 active:before:to-danger-alpha-40 data-disabled:bg-none data-disabled:bg-danger-alpha-5 data-disabled:text-danger-400 data-disabled:before:from-danger-alpha-15 data-disabled:before:to-danger-alpha-15",
        // Dark-Button
        dark: "bg-linear-to-b from-base-800 to-base-900 text-background-0 shadow-[0_1px_2px_0_var(--shadow-base)] outline-base-alpha-20 before:from-base-775 before:to-base-900 hover:to-base-600 hover:before:from-base-725 hover:before:to-base-650 active:from-base-900 active:to-base-875 active:before:from-base-875 active:before:to-base-900 data-disabled:bg-none data-disabled:bg-base-900 data-disabled:opacity-30 data-disabled:shadow-none data-disabled:before:hidden",
        // Dark-Soft-Button
        "dark-soft":
          "bg-linear-to-b from-base-alpha-5 to-base-alpha-15 text-base-800 outline-base-alpha-20 before:from-base-alpha-40 before:to-base-alpha-60 hover:from-base-alpha-10 hover:to-base-alpha-5 active:from-base-alpha-70 active:to-base-alpha-20 data-disabled:opacity-30 data-disabled:before:hidden",
        // Outline-Button
        outline:
          "bg-linear-to-b from-background-0 to-background-20 text-base-800 shadow-[0_1px_2px_0_var(--shadow-base)] outline-base-alpha-15 before:from-background-70 before:to-background-100 hover:from-background-10 hover:to-background-0 hover:before:from-background-50 hover:before:to-background-70 active:from-background-60 active:to-background-30 data-disabled:bg-none data-disabled:bg-base-alpha-5 data-disabled:text-base-200 data-disabled:shadow-none data-disabled:before:from-background-100 data-disabled:before:to-background-100",
        // Ghost-Button
        ghost:
          "text-base-700 outline-base-alpha-20 before:hidden hover:bg-background-50 active:bg-background-50 active:text-base-800 active:before:block active:before:from-background-100 active:before:to-background-100 data-disabled:text-base-200",
        // Black-Button
        black:
          "bg-black-alpha-90 text-background-0 outline-black-alpha-50 before:from-white-alpha-20 before:to-white-alpha-20 hover:bg-black-alpha-80 active:bg-black-alpha-70 data-disabled:text-white-alpha-50 data-disabled:opacity-50",
        // Black-Soft-Button
        "black-soft":
          "bg-black-alpha-20 text-background-0 outline-black-alpha-50 backdrop-blur-[15px] before:from-black-alpha-5 before:to-black-alpha-5 hover:bg-black-alpha-50 hover:before:from-black-alpha-10 hover:before:to-black-alpha-10 focus-visible:bg-black-alpha-30 active:bg-black-alpha-80 active:before:from-black-alpha-10 active:before:to-black-alpha-10 data-disabled:text-white-alpha-50 data-disabled:opacity-50 data-disabled:before:from-black-alpha-10 data-disabled:before:to-black-alpha-10",
        // White-Button
        white:
          "bg-white-alpha-90 text-black-alpha-80 outline-white-alpha-50 before:from-background-0 before:to-background-0 hover:bg-white-alpha-80 active:bg-white-alpha-70 data-disabled:opacity-50",
        // White-Soft-Button
        "white-soft":
          "bg-white-alpha-20 text-background-0 outline-white-alpha-50 backdrop-blur-[15px] before:from-white-alpha-15 before:to-white-alpha-15 hover:bg-white-alpha-30 hover:before:from-white-alpha-20 hover:before:to-white-alpha-20 active:bg-white-alpha-40 active:before:from-white-alpha-20 active:before:to-white-alpha-20 data-disabled:text-white-alpha-50 data-disabled:opacity-50 data-disabled:before:from-white-alpha-20 data-disabled:before:to-white-alpha-20",
        // Icon-only control that keeps its parent's color (e.g. alert close)
        bare: "text-current outline-current before:hidden hover:opacity-70",
        // Gray toolbar icon action (e.g. mail input formatting icons)
        muted: "text-base-500 outline-base-alpha-20 before:hidden hover:text-base-700 active:text-base-800",
        // Figma Misc Close (11956:33166) / Upload (11956:33373): gray, blue on hover, dark when pressed,
        // Active at 30% when disabled. data-force pins a state for previews.
        "icon-action":
          "text-base-500 outline-primary-300 before:hidden hover:text-primary-600 active:text-base-700 data-[force=active]:text-base-700 data-[force=hover]:text-primary-600 data-disabled:text-base-700 data-disabled:opacity-30",
      },
      size: {
        "60": "h-15 rounded-r16 text-14 leading-24 [--btn-icon:--spacing(7)] [--btn-px:--spacing(4)] [--btn-tx:--spacing(2)]",
        "48": "h-12 rounded-r12 text-13 leading-24 [--btn-icon:--spacing(6)] [--btn-px:--spacing(3)] [--btn-tx:--spacing(2)]",
        "40": "h-10 rounded-r8 text-12 leading-20 [--btn-icon:--spacing(5)] [--btn-px:--spacing(3)] [--btn-tx:--spacing(1.5)]",
        "32": "h-8 rounded-r8 text-11 leading-20 [--btn-icon:--spacing(4)] [--btn-px:--spacing(2)] [--btn-tx:--spacing(1.5)]",
        "28": "h-7 rounded-r6 text-11 leading-20 [--btn-icon:--spacing(4)] [--btn-px:--spacing(1)] [--btn-tx:--spacing(1)]",
        // Figma 28 instances with 8px padding + 4px text inset (Popover footer Back/Next, 50x28)
        "28-loose": "h-7 rounded-r6 text-11 leading-20 [--btn-icon:--spacing(4)] [--btn-px:--spacing(2)] [--btn-tx:--spacing(1)]",
        "24": "h-6 rounded-r6 text-10 leading-16 [--btn-icon:--spacing(4)] [--btn-px:--spacing(1)] [--btn-tx:--spacing(1)]",
        "20": "h-5 rounded-r6 text-10 leading-16 [--btn-icon:--spacing(4)] [--btn-px:--spacing(1)] [--btn-tx:--spacing(0.5)]",
        "16": "h-4 rounded-r4 text-9 leading-16 [--btn-icon:--spacing(3)] [--btn-px:--spacing(1)] [--btn-tx:--spacing(0.5)]",
        // Figma Type=Icon (icon) and Type=Round (a single number); both are squares
        "icon-60": "size-15 rounded-r16 text-14 leading-24 [--btn-icon:--spacing(7)]",
        "icon-48": "size-12 rounded-r12 text-13 leading-24 [--btn-icon:--spacing(6)]",
        "icon-40": "size-10 rounded-r8 text-12 leading-20 [--btn-icon:--spacing(5)]",
        "icon-32": "size-8 rounded-r8 text-11 leading-20 [--btn-icon:--spacing(4)]",
        "icon-28": "size-7 rounded-r6 text-11 leading-20 [--btn-icon:--spacing(3.5)]",
        "icon-24": "size-6 rounded-r6 text-10 leading-16 [--btn-icon:--spacing(3)]",
        "icon-20": "size-5 rounded-r6 text-10 leading-16 [--btn-icon:--spacing(4)]",
        "icon-16": "size-4 rounded-r4 text-9 leading-16 [--btn-icon:--spacing(3)]",
        // Icon fills the whole 20px box (Figma 20x20 toolbar icons)
        "glyph-20": "size-5 rounded-r6 p-0 [--btn-icon:--spacing(5)] [--btn-px:0px] [--btn-tx:0px]",
      },
      shape: {
        pill: "rounded-r32",
        rounded: "",
      },
    },
    compoundVariants: [
      { size: ["icon-60", "icon-48", "icon-40", "icon-32", "icon-28", "icon-24", "icon-20", "icon-16"], className: "p-0 [--btn-px:0px] [--btn-tx:0px]" },
      // Pilled buttons get more padding than Rounded ones
      { shape: "pill", size: "60", className: "[--btn-px:--spacing(6)] [--btn-tx:--spacing(3)]" },
      { shape: "pill", size: "48", className: "[--btn-px:--spacing(5)]" },
      { shape: "pill", size: "40", className: "[--btn-px:--spacing(4)]" },
      { shape: "pill", size: "32", className: "[--btn-px:--spacing(3)]" },
      { shape: "pill", size: ["28", "24"], className: "[--btn-px:--spacing(2)]" },
      { shape: "pill", size: ["20", "16"], className: "[--btn-tx:--spacing(1)]" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "40",
      shape: "pill",
    },
  }
)

type ButtonVariantProps = VariantProps<typeof buttonVariants>
type ButtonSize = NonNullable<ButtonVariantProps["size"]>
type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>

function Button({
  className,
  variant = "primary",
  size = "40",
  shape = "pill",
  ...props
}: ButtonPrimitive.Props & ButtonVariantProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-size={size}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

/**
 * Figma Left Icon / Right Icon / Dropdown: a single-color SVG drawn as a mask in the text color,
 * sized by the button.
 */
function ButtonIcon({
  src,
  position = "start",
  className,
  style,
  ...props
}: React.ComponentProps<"span"> & { src: string; position?: "start" | "end" }) {
  return (
    <span
      data-slot="button-icon"
      data-icon={`inline-${position}`}
      aria-hidden
      className={cn("shrink-0 bg-current mask-contain mask-center mask-no-repeat", className)}
      style={{ maskImage: `url(${src})`, ...style }}
      {...props}
    />
  )
}

/** Figma Counter: a Badge-Square-Pilled after the label. Pick the badge size and style per button. */
function ButtonCounter({
  className,
  size = "square-24",
  variant = "white-soft",
  ...props
}: React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      data-slot="button-counter"
      size={size}
      variant={variant}
      shape="pill"
      className={cn("mx-0.5", className)}
      {...props}
    />
  )
}

export { Button, ButtonIcon, ButtonCounter, buttonVariants, type ButtonSize, type ButtonVariant }
