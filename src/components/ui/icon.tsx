import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconVariants = cva(
  "shrink-0 bg-current mask-contain mask-center mask-no-repeat",
  {
    variants: {
      size: {
        4: "size-4",
        5: "size-5",
        6: "size-6",
      },
    },
  }
)

function Icon({
  src,
  size,
  className,
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof iconVariants> & { src: string }) {
  const mask = `url(${src})`
  return (
    <span
      data-slot="icon"
      aria-hidden
      className={cn(iconVariants({ size }), className)}
      style={{ maskImage: mask, WebkitMaskImage: mask, ...style }}
      {...props}
    />
  )
}

export { Icon, iconVariants }
