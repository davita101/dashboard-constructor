"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { ColorDot, type ColorDotColor } from "@/components/ui/color-swatch"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"

// Figma Color-Picker (2692:140375), Type=Color, Corner=Pilled|Rounded. No shadcn base: built in
// shadcn style from Input, NativeSelect and ColorDot. The gradient stops are Figma values with no
// token (hue rail, saturation area), written as hsl()/color-mix().

const colorPickerVariants = cva(
  "group/color-picker flex w-57.5 flex-col gap-2 bg-background-0 p-3 font-default tracking-default outline -outline-offset-1 outline-background-100",
  {
    variants: {
      corner: {
        pilled: "rounded-r20",
        rounded: "rounded-r12",
      },
    },
    defaultVariants: { corner: "pilled" },
  }
)

type ColorPickerCorner = NonNullable<VariantProps<typeof colorPickerVariants>["corner"]>

const ColorPickerContext = React.createContext<ColorPickerCorner>("pilled")

function ColorPicker({
  className,
  corner = "pilled",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof colorPickerVariants>) {
  const c = corner ?? "pilled"
  return (
    <ColorPickerContext.Provider value={c}>
      <div data-slot="color-picker" data-corner={c} className={cn(colorPickerVariants({ corner: c }), className)} {...props} />
    </ColorPickerContext.Provider>
  )
}

const thumbClass =
  "pointer-events-none absolute size-3 -translate-x-1/2 rounded-full bg-(--color-picker-color) outline-2 outline-background-0 shadow-[0_1px_2px_0_var(--shadow-base)]"

/** Figma `Color` 206x108: saturation / brightness area. */
function ColorPickerArea({
  className,
  hue = 210,
  x = 100,
  y = 0,
  style,
  ...props
}: React.ComponentProps<"div"> & { hue?: number; x?: number; y?: number }) {
  const corner = React.useContext(ColorPickerContext)
  return (
    <div
      data-slot="color-picker-area"
      role="img"
      aria-label="Saturation and brightness"
      className={cn(
        "relative h-27 w-full shrink-0 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,black_67%,transparent)),linear-gradient(to_right,color-mix(in_oklab,white_50%,transparent),var(--color-picker-hue))]",
        corner === "pilled" ? "rounded-r16" : "rounded-r8",
        className
      )}
      style={
        {
          "--color-picker-hue": `hsl(${hue} 100% 50%)`,
          "--color-picker-color": `hsl(${hue} 90% 50%)`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <span data-slot="color-picker-thumb" className={cn(thumbClass, "-translate-y-1/2")} style={{ left: `${x}%`, top: `${y}%` }} />
    </div>
  )
}

/** Figma `Content` 206x38: eyedropper slot + hue and alpha rails. */
function ColorPickerSliders({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="color-picker-sliders" className={cn("flex items-center gap-3 px-2", className)} {...props} />
}

/** Figma material-colorize 20x20 eyedropper, drawn as a token-colored mask. */
function ColorPickerEyedropper({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="color-picker-eyedropper"
      aria-label="Pick color from screen"
      className={cn(
        "size-5 shrink-0 cursor-pointer rounded-r4 bg-base-500 mask-[url(/icons/material-colorize.svg)] mask-contain mask-center mask-no-repeat outline-none focus-visible:outline-2 focus-visible:outline-base-alpha-50",
        className
      )}
      {...props}
    />
  )
}

const colorPickerSliderVariants = cva("relative block h-2 w-full rounded-r4 outline -outline-offset-1 outline-black-alpha-10", {
  variants: {
    kind: {
      hue: "bg-[linear-gradient(to_right,hsl(15_96%_46%),hsl(42_100%_50%)_17%,hsl(135_100%_50%)_40%,hsl(198_100%_50%)_59%,hsl(300_100%_50%)_79%,hsl(349_98%_50%))]",
      alpha:
        "bg-[linear-gradient(to_right,transparent,var(--primary-500)),repeating-conic-gradient(var(--base-100)_0_25%,var(--background-0)_0_50%)] bg-size-[auto,8px_8px]",
    },
  },
  defaultVariants: { kind: "hue" },
})

/** Figma `Color` 158x13 rail with a 12px thumb. A native range input keeps it keyboard and pointer accessible. */
function ColorPickerSlider({
  className,
  kind = "hue",
  min = 0,
  max,
  defaultValue,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "size"> & VariantProps<typeof colorPickerSliderVariants>) {
  const maxValue = Number(max ?? (kind === "hue" ? 360 : 100))
  const [inner, setInner] = React.useState(Number(defaultValue ?? (kind === "hue" ? 210 : 100)))
  const current = Number(value ?? inner)
  const pct = ((current - Number(min)) / (maxValue - Number(min))) * 100
  return (
    <div data-slot="color-picker-slider" data-kind={kind} className={cn("relative flex h-3.25 w-full items-start pt-px", className)}>
      <span className={colorPickerSliderVariants({ kind })} />
      <span
        data-slot="color-picker-thumb"
        className={cn(thumbClass, "top-px -translate-y-0.5")}
        style={{ left: `${pct}%`, "--color-picker-color": kind === "hue" ? `hsl(${current} 100% 50%)` : "var(--primary-500)" } as React.CSSProperties}
      />
      <input
        type="range"
        min={min}
        max={maxValue}
        value={current}
        aria-label={kind === "hue" ? "Hue" : "Opacity"}
        onChange={(e) => {
          setInner(Number(e.target.value))
          onChange?.(e)
        }}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        {...props}
      />
    </div>
  )
}

/** Figma `Control` 206x24: format select + value + opacity inputs. */
function ColorPickerControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="color-picker-control" className={cn("flex items-center gap-2", className)} {...props} />
}

function ColorPickerFormat({ className, ...props }: React.ComponentProps<typeof NativeSelect>) {
  const corner = React.useContext(ColorPickerContext)
  return (
    <NativeSelect variant={corner === "pilled" ? "compact-pill" : "compact-rounded"} className={cn("w-18.5 shrink-0", className)} {...props}>
      <NativeSelectOption>Hex</NativeSelectOption>
      <NativeSelectOption>RGB</NativeSelectOption>
      <NativeSelectOption>HSL</NativeSelectOption>
    </NativeSelect>
  )
}

function ColorPickerInput({ className, ...props }: Omit<React.ComponentProps<typeof Input>, "size" | "shape">) {
  const corner = React.useContext(ColorPickerContext)
  return <Input size="24" shape={corner === "pilled" ? "pill" : "rounded"} className={className} {...props} />
}

/** Figma `Input` 206x24 used as the "Last Colors" select. */
function ColorPickerHistory({ className, ...props }: React.ComponentProps<typeof NativeSelect>) {
  const corner = React.useContext(ColorPickerContext)
  return (
    <NativeSelect variant={corner === "pilled" ? "compact-pill" : "compact-rounded"} className={className} {...props}>
      <NativeSelectOption>Last Colors</NativeSelectOption>
      <NativeSelectOption>Saved Colors</NativeSelectOption>
    </NativeSelect>
  )
}

const defaultSwatches: ColorDotColor[] = [
  "blue",
  "orange",
  "purple",
  "purple",
  "error",
  "green",
  "yellow",
  "pink",
  "amber",
  "info",
  "teal",
  "lime",
  "cyan",
  "emerald",
  "rose",
  "fuchsia",
]

/** Figma `Colors` slot 206x50: two rows of Colors/Item. */
function ColorPickerSwatches({
  className,
  colors = defaultSwatches,
  ...props
}: React.ComponentProps<"div"> & { colors?: ColorDotColor[] }) {
  return (
    <div data-slot="color-picker-swatches" className={cn("grid grid-cols-8 justify-items-center pr-1.5", className)} {...props}>
      {colors.map((color, i) => (
        <ColorDot key={i} color={color} size="lg" />
      ))}
    </div>
  )
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerControl,
  ColorPickerEyedropper,
  ColorPickerFormat,
  ColorPickerHistory,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliders,
  ColorPickerSwatches,
  colorPickerVariants,
  type ColorPickerCorner,
}
