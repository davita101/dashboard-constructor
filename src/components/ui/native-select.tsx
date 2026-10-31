import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// shadcn native-select, restyled for the Figma select looks:
// - `input`: Input-Pilled used as a select (Modal Payment "State", Date-Range presets "Today"):
//   32px white pill, base-100 stroke, 10/16 semibold base-700 text, material-unfold_more 16 on the right.
// - `pill`: the Month / Year selects of the calendar head (Outline-Button 24, 10/16 bold base-800,
//   material-expand_more 16 on the right).
const nativeSelectVariants = cva(
  "group/native-select relative inline-flex min-w-0 items-center font-default tracking-default has-[select:disabled]:opacity-50",
  {
    variants: {
      variant: {
        input:
          "h-8 w-full rounded-r32 bg-background-0 outline outline-base-100 -outline-offset-1 has-focus-visible:shadow-[inset_0_0_0_4px_var(--base-alpha-20)] has-focus-visible:outline-base-200 has-focus-visible:-outline-offset-5 [--select-icon:url(/icons/material-unfold-more.svg)] [--select-pl:--spacing(3)] [--select-pr:--spacing(8)] [&_select]:text-10 [&_select]:leading-16 [&_select]:font-semibold [&_select]:text-base-700",
        // Color-Picker Input-Pilled / Input-Rounded size 24 used as a select (Hex, Last Colors)
        "compact-pill":
          "h-6 w-full rounded-r32 bg-background-0 outline outline-base-100 -outline-offset-1 has-focus-visible:shadow-[inset_0_0_0_4px_var(--base-alpha-20)] has-focus-visible:outline-base-200 has-focus-visible:-outline-offset-5 [--select-icon:url(/icons/material-unfold-more.svg)] [--select-pl:--spacing(3)] [--select-pr:--spacing(7)] [&_select]:text-9 [&_select]:leading-16 [&_select]:font-semibold [&_select]:text-base-700",
        "compact-rounded":
          "h-6 w-full rounded-r6 bg-background-0 outline outline-base-100 -outline-offset-1 has-focus-visible:shadow-[inset_0_0_0_4px_var(--base-alpha-20)] has-focus-visible:outline-base-200 has-focus-visible:-outline-offset-5 [--select-icon:url(/icons/material-unfold-more.svg)] [--select-pl:--spacing(2)] [--select-pr:--spacing(7)] [&_select]:text-9 [&_select]:leading-16 [&_select]:font-semibold [&_select]:text-base-700",
        pill:
          "h-6 w-fit rounded-r32 bg-linear-to-b from-background-0 to-background-20 outline outline-base-100 -outline-offset-1 has-focus-visible:outline-2 has-focus-visible:outline-base-alpha-50 [--select-icon:url(/icons/material-expand-more.svg)] [--select-pl:--spacing(3)] [--select-pr:--spacing(7)] [&_select]:text-10 [&_select]:leading-16 [&_select]:font-bold [&_select]:text-base-800",
      },
    },
    defaultVariants: {
      variant: "input",
    },
  }
)

type NativeSelectProps = React.ComponentProps<"select"> & VariantProps<typeof nativeSelectVariants>

function NativeSelect({ className, variant = "input", ...props }: NativeSelectProps) {
  return (
    <div
      className={cn(nativeSelectVariants({ variant }), className)}
      data-slot="native-select-wrapper"
      data-variant={variant}
    >
      <select
        data-slot="native-select"
        className="size-full min-w-0 cursor-pointer appearance-none bg-transparent pr-(--select-pr) pl-(--select-pl) outline-none disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden
        data-slot="native-select-icon"
        className={cn(
          "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 bg-base-500 mask-(--select-icon) mask-contain mask-center mask-no-repeat",
          variant === "pill" || variant?.startsWith("compact") ? "right-2" : "right-3"
        )}
      />
    </div>
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup data-slot="native-select-optgroup" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption, nativeSelectVariants }
