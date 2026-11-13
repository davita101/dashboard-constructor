import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Icon } from "@/components/ui/icon"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Figma Input component frame: Top (Label + help icon, "Add Text" hint) / Input / Bottom ("Add Text Bottom").
// Size × Shape must match the Input / InputGroup inside: they set the type size, the gaps and
// --field-px, the label inset (it lines up with the input text).
// State goes on the Field as data attributes (shadcn style): data-invalid, data-success, data-disabled.
const fieldVariants = cva("group/field flex w-full flex-col font-default tracking-default", {
  variants: {
    size: {
      "60": "gap-4 text-12 leading-20 [--field-icon:--spacing(4)] [--field-label-gap:--spacing(2)] [--field-px:--spacing(5)]",
      "48": "gap-3 text-12 leading-20 [--field-icon:--spacing(4)] [--field-label-gap:--spacing(2)] [--field-px:--spacing(4)]",
      "40": "gap-2 text-11 leading-20 [--field-icon:--spacing(4)] [--field-label-gap:--spacing(1.5)] [--field-px:--spacing(3)]",
      "32": "gap-2 text-10 leading-16 [--field-icon:--spacing(3)] [--field-label-gap:--spacing(1)] [--field-px:--spacing(3)]",
      "24": "gap-1 text-9 leading-16 [--field-icon:--spacing(3)] [--field-label-gap:--spacing(1)] [--field-px:--spacing(2)]",
    },
    shape: {
      rounded: "",
      pill: "",
    },
    // Figma Forms: Inputs Custom (12509:89789): white label, 50% white hints over photos / dark
    // surfaces, in both color modes. Pair with InputGroup tone="white" | "black".
    tone: {
      default: "",
      glass: "[--field-hint-fg:var(--white-alpha-50)] [--field-icon-fg:var(--white-alpha-50)] [--field-label-fg:var(--white)]",
    },
  },
  compoundVariants: [
    { shape: "pill", size: "60", className: "[--field-px:--spacing(8)]" },
    { shape: "pill", size: "48", className: "[--field-px:--spacing(6)]" },
    { shape: "pill", size: "40", className: "[--field-px:--spacing(5)]" },
    { shape: "pill", size: "32", className: "[--field-px:--spacing(4)]" },
    { shape: "pill", size: "24", className: "[--field-px:--spacing(3)]" },
  ],
  defaultVariants: {
    size: "40",
    shape: "rounded",
    tone: "default",
  },
})

type FieldSize = NonNullable<VariantProps<typeof fieldVariants>["size"]>

function Field({
  className,
  size = "40",
  shape = "rounded",
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-size={size}
      className={cn(fieldVariants({ size, shape, tone }), className)}
      {...props}
    />
  )
}

/** Figma Top: label on the left, hint on the right. */
function FieldHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-header"
      className={cn(
        "flex min-w-0 items-center justify-between gap-2 px-(--field-px) group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn("gap-(--field-label-gap) text-[color:var(--field-label-fg,var(--base-700))]", className)} {...props} />
}

/** Figma material-help next to the label. */
function FieldLabelIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <Icon
      data-slot="field-label-icon"
      src="/icons/material-help.svg"
      className={cn("size-(--field-icon) bg-[color:var(--field-icon-fg,var(--base-500))]", className)}
      {...props}
    />
  )
}

/** Figma Top "Add Text": right-aligned hint or counter. */
function FieldHint({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="field-hint"
      className={cn("truncate text-right font-semibold text-[color:var(--field-hint-fg,var(--base-400))]", className)}
      {...props}
    />
  )
}

/** Figma Bottom "Add Text Bottom": helper text, red on data-invalid, green on data-success. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "px-(--field-px) font-semibold text-[color:var(--field-hint-fg,var(--base-400))] group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-danger-600 group-data-[success=true]/field:text-success-600",
        className
      )}
      {...props}
    />
  )
}

/** Bottom text for an error, announced to screen readers. */
function FieldError({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("px-(--field-px) font-semibold text-danger-600", className)}
      {...props}
    />
  )
}

/** Stack of Fields in a form (shadcn FieldGroup). */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("flex w-full flex-col gap-4", className)} {...props} />
}

/** Group of related checkboxes / radios (shadcn FieldSet). */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return <fieldset data-slot="field-set" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />
}

/** Heading of a FieldSet, styled like FieldLabel. */
function FieldLegend({ className, ...props }: React.ComponentProps<"legend">) {
  return (
    <legend
      data-slot="field-legend"
      className={cn("pb-2 font-default text-11 leading-20 font-bold tracking-default text-base-700", className)}
      {...props}
    />
  )
}

export { Field, FieldGroup, FieldLegend, FieldSet, FieldDescription, FieldError, FieldHeader, FieldHint, FieldLabel, FieldLabelIcon, fieldVariants, type FieldSize }
