import { CircleIcon } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Mirrors the Figma Tabs Switch page (12210:14389): Switcher-(Icon-)Horizontal-{Rounded,Pilled}-Group
// (+Black, +White), Size x Type (Hug, Fill), and Switcher-Vertical-{Rounded,Pilled}-Group.

const sizes = ["2xl", "xl", "lg", "default", "sm", "xs", "micro"] as const
const variants = ["switch", "pill"] as const
const tones = ["default", "black", "white"] as const
const items = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"]
// Figma vertical sizes (item height 60, 48, 40, 32, 24, 20) use the item of the matching horizontal size
const verticalSizes = ["2xl", "xl", "lg", "default", "sm", "xs"] as const

const shapeName = { switch: "Rounded", pill: "Pilled" } as const
const toneName = { default: "", black: "-Black", white: "-White" } as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Backdrop({ tone, children }: { tone: (typeof tones)[number]; children: React.ReactNode }) {
  // The White group is drawn on a black frame in Figma, the others on the page background.
  return <div className={cn("flex flex-col gap-6 rounded-r16 p-6", tone === "white" && "bg-black")}>{children}</div>
}

export default function TabsSwitchPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      {variants.map((variant) =>
        tones.map((tone) => (
          <Section
            key={`${variant}-${tone}`}
            title={`Switcher-Horizontal-${shapeName[variant]}${toneName[tone]}-Group: Hug / Fill`}
          >
            <Backdrop tone={tone}>
              {sizes.map((size) => (
                <div key={size} className="flex flex-col gap-3">
                  <Tabs defaultValue="One">
                    <TabsList variant={variant} tone={tone} size={size}>
                      {items.map((item) => (
                        <TabsTrigger key={item} value={item}>
                          Switch
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                  <Tabs defaultValue="One" className="w-full max-w-185">
                    <TabsList variant={variant} tone={tone} size={size} className="w-full">
                      {items.map((item) => (
                        <TabsTrigger key={item} value={item}>
                          Switch
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              ))}
            </Backdrop>
          </Section>
        ))
      )}

      <Section title="Tab-Group-Pilled (size 28, Projects list card)">
        <Backdrop tone="default">
          <Tabs defaultValue="One">
            <TabsList variant="pill" size="28">
              {["Last Projects", "On Deadline", "Costs"].map((item) => (
                <TabsTrigger key={item} value={item === "Last Projects" ? "One" : item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Backdrop>
      </Section>

      {variants.map((variant) => (
        <Section key={variant} title={`Switcher-Icon-Horizontal-${shapeName[variant]}-Group (Default / Black / White)`}>
          {tones.map((tone) => (
            <Backdrop key={tone} tone={tone}>
              <div className="flex flex-wrap items-center gap-6">
                {sizes.map((size) => (
                  <Tabs key={size} defaultValue="One">
                    <TabsList variant={variant} tone={tone} size={size}>
                      {items.slice(0, 4).map((item) => (
                        <TabsTrigger key={item} value={item} iconOnly aria-label={item}>
                          <CircleIcon />
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                ))}
              </div>
            </Backdrop>
          ))}
        </Section>
      ))}

      {variants.map((variant) => (
        <Section key={variant} title={`Switcher-Vertical-${shapeName[variant]}-Group (Default / Black / White)`}>
          {tones.map((tone) => (
            <Backdrop key={tone} tone={tone}>
              <div className="flex flex-wrap items-start gap-6">
                {verticalSizes.map((size) => (
                  <Tabs key={size} defaultValue="One" orientation="vertical">
                    <TabsList variant={variant} tone={tone} size={size} className="w-50">
                      {items.map((item) => (
                        <TabsTrigger key={item} value={item}>
                          Switch
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                ))}
              </div>
            </Backdrop>
          ))}
        </Section>
      ))}
    </main>
  )
}
