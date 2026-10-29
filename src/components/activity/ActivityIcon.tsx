import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Commerce Constructor 7.7 — Activity-Icon-Component (Figma 11109:1497)
// Type × Size (32 / 24 / 20) × Corner (Pilled / Rounded) × Style (Soft / Fill)

const tones = {
  green: {
    soft: "outline-green-alpha-10 from-green-alpha-5 to-green-alpha-15",
    fill: "outline-green-500 from-green-525 to-green-625 shadow-[0_1px_4px_0_var(--shadow-green)]",
  },
  cyan: {
    soft: "outline-cyan-alpha-10 from-cyan-alpha-5 to-cyan-alpha-15",
    fill: "outline-cyan-450 from-cyan-500 to-cyan-600 shadow-[0_1px_4px_0_var(--shadow-cyan)]",
  },
  purple: {
    soft: "outline-purple-alpha-10 from-purple-alpha-5 to-purple-alpha-15",
    fill: "outline-purple-450 from-purple-500 to-purple-600 shadow-[0_1px_4px_0_var(--shadow-purple)]",
  },
  yellow: {
    soft: "outline-yellow-alpha-10 from-yellow-alpha-5 to-yellow-alpha-15",
    fill: "outline-yellow-375 from-yellow-425 to-yellow-550 shadow-[0_1px_4px_0_var(--shadow-yellow)]",
  },
  emerald: {
    soft: "outline-emerald-alpha-10 from-emerald-alpha-5 to-emerald-alpha-15",
    fill: "outline-emerald-450 from-emerald-500 to-emerald-600 shadow-[0_1px_4px_0_var(--shadow-emerald)]",
  },
  pink: {
    soft: "outline-pink-alpha-10 from-pink-alpha-5 to-pink-alpha-15",
    fill: "outline-pink-450 from-pink-500 to-pink-600 shadow-[0_1px_4px_0_var(--shadow-pink)]",
  },
  orange: {
    soft: "outline-orange-alpha-10 from-orange-alpha-5 to-orange-alpha-15",
    fill: "outline-orange-450 from-orange-500 to-orange-625 shadow-[0_1px_4px_0_var(--shadow-orange)]",
  },
  sky: {
    soft: "outline-sky-alpha-10 from-sky-alpha-5 to-sky-alpha-15",
    fill: "outline-sky-450 from-sky-500 to-sky-600 shadow-[0_1px_4px_0_var(--shadow-sky)]",
  },
  red: {
    soft: "outline-red-alpha-10 from-red-alpha-5 to-red-alpha-15",
    fill: "outline-red-475 from-red-500 to-red-600 shadow-[0_1px_4px_0_var(--shadow-red)]",
  },
  indigo: {
    soft: "outline-indigo-alpha-10 from-indigo-alpha-5 to-indigo-alpha-15",
    fill: "outline-indigo-450 from-indigo-500 to-indigo-600 shadow-[0_1px_4px_0_var(--shadow-indigo)]",
  },
  lime: {
    soft: "outline-lime-alpha-10 from-lime-alpha-5 to-lime-alpha-15",
    fill: "outline-lime-525 from-lime-550 to-lime-650 shadow-[0_1px_4px_0_var(--shadow-lime)]",
  },
  violet: {
    soft: "outline-violet-alpha-10 from-violet-alpha-5 to-violet-alpha-15",
    fill: "outline-violet-475 from-violet-500 to-violet-600 shadow-[0_1px_4px_0_var(--shadow-violet)]",
  },
  teal: {
    soft: "outline-teal-alpha-10 from-teal-alpha-5 to-teal-alpha-15",
    fill: "outline-teal-450 from-teal-500 to-teal-600 shadow-[0_1px_4px_0_var(--shadow-teal)]",
  },
} as const

const activityTypeTone = {
  add: "green",
  image: "cyan",
  edit: "purple",
  notification: "yellow",
  file: "emerald",
  comment: "pink",
  remove: "orange",
  video: "sky",
  music: "red",
  sent: "indigo",
  view: "lime",
  done: "green",
  calendar: "violet",
  assign: "teal",
} as const satisfies Record<string, keyof typeof tones>

type ActivityType = keyof typeof activityTypeTone

const activityTypes = Object.keys(activityTypeTone) as ActivityType[]

const activityIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center bg-linear-to-b outline -outline-offset-1",
  {
    variants: {
      size: {
        default: "size-8 px-1.5",
        sm: "size-6 px-1",
        xs: "size-5 px-0.5",
      },
      corner: {
        pilled: "rounded-full",
        rounded: "rounded-r8",
      },
    },
    compoundVariants: [
      { corner: "rounded", size: ["sm", "xs"], className: "rounded-r6" },
    ],
    defaultVariants: {
      size: "default",
      corner: "pilled",
    },
  }
)

type ActivityIconProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof activityIconVariants> & {
    type: ActivityType
    variant?: "soft" | "fill"
  }

function ActivityIcon({
  type,
  variant = "soft",
  size = "default",
  corner,
  className,
  ...props
}: ActivityIconProps) {
  return (
    <span
      data-slot="activity-icon"
      data-type={type}
      className={cn(
        activityIconVariants({ size, corner }),
        tones[activityTypeTone[type]][variant],
        className
      )}
      {...props}
    >
      {/* 24/20px sizes use the 12px glyph: same Material path as the 16px asset, scaled 0.75. */}
      <Image
        src={`/icons/activity/${type}-${variant}.svg`}
        alt=""
        width={16}
        height={16}
        className={cn("pointer-events-none", size === "default" ? "size-4" : "size-3")}
      />
    </span>
  )
}

export { ActivityIcon, activityIconVariants, activityTypes, type ActivityType }
