"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Forms: Switcher (457:75). Style (Primary / Primary Dark) sets the On accent, Size sets the
// track (Default 36x20 inset 4, Small 32x16 inset 2); the knob is 12px in both, so On moves it 16px.
// States come from Base UI data attributes: On (data-checked), Off (data-unchecked), On Disabled /
// Off Disabled (data-disabled). Figma strokes are inside the track: outline at -1px offset.
const switchVariants = cva(
  "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full bg-(--switch-fill) outline outline-(--switch-stroke) -outline-offset-1 transition-[background-color,outline-color] " +
    // Off
    "[--switch-fill:var(--base-100)] [--switch-stroke:var(--base-100)] [--switch-knob:var(--background-0)] " +
    // On
    "data-checked:[--switch-fill:var(--switch-accent)] data-checked:[--switch-stroke:var(--switch-accent-stroke)] " +
    // Off Disabled
    "data-disabled:cursor-not-allowed data-disabled:[--switch-fill:var(--base-30)] data-disabled:[--switch-stroke:var(--base-60)] data-disabled:[--switch-knob:var(--base-100)] " +
    // On Disabled: track and knob at 30% (Figma alpha fill; knob opacity read from the export)
    "data-disabled:data-checked:[--switch-fill:var(--switch-accent-disabled)] data-disabled:data-checked:[--switch-stroke:var(--switch-accent-disabled)] data-disabled:data-checked:[--switch-knob:color-mix(in_oklab,var(--background-0)_30%,transparent)] " +
    // Focus (not in Figma)
    "focus-visible:ring-4 focus-visible:ring-base-alpha-20",
  {
    variants: {
      color: {
        primary:
          "[--switch-accent:var(--primary-600)] [--switch-accent-stroke:var(--primary-600)] [--switch-accent-disabled:var(--primary-alpha-30)]",
        "primary-dark":
          "[--switch-accent:var(--base-900)] [--switch-accent-stroke:var(--base-800)] [--switch-accent-disabled:color-mix(in_oklab,var(--base-900)_30%,transparent)]",
      },
      size: {
        default: "h-5 w-9 px-1",
        sm: "h-4 w-8 px-0.5",
      },
    },
    defaultVariants: {
      color: "primary",
      size: "default",
    },
  }
)

type SwitchColor = NonNullable<VariantProps<typeof switchVariants>["color"]>
type SwitchSize = NonNullable<VariantProps<typeof switchVariants>["size"]>

function Switch({
  className,
  color,
  size,
  ...props
}: Omit<SwitchPrimitive.Root.Props, "color"> & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size ?? "default"}
      className={cn(switchVariants({ color, size }), className)}
      {...props}
    >
      <SwitchThumb />
    </SwitchPrimitive.Root>
  )
}

/** Figma "Base" knob: a 12px circle, 16px further right when On. */
function SwitchThumb({ className, ...props }: SwitchPrimitive.Thumb.Props) {
  return (
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block size-3 rounded-full bg-(--switch-knob) transition-[translate,background-color] data-checked:translate-x-4",
        className
      )}
      {...props}
    />
  )
}

export { Switch, SwitchThumb, switchVariants, type SwitchColor, type SwitchSize }
