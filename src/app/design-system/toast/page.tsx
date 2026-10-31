import { AlertPanel } from "@/components/alert/AlertPanel"

// Mirrors the Figma Toasts page (6978:41509): Toast Style = Default | Black.

export default function ToastPreviewPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-background-10 px-4 py-20">
      {(["default", "black"] as const).map((style) => (
        <AlertPanel
          key={style}
          style={style}
          title="Toasts"
          time="11 m"
          message="Hello, world! This is a toast message."
          primaryLabel="Okey"
          secondaryLabel="Cancel"
        />
      ))}
    </main>
  )
}
