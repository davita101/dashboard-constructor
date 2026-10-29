"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Forms: Checkbox (457:37). Style (Primary / Primary Dark) sets the accent, Size sets box,
// radius and glyph. States come from Base UI data attributes, highest priority first:
// Dislabled (data-disabled), Checked (data-checked), Indeterminate (data-indeterminate, accent minus
// on the white box), Focus (focus-visible: stroke turns accent), Default.
// Figma strokes are inside the box, so the stroke is an outline at -1px offset.
const checkboxVariants = cva(
  "peer relative inline-flex shrink-0 cursor-pointer items-center justify-center bg-background-0 text-white outline outline-(--checkbox-stroke) -outline-offset-1 transition-[background-color,outline-color] [--checkbox-stroke:var(--base-100)] " +
    // Focus
    "focus-visible:not-data-checked:not-data-disabled:[--checkbox-stroke:var(--checkbox-accent)] " +
    // Checked
    "focus-visible:data-checked:ring-2 focus-visible:data-checked:ring-base-alpha-20 data-checked:not-data-disabled:bg-(--checkbox-accent) data-checked:not-data-disabled:[--checkbox-stroke:var(--checkbox-checked-stroke)] " +
    // Indeterminate
    "data-indeterminate:not-data-disabled:text-(--checkbox-accent) " +
    // Dislabled / Dislabled Cheked
    "data-disabled:cursor-not-allowed data-disabled:bg-base-30 data-disabled:text-base-200 data-disabled:[--checkbox-stroke:var(--base-60)]",
  {
    variants: {
      color: {
        primary: "[--checkbox-accent:var(--primary-600)] [--checkbox-checked-stroke:var(--primary-600)]",
        "primary-dark": "[--checkbox-accent:var(--base-900)] [--checkbox-checked-stroke:var(--base-800)]",
      },
      size: {
        "20": "size-5 rounded-r6 [--checkbox-glyph:--spacing(2.5)]",
        "16": "size-4 rounded-r4 [--checkbox-glyph:--spacing(2)]",
      },
      status: {
        default: "",
        // Pinned Figma Focus look for previews; keyboard focus gets it automatically
        focus: "not-data-checked:not-data-disabled:[--checkbox-stroke:var(--checkbox-accent)]",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "20",
      status: "default",
    },
  }
)

type CheckboxColor = NonNullable<VariantProps<typeof checkboxVariants>["color"]>
type CheckboxSize = NonNullable<VariantProps<typeof checkboxVariants>["size"]>

function Checkbox({
  className,
  color,
  size,
  status,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, "color"> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ color, size, status }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" render={<CheckboxGlyph />} />
    </CheckboxPrimitive.Root>
  )
}

/** Figma check / minus glyph, a CSS mask so the box state sets its color. */
function CheckboxGlyph({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-(--checkbox-glyph) bg-current mask-[url(/icons/material-check.svg)] mask-contain mask-center mask-no-repeat data-indeterminate:mask-[url(/icons/checkbox-minus.svg)]",
        className
      )}
      {...props}
    />
  )
}

export { Checkbox, checkboxVariants, type CheckboxColor, type CheckboxSize }
