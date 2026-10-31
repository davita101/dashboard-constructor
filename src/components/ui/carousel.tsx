"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button, ButtonIcon } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]
/** Figma Carousel `Tpe`: White controls sit on an image, Primary controls sit on a light surface. */
type CarouselTone = "white" | "primary"

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  tone?: CarouselTone
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  count: number
  tone: CarouselTone
} & Omit<CarouselProps, "tone">

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  tone = "white",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
    setCount(api.scrollSnapList().length)
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    // Sync React state with the embla instance once it exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api.off("reInit", onSelect)
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        tone,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        count,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden" data-slot="carousel-content">
      <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)} {...props} />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
      {...props}
    />
  )
}

function CarouselPrevious({ className, variant, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev, tone } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant ?? (tone === "white" ? "white-soft" : "black-soft")}
      size="icon-24"
      shape="pill"
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal" ? "inset-y-0 left-8 my-auto" : "top-8 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ButtonIcon src="/icons/material-chevron-left.svg" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({ className, variant, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext, tone } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant ?? (tone === "white" ? "white-soft" : "black-soft")}
      size="icon-24"
      shape="pill"
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal" ? "inset-y-0 right-8 my-auto" : "bottom-8 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ButtonIcon src="/icons/material-chevron-right.svg" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

// Figma Carousel-Dot-Component: Type (Dot 8x8 / Line 32x4) x Style (White / Primary) x State.
const carouselDotVariants = cva(
  "block shrink-0 cursor-pointer outline -outline-offset-1 outline-transparent transition-all focus-visible:outline-2 focus-visible:outline-primary-500",
  {
    variants: {
      kind: {
        dot: "h-2",
        line: "h-1 w-8",
      },
      tone: {
        white: "rounded-r8",
        primary: "",
      },
      state: {
        default: "",
        hover: "",
        active: "",
      },
    },
    compoundVariants: [
      // White
      { tone: "white", state: "default", className: "bg-white-alpha-15 outline-white-alpha-5 hover:bg-white-alpha-90" },
      { tone: "white", state: "hover", className: "bg-white-alpha-90" },
      { tone: "white", state: "active", className: "bg-white-alpha-90 outline-white-alpha-15" },
      // Primary
      { tone: "primary", kind: "dot", className: "rounded-full" },
      { tone: "primary", kind: "line", className: "rounded-r8" },
      { tone: "primary", state: "default", className: "bg-black-alpha-50" },
      { tone: "primary", kind: "dot", state: "default", className: "hover:bg-base-900" },
      { tone: "primary", kind: "line", state: "default", className: "hover:bg-blue-600" },
      { tone: "primary", kind: "dot", state: "hover", className: "bg-base-900" },
      { tone: "primary", kind: "dot", state: "active", className: "bg-base-900 outline-base-alpha-20" },
      { tone: "primary", kind: "line", state: "hover", className: "bg-blue-600" },
      { tone: "primary", kind: "line", state: "active", className: "bg-blue-600 outline-blue-alpha-20" },
      // Dot widens to 20 on hover and active
      { kind: "dot", state: "default", className: "w-2 hover:w-5" },
      { kind: "dot", state: ["hover", "active"], className: "w-5" },
    ],
    defaultVariants: {
      kind: "dot",
      tone: "white",
      state: "default",
    },
  }
)

function CarouselDot({
  className,
  kind = "dot",
  tone = "white",
  state = "default",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof carouselDotVariants>) {
  return (
    <button
      type="button"
      data-slot="carousel-dot"
      data-state={state}
      className={cn(carouselDotVariants({ kind, tone, state }), className)}
      {...props}
    />
  )
}

// Figma Carousel-Dot-Group-Component: row, gap 12. One dot per slide, bound to the carousel api.
function CarouselDots({
  className,
  kind = "dot",
  tone,
  ...props
}: React.ComponentProps<"div"> & { kind?: "dot" | "line"; tone?: CarouselTone }) {
  const { count, selectedIndex, scrollTo, tone: carouselTone } = useCarousel()
  const dotTone = tone ?? carouselTone

  return (
    <div
      data-slot="carousel-dots"
      role="tablist"
      className={cn("absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <CarouselDot
          key={index}
          role="tab"
          kind={kind}
          tone={dotTone}
          state={index === selectedIndex ? "active" : "default"}
          aria-selected={index === selectedIndex}
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDot,
  CarouselDots,
  carouselDotVariants,
  useCarousel,
}
