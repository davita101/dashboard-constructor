import { cva, type VariantProps } from "class-variance-authority"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Figma Steps page (4313:48088). One `Step` serves every Figma step atom through `layout`:
//   inline   Step-Component-01 (numbered circle + title/description on the right), sizes 60/48/40/32
//   tab      Step-Component-02 (eyebrow + heading with a 1px line on top or bottom)
//   stacked  Step-Component-03 (line / circle / line head, centered text below)
//   list     Step-Component-04 (vertical line above the circle, text on the right)
//   compact  Step-Group-05 item (40px circle with a 16px connector)
// `Step` sets the slot colors as CSS vars so the slots (indicator, title, description, line)
// follow its status/variant without React context:
//   --step-accent / --step-accent-from / --step-accent-soft / --step-accent-fg (variant)
//   --step-from / --step-to / --step-stroke / --step-fg (indicator), --step-title / --step-desc, --step-line.

type StepStatus = "current" | "upcoming" | "done" | "disabled"

const stepsVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
    // Step-Group-01 Hug gaps: Large/Default 28, Small 24, Extra Small 20 (vertical: 20 everywhere).
    spacing: {
      none: "gap-0",
      sm: "gap-5",
      md: "gap-6",
      lg: "gap-7",
    },
    fill: {
      true: "w-full justify-between",
      false: "w-fit",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    spacing: "none",
    fill: false,
  },
})

/** Figma Step-Group-01..05: an ordered list of `Step`s. */
function Steps({
  className,
  orientation = "horizontal",
  spacing,
  fill = false,
  ...props
}: React.ComponentProps<"ol"> & VariantProps<typeof stepsVariants>) {
  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      data-fill={fill ? "true" : "false"}
      className={cn("group/steps", stepsVariants({ orientation, spacing, fill }), className)}
      {...props}
    />
  )
}

const stepVariants = cva(
  "group/step relative flex shrink-0 font-default tracking-default [--step-line:var(--step-accent)]",
  {
    variants: {
      layout: {
        inline:
          "items-center [--step-desc:var(--base-500)] [--step-fg:var(--base-800)] [--step-from:var(--background-0)] [--step-stroke:var(--base-100)] [--step-title:var(--base-800)] [--step-to:var(--background-0)]",
        tab: "min-w-30 flex-col gap-4 group-data-[fill=true]/steps:flex-1 [--step-desc:var(--base-400)] [--step-title:var(--base-500)]",
        stacked:
          "w-37 flex-col items-center gap-4 text-center [--step-desc:var(--base-500)] [--step-fg:var(--base-500)] [--step-from:var(--background-0)] [--step-stroke:var(--base-200)] [--step-title:var(--base-800)] [--step-to:var(--background-0)]",
        list: "items-end gap-6 [--step-desc:var(--base-300)] [--step-fg:var(--base-800)] [--step-from:var(--background-0)] [--step-stroke:var(--base-200)] [--step-title:var(--base-800)] [--step-to:var(--background-0)]",
        compact:
          "items-center [--step-fg:var(--base-800)] [--step-from:var(--background-0)] [--step-stroke:var(--base-200)] [--step-to:var(--background-0)]",
      },
      // Figma Size (circle): 60 Extra Large, 48 Large, 40 Default, 32 Small. Only `inline` resizes.
      size: {
        "60": "",
        "48": "",
        "40": "",
        "32": "",
      },
      status: {
        current: "",
        upcoming: "",
        done: "",
        disabled: "",
      },
      // Figma Primary / Dark styles.
      variant: {
        primary:
          "[--step-accent-fg:var(--primary-50)] [--step-accent-from:var(--primary-500)] [--step-accent-soft:var(--primary-500)] [--step-accent:var(--primary-600)]",
        "primary-dark": "[--step-accent-fg:var(--background-0)] [--step-accent-from:var(--base-700)] [--step-accent-soft:var(--base-700)] [--step-accent:var(--base-900)]",
      },
    },
    compoundVariants: [
      // Step-Component-01 circle-to-text gap: 20 / 20 / 16 / 12.
      { layout: "inline", size: "60", className: "gap-5" },
      { layout: "inline", size: "48", className: "gap-5" },
      { layout: "inline", size: "40", className: "gap-4" },
      { layout: "inline", size: "32", className: "gap-3" },
      // Selected: gradient circle, accent text.
      {
        layout: "inline",
        status: "current",
        className:
          "[--step-desc:var(--step-accent)] [--step-fg:var(--step-accent-fg)] [--step-from:var(--step-accent-from)] [--step-stroke:var(--step-accent)] [--step-title:var(--step-accent)] [--step-to:var(--step-accent)]",
      },
      // Done: green circle with a check, green text (Figma has no Dark Done here).
      {
        layout: "inline",
        status: "done",
        className:
          "[--step-desc:var(--success-600)] [--step-fg:var(--background-0)] [--step-from:var(--success-500)] [--step-stroke:var(--success-600)] [--step-title:var(--success-600)] [--step-to:var(--success-600)]",
      },
      {
        layout: ["inline", "stacked", "list", "compact"],
        status: "disabled",
        className:
          "[--step-desc:var(--base-200)] [--step-fg:var(--base-200)] [--step-from:var(--background-20)] [--step-stroke:var(--base-50)] [--step-title:var(--base-200)] [--step-to:var(--background-20)]",
      },
      // Active: white circle with an accent ring and dot (or number).
      {
        layout: ["stacked", "list", "compact"],
        status: "current",
        className: "[--step-fg:var(--step-accent)] [--step-stroke:var(--step-accent)] [--step-title:var(--step-accent)]",
      },
      { layout: "stacked", status: "current", className: "[--step-desc:var(--step-accent)]" },
      // Done: solid accent circle with a check.
      {
        layout: ["stacked", "list", "compact"],
        status: "done",
        className:
          "[--step-fg:var(--background-0)] [--step-from:var(--step-accent)] [--step-stroke:var(--step-accent)] [--step-to:var(--step-accent)]",
      },
      // Step-Component-02 Selected: eyebrow 500, heading 600 (Dark: 700 / 800). The line is
      // base-800 on both Primary and Dark (Figma export; node data said primary-600).
      {
        layout: "tab",
        status: "current",
        className:
          "[--step-desc:var(--step-accent-soft)] [--step-line:var(--base-800)] [--step-title:var(--step-accent)]",
      },
      { layout: "tab", variant: "primary-dark", className: "[--step-accent:var(--base-800)]" },
    ],
    defaultVariants: {
      layout: "inline",
      size: "40",
      status: "upcoming",
      variant: "primary",
    },
  }
)

type StepProps = React.ComponentProps<"li"> & VariantProps<typeof stepVariants>

/** One step. `status`: current (Figma Selected / Active), upcoming (Default / Not Active), done, disabled. */
function Step({ className, layout = "inline", size = "40", status = "upcoming", variant = "primary", ...props }: StepProps) {
  return (
    <li
      data-slot="step"
      data-layout={layout}
      data-size={size}
      data-status={status}
      data-variant={variant}
      aria-current={status === "current" ? "step" : undefined}
      aria-disabled={status === "disabled" || undefined}
      className={cn(stepVariants({ layout, size, status, variant }), className)}
      {...props}
    />
  )
}

// Figma `Step` circle: pill, gradient fill (flat unless Selected), 1px inside stroke.
const stepIndicatorVariants = cva(
  "relative flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-(--step-from) to-(--step-to) text-12 leading-16 font-semibold text-(--step-fg) outline -outline-offset-1 outline-(--step-stroke) group-data-[size=32]/step:group-data-[layout=inline]/step:size-8 group-data-[size=48]/step:group-data-[layout=inline]/step:size-12 group-data-[size=60]/step:group-data-[layout=inline]/step:size-15"
)

// Check glyph: 28 / 24 / 20 / 16 for circles 60 / 48 / 40 / 32.
const stepGlyphClass =
  "hidden size-5 bg-(--step-fg) mask-[url(/icons/material-check.svg)] mask-contain mask-center mask-no-repeat group-data-[status=done]/step:block group-data-[size=32]/step:group-data-[layout=inline]/step:size-4 group-data-[size=48]/step:group-data-[layout=inline]/step:size-6 group-data-[size=60]/step:group-data-[layout=inline]/step:size-7"

/**
 * Step circle. `children` is the number; Done shows the check instead. With no children, an
 * Active (current) step in the stacked/list/compact layouts shows the 8px dot.
 */
function StepIndicator({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="step-indicator" className={cn(stepIndicatorVariants(), className)} {...props}>
      {children == null ? (
        <span
          aria-hidden
          className="hidden size-2 rounded-full bg-(--step-fg) group-data-[status=current]/step:block"
        />
      ) : (
        <span className="group-data-[status=done]/step:sr-only">{children}</span>
      )}
      <span aria-hidden className={stepGlyphClass} />
    </span>
  )
}

/** Head row of the stacked layout (line / circle / line) or the column of the list layout. */
function StepHead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="step-head"
      className={cn(
        "flex items-center group-data-[layout=list]/step:flex-col group-data-[layout=stacked]/step:w-full",
        className
      )}
      {...props}
    />
  )
}

/** Text column: `StepTitle` over `StepDescription` (tab: eyebrow `StepDescription` over `StepTitle`). */
function StepContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="step-content"
      className={cn(
        "flex flex-col group-data-[layout=stacked]/step:gap-1 group-data-[layout=tab]/step:gap-2 group-data-[layout=tab]/step:px-2",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Step" / "Heading Step": 14/20 semibold (12/16 on Small inline). */
function StepTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="step-title"
      className={cn(
        "text-14 leading-20 font-semibold whitespace-nowrap text-(--step-title) group-data-[size=32]/step:group-data-[layout=inline]/step:text-12 group-data-[size=32]/step:group-data-[layout=inline]/step:leading-16",
        className
      )}
      {...props}
    />
  )
}

/** Figma "Description" (12/16) / "About Heading Step" (12/20) / tab eyebrow "Step" (12/16). */
function StepDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="step-description"
      className={cn(
        "text-12 leading-16 font-semibold whitespace-nowrap text-(--step-desc) group-data-[layout=list]/step:leading-20 group-data-[layout=stacked]/step:leading-20 group-data-[layout=tab]/step:font-medium",
        className
      )}
      {...props}
    />
  )
}

// Connector lines: stacked 2px (fills the head), list 2x20 vertical, compact 16x1, tab 1px full width.
const stepSeparatorVariants = cva(
  "bg-base-200 data-[reached=true]:bg-(--step-line) data-[spacer=true]:invisible group-data-[layout=compact]/step:data-horizontal:w-4 group-data-[layout=stacked]/step:flex-1 group-data-[layout=stacked]/step:data-horizontal:h-0.5 data-vertical:h-5 data-vertical:w-0.5 data-vertical:self-center"
)

/** Step connector, a `Separator`. `reached` paints it in the accent; `spacer` keeps its room but hides it. */
function StepSeparator({
  className,
  reached = false,
  spacer = false,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Separator> & { reached?: boolean; spacer?: boolean }) {
  return (
    <Separator
      data-slot="step-separator"
      data-reached={reached ? "true" : "false"}
      data-spacer={spacer ? "true" : "false"}
      orientation={orientation}
      className={cn(stepSeparatorVariants(), className)}
      {...props}
    />
  )
}

// Figma Steps-Dot: 8px; Default base-100, Select accent, Hover adds a 4px accent halo.
const stepsDotVariants = cva(
  "size-2 shrink-0 cursor-pointer rounded-full bg-base-100 transition-shadow outline-none focus-visible:shadow-[0_0_0_4px_var(--base-alpha-20)]",
  {
    variants: {
      variant: {
        primary: "data-[selected=true]:bg-primary-600 data-[selected=true]:hover:shadow-[0_0_0_4px_var(--primary-alpha-20)]",
        "primary-dark": "data-[selected=true]:bg-base-900 data-[selected=true]:hover:shadow-[0_0_0_4px_var(--base-alpha-20)]",
      },
      state: {
        default: "hover:shadow-[0_0_0_4px_var(--base-alpha-10)]",
        hover: "",
      },
    },
    compoundVariants: [
      { variant: "primary", state: "hover", className: "shadow-[0_0_0_4px_var(--primary-alpha-20)]" },
      { variant: "primary-dark", state: "hover", className: "shadow-[0_0_0_4px_var(--base-alpha-20)]" },
    ],
    defaultVariants: { variant: "primary", state: "default" },
  }
)

/** Figma Steps-Dot. A button so it can jump to its step; `state="hover"` pins the Hover look. */
function StepsDot({
  className,
  selected = false,
  variant,
  state,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof stepsDotVariants> & { selected?: boolean }) {
  return (
    <button
      type="button"
      data-slot="steps-dot"
      data-selected={selected ? "true" : "false"}
      aria-current={selected ? "step" : undefined}
      className={cn(stepsDotVariants({ variant, state }), className)}
      {...props}
    />
  )
}

/** Figma Steps-Group-Dot: "Step x of y" label (`StepsDotLabel`) + dots 12px apart. */
function StepsDotGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="steps-dot-group"
      className={cn("flex items-center gap-4 font-default tracking-default", className)}
      {...props}
    />
  )
}

function StepsDotList({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="steps-dot-list" className={cn("flex items-center gap-3", className)} {...props} />
}

function StepsDotLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="steps-dot-label"
      className={cn("text-14 leading-20 font-semibold whitespace-nowrap text-base-800", className)}
      {...props}
    />
  )
}

export {
  Step,
  StepContent,
  StepDescription,
  StepHead,
  StepIndicator,
  Steps,
  StepsDot,
  StepsDotGroup,
  StepsDotLabel,
  StepsDotList,
  StepSeparator,
  StepTitle,
  stepIndicatorVariants,
  stepSeparatorVariants,
  stepsDotVariants,
  stepsVariants,
  stepVariants,
  type StepStatus,
}
