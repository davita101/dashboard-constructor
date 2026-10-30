import { Kbd, KbdGroup, kbdKeys, type KbdShape, type KbdSize, type KbdVariant } from "@/components/ui/kbd"

// Mirrors the Figma Command Key page (9402:26499): Command-Key Type × Corner × Size × Content,
// then Command-Keys-Group (key + "+" + key) and the Playground. No interactive states in Figma.

const variants: KbdVariant[] = ["default", "black", "white"]
const shapes: KbdShape[] = ["rounded", "pill"]
const sizes: KbdSize[] = ["32", "24", "20", "16"]

// Figma Content values; `glyph` = single character, square when Pilled.
const contents: { label: string; glyph?: boolean }[] = [
  { label: "Ctrl" },
  { label: kbdKeys.cmd, glyph: true },
  { label: kbdKeys.shift, glyph: true },
  { label: kbdKeys.alt, glyph: true },
  { label: kbdKeys.ctrl, glyph: true },
  { label: "Win" },
  { label: "Alt" },
  { label: "Shift" },
  { label: kbdKeys.enter, glyph: true },
  { label: kbdKeys.left, glyph: true },
  { label: kbdKeys.up, glyph: true },
  { label: kbdKeys.right, glyph: true },
  { label: kbdKeys.down, glyph: true },
  { label: "Esc" },
  { label: "S", glyph: true },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/**
 * White keys are made for dark media, so their rows sit on a black strip. Group rows of the
 * Black/White styles (white or black "+") sit on a colored strip so both keys and "+" stay visible.
 */
function Row({
  variant,
  label,
  group = false,
  children,
}: {
  variant: KbdVariant
  label: string
  group?: boolean
  children: React.ReactNode
}) {
  const surface = variant === "default" ? undefined : group ? "color" : variant === "white" ? "dark" : undefined
  return (
    <div
      data-surface={surface}
      className="flex w-fit items-center gap-4 rounded-r12 p-2 data-[surface=color]:bg-primary-500 data-[surface=dark]:bg-black"
    >
      <span className="w-28 shrink-0 font-default text-11 leading-20 text-base-500 in-data-surface:text-white">
        {label}
      </span>
      {children}
    </div>
  )
}

export default function CommandKeyPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Command-Key: Type × Corner × Size (32 → 16), every Content">
        <div className="flex flex-col gap-3 overflow-x-auto">
          {variants.flatMap((variant) =>
            sizes.map((size) => (
              <Row key={`${variant}-${size}`} variant={variant} label={`${variant} / ${size}`}>
                <div className="flex items-center gap-2">
                  {contents.flatMap(({ label, glyph }) =>
                    shapes.map((shape) => (
                      <Kbd key={`${label}-${shape}`} variant={variant} shape={shape} size={size} glyph={glyph}>
                        {label}
                      </Kbd>
                    ))
                  )}
                </div>
              </Row>
            ))
          )}
        </div>
      </Section>

      <Section title="Command-Keys-Group: Style × Corner × Size (⌘ + ⌥ + ⇧)">
        <div className="flex flex-col gap-3 overflow-x-auto">
          {variants.flatMap((variant) =>
            shapes.map((shape) => (
              <Row key={`${variant}-${shape}`} variant={variant} label={`${variant} / ${shape}`} group>
                <div className="flex items-center gap-8">
                  {sizes.map((size) => (
                    <KbdGroup key={size} size={size} variant={variant} shape={shape} separator>
                      <Kbd glyph>{kbdKeys.cmd}</Kbd>
                      <Kbd glyph>{kbdKeys.alt}</Kbd>
                      <Kbd glyph>{kbdKeys.shift}</Kbd>
                    </KbdGroup>
                  ))}
                </div>
              </Row>
            ))
          )}
        </div>
      </Section>

      <Section title="Playground (Rounded / Default, L → XS)">
        <div className="flex flex-col items-start gap-10 rounded-r24 bg-background-0 p-10 outline -outline-offset-1 outline-base-100">
          {sizes.map((size) => (
            <KbdGroup key={size} size={size} separator>
              <Kbd>{kbdKeys.cmd}</Kbd>
              <Kbd>{kbdKeys.alt}</Kbd>
              <Kbd>{kbdKeys.shift}</Kbd>
            </KbdGroup>
          ))}
        </div>
      </Section>

      <Section title="Without separator (Input slot usage)">
        <KbdGroup>
          <Kbd>{kbdKeys.cmd}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Section>
    </main>
  )
}
