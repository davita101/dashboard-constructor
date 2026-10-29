import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import Image from "next/image"

import { cn } from "@/lib/utils"

// Commerce Constructor 7.7 — Accordion (Figma 9402:27557)
// Group: Accordion-Group 9540:6307 · Item: Accordion-Component 9540:6250 (Default) / 9540:6251 (Open)

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        // Figma strokes sit inside the box: inset outline keeps the 36px item height.
        "overflow-hidden rounded-r32 bg-base-0 shadow-[0_1px_2px_0_var(--shadow-base)] outline -outline-offset-1 outline-base-100 data-open:rounded-r20",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 cursor-pointer items-center justify-between gap-2 py-2 pr-3 pl-4 text-left font-default text-11 leading-20 font-semibold tracking-default text-base-800 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset aria-disabled:pointer-events-none aria-disabled:opacity-50 data-panel-open:pt-3",
          className
        )}
        {...props}
      >
        {children}
        <Image
          src="/icons/material-expand-more.svg"
          alt=""
          width={20}
          height={20}
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <Image
          src="/icons/material-expand-less.svg"
          alt=""
          width={20}
          height={20}
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:block"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) px-4 pt-1 pb-4 font-default text-10 leading-16 font-semibold tracking-default text-base-600 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
