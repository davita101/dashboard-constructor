import Image from "next/image"
import * as React from "react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupIcon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarActions,
  SidebarBlock,
  SidebarBlockHead,
  SidebarBlockTitle,
  SidebarBrand,
  SidebarChat,
  SidebarChatBody,
  SidebarChatMain,
  SidebarChatName,
  SidebarChatText,
  SidebarChatTime,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  SidebarItem,
  SidebarItemEnd,
  SidebarItemLabel,
  SidebarItemRow,
  SidebarLogo,
  SidebarMenu,
  SidebarProfile,
  SidebarProfileName,
  SidebarProfileRole,
  SidebarRail,
  SidebarRailItem,
  SidebarTextItem,
  SidebarTitle,
  SidebarUser,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mirrors the Figma Sidebar page (15260:53844): Sidebar-01 (Default, Icons) to Sidebar-09.

const photos = [1, 2, 3, 4, 5, 6].map((n) => `/images/avatars/avatar-${n}.png`)
const photo = (i: number) => photos[i % photos.length]

type PhotoSize = "40" | "32" | "24"
type Tint = "primary-soft" | "pink-soft" | "amber-soft" | "purple-soft" | "green-soft" | "sky-soft"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-8">{children}</div>
    </section>
  )
}

function Photo({ i, size }: { i: number; size: PhotoSize }) {
  return (
    <Avatar size={size}>
      <AvatarImage src={photo(i)} alt="" />
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
  )
}

function Letter({ text, size, variant = "primary-soft" }: { text: string; size: PhotoSize; variant?: Tint | "primary" }) {
  return (
    <Avatar size={size}>
      <AvatarFallback variant={variant}>{text}</AvatarFallback>
    </Avatar>
  )
}

function CircleButton({ icon, size = "32" }: { icon: string; size?: "32" | "24" }) {
  return (
    <Button variant="outline" size={size === "32" ? "icon-32" : "icon-24"} aria-label={icon}>
      <ButtonIcon src={`/icons/material-${icon}.svg`} className={size === "32" ? "size-4" : "size-3"} />
    </Button>
  )
}

function ViewAll() {
  return (
    <Button variant="outline" size="20">
      View All
    </Button>
  )
}

function Brand({ title, back = false }: { title: string; back?: boolean }) {
  return (
    <SidebarHeader>
      <SidebarBrand>
        <SidebarLogo />
        <SidebarTitle>{title}</SidebarTitle>
      </SidebarBrand>
      <SidebarActions>
        <SidebarIcon name="bolt" size="16" />
        <SidebarIcon name={back ? "arrow-back" : "sidebar"} size="16" />
      </SidebarActions>
    </SidebarHeader>
  )
}

const navigate = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "apps", label: "Projects" },
  { icon: "note", label: "Notes" },
  { icon: "cloud", label: "Files" },
  { icon: "chat-bubble", label: "Chats" },
  { icon: "mail-outline", label: "Mail", badge: "1" },
  { icon: "supervisor-account", label: "Users", plain: true },
  { icon: "today", label: "Calendar" },
  { icon: "info2", label: "Knowledge Base", plain: true },
  { icon: "account-box", label: "Clients", plain: true },
  { icon: "forum", label: "Messenger", plain: true },
]

function GroupHead({ label, open = false }: { label: string; open?: boolean }) {
  return (
    <SidebarGroupHead>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarIcon name={open ? "expand-less" : "expand-more"} />
    </SidebarGroupHead>
  )
}

function UserFooter({ sub }: { sub: string }) {
  return (
    <SidebarUser>
      <Photo i={0} size="32" />
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-10 leading-16 font-bold text-base-800">John Smith</span>
        <span className="text-10 leading-16 font-semibold text-base-500">{sub}</span>
      </span>
      <SidebarIcon name="expand-less" size="16" className="text-base-500" />
    </SidebarUser>
  )
}

function SearchInput() {
  return (
    <InputGroup size="32" shape="pill">
      <InputGroupInput placeholder="Search Chats, Users..." aria-label="Search" />
      <InputGroupAddon align="inline-end">
        <InputGroupIcon src="/icons/material-search.svg" />
      </InputGroupAddon>
    </InputGroup>
  )
}

function Sidebar01() {
  return (
    <Sidebar bordered className="h-285 justify-between">
      <SidebarContent className="flex-none gap-4">
        <Brand title="New Project" />
        <SidebarGroup>
          <GroupHead label="Navigate" open />
          <SidebarMenu>
            {navigate.map((item) => (
              <SidebarItem key={item.label} active={item.active}>
                <SidebarIcon name={item.icon} className={item.active ? "text-base-800" : "text-base-500"} />
                <SidebarItemLabel>{item.label}</SidebarItemLabel>
                <SidebarItemEnd>
                  {item.badge && (
                    <Badge variant="black" size="square-16">
                      {item.badge}
                    </Badge>
                  )}
                  {!item.plain && <SidebarIcon name="chevron-right" />}
                </SidebarItemEnd>
              </SidebarItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <GroupHead label="More" open />
        </SidebarGroup>
        <SidebarGroup>
          <GroupHead label="Links" open />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {[
            ["settings", "Settings"],
            ["language", "Language"],
          ].map(([icon, label]) => (
            <SidebarItem key={label}>
              <SidebarIcon name={icon} className="text-base-500" />
              <SidebarItemLabel>{label}</SidebarItemLabel>
              <SidebarItemEnd>
                <SidebarIcon name="expand-more" />
              </SidebarItemEnd>
            </SidebarItem>
          ))}
          <SidebarItemRow>
            <Switch aria-label="Night Mode" />
            <SidebarItemLabel>Night Mode</SidebarItemLabel>
          </SidebarItemRow>
          <SidebarItem>
            <SidebarIcon name="school" className="text-base-500" />
            <SidebarItemLabel>Learn</SidebarItemLabel>
          </SidebarItem>
        </SidebarMenu>
        <UserFooter sub="johnsmith@gmail.com" />
      </SidebarFooter>
    </Sidebar>
  )
}

const iconRail = [
  "dashboard",
  "apps",
  "note",
  "cloud",
  "chat-bubble",
  "mail-outline",
  "sort",
  "supervisor-account",
  "today",
  "info2",
  "account-box",
  "forum",
  "settings",
  "language",
  "brightness-2",
  "school",
  "insert-drive-file",
  "help",
]

function Sidebar01Icons() {
  return (
    <Sidebar layout="icon" bordered className="h-285 justify-between">
      <div className="flex flex-col items-center gap-2">
        <SidebarLogo size="40" />
        <SidebarMenu className="items-center gap-1">
          {iconRail.map((icon, i) => (
            <SidebarItem key={icon} collapsed active={i === 0} aria-label={icon}>
              <SidebarIcon name={icon} className={i === 0 ? "text-base-800" : "text-base-500"} />
            </SidebarItem>
          ))}
        </SidebarMenu>
      </div>
      <Photo i={0} size="32" />
    </Sidebar>
  )
}

function Sidebar02() {
  const letters: [string, "primary" | "pink-soft" | "amber-soft"][] = [
    ["M", "primary"],
    ["D", "pink-soft"],
    ["V", "amber-soft"],
  ]
  return (
    <Sidebar layout="rail" bordered className="h-200 justify-between">
      <div className="flex flex-col">
        <SidebarRail>
          {letters.map(([letter, variant], i) => (
            <SidebarRailItem key={letter} aria-label={letter}>
              <Avatar size="32" story={i === 0}>
                <AvatarFallback variant={variant}>{letter}</AvatarFallback>
                <AvatarBadge />
              </Avatar>
            </SidebarRailItem>
          ))}
        </SidebarRail>
        <SidebarRail>
          <div className="flex size-12 items-center justify-center p-2">
            <CircleButton icon="chevron-left" />
          </div>
        </SidebarRail>
      </div>
      <SidebarRail>
        {photos.slice(0, 4).map((_, i) => (
          <SidebarRailItem key={i} aria-label={`Contact ${i + 1}`}>
            <Photo i={i} size="32" />
          </SidebarRailItem>
        ))}
      </SidebarRail>
    </Sidebar>
  )
}

function Sidebar03() {
  const users = [
    { name: "Ethan Rivers", time: "15:45", i: 1, badge: true },
    { name: "Work Chat", time: "11:22", letter: "M" },
    { name: "Liam Carter", time: "10:21", i: 2 },
    { name: "Noah Bennett", time: "09:12", i: 3 },
  ]
  return (
    <Sidebar layout="flush" bordered>
      <SidebarBlock gap="16" pad="user">
        <div className="flex items-center justify-between">
          <CircleButton icon="account-circle" />
          <CircleButton icon="more-horiz" />
        </div>
        <SidebarProfile>
          <Avatar size="96">
            <AvatarImage src={photo(1)} alt="" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <SidebarProfileName>Esther Howard</SidebarProfileName>
            <SidebarProfileRole>Designer</SidebarProfileRole>
          </div>
        </SidebarProfile>
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="icon-40" aria-label="Facebook">
            <Image src="/icons/brands/facebook.png" alt="" width={20} height={20} />
          </Button>
          <Button variant="outline" size="icon-40" aria-label="Instagram">
            <ButtonIcon src="/icons/material-instagram.svg" className="size-5" />
          </Button>
          <Button variant="outline" size="icon-40" aria-label="X">
            <Image src="/icons/brands/x-twitter.png" alt="" width={20} height={20} />
          </Button>
        </div>
      </SidebarBlock>
      <Separator />
      <SidebarBlock>
        <SidebarBlockHead>
          <SidebarBlockTitle className="text-base-800">Members</SidebarBlockTitle>
          <ViewAll />
        </SidebarBlockHead>
        <AvatarGroup size="24">
          {photos.map((src, i) => (
            <Avatar key={i} size="24">
              <AvatarImage src={src} alt="" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
      </SidebarBlock>
      <Separator />
      <SidebarBlock gap="20">
        <SidebarBlockHead>
          <SidebarBlockTitle>Messages</SidebarBlockTitle>
          <SidebarActions>
            <SidebarIcon name="mode" size="16" />
            <SidebarIcon name="file-download" size="16" />
            <SidebarIcon name="star" size="16" />
          </SidebarActions>
        </SidebarBlockHead>
        <SearchInput />
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <SidebarChat key={u.name}>
              <SidebarChatMain>
                {u.letter ? <Letter text={u.letter} size="24" /> : <Photo i={u.i ?? 0} size="24" />}
                <SidebarChatName>{u.name}</SidebarChatName>
              </SidebarChatMain>
              <span className="flex items-center gap-3">
                {u.badge && (
                  <Badge variant="black" size="square-16">
                    1
                  </Badge>
                )}
                <SidebarChatTime className={u.badge ? "text-base-800" : undefined}>{u.time}</SidebarChatTime>
              </span>
            </SidebarChat>
          ))}
        </div>
        <Button variant="outline" size="24" className="w-full">
          Load More
        </Button>
      </SidebarBlock>
    </Sidebar>
  )
}

function Sidebar04() {
  const people = [
    { name: "Ethan Rivers", i: 1 },
    { name: "Don Wendor", i: 2 },
    { name: "Masha Kin", i: 3 },
  ]
  const files = [
    { name: "Guideline WorkFlows.pdf", icon: "insert-drive-file" },
    { name: "Voice Message.mp4", icon: "music-note" },
    { name: "Photo Sitation Art.png", icon: "image" },
    { name: "Sitation Art.png", icon: "image" },
  ]
  return (
    <Sidebar layout="flush" bordered className="gap-5 pb-21">
      <SidebarBlock gap="20" pad="user" className="gap-0">
        <div className="flex items-center justify-between">
          <CircleButton icon="mode" />
          <CircleButton icon="more-horiz" />
        </div>
        <SidebarProfile className="gap-5">
          <span className="flex size-24 items-center justify-center rounded-full bg-background-40">
            <Avatar size="60">
              <AvatarFallback variant="primary-soft">GC</AvatarFallback>
            </Avatar>
          </span>
          <div className="flex flex-col items-center gap-4">
            <SidebarProfileName className="text-16">Group Chat</SidebarProfileName>
            <Badge variant="soft-border" color="dark" size="20">
              @workchat
            </Badge>
          </div>
        </SidebarProfile>
      </SidebarBlock>
      <SidebarBlock pad="x" gap="20">
        <SidebarBlockHead>
          <SidebarBlockTitle>
            12 Participants <SidebarIcon name="expand-more" />
          </SidebarBlockTitle>
          <ViewAll />
        </SidebarBlockHead>
        <div className="flex flex-col gap-3">
          {people.map((p) => (
            <div key={p.name} className="flex items-center justify-between">
              <SidebarChatMain>
                <Photo i={p.i} size="24" />
                <SidebarChatName>{p.name}</SidebarChatName>
              </SidebarChatMain>
              <CircleButton icon="mode" size="24" />
            </div>
          ))}
        </div>
      </SidebarBlock>
      <SidebarBlock pad="x" gap="20">
        <SidebarBlockHead>
          <SidebarBlockTitle>
            Media Files <SidebarIcon name="expand-more" />
          </SidebarBlockTitle>
          <ViewAll />
        </SidebarBlockHead>
        <Tabs defaultValue="All">
          <TabsList variant="pill" size="sm" className="w-full">
            {["All", "Video", "Docs", "Audio"].map((t) => (
              <TabsTrigger key={t} value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-4">
          {files.map((f) => (
            <div key={f.name} className="flex items-center justify-between">
              <SidebarChatMain>
                <SidebarIcon name={f.icon} className="text-base-500" />
                <SidebarChatBody>
                  <SidebarChatName>{f.name}</SidebarChatName>
                  <SidebarChatText>2,4 Mb</SidebarChatText>
                </SidebarChatBody>
              </SidebarChatMain>
              <CircleButton icon="file-download" />
            </div>
          ))}
        </div>
        <Button variant="outline" size="24" className="w-full">
          Load More
        </Button>
      </SidebarBlock>
    </Sidebar>
  )
}

type ChatUser = { name: string; text: string; i?: number; letter?: string; variant?: Tint }

const chatUsers: ChatUser[] = [
  { name: "Alex Johnson", text: "Feeling great today!...", i: 0 },
  { name: "Maria Smith", text: "Just finished a project...", letter: "M" },
  { name: "James Brown", text: "Can't wait for the we...", letter: "DS", variant: "purple-soft" },
  { name: "Emily Davis", text: "Just got back from a l...", i: 1 },
  { name: "Michael Wilson", text: "Excited to start a new...", i: 2 },
  { name: "Sarah Taylor", text: "Had a productive day...", i: 3 },
  { name: "David Anderson", text: "Just tried a new recip...", i: 4 },
  { name: "Sophia Thomas", text: "Looking forward to ...", letter: "M", variant: "amber-soft" },
  { name: "Daniel Martinez", text: "Just finished a worko...", i: 5 },
  { name: "Olivia Garcia", text: "Enjoying a quiet even...", i: 0 },
  { name: "Matthew Rodriguez", text: "Just got some good n...", i: 1 },
  { name: "Olivia Johnson", text: "Ready to tackle the c...", i: 2 },
]

function Sidebar05() {
  return (
    <Sidebar>
      <SearchInput />
      <div className="flex flex-col gap-3 px-1.5">
        {chatUsers.map((u) => (
          <SidebarChat key={u.name}>
            <SidebarChatMain>
              {u.letter ? <Letter text={u.letter} size="40" variant={u.variant} /> : <Photo i={u.i ?? 0} size="40" />}
              <SidebarChatBody>
                <span className="text-11 leading-20 font-bold text-base-700">{u.name}</span>
                <SidebarChatText>{u.text}</SidebarChatText>
              </SidebarChatBody>
            </SidebarChatMain>
            <SidebarChatTime>15:45</SidebarChatTime>
          </SidebarChat>
        ))}
      </div>
    </Sidebar>
  )
}

function Sidebar06() {
  const tags = ["javascript", "svg", "webgl", "html5", "canvas", "augmented", "webaudio", "virtual-reality", "webgl2", "webgpu"]
  const facts = [
    ["chrome-reader-mode", "Readme"],
    ["balance", "MIT License"],
    ["file-open", "Code of conduct"],
    ["star", "77k stars"],
    ["remove-red-eye", "2.5k watching"],
    ["alt-route", "30k forks"],
  ]
  const contributors: [string, Tint][] = [
    ["M", "primary-soft"],
    ["DS", "pink-soft"],
    ["FD", "sky-soft"],
    ["M", "purple-soft"],
    ["M", "amber-soft"],
    ["M", "pink-soft"],
    ["KL", "green-soft"],
  ]
  return (
    <Sidebar layout="flush" bordered className="gap-4 pb-6">
      <div className="flex flex-col gap-4 px-4 pt-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-18 leading-28 font-semibold text-base-800">About</h2>
          <p className="text-12 leading-20 font-semibold text-base-500">JavaScript 3D Library</p>
        </div>
        <a href="#" className="flex items-center gap-3 text-12 leading-20 font-bold text-blue-600">
          <SidebarIcon name="link" size="24" />
          threee.js
        </a>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="soft-border" color="dark" size="24">
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {facts.map(([icon, label], i) => (
            <div key={label} className={`flex items-center gap-3 text-11 leading-20 font-bold ${i < 3 ? "text-base-800" : "text-base-500"}`}>
              <SidebarIcon name={icon} className="text-base-500" />
              {label}
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <SidebarBlock pad="x">
        <SidebarBlockHead>
          <SidebarBlockTitle>
            Contributors
            <Badge variant="soft-border" color="dark" size="square-16">
              1,59
            </Badge>
          </SidebarBlockTitle>
        </SidebarBlockHead>
        <div className="flex flex-wrap gap-2">
          {contributors.map(([l, variant], i) => (
            <Avatar key={i} size="32" story={i === 0}>
              <AvatarFallback variant={variant}>{l}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </SidebarBlock>
      <Separator />
      <SidebarBlock pad="x">
        <SidebarBlockHead>
          <SidebarBlockTitle>
            Releases
            <Badge variant="soft-border" color="dark" size="square-16">
              1,59
            </Badge>
          </SidebarBlockTitle>
        </SidebarBlockHead>
        <div className="flex items-center gap-3">
          <SidebarIcon name="local-offer" className="text-base-500" />
          <span className="flex flex-col">
            <span className="flex items-center gap-2 text-12 leading-20 font-bold text-base-800">
              r145
              <Badge variant="soft-border" color="dark" size="square-16">
                1,59
              </Badge>
            </span>
            <span className="text-10 leading-16 font-semibold text-base-500">26 days ago</span>
          </span>
        </div>
      </SidebarBlock>
    </Sidebar>
  )
}

function Sidebar07() {
  const calls: (ChatUser & { sub: string; active?: boolean })[] = [
    { name: "Ronald Richards", text: "", sub: "Online", i: 0 },
    { name: "Group Chat", text: "", sub: "4 Users", letter: "GC", active: true },
    { name: "Albert Flores", text: "", sub: "Online", i: 1 },
    { name: "Liam Parker", text: "", sub: "Online", i: 2 },
    { name: "Ella Thompson", text: "", sub: "Online", letter: "ET", variant: "green-soft" },
    { name: "Noah Johnson", text: "", sub: "Online", i: 3 },
    { name: "Mia Davis", text: "", sub: "Online", i: 4 },
    { name: "Oliver Wilson", text: "", sub: "Online", i: 5 },
    { name: "Ava Martinez", text: "", sub: "Online", i: 0 },
    { name: "Lucas Anderson", text: "", sub: "Online", i: 1 },
    { name: "Sophia Taylor", text: "", sub: "Online", letter: "ST", variant: "pink-soft" },
    { name: "Ethan Moore", text: "", sub: "Online", letter: "M", variant: "amber-soft" },
    { name: "Isabella Jackson", text: "", sub: "Online", i: 2 },
    { name: "James White", text: "", sub: "Online", i: 3 },
    { name: "Charlotte Harris", text: "", sub: "Online", letter: "DS", variant: "purple-soft" },
  ]
  return (
    <Sidebar>
      <SearchInput />
      <Tabs defaultValue="All">
        <TabsList variant="switch" size="sm" className="w-full">
          {["All", "Groups", "Calls"].map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-1.5 px-0.5">
        {calls.map((u) => (
          <SidebarChat key={u.name} variant="pilled" active={u.active}>
            <SidebarChatMain>
              {u.letter ? (
                <Letter text={u.letter} size="32" variant={u.active ? "primary" : u.variant} />
              ) : (
                <Photo i={u.i ?? 0} size="32" />
              )}
              <SidebarChatBody>
                <SidebarChatName className={u.active ? "text-base-800" : undefined}>{u.name}</SidebarChatName>
                <SidebarChatText>{u.sub}</SidebarChatText>
              </SidebarChatBody>
            </SidebarChatMain>
            <SidebarChatTime className="pr-3">15:45</SidebarChatTime>
          </SidebarChat>
        ))}
      </div>
    </Sidebar>
  )
}

const chats = [
  "Tell me about yourself and how you wo...",
  "Write a text/poem/essay/post",
  "Explain a complex topic in simple words",
  "Create a plan/idea/concept for a project",
  "Help solve a problem or give",
  "Translate a text into another language",
  "Write code or help fix",
  "Create or improve a resume or cover le...",
  "Suggest a gift, event idea, or travel plan",
]

function Sidebar08({ menu = false }: { menu?: boolean }) {
  return (
    <Sidebar layout="wide" className={menu ? "h-215 shadow-lg" : "h-215"}>
      <Brand title="AI Interface" back />
      <SidebarContent className="gap-9 pt-5">
        <SidebarMenu>
          {[
            ["mode", "New Chat"],
            ["search", "Search in Chats"],
            ["photo-library", "Images"],
            ["folder", "Projects"],
          ].map(([icon, label], i) => (
            <SidebarItem key={label} active={i === 0}>
              <SidebarIcon name={icon} className={i === 0 ? "text-base-800" : "text-base-500"} />
              <SidebarItemLabel>{label}</SidebarItemLabel>
            </SidebarItem>
          ))}
        </SidebarMenu>
        <SidebarGroup>
          <GroupHead label="Chats" open />
          <SidebarMenu>
            {chats.map((c, i) => (
              <SidebarTextItem key={c} active={i === 0}>
                {c}
              </SidebarTextItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserFooter sub="Free Account" />
        <div className="flex items-center justify-between px-3 py-2 text-base-500">
          <SidebarIcon name="notifications" />
          <SidebarIcon name="tune" />
          <SidebarIcon name="help-outline" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function Sidebar09() {
  return (
    <Sidebar layout="icon" bordered className="h-170 justify-between">
      <div className="flex flex-col items-center gap-2">
        <SidebarLogo size="40" />
        <SidebarMenu className="items-center gap-1 pt-5">
          {["mode", "search", "photo-library", "folder"].map((icon, i) => (
            <SidebarItem key={icon} collapsed active={i === 0} aria-label={icon}>
              <SidebarIcon name={icon} className={i === 0 ? "text-base-800" : "text-base-500"} />
            </SidebarItem>
          ))}
        </SidebarMenu>
      </div>
      <div className="flex flex-col items-center gap-1">
        <SidebarUser className="size-10 justify-center p-1.5">
          <Photo i={0} size="24" />
        </SidebarUser>
        {["notifications", "page-info", "help-outline"].map((icon) => (
          <Button key={icon} variant="ghost" size="icon-40" aria-label={icon}>
            <ButtonIcon src={`/icons/material-${icon}.svg`} className="size-5" />
          </Button>
        ))}
      </div>
    </Sidebar>
  )
}

export default function SidebarPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Sidebar-01 (Type: Default, Icons)">
        <Sidebar01 />
        <Sidebar01Icons />
      </Section>
      <Section title="Sidebar-02">
        <Sidebar02 />
      </Section>
      <Section title="Sidebar-03">
        <Sidebar03 />
      </Section>
      <Section title="Sidebar-04">
        <Sidebar04 />
      </Section>
      <Section title="Sidebar-05">
        <Sidebar05 />
      </Section>
      <Section title="Sidebar-06">
        <Sidebar06 />
      </Section>
      <Section title="Sidebar-07">
        <Sidebar07 />
      </Section>
      <Section title="Sidebar-08 (Type: Default, Menu)">
        <Sidebar08 />
        <Sidebar08 menu />
      </Section>
      <Section title="Sidebar-09">
        <Sidebar09 />
      </Section>
    </main>
  )
}
