import { RadioGroup, RadioGroupItem, type RadioColor, type RadioSize } from "@/components/ui/radio-group"
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
  RadioCardIcon,
  RadioCardLink,
  RadioCardLinks,
  RadioCardMedia,
  RadioCardTitle,
} from "@/components/ui/radio-card"
import { RadioField, RadioFieldContent, RadioFieldDescription, RadioFieldTitle } from "@/components/ui/radio-field"

// Mirrors the Figma Forms: Radio page (8985:338003): Radio (457:56), Radio-Text (9414:3234),
// Radio-Text-Card (9414:3260), Radio-Card (9415:3455). Each pinned state is its own RadioGroup;
// the last section is a live group for keyboard checks (Tab in, arrows to move).

const colors = ["primary-dark", "primary"] as const satisfies RadioColor[]
const sizes = ["20", "16"] as const satisfies RadioSize[]
const statuses = [
  { name: "Checked", checked: true, props: {} },
  { name: "Normal", checked: false, props: {} },
  { name: "Focus", checked: false, props: { status: "focus" as const } },
  { name: "Disabled", checked: false, props: { disabled: true } },
  { name: "Disabled checked", checked: true, props: { disabled: true } },
]
const states = [
  { name: "Default", checked: false, props: {} },
  { name: "Active", checked: true, props: {} },
  { name: "Disabled", checked: false, props: { disabled: true } },
]
const orientations = ["horizontal", "vertical"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function RadioPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Radio: Checked, Normal, Focus, Disabled, Disabled checked">
        <div className="flex flex-col gap-8">
          {sizes.map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-10">
              {colors.flatMap((color) =>
                statuses.map(({ name, checked, props }) => (
                  <RadioGroup
                    key={`${color}-${name}`}
                    aria-label={`${color} ${size} ${name}`}
                    defaultValue={checked ? "on" : undefined}
                    className="w-fit"
                  >
                    <RadioGroupItem value="on" color={color} size={size} aria-label={name} {...props} />
                  </RadioGroup>
                ))
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radio-Text">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            states.map(({ name, checked, props }) => (
              <RadioGroup
                key={`${orientation}-${name}`}
                aria-label={`Radio-Text ${orientation} ${name}`}
                defaultValue={checked ? "on" : undefined}
              >
                <RadioField orientation={orientation} className="w-fit">
                  <RadioGroupItem value="on" color="primary-dark" {...props} />
                  <RadioFieldContent>
                    <RadioFieldTitle>Main Text</RadioFieldTitle>
                    <RadioFieldDescription>Additional Text</RadioFieldDescription>
                  </RadioFieldContent>
                </RadioField>
              </RadioGroup>
            ))
          )}
        </div>
      </Section>

      <Section title="Radio-Text-Card">
        <div className="flex flex-col gap-10">
          {orientations.flatMap((orientation) =>
            states.map(({ name, checked, props }) => (
              <RadioGroup
                key={`${orientation}-${name}`}
                aria-label={`Radio-Text-Card ${orientation} ${name}`}
                defaultValue={checked ? "on" : undefined}
              >
                <RadioField variant="card" orientation={orientation} className={orientation === "horizontal" ? "w-fit" : "w-54"}>
                  <RadioGroupItem value="on" color="primary-dark" {...props} />
                  <RadioFieldContent>
                    <RadioFieldTitle>Main Text</RadioFieldTitle>
                    <RadioFieldDescription>Additional Text</RadioFieldDescription>
                  </RadioFieldContent>
                </RadioField>
              </RadioGroup>
            ))
          )}
        </div>
      </Section>

      <Section title="Radio-Card">
        <div className="flex flex-col gap-10">
          {states.map(({ name, checked, props }) => (
            <RadioGroup key={name} aria-label={`Radio-Card ${name}`} defaultValue={checked ? "on" : undefined}>
              <RadioCard className="w-80">
                <RadioCardMedia>
                  <RadioCardIcon />
                </RadioCardMedia>
                <RadioCardContent>
                  <RadioCardTitle>Main Text</RadioCardTitle>
                  <RadioCardDescription>Additional Text</RadioCardDescription>
                  <RadioCardLinks>
                    <RadioCardLink href="#">Link 1</RadioCardLink>
                    <RadioCardLink href="#">Link 2</RadioCardLink>
                  </RadioCardLinks>
                </RadioCardContent>
                <RadioGroupItem value="on" color="primary-dark" {...props} />
              </RadioCard>
            </RadioGroup>
          ))}
        </div>
      </Section>

      <Section title="Live group (keyboard)">
        <div className="flex flex-wrap items-start gap-16">
          <RadioGroup aria-label="Shipping speed" defaultValue="Standard">
            {["Standard", "Express", "Overnight"].map((value) => (
              <RadioField key={value}>
                <RadioGroupItem value={value} color="primary-dark" disabled={value === "Overnight"} />
                <RadioFieldContent>
                  <RadioFieldTitle>{value}</RadioFieldTitle>
                  <RadioFieldDescription>Additional Text</RadioFieldDescription>
                </RadioFieldContent>
              </RadioField>
            ))}
          </RadioGroup>
          <RadioGroup aria-label="Plan" defaultValue="Monthly" className="w-80">
            {["Monthly", "Yearly"].map((value) => (
              <RadioCard key={value}>
                <RadioCardMedia>
                  <RadioCardIcon />
                </RadioCardMedia>
                <RadioCardContent>
                  <RadioCardTitle>{value}</RadioCardTitle>
                  <RadioCardDescription>Additional Text</RadioCardDescription>
                </RadioCardContent>
                <RadioGroupItem value={value} color="primary" />
              </RadioCard>
            ))}
          </RadioGroup>
        </div>
      </Section>
    </main>
  )
}
