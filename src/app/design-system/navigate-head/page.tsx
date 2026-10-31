import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbIcon,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BreadcrumbTrail } from "@/components/breadcrumb/BreadcrumbTrail"
import { Button, ButtonIcon } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupIcon,
  InputGroupInput,
  InputGroupJoin,
  InputGroupKbd,
} from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import { Link } from "@/components/ui/link"
import {
  NavigateHead,
  NavigateHeadBody,
  NavigateHeadCover,
  NavigateHeadGroup,
  NavigateHeadLinks,
  NavigateHeadText,
  NavigateHeadTitle,
  type NavigateHeadSize,
} from "@/components/ui/navigate-head"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerifyIcon } from "@/components/ui/verify-icon"

// Mirrors the Figma Navigate Head page (8967:25852): Head-01 … Head-19, Desktop (Tablet) 1128 and Mobile 320.
// Icons Figma uses but public/icons lacks (phone, edit, send, sort, grid, branch, tag, arrows, people)
// fall back to the default icon; see design/known-gaps.md.

const ICON = "/icons/material-default-icon.svg"
const photos = [1, 2, 3, 4, 5, 6].map((n) => `/images/avatars/avatar-${n}.png`)
const links = [0, 1, 2, 3, 4, 5]

function Frame({ title, desktop, mobile }: { title: string; desktop: React.ReactNode; mobile?: React.ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-6">
      <h2 className="text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-col gap-12 overflow-x-auto">
        <div className="w-282 shrink-0">{desktop}</div>
        {mobile && <div className="w-80 shrink-0">{mobile}</div>}
      </div>
    </section>
  )
}

function Photo({ src = photos[0], size = "48" as const }: { src?: string; size?: "24" | "32" | "48" | "60" | "80" | "96" }) {
  return (
    <Avatar size={size}>
      <AvatarImage src={src} alt="" />
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
  )
}

function Profile({ size }: { size: "48" | "60" | "80" | "96" }) {
  return (
    <div className="relative inline-flex">
      <Avatar size={size} frame="profile">
        <AvatarImage src={photos[0]} alt="" />
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <VerifyIcon color="blue" className="absolute right-0 bottom-0" />
    </div>
  )
}

function IconButton({ label = "Action" }: { label?: string }) {
  return (
    <Button variant="outline" shape="pill" size="icon-32" aria-label={label}>
      <ButtonIcon src={ICON} />
    </Button>
  )
}

function Outline({
  children = "Button",
  icon = true,
  fill = false,
  size = "32" as "32" | "40",
}: {
  children?: React.ReactNode
  icon?: boolean | string
  fill?: boolean
  size?: "32" | "40"
}) {
  return (
    <Button variant="outline" shape="pill" size={size} className={fill ? "w-full" : undefined}>
      {icon && <ButtonIcon src={typeof icon === "string" ? icon : ICON} />}
      {children}
    </Button>
  )
}

function Primary({ children = "Primary Button", size = "32" as "32" | "40", fill = false }) {
  return (
    <Button variant="primary" shape="pill" size={size} className={fill ? "w-full" : undefined}>
      {children}
    </Button>
  )
}

function Dark({ fill = false, children = "Button" }: { fill?: boolean; children?: string }) {
  return (
    <Button variant="dark" shape="pill" size="32" className={fill ? "w-full" : undefined}>
      <ButtonIcon src="/icons/material-add-circle.svg" />
      {children}
    </Button>
  )
}

function Ghost({ children = "Button" }) {
  return (
    <Button variant="ghost" shape="rounded" size="32">
      <ButtonIcon src={ICON} />
      {children}
    </Button>
  )
}

function Search({ kbd = true, className }: { kbd?: boolean; className?: string }) {
  return (
    <InputGroupJoin size="32" shape="pill" className={className}>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupIcon src="/icons/material-search.svg" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search" aria-label="Search" />
        {kbd && (
          <InputGroupAddon align="inline-end">
            <KbdGroup>
              <InputGroupKbd size="16">⌘K</InputGroupKbd>
            </KbdGroup>
          </InputGroupAddon>
        )}
      </InputGroup>
    </InputGroupJoin>
  )
}

function PillTabs({ fill = false }: { fill?: boolean }) {
  return (
    <Tabs defaultValue="1">
      <TabsList variant="pill" size="sm" className={fill ? "w-full justify-start" : undefined}>
        {["1", "2", "3"].map((v) => (
          <TabsTrigger key={v} value={v}>
            Tab
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

function Segmented({ fill = false }: { fill?: boolean }) {
  return (
    <ButtonGroup shape="pill" size="32" resizing={fill ? "fill" : "hug"} aria-label="Actions">
      <Button variant="outline" shape="pill" size="32">
        Button
      </Button>
      <Button variant="outline" shape="pill" size="32">
        Button
      </Button>
    </ButtonGroup>
  )
}

function Arrows() {
  return (
    <ButtonGroup shape="pill" size="32" aria-label="Navigate">
      <Button variant="outline" shape="pill" size="icon-32" aria-label="Previous">
        <ButtonIcon src="/icons/material-chevron-left.svg" />
      </Button>
      <Button variant="outline" shape="pill" size="icon-32" aria-label="Next">
        <ButtonIcon src="/icons/material-chevron-right.svg" />
      </Button>
    </ButtonGroup>
  )
}

function Team({ size = "32" as "24" | "32" }) {
  return (
    <AvatarGroup size={size}>
      {photos.map((src) => (
        <Avatar key={src} size={size}>
          <AvatarImage src={src} alt="" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+2</AvatarGroupCount>
    </AvatarGroup>
  )
}

function Links({ active = true }: { active?: boolean }) {
  return (
    <NavigateHeadLinks aria-label="Sections">
      {links.map((i) => (
        <Link key={i} href="#" size="13" variant={active && i === 0 ? "blue" : "500"}>
          Link
        </Link>
      ))}
    </NavigateHeadLinks>
  )
}

function Heading({ size }: { size: NavigateHeadSize }) {
  return (
    <NavigateHeadGroup gap={3}>
      <IconButton />
      <NavigateHeadTitle size={"12"} tone="soft">
        Name Project
      </NavigateHeadTitle>
    </NavigateHeadGroup>
  )
}

function Head01({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size}>
      <NavigateHeadBody>
        <Heading size={size} />
        {m ? (
          <>
            <NavigateHeadGroup gap={2} wrap><Outline /><Outline /><Outline /></NavigateHeadGroup>
            <Search />
            <Dark fill />
          </>
        ) : (
          <NavigateHeadGroup gap={3}>
            <Outline />
            <Outline />
            <Outline />
            <Search className="w-40" />
            <Dark />
          </NavigateHeadGroup>
        )}
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head02({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider>
      <NavigateHeadBody>
        <Heading size={size} />
        {m ? (
          <>
            <NavigateHeadGroup gap={2} wrap><Outline /><Outline /><Outline /></NavigateHeadGroup>
            <Segmented fill />
            <Search />
            <Dark fill />
          </>
        ) : (
          <>
            <Segmented />
            <NavigateHeadGroup gap={3}>
              <Outline />
              <Outline />
              <Outline />
              <Search className="w-40" />
              <Dark />
            </NavigateHeadGroup>
          </>
        )}
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head0304({ size, divider }: { size: NavigateHeadSize; divider: boolean }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider={divider}>
      <NavigateHeadBody className={!m && !divider ? "justify-start gap-0" : undefined}>
        <PillTabs />
        {m ? (
          <>
            <NavigateHeadGroup gap={2} wrap><Outline /><Outline /><Outline /></NavigateHeadGroup>
            <Segmented fill />
            <Dark fill />
          </>
        ) : (
          <>
            {!divider && <Segmented />}
            <NavigateHeadGroup gap={3} className={!divider ? "ml-auto" : undefined}>
              {divider && <Segmented />}
              <Outline />
              <Outline />
              <Outline />
              <Dark />
            </NavigateHeadGroup>
          </>
        )}
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head05({ size }: { size: NavigateHeadSize }) {
  return (
    <NavigateHead size={size}>
      <NavigateHeadBody>
        <BreadcrumbTrail size="sm" items={[{ label: "Dashboard", icon: "/icons/material-home.svg" }]} />
        <NavigateHeadGroup gap={2}>
          {[1, 2, 3, 4].map((i) => (
            <Button key={i} variant="ghost" shape="rounded" size="32">
              <ButtonIcon src={ICON} />
              Item
            </Button>
          ))}
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head06() {
  return (
    <NavigateHead divider className="gap-4">
      <NavigateHeadBody className="px-4 pt-4 gap-5">
        <IconButton label="Profile" />
        <IconButton label="Back" />
        <NavigateHeadGroup className="flex-1 justify-between">
          <NavigateHeadTitle size="14" tone="soft" className="text-13">
            Work Chat Group
          </NavigateHeadTitle>
          <NavigateHeadGroup gap={3}>
            {["videocam", "chat-bubble", "image", "insert-drive-file"].map((n) => (
              <span
                key={n}
                aria-hidden
                className="size-5 bg-base-500 mask-contain mask-center mask-no-repeat"
                style={{ maskImage: `url(/icons/material-${n}.svg)` }}
              />
            ))}
          </NavigateHeadGroup>
          <Team size="24" />
        </NavigateHeadGroup>
        <IconButton label="Members" />
        <IconButton label="Forward" />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head07({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="gap-0">
      <NavigateHeadCover src="/images/banners/banner-1.png" />
      <NavigateHeadBody className={m ? "items-center px-5 pt-3 pb-6 gap-2" : "px-12 pt-4 pb-8 gap-2"} align="start">
        <NavigateHeadGroup direction={m ? "col" : "row"} className={m ? "w-full items-center" : "items-start"} gap={3}>
          <div className="-mt-12">
            <Profile size={m ? "80" : "96"} />
          </div>
          <NavigateHeadGroup direction={m ? "col" : "row"} gap={3} className={m ? "items-center" : "pt-2"}>
            <NavigateHeadTitle size={m ? "16" : "14"}>Heading Page</NavigateHeadTitle>
            <NavigateHeadText size="13" className="text-14 font-semibold">
              Additional Text
            </NavigateHeadText>
          </NavigateHeadGroup>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={m ? 3 : 4} direction={m ? "col" : "row"} className={m ? "w-full items-stretch" : undefined}>
          <Outline size="32" icon="/icons/material-mail-outline.svg">
            Message
          </Outline>
          <Outline size="32">Call</Outline>
          <Dark fill={m}>Follow User</Dark>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head08({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="pt-8">
      <NavigateHeadBody align="start" className="pb-0">
        <NavigateHeadGroup direction="col" gap={4}>
          <Breadcrumb>
            <BreadcrumbList size="sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  <BreadcrumbIcon size="sm" icon="/icons/material-home.svg" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Templates</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <NavigateHeadTitle size="20">Heading Page</NavigateHeadTitle>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={4} direction={m ? "col" : "row"} className={m ? "items-stretch" : undefined}>
          <NavigateHeadGroup gap={4}>
            <Outline size="40" fill={m}>
              Edit
            </Outline>
            <Outline size="40" fill={m} icon="/icons/material-link.svg">
              View
            </Outline>
          </NavigateHeadGroup>
          <Primary size="40" fill={m}>
            Publish
          </Primary>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function HeadProfile({ size, order, second }: { size: NavigateHeadSize; order: "09" | "11"; second: string }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider>
      <NavigateHeadBody>
        <NavigateHeadGroup gap={5}>
          <Profile size={m ? "48" : "60"} />
          <NavigateHeadGroup direction="col" gap={2}>
            {order === "11" && <NavigateHeadText>Second Line</NavigateHeadText>}
            <NavigateHeadTitle size={order === "11" ? "14-bold" : "12"}>Heading Page</NavigateHeadTitle>
            {order === "09" && (
              <NavigateHeadGroup gap={3}>
                <NavigateHeadText>{second}</NavigateHeadText>
                <NavigateHeadText>Additional Text</NavigateHeadText>
              </NavigateHeadGroup>
            )}
          </NavigateHeadGroup>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={4}>
          <Outline icon={false} size={order === "09" ? "40" : "32"}>
            {order === "09" ? "Second Button" : "Button"}
          </Outline>
          <Primary size={order === "09" ? "40" : "32"}>Primary Button</Primary>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Actions({ outline = "Second Button" }: { outline?: string }) {
  return (
    <NavigateHeadGroup gap={4}>
      <Outline icon={false}>{outline}</Outline>
      <Primary>Primary Button</Primary>
    </NavigateHeadGroup>
  )
}

function Head10({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="gap-5">
      <NavigateHeadBody className={m ? "gap-6" : undefined}>
        <NavigateHeadGroup gap={8} direction={m ? "col" : "row"} className={m ? "items-start gap-5" : undefined}>
          <NavigateHeadTitle size="16">Heading</NavigateHeadTitle>
          {!m && <span aria-hidden className="h-11 w-px bg-background-100" />}
          <Links active={false} />
        </NavigateHeadGroup>
        <Actions />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head12({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="gap-5">
      <NavigateHeadBody>
        <NavigateHeadGroup direction="col" gap={2}>
          <NavigateHeadTitle size="16">Heading</NavigateHeadTitle>
          <NavigateHeadText>Second Line</NavigateHeadText>
        </NavigateHeadGroup>
        <Actions />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head13({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider>
      <NavigateHeadBody>
        <NavigateHeadGroup direction="col" gap={2}>
          <NavigateHeadTitle size="16">Heading</NavigateHeadTitle>
          <NavigateHeadText>Second Line</NavigateHeadText>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={3} className={m ? "w-full" : undefined}>
          <Search kbd={false} className={m ? "flex-1" : "w-40"} />
          <Outline>Sort</Outline>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head14({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="gap-6">
      <NavigateHeadBody className={m ? "gap-6" : undefined}>
        <NavigateHeadGroup direction="col" gap={2}>
          <NavigateHeadTitle size="18">Heading</NavigateHeadTitle>
          <NavigateHeadText>Second Line</NavigateHeadText>
        </NavigateHeadGroup>
        <Actions />
      </NavigateHeadBody>
      <Links />
    </NavigateHead>
  )
}

function Head15({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className={m ? "gap-8" : "gap-0"}>
      <NavigateHeadBody className={m ? "gap-8" : "pb-6"}>
        <NavigateHeadTitle size="16">Heading</NavigateHeadTitle>
        {m ? null : <Links />}
        {!m && <Primary>Primary Button</Primary>}
        {m && (
          <>
            <Links />
            <Primary>Primary Button</Primary>
          </>
        )}
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head16({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size} divider className="gap-6">
      <NavigateHeadBody className={m ? "gap-6" : undefined}>
        <NavigateHeadTitle size="14">Heading</NavigateHeadTitle>
        <NavigateHeadGroup gap={3} className={m ? "w-full" : undefined}>
          <Outline fill={m}>Sort</Outline>
          <ButtonGroup shape="pill" size="32" aria-label="View">
            <Button variant="outline" shape="pill" size="icon-32" aria-label="List">
              <ButtonIcon src="/icons/material-list.svg" />
            </Button>
            <Button variant="outline" shape="pill" size="icon-32" aria-label="Grid">
              <ButtonIcon src={ICON} />
            </Button>
          </ButtonGroup>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head18({ size }: { size: NavigateHeadSize }) {
  const m = size === "mobile"
  return (
    <NavigateHead size={size}>
      <NavigateHeadBody className={m ? "gap-4" : undefined}>
        <NavigateHeadGroup gap={m ? 4 : 3} direction={m ? "col" : "row"} className={m ? "items-stretch" : undefined}>
          <NavigateHeadGroup gap={3}>
            <Button variant="outline" shape="pill" size="32">
              <ButtonIcon src="/icons/material-sidebar.svg" />
              Sidebar
            </Button>
            <Button variant="outline" shape="pill" size="32">
              <ButtonIcon src={ICON} />
              Development
              <ButtonIcon src="/icons/material-expand-more.svg" />
            </Button>
          </NavigateHeadGroup>
          <NavigateHeadGroup gap={m ? 4 : 3}>
            <Button variant="ghost" shape="pill" size="32">
              <ButtonIcon src={ICON} />
              15 branches
            </Button>
            <Button variant="ghost" shape="pill" size="32">
              <ButtonIcon src={ICON} />
              127 Tags
            </Button>
          </NavigateHeadGroup>
        </NavigateHeadGroup>
        <NavigateHeadGroup gap={3} className={m ? "w-full [&>*]:flex-1" : undefined}>
          <Button variant="outline" shape="pill" size="32">
            Go to file
          </Button>
          <Button variant="primary" shape="pill" size="32">
            Code
            <ButtonIcon src="/icons/material-expand-more.svg" />
          </Button>
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head19({ size }: { size: NavigateHeadSize }) {
  return (
    <NavigateHead size={size}>
      <NavigateHeadBody className="group-data-[size=mobile]/head:flex-row group-data-[size=mobile]/head:items-center group-data-[size=mobile]/head:justify-start group-data-[size=mobile]/head:gap-12">
        <NavigateHeadGroup gap={size === "mobile" ? 2 : 3}>
          <span aria-hidden className="size-1.5 rounded-full bg-base-500" />
          <NavigateHeadTitle size={size === "mobile" ? "12" : "14"}>Heading</NavigateHeadTitle>
        </NavigateHeadGroup>
        <Arrows />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

export default function NavigateHeadPreviewPage() {
  const both = (render: (s: NavigateHeadSize) => React.ReactNode) => ({
    desktop: render("desktop"),
    mobile: render("mobile"),
  })

  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Frame title="Head-01 (Size: Desktop (Tablet), Mobile)" {...both((s) => <Head01 size={s} />)} />
      <Frame title="Head-02 (Size: Desktop (Tablet), Mobile)" {...both((s) => <Head02 size={s} />)} />
      <Frame title="Head-03 (Size: Desktop (Tablet), Mobile)" {...both((s) => <Head0304 size={s} divider />)} />
      <Frame title="Head-04 (Size: Desktop (Tablet), Mobile)" {...both((s) => <Head0304 size={s} divider={false} />)} />
      <Frame title="Head-05 (Size: Desktop (Tablet), Mobile)" {...both((s) => <Head05 size={s} />)} />
      <Frame title="Head-06 (Type: Default)" desktop={<Head06 />} />
      <Frame title="Head-07 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head07 size={s} />)} />
      <Frame title="Head-08 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head08 size={s} />)} />
      <Frame
        title="Head-09 (Type: Desktop (Tablet), Mobile)"
        {...both((s) => <HeadProfile size={s} order="09" second="Second Line" />)}
      />
      <Frame title="Head-10 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head10 size={s} />)} />
      <Frame
        title="Head-11 (Type: Desktop (Tablet), Mobile)"
        {...both((s) => <HeadProfile size={s} order="11" second="Second Line" />)}
      />
      <Frame title="Head-12 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head12 size={s} />)} />
      <Frame title="Head-13 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head13 size={s} />)} />
      <Frame title="Head-14 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head14 size={s} />)} />
      <Frame title="Head-15 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head15 size={s} />)} />
      <Frame title="Head-16 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head16 size={s} />)} />
      <Frame
        title="Head-17 (Type: Responsive)"
        desktop={
          <NavigateHead divider className="gap-6">
            <Links />
          </NavigateHead>
        }
      />
      <Frame title="Head-18 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head18 size={s} />)} />
      <Frame title="Head-19 (Type: Desktop (Tablet), Mobile)" {...both((s) => <Head19 size={s} />)} />
    </main>
  )
}
