import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { inputSizeVariants, inputVariants } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// shadcn native-select, drawn with the Figma Input box (same size × shape scale and states as Input) and
// the material keyboard-arrow-down chevron. Native <select> so it posts with FormData.
type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & VariantProps<typeof inputSizeVariants>

function NativeSelect({ className, size = "40", shape = "rounded", ...props }: NativeSelectProps) {
  return (
    <div
      data-slot="native-select-wrapper"
      data-size={size}
      // The size variant on the wrapper too, so the chevron reads --input-px / --input-icon.
      className={cn(inputSizeVariants({ size, shape }), "group/native-select relative w-full has-[select:disabled]:opacity-50", className)}
    >
      <select
        data-slot="native-select"
        data-size={size}
        data-status="default"
        className={cn(
          inputSizeVariants({ size, shape }),
          inputVariants({ status: "default" }),
          "cursor-pointer appearance-none pr-[calc(var(--input-px)+var(--input-icon))]"
        )}
        {...props}
      />
      <span
        aria-hidden
        data-slot="native-select-icon"
        className="pointer-events-none absolute top-1/2 right-(--input-px) size-(--input-icon) -translate-y-1/2 bg-base-500 mask-[url(/icons/material-keyboard-arrow-down.svg)] mask-contain mask-center mask-no-repeat"
      />
    </div>
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return <optgroup data-slot="native-select-optgroup" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
