import { cva, type VariantProps } from "class-variance-authority"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Buttons-Pilled-Group (412:6) and Buttons-Rounded-Group (14173:23437):
// Type (Default | Icon) × Size (60…24) × Resizing (Hug | Fill).
// Items are `outline` Buttons of the same size; they overlap by 1px (Figma gap -1) so
// neighbouring strokes form the dividers. Only the outer corners keep the group radius,
// and the group carries the shadow.
const buttonGroupVariants = cva(
  "flex w-fit items-stretch shadow-[0_1px_2px_0_var(--shadow-base)] *:shadow-none *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "*:rounded-none *:not-first:-ms-px *:first:rounded-s-[inherit] *:last:rounded-e-[inherit]",
        vertical:
          "flex-col *:rounded-none *:not-first:-mt-px *:first:rounded-t-[inherit] *:last:rounded-b-[inherit]",
      },
      shape: {
        pill: "rounded-r32",
        rounded: "",
      },
      size: {
        "60": "",
        "48": "",
        "40": "",
        "32": "",
        "28": "",
        "24": "",
      },
      resizing: {
        hug: "",
        fill: "w-full *:flex-1",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "60", className: "rounded-r16 *:[--btn-tx:--spacing(3)]" },
      { shape: "rounded", size: "48", className: "rounded-r12" },
      { shape: "rounded", size: "40", className: "rounded-r8" },
      { shape: "rounded", size: ["32", "28"], className: "rounded-r6" },
      { shape: "rounded", size: "24", className: "rounded-r4" },
      // Pilled 60 and 48 text items get 8px more on the outer side of the end items
      {
        shape: "pill",
        size: ["60", "48"],
        orientation: "horizontal",
        className:
          "*:first:not-data-[size^=icon]:ps-[calc(var(--btn-px)+var(--btn-tx)+--spacing(2))] *:last:not-data-[size^=icon]:pe-[calc(var(--btn-px)+var(--btn-tx)+--spacing(2))]",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      shape: "pill",
      size: "40",
      resizing: "hug",
    },
  }
)

/** Figma Buttons-Group. Pass the same `size` and `shape` to the group and its Buttons. */
function ButtonGroup({
  className,
  orientation = "horizontal",
  shape = "pill",
  size = "40",
  resizing = "hug",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation, shape, size, resizing }), className)}
      {...props}
    />
  )
}

/** Divider for groups of Buttons that have no stroke of their own. */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-background-100 data-horizontal:w-auto data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, buttonGroupVariants }
