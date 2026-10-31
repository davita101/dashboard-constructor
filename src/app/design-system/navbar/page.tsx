import { ModelMenu, ModelTrigger } from "@/components/navbar/ModelMenu"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  Navbar,
  NavbarActions,
  NavbarHeading,
  NavbarIconButton,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuLink,
  NavbarSearch,
  NavbarTitle,
} from "@/components/ui/navbar"

// Mirrors the Figma Navbar page (6860:42234): Navigate-01 (Desktop, Mobile), Navigate-02 (Desktop, Tablet, Mobile).

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-12 font-bold text-base-500">{children}</p>
}

function UserAvatar() {
  return (
    <Avatar size="32">
      <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
      <AvatarFallback>M</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}

function Upgrade() {
  return (
    <Button variant="dark" size="32" shape="pill">
      <ButtonIcon src="/icons/material-star.svg" className="size-4" />
      Upgrade
    </Button>
  )
}

function Heading() {
  return (
    <NavbarHeading>
      <NavbarIconButton icon="/icons/material-sidebar.svg" label="Sidebar" />
      <NavbarLogo />
      <NavbarTitle>New Project</NavbarTitle>
    </NavbarHeading>
  )
}

function Nav01Desktop() {
  return (
    <Navbar className="w-310">
      <Heading />
      <NavbarSearch />
      <NavbarMenu>
        <NavbarMenuLink href="#">Dashboard</NavbarMenuLink>
        <NavbarMenuLink href="#">News</NavbarMenuLink>
        <NavbarMenuLink href="#">Support</NavbarMenuLink>
        <NavbarMenuLink href="#">More</NavbarMenuLink>
      </NavbarMenu>
      <NavbarActions>
        <NavbarIconButton icon="/icons/material-notifications.svg" label="Notifications" variant="ghost" />
        <NavbarIconButton icon="/icons/material-help.svg" label="Help" variant="ghost" />
        <NavbarIconButton icon="/icons/material-settings.svg" label="Settings" variant="ghost" />
        <Upgrade />
        <UserAvatar />
        <NavbarIconButton icon="/icons/material-close.svg" label="Close" />
      </NavbarActions>
    </Navbar>
  )
}

function Nav01Mobile() {
  return (
    <Navbar className="w-90">
      <Heading />
      <NavbarActions>
        <Upgrade />
        <UserAvatar />
      </NavbarActions>
    </Navbar>
  )
}

function Nav02Left() {
  return (
    <NavbarHeading>
      <NavbarIconButton icon="/icons/material-sidebar.svg" label="Sidebar" />
      <ModelTrigger />
    </NavbarHeading>
  )
}

function Nav02Desktop() {
  return (
    <div className="flex w-285 flex-col gap-2">
      <Navbar variant="plain">
        <Nav02Left />
        <NavbarActions>
          <NavbarIconButton icon="/icons/material-notifications.svg" label="Notifications" />
          <Button variant="outline" size="32" shape="pill">
            <ButtonIcon src="/icons/material-stars.svg" className="size-4" />
            450
          </Button>
          <UserAvatar />
        </NavbarActions>
      </Navbar>
      <ModelMenu className="ml-10" />
    </div>
  )
}

function Nav02Compact({ width, withLogo }: { width: string; withLogo?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 ${width}`}>
      <Navbar>
        <NavbarHeading>
          {withLogo && <NavbarLogo />}
          <Nav02Left />
        </NavbarHeading>
        <NavbarActions>
          <NavbarIconButton icon="/icons/material-search.svg" label="Search" />
          <NavbarIconButton icon="/icons/material-notifications.svg" label="Notifications" />
          <UserAvatar />
        </NavbarActions>
      </Navbar>
      <ModelMenu className="ml-4" />
    </div>
  )
}

export default function NavbarPreviewPage() {
  return (
    <main className="flex flex-col gap-10 bg-background-10 p-10 font-default">
      <h1 className="text-24 font-bold text-base-900">Navbar</h1>
      <section className="flex flex-col gap-4">
        <h2 className="text-18 font-bold text-primary-600">Navigate-01</h2>
        <Caption>Type=Desktop</Caption>
        <Nav01Desktop />
        <Caption>Type=Mobile</Caption>
        <Nav01Mobile />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-18 font-bold text-primary-600">Navigate-02</h2>
        <Caption>Type=Desktop</Caption>
        <Nav02Desktop />
        <Caption>Type=Tablet</Caption>
        <Nav02Compact width="w-192" withLogo />
        <Caption>Type=Mobile</Caption>
        <Nav02Compact width="w-90" withLogo />
      </section>
    </main>
  )
}
