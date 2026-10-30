import { Slider } from "@/components/ui/slider"

// Mirrors the Figma Slider page (4313:51976): Slider (502:7159), Runner-Component (12191:4063)
// and Slider-Percent (12193:6459).

const variants = ["primary", "primary-dark"] as const
const sizes = ["default", "small"] as const
const thumbStates = ["default", "hover", "active"] as const

// Figma Slider-Percent Start/End combinations (22 per Type + Size).
const percentRanges: [number, number][] = [
  [0, 100],
  [0, 90],
  [0, 75],
  [0, 60],
  [0, 50],
  [0, 35],
  [0, 25],
  [0, 10],
  [10, 100],
  [25, 90],
  [35, 75],
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-32 shrink-0 font-default text-12 leading-20 text-base-500">{children}</span>
  )
}

export default function SliderPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Playground (drag, hover, keyboard)">
        <div className="flex w-full max-w-100 flex-col gap-16 pt-12">
          <Slider defaultValue={40} aria-label="Volume" />
          <Slider defaultValue={[25, 75]} variant="primary-dark" aria-label="Price range" />
          <Slider defaultValue={[20, 60]} valueLabel aria-label="Discount range" />
          <Slider defaultValue={30} disabled aria-label="Disabled" />
        </div>
      </Section>

      <Section title="Slider: Type (Default, Range) x Size (Default, Small) x Style (Primary, Dark)">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-10">
            <Caption>{variant}</Caption>
            {sizes.map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-10">
                <div className="w-19 shrink-0">
                  <Slider
                    defaultValue={50}
                    variant={variant}
                    size={size}
                    aria-label={`Type=Default, Size=${size}, Style=${variant}`}
                  />
                </div>
                <div className="w-50 shrink-0">
                  <Slider
                    defaultValue={[31, 64]}
                    variant={variant}
                    size={size}
                    aria-label={`Type=Range, Size=${size}, Style=${variant}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Runner-Component: Type (Default, Hover, Active) x Style (Primary, Dark)">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-wrap items-center gap-10">
            <Caption>{variant}</Caption>
            {thumbStates.map((state) => (
              <div key={state} className="flex w-30 shrink-0 flex-col gap-2">
                <Slider
                  defaultValue={50}
                  variant={variant}
                  thumbState={state}
                  aria-label={`Runner ${variant} ${state}`}
                />
                <span className="font-default text-12 leading-20 text-base-500 capitalize">
                  {state}
                </span>
              </div>
            ))}
          </div>
        ))}
      </Section>

      {variants.flatMap((variant) =>
        sizes.map((size) => (
          <Section
            key={`${variant}-${size}`}
            title={`Slider-Percent: Type=${variant === "primary" ? "Default" : "Dark"}, Size=${size}`}
          >
            <div className="flex flex-wrap gap-x-10 gap-y-16 pt-12">
              {percentRanges.map(([start, end]) => (
                <div key={`${start}-${end}`} className="w-60 shrink-0">
                  <Slider
                    defaultValue={[start, end]}
                    variant={variant}
                    size={size}
                    valueLabel
                    aria-label={`Start=${start}%, End=${end}%`}
                  />
                </div>
              ))}
            </div>
          </Section>
        ))
      )}
    </main>
  )
}
