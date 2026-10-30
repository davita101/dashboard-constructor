import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type LoaderSize = "48" | "36" | "32" | "20"

/**
 * Figma Loader container (9489:2491): white, fully round, ring + 4px padding on every side
 * (56 / 44 / 40 / 28). The Figma drop shadow is left out: it is nearly invisible (alpha ≤ ~1%,
 * effect values unreadable) and the lightest token (`shadow-base`) renders as a visible halo.
 */
const loaderVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full bg-background-0 p-1",
  {
    variants: {
      size: {
        "48": "size-14",
        "36": "size-11",
        "32": "size-10",
        "20": "size-7",
      },
    },
    defaultVariants: { size: "36" },
  }
)

/**
 * Figma Loader. Size: Large (48), Default (36), Small (32), Extra Small (20) — the ring diameter.
 * The ring is `Spinner`; the container is static and only the ring spins.
 */
function Loader({
  className,
  size = "36",
  ...props
}: React.ComponentProps<"div"> & { size?: LoaderSize }) {
  return (
    <div
      data-slot="loader"
      data-size={size}
      className={cn(loaderVariants({ size }), className)}
      {...props}
    >
      <Spinner size={size} />
    </div>
  )
}

export { Loader, loaderVariants, type LoaderSize }
