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

// `pill` is Figma Switcher-Horizontal-Pilled-Group, Size=Small (32), Type=Fill (seen on the Calendar page).
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 bg-muted",
        line: "gap-1 rounded-none p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 bg-transparent",
        pill: "gap-0.5 rounded-r56 bg-background-20 p-1 outline -outline-offset-1 outline-background-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type TabsListVariant = NonNullable<VariantProps<typeof tabsListVariants>["variant"]>

const TabsListContext = React.createContext<TabsListVariant>("default")

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider value={variant ?? "default"}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
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
          "h-[calc(100%-1px)] gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground",
          "data-active:bg-background data-active:text-foreground data-active:shadow-sm dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        ],
        line: [
          "h-[calc(100%-1px)] gap-1.5 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-sm font-medium text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground data-active:bg-transparent data-active:text-foreground dark:data-active:border-transparent dark:data-active:bg-transparent",
          "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 data-active:after:opacity-100",
        ],
        // Figma Switcher Item, Size=Micro (24): State=Default / Active
        pill: "h-6 gap-1 rounded-r56 px-3 py-1.5 font-default text-11 leading-20 font-bold tracking-default text-base-500 outline-0 outline-primary-alpha-30 outline-solid hover:text-base-700 focus-visible:outline-3 data-active:bg-background-0 data-active:text-base-700 data-active:shadow-[0_1px_2px_0_var(--shadow-base)] data-active:not-focus-visible:outline-1 data-active:not-focus-visible:-outline-offset-1 data-active:not-focus-visible:outline-background-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  const variant = React.useContext(TabsListContext)
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
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
