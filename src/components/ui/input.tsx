"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { type VariantProps } from "class-variance-authority"

import { useFieldContext } from "@/components/ui/field-context"
import { inputSizeVariants, inputVariants, type InputShape, type InputSize, type InputSizeProps, type InputStatus } from "@/components/ui/input-variants"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  size: sizeProp,
  shape: shapeProp,
  status = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & InputSizeProps & VariantProps<typeof inputVariants>) {
  // Explicit prop > enclosing Field > default
  const field = useFieldContext()
  const size = sizeProp ?? field?.size ?? "40"
  const shape = shapeProp ?? field?.shape ?? "rounded"
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      data-status={status}
      className={cn(inputSizeVariants({ size, shape }), inputVariants({ status }), className)}
      {...props}
    />
  )
}

export { Input, type InputShape, type InputSize, type InputStatus }
