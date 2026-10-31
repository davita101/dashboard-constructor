import * as React from "react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarActions,
  SidebarBrand,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarIcon,
  SidebarIconBar,
  SidebarItem,
  SidebarItemEnd,
  SidebarItemIndent,
  SidebarItemLabel,
  SidebarLogo,
  SidebarMenu,
  SidebarMessage,
  SidebarMessageText,
  SidebarChat,
  SidebarChatBody,
  SidebarChatMain,
  SidebarChatName,
  SidebarChatText,
  SidebarChatTime,
  SidebarRailButton,
  SidebarRailDot,
  SidebarRailItem,
  SidebarRailLabel,
  SidebarStorage,
  SidebarStorageHead,
  SidebarStorageText,
  SidebarStorageTitle,
  SidebarTitle,
  SidebarUser,
  SidebarUserEmail,
  SidebarUserName,
  SidebarUserText,
} from "@/components/ui/sidebar"

// Mirrors the Figma "Parts of Sidebar" page (5081:15251): every slot set of the Sidebar.

const photo = "/images/avatars/avatar-1.png"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-8">{children}</div>
    </section>
  )
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-default text-10 leading-16 font-semibold text-base-500">{label}</span>
      {children}
    </div>
  )
}

function Photo({ size = "32" }: { size?: "40" | "32" | "28" | "20" }) {
  return (
    <Avatar size={size === "28" ? "32" : size} className={size === "28" ? "size-7" : undefined}>
      <AvatarImage src={photo} alt="" />
      <AvatarFallback>M</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}

function CountBadge() {
  return (
    <Badge color="red" size="square-12" className="absolute top-1.5 right-1.5">
      1
    </Badge>
  )
}

function RailButton({ icon = "default-icon" }: { icon?: string }) {
  return (
    <SidebarRailButton>
      <SidebarIcon name={icon} size="16" />
    </SidebarRailButton>
  )
}

function OutlineIcon({ icon = "default-icon" }: { icon?: string }) {
  return (
    <Button variant="outline" size="icon-32" aria-label={icon}>
      <ButtonIcon src={`/icons/material-${icon}.svg`} className="size-4" />
    </Button>
  )
}

const listStates = [
  { label: "Default" },
  { label: "Select 1 Rounded", tone: "outline", shape: "rounded" },
  { label: "Select 1 Pilled", tone: "outline", shape: "pilled" },
  { label: "Select 2 Primary Rounded", tone: "primary", shape: "rounded" },
  { label: "Select 2 Primary Pilled", tone: "primary", shape: "pilled" },
  { label: "Select 4 Dark Rounded", tone: "dark", shape: "rounded" },
  { label: "Select 4 Dark Pilled", tone: "dark", shape: "pilled" },
  { label: "Select 3 Rounded", tone: "soft", shape: "rounded" },
  { label: "Select 3 Pilled", tone: "soft", shape: "pilled" },
  { label: "Active", tone: "text" },
] as const

const ListItem = ({
  item,
  level,
}: {
  item: (typeof listStates)[number] | { label: string; tone?: "text"; shape?: undefined }
  level?: "2" | "3" | "4"
}) => (
  <SidebarItem tone={"tone" in item ? item.tone : undefined} shape={"shape" in item && item.shape ? item.shape : "square"} className="my-0 mr-0 h-10 w-68 pr-1">
    {level && <SidebarItemIndent level={level} />}
    <SidebarIcon name="default-icon" />
    <SidebarItemLabel>Item</SidebarItemLabel>
    <SidebarItemEnd className="text-inherit">
      <SidebarIcon name="default-icon" />
    </SidebarItemEnd>
  </SidebarItem>
)

const iconStates = [
  { label: "Default", shape: "square" },
  { label: "Active", shape: "square", tone: "text" },
  { label: "Select Pilled", shape: "pilled", tone: "outline" },
  { label: "Select Rounded", shape: "rounded", tone: "outline" },
  { label: "Select Primary Rounded", shape: "rounded", tone: "primary" },
  { label: "Select Primary Pilled", shape: "pilled", tone: "primary" },
] as const

const letters = [
  { text: "M", variant: "primary-soft", shape: "circle" },
  { text: "DS", variant: "green-soft", shape: "rounded" },
  { text: "VG", variant: "orange-soft", shape: "rounded" },
  { text: "YT", variant: "purple-soft", shape: "rounded" },
  { text: "JH", variant: "red-soft", shape: "rounded" },
  { text: "WE", variant: "yellow-soft", shape: "rounded" },
  { text: "M", variant: "teal-soft", shape: "rounded" },
  { text: "M", variant: "primary-soft", shape: "circle" },
] as const

function Letter({ i }: { i: number }) {
  const l = letters[i]
  return (
    <Avatar size="32" shape={l.shape}>
      <AvatarFallback variant={l.variant}>{l.text}</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}

function UserRow({ size, state }: { size: "48" | "compact"; state: "default" | "ghost" | "open" }) {
  return (
    <SidebarUser size={size} state={state} className={size === "48" ? "w-68" : undefined}>
      <Photo size={size === "48" ? "32" : "28"} />
      {size === "48" && (
        <>
          <SidebarUserText>
            <SidebarUserName>John Smith</SidebarUserName>
            <SidebarUserEmail>johnsmith@gmail.com</SidebarUserEmail>
          </SidebarUserText>
          <SidebarIcon name={state === "open" ? "keyboard-arrow-down" : "keyboard-arrow-up"} className="text-base-500" />
        </>
      )}
    </SidebarUser>
  )
}

function UserList({ card, active }: { card: boolean; active: boolean }) {
  return (
    <div className="w-39">
      <SidebarChat variant={card ? "pilled" : "list"} active={active}>
        <SidebarChatMain>
          <Photo size={card ? "32" : "40"} />
          <SidebarChatBody>
            <SidebarChatName>User Name</SidebarChatName>
            <SidebarChatText>Status Text</SidebarChatText>
          </SidebarChatBody>
        </SidebarChatMain>
        <SidebarChatTime>15:45</SidebarChatTime>
      </SidebarChat>
    </div>
  )
}

export default function SidebarComponentPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Icon-Button-Text-Component / Icon-Button-Component">
        <Cell label="Text: Default">
          <SidebarRailItem kind="labeled">
            <RailButton />
            <SidebarRailLabel>Name</SidebarRailLabel>
          </SidebarRailItem>
        </Cell>
        <Cell label="Text: Select">
          <SidebarRailItem kind="labeled" selected>
            <RailButton />
            <SidebarRailLabel>Name</SidebarRailLabel>
          </SidebarRailItem>
        </Cell>
        <Cell label="Default">
          <SidebarRailItem kind="button">
            <RailButton />
          </SidebarRailItem>
        </Cell>
        <Cell label="Select">
          <SidebarRailItem kind="button" selected>
            <RailButton />
          </SidebarRailItem>
        </Cell>
      </Section>

      <Section title="Avatar-Item-Text-Component / Avatar-Item-Component / Text-Avatar-Item-Component">
        <Cell label="Text: Default">
          <SidebarRailItem kind="labeled">
            <Photo />
            <SidebarRailLabel>Name</SidebarRailLabel>
          </SidebarRailItem>
        </Cell>
        <Cell label="Text: Select">
          <SidebarRailItem kind="labeled" selected>
            <Photo />
            <SidebarRailLabel>Name</SidebarRailLabel>
          </SidebarRailItem>
        </Cell>
        <Cell label="Default">
          <SidebarRailItem>
            <Photo />
            <CountBadge />
          </SidebarRailItem>
        </Cell>
        <Cell label="Select">
          <SidebarRailItem selected>
            <Photo />
            <CountBadge />
          </SidebarRailItem>
        </Cell>
        <Cell label="Text-Avatar: Default">
          <SidebarRailItem>
            <Letter i={0} />
          </SidebarRailItem>
        </Cell>
        <Cell label="Text-Avatar: Select">
          <SidebarRailItem selected>
            <Letter i={0} />
            <SidebarRailDot />
          </SidebarRailItem>
        </Cell>
      </Section>

      <Section title="User-Component (Type: Default / Compact; State: Default / Ghost / Open)">
        <div className="flex flex-col gap-4">
          {(["default", "ghost", "open"] as const).map((state) => (
            <Cell key={state} label={`Default, ${state}`}>
              <UserRow size="48" state={state} />
            </Cell>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {(["default", "ghost", "open"] as const).map((state) => (
            <Cell key={state} label={`Compact, ${state}`}>
              <UserRow size="compact" state={state} />
            </Cell>
          ))}
        </div>
      </Section>

      <Section title="Head-Item-Component (Style)">
        {(
          [
            ["Default", "36", "none"],
            ["Top Line", "36", "top"],
            ["Bottom Line", "36", "bottom"],
            ["Big", "44", "none"],
            ["Big Bottom Line", "44", "bottom"],
            ["Big Top Line", "44", "top"],
          ] as const
        ).map(([label, size, line]) => (
          <Cell key={label} label={label}>
            <div className="w-68">
              <SidebarGroupHead size={size} line={line}>
                <SidebarGroupLabel>Heading</SidebarGroupLabel>
                <SidebarItemEnd>
                  <Badge variant="white" size="square-20">
                    1
                  </Badge>
                  <SidebarIcon name="default-icon" />
                </SidebarItemEnd>
              </SidebarGroupHead>
            </div>
          </Cell>
        ))}
      </Section>

      <Section title="Message-Component">
        <div className="w-68">
          <SidebarMessage>
            <SidebarMessageText>Heading</SidebarMessageText>
            <SidebarMessageText tone="muted">Heading</SidebarMessageText>
          </SidebarMessage>
        </div>
      </Section>

      <Section title="Icon-Item-Component (Level 1)">
        {iconStates.map((s) => (
          <Cell key={s.label} label={s.label}>
            <SidebarItem collapsed shape={s.shape} tone={"tone" in s ? s.tone : undefined} aria-label={s.label}>
              <SidebarIcon name="default-icon" />
            </SidebarItem>
          </Cell>
        ))}
      </Section>

      <Section title="List-Item-Component (Level 1)">
        {listStates.map((s) => (
          <Cell key={s.label} label={s.label}>
            <ListItem item={s} />
          </Cell>
        ))}
      </Section>
      <Section title="List-Item-Component (Level 2-4)">
        {(["2", "3", "4"] as const).flatMap((level) => [
          <Cell key={`${level}d`} label={`Level ${level}, Default`}>
            <ListItem item={{ label: "Default" }} level={level} />
          </Cell>,
          <Cell key={`${level}s`} label={`Level ${level}, Select`}>
            <ListItem item={{ label: "Select", tone: "text" }} level={level} />
          </Cell>,
        ])}
      </Section>

      <Section title="User-List-Component (Type: Default / Card; State: Default / Active)">
        <Cell label="Default, Default">
          <UserList card={false} active={false} />
        </Cell>
        <Cell label="Default, Active">
          <UserList card={false} active />
        </Cell>
        <Cell label="Card, Default">
          <UserList card active={false} />
        </Cell>
        <Cell label="Card, Active">
          <UserList card active />
        </Cell>
      </Section>

      <Section title="Logo-Head-Sidebar-Component (Type: Default / Open / Left / Compact)">
        <Cell label="Default">
          <Sidebar layout="flush" className="w-42">
            <SidebarHeader className="px-0 pr-3">
              <SidebarBrand>
                <SidebarLogo />
                <SidebarTitle>New Project</SidebarTitle>
              </SidebarBrand>
              <SidebarActions>
                <SidebarIcon name="bolt" size="16" />
                <SidebarIcon name="sidebar" size="16" />
              </SidebarActions>
            </SidebarHeader>
          </Sidebar>
        </Cell>
        <Cell label="Open">
          <Sidebar layout="flush" className="w-42">
            <SidebarHeader className="px-0">
              <SidebarBrand>
                <SidebarLogo />
                <SidebarTitle>New Project</SidebarTitle>
              </SidebarBrand>
              <OutlineIcon icon="close" />
            </SidebarHeader>
          </Sidebar>
        </Cell>
        <Cell label="Left">
          <Sidebar layout="flush" className="w-42">
            <SidebarHeader className="px-0">
              <OutlineIcon icon="sidebar" />
              <SidebarBrand className="gap-3">
                <SidebarLogo />
                <SidebarTitle>New Project</SidebarTitle>
              </SidebarBrand>
              <OutlineIcon icon="bolt" />
            </SidebarHeader>
          </Sidebar>
        </Cell>
        <Cell label="Compact">
          <SidebarLogo size="40" />
        </Cell>
      </Section>

      <Section title="File-Storage-Component">
        <div className="w-42">
          <SidebarStorage>
            <SidebarStorageHead>
              <SidebarIcon name="cloud" size="24" />
              <SidebarStorageTitle>Data store</SidebarStorageTitle>
            </SidebarStorageHead>
            <div className="flex flex-col gap-4">
              <Progress value={82} color="primary-dark" />
              <SidebarStorageText>Used 81.7 gb of 100 gb</SidebarStorageText>
            </div>
          </SidebarStorage>
        </div>
      </Section>

      <Section title="Icons-Component">
        <SidebarIconBar>
          {(
            [
              ["local-phone", "text-purple-600"],
              ["mail-outline", "text-pink-600"],
              ["chrome-reader-mode", "text-blue-600"],
              ["account-box", "text-sky-600"],
              ["account-balance-wallet", "text-emerald-600"],
            ] as const
          ).map(([name, color]) => (
            <SidebarIcon key={name} name={name} size="24" className={color} />
          ))}
        </SidebarIconBar>
      </Section>

      <Section title="Navigate-List-Group / Navigate-Icon-Group">
        <SidebarMenu className="w-68">
          {["Item", "Item 2", "Item 3", "Item 4"].map((t) => (
            <SidebarItem key={t} shape="square" className="my-0 mr-0 h-10 w-68 pr-1">
              <SidebarIcon name="default-icon" />
              <SidebarItemLabel>{t}</SidebarItemLabel>
              <SidebarItemEnd>
                <SidebarIcon name="default-icon" />
              </SidebarItemEnd>
            </SidebarItem>
          ))}
        </SidebarMenu>
        <SidebarMenu gap="1" className="w-10">
          {Array.from({ length: 6 }, (_, i) => (
            <SidebarItem key={i} collapsed shape="square" aria-label={`Item ${i + 1}`}>
              <SidebarIcon name="default-icon" />
            </SidebarItem>
          ))}
        </SidebarMenu>
      </Section>

      <Section title="Navigate-Button-Group / Navigate-Button-Text-Group">
        <SidebarMenu className="w-11">
          {[0, 1, 2, 3].map((i) => (
            <SidebarRailItem key={i} kind="button" selected={i === 0}>
              <RailButton />
            </SidebarRailItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="w-18">
          {[0, 1, 2, 3].map((i) => (
            <SidebarRailItem key={i} kind="labeled" selected={i === 0}>
              <RailButton />
              <SidebarRailLabel>Name</SidebarRailLabel>
            </SidebarRailItem>
          ))}
        </SidebarMenu>
      </Section>

      <Section title="Navigate-Avatar-Text-Group / Navigate-Avatar-Group / Navigate-Text-Avatar-Group">
        <SidebarMenu className="w-18">
          {[0, 1, 2, 3].map((i) => (
            <SidebarRailItem key={i} kind="labeled" selected={i === 1}>
              <Photo />
              <SidebarRailLabel>Name</SidebarRailLabel>
            </SidebarRailItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="w-12">
          {[0, 1, 2, 3].map((i) => (
            <SidebarRailItem key={i} selected={i === 1}>
              <Photo />
              {i === 0 && <CountBadge />}
            </SidebarRailItem>
          ))}
        </SidebarMenu>
        <SidebarMenu className="w-12">
          {letters.map((_, i) => (
            <SidebarRailItem key={i} selected={false}>
              <Letter i={i} />
              {i === 0 && <SidebarRailDot />}
            </SidebarRailItem>
          ))}
        </SidebarMenu>
      </Section>
    </main>
  )
}
