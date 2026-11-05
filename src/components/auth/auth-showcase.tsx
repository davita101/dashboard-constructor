"use client"

import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"
import { ChartColumnsMini, ChartLine } from "@/components/ui/chart-parts"
import {
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricHead,
  ChartMetricStats,
} from "@/components/ui/chart-metric"
import { ProgressCircle } from "@/components/ui/progress-circle"

function MetricCard({ title, value, trend, chart }: { title: string; value: string; trend: { up?: string; down?: string }; chart: React.ReactNode }) {
  return (
    <ChartMetricCard size="tile">
      <ChartMetricHead title={title} />
      <ChartMetricBody layout="tile">
        <ChartMetricStats value={value} heading="" up={trend.up ?? ""} down={trend.down ?? ""} className="h-auto" />
        <ChartMetricChart>{chart}</ChartMetricChart>
      </ChartMetricBody>
    </ChartMetricCard>
  )
}

function Slide() {
  return (
    <div className="flex flex-col gap-20">
      <h2 className="text-24 leading-36 font-semibold text-white">New Features</h2>
      <div className="grid w-fit grid-cols-2 gap-6">
        <MetricCard title="Total Tasks" value="425" trend={{ up: "+2.45%" }} chart={<ChartColumnsMini tone="blue" type={4} />} />
        <MetricCard title="Competed Tasks" value="87" trend={{ up: "+20%" }} chart={<ChartLine tone="purple" type={1} className="h-27 w-23.25" preserveAspectRatio="none" />} />
        <MetricCard title="Incomplete Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={64} color="blue" aria-label="64%" />} />
        <MetricCard title="Done Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={36} color="green" aria-label="36%" />} />
      </div>
    </div>
  )
}

const SLIDES = 6

// Figma "Image" (14056:126285): photo + black 20% overlay, content 120px from the left,
// six slides with Line dots (32x4, gap 12) 80px under the cards.
function AuthShowcase() {
  return (
    <div className="relative size-full bg-primary-900 bg-[url(/images/auth/hero.jpg)] bg-cover bg-center">
      <div aria-hidden className="absolute inset-0 bg-black-alpha-20" />
      <Carousel tone="white" opts={{ loop: true }} className="relative flex size-full flex-col justify-center gap-20 pl-30">
        <CarouselContent>
          {Array.from({ length: SLIDES }, (_, i) => (
            <CarouselItem key={i} aria-label={`Slide ${i + 1} of ${SLIDES}`}>
              <Slide />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots kind="line" className="static translate-x-0" />
      </Carousel>
    </div>
  )
}

export { AuthShowcase }
