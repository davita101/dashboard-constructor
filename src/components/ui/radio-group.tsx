"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

// Figma Forms Radio: 20px disc, white inside, fill + stroke primary-600 when checked, 10px white dot.
// Figma strokes are inside the box: outline at -1px offset (same as Checkbox).
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-0 outline outline-base-100 -outline-offset-1 transition-[background-color,outline-color] focus-visible:not-data-checked:outline-primary-600 focus-visible:data-checked:ring-2 focus-visible:data-checked:ring-base-alpha-20 data-checked:bg-primary-600 data-checked:outline-primary-600 data-disabled:cursor-not-allowed data-disabled:bg-base-30 data-disabled:outline-base-60",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-2.5 rounded-full bg-background-0"
      />
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
