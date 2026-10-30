"use client"

import * as React from "react"
import { NumberField } from "@base-ui/react/number-field"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, ButtonIcon, type ButtonSize } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

// Figma Forms: Counter (9402:27553). A numeric stepper (− / value / +) on Base UI NumberField.
// appearance="button" = Counter-Button (9440:765): a compact box with bare icon buttons.
// appearance="input" = Counter-Input-Pilled (15848:89546) / -Rounded (15893:566329): an InputGroup
// with outline Buttons; wrap it in Field (FieldHeader / FieldDescription) like Input.
// NumberField handles value/min/max/step, the keyboard and disabling −/+ at min/max.

type CounterSize = "60" | "48" | "40" | "32" | "24"
type CounterShape = "pill" | "rounded"
type CounterAppearance = "button" | "input"
type CounterStatus = "default" | "filled" | "active" | "success" | "hover-decrement" | "hover-increment"

// Counter-Button box. Hover on an enabled −/+ lifts the whole box (Figma Hover Remove / Hover Add).
const counterVariants = cva(
  "group/counter inline-flex w-fit items-center bg-background-0 font-default font-bold tracking-default text-base-600 shadow-[0_1px_2px_0_var(--shadow-base)] outline outline-base-100 -outline-offset-1 transition-[box-shadow,outline-color] has-[button:hover:not(:disabled)]:shadow-[0_12px_32px_0_var(--shadow-base)] data-[status=hover-decrement]:shadow-[0_12px_32px_0_var(--shadow-base)] data-[status=hover-increment]:shadow-[0_12px_32px_0_var(--shadow-base)] has-[input:focus-visible]:outline-base-200 data-disabled:bg-background-20 data-disabled:text-base-300 data-disabled:shadow-none",
  {
    variants: {
      size: {
        "60": "h-15 gap-3 rounded-r16 px-4 text-12 leading-20",
        "48": "h-12 gap-3 rounded-r12 px-3 text-12 leading-20",
        "40": "h-10 gap-2 rounded-r8 px-2.5 text-11 leading-20",
        "32": "h-8 gap-2 rounded-r8 px-2 text-10 leading-16",
        "24": "h-6 gap-1 rounded-r6 px-2 text-10 leading-16",
      },
      shape: {
        rounded: "",
        pill: "rounded-r32",
      },
    },
    compoundVariants: [
      { shape: "pill", size: "60", className: "px-5" },
      { shape: "pill", size: "48", className: "px-4" },
      { shape: "pill", size: "40", className: "px-3" },
      { shape: "pill", size: "32", className: "px-2.5" },
    ],
    defaultVariants: {
      size: "40",
      shape: "rounded",
    },
  }
)

// Counter-Input box on top of InputGroup: the buttons sit `inset` px from every edge.
// Default (untouched) shows the value in base-600 with the base-100 stroke; Filled (changed by the
// user, or pinned with status="filled") uses InputGroup's base-900 value and base-150 stroke.
// The `!` beats InputGroup's Filled rule, which always matches (the input has no placeholder).
// Active / Error / Success draw the 4px 20% ring outside the box (Figma's "Active" frame wraps the
// Input frame); Input's inset ring would run over the −/+ buttons, which sit only 4–10px in.
const counterInputVariants = cva(
  "w-full shadow-[0_0_0_4px_var(--input-ring)]! -outline-offset-1! not-data-filled:not-data-[status=active]:not-data-[status=success]:not-has-[[aria-invalid=true]]:not-has-[input:disabled]:not-has-[input:focus-visible]:[--input-fg:var(--base-600)]! not-data-filled:not-data-[status=active]:not-data-[status=success]:not-has-[[aria-invalid=true]]:not-has-[input:disabled]:not-has-[input:focus-visible]:[--input-stroke:var(--base-100)]!",
  {
    variants: {
      size: {
        "60": "px-2.5",
        "48": "px-2",
        "40": "px-1.5",
        "32": "px-1",
        "24": "px-1",
      },
    },
    defaultVariants: {
      size: "40",
    },
  }
)

// Counter-Button −/+: a bare icon button as big as its icon; the hovered one turns primary.
// status="hover-decrement" / "hover-increment" on Counter pins Figma's Hover Remove / Hover Add.
const counterButtonVariants = cva(
  "text-base-700 outline-base-alpha-20 hover:text-primary-600 hover:opacity-100 data-disabled:text-base-200",
  {
    variants: {
      kind: {
        decrement: "group-data-[status=hover-decrement]/counter:text-primary-600",
        increment: "group-data-[status=hover-increment]/counter:text-primary-600",
      },
      size: {
        "60": "[--btn-icon:--spacing(6)]",
        "48": "[--btn-icon:--spacing(6)]",
        "40": "[--btn-icon:--spacing(5)]",
        "32": "[--btn-icon:--spacing(5)]",
        "24": "[--btn-icon:--spacing(4)]",
      },
    },
    defaultVariants: {
      size: "40",
    },
  }
)

// Button sizes per counter size: Counter-Button (icon box = icon) and Counter-Input (outline Button).
const bareButtonSize: Record<CounterSize, ButtonSize> = {
  "60": "icon-24",
  "48": "icon-24",
  "40": "icon-20",
  "32": "icon-20",
  "24": "icon-16",
}
const outlineButtonSize: Record<CounterSize, ButtonSize> = {
  "60": "icon-40",
  "48": "icon-32",
  "40": "icon-28",
  "32": "icon-24",
  "24": "icon-16",
}

type CounterContextValue = {
  size: CounterSize
  shape: CounterShape
  appearance: CounterAppearance
  invalid: boolean
}

const CounterContext = React.createContext<CounterContextValue>({
  size: "40",
  shape: "rounded",
  appearance: "button",
  invalid: false,
})

type CounterProps = Omit<NumberField.Root.Props, "className" | "render"> &
  VariantProps<typeof counterVariants> & {
    className?: string
    /** Counter-Button (compact) or Counter-Input (InputGroup box, use inside Field). */
    appearance?: CounterAppearance
    /**
     * Pinned Figma states for previews. Counter-Input: filled / active / success (Error = aria-invalid).
     * Counter-Button: hover-decrement / hover-increment (real hover gets the same look).
     */
    status?: CounterStatus
    "aria-invalid"?: boolean
    "aria-label"?: string
  }

/**
 * Figma Counter. Without children it renders − / value / +. Defaults: min 0, no max, step 1;
 * at min the − button is disabled, at max the + button.
 */
function Counter({
  className,
  size = "40",
  shape = "rounded",
  appearance = "button",
  status = "default",
  min = 0,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  onValueChange,
  children,
  ...props
}: CounterProps) {
  const sizeKey = size ?? "40"
  const shapeKey = shape ?? "rounded"
  const [changed, setChanged] = React.useState(false)
  const context = React.useMemo(
    () => ({ size: sizeKey, shape: shapeKey, appearance, invalid: !!ariaInvalid }),
    [sizeKey, shapeKey, appearance, ariaInvalid]
  )

  const content = children ?? (
    <>
      <CounterDecrement />
      <CounterValue aria-label={ariaLabel} />
      <CounterIncrement />
    </>
  )

  return (
    <CounterContext.Provider value={context}>
      <NumberField.Root
        data-slot="counter"
        min={min}
        onValueChange={(value, details) => {
          setChanged(true)
          onValueChange?.(value, details)
        }}
        className={cn(appearance === "button" ? "w-fit" : "w-full", className)}
        {...props}
      >
        {appearance === "input" ? (
          <NumberField.Group
            data-slot="counter-group"
            data-filled={status === "filled" || changed || undefined}
            render={
              <InputGroup
                size={sizeKey}
                shape={shapeKey}
                status={status === "active" || status === "success" ? status : "default"}
              />
            }
            className={counterInputVariants({ size: sizeKey })}
          >
            {content}
          </NumberField.Group>
        ) : (
          <NumberField.Group
            data-slot="counter-group"
            data-size={sizeKey}
            data-status={status}
            className={counterVariants({ size: sizeKey, shape: shapeKey })}
          >
            {content}
          </NumberField.Group>
        )}
      </NumberField.Root>
    </CounterContext.Provider>
  )
}

function useCounterButton(kind: "decrement" | "increment") {
  const { size, shape, appearance } = React.useContext(CounterContext)
  const icon = (
    <ButtonIcon src={kind === "decrement" ? "/icons/material-remove.svg" : "/icons/material-add.svg"} />
  )
  const label = kind === "decrement" ? "Decrease" : "Increase"
  const button =
    appearance === "input" ? (
      <Button variant="outline" size={outlineButtonSize[size]} shape={shape} />
    ) : (
      <Button variant="bare" size={bareButtonSize[size]} className={counterButtonVariants({ size, kind })} />
    )
  return { icon, label, button, appearance }
}

/** Figma material-remove (Counter-Button) / start Outline-Button (Counter-Input). */
function CounterDecrement({ className, children, ...props }: NumberField.Decrement.Props) {
  const { icon, label, button, appearance } = useCounterButton("decrement")
  const control = (
    <NumberField.Decrement
      data-slot="counter-decrement"
      aria-label={label}
      render={button}
      className={className}
      {...props}
    >
      {children ?? icon}
    </NumberField.Decrement>
  )
  return appearance === "input" ? <InputGroupAddon align="inline-start">{control}</InputGroupAddon> : control
}

/** Figma material-add (Counter-Button) / end Outline-Button (Counter-Input). */
function CounterIncrement({ className, children, ...props }: NumberField.Increment.Props) {
  const { icon, label, button, appearance } = useCounterButton("increment")
  const control = (
    <NumberField.Increment
      data-slot="counter-increment"
      aria-label={label}
      render={button}
      className={className}
      {...props}
    >
      {children ?? icon}
    </NumberField.Increment>
  )
  return appearance === "input" ? <InputGroupAddon align="inline-end">{control}</InputGroupAddon> : control
}

/** Figma Text "0": the editable value. Hugs its digits in Counter-Button, centered in Counter-Input. */
function CounterValue({ className, ...props }: NumberField.Input.Props) {
  const { appearance, invalid } = React.useContext(CounterContext)
  if (appearance === "input") {
    return (
      <NumberField.Input
        aria-invalid={invalid || undefined}
        render={<InputGroupInput />}
        className={cn("text-center font-bold", className)}
        {...props}
      />
    )
  }
  return (
    <NumberField.Input
      data-slot="counter-value"
      aria-invalid={invalid || undefined}
      className={cn(
        "min-w-2 bg-transparent text-center text-inherit outline-none field-sizing-content disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export {
  Counter,
  CounterDecrement,
  CounterIncrement,
  CounterValue,
  counterVariants,
  type CounterAppearance,
  type CounterShape,
  type CounterStatus,
  type CounterSize,
}
