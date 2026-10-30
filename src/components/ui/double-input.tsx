import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Forms: Double Inputs (11956:50138):
// - joined: Input-Double-Rounded (11956:50142) / Input-Double-Pilled (11984:34041). Two full-width
//   inputs stacked into one box; they overlap by 1px (Figma y+39) so the strokes form the divider,
//   only the outer corners keep the radius. Figma's Pilled set looks the same as Rounded (size
//   radius, not r32), so the group sets the radius itself: pass shape="rounded" to the inputs.
// - horizontal: Input-Horizontal-Double-* (15941:60824, 15909:16155). Side by side, equal widths.
// - vertical: Input-Vertical-Double-* (15963:162530, 15962:19281). Two separate inputs stacked.
// Children are InputGroup (or Input) of the same `size`; the stated / focused one is raised so its
// stroke and ring sit above the neighbour's.
const doubleInputVariants = cva(
  "flex w-full min-w-0 *:relative *:has-focus-visible:z-10 *:focus-visible:z-10 *:has-aria-invalid:z-10 *:aria-invalid:z-10 *:data-[status=active]:z-10 *:data-[status=success]:z-10",
  {
    variants: {
      layout: {
        joined:
          "flex-col *:rounded-none *:not-first:-mt-px *:first:rounded-t-[inherit] *:last:rounded-b-[inherit]",
        horizontal: "flex-row *:min-w-0 *:flex-1",
        vertical: "flex-col",
      },
      size: {
        "60": "",
        "48": "",
        "40": "",
        "32": "",
        "24": "",
      },
    },
    compoundVariants: [
      // Joined: outer radius of the matching Input size
      { layout: "joined", size: "60", className: "rounded-r16" },
      { layout: "joined", size: "48", className: "rounded-r12" },
      { layout: "joined", size: ["40", "32"], className: "rounded-r8" },
      { layout: "joined", size: "24", className: "rounded-r6" },
      // Separate inputs: 12px apart at Extra Large, 8px below (Figma XL 132/204, Default 96/144 frames)
      { layout: ["horizontal", "vertical"], size: "60", className: "gap-3" },
      { layout: ["horizontal", "vertical"], size: ["48", "40", "32", "24"], className: "gap-2" },
    ],
    defaultVariants: {
      layout: "joined",
      size: "40",
    },
  }
)

type DoubleInputLayout = NonNullable<VariantProps<typeof doubleInputVariants>["layout"]>

/** Figma Content of a Double Input: wraps two InputGroups (or Inputs) of the same size. */
function DoubleInput({
  className,
  layout = "joined",
  size = "40",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof doubleInputVariants>) {
  return (
    <div
      role="group"
      data-slot="double-input"
      data-layout={layout}
      data-size={size}
      className={cn(doubleInputVariants({ layout, size }), className)}
      {...props}
    />
  )
}

export { DoubleInput, doubleInputVariants, type DoubleInputLayout }
