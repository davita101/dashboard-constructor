import {
  GuideCard,
  GuideCardDescription,
  GuideCardImage,
  GuideCardTitle,
} from "@/components/ui/guide-card"

/** Figma Misc > Dark-Mode, Type=Default (12780:35733). */
function DarkModeGuide({
  className,
  loading,
}: {
  className?: string
  loading?: "eager" | "lazy"
}) {
  return (
    <GuideCard className={className}>
      <GuideCardTitle>Enable Dark Theme</GuideCardTitle>
      <GuideCardDescription>
        Select the desired screen and find the section in the right sidebar Appearance
      </GuideCardDescription>
      <GuideCardImage
        src="/misc/dark-mode-settings.png"
        alt="Figma right sidebar with the Appearance section and the Color Mode setting"
        width={740}
        height={1037}
        loading={loading}
      />
    </GuideCard>
  )
}

export { DarkModeGuide }
