import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import {
  Notification,
  NotificationAside,
  NotificationClose,
  NotificationContent,
  NotificationDescription,
  NotificationFooter,
  NotificationIcon,
  NotificationImage,
  NotificationLine,
  NotificationLinks,
  NotificationMediaClose,
  NotificationMeta,
  NotificationText,
  NotificationTitle,
} from "@/components/ui/notification"
import { Progress } from "@/components/ui/progress"

// Mirrors the Figma Notifications page (12145:243335): Notifications-01 … 05.
const banner = "/images/banners/banner-1.png"
const avatar = "/images/avatars/avatar-1.png"
const text = "A description list is perfect for defining terms."

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-default text-14 leading-20 font-bold text-base-900">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

function Links({ compact }: { compact?: boolean }) {
  const size = compact ? "11" : "12"
  return (
    <NotificationLinks>
      <Link href="#" variant="blue" size={size}>
        Link
      </Link>
      <Link href="#" variant="700" size={size}>
        Link
      </Link>
    </NotificationLinks>
  )
}

function UserAvatar() {
  return (
    <Avatar size="48" className="shrink-0">
      <AvatarImage src={avatar} alt="" />
    </Avatar>
  )
}

export default function NotificationPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-10 bg-background-10 px-4 py-20 sm:px-10">
      <Section title="Notifications-01 · Type=Default / Links">
        <Notification layout="inline">
          <NotificationImage src={banner} />
          <NotificationContent className="items-center justify-between py-2 pr-4 pl-2">
            <div className="flex items-center gap-3">
              <NotificationIcon />
              <NotificationText className="pr-8">
                <NotificationTitle>Headnig</NotificationTitle>
                <NotificationMeta>Additional Text</NotificationMeta>
              </NotificationText>
            </div>
            <NotificationClose />
          </NotificationContent>
        </Notification>
        <Notification layout="aside">
          <NotificationContent className="items-start p-4">
            <NotificationIcon />
            <NotificationText className="pr-12">
              <NotificationTitle>Headnig</NotificationTitle>
              <NotificationMeta>Additional Text</NotificationMeta>
            </NotificationText>
          </NotificationContent>
          <NotificationAside className="w-16 px-5 py-1">
            <Link href="#" variant="blue" size="12" className="py-1.75">
              Link
            </Link>
            <Link href="#" variant="700" size="12" className="py-1.75">
              Link
            </Link>
          </NotificationAside>
        </Notification>
      </Section>

      <Section title="Notifications-02">
        <Notification layout="media">
          <NotificationImage size="wide" src={banner} />
          <NotificationMediaClose />
          <NotificationContent className="items-start gap-4 p-3">
            <NotificationIcon size="40" />
            <NotificationText className="gap-4">
              <NotificationLine className="pr-12">
                <NotificationTitle>Headnig</NotificationTitle>
                <NotificationMeta>Additional Text</NotificationMeta>
              </NotificationLine>
              <NotificationDescription>{text}</NotificationDescription>
              <Progress color="blue-flat" value={100} aria-label="Progress" />
              <Links />
            </NotificationText>
          </NotificationContent>
        </Notification>
      </Section>

      <Section title="Notifications-03">
        <Notification layout="split">
          <NotificationContent className="gap-6 p-4">
            <UserAvatar />
            <NotificationText className="gap-2">
              <NotificationText className="gap-2">
                <NotificationTitle>Headnig</NotificationTitle>
                <NotificationMeta tone="default">Additional Text</NotificationMeta>
              </NotificationText>
              <NotificationDescription>{text}</NotificationDescription>
            </NotificationText>
          </NotificationContent>
          <NotificationAside className="w-22 px-8">
            <Link href="#" variant="blue" size="12">
              Link
            </Link>
          </NotificationAside>
        </Notification>
      </Section>

      <Section title="Notifications-04">
        <Notification layout="footer">
          <UserAvatar />
          <NotificationText>
            <NotificationLine className="pr-8">
              <NotificationTitle>Headnig</NotificationTitle>
              <NotificationMeta tone="default">Additional Text</NotificationMeta>
            </NotificationLine>
            <NotificationDescription>{text}</NotificationDescription>
            <NotificationFooter>
              <Button variant="dark" size="28">
                Button
              </Button>
              <Button variant="ghost" size="28">
                Button
              </Button>
            </NotificationFooter>
          </NotificationText>
          <NotificationClose className="absolute top-2 right-2" />
        </Notification>
      </Section>

      <Section title="Notifications-05">
        <Notification layout="compact">
          <NotificationImage size="84" src={banner} />
          <NotificationText className="py-0.5">
            <NotificationLine className="pr-12">
              <NotificationTitle>Headnig</NotificationTitle>
              <NotificationMeta>Additional Text</NotificationMeta>
            </NotificationLine>
            <NotificationDescription>{text}</NotificationDescription>
            <Links compact />
          </NotificationText>
        </Notification>
      </Section>
    </main>
  )
}
