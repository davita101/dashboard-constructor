import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Command-Key (9478:1528): Type × Corner × Size. Content is just children
// (Unicode glyphs are text in Figma, not icons; see `kbdKeys`).
const kbdVariants = cva(
  "pointer-events-none inline-flex w-fit shrink-0 items-center justify-center gap-1 font-default font-bold whitespace-nowrap select-none [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "bg-linear-to-b from-background-0 to-background-20 text-base-800 outline -outline-offset-1 outline-base-100",
        black: "bg-black-alpha-90 text-white",
        white: "bg-white-alpha-90 text-black",
      },
      shape: {
        rounded: "",
        pill: "rounded-full",
      },
      size: {
        "32": "h-8 text-12 leading-20",
        "24": "h-6 text-11 leading-20",
        "20": "h-5 text-9 leading-16",
        "16": "h-4 text-9 leading-16",
      },
      /** Single-glyph key (⌘ ⇧ ⌥ ⌃ ↵ arrows, one letter): square when Pilled. */
      glyph: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "32", className: "rounded-r8 px-2" },
      { shape: "rounded", size: "24", className: "rounded-r6 px-1.5" },
      { shape: "rounded", size: "20", className: "rounded-r6 px-1.5" },
      { shape: "rounded", size: "16", className: "rounded-r4 px-1" },
      { shape: "pill", glyph: false, size: "32", className: "px-3" },
      { shape: "pill", glyph: false, size: "24", className: "px-2" },
      { shape: "pill", glyph: false, size: "20", className: "px-2" },
      { shape: "pill", glyph: false, size: "16", className: "px-1.5" },
      { shape: "pill", glyph: true, size: "32", className: "size-8" },
      { shape: "pill", glyph: true, size: "24", className: "size-6" },
      { shape: "pill", glyph: true, size: "20", className: "size-5" },
      { shape: "pill", glyph: true, size: "16", className: "size-4" },
    ],
    defaultVariants: {
      variant: "default",
      shape: "rounded",
      size: "20",
      glyph: false,
    },
  }
)

// Figma Command-Keys-Group "+" between keys.
const kbdSeparatorVariants = cva("pointer-events-none shrink-0 font-default font-bold select-none", {
  variants: {
    variant: {
      default: "text-base-900",
      black: "text-white",
      white: "text-black",
    },
    size: {
      "32": "text-12 leading-20",
      "24": "text-12 leading-20",
      "20": "text-12 leading-20",
      "16": "text-9 leading-16",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "20",
  },
})

const kbdGroupVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      "32": "gap-1",
      "24": "gap-1",
      "20": "gap-1",
      "16": "gap-0.5",
    },
  },
  defaultVariants: {
    size: "20",
  },
})

/** Figma Content glyphs (Unicode text, no icons). */
const kbdKeys = {
  cmd: "⌘",
  shift: "⇧",
  alt: "⌥",
  ctrl: "⌃",
  enter: "↵",
  left: "←",
  up: "↑",
  right: "→",
  down: "↓",
} as const

type KbdVariant = NonNullable<VariantProps<typeof kbdVariants>["variant"]>
type KbdShape = NonNullable<VariantProps<typeof kbdVariants>["shape"]>
type KbdSize = NonNullable<VariantProps<typeof kbdVariants>["size"]>

type KbdGroupDefaults = { variant?: KbdVariant; shape?: KbdShape; size?: KbdSize }

function Kbd({
  className,
  variant,
  shape,
  size,
  glyph,
  ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ variant, shape, size, glyph }), className)} {...props} />
}

function KbdSeparator({
  className,
  variant,
  size,
  children = "+",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof kbdSeparatorVariants>) {
  return (
    <span
      data-slot="kbd-separator"
      aria-hidden
      className={cn(kbdSeparatorVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * Figma Command-Keys-Group (9499:1023). `size` / `variant` / `shape` are passed to direct Kbd and
 * KbdSeparator children that don't set their own; `separator` inserts a "+" between keys
 * (opt-in, off by default so the Input slot stays as is). No context, so it works in server components.
 */
function KbdGroup({
  className,
  size,
  variant,
  shape,
  separator = false,
  children,
  ...props
}: React.ComponentProps<"kbd"> & KbdGroupDefaults & { separator?: boolean }) {
  const defaults: KbdGroupDefaults = { size, variant, shape }
  const withDefaults = (child: React.ReactNode) => {
    if (!React.isValidElement<KbdGroupDefaults>(child)) return child
    if (child.type !== Kbd && child.type !== KbdSeparator) return child
    const own = child.props
    return React.cloneElement(child, {
      size: own.size ?? defaults.size,
      variant: own.variant ?? defaults.variant,
      ...(child.type === Kbd && { shape: own.shape ?? defaults.shape }),
    })
  }
  const keys = React.Children.toArray(children)
  const items = separator
    ? keys.flatMap((child, index) => (index === 0 ? [child] : [<KbdSeparator key={`kbd-separator-${index}`} />, child]))
    : keys
  return (
    <kbd data-slot="kbd-group" className={cn(kbdGroupVariants({ size }), className)} {...props}>
      {items.map(withDefaults)}
    </kbd>
  )
}

export { Kbd, KbdGroup, KbdSeparator, kbdKeys, kbdVariants, kbdSeparatorVariants }
export type { KbdVariant, KbdShape, KbdSize }
