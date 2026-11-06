"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

// `pill` is Figma Switcher-Horizontal-Pilled-Group, `switch` is Switcher-Horizontal-Rounded-Group
// (Tabs Switch page 12210:14389). `tone` is the group theme: default (light group),
// black (Switcher-*-Black-Group) and white (Switcher-*-White-Group).
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 bg-muted",
        line: "gap-1 rounded-none p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 bg-transparent",
        pill: "gap-0.5 rounded-r56 p-1 group-data-vertical/tabs:gap-0",
        switch: "gap-0.5 rounded-r12 p-1 group-data-vertical/tabs:gap-0",
      },
      tone: {
        default: "bg-background-20 outline -outline-offset-1 outline-background-100",
        black: "bg-black-alpha-50",
        white: "bg-white-alpha-20",
      },
      // Group heights from Figma: Super Extra Large 76 ... Micro 24; padding 8 / 6 / 4.
      size: {
        "2xl": "h-19 p-2",
        xl: "h-15 p-1.5",
        lg: "h-12",
        default: "h-10",
        sm: "h-8",
        xs: "h-7",
        micro: "h-6",
        // Tab-Group-Pilled (Projects list card): 28px group, no padding, no fill or stroke
        "28": "h-7 p-0",
      },
    },
    compoundVariants: [
      { variant: "switch", size: "micro", className: "rounded-r6" },
      // Switcher-Vertical-Rounded-Group: items 24 / 20 use a smaller group radius
      { variant: "switch", size: "sm", className: "group-data-vertical/tabs:rounded-r10" },
      { variant: "switch", size: "xs", className: "group-data-vertical/tabs:rounded-r6" },
      // Switcher-Vertical-Pilled-Group: group radius follows the item size (items 60 ... 20)
      { variant: "pill", size: "2xl", className: "group-data-vertical/tabs:rounded-r32" },
      { variant: "pill", size: "xl", className: "group-data-vertical/tabs:rounded-r28" },
      { variant: "pill", size: "lg", className: "group-data-vertical/tabs:rounded-r24" },
      { variant: "pill", size: "default", className: "group-data-vertical/tabs:rounded-r20" },
      { variant: "pill", size: "sm", className: "group-data-vertical/tabs:rounded-r16" },
      { variant: "pill", size: "xs", className: "group-data-vertical/tabs:rounded-r12" },
      { variant: "pill", size: "28", tone: "default", className: "bg-transparent outline-0" },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
)

type TabsListVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>
type TabsListSize = VariantProps<typeof tabsListVariants>["size"]
type TabsListTone = NonNullable<VariantProps<typeof tabsListVariants>["tone"]>

const TabsListContext = React.createContext<{
  variant: TabsListVariant
  size?: TabsListSize
  tone: TabsListTone
}>({ variant: "default", tone: "default" })

function TabsList({
  className,
  variant = "default",
  size,
  tone = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  const sized = variant === "pill" || variant === "switch"
  return (
    <TabsListContext.Provider value={{ variant: variant ?? "default", size, tone: tone ?? "default" }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        data-tone={sized ? tone : undefined}
        className={cn(
          tabsListVariants({ variant, size: sized ? size : undefined, tone: sized ? tone : undefined }),
          className
        )}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

const tabsTriggerVariants = cva(
  "relative inline-flex flex-1 items-center justify-center whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: [
          "h-[calc(100%-1px)] gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1",
          "data-active:bg-background data-active:text-foreground data-active:shadow-sm",
        ],
        line: [
          "h-[calc(100%-1px)] gap-1.5 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 data-active:bg-transparent data-active:text-foreground",
          "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 data-active:after:opacity-100",
        ],
        // Figma Switcher Item (Pilled). Without a size it is the 24px item used on the Calendar page.
        pill: "h-6 gap-1 rounded-r56 px-3 py-1.5 font-default text-11 leading-20 font-bold tracking-default outline-0 outline-primary-alpha-30 outline-solid focus-visible:outline-3 group-data-vertical/tabs:flex-none group-data-vertical/tabs:justify-center",
        // Figma Tab-Switch-Rounded-Component
        switch:
          "gap-1 rounded-r8 font-default font-bold tracking-default outline-0 outline-primary-alpha-30 outline-solid focus-visible:outline-3 group-data-vertical/tabs:flex-none group-data-vertical/tabs:justify-center",
      },
      // Figma Style=Default (light group) / Style=White (items inside Black and White groups)
      tone: {
        default:
          "text-base-500 data-active:bg-background-0 data-active:text-base-700 data-active:not-focus-visible:outline-1 data-active:not-focus-visible:-outline-offset-1 data-active:not-focus-visible:outline-background-100",
        white:
          "text-white-alpha-80 hover:bg-white-alpha-15 hover:text-white data-active:bg-white-alpha-15 data-active:text-white",
      },
      // Item inside a group of the same size (Figma items 60 / 48 / 40 / 32 / 24 / 20 / 16)
      size: {
        "2xl": "h-15 px-6 text-12 leading-20 [&_svg:not([class*='size-'])]:size-6",
        xl: "h-12 px-5 text-10 leading-16 [&_svg:not([class*='size-'])]:size-5",
        lg: "h-10 px-4 text-10 leading-16 [&_svg:not([class*='size-'])]:size-5",
        default: "h-8 px-3 text-10 leading-16",
        sm: "h-6 px-3 text-10 leading-16",
        xs: "h-5 rounded-r4 px-1.5 text-8 leading-12 [&_svg:not([class*='size-'])]:size-3",
        micro: "h-4 rounded-r4 px-1.5 text-8 leading-12 [&_svg:not([class*='size-'])]:size-3",
        "28": "h-7 px-2.5 text-10 leading-16",
      },
      iconOnly: {
        true: "aspect-square flex-none",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "switch", tone: "default", className: "hover:bg-background-20" },
      {
        variant: "pill",
        tone: "default",
        className: "hover:text-base-700 data-active:shadow-[0_1px_2px_0_var(--shadow-base)]",
      },
      // Pilled items are wider and keep the full radius on the small sizes
      { variant: "pill", size: "2xl", className: "px-7" },
      { variant: "pill", size: "xl", className: "px-6" },
      { variant: "pill", size: "lg", className: "px-5" },
      { variant: "pill", size: "default", className: "px-4" },
      { variant: "pill", size: "sm", className: "text-11 leading-20" },
      { variant: "pill", size: "xs", className: "rounded-r56 px-2" },
      { variant: "pill", size: "micro", className: "rounded-r56" },
      // Tab-Group-Pilled item: 10px text, base-600 idle, base-800 active
      {
        variant: "pill",
        size: "28",
        tone: "default",
        className: "text-base-600 hover:text-base-800 data-active:text-base-800",
      },
      { iconOnly: true, className: "px-0" },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsTrigger({
  className,
  iconOnly = false,
  ...props
}: TabsPrimitive.Tab.Props & { iconOnly?: boolean }) {
  const { variant, size, tone } = React.useContext(TabsListContext)
  const sized = variant === "pill" || variant === "switch"
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        tabsTriggerVariants({
          variant,
          size: sized ? size : undefined,
          tone: sized ? (tone === "default" ? "default" : "white") : undefined,
          iconOnly: sized ? iconOnly : false,
        }),
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
