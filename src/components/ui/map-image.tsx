import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Figma Misc > Map (4120:45264): static map artwork, Style Light / Dark, 1600x1145.
const mapImageVariants = cva("relative block aspect-[1600/1145] w-full overflow-hidden", {
  variants: {
    appearance: {
      light: "bg-background",
      dark: "bg-base-900",
    },
  },
  defaultVariants: { appearance: "light" },
})

const mapSources = {
  light: "/misc/map-light.webp",
  dark: "/misc/map-dark.webp",
} as const

function MapImage({
  className,
  appearance = "light",
  alt = "Map",
  sizes = "100vw",
  loading,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof mapImageVariants> & { alt?: string; sizes?: string; loading?: "eager" | "lazy" }) {
  const style = appearance ?? "light"
  return (
    <div
      data-slot="map-image"
      data-appearance={style}
      className={cn(mapImageVariants({ appearance: style }), className)}
      {...props}
    >
      <Image src={mapSources[style]} alt={alt} fill sizes={sizes} loading={loading} className="object-cover" />
    </div>
  )
}

export { MapImage, mapImageVariants }
