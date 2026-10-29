import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Command-Keys (Input Right slot): small gray key caps. Size follows the input size.
const kbdVariants = cva(
  "pointer-events-none inline-flex w-fit items-center justify-center gap-1 bg-background-50 font-default font-semibold text-base-600 outline -outline-offset-1 outline-base-100 select-none [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      size: {
        "32": "h-8 min-w-8 rounded-r8 px-2 text-11 leading-20",
        "24": "h-6 min-w-6 rounded-r6 px-1.5 text-10 leading-16",
        "20": "h-5 min-w-5 rounded-r6 px-1 text-10 leading-16",
        "16": "h-4 min-w-4 rounded-r4 px-1 text-9 leading-16",
      },
    },
    defaultVariants: {
      size: "20",
    },
  }
)

function Kbd({ className, size = "20", ...props }: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ size }), className)} {...props} />
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <kbd data-slot="kbd-group" className={cn("inline-flex items-center gap-1", className)} {...props} />
}

export { Kbd, KbdGroup, kbdVariants }
