import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Checkbox-Text (9433:3484) and Checkbox-Text-Card (9435:3667): a <label> wrapping a
// Checkbox and its text, so the whole row toggles it. Active / Dislabled follow the Checkbox inside
// (data-checked / data-disabled), no props needed.
const checkboxFieldVariants = cva(
  "group/checkbox-field flex cursor-pointer items-start gap-3 font-default text-14 leading-20 font-medium tracking-default select-none has-data-disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        plain: "",
        card: "rounded-r12 bg-background-0 outline outline-base-100 -outline-offset-1 transition-[outline-color] not-has-data-disabled:has-data-checked:outline-base-alpha-50 has-data-disabled:bg-background-20",
      },
      orientation: {
        horizontal: "",
        vertical: "",
      },
    },
    compoundVariants: [
      { variant: "card", orientation: "horizontal", className: "p-2" },
      { variant: "card", orientation: "vertical", className: "p-3" },
    ],
    defaultVariants: {
      variant: "plain",
      orientation: "horizontal",
    },
  }
)

function CheckboxField({
  className,
  variant = "plain",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof checkboxFieldVariants>) {
  return (
    <label
      data-slot="checkbox-field"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(checkboxFieldVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

/** Figma Content: texts in a row (Horizontal) or a column (Vertical). */
function CheckboxFieldContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-field-content"
      className={cn(
        "flex min-w-0 flex-1 gap-3 group-data-[orientation=vertical]/checkbox-field:flex-col group-data-[orientation=vertical]/checkbox-field:gap-1",
        className
      )}
      {...props}
    />
  )
}

/** Figma Main Text. */
function CheckboxFieldTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="checkbox-field-title"
      className={cn(
        "text-base-800 group-has-[[data-checked]:not([data-disabled])]/checkbox-field:text-base-900 group-has-data-disabled/checkbox-field:text-base-400",
        className
      )}
      {...props}
    />
  )
}

/** Figma Additional Text. */
function CheckboxFieldDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="checkbox-field-description" className={cn("text-base-500", className)} {...props} />
}

export { CheckboxField, CheckboxFieldContent, CheckboxFieldDescription, CheckboxFieldTitle, checkboxFieldVariants }
