import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import type { FieldSize } from "@/components/ui/field"
import { inputVariants } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Figma Forms: Text Area (8985:334025), sets Text-Area-Rounded (10461:655695) and Text-Area-Pilled (10926:63289).
// Size × Shape set radius, type, padding (--input-px, reused by inputVariants) and the Figma box height
// as min-height; the box grows with content and the native resize handle stands in for the Figma grip.
// States (Default, Filled, Active, Error, Success, Disabled) are Input's: same strokes, rings and colors.
const textareaSizeVariants = cva("field-sizing-content resize-y py-(--input-px) text-left", {
  variants: {
    size: {
      xl: "min-h-32 rounded-r16 text-12 leading-20 [--input-px:--spacing(5)]",
      lg: "min-h-34 rounded-r12 text-12 leading-20 [--input-px:--spacing(4)]",
      default: "min-h-36 rounded-r8 text-12 leading-20 [--input-px:--spacing(3)]",
      sm: "min-h-38 rounded-r6 text-10 leading-16 [--input-px:--spacing(3)]",
    },
    shape: {
      rounded: "",
      pill: "",
    },
  },
  compoundVariants: [
    { shape: "pill", size: "xl", className: "rounded-r16" },
    { shape: "pill", size: "lg", className: "rounded-r20 [--input-px:--spacing(5)]" },
    { shape: "pill", size: "default", className: "rounded-r16 [--input-px:--spacing(4)]" },
    { shape: "pill", size: "sm", className: "rounded-r12 [--input-px:--spacing(4)]" },
  ],
  defaultVariants: {
    size: "default",
    shape: "rounded",
  },
})

type TextareaSizeProps = VariantProps<typeof textareaSizeVariants>
type TextareaSize = NonNullable<TextareaSizeProps["size"]>
type TextareaShape = NonNullable<TextareaSizeProps["shape"]>
type TextareaStatus = NonNullable<VariantProps<typeof inputVariants>["status"]>

/** Field size whose label / helper text and gaps match each Text Area size (Figma Top / Bottom rows). */
const textareaFieldSize: Record<TextareaSize, FieldSize> = {
  xl: "60",
  lg: "48",
  default: "40",
  sm: "32",
}

function Textarea({
  className,
  size = "default",
  shape = "rounded",
  status = "default",
  ...props
}: React.ComponentProps<"textarea"> & TextareaSizeProps & VariantProps<typeof inputVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      data-status={status}
      className={cn(inputVariants({ status }), textareaSizeVariants({ size, shape }), className)}
      {...props}
    />
  )
}

export {
  Textarea,
  textareaFieldSize,
  textareaSizeVariants,
  type TextareaShape,
  type TextareaSize,
  type TextareaStatus,
}
