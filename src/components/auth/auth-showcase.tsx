"use client"

import Image from "next/image"

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

// Slide photos. Figma draws a single photo; slides 2-6 are crops of it until real ones are supplied.
const PHOTOS = [
  "/images/auth/hero.jpg",
  "/images/auth/hero-2.jpg",
  "/images/auth/hero-3.jpg",
  "/images/auth/hero-4.jpg",
  "/images/auth/hero-5.jpg",
  "/images/auth/hero-6.jpg",
]

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

// Figma "Image" (14056:126285): content block = title, 80px, 2x2 tiles, 80px, dots; centered vertically.
function Content() {
  return (
    <div className="flex flex-col gap-20">
      <h2 className="text-24 leading-36 font-semibold text-white">New Features</h2>
      <div className="grid w-full max-w-131 grid-cols-2 gap-4 xl:gap-6">
        <MetricCard title="Total Tasks" value="425" trend={{ up: "+2.45%" }} chart={<ChartColumnsMini tone="blue" type={4} />} />
        <MetricCard title="Competed Tasks" value="87" trend={{ up: "+20%" }} chart={<ChartLine tone="purple" type={1} className="h-27 w-23.25" preserveAspectRatio="none" />} />
        <MetricCard title="Incomplete Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={64} color="blue" aria-label="64%" />} />
        <MetricCard title="Done Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={36} color="green" aria-label="36%" />} />
      </div>
      <div aria-hidden className="h-1" />
    </div>
  )
}

// Each slide owns its photo, 20% black layer and content, so all three move together when swiped.
// The dots stay put: pinned 80px under the content block, which is 552px tall and centered.
function AuthShowcase() {
  return (
    <Carousel tone="white" opts={{ loop: true }} className="relative size-full **:data-[slot=carousel-content]:h-full">
      <CarouselContent className="ml-0 h-full">
        {PHOTOS.map((src, i) => (
          <CarouselItem key={src} aria-label={`Slide ${i + 1} of ${PHOTOS.length}`} className="relative h-full pl-0">
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 50vw, 0px" priority={i === 0} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-black-alpha-20" />
            <div className="relative flex h-full flex-col justify-center px-10 xl:pl-30">
              <Content />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots kind="line" className="top-[calc(50%+272px)] bottom-auto left-10 translate-x-0 xl:left-30" />
    </Carousel>
  )
}

export { AuthShowcase }
