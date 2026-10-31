import { Button, ButtonIcon } from "@/components/ui/button"
import {
  NavbarMenuGroup,
  NavbarMenuItem,
  NavbarMenuItemBadge,
  NavbarMenuItemContent,
  NavbarMenuItemDescription,
  NavbarMenuItemFooter,
  NavbarMenuItemHead,
  NavbarMenuItemHeading,
  NavbarMenuItemIcon,
  NavbarMenuItemImage,
  NavbarMenuItemTag,
  NavbarMenuItemTitle,
  NavbarMenuItemVideo,
  NavbarMenuLink,
  NavbarMenuPanel,
  NavbarMenuPanelContent,
  NavbarMenuPanelFooter,
} from "@/components/ui/navbar"
import type { BadgeColor } from "@/components/ui/badge"

// Mirrors the Figma Navbar Menu page (12466:577): Item-Menu-Component (5 types x 3 states),
// six *-Group sets and Menu-01/02/03 (Desktop, Tablet, Mobile).

type ItemState = "default" | "hover" | "active"
const states: ItemState[] = ["default", "hover", "active"]
const IMG = "/images/activity/image.jpg"
const VIDEO = "/images/activity/video.jpg"

// Figma icon names are not exported; closest icons from public/icons (gap logged).
const rows: { title: string; sub: string; icon: string; color: BadgeColor }[] = [
  { title: "Documentation", sub: "356 Articles", icon: "/icons/material-insert-drive-file.svg", color: "purple" },
  { title: "Components", sub: "Descriptions", icon: "/icons/material-list.svg", color: "emerald" },
  { title: "Templates", sub: "Descriptions", icon: "/icons/material-tune.svg", color: "sky" },
  { title: "Playground", sub: "Descriptions", icon: "/icons/material-play-circle-filled.svg", color: "indigo" },
  { title: "Course", sub: "Descriptions", icon: "/icons/material-work.svg", color: "fuchsia" },
  { title: "Community", sub: "Descriptions", icon: "/icons/material-supervisor-account.svg", color: "yellow" },
]
const dot = "/icons/material-default-icon.svg"

const apps = [
  ["Adobe Creative Cloud", "Creative Cloud"],
  ["Adobe Photoshop", "Image Editor"],
  ["Notion", "Docs"],
  ["App Store", "Marketplace"],
  ["Adobe Aero", "Prototyping"],
  ["Tools App", "Productivity"],
]

const footerLinks = [
  ["Pricing", "/icons/material-monetization-on.svg"],
  ["Chat", "/icons/material-chat-bubble.svg"],
  ["Promotions", "/icons/material-search.svg"],
  ["Sign Up for Free", "/icons/material-file-upload.svg"],
]

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-12 font-bold text-base-500">{children}</p>
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 font-bold text-base-900">{title}</h2>
      {children}
    </section>
  )
}

function DefaultItem({ state }: { state?: ItemState }) {
  return (
    <NavbarMenuItem href="#" state={state}>
      <NavbarMenuItemIcon icon={dot} />
      <NavbarMenuItemBadge icon={dot} />
      <NavbarMenuItemContent>
        <NavbarMenuItemHeading>
          <NavbarMenuItemTitle>Heading Item</NavbarMenuItemTitle>
          <NavbarMenuItemTag>BADGE</NavbarMenuItemTag>
        </NavbarMenuItemHeading>
        <NavbarMenuItemDescription>Descriptions</NavbarMenuItemDescription>
      </NavbarMenuItemContent>
    </NavbarMenuItem>
  )
}

function ImageTopItem({ state, title = "Heading Item", sub = "Descriptions", className }: { state?: ItemState; title?: string; sub?: string; className?: string }) {
  return (
    <NavbarMenuItem href="#" type="image-top" state={state} className={className}>
      <NavbarMenuItemImage src={IMG} />
      <NavbarMenuItemContent>
        <NavbarMenuItemTitle>{title}</NavbarMenuItemTitle>
        <NavbarMenuItemDescription>{sub}</NavbarMenuItemDescription>
      </NavbarMenuItemContent>
      <NavbarMenuItemFooter>Learn More</NavbarMenuItemFooter>
    </NavbarMenuItem>
  )
}

function ImageLeftItem({ state, title = "Heading Item", sub = "Descriptions", className }: { state?: ItemState; title?: string; sub?: string; className?: string }) {
  return (
    <NavbarMenuItem href="#" type="image-left" state={state} className={className}>
      <NavbarMenuItemImage src={IMG} />
      <div className="flex min-w-0 flex-col gap-3 pt-1">
        <NavbarMenuItemContent>
          <NavbarMenuItemTitle>{title}</NavbarMenuItemTitle>
          <NavbarMenuItemDescription>{sub}</NavbarMenuItemDescription>
        </NavbarMenuItemContent>
        <NavbarMenuItemFooter>Learn More</NavbarMenuItemFooter>
      </div>
    </NavbarMenuItem>
  )
}

function VideoItem({ state, title = "Heading Item", sub = "Descriptions", className }: { state?: ItemState; title?: string; sub?: string; className?: string }) {
  return (
    <NavbarMenuItem href="#" type="video" state={state} className={className}>
      <NavbarMenuItemVideo>
        <NavbarMenuItemImage src={VIDEO} />
      </NavbarMenuItemVideo>
      <NavbarMenuItemContent>
        <NavbarMenuItemTitle>{title}</NavbarMenuItemTitle>
        <NavbarMenuItemDescription>{sub}</NavbarMenuItemDescription>
      </NavbarMenuItemContent>
      <NavbarMenuItemFooter icon="/icons/material-play-circle-filled.svg" iconPosition="start">
        Watch Video
      </NavbarMenuItemFooter>
    </NavbarMenuItem>
  )
}

function CardItem({
  state,
  title = "Heading Item",
  sub = "Descriptions",
  action = "Button",
  className,
}: {
  state?: ItemState
  title?: string
  sub?: string
  action?: string
  className?: string
}) {
  return (
    <NavbarMenuItem type="card" state={state} className={className}>
      <NavbarMenuItemHead>
        <NavbarMenuItemIcon icon={dot} />
        <Button variant="outline" size="24" shape="pill">
          <ButtonIcon src={dot} className="size-4" />
          {action}
        </Button>
      </NavbarMenuItemHead>
      <NavbarMenuItemContent className="pl-1">
        <NavbarMenuItemTitle>{title}</NavbarMenuItemTitle>
        <NavbarMenuItemDescription>{sub}</NavbarMenuItemDescription>
      </NavbarMenuItemContent>
    </NavbarMenuItem>
  )
}

function SimpleGroup({ label = "MENU", className }: { label?: string; className?: string }) {
  return (
    <NavbarMenuGroup label={label} className={className}>
      {rows.map((r, i) => (
        <NavbarMenuItem key={r.title} href="#">
          <NavbarMenuItemContent>
            <NavbarMenuItemHeading>
              <NavbarMenuItemTitle>{i === 0 ? r.title : r.title}</NavbarMenuItemTitle>
              {i === 0 && <NavbarMenuItemTag>NEW</NavbarMenuItemTag>}
            </NavbarMenuItemHeading>
          </NavbarMenuItemContent>
        </NavbarMenuItem>
      ))}
    </NavbarMenuGroup>
  )
}

function IconsGroup({ label = "MENU", className }: { label?: string; className?: string }) {
  return (
    <NavbarMenuGroup label={label} className={className}>
      {rows.map((r, i) => (
        <NavbarMenuItem key={r.title} href="#">
          <NavbarMenuItemIcon icon={r.icon} />
          <NavbarMenuItemContent>
            <NavbarMenuItemHeading>
              <NavbarMenuItemTitle>{r.title}</NavbarMenuItemTitle>
              {i === 4 && <NavbarMenuItemTag>NEW</NavbarMenuItemTag>}
            </NavbarMenuItemHeading>
          </NavbarMenuItemContent>
        </NavbarMenuItem>
      ))}
    </NavbarMenuGroup>
  )
}

function IconBadgesGroup({ label = "LINKS", className }: { label?: string; className?: string }) {
  return (
    <NavbarMenuGroup label={label} className={className}>
      {rows.map((r, i) => (
        <NavbarMenuItem key={r.title} href="#">
          <NavbarMenuItemBadge icon={r.icon} color={r.color} />
          <NavbarMenuItemContent>
            <NavbarMenuItemHeading>
              <NavbarMenuItemTitle>{r.title}</NavbarMenuItemTitle>
              {i === 4 && <NavbarMenuItemTag>NEW</NavbarMenuItemTag>}
            </NavbarMenuItemHeading>
            <NavbarMenuItemDescription>{r.sub}</NavbarMenuItemDescription>
          </NavbarMenuItemContent>
        </NavbarMenuItem>
      ))}
    </NavbarMenuGroup>
  )
}

function ImagesGroup({ className, rowScroll, layout = "grid" }: { className?: string; rowScroll?: boolean; layout?: "grid" | "list" }) {
  return (
    <NavbarMenuGroup
      label="ARTICLES"
      layout={layout}
      className={className}
      contentClassName={rowScroll ? "flex gap-5 overflow-hidden" : undefined}
    >
      {rows.map((r) => (
        <ImageTopItem key={r.title} title={r.title} sub={r.sub} className={rowScroll || layout === "list" ? (rowScroll ? "w-44 shrink-0" : "w-full") : "w-full"} />
      ))}
    </NavbarMenuGroup>
  )
}

function LeftImagesGroup({ label = "ARTICLES" }: { label?: string }) {
  return (
    <NavbarMenuGroup label={label} layout="image-left">
      {rows.map((r) => (
        <ImageLeftItem key={r.title} title={r.title} sub={r.sub} className="w-full" />
      ))}
    </NavbarMenuGroup>
  )
}

function VideosGroup({ count = 6, label = "VIDEOS" }: { count?: number; label?: string }) {
  return (
    <NavbarMenuGroup label={label}>
      {rows.slice(0, count).map((r) => (
        <VideoItem key={r.title} title={r.title} sub={r.sub} className="w-full" />
      ))}
    </NavbarMenuGroup>
  )
}

function CardsGroup({ layout = "cards-grid", className, contentClassName }: { layout?: "cards" | "cards-grid"; className?: string; contentClassName?: string }) {
  return (
    <NavbarMenuGroup label="APPLICATIONS" layout={layout} className={className} contentClassName={contentClassName}>
      {apps.map(([t, s]) => (
        <CardItem key={t} title={t} sub={s} action="Install" className="w-full" />
      ))}
    </NavbarMenuGroup>
  )
}

function Footer({ size }: { size: "desktop" | "tablet" | "mobile" }) {
  return (
    <NavbarMenuPanelFooter className={size === "mobile" ? "gap-y-6" : undefined}>
      {footerLinks.map(([label, icon]) => (
        <NavbarMenuLink key={label} href="#" variant="blue" icon={icon}>
          {label}
        </NavbarMenuLink>
      ))}
    </NavbarMenuPanelFooter>
  )
}

type PanelSize = "desktop" | "tablet" | "mobile"

// Tablet: groups side by side at 326. Mobile: groups stacked at 288 (Menu-02/03) or clipped side by side (Menu-01).
function Pair({ size, stacked, children }: { size: PanelSize; stacked?: boolean; children: React.ReactNode }) {
  if (size === "desktop") return <>{children}</>
  return <div className={stacked ? "flex flex-col gap-3" : "flex gap-3 overflow-hidden"}>{children}</div>
}

function groupWidth(size: PanelSize, stacked?: boolean) {
  if (size === "tablet") return "w-81.5"
  return stacked ? "w-72" : undefined
}

function Menu01({ size }: { size: PanelSize }) {
  const w = groupWidth(size)
  return (
    <NavbarMenuPanel size={size}>
      <NavbarMenuPanelContent direction={size === "desktop" ? "row" : "col"}>
        <Pair size={size}>
          <SimpleGroup className={w} />
          <IconsGroup className={w} />
        </Pair>
        <CardsGroup
          layout="cards-grid"
          className={size === "desktop" ? undefined : "w-full"}
          contentClassName={size === "mobile" ? "grid-cols-2" : undefined}
        />
      </NavbarMenuPanelContent>
      <Footer size={size} />
    </NavbarMenuPanel>
  )
}

function Menu02({ size }: { size: PanelSize }) {
  const w = groupWidth(size, true)
  return (
    <NavbarMenuPanel size={size}>
      <NavbarMenuPanelContent direction={size === "desktop" ? "row" : "col"}>
        <Pair size={size} stacked={size === "mobile"}>
          <IconsGroup className={w} />
          <IconBadgesGroup className={w} />
        </Pair>
        <ImagesGroup
          className={size === "desktop" ? undefined : "w-full"}
          rowScroll={size === "mobile"}
        />
      </NavbarMenuPanelContent>
      <Footer size={size} />
    </NavbarMenuPanel>
  )
}

function Menu03({ size }: { size: PanelSize }) {
  const w = groupWidth(size, true)
  return (
    <NavbarMenuPanel size={size}>
      <NavbarMenuPanelContent direction={size === "desktop" ? "row" : "col"}>
        <Pair size={size} stacked={size === "mobile"}>
          <IconsGroup className={w} />
          <IconBadgesGroup className={w} />
        </Pair>
        <LeftImagesGroup />
        <VideosGroup count={2} />
      </NavbarMenuPanelContent>
      <Footer size={size} />
    </NavbarMenuPanel>
  )
}

const sizes = ["desktop", "tablet", "mobile"] as const

function MenuBlock({ name, menu }: { name: string; menu: (props: { size: "desktop" | "tablet" | "mobile" }) => React.ReactNode }) {
  return (
    <Block title={name}>
      <div className="flex flex-wrap items-start gap-8">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col gap-2">
            <Caption>{size}</Caption>
            {menu({ size })}
          </div>
        ))}
      </div>
    </Block>
  )
}

export default function NavbarMenuPage() {
  return (
    <main className="flex flex-col gap-10 bg-base-50 p-10">
      <h1 className="text-24 font-bold text-base-900">Navbar Menu</h1>

      <Block title="Item-Menu-Component">
        <div className="flex flex-col gap-8 rounded-r16 bg-background-0 p-10">
          {states.map((state) => (
            <div key={state} className="flex flex-wrap items-start gap-12">
              <Caption>{state}</Caption>
              <DefaultItem state={state} />
              <ImageTopItem state={state} />
              <ImageLeftItem state={state} />
              <VideoItem state={state} />
              <CardItem state={state} />
            </div>
          ))}
        </div>
      </Block>

      <Block title="Groups">
        <div className="flex flex-wrap items-start gap-6 rounded-r16 bg-background-0 p-6">
          <div className="flex flex-col gap-2"><Caption>Menu-Simple-Group</Caption><SimpleGroup /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Icons-Group</Caption><IconsGroup /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Icon-Badges-Group</Caption><IconBadgesGroup /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Images-Group</Caption><ImagesGroup layout="list" className="w-50" /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Left-Images-Group</Caption><LeftImagesGroup /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Videos-Group</Caption><VideosGroup /></div>
          <div className="flex flex-col gap-2"><Caption>Menu-Cards-Group</Caption><CardsGroup layout="cards" /></div>
        </div>
      </Block>

      <MenuBlock name="Menu-01" menu={Menu01} />
      <MenuBlock name="Menu-02" menu={Menu02} />
      <MenuBlock name="Menu-03" menu={Menu03} />
    </main>
  )
}
