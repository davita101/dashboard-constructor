"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("flex flex-col gap-3", className)} {...props} />
}

// Figma Forms: Radio (457:56). Style (Primary / Primary Dark) sets the accent, Size sets the circle
// and the dot. States come from Base UI data attributes, highest priority first: Dislabled
// (data-disabled), Checked (data-checked: accent fill, white dot), Focus (focus-visible: stroke turns
// accent), Normal. Figma strokes are inside the box, so the stroke is an outline at -1px offset.
const radioGroupItemVariants = cva(
  "peer relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-0 text-white outline outline-(--radio-stroke) -outline-offset-1 transition-[background-color,outline-color] [--radio-stroke:var(--base-100)] " +
    // Focus
    "focus-visible:not-data-checked:not-data-disabled:[--radio-stroke:var(--radio-accent)] " +
    // Checked
    "focus-visible:data-checked:ring-2 focus-visible:data-checked:ring-base-alpha-20 data-checked:not-data-disabled:bg-(--radio-accent) data-checked:not-data-disabled:[--radio-stroke:var(--radio-checked-stroke)] " +
    // Dislabled / Dislabled checked
    "data-disabled:cursor-not-allowed data-disabled:bg-base-30 data-disabled:text-base-200 data-disabled:[--radio-stroke:var(--base-60)]",
  {
    variants: {
      color: {
        primary: "[--radio-accent:var(--primary-600)] [--radio-checked-stroke:var(--primary-600)]",
        "primary-dark": "[--radio-accent:var(--base-900)] [--radio-checked-stroke:var(--base-800)]",
      },
      size: {
        "20": "size-5 [--radio-dot:--spacing(2.5)]",
        "16": "size-4 [--radio-dot:--spacing(2)]",
      },
      status: {
        default: "",
        // Pinned Figma Focus look for previews; keyboard focus gets it automatically
        focus: "not-data-checked:not-data-disabled:[--radio-stroke:var(--radio-accent)]",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "20",
      status: "default",
    },
  }
)

type RadioColor = NonNullable<VariantProps<typeof radioGroupItemVariants>["color"]>
type RadioSize = NonNullable<VariantProps<typeof radioGroupItemVariants>["size"]>

function RadioGroupItem({
  className,
  color,
  size,
  status,
  ...props
}: Omit<RadioPrimitive.Root.Props, "color"> & VariantProps<typeof radioGroupItemVariants>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ color, size, status }), className)}
      {...props}
    >
      <RadioGroupIndicator />
    </RadioPrimitive.Root>
  )
}

/** Figma `Base`: the centered dot, colored by the circle state (white, or base-200 when disabled). */
function RadioGroupIndicator({ className, ...props }: RadioPrimitive.Indicator.Props) {
  return (
    <RadioPrimitive.Indicator
      data-slot="radio-group-indicator"
      className={cn("size-(--radio-dot) rounded-full bg-current", className)}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupIndicator, RadioGroupItem, radioGroupItemVariants, type RadioColor, type RadioSize }
