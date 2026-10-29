import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Badge-Default / Badge-Square / Badge-Icon, -Pilled and -Rounded (Badges page 4313:16170).
// `color` sets the palette as CSS vars; `variant` picks which of them paint the badge:
// --badge-from/to (solid fill), --badge-stroke-from/to (solid stroke), --badge-on (solid text),
// --badge-soft (soft text), --badge-shadow, --badge-a5/a10/a15/a20 (soft fill and stroke).
// The 1px stroke is a masked ::before so it sits inside the box, like Figma strokes.
const stroke =
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-b before:p-px before:[mask:linear-gradient(black_0_0)_content-box_exclude,linear-gradient(black_0_0)]"

const badgeVariants = cva(
  "group/badge relative inline-flex w-fit shrink-0 items-center justify-center gap-(--badge-gap) overflow-hidden px-(--badge-px) font-default tracking-default whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-primary-alpha-30 has-data-[icon=inline-end]:pe-(--badge-icon-px) has-data-[icon=inline-start]:ps-(--badge-icon-px) has-[>[data-slot=avatar]:first-child]:ps-(--badge-avatar-px) [&>svg]:pointer-events-none [&>svg]:size-(--badge-icon) [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        solid: `${stroke} bg-linear-to-b from-(--badge-from) to-(--badge-to) text-(--badge-on) shadow-[0_1px_2px_0_var(--badge-shadow)] before:from-(--badge-stroke-from) before:to-(--badge-stroke-to)`,
        soft: "bg-linear-to-b from-(--badge-a5) to-(--badge-a15) text-(--badge-soft)",
        "soft-border": `${stroke} bg-linear-to-b from-(--badge-a5) to-(--badge-a15) text-(--badge-soft) before:from-(--badge-a10) before:to-(--badge-a20)`,
        // Figma Base / Black / Black Soft / White / White Soft / Ghost / Gray (no color)
        base: `${stroke} bg-base-0 text-base-800 shadow-[0_1px_2px_0_var(--shadow-base)] before:from-base-100 before:to-base-100`,
        black: "bg-black text-background-0",
        "black-soft": "bg-black-alpha-20 text-background-0",
        white: "bg-background-0 text-black",
        "white-soft": "bg-white-alpha-20 text-background-0",
        ghost: "text-base-800",
        gray: "bg-gray-50 text-gray-800",
      },
      color: {
        primary:
          "[--badge-a10:var(--primary-alpha-10)] [--badge-a15:var(--primary-alpha-15)] [--badge-a20:var(--primary-alpha-20)] [--badge-a5:var(--primary-alpha-5)] [--badge-from:var(--primary-525)] [--badge-on:var(--primary-25)] [--badge-shadow:var(--shadow-primary)] [--badge-soft:var(--primary-600)] [--badge-stroke-from:var(--primary-475)] [--badge-stroke-to:var(--primary-675)] [--badge-to:var(--primary-625)]",
        dark: "[--badge-a10:var(--base-alpha-10)] [--badge-a15:var(--base-alpha-15)] [--badge-a20:var(--base-alpha-20)] [--badge-a5:var(--base-alpha-5)] [--badge-from:var(--base-800)] [--badge-on:var(--background-0)] [--badge-shadow:var(--shadow-base)] [--badge-soft:var(--base-900)] [--badge-stroke-from:var(--base-750)] [--badge-stroke-to:var(--base-900)] [--badge-to:var(--base-900)]",
        green:
          "[--badge-a10:var(--green-alpha-10)] [--badge-a15:var(--green-alpha-15)] [--badge-a20:var(--green-alpha-20)] [--badge-a5:var(--green-alpha-5)] [--badge-from:var(--green-525)] [--badge-on:var(--green-25)] [--badge-shadow:var(--shadow-green)] [--badge-soft:var(--green-650)] [--badge-stroke-from:var(--green-500)] [--badge-stroke-to:var(--green-650)] [--badge-to:var(--green-625)]",
        lime: "[--badge-a10:var(--lime-alpha-10)] [--badge-a15:var(--lime-alpha-15)] [--badge-a20:var(--lime-alpha-20)] [--badge-a5:var(--lime-alpha-5)] [--badge-from:var(--lime-550)] [--badge-on:var(--lime-25)] [--badge-shadow:var(--shadow-lime)] [--badge-soft:var(--lime-650)] [--badge-stroke-from:var(--lime-525)] [--badge-stroke-to:var(--lime-675)] [--badge-to:var(--lime-650)]",
        fuchsia:
          "[--badge-a10:var(--fuchsia-alpha-10)] [--badge-a15:var(--fuchsia-alpha-15)] [--badge-a20:var(--fuchsia-alpha-20)] [--badge-a5:var(--fuchsia-alpha-5)] [--badge-from:var(--fuchsia-500)] [--badge-on:var(--fuchsia-25)] [--badge-shadow:var(--shadow-fuchsia)] [--badge-soft:var(--fuchsia-650)] [--badge-stroke-from:var(--fuchsia-450)] [--badge-stroke-to:var(--fuchsia-650)] [--badge-to:var(--fuchsia-600)]",
        violet:
          "[--badge-a10:var(--violet-alpha-10)] [--badge-a15:var(--violet-alpha-15)] [--badge-a20:var(--violet-alpha-20)] [--badge-a5:var(--violet-alpha-5)] [--badge-from:var(--violet-500)] [--badge-on:var(--violet-25)] [--badge-shadow:var(--shadow-violet)] [--badge-soft:var(--violet-650)] [--badge-stroke-from:var(--violet-475)] [--badge-stroke-to:var(--violet-650)] [--badge-to:var(--violet-600)]",
        indigo:
          "[--badge-a10:var(--indigo-alpha-10)] [--badge-a15:var(--indigo-alpha-15)] [--badge-a20:var(--indigo-alpha-20)] [--badge-a5:var(--indigo-alpha-5)] [--badge-from:var(--indigo-500)] [--badge-on:var(--indigo-50)] [--badge-shadow:var(--shadow-indigo)] [--badge-soft:var(--indigo-650)] [--badge-stroke-from:var(--indigo-450)] [--badge-stroke-to:var(--indigo-650)] [--badge-to:var(--indigo-600)]",
        blue: "[--badge-a10:var(--blue-alpha-10)] [--badge-a15:var(--blue-alpha-15)] [--badge-a20:var(--blue-alpha-20)] [--badge-a5:var(--blue-alpha-5)] [--badge-from:var(--blue-500)] [--badge-on:var(--blue-25)] [--badge-shadow:var(--shadow-blue)] [--badge-soft:var(--blue-650)] [--badge-stroke-from:var(--blue-450)] [--badge-stroke-to:var(--blue-675)] [--badge-to:var(--blue-600)]",
        orange:
          "[--badge-a10:var(--orange-alpha-10)] [--badge-a15:var(--orange-alpha-15)] [--badge-a20:var(--orange-alpha-20)] [--badge-a5:var(--orange-alpha-5)] [--badge-from:var(--orange-500)] [--badge-on:var(--orange-25)] [--badge-shadow:var(--shadow-orange)] [--badge-soft:var(--orange-650)] [--badge-stroke-from:var(--orange-450)] [--badge-stroke-to:var(--orange-650)] [--badge-to:var(--orange-625)]",
        purple:
          "[--badge-a10:var(--purple-alpha-10)] [--badge-a15:var(--purple-alpha-15)] [--badge-a20:var(--purple-alpha-20)] [--badge-a5:var(--purple-alpha-5)] [--badge-from:var(--purple-500)] [--badge-on:var(--purple-25)] [--badge-shadow:var(--shadow-purple)] [--badge-soft:var(--purple-650)] [--badge-stroke-from:var(--purple-450)] [--badge-stroke-to:var(--purple-650)] [--badge-to:var(--purple-600)]",
        red: "[--badge-a10:var(--red-alpha-10)] [--badge-a15:var(--red-alpha-15)] [--badge-a20:var(--red-alpha-20)] [--badge-a5:var(--red-alpha-5)] [--badge-from:var(--red-500)] [--badge-on:var(--red-25)] [--badge-shadow:var(--shadow-red)] [--badge-soft:var(--red-650)] [--badge-stroke-from:var(--red-475)] [--badge-stroke-to:var(--red-650)] [--badge-to:var(--red-600)]",
        yellow:
          "[--badge-a10:var(--yellow-alpha-10)] [--badge-a15:var(--yellow-alpha-15)] [--badge-a20:var(--yellow-alpha-20)] [--badge-a5:var(--yellow-alpha-5)] [--badge-from:var(--yellow-425)] [--badge-on:var(--yellow-25)] [--badge-shadow:var(--shadow-yellow)] [--badge-soft:var(--yellow-700)] [--badge-stroke-from:var(--yellow-375)] [--badge-stroke-to:var(--yellow-600)] [--badge-to:var(--yellow-550)]",
        sky: "[--badge-a10:var(--sky-alpha-10)] [--badge-a15:var(--sky-alpha-15)] [--badge-a20:var(--sky-alpha-20)] [--badge-a5:var(--sky-alpha-5)] [--badge-from:var(--sky-500)] [--badge-on:var(--sky-25)] [--badge-shadow:var(--shadow-sky)] [--badge-soft:var(--sky-650)] [--badge-stroke-from:var(--sky-450)] [--badge-stroke-to:var(--sky-625)] [--badge-to:var(--sky-600)]",
        pink: "[--badge-a10:var(--pink-alpha-10)] [--badge-a15:var(--pink-alpha-15)] [--badge-a20:var(--pink-alpha-20)] [--badge-a5:var(--pink-alpha-5)] [--badge-from:var(--pink-500)] [--badge-on:var(--pink-25)] [--badge-shadow:var(--shadow-pink)] [--badge-soft:var(--pink-650)] [--badge-stroke-from:var(--pink-450)] [--badge-stroke-to:var(--pink-650)] [--badge-to:var(--pink-600)]",
        rose: "[--badge-a10:var(--rose-alpha-10)] [--badge-a15:var(--rose-alpha-15)] [--badge-a20:var(--rose-alpha-20)] [--badge-a5:var(--rose-alpha-5)] [--badge-from:var(--rose-500)] [--badge-on:var(--rose-25)] [--badge-shadow:var(--shadow-rose)] [--badge-soft:var(--rose-650)] [--badge-stroke-from:var(--rose-475)] [--badge-stroke-to:var(--rose-675)] [--badge-to:var(--rose-600)]",
        amber:
          "[--badge-a10:var(--amber-alpha-10)] [--badge-a15:var(--amber-alpha-15)] [--badge-a20:var(--amber-alpha-20)] [--badge-a5:var(--amber-alpha-5)] [--badge-from:var(--amber-500)] [--badge-on:var(--amber-25)] [--badge-shadow:var(--shadow-amber)] [--badge-soft:var(--amber-650)] [--badge-stroke-from:var(--amber-475)] [--badge-stroke-to:var(--amber-625)] [--badge-to:var(--amber-600)]",
        teal: "[--badge-a10:var(--teal-alpha-10)] [--badge-a15:var(--teal-alpha-15)] [--badge-a20:var(--teal-alpha-20)] [--badge-a5:var(--teal-alpha-5)] [--badge-from:var(--teal-500)] [--badge-on:var(--teal-25)] [--badge-shadow:var(--shadow-teal)] [--badge-soft:var(--teal-650)] [--badge-stroke-from:var(--teal-450)] [--badge-stroke-to:var(--teal-625)] [--badge-to:var(--teal-600)]",
        emerald:
          "[--badge-a10:var(--emerald-alpha-10)] [--badge-a15:var(--emerald-alpha-15)] [--badge-a20:var(--emerald-alpha-20)] [--badge-a5:var(--emerald-alpha-5)] [--badge-from:var(--emerald-500)] [--badge-on:var(--emerald-25)] [--badge-shadow:var(--shadow-emerald)] [--badge-soft:var(--emerald-650)] [--badge-stroke-from:var(--emerald-450)] [--badge-stroke-to:var(--emerald-650)] [--badge-to:var(--emerald-600)]",
        cyan: "[--badge-a10:var(--cyan-alpha-10)] [--badge-a15:var(--cyan-alpha-15)] [--badge-a20:var(--cyan-alpha-20)] [--badge-a5:var(--cyan-alpha-5)] [--badge-from:var(--cyan-500)] [--badge-on:var(--cyan-25)] [--badge-shadow:var(--shadow-cyan)] [--badge-soft:var(--cyan-650)] [--badge-stroke-from:var(--cyan-450)] [--badge-stroke-to:var(--cyan-650)] [--badge-to:var(--cyan-600)]",
      },
      // Badge-Default heights (label), then Badge-Square / Badge-Icon boxes (count or icon).
      // Pill padding here; Rounded overrides in compoundVariants.
      size: {
        "32": "h-8 text-11 leading-20 font-semibold [--badge-avatar-px:--spacing(1.5)] [--badge-gap:--spacing(2)] [--badge-icon-px:--spacing(2.5)] [--badge-icon:--spacing(5)] [--badge-px:--spacing(3.5)] [--badge-r:var(--radius-r8)]",
        "24": "h-6 text-10 leading-16 font-semibold [--badge-avatar-px:--spacing(1.5)] [--badge-gap:--spacing(1.5)] [--badge-icon-px:--spacing(2)] [--badge-icon:--spacing(4)] [--badge-px:--spacing(3)] [--badge-r:var(--radius-r6)]",
        "20": "h-5 text-8 leading-12 font-bold [--badge-avatar-px:--spacing(0.5)] [--badge-gap:--spacing(1.5)] [--badge-icon-px:--spacing(1.5)] [--badge-icon:--spacing(3.5)] [--badge-px:--spacing(2)] [--badge-r:var(--radius-r6)]",
        "16": "h-4 text-8 leading-12 font-bold [--badge-avatar-px:--spacing(0.5)] [--badge-gap:--spacing(1)] [--badge-icon-px:--spacing(1.5)] [--badge-icon:--spacing(3)] [--badge-px:--spacing(2)] [--badge-r:var(--radius-r4)]",
        "square-60": "h-15 min-w-15 text-14 leading-24 font-bold [--badge-icon:--spacing(6)] [--badge-px:--spacing(6.5)] [--badge-r:var(--radius-r16)]",
        "square-48": "h-12 min-w-12 text-12 leading-20 font-bold [--badge-icon:--spacing(6)] [--badge-px:--spacing(5)] [--badge-r:var(--radius-r12)]",
        "square-40": "h-10 min-w-10 text-11 leading-20 font-bold [--badge-icon:--spacing(5)] [--badge-px:--spacing(4)] [--badge-r:var(--radius-r8)]",
        "square-32": "h-8 min-w-8 text-11 leading-20 font-bold [--badge-icon:--spacing(4)] [--badge-px:--spacing(3)] [--badge-r:var(--radius-r8)]",
        "square-24": "h-6 min-w-6 text-10 leading-16 font-bold [--badge-icon:--spacing(3)] [--badge-px:--spacing(2)] [--badge-r:var(--radius-r6)]",
        "square-20": "h-5 min-w-5 text-8 leading-12 font-bold [--badge-icon:--spacing(3)] [--badge-px:--spacing(1.5)] [--badge-r:var(--radius-r6)]",
        "square-16": "h-4 min-w-4 text-8 leading-12 font-bold [--badge-icon:--spacing(3)] [--badge-px:--spacing(1.25)] [--badge-r:var(--radius-r6)]",
        "square-12": "h-3 min-w-3 text-8 leading-12 font-bold [--badge-icon:--spacing(2)] [--badge-px:--spacing(0.75)] [--badge-r:var(--radius-r4)]",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-(--badge-r)",
      },
    },
    compoundVariants: [
      // Rounded labels sit tighter than pills below 32px
      { shape: "rounded", size: "24", className: "[--badge-gap:--spacing(1)] [--badge-icon-px:--spacing(1.5)] [--badge-px:--spacing(2)]" },
      { shape: "rounded", size: "20", className: "[--badge-gap:--spacing(1)] [--badge-icon-px:--spacing(1)] [--badge-px:--spacing(1.5)]" },
      { shape: "rounded", size: "16", className: "[--badge-icon-px:--spacing(1)] [--badge-px:--spacing(1.5)]" },
      { shape: "rounded", size: "32", className: "[--badge-avatar-px:--spacing(2)] [--badge-icon-px:--spacing(2)]" },
      // Badge-Icon: the icon fills a fixed square, no padding
      {
        size: ["square-60", "square-48", "square-40", "square-32", "square-24", "square-20", "square-16", "square-12"],
        className: "has-[>svg]:px-0",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "primary",
      size: "24",
      shape: "pill",
    },
  }
)

type BadgeVariantProps = VariantProps<typeof badgeVariants>
type BadgeColor = NonNullable<BadgeVariantProps["color"]>
type BadgeSize = NonNullable<BadgeVariantProps["size"]>
type BadgeVariant = NonNullable<BadgeVariantProps["variant"]>

function Badge({
  className,
  variant = "solid",
  color = "primary",
  size = "24",
  shape = "pill",
  render,
  ...props
}: Omit<useRender.ComponentProps<"span">, "color"> & BadgeVariantProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, color, size, shape }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  })
}

/** Figma "Dot": 6px status dot before the label, in the text color. */
function BadgeDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge-dot"
      data-icon="inline-start"
      aria-hidden
      className={cn("size-1.5 shrink-0 rounded-full bg-current", className)}
      {...props}
    />
  )
}

export { Badge, BadgeDot, badgeVariants, type BadgeColor, type BadgeSize, type BadgeVariant }
