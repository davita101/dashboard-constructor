import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Forms: Color (12053:26144). No shadcn base: decorative swatches built in shadcn style.
// Each color variant only sets --swatch (fill) and --swatch-stroke; the slots read them.

/**
 * Figma `Color` (12053:26145): a 20px white frame with a 1px base-100 stroke and a 12px color
 * chip inside. Semantic styles use the 600 token, palette styles the 500 token.
 */
const colorSwatchColors = {
  primary: "[--swatch:var(--primary-600)]",
  warning: "[--swatch:var(--warning-600)]",
  success: "[--swatch:var(--success-600)]",
  danger: "[--swatch:var(--danger-600)]",
  info: "[--swatch:var(--info-600)]",
  orange: "[--swatch:var(--orange-600)]",
  yellow: "[--swatch:var(--yellow-500)]",
  cyan: "[--swatch:var(--cyan-500)]",
  lime: "[--swatch:var(--lime-500)]",
  emerald: "[--swatch:var(--emerald-500)]",
  rose: "[--swatch:var(--rose-500)]",
  fuchsia: "[--swatch:var(--fuchsia-500)]",
  violet: "[--swatch:var(--violet-500)]",
  indigo: "[--swatch:var(--indigo-500)]",
  blue: "[--swatch:var(--blue-500)]",
  teal: "[--swatch:var(--teal-500)]",
  amber: "[--swatch:var(--amber-500)]",
  pink: "[--swatch:var(--pink-500)]",
  sky: "[--swatch:var(--sky-500)]",
  green: "[--swatch:var(--green-500)]",
  red: "[--swatch:var(--red-500)]",
  purple: "[--swatch:var(--purple-500)]",
  white: "[--swatch:var(--white)]",
  black: "[--swatch:var(--black)]",
} as const

type ColorSwatchColor = keyof typeof colorSwatchColors

const colorSwatchVariants = cva(
  "inline-flex size-5 shrink-0 items-center justify-center bg-background-0 outline -outline-offset-1 outline-base-100",
  {
    variants: {
      color: colorSwatchColors,
      // Figma `Cornet`
      shape: {
        pill: "rounded-full",
        rounded: "rounded-r6",
      },
    },
    defaultVariants: {
      color: "primary",
      shape: "pill",
    },
  }
)

const colorSwatchChipVariants = cva("size-3 bg-(--swatch)", {
  variants: {
    shape: {
      pill: "rounded-full",
      rounded: "rounded-r4",
    },
  },
  defaultVariants: {
    shape: "pill",
  },
})

/** Decorative unless `aria-label` is given (then it is announced as an image). */
function ColorSwatch({
  className,
  color = "primary",
  shape = "pill",
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> & VariantProps<typeof colorSwatchVariants>) {
  return (
    <span
      data-slot="color-swatch"
      data-color={color}
      data-shape={shape}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(colorSwatchVariants({ color, shape }), className)}
      {...props}
    >
      <span data-slot="color-swatch-chip" className={colorSwatchChipVariants({ shape })} />
    </span>
  )
}

/**
 * Figma `Colors/Item` (4558:5182): a 24px white frame with a dot filled with the 500 token and
 * stroked with the 600 token (Primary/Blue 700, Gray 250 and Black one flat color, White base-50).
 */
const colorDotColors = {
  gray: "[--swatch:var(--base-250)] [--swatch-stroke:var(--base-250)]",
  primary: "[--swatch:var(--primary-500)] [--swatch-stroke:var(--primary-700)]",
  orange: "[--swatch:var(--orange-500)] [--swatch-stroke:var(--orange-600)]",
  purple: "[--swatch:var(--purple-500)] [--swatch-stroke:var(--purple-600)]",
  red: "[--swatch:var(--red-500)] [--swatch-stroke:var(--red-600)]",
  yellow: "[--swatch:var(--yellow-500)] [--swatch-stroke:var(--yellow-600)]",
  green: "[--swatch:var(--green-500)] [--swatch-stroke:var(--green-600)]",
  sky: "[--swatch:var(--sky-500)] [--swatch-stroke:var(--sky-600)]",
  pink: "[--swatch:var(--pink-500)] [--swatch-stroke:var(--pink-600)]",
  amber: "[--swatch:var(--amber-500)] [--swatch-stroke:var(--amber-600)]",
  teal: "[--swatch:var(--teal-500)] [--swatch-stroke:var(--teal-600)]",
  lime: "[--swatch:var(--lime-500)] [--swatch-stroke:var(--lime-600)]",
  cyan: "[--swatch:var(--cyan-500)] [--swatch-stroke:var(--cyan-600)]",
  emerald: "[--swatch:var(--emerald-500)] [--swatch-stroke:var(--emerald-600)]",
  rose: "[--swatch:var(--rose-500)] [--swatch-stroke:var(--rose-600)]",
  fuchsia: "[--swatch:var(--fuchsia-500)] [--swatch-stroke:var(--fuchsia-600)]",
  violet: "[--swatch:var(--violet-500)] [--swatch-stroke:var(--violet-600)]",
  indigo: "[--swatch:var(--indigo-500)] [--swatch-stroke:var(--indigo-600)]",
  blue: "[--swatch:var(--blue-500)] [--swatch-stroke:var(--blue-700)]",
  success: "[--swatch:var(--success-500)] [--swatch-stroke:var(--success-600)]",
  error: "[--swatch:var(--danger-500)] [--swatch-stroke:var(--danger-600)]",
  info: "[--swatch:var(--info-500)] [--swatch-stroke:var(--info-600)]",
  black: "[--swatch:var(--black)] [--swatch-stroke:var(--black)]",
  white: "[--swatch:var(--white)] [--swatch-stroke:var(--base-50)]",
} as const

type ColorDotColor = keyof typeof colorDotColors

const colorDotVariants = cva("inline-flex size-6 shrink-0 items-center justify-center bg-background-0", {
  variants: {
    color: colorDotColors,
  },
  defaultVariants: {
    color: "primary",
  },
})

// Figma Icon 10/6/4 plus a 1px stroke drawn outside, so the dot shows at 12/8/6 as in the export.
const colorDotShapeVariants = cva("bg-(--swatch) outline outline-(--swatch-stroke)", {
  variants: {
    // Figma `Corner`
    shape: {
      rounded: "rounded-full",
      rectangle: "rounded-r2",
    },
    size: {
      lg: "size-2.5",
      default: "size-1.5",
      sm: "size-1",
    },
  },
  defaultVariants: {
    shape: "rounded",
    size: "default",
  },
})

function ColorDot({
  className,
  color = "primary",
  shape = "rounded",
  size = "default",
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> &
  VariantProps<typeof colorDotVariants> &
  VariantProps<typeof colorDotShapeVariants>) {
  return (
    <span
      data-slot="color-dot"
      data-color={color}
      data-shape={shape}
      data-size={size}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(colorDotVariants({ color }), className)}
      {...props}
    >
      <span data-slot="color-dot-shape" className={colorDotShapeVariants({ shape, size })} />
    </span>
  )
}

const colorSwatchColorNames = Object.keys(colorSwatchColors) as ColorSwatchColor[]
const colorDotColorNames = Object.keys(colorDotColors) as ColorDotColor[]

export {
  ColorDot,
  ColorSwatch,
  colorDotColorNames,
  colorDotVariants,
  colorSwatchColorNames,
  colorSwatchVariants,
  type ColorDotColor,
  type ColorSwatchColor,
}
