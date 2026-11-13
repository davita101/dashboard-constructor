import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { inputSizeVariants, inputVariants } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// shadcn textarea with the Figma Input box: same size × shape scale and states as Input, auto height
// (field-sizing-content) from a 3-line minimum. Pass a placeholder (the Filled state reads :placeholder-shown).
function Textarea({
  className,
  size = "40",
  shape = "rounded",
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> & VariantProps<typeof inputSizeVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      data-status="default"
      className={cn(
        inputSizeVariants({ size, shape }),
        inputVariants({ status: "default" }),
        "field-sizing-content h-auto min-h-20 py-2",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
