import type { BadgeColor, BadgeSize, BadgeVariant } from "@/components/ui/badge"
import { Button, ButtonCounter, ButtonIcon, type ButtonSize, type ButtonVariant } from "@/components/ui/button"

// Mirrors the Figma Button page (321:0): every variant × Type × Size × Corner, plus Disabled.
// Hover, Active (press) and Focused (Tab) are live states.

const variants: ButtonVariant[] = [
  "primary", "primary-soft", "success", "success-soft", "warning", "warning-soft", "danger", "danger-soft",
  "dark", "dark-soft", "outline", "ghost", "black", "black-soft", "white", "white-soft",
]
const onDark: ButtonVariant[] = ["black-soft", "white", "white-soft"]
const sizes = ["60", "48", "40", "32", "28", "24", "20", "16"] as const satisfies ButtonSize[]
const shapes = ["pill", "rounded"] as const

// Figma Counter: badge style per button variant, badge size per button size
const counterStyle: Record<ButtonVariant, { variant: BadgeVariant; color?: BadgeColor }> = {
  primary: { variant: "white-soft" },
  success: { variant: "white-soft" },
  warning: { variant: "white-soft" },
  danger: { variant: "white-soft" },
  "primary-soft": { variant: "solid", color: "primary" },
  dark: { variant: "solid", color: "primary" },
  "dark-soft": { variant: "solid", color: "primary" },
  "success-soft": { variant: "solid", color: "green" },
  "warning-soft": { variant: "solid", color: "amber" },
  "danger-soft": { variant: "solid", color: "red" },
  outline: { variant: "base" },
  ghost: { variant: "base" },
  black: { variant: "white" },
  "black-soft": { variant: "white" },
  white: { variant: "black" },
  "white-soft": { variant: "white" },
  bare: { variant: "ghost" },
}
const counterSize: Record<(typeof sizes)[number], BadgeSize> = {
  "60": "square-24", "48": "square-24", "40": "square-20", "32": "square-16",
  "28": "square-16", "24": "square-16", "20": "square-12", "16": "square-12",
}

const defaultIcon = "/icons/material-default-icon.svg"
const dropdownIcon = "/icons/material-expand-more.svg"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** One row per variant; the on-color styles sit on a dark strip so they stay readable. */
function Rows({ render }: { render: (variant: ButtonVariant) => React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 overflow-x-auto">
      {variants.map((variant) => (
        <div
          key={variant}
          data-on-dark={onDark.includes(variant) || undefined}
          className="flex w-fit items-center gap-4 rounded-r12 p-2 data-on-dark:bg-primary-500"
        >
          <span className="w-24 shrink-0 font-default text-11 leading-20 text-base-500 in-data-on-dark:text-background-0">
            {variant}
          </span>
          {render(variant)}
        </div>
      ))}
    </div>
  )
}

export default function ButtonPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Type=Default: sizes 60 → 16 (Pilled, Rounded)">
        <Rows
          render={(variant) =>
            shapes.flatMap((shape) =>
              sizes.map((size) => (
                <Button key={`${shape}-${size}`} variant={variant} size={size} shape={shape}>
                  Button
                </Button>
              ))
            )
          }
        />
      </Section>

      <Section title="Slots: Left Icon, Right Icon, Dropdown, Counter (40)">
        <Rows
          render={(variant) =>
            shapes.map((shape) => (
              <div key={shape} className="flex items-center gap-3">
                <Button variant={variant} shape={shape}>
                  <ButtonIcon src={defaultIcon} />
                  Button
                </Button>
                <Button variant={variant} shape={shape}>
                  Button
                  <ButtonIcon src={defaultIcon} position="end" />
                </Button>
                <Button variant={variant} shape={shape}>
                  Button
                  <ButtonIcon src={dropdownIcon} position="end" />
                </Button>
                <Button variant={variant} shape={shape}>
                  Button
                  <ButtonCounter size={counterSize["40"]} {...counterStyle[variant]}>
                    1
                  </ButtonCounter>
                </Button>
              </div>
            ))
          }
        />
      </Section>

      <Section title="Slots across sizes (Primary, Outline)">
        {(["primary", "outline"] as const).map((variant) =>
          shapes.map((shape) => (
            <div key={`${variant}-${shape}`} className="flex flex-wrap items-center gap-3">
              {sizes.map((size) => (
                <Button key={size} variant={variant} size={size} shape={shape}>
                  <ButtonIcon src={defaultIcon} />
                  Button
                  <ButtonCounter size={counterSize[size]} {...counterStyle[variant]}>
                    1
                  </ButtonCounter>
                  <ButtonIcon src={dropdownIcon} position="end" />
                </Button>
              ))}
            </div>
          ))
        )}
      </Section>

      <Section title="Type=Icon and Type=Round (Pilled, Rounded)">
        <Rows
          render={(variant) =>
            shapes.flatMap((shape) =>
              sizes.map((size) => (
                <div key={`${shape}-${size}`} className="flex items-center gap-1">
                  <Button variant={variant} size={`icon-${size}`} shape={shape} aria-label="Action">
                    <ButtonIcon src={defaultIcon} />
                  </Button>
                  <Button variant={variant} size={`icon-${size}`} shape={shape}>
                    1
                  </Button>
                </div>
              ))
            )
          }
        />
      </Section>

      <Section title="State=Disabled">
        <Rows
          render={(variant) => (
            <>
              <Button variant={variant} disabled>
                Button
              </Button>
              <Button variant={variant} shape="rounded" disabled>
                Button
              </Button>
              <Button variant={variant} size="icon-40" disabled aria-label="Action">
                <ButtonIcon src={defaultIcon} />
              </Button>
              <Button variant={variant} size="icon-40" shape="rounded" disabled>
                1
              </Button>
            </>
          )}
        />
      </Section>
    </main>
  )
}
