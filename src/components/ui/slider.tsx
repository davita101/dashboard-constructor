"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Figma Slider (502:7159) and Slider-Percent (12193:6459) on shadcn `slider` (Base UI).
 * `variant` = Figma Style (Primary = `primary`, Dark = `primary-dark`), `size` = Figma Size (Default 4px track in a 12px row,
 * Small 2px track in an 8px row). Range = pass two values. Slider-Percent = `valueLabel`.
 */
const sliderControlVariants = cva(
  "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
  {
    variants: {
      size: {
        default: "data-horizontal:h-3 data-vertical:w-3",
        small: "data-horizontal:h-2 data-vertical:w-2",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** Unselected track: the style color at 15% (Figma blue-500 / gray-500 at 15%). */
const sliderTrackVariants = cva(
  "relative grow overflow-hidden rounded-full select-none data-horizontal:w-full data-vertical:h-full",
  {
    variants: {
      variant: {
        primary: "bg-primary-alpha-15",
        "primary-dark": "bg-base-alpha-15",
      },
      size: {
        default: "data-horizontal:h-1 data-vertical:w-1",
        small: "data-horizontal:h-0.5 data-vertical:w-0.5",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
)

/** Selected part between the thumbs (or from the start). */
const sliderRangeVariants = cva(
  "select-none data-horizontal:h-full data-vertical:w-full",
  {
    variants: {
      variant: {
        primary: "bg-primary-600",
        "primary-dark": "bg-base-900",
      },
    },
    defaultVariants: { variant: "primary" },
  }
)

/**
 * Figma Runner-Component (12191:4063): 8px dot, white fill + style-color stroke.
 * `state` = Figma Type. `interactive` (default) maps Hover to `:hover` and Active to dragging/pressed;
 * `default` / `hover` / `active` pin one look for previews.
 */
const sliderThumbVariants = cva(
  "relative block size-2 shrink-0 rounded-full bg-background-0 outline -outline-offset-1 transition-[background-color,outline-color,box-shadow] select-none after:absolute after:-inset-2 has-focus-visible:ring-4 has-focus-visible:ring-base-alpha-20 data-disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "outline-primary-600",
        "primary-dark": "outline-base-800",
      },
      state: {
        interactive: "",
        default: "",
        hover: "",
        active: "",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        state: "interactive",
        className:
          "hover:bg-primary-600 active:bg-primary-800 active:outline-primary-800 data-dragging:bg-primary-800 data-dragging:outline-primary-800",
      },
      { variant: "primary", state: "hover", className: "bg-primary-600" },
      {
        variant: "primary",
        state: "active",
        className: "bg-primary-800 outline-primary-800",
      },
      {
        variant: "primary-dark",
        state: "interactive",
        className:
          "hover:bg-base-900 hover:outline-base-900 active:bg-base-700 active:outline-base-700 data-dragging:bg-base-700 data-dragging:outline-base-700",
      },
      { variant: "primary-dark", state: "hover", className: "bg-base-900 outline-base-900" },
      { variant: "primary-dark", state: "active", className: "bg-base-700 outline-base-700" },
    ],
    defaultVariants: { variant: "primary", state: "interactive" },
  }
)

type SliderVariant = NonNullable<VariantProps<typeof sliderTrackVariants>["variant"]>
type SliderSize = NonNullable<VariantProps<typeof sliderTrackVariants>["size"]>
type SliderThumbState = NonNullable<VariantProps<typeof sliderThumbVariants>["state"]>

/**
 * Figma Slider-Percent `Tooltip`: the Tooltip Default style (white pill, base-100 stroke,
 * base-700 11/20 bold text, arrow down), always open above the thumb.
 */
function SliderThumbValue({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip open>
      <TooltipTrigger
        render={<span aria-hidden data-slot="slider-thumb-value-anchor" className="absolute inset-0" />}
      />
      <TooltipContent side="top" sideOffset={12} aria-hidden data-slot="slider-thumb-value">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

function SliderThumb({
  className,
  variant,
  state,
  index,
  label,
  ...props
}: SliderPrimitive.Thumb.Props &
  VariantProps<typeof sliderThumbVariants> & {
    /** Renders the value bubble (Slider-Percent) with this text. */
    label?: (value: number) => React.ReactNode
  }) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      index={index}
      className={cn(sliderThumbVariants({ variant, state }), className)}
      render={
        label
          ? (thumbProps, thumbState) => (
              <div {...thumbProps}>
                {thumbProps.children}
                <SliderThumbValue>{label(thumbState.values[index ?? 0] ?? 0)}</SliderThumbValue>
              </div>
            )
          : undefined
      }
      {...props}
    />
  )
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  variant = "primary",
  size = "default",
  thumbState = "interactive",
  valueLabel = false,
  ...props
}: SliderPrimitive.Root.Props & {
  variant?: SliderVariant
  size?: SliderSize
  thumbState?: SliderThumbState
  /** `true` shows the percentage of the range (Slider-Percent); a function formats the value. */
  valueLabel?: boolean | ((value: number) => React.ReactNode)
}) {
  const values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [typeof value === "number" ? value : typeof defaultValue === "number" ? defaultValue : min]

  const label =
    valueLabel === true
      ? (v: number) => `${Math.round(((v - min) / (max - min)) * 100)}%`
      : valueLabel || undefined

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      data-variant={variant}
      data-size={size}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={sliderControlVariants({ size })}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={sliderTrackVariants({ variant, size })}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={sliderRangeVariants({ variant })}
          />
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderThumb
            key={index}
            index={index}
            variant={variant}
            state={thumbState}
            label={label}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export {
  Slider,
  SliderThumb,
  SliderThumbValue,
  sliderControlVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
}
