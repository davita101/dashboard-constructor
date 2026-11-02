"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { ButtonIcon } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Figma Mockups page (11662:1003): iPad (3), iPhone (4) device frames and a Browser top bar.
// Device art in Figma is a bitmap with a transparent screen; here the bezel is drawn with
// tokens and the screen is a slot (`MockupScreen`) sized to the Figma component.

const mockupVariants = cva("relative inline-flex shrink-0 bg-base-900 p-0", {
  variants: {
    device: {
      "ipad-mini": "rounded-r40 p-1.5",
      "ipad-pro-11": "rounded-r40 p-1.5",
      "ipad-pro-13": "rounded-r40 p-1.5",
      "iphone-16": "rounded-r56 p-1.5",
      "iphone-16-pro": "rounded-r56 p-1.5",
      "iphone-16-pro-plus": "rounded-r56 p-1.5",
      "iphone-16-pro-max": "rounded-r56 p-1.5",
    },
  },
  defaultVariants: { device: "iphone-16" },
})

// Screen sizes = Figma variant sizes; radius 40 on phones.
const mockupScreenVariants = cva("relative block overflow-hidden bg-background-0", {
  variants: {
    device: {
      "ipad-mini": "h-[744px] w-[1133px] rounded-r24",
      "ipad-pro-11": "h-[834px] w-[1210px] rounded-r24",
      "ipad-pro-13": "h-[1024px] w-[1366px] rounded-r24",
      "iphone-16": "h-[852px] w-[393px] rounded-r40",
      "iphone-16-pro": "h-[874px] w-[402px] rounded-r40",
      "iphone-16-pro-plus": "h-[932px] w-[430px] rounded-r40",
      "iphone-16-pro-max": "h-[956px] w-[440px] rounded-r40",
    },
  },
  defaultVariants: { device: "iphone-16" },
})

type MockupDevice = NonNullable<VariantProps<typeof mockupVariants>["device"]>

const MockupContext = React.createContext<MockupDevice>("iphone-16")

function Mockup({
  device = "iphone-16",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof mockupVariants>) {
  const d = device ?? "iphone-16"
  return (
    <MockupContext.Provider value={d}>
      <div data-slot="mockup" data-device={d} className={cn(mockupVariants({ device: d }), className)} {...props}>
        {children}
        {d.startsWith("iphone") ? <MockupIsland /> : <MockupCamera />}
      </div>
    </MockupContext.Provider>
  )
}

function MockupScreen({ className, ...props }: React.ComponentProps<"div">) {
  const device = React.useContext(MockupContext)
  return <div data-slot="mockup-screen" className={cn(mockupScreenVariants({ device }), className)} {...props} />
}

/** iPhone dynamic island. */
function MockupIsland({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mockup-island"
      aria-hidden
      className={cn("absolute top-3 left-1/2 z-10 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-base-900", className)}
      {...props}
    />
  )
}

/** iPad front camera dot. */
function MockupCamera({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mockup-camera"
      aria-hidden
      className={cn("absolute top-3 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full bg-base-800", className)}
      {...props}
    />
  )
}

// Browser bar. Figma Type=Default 800x56, r16, outline background-100.
const browserVariants = cva(
  "flex h-14 w-[800px] items-center gap-[126px] rounded-r16 bg-background-0 px-6 py-3.5 font-default outline -outline-offset-1 outline-background-100"
)

function Browser({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="browser" className={cn(browserVariants(), className)} {...props} />
}

const browserDotVariants = cva("size-3 rounded-full", {
  variants: {
    color: { close: "bg-danger-500", minimize: "bg-warning-500", expand: "bg-success-500" },
  },
})

/** Left cluster: window dots (OS) + back/forward (Nav). */
function BrowserControls({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="browser-controls" className={cn("flex h-5 w-32 items-center gap-6", className)} {...props}>
      <span data-slot="browser-os" aria-hidden className="flex h-3 w-[52px] items-center gap-2">
        {(["close", "minimize", "expand"] as const).map((color) => (
          <span key={color} className={browserDotVariants({ color })} />
        ))}
      </span>
      <span data-slot="browser-nav" className="flex items-center gap-3">
        <BrowserIcon src="/icons/material-chevron-left.svg" />
        <BrowserIcon src="/icons/material-chevron-right.svg" />
      </span>
    </div>
  )
}

function BrowserIcon({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("flex size-5 items-center justify-center text-base-500", className)}>
      <ButtonIcon src={src} className="size-4" />
    </span>
  )
}

function BrowserAddress({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-address"
      className={cn("flex h-7 w-80 items-center gap-2 rounded-r8 bg-background-50 px-2 py-1", className)}
      {...props}
    >
      <span className="flex h-5 flex-1 items-center justify-center gap-1 px-[84px] text-12 leading-20 font-medium whitespace-nowrap text-base-900">
        <ButtonIcon src="/icons/material-lock.svg" className="size-3 text-base-500" />
        {children}
      </span>
      <BrowserIcon src="/icons/material-refresh.svg" className="size-4" />
    </div>
  )
}

/** Right cluster: share + new tab. */
function BrowserActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="browser-actions" className={cn("flex h-5 w-[52px] items-center gap-3", className)} {...props}>
      <BrowserIcon src="/icons/material-share.svg" />
      <BrowserIcon src="/icons/material-add.svg" />
    </div>
  )
}

export {
  Mockup,
  MockupScreen,
  MockupIsland,
  MockupCamera,
  mockupVariants,
  mockupScreenVariants,
  Browser,
  BrowserControls,
  BrowserAddress,
  BrowserActions,
  type MockupDevice,
}
