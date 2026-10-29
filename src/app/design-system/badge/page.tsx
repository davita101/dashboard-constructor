import { CircleIcon, StarIcon, XIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge, BadgeDot, type BadgeColor, type BadgeSize, type BadgeVariant } from "@/components/ui/badge"

// Mirrors the Figma Badges page (4313:16170).

const colors: BadgeColor[] = [
  "primary", "green", "orange", "purple", "red", "yellow", "pink", "amber", "emerald",
  "lime", "fuchsia", "violet", "indigo", "blue", "sky", "rose", "teal", "cyan", "dark",
]
const tones = ["solid", "soft", "soft-border"] as const satisfies BadgeVariant[]
const plain = ["base", "black", "black-soft", "white", "white-soft", "ghost", "gray"] as const satisfies BadgeVariant[]
const labelSizes = ["32", "24", "20", "16"] as const satisfies BadgeSize[]
const squareSizes = [
  "square-60", "square-48", "square-40", "square-32", "square-24", "square-20", "square-16", "square-12",
] as const satisfies BadgeSize[]
const shapes = ["pill", "rounded"] as const
const avatarSize = { "32": "20", "24": "16", "20": "16", "16": "12" } as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Each variant row, with the soft-on-color styles on a dark strip so they stay readable. */
function Rows({ render }: { render: (props: { variant: BadgeVariant; color?: BadgeColor }) => React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 overflow-x-auto">
      {colors.flatMap((color) =>
        tones.map((variant) => (
          <div key={`${color}-${variant}`} className="flex items-center gap-4">
            {render({ variant, color })}
          </div>
        ))
      )}
      {plain.map((variant) => (
        <div
          key={variant}
          data-on-dark={variant.startsWith("white") || variant === "black-soft" || undefined}
          className="flex w-fit items-center gap-4 rounded-r8 p-1 data-on-dark:bg-base-800"
        >
          {render({ variant })}
        </div>
      ))}
    </div>
  )
}

export default function BadgePreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Badge-Default (Pilled, Rounded)">
        <Rows
          render={(props) =>
            shapes.flatMap((shape) =>
              labelSizes.map((size) => (
                <Badge key={`${shape}-${size}`} {...props} size={size} shape={shape}>
                  BADGE
                </Badge>
              ))
            )
          }
        />
      </Section>

      <Section title="Badge-Default slots: icons, dot, avatar">
        {(["solid", "soft-border"] as const).map((variant) =>
          shapes.map((shape) => (
            <div key={`${variant}-${shape}`} className="flex flex-wrap items-center gap-4">
              {labelSizes.map((size) => (
                <div key={size} className="flex items-center gap-2">
                  <Badge variant={variant} size={size} shape={shape}>
                    <StarIcon data-icon="inline-start" />
                    BADGE
                    <XIcon data-icon="inline-end" />
                  </Badge>
                  <Badge variant={variant} size={size} shape={shape}>
                    <BadgeDot />
                    BADGE
                  </Badge>
                  <Badge variant={variant} size={size} shape={shape}>
                    <Avatar size={avatarSize[size]} shape={shape === "pill" ? "circle" : "rounded"}>
                      <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    BADGE
                  </Badge>
                </div>
              ))}
            </div>
          ))
        )}
      </Section>

      <Section title="Badge-Square (Pilled, Rounded)">
        <Rows
          render={(props) =>
            shapes.flatMap((shape) =>
              squareSizes.map((size) => (
                <Badge key={`${shape}-${size}`} {...props} size={size} shape={shape}>
                  1
                </Badge>
              ))
            )
          }
        />
        <div className="flex items-center gap-4">
          {squareSizes.map((size) => (
            <Badge key={size} variant="solid" color="red" size={size}>
              99+
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Badge-Icon (Pilled, Rounded)">
        <Rows
          render={(props) =>
            shapes.flatMap((shape) =>
              squareSizes.map((size) => (
                <Badge key={`${shape}-${size}`} {...props} size={size} shape={shape} aria-label="Status">
                  <CircleIcon />
                </Badge>
              ))
            )
          }
        />
      </Section>
    </main>
  )
}
