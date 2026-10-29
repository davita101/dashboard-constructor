import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Switcher-Text (9433:3537) and Switcher-Text-Card (9435:3720): a <label> wrapping a Switch
// and its text, so the whole row toggles it. Active / Dislabled follow the Switch inside
// (data-checked / data-disabled), no props needed.
const switchFieldVariants = cva(
  "group/switch-field flex cursor-pointer items-start gap-3 font-default text-12 leading-20 font-semibold tracking-default select-none has-data-disabled:cursor-not-allowed",
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

function SwitchField({
  className,
  variant = "plain",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof switchFieldVariants>) {
  return (
    <label
      data-slot="switch-field"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(switchFieldVariants({ variant, orientation }), className)}
      {...props}
    />
  )
}

/** Figma Content: texts in a row (Horizontal, gap 8) or a column (Vertical, gap 4). */
function SwitchFieldContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-field-content"
      className={cn(
        "flex min-w-0 flex-1 gap-2 group-data-[orientation=vertical]/switch-field:flex-col group-data-[orientation=vertical]/switch-field:gap-1",
        className
      )}
      {...props}
    />
  )
}

/**
 * Figma Main Text. Plain: Default base-800, Active base-900, Dislabled base-400 (Vertical base-500).
 * Card: base-900, Dislabled base-400.
 */
function SwitchFieldTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="switch-field-title"
      className={cn(
        "text-base-800 group-[[data-variant=card]:not(:has([data-disabled]))]/switch-field:text-base-900group-has-[[data-checked]:not([data-disabled])]/switch-field:text-base-900 group-has-data-disabled/switch-field:text-base-400 group-[[data-variant=plain][data-orientation=vertical]:has([data-disabled])]/switch-field:text-base-500",
        className
      )}
      {...props}
    />
  )
}

/** Figma Additional Text. */
function SwitchFieldDescription({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="switch-field-description" className={cn("text-base-500", className)} {...props} />
}

export { SwitchField, SwitchFieldContent, SwitchFieldDescription, SwitchFieldTitle, switchFieldVariants }
