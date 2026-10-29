import { Button, ButtonIcon } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

// Mirrors the Figma Buttons Group page (412:0): Pilled and Rounded sets,
// Type (Default | Icon) × Size × Resizing (Hug | Fill). Items are live Outline buttons.

const sizes = ["60", "48", "40", "32", "28", "24"] as const
const shapes = ["pill", "rounded"] as const
const items = [1, 2, 3, 4, 5, 6]

const defaultIcon = "/icons/material-default-icon.svg"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Group({
  shape,
  size,
  type,
  resizing,
}: {
  shape: (typeof shapes)[number]
  size: (typeof sizes)[number]
  type: "default" | "icon"
  resizing?: "hug" | "fill"
}) {
  return (
    <ButtonGroup shape={shape} size={size} resizing={resizing} aria-label="Actions">
      {items.map((item) =>
        type === "icon" ? (
          <Button key={item} variant="outline" shape={shape} size={`icon-${size}`} aria-label={`Action ${item}`}>
            <ButtonIcon src={defaultIcon} />
          </Button>
        ) : (
          <Button key={item} variant="outline" shape={shape} size={size}>
            Button
          </Button>
        )
      )}
    </ButtonGroup>
  )
}

export default function ButtonGroupPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {(["default", "icon"] as const).map((type) => (
        <Section key={type} title={`Type=${type === "icon" ? "Icon" : "Default"}: sizes 60 → 24 (Pilled, Rounded)`}>
          <div className="flex flex-wrap gap-16 overflow-x-auto">
            {shapes.map((shape) => (
              <div key={shape} className="flex flex-col items-start gap-8">
                {sizes.map((size) => (
                  <Group key={size} shape={shape} size={size} type={type} />
                ))}
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Resizing=Fill (Pilled, Rounded)">
        {shapes.map((shape) => (
          <div key={shape} className="flex max-w-desktop flex-col gap-6">
            <Group shape={shape} size="48" type="default" resizing="fill" />
            <Group shape={shape} size="40" type="icon" resizing="fill" />
          </div>
        ))}
      </Section>

      <Section title="Disabled item">
        <ButtonGroup aria-label="Actions">
          <Button variant="outline">Button</Button>
          <Button variant="outline" disabled>
            Button
          </Button>
          <Button variant="outline">Button</Button>
        </ButtonGroup>
      </Section>
    </main>
  )
}
