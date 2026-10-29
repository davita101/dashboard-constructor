import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Radio-Text (9414:3234) and Radio-Text-Card (9414:3260): a <label> wrapping a RadioGroupItem
// and its text, so the whole row selects it. Active / Dislabled follow the radio inside
// (data-checked / data-disabled), no props needed.
const radioFieldVariants = cva(
  "group/radio-field flex cursor-pointer items-start gap-3 font-default text-14 leading-20 font-medium tracking-default select-none has-data-disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        plain: "",
        card: "bg-background-0 outline outline-base-100 -outline-offset-1 transition-[outline-color] not-has-data-disabled:has-data-checked:outline-base-alpha-50 has-data-disabled:bg-background-20",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    compoundVariants: [
      { variant: "card", orientation: "horizontal", className: "rounded-full p-2" },
      { variant: "card", orientation: "vertical", className: "rounded-r16 p-3" },
    ],
    defaultVariants: {
      variant: "plain",
      orientation: "horizontal",
    },
  }
)

function RadioField({
  className,
  variant = "plain",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof radioFieldVariants>) {
  return (
    <label
      data-slot="radio-field"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(radioFieldVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

/** Figma Content: texts in a row (Horizontal) or a column (Vertical). */
function RadioFieldContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-field-content"
      className={cn(
        "flex min-w-0 flex-1 gap-3 group-data-[orientation=vertical]/radio-field:flex-col group-data-[orientation=vertical]/radio-field:gap-1",
        className
      )}
      {...props}
    />
  )
}

/** Figma Main Text: base-800, base-900 when selected or on a card, base-400 when disabled. */
function RadioFieldTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-field-title"
      className={cn(
        "text-base-800 group-data-[variant=card]/radio-field:text-base-900 group-has-[[data-checked]:not([data-disabled])]/radio-field:text-base-900 group-has-data-disabled/radio-field:text-base-400 group-data-[variant=card]/radio-field:group-has-data-disabled/radio-field:text-base-400",
        className
      )}
      {...props}
    />
  )
}

/** Figma Additional Text. */
function RadioFieldDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="radio-field-description"
      className={cn("text-base-400 group-has-data-disabled/radio-field:text-base-300", className)}
      {...props}
    />
  )
}

export { RadioField, RadioFieldContent, RadioFieldDescription, RadioFieldTitle, radioFieldVariants }
