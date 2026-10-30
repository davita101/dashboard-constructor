import { ColorDot, colorDotColorNames, ColorSwatch, colorSwatchColorNames } from "@/components/ui/color-swatch"
import { Field, FieldDescription, FieldHeader, FieldLabel } from "@/components/ui/field"
import type { InputShape, InputSize } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupSwatch } from "@/components/ui/input-group"

// Mirrors the Figma Forms: Color page (12053:26144): `Color` (12053:26145) and `Colors/Item` (4558:5182).

const sizes = ["60", "48", "40", "32", "24"] as const satisfies InputSize[]
const dotSizes = ["lg", "default", "sm"] as const
const dotShapes = ["rounded", "rectangle"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-11 leading-20 font-semibold text-base-500">{children}</span>
}

function SwatchInputs({ shape }: { shape: InputShape }) {
  return (
    <div className="flex flex-wrap items-start gap-6">
      {sizes.map((size) => (
        <InputGroup key={size} size={size} shape={shape} className="w-60">
          <InputGroupAddon>
            <InputGroupSwatch color="primary" shape={shape} />
          </InputGroupAddon>
          <InputGroupInput placeholder="Color" defaultValue="Primary" aria-label={`Color ${size}`} />
        </InputGroup>
      ))}
      <InputGroup shape={shape} className="w-60">
        <InputGroupAddon>
          <InputGroupSwatch color="danger" shape={shape} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Color" defaultValue="Danger" aria-label="Error color" aria-invalid />
      </InputGroup>
      <InputGroup shape={shape} className="w-60">
        <InputGroupAddon>
          <InputGroupSwatch color="white" shape={shape} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Color" defaultValue="White" aria-label="Disabled color" disabled />
      </InputGroup>
    </div>
  )
}

export default function ColorInputPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Color (Cornet: Pilled, Rounded)">
        <div className="flex flex-col gap-4 overflow-x-auto pb-2">
          {(["pill", "rounded"] as const).map((shape) => (
            <div key={shape} className="flex flex-col gap-3">
              <Caption>{shape === "pill" ? "Pilled" : "Rounded"}</Caption>
              <div className="flex items-center gap-1">
                {colorSwatchColorNames.map((color) => (
                  <ColorSwatch key={color} color={color} shape={shape} aria-label={color} title={color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Colors/Item (Corner x Size)">
        <div className="flex flex-col gap-4 overflow-x-auto pb-2">
          {dotSizes.flatMap((size) =>
            dotShapes.map((shape) => (
              <div key={`${size}-${shape}`} className="flex flex-col gap-3">
                <Caption>
                  {size} / {shape}
                </Caption>
                <div className="flex items-center gap-2">
                  {colorDotColorNames.map((color) => (
                    <ColorDot key={color} color={color} shape={shape} size={size} aria-label={color} title={color} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Section>

      {(["rounded", "pill"] as const).map((shape) => (
        <Section key={shape} title={`Input with color swatch (${shape === "pill" ? "Pilled" : "Rounded"})`}>
          <SwatchInputs shape={shape} />
        </Section>
      ))}

      <Section title="In a Field">
        <Field size="48" className="w-75">
          <FieldHeader>
            <FieldLabel htmlFor="brand-color">Brand color</FieldLabel>
          </FieldHeader>
          <InputGroup size="48">
            <InputGroupAddon>
              <InputGroupSwatch color="violet" />
            </InputGroupAddon>
            <InputGroupInput id="brand-color" placeholder="Violet" />
          </InputGroup>
          <FieldDescription>Swatch shape follows the input shape.</FieldDescription>
        </Field>
      </Section>
    </main>
  )
}
