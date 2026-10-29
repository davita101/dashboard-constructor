import { AlertCard } from "@/components/alert/AlertCard"
import { AlertToast } from "@/components/alert/AlertToast"
import type { AlertVariant } from "@/components/ui/alert"

// Mirrors the Figma Alerts page (6978:36557): Alert-Default, Alert-Buttons, Alert-List-Buttons.

const title = "Hello, world! This is a toast message."
const description =
  "Alerts give users brief and potentially time-sensitive information in an unobtrusive manner."
const items = [
  "A description list is perfect for defining terms.",
  "Definition for the term.",
  "And some more placeholder definition text.",
  "This definition is short, so no extra paragraphs or anything.",
  "This can be useful when space is tight.",
  "Let me put a definition list inside",
]

const toastVariants: AlertVariant[] = [
  "default",
  "primary-soft",
  "success-soft",
  "warning-soft",
  "danger-soft",
  "black",
  "primary",
  "success",
  "warning",
  "danger",
  "white",
]
const cardVariants = toastVariants.filter((v) => v !== "white") as Exclude<AlertVariant, "white">[]

export default function AlertPreviewPage() {
  return (
    <main className="flex flex-1 flex-wrap items-start justify-center gap-20 bg-background-10 px-4 py-20">
      <section aria-label="Alert-Default" className="flex flex-col gap-10">
        {toastVariants.map((variant) => (
          <AlertToast key={variant} variant={variant} title={title} actionLabel="Learn More" />
        ))}
      </section>

      <section aria-label="Alert-Buttons" className="flex w-100 max-w-full flex-col gap-10">
        {cardVariants.map((variant) => (
          <AlertCard
            key={variant}
            variant={variant}
            title={title}
            description={description}
            primaryLabel={variant === "danger-soft" ? "Delete" : "Learn More"}
            secondaryLabel={variant === "danger-soft" ? "Cancel" : "Close"}
          />
        ))}
      </section>

      <section aria-label="Alert-List-Buttons" className="flex w-100 max-w-full flex-col gap-10">
        {(["default", "black"] as const).map((variant) => (
          <AlertCard
            key={variant}
            variant={variant}
            title={title}
            items={items}
            primaryLabel="Learn More"
            secondaryLabel="Close"
          />
        ))}
      </section>
    </main>
  )
}
