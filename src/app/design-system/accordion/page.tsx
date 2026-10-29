import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = Array.from({ length: 6 }, (_, i) => ({
  value: `item-${i + 1}`,
  heading: "Accordion",
  text: "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the first item's accordion body.",
}))

export default function AccordionPreviewPage() {
  return (
    <main className="flex flex-1 justify-center bg-background-10 p-20">
      <Accordion defaultValue={["item-3"]} className="w-[280px]">
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.heading}</AccordionTrigger>
            <AccordionContent>{item.text}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
