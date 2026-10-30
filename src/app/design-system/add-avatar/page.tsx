import type { AddAvatarSize } from "@/components/ui/add-avatar"

import { AddAvatarDemo } from "./add-avatar-demo"

// Mirrors the Figma Form-Avatar-Add set (11553:39491): rows are State (Default, With Image),
// columns its Size (Extra Large 60 … Micro 24). Each cell is live: pick, change or remove an image.

const sizes = ["60", "48", "40", "32", "24"] as const satisfies AddAvatarSize[]
const sample = "/images/avatars/avatar-1.png"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

/** Showcase backdrop, like the Figma set frame. Not part of the component. */
function Surface({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-r40 bg-background-0 p-10">{children}</div>
}

export default function AddAvatarPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Form-Avatar-Add (rows: default, with image)">
        <Surface>
          <div className="grid w-max grid-cols-[repeat(5,minmax(--spacing(56),max-content))] items-start gap-10">
            {[undefined, sample].map((src) =>
              sizes.map((size) => <AddAvatarDemo key={`${src ?? "default"}-${size}`} size={size} initialSrc={src} />)
            )}
          </div>
        </Surface>
      </Section>
    </main>
  )
}
