import { PromoBanner } from "@/components/banner/PromoBanner"

// Mirrors the Figma Banners page (12852:18328): Banner, Type=Default.

export default function BannerPreviewPage() {
  return (
    <main className="flex flex-1 flex-wrap items-start justify-center gap-20 bg-background-10 px-4 py-20">
      <PromoBanner
        className="w-70"
        title="Build Your Full-stack Web App"
        description="Build your first AI-native web apps and claim 1 trillion LLM tokens"
        image={{ src: "/images/banners/banner-1.png", alt: "Blue flower close-up" }}
      />
    </main>
  )
}
