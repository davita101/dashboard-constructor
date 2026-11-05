"use client"

import { ChartColumnsMini, ChartLine } from "@/components/ui/chart-parts"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"
import {
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricHead,
  ChartMetricStats,
} from "@/components/ui/chart-metric"
import { ProgressCircle } from "@/components/ui/progress-circle"

function MetricCard({ title, value, up, down, chart }: { title: string; value: string; up: string; down: string; chart: React.ReactNode }) {
  return (
    <ChartMetricCard size="md">
      <ChartMetricHead title={title} />
      <ChartMetricBody>
        <ChartMetricStats value={value} heading="" up={up} down={down} />
        <ChartMetricChart>{chart}</ChartMetricChart>
      </ChartMetricBody>
    </ChartMetricCard>
  )
}

// Figma "Image" panel of Sign-In (1600): "New Features" over four metric cards and carousel dots.
function AuthShowcase() {
  return (
    <Carousel tone="white" className="relative size-full **:data-[slot=carousel-content]:h-full">
      <CarouselContent className="h-full">
        <CarouselItem className="flex h-full flex-col justify-center gap-6 px-15">
          <h2 className="text-20 leading-28 font-semibold text-background-0">New Features</h2>
          <div className="grid max-w-[262px] grid-cols-2 gap-3.5 sm:max-w-none">
            <MetricCard title="Total Tasks" value="425" up="+2.45%" down="-1.20%" chart={<ChartColumnsMini tone="blue" type={4} />} />
            <MetricCard title="Competed Tasks" value="87" up="+20%" down="-5%" chart={<ChartLine tone="purple" type={1} className="h-27 w-23.25" preserveAspectRatio="none" />} />
            <MetricCard title="Incomplete Tasks" value="72,550" up="21,33%" down="21,33%" chart={<ProgressCircle size="56" value={64} color="blue" aria-label="64%" />} />
            <MetricCard title="Done Tasks" value="72,550" up="21,33%" down="21,33%" chart={<ProgressCircle size="56" value={36} color="green" aria-label="36%" />} />
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}

export { AuthShowcase }
