import { DarkModeGuide } from "@/components/design-system/dark-mode-guide"
import {
  DesignSystemHeader,
  DesignSystemHeaderDescription,
  DesignSystemHeaderTitle,
} from "@/components/ui/design-system-header"
import { CloseAction, UploadAction } from "@/components/ui/icon-action"
import { MapImage } from "@/components/ui/map-image"
import { Scroll, ScrollArea } from "@/components/ui/scroll-area"

// Mirrors the Figma Misc page (460:6121): Map, Scroll, Close, Upload, Head-Design-System, Dark-Mode.

const vertical = [32, 60, 92, 120, 160, 256, 512] as const
const horizontal = [92, 120, 160, 256, 512] as const
const headerSizes = ["84", "72", "64", "52", "40"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {children}
      <span className="font-default text-12 leading-20 text-base-500">{label}</span>
    </div>
  )
}

export default function MiscPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Close: Default / Hover / Active / Disabled (live: hover and press)">
        <div className="flex items-start gap-10">
          <Labeled label="Default">
            <CloseAction />
          </Labeled>
          <Labeled label="Hover">
            <CloseAction state="hover" />
          </Labeled>
          <Labeled label="Active">
            <CloseAction state="active" />
          </Labeled>
          <Labeled label="Disabled">
            <CloseAction disabled />
          </Labeled>
        </div>
      </Section>

      <Section title="Upload: Default / Hover / Active / Active 2 / Active 3 / Loading">
        <div className="flex items-start gap-10">
          <Labeled label="Default">
            <UploadAction />
          </Labeled>
          <Labeled label="Hover">
            <UploadAction state="hover" />
          </Labeled>
          <Labeled label="Active">
            <UploadAction state="active" />
          </Labeled>
          <Labeled label="Active 2">
            <UploadAction frame="2" />
          </Labeled>
          <Labeled label="Active 3">
            <UploadAction frame="3" />
          </Labeled>
          <Labeled label="Loading (spins)">
            <UploadAction loading />
          </Labeled>
        </div>
      </Section>

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
        <ScrollArea className="h-40 w-64 rounded-r12 bg-background">
          <div className="flex flex-col gap-2 p-4 font-default text-14 text-base-800">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>Row {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
      </Section>

      <Section title="Head-Design-System: Size 84 / 72 / 64 / 52 / 40">
        <div className="flex max-w-[918px] flex-col gap-10">
          {headerSizes.map((size) => (
            <DesignSystemHeader key={size} size={size}>
              <DesignSystemHeaderTitle>Avatars</DesignSystemHeaderTitle>
              <DesignSystemHeaderDescription>One Design System</DesignSystemHeaderDescription>
            </DesignSystemHeader>
          ))}
        </div>
      </Section>

      <Section title="Dark-Mode: Default">
        <DarkModeGuide loading="eager" />
      </Section>

      <Section title="Map: Light / Dark">
        <div className="flex max-w-[800px] flex-col gap-10">
          <MapImage appearance="light" loading="eager" sizes="800px" alt="Light street map of Brooklyn and Queens" />
          <MapImage appearance="dark" loading="eager" sizes="800px" alt="Dark street map of New York and Newark" />
        </div>
      </Section>
    </main>
  )
}
