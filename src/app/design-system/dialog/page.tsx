import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBadge,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mirrors Figma Dialog-Popup (9457:6527) and Dialog-Horizontal-Popup (9457:6717): Type = Default | Black.

const types = [
  { name: "Default", variant: "default" },
  { name: "Black", variant: "black" },
] as const

function Actions({ variant, size }: { variant: "default" | "black"; size: "32" | "24" }) {
  const black = variant === "black"
  return (
    <DialogFooter>
      <Button variant={black ? "white" : "dark"} size={size}>
        Okay
      </Button>
      <Button variant={black ? "black-soft" : "ghost"} size={size}>
        Cancel
      </Button>
    </DialogFooter>
  )
}

function Head({ variant }: { variant: "default" | "black" }) {
  return (
    <DialogHeader>
      <DialogIcon />
      <DialogTitle>Heading</DialogTitle>
      <DialogBadge variant={variant === "black" ? "gray" : "soft-border"}>BADGE</DialogBadge>
    </DialogHeader>
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

export default function DialogPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Live (click the trigger)">
        <div>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" size="32" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <Head variant="default" />
              <DialogDescription>Text Dialog Here</DialogDescription>
              <Actions variant="default" size="32" />
            </DialogContent>
          </Dialog>
        </div>
      </Section>

      {types.map((type) => (
        <Section key={type.name} title={`Type=${type.name}`}>
          <div className="flex flex-wrap items-start gap-6">
            <DialogPanel variant={type.variant} title={`Dialog-Popup Type=${type.name}`}>
              <Head variant={type.variant} />
              <DialogDescription>Text Dialog Here</DialogDescription>
              <Actions variant={type.variant} size="32" />
            </DialogPanel>
            <DialogPanel
              variant={type.variant}
              layout="horizontal"
              title={`Dialog-Horizontal-Popup Style=${type.name}`}
            >
              <Head variant={type.variant} />
              <Actions variant={type.variant} size="24" />
            </DialogPanel>
          </div>
        </Section>
      ))}
    </main>
  )
}
