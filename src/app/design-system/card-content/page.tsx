import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  ContentCard,
  ContentCardDescription,
  ContentCardFileBadge,
  ContentCardFooter,
  ContentCardHead,
  ContentCardImage,
  ContentCardMedia,
  ContentCardTitle,
  ContentRow,
} from "@/components/ui/content-card"

// Mirrors the Figma Cards: Content page (11590:81923): File-Card, User-Card, Company-Card, File-List.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap gap-6">{children}</div>
    </section>
  )
}

function FileFooter() {
  return (
    <ContentCardFooter>
      <ContentCardTitle>Name File</ContentCardTitle>
      <ContentCardDescription>200 kb</ContentCardDescription>
    </ContentCardFooter>
  )
}

function PersonFooter({ name }: { name: string }) {
  return (
    <ContentCardFooter>
      <ContentCardTitle>{name}</ContentCardTitle>
      <ContentCardDescription>Web Designer</ContentCardDescription>
    </ContentCardFooter>
  )
}

export default function Page() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-10 p-10 font-default">
      <Section title="File-Card">
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <ContentCardFileBadge>PDF</ContentCardFileBadge>
          </ContentCardMedia>
          <FileFooter />
        </ContentCard>
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <ContentCardImage
              src="/images/activity/video.jpg"
              badgeIcon="/icons/material-videocam.svg"
              actionIcon="/icons/material-play-arrow-white.svg"
              actionLabel="Play"
            />
          </ContentCardMedia>
          <FileFooter />
        </ContentCard>
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <ContentCardImage
              src="/images/activity/image.jpg"
              badgeIcon="/icons/material-image.svg"
              actionIcon="/icons/material-search.svg"
              actionLabel="Zoom"
            />
          </ContentCardMedia>
          <FileFooter />
        </ContentCard>
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <ContentCardImage
              src="/images/activity/avatar.jpg"
              badgeIcon="/icons/material-music-note.svg"
              actionIcon="/icons/material-play-arrow-white.svg"
              actionLabel="Play"
            />
          </ContentCardMedia>
          <FileFooter />
        </ContentCard>
      </Section>

      <Section title="User-Card">
        <ContentCard kind="user">
          <ContentCardHead />
          <ContentCardMedia>
            <Avatar size="60">
              <AvatarImage src="/images/avatars/avatar-1.png" alt="Jane Cooper" />
            </Avatar>
          </ContentCardMedia>
          <PersonFooter name="Jane Cooper" />
        </ContentCard>
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <Avatar size="80" shape="rounded">
              <AvatarImage src="/images/avatars/logo-adobe.png" alt="Shopify" className="object-contain" />
            </Avatar>
          </ContentCardMedia>
          <PersonFooter name="Jane Cooper" />
        </ContentCard>
      </Section>

      <Section title="Company-Card">
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <Avatar size="80" shape="rounded">
              <AvatarImage src="/images/avatars/logo-adobe.png" alt="Adobe" className="object-contain" />
            </Avatar>
          </ContentCardMedia>
          <PersonFooter name="Adobe Company" />
        </ContentCard>
        <ContentCard>
          <ContentCardHead />
          <ContentCardMedia>
            <Avatar size="60" shape="rounded" frame="brand">
              <AvatarImage src="/images/avatars/brand-product-hunt.png" alt="Brand" />
            </Avatar>
          </ContentCardMedia>
          <PersonFooter name="Adobe Company" />
        </ContentCard>
      </Section>

      <Section title="File-List">
        <ContentRow name="Name File" size="200 kb" />
      </Section>
    </main>
  )
}
