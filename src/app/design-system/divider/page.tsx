import { Button, ButtonIcon } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator, SeparatorGroup, SeparatorIcon, SeparatorLabel } from "@/components/ui/separator"

// Mirrors the Figma Divider page (7060:312915): Divider-Horizontal and Divider-Vertical,
// Type = Default | Text Center | Left Center | Icon | Button | Button Group | Button Icon.

type Orientation = "horizontal" | "vertical"

const types = [
  "Default",
  "Text Center",
  "Left Center",
  "Icon",
  "Button",
  "Button Group",
  "Button Icon",
] as const

function Divider({ type, orientation }: { type: (typeof types)[number]; orientation: Orientation }) {
  // Figma: the horizontal Button is Rounded (r6), the vertical one Pilled.
  const buttonShape = orientation === "horizontal" ? "rounded" : "pill"
  switch (type) {
    case "Default":
      return <Separator orientation={orientation} />
    case "Text Center":
      return (
        <SeparatorGroup orientation={orientation}>
          <SeparatorLabel>Text</SeparatorLabel>
        </SeparatorGroup>
      )
    case "Left Center":
      return (
        <SeparatorGroup orientation={orientation} align="start">
          <SeparatorLabel>Text</SeparatorLabel>
        </SeparatorGroup>
      )
    case "Icon":
      return (
        <SeparatorGroup orientation={orientation}>
          <SeparatorIcon />
        </SeparatorGroup>
      )
    case "Button":
      return (
        <SeparatorGroup orientation={orientation}>
          <Button variant="outline" size="24" shape={buttonShape}>
            Button
          </Button>
        </SeparatorGroup>
      )
    case "Button Group":
      return (
        <SeparatorGroup orientation={orientation}>
          <ButtonGroup size="24" aria-label="Actions">
            {[1, 2, 3].map((item) => (
              <Button key={item} variant="outline" size="24">
                Button
              </Button>
            ))}
          </ButtonGroup>
        </SeparatorGroup>
      )
    case "Button Icon":
      return (
        <SeparatorGroup orientation={orientation}>
          <Button variant="outline" size="icon-24" aria-label="Add">
            <ButtonIcon src="/icons/material-add.svg" />
          </Button>
        </SeparatorGroup>
      )
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function DividerPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Divider-Horizontal (180px frame)">
        <div className="flex w-45 flex-col items-center gap-10">
          {types.map((type) => (
            <div key={type} className="flex h-6 w-full items-center" title={`Type=${type}`}>
              <Divider type={type} orientation="horizontal" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divider-Vertical (200px frame)">
        <div className="flex h-50 items-stretch gap-10 overflow-x-auto">
          {types.map((type) => (
            <div key={type} className="flex justify-center" title={`Type=${type}`}>
              <Divider type={type} orientation="vertical" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Divider-Horizontal, full width">
        <div className="flex max-w-desktop flex-col gap-10">
          {types.map((type) => (
            <Divider key={type} type={type} orientation="horizontal" />
          ))}
        </div>
      </Section>
    </main>
  )
}
