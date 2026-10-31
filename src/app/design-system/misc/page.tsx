import { Scroll, ScrollArea } from "@/components/ui/scroll-area"

// Mirrors Figma Misc > Scroll (4293:18196): Type x Size x State. Close reuses AlertClose; Map/Head/Dark-Mode skipped.

const vertical = [32, 60, 92, 120, 160, 256, 512] as const
const horizontal = [92, 120, 160, 256, 512] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function MiscPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Scroll: Vertical (Default / Active)">
        <div className="flex items-end gap-6">
          {vertical.map((h) => (
            <div key={h} className="flex gap-2" style={{ height: h }}>
              <Scroll />
              <Scroll state="active" />
            </div>
          ))}
        </div>
      </Section>
      <Section title="Scroll: Horizontal (Default / Active)">
        <div className="flex flex-col gap-4">
          {horizontal.map((w) => (
            <div key={w} className="flex flex-col gap-2" style={{ width: w }}>
              <Scroll orientation="horizontal" />
              <Scroll orientation="horizontal" state="active" />
            </div>
          ))}
        </div>
      </Section>
      <Section title="ScrollArea (live)">
        <ScrollArea className="h-40 w-64 rounded-r12 bg-white">
          <div className="flex flex-col gap-2 p-4 font-default text-14 text-base-800">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Row {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      </Section>
    </main>
  )
}
