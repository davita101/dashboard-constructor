import { cn } from "@/lib/utils"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipDot,
  TooltipHeading,
  TooltipLabel,
  TooltipProvider,
  TooltipRow,
  TooltipTrigger,
  TooltipValue,
} from "@/components/ui/tooltip"

// Mirrors the Figma Tooltip set (462:38): Type = Default | 2 Lines | Multilines Icon,
// Arrow = Bottom | Left | Top | Right (the side the tooltip opens on), Style = Default | Black | White.

const styles = [
  { name: "Default", variant: "default" },
  { name: "Black", variant: "black" },
  { name: "White", variant: "white" },
] as const

const types = [
  { name: "Default", layout: "label", cell: "h-40" },
  { name: "2 Lines", layout: "list", cell: "h-44" },
  { name: "Multilines Icon", layout: "list-icon", cell: "h-120" },
] as const

const arrows = [
  { name: "Bottom", side: "bottom" },
  { name: "Left", side: "left" },
  { name: "Top", side: "top" },
  { name: "Right", side: "right" },
] as const

type Layout = (typeof types)[number]["layout"]

function TooltipBody({ layout }: { layout: Layout }) {
  if (layout === "label") return "Tooltip"
  if (layout === "list") {
    return [1, 2].map((value) => (
      <TooltipRow key={value}>
        <TooltipLabel>Tooltip</TooltipLabel>
        <TooltipValue>{value}</TooltipValue>
      </TooltipRow>
    ))
  }
  return (
    <>
      <TooltipHeading>Tooltip</TooltipHeading>
      {[1, 2, 3, 4, 5, 6].map((value) => (
        <TooltipRow key={value}>
          <TooltipLabel>
            <TooltipDot />
            Tooltip
          </TooltipLabel>
          <TooltipValue>{value}</TooltipValue>
        </TooltipRow>
      ))}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function TooltipPreviewPage() {
  return (
    <TooltipProvider>
      <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
        <Section title="Live (hover or focus a trigger)">
          <div className="flex flex-wrap items-center gap-6">
            {arrows.map(({ name, side }) => (
              <Tooltip key={name}>
                <TooltipTrigger render={<Button variant="outline" size="32" />}>
                  Arrow {name}
                </TooltipTrigger>
                <TooltipContent side={side}>Tooltip</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" size="32" />}>
                Black, 2 Lines
              </TooltipTrigger>
              <TooltipContent variant="black" layout="list" side="bottom">
                <TooltipBody layout="list" />
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline" size="icon-32" aria-label="Help" />}
              >
                <ButtonIcon src="/icons/material-help.svg" />
              </TooltipTrigger>
              <TooltipContent layout="list-icon" side="right">
                <TooltipBody layout="list-icon" />
              </TooltipContent>
            </Tooltip>
          </div>
        </Section>

        {styles.map((style) => (
          <Section key={style.name} title={`Style=${style.name} (pinned open)`}>
            {types.map((type) => (
              <div key={type.name} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {arrows.map((arrow) => (
                  <div
                    key={arrow.name}
                    title={`Type=${type.name}, Arrow=${arrow.name}, Style=${style.name}`}
                    className={cn("flex items-center justify-center rounded-r10 outline -outline-offset-1 outline-base-100", type.cell)}
                  >
                    <Tooltip open>
                      <TooltipTrigger
                        render={<Button variant="outline" size="24" />}
                      >
                        {arrow.name}
                      </TooltipTrigger>
                      <TooltipContent
                        variant={style.variant}
                        layout={type.layout}
                        side={arrow.side}
                      >
                        <TooltipBody layout={type.layout} />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            ))}
          </Section>
        ))}
      </main>
    </TooltipProvider>
  )
}
