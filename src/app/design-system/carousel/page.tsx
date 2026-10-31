import {
  Carousel,
  CarouselContent,
  CarouselDot,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Mirrors the Figma Carousel page (9524:2620): Carousel-Dot-Component (12), Carousel-Dot-Group-Component (4), Carousel.

const kinds = ["dot", "line"] as const
const tones = ["white", "primary"] as const
const states = ["default", "hover", "active"] as const
const slides = ["bg-base-700", "bg-base-600", "bg-base-800", "bg-base-500"]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Surface({ tone, className, children }: { tone: "white" | "primary"; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-12 rounded-r20 p-8 ${tone === "white" ? "bg-base-700" : "bg-base-50"} ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

export default function CarouselPage() {
  return (
    <main className="flex flex-col gap-12 p-10">
      <Section title="Carousel-Dot-Component">
        {kinds.map((kind) =>
          tones.map((tone) => (
            <Surface key={`${kind}-${tone}`} tone={tone}>
              <span className="w-40 font-default text-12 leading-20 text-base-300">
                {kind} / {tone}
              </span>
              {states.map((state) => (
                <div key={state} className="flex w-24 flex-col items-start gap-2">
                  <CarouselDot kind={kind} tone={tone} state={state} aria-label={`${kind} ${tone} ${state}`} />
                  <span className="font-default text-10 leading-16 text-base-400">{state}</span>
                </div>
              ))}
            </Surface>
          ))
        )}
      </Section>

      <Section title="Carousel-Dot-Group-Component">
        {kinds.map((kind) =>
          tones.map((tone) => (
            <Surface key={`${kind}-${tone}`} tone={tone}>
              <span className="w-40 font-default text-12 leading-20 text-base-300">
                {kind} / {tone}
              </span>
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <CarouselDot key={i} kind={kind} tone={tone} state={i === 0 ? "active" : "default"} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </Surface>
          ))
        )}
      </Section>

      <Section title="Carousel">
        <div className="flex flex-wrap gap-8">
          <Carousel tone="white" className="h-45 w-80 overflow-hidden rounded-r20">
            <CarouselContent className="ml-0 h-45">
              {slides.map((bg, i) => (
                <CarouselItem key={i} className={`pl-0 ${bg}`}>
                  <span className="sr-only">Slide {i + 1}</span>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>
          <Carousel tone="primary" className="h-45 w-80 overflow-hidden rounded-r20">
            <CarouselContent className="ml-0 h-45">
              {["bg-base-100", "bg-base-50", "bg-base-200", "bg-base-150"].map((bg, i) => (
                <CarouselItem key={i} className={`pl-0 ${bg}`}>
                  <span className="sr-only">Slide {i + 1}</span>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots kind="line" />
          </Carousel>
        </div>
      </Section>
    </main>
  )
}
