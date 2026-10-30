import { Button } from "@/components/ui/button"
import { Loader, type LoaderSize } from "@/components/ui/loader"
import { Spinner } from "@/components/ui/spinner"

// Mirrors the Figma Loader page (9402:26498): the Loader set (9489:2491) and its Playground (11717:573514).

const loaderSizes: { size: LoaderSize; name: string }[] = [
  { size: "48", name: "Large (48)" },
  { size: "36", name: "Default (36)" },
  { size: "32", name: "Small (32)" },
  { size: "20", name: "Extra Small (20)" },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-12 leading-20 text-base-500">{children}</span>
}

export default function LoaderPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Playground">
        <div className="flex">
          <Loader size="48" />
        </div>
      </Section>

      <Section title="Loader, Size = Large (48) | Default (36) | Small (32) | Extra Small (20)">
        <div className="flex flex-wrap items-center gap-16">
          {loaderSizes.map(({ size, name }) => (
            <div key={size} className="flex flex-col items-center gap-3" title={`Size=${name}`}>
              <Loader size={size} />
              <Caption>{name}</Caption>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spinner (Loader ring without the container)">
        <div className="flex flex-wrap items-center gap-10">
          {loaderSizes.map(({ size, name }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Spinner size={size} />
              <Caption>{name}</Caption>
            </div>
          ))}
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <Caption>Inline (16)</Caption>
          </div>
        </div>
      </Section>

      <Section title="Spinner in Button (color = current, not in Figma)">
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>
            <Spinner color="current" data-icon="inline-start" />
            Saving...
          </Button>
          <Button variant="dark" size="32">
            <Spinner color="current" data-icon="inline-start" />
            Loading
          </Button>
        </div>
      </Section>
    </main>
  )
}
