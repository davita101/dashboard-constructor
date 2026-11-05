"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import { FilesSlide, NotificationsSlide, TasksSlide, TeamSlide, WeekSlide } from "./auth-showcase-slides"

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

// Figma "Image" (14056:126285): content block = title, 80px, content, 80px, dots; centered vertically.
function Metrics() {
  return (
    <div className="grid w-full max-w-131 grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 xl:gap-6">
      <MetricCard title="Total Tasks" value="425" trend={{ up: "+2.45%" }} chart={<ChartColumnsMini tone="blue" type={4} />} />
      <MetricCard title="Competed Tasks" value="87" trend={{ up: "+20%" }} chart={<ChartLine tone="purple" type={1} className="h-27 w-23.25" preserveAspectRatio="none" />} />
      <MetricCard title="Incomplete Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={64} color="blue" aria-label="64%" />} />
      <MetricCard title="Done Tasks" value="72,550" trend={{ down: "21,33%" }} chart={<ProgressCircle size="56" value={36} color="green" aria-label="36%" />} />
    </div>
  )
}

const SLIDES = [
  { title: "New Features", photo: PHOTOS[0], content: <Metrics /> },
  { title: "Track Your Tasks", subtitle: "Keep every task in one place.", photo: PHOTOS[1], content: <TasksSlide /> },
  { title: "Stay Notified", subtitle: "Never miss an update that matters.", photo: PHOTOS[2], content: <NotificationsSlide /> },
  { title: "Plan Your Week", subtitle: "See your whole week at a glance.", photo: PHOTOS[3], content: <WeekSlide /> },
  { title: "Share Files", subtitle: "Upload and track files in seconds.", photo: PHOTOS[4], content: <FilesSlide /> },
  { title: "Meet Your Team", subtitle: "Connect with the people you work with.", photo: PHOTOS[5], content: <TeamSlide /> },
]

function Content({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-131 flex-col gap-9 lg:h-138 lg:gap-20">
      <div className="relative">
        <h2 className="text-18 leading-28 font-semibold text-white lg:text-24 lg:leading-36">{title}</h2>
        {subtitle && (
          <p className="absolute top-full mt-1 text-14 leading-20 text-white-alpha-80 lg:text-16 lg:leading-24">{subtitle}</p>
        )}
      </div>
      {children}
      <div aria-hidden className="hidden h-1 lg:block" />
    </div>
  )
}

const REDUCED_QUERY = {
  matches: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
}
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

// Each slide owns its photo, 20% black layer and content, so all three move together when swiped.
// The dots stay put: pinned 80px under the content block, which is 552px tall and centered.
function AuthShowcase() {
  // Autoplay only when the user allows motion; the server snapshot says "reduced" so SSR and hydration match.
  const reduced = React.useSyncExternalStore(subscribeReducedMotion, () => REDUCED_QUERY.matches(), () => true)
  const plugins = React.useMemo(
    () => (reduced ? [] : [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })]),
    [reduced]
  )

  return (
    <Carousel tone="white" opts={{ loop: true }} plugins={plugins} className="relative size-full **:data-[slot=carousel-content]:h-full">
      <CarouselContent className="ml-0 h-full">
        {SLIDES.map(({ title, subtitle, photo: src, content }, i) => (
          <CarouselItem key={src} aria-label={`Slide ${i + 1} of ${SLIDES.length}`} className="relative h-full pl-0">
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 50vw, 0px" priority={i === 0} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-black-alpha-20" />
            <div className="relative flex h-full flex-col justify-start px-5 pt-7 lg:justify-center lg:px-10 lg:pt-0 xl:pl-30">
              <Content title={title} subtitle={subtitle}>{content}</Content>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots kind="line" className="bottom-7 left-5 translate-x-0 lg:top-[calc(50%+272px)] lg:bottom-auto lg:left-10 xl:left-30" />
    </Carousel>
  )
}

export { AuthShowcase }
