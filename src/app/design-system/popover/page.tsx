import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverActions,
  PopoverBadge,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverFooterText,
  PopoverGroup,
  PopoverHeader,
  PopoverIcon,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

// Mirrors the Figma Popover set (9494:47023): Type = Default | Black, Direction = Bottom | Top | Right | Left.

const types = [
  { name: "Default", variant: "default" },
  { name: "Black", variant: "black" },
] as const

const directions = [
  { name: "Bottom", side: "bottom" },
  { name: "Top", side: "top" },
  { name: "Right", side: "right" },
  { name: "Left", side: "left" },
] as const

function Body({ variant }: { variant: "default" | "black" }) {
  const black = variant === "black"
  return (
    <>
      <PopoverHeader>
        <PopoverGroup>
          <PopoverIcon />
          <PopoverTitle>Heading</PopoverTitle>
          <PopoverBadge variant={black ? "gray" : "soft-border"}>BADGE</PopoverBadge>
        </PopoverGroup>
        <PopoverClose />
      </PopoverHeader>
      <PopoverDescription>Content Here</PopoverDescription>
      <PopoverFooter>
        <PopoverFooterText>1 from 10</PopoverFooterText>
        <PopoverActions>
          <Button variant={black ? "black-soft" : "ghost"} size="32">
            Back
          </Button>
          <Button variant={black ? "white" : "dark"} size="28">
            Next
          </Button>
        </PopoverActions>
      </PopoverFooter>
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

export default function PopoverPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Live (click a trigger)">
        <div className="flex flex-wrap items-center gap-6">
          {directions.map(({ name, side }) => (
            <Popover key={name}>
              <PopoverTrigger render={<Button variant="outline" size="32" />}>
                Direction {name}
              </PopoverTrigger>
              <PopoverContent side={side}>
                <Body variant="default" />
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </Section>

      {types.map((type) => (
        <Section key={type.name} title={`Type=${type.name} (pinned open)`}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {directions.map((d) => (
              <div
                key={d.name}
                title={`Type=${type.name}, Direction=${d.name}`}
                className="flex h-64 items-center justify-center rounded-r10 outline -outline-offset-1 outline-base-100"
              >
                <Popover open>
                  <PopoverTrigger render={<Button variant="outline" size="24" />}>
                    {d.name}
                  </PopoverTrigger>
                  <PopoverContent variant={type.variant} side={d.side}>
                    <Body variant={type.variant} />
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </main>
  )
}
