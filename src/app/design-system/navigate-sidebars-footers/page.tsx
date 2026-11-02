import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbIcon,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button, ButtonIcon } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupIcon,
  InputGroupInput,
  InputGroupJoin,
  InputGroupKbd,
} from "@/components/ui/input-group"
import { KbdGroup } from "@/components/ui/kbd"
import {
  NavigateHead,
  NavigateHeadBody,
  NavigateHeadGroup,
  NavigateHeadTitle,
} from "@/components/ui/navigate-head"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Navbar,
  NavbarActions,
  NavbarCounter,
  NavbarHeading,
  NavbarIconButton,
  NavbarMenu,
  NavbarMenuLink,
  NavbarSearchLabel,
  NavbarTitle,
} from "@/components/ui/navbar"
import {
  NavigateFooter,
  NavigateFooterBrand,
  NavigateFooterGroup,
  NavigateFooterIcon,
  NavigateFooterIconButton,
  NavigateFooterLink,
  NavigateFooterMenu,
  NavigateFooterMeta,
  NavigateFooterSection,
  type NavigateFooterSize,
} from "@/components/ui/navigate-footer"
import { Newsletter, NewsletterField, NewsletterTitle, type NewsletterSize } from "@/components/ui/newsletter"
import {
  Sidebar,
  SidebarCard,
  SidebarGroup,
  SidebarGroupHead,
  SidebarGroupLabel,
  SidebarIcon,
  SidebarItem,
  SidebarItemEnd,
  SidebarItemLeading,
  SidebarItemRow,
  SidebarItemLabel,
  SidebarMessage,
  SidebarMessageText,
  SidebarTree,
  SidebarTreeItem,
} from "@/components/ui/sidebar"

// Mirrors the Figma page Navigate, Sidebars, Footers (10417:603619): Footer-Commerce, Newsletter Commerce,
// Sidebar-Commerce-01…04, Navigate-Commerce, Head-01…07.
// Missing icons (not in public/icons): favorite, local-shipping, shopping-cart, menu, near-me, arrow-forward,
// facebook, whatsapp, and the Sidebar-04 category icons; paths are referenced, see design/known-gaps.md.

function Caption({ children }: { children: React.ReactNode }) {
  return <h2 className="text-14 leading-24 font-bold text-base-800">{children}</h2>
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <Caption>{title}</Caption>
      {children}
    </section>
  )
}

// ---------- Footer-Commerce ----------

function FooterMenu1() {
  return (
    <NavigateFooterMenu>
      <NavigateFooterLink href="#">Gift Cards</NavigateFooterLink>
      <NavigateFooterLink href="#">Student Discount</NavigateFooterLink>
      <NavigateFooterLink href="#">Find A Store</NavigateFooterLink>
      <NavigateFooterLink href="#">Sign up for Email</NavigateFooterLink>
    </NavigateFooterMenu>
  )
}

function FooterMenu2() {
  return (
    <NavigateFooterMenu>
      <NavigateFooterLink href="#">Service</NavigateFooterLink>
      <NavigateFooterLink href="#">Contact Us</NavigateFooterLink>
      <NavigateFooterLink href="#">Booking</NavigateFooterLink>
      <NavigateFooterLink href="#">Returns &amp; Exchanges</NavigateFooterLink>
    </NavigateFooterMenu>
  )
}

function FooterSocial() {
  return (
    <NavigateFooterGroup>
      <NavigateFooterIconButton icon="/icons/material-facebook.svg" aria-label="Facebook" />
      <NavigateFooterIconButton icon="/icons/material-instagram.svg" aria-label="Instagram" />
      <NavigateFooterIconButton icon="/icons/brands/x-twitter.png" aria-label="X" />
      <NavigateFooterIconButton icon="/icons/material-whatsapp.svg" aria-label="WhatsApp" />
    </NavigateFooterGroup>
  )
}

function ToTop() {
  return <NavigateFooterIcon icon="/icons/material-arrow-upward.svg" className="size-6" />
}

function FooterLegal() {
  return (
    <>
      <NavigateFooterMeta>
        <NavigateFooterIcon icon="/icons/material-near-me.svg" />
        United States
      </NavigateFooterMeta>
      <NavigateFooterMeta className="gap-5 group-data-[size=mobile]/footer:flex-col group-data-[size=mobile]/footer:items-start group-data-[size=mobile]/footer:gap-3">
        <span>2078 Comapny. All Rights Reserved.</span>
        <NavigateFooterLink href="#">Terms &amp; Conditions</NavigateFooterLink>
        <NavigateFooterLink href="#">Privacy Policy</NavigateFooterLink>
      </NavigateFooterMeta>
      <NavigateFooterMeta className="gap-25">
        Email
        <NavigateFooterIcon icon="/icons/material-arrow-forward.svg" />
      </NavigateFooterMeta>
    </>
  )
}

function FooterCommerce({ size }: { size: NavigateFooterSize }) {
  if (size === "desktop") {
    return (
      <NavigateFooter variant="commerce" size="desktop" className="w-267">
        <NavigateFooterSection className="items-center">
          <NavigateFooterBrand>Constructor X</NavigateFooterBrand>
          <FooterMenu1 />
          <FooterMenu2 />
          <FooterSocial />
          <ToTop />
        </NavigateFooterSection>
        <NavigateFooterSection className="items-center pr-48.75">
          <FooterLegal />
        </NavigateFooterSection>
      </NavigateFooter>
    )
  }
  if (size === "tablet") {
    return (
      <NavigateFooter variant="commerce" size="tablet" className="w-192">
        <NavigateFooterSection className="items-center">
          <NavigateFooterBrand>Constructor X</NavigateFooterBrand>
          <ToTop />
        </NavigateFooterSection>
        <NavigateFooterSection className="items-center">
          <FooterMenu1 />
          <FooterMenu2 />
          <FooterSocial />
        </NavigateFooterSection>
        <NavigateFooterSection className="items-center">
          <FooterLegal />
        </NavigateFooterSection>
      </NavigateFooter>
    )
  }
  return (
    <NavigateFooter variant="commerce" size="mobile" className="w-80">
      <NavigateFooterSection className="items-center group-data-[size=mobile]/footer:flex-row group-data-[size=mobile]/footer:items-center justify-between">
        <NavigateFooterBrand>Constructor X</NavigateFooterBrand>
        <ToTop />
      </NavigateFooterSection>
      <NavigateFooterSection>
        <FooterMenu1 />
        <FooterMenu2 />
        <FooterSocial />
      </NavigateFooterSection>
      <NavigateFooterSection className="gap-3 [&>*:last-child]:w-full [&>*:last-child]:justify-between">
        <FooterLegal />
      </NavigateFooterSection>
    </NavigateFooter>
  )
}

// ---------- Newsletter ----------

function NewsletterCommerce({ size }: { size: NewsletterSize }) {
  return (
    <Newsletter size={size} className={size === "1600" ? "w-282" : "w-90"}>
      <NewsletterTitle className={size === "360" ? "w-45" : undefined}>
        Sign up for the Newsletter and get a 10% discount
      </NewsletterTitle>
      <NewsletterField />
    </Newsletter>
  )
}

// ---------- Navigate-Commerce ----------

function CountedButton({ icon, label, variant }: { icon: string; label: string; variant: "ghost" | "outline" }) {
  return (
    <Button variant={variant} size="32" shape="pill">
      <ButtonIcon src={icon} className="size-4" />
      {label}
      <NavbarCounter>1</NavbarCounter>
    </Button>
  )
}

function NavigateCommerce({ size }: { size: "1600" | "768" | "360" }) {
  const width = size === "1600" ? "w-277" : size === "768" ? "w-192" : "w-90"
  return (
    <Navbar variant="commerce" className={width}>
      <NavbarHeading className={size === "360" ? "gap-2" : "gap-4"}>
        <NavbarIconButton
          icon={size === "1600" ? "/icons/material-chevron-left.svg" : "/icons/material-menu.svg"}
          label="Menu"
        />
        <NavbarTitle>New Project</NavbarTitle>
      </NavbarHeading>
      {size !== "360" && (
        <NavbarMenu className={size === "1600" ? "gap-5" : "gap-3"}>
          <NavbarMenuLink href="#">Woman</NavbarMenuLink>
          <NavbarMenuLink href="#">Men</NavbarMenuLink>
          <NavbarMenuLink href="#">Kids</NavbarMenuLink>
          <NavbarMenuLink href="#">Home</NavbarMenuLink>
        </NavbarMenu>
      )}
      {size !== "360" && <NavbarSearchLabel>{size === "1600" ? "Search" : null}</NavbarSearchLabel>}
      {size === "1600" && (
        <NavbarActions className="gap-4">
          <CountedButton variant="ghost" icon="/icons/material-account-box.svg" label="Account" />
          <CountedButton variant="ghost" icon="/icons/material-favorite.svg" label="Favorite" />
          <CountedButton variant="ghost" icon="/icons/material-local-shipping.svg" label="Orders" />
          <CountedButton variant="outline" icon="/icons/material-shopping-cart.svg" label="Bag" />
        </NavbarActions>
      )}
      {size === "768" && (
        <NavbarActions>
          <NavbarIconButton variant="ghost" icon="/icons/material-account-box.svg" label="Account" />
          <NavbarIconButton variant="ghost" icon="/icons/material-favorite.svg" label="Favorite" />
          <NavbarIconButton variant="ghost" icon="/icons/material-local-shipping.svg" label="Orders" />
          <CountedButton variant="outline" icon="/icons/material-shopping-cart.svg" label="Bag" />
        </NavbarActions>
      )}
      {size === "360" && (
        <NavbarActions className="gap-1">
          <NavbarIconButton variant="ghost" icon="/icons/material-account-box.svg" label="Account" />
          <NavbarIconButton variant="ghost" icon="/icons/material-local-shipping.svg" label="Orders" />
          <NavbarIconButton icon="/icons/material-shopping-cart.svg" label="Bag" />
        </NavbarActions>
      )}
    </Navbar>
  )
}

// ---------- Sidebar-Commerce ----------

function NewsMarketplace() {
  return (
    <SidebarGroup className="gap-2">
      <SidebarGroupHead size="44" line="bottom" className="h-14 py-4.5">
        <SidebarGroupLabel>News Marketplace</SidebarGroupLabel>
        <SidebarIcon name="expand-less" />
      </SidebarGroupHead>
      <SidebarMessage>
        <SidebarMessageText>The Basics Of Buying A Telescope</SidebarMessageText>
        <SidebarMessageText tone="muted">09 Jul 2078</SidebarMessageText>
      </SidebarMessage>
      <SidebarMessage>
        <SidebarMessageText>
          Consumer Psychology In The Industrial And Manufacturing Equipment Marketplace
        </SidebarMessageText>
        <SidebarMessageText tone="muted">09 Jul 2078</SidebarMessageText>
      </SidebarMessage>
      <SidebarMessage>
        <SidebarMessageText>Enhance Your Brand Potential With Giant Advertising Blimps</SidebarMessageText>
        <SidebarMessageText tone="muted">09 Jul 2078</SidebarMessageText>
      </SidebarMessage>
      <SidebarMessage>
        <SidebarMessageText>View More</SidebarMessageText>
      </SidebarMessage>
    </SidebarGroup>
  )
}

function HeadOpen({ label, open = false }: { label: string; open?: boolean }) {
  return (
    <SidebarGroupHead size="44">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarIcon name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"} />
    </SidebarGroupHead>
  )
}

function HeadClosed({ label, line = true }: { label: string; line?: boolean }) {
  return (
    <SidebarGroupHead size="44" line={line ? "bottom" : "none"}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarIcon name="keyboard-arrow-down" />
    </SidebarGroupHead>
  )
}

function Chevron({ down = true }: { down?: boolean }) {
  return (
    <SidebarItemEnd>
      <SidebarIcon name={down ? "keyboard-arrow-down" : "keyboard-arrow-up"} />
    </SidebarItemEnd>
  )
}

function Leaf({ label, active = false, level = "2" }: { label: string; active?: boolean; level?: "1" | "2" | "3" }) {
  return (
    <SidebarTreeItem level={level} active={active}>
      {label}
    </SidebarTreeItem>
  )
}

function Branch({ label, active = false, open = false, level = "1" }: { label: string; active?: boolean; open?: boolean; level?: "1" | "2" | "3" }) {
  return (
    <SidebarTreeItem level={level} active={active}>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <Chevron down={!open} />
    </SidebarTreeItem>
  )
}

function Sidebar01() {
  return (
    <Sidebar layout="commerce">
      <SidebarGroup className="gap-1">
        <SidebarGroup>
          <HeadOpen label="Women" open />
          <SidebarItem active className="m-0 w-full">
            <SidebarItemLabel>Shoes</SidebarItemLabel>
            <Chevron down={false} />
          </SidebarItem>
          <SidebarTree guide>
            <Branch level="2" label="Blouses and shirts" />
            <Branch level="2" label="Outerwear" active open />
            <SidebarTree guide className="ml-6 w-[calc(100%-1.5rem)]">
              <Branch level="2" label="Coat" active />
              <Leaf label="Jackets" />
            </SidebarTree>
            <Branch level="2" label="Jumpers" />
            <Branch level="2" label="Jeans" />
            <Branch level="2" label="Overalls" />
            <Branch level="2" label="Costumes" />
            <Branch level="2" label="Longsleeves" />
            <Branch level="2" label="Dresses and sundress" />
            <Branch level="2" label="T-shirts and tops" />
          </SidebarTree>
          <SidebarTree>
            <Branch label="Clothing" />
            <Branch label="Accessories" />
            <Branch label="Sports" />
            <Branch label="Sale" />
          </SidebarTree>
        </SidebarGroup>
        <HeadClosed label="Men" />
        <HeadClosed label="Kids" />
        <HeadClosed label="Home" />
      </SidebarGroup>
      <NewsMarketplace />
    </Sidebar>
  )
}

function Sidebar02() {
  return (
    <Sidebar layout="commerce-card">
      <SidebarCard pad="wide">
        <HeadOpen label="Women" open />
        <SidebarItem active className="m-0 w-full">
          <SidebarIcon name="watch" size="20" />
          <SidebarItemLabel>Watches</SidebarItemLabel>
          <Chevron down={false} />
        </SidebarItem>
        <SidebarTree guide>
          {["Automatic", "Chronograph", "Digital", "Divers Watches", "Fashion Watches", "GMT Watches", "Leather Band", "Perpetual", "Quartz", "Sports Watches", "Electronic Watches"].map((l) => (
            <Leaf key={l} label={l} active={l === "Chronograph"} />
          ))}
        </SidebarTree>
        <SidebarTree>
          {[
            ["Sunglasses", "wb-sunny"],
            ["Bag & Accessories", "shopping-basket"],
            ["Jewelry", "diamond"],
            ["Apparel", "checkroom"],
          ].map(([l, i]) => (
            <SidebarTreeItem key={l}>
              <SidebarIcon name={i} />
              {l}
            </SidebarTreeItem>
          ))}
        </SidebarTree>
        <HeadClosed label="Men" line={false} />
        <HeadClosed label="Kids" line={false} />
      </SidebarCard>
      <SidebarCard pad="news">
        <NewsMarketplace />
      </SidebarCard>
    </Sidebar>
  )
}

function Sidebar03() {
  return (
    <Sidebar layout="commerce-card-sm">
      <SidebarCard pad="narrow">
        <HeadOpen label="Storage" open />
        <SidebarTree guide>
          {["Wardrobes", "Sofas", "Chest of drawers", "Bookcases", "Garden Furniture", "Tables & Desks", "Chairs", "Cabinets", "Dining Furniture", "Beds", "TV & Media Furniture", "Trolleys", "Living Room Chairs", "Gaming Furniture", "Nursery Furniture", "Sideboards"].map((l) => (
            <Leaf key={l} label={l} active={l === "Garden Furniture"} />
          ))}
        </SidebarTree>
        <HeadClosed label="Furniture" line={false} />
        <HeadClosed label="Beds & Mattresses" line={false} />
        <HeadClosed label="Home Textiles" line={false} />
      </SidebarCard>
      <SidebarCard pad="news">
        <NewsMarketplace />
      </SidebarCard>
    </Sidebar>
  )
}

function Sidebar04() {
  const items: [string, string][] = [
    ["Audio Equipment", "speaker"],
    ["Network Devices", "router"],
    ["Input systems", "mouse"],
    ["Processors", "memory"],
    ["Musical Instruments", "music-note"],
    ["Household Appliances", "kitchen"],
    ["TV Equipment", "tv"],
    ["Smart Accessories", "watch"],
    ["Video Games", "videogame-asset"],
    ["Tablets and accessories", "tablet-mac"],
    ["Professional equipment", "keyboard"],
    ["Monitors", "desktop-windows"],
    ["Laptops", "laptop"],
    ["Smartphones", "smartphone"],
    ["Server equipment", "dns"],
    ["Climatic equipment", "thermostat"],
  ]
  return (
    <Sidebar layout="commerce-card">
      <SidebarCard pad="list">
        <SidebarTree>
          {items.map(([l, i]) => (
            <SidebarItem key={l} active={l === "Processors"} className="m-0 h-10 w-full">
              <SidebarIcon name={i} />
              <SidebarItemLabel>{l}</SidebarItemLabel>
            </SidebarItem>
          ))}
        </SidebarTree>
      </SidebarCard>
      <SidebarCard pad="news">
        <NewsMarketplace />
      </SidebarCard>
    </Sidebar>
  )
}

// ---------- Head-01…07 ----------

type HeadType = "desktop" | "tablet" | "mobile"
const headWidth: Record<HeadType, string> = { desktop: "w-282", tablet: "w-174", mobile: "w-80" }
const ICON = "/icons/material-default-icon.svg"
const headSize = (t: HeadType) => (t === "mobile" ? "mobile" : "desktop")
const photo = "/images/avatars/avatar-1.png"

function HeadFrame({
  title,
  types = ["desktop", "tablet", "mobile"],
  children,
}: {
  title: string
  types?: HeadType[]
  children: (t: HeadType) => React.ReactNode
}) {
  return (
    <Frame title={title}>
      <div className="flex flex-col gap-10 overflow-x-auto">
        {types.map((t) => (
          <div key={t} className={`${headWidth[t]} shrink-0`}>
            {children(t)}
          </div>
        ))}
      </div>
    </Frame>
  )
}

function HeadHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <NavigateHeadGroup gap={3}>
      <ButtonIcon src={icon} className="size-6 text-base-500" />
      <NavigateHeadTitle size="14-bold" tone="soft">
        {children}
      </NavigateHeadTitle>
    </NavigateHeadGroup>
  )
}

function HeadSearch() {
  return (
    <InputGroupJoin size="32" shape="pill" className="w-49">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupIcon src="/icons/material-search.svg" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search" aria-label="Search" />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <InputGroupKbd size="16">⌘K</InputGroupKbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </InputGroupJoin>
  )
}

function SubscribeButton() {
  return (
    <Button variant="outline" shape="pill" size="32">
      <ButtonIcon src="/icons/material-mail-outline.svg" />
      Subscribe
    </Button>
  )
}

function SearchSubscribe() {
  return (
    <NavigateHeadGroup gap={4}>
      <HeadSearch />
      <SubscribeButton />
    </NavigateHeadGroup>
  )
}

function SwitcherGroup({ labels, className }: { labels: string[]; className?: string }) {
  return (
    <Tabs defaultValue={labels[0]} className={className}>
      <TabsList variant="pill" size="sm" className="w-full">
        {labels.map((l) => (
          <TabsTrigger key={l} value={l}>
            {l}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

function ViewGroup({ className }: { className?: string }) {
  return (
    <ButtonGroup shape="pill" size="32" resizing="fill" aria-label="View" className={className}>
      <Button variant="outline" shape="pill" size="32" aria-label="Grid">
        <ButtonIcon src="/icons/material-apps.svg" />
      </Button>
      <Button variant="outline" shape="pill" size="32" aria-label="List">
        <ButtonIcon src="/icons/material-list.svg" />
      </Button>
    </ButtonGroup>
  )
}

function SearchIconButton() {
  return (
    <Button variant="outline" shape="pill" size="icon-32" aria-label="Search">
      <ButtonIcon src="/icons/material-search.svg" />
    </Button>
  )
}

function FiltersButton() {
  return (
    <Button variant="dark" shape="pill" size="32">
      <ButtonIcon src="/icons/material-tune.svg" />
      Filters
    </Button>
  )
}

function FilterTools({ className }: { className?: string }) {
  return (
    <NavigateHeadGroup gap={3} className={className}>
      <ViewGroup className="flex-1" />
      <SearchIconButton />
      <FiltersButton />
    </NavigateHeadGroup>
  )
}

function Head01({ t }: { t: HeadType }) {
  return (
    <NavigateHead size={headSize(t)}>
      <NavigateHeadBody className={t === "mobile" ? "gap-3" : undefined}>
        <Breadcrumb>
          <BreadcrumbList size="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <BreadcrumbIcon size="sm" icon="/icons/material-home.svg" />
                Main
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <BreadcrumbIcon size="sm" icon="/icons/material-list.svg" />
                Catalog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <BreadcrumbIcon size="sm" icon={ICON} />
                Sun Glasses
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <NavigateHeadGroup gap={2}>
          {[
            ["Favorite", "/icons/material-favorite.svg"],
            ["Share", "/icons/material-share.svg"],
            ["Complain", "/icons/material-info2.svg"],
          ].map(([l, i]) => (
            <Button key={l} variant="ghost" shape="rounded" size="32">
              <ButtonIcon src={i} />
              {l}
            </Button>
          ))}
        </NavigateHeadGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head02({ t }: { t: HeadType }) {
  return (
    <NavigateHead size={headSize(t)} divider>
      <NavigateHeadBody>
        <HeadHeading icon="/icons/material-home.svg">Premium &amp; Style Sunglases</HeadHeading>
        <SearchSubscribe />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head03() {
  return (
    <NavigateHead>
      <NavigateHeadBody>
        <NavigateHeadGroup gap={5}>
          <ButtonIcon src="/icons/material-new-releases.svg" className="size-6 text-base-500" />
          <NavigateHeadTitle size="12" tone="soft">
            Explore What&apos;s New
          </NavigateHeadTitle>
        </NavigateHeadGroup>
        <ButtonGroup shape="pill" size="32" aria-label="Navigate">
          <Button variant="outline" shape="pill" size="icon-32" aria-label="Previous">
            <ButtonIcon src="/icons/material-arrow-back.svg" />
          </Button>
          <Button variant="outline" shape="pill" size="icon-32" aria-label="Next">
            <ButtonIcon src="/icons/material-arrow-forward.svg" />
          </Button>
        </ButtonGroup>
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head04({ t }: { t: HeadType }) {
  const labels = ["Popular", "New", "Price", "Rating"]
  const heading = <HeadHeading icon="/icons/material-playlist-add-check.svg">Electronic</HeadHeading>
  if (t === "desktop") {
    return (
      <NavigateHead divider>
        <NavigateHeadBody className="gap-10">
          {heading}
          <SwitcherGroup labels={labels} className="w-87" />
          <FilterTools className="w-87" />
        </NavigateHeadBody>
      </NavigateHead>
    )
  }
  if (t === "tablet") {
    return (
      <NavigateHead divider>
        <NavigateHeadBody className="flex-col items-stretch gap-6">
          <NavigateHeadGroup gap={3} className="justify-between">
            {heading}
            <ViewGroup className="w-81" />
          </NavigateHeadGroup>
          <NavigateHeadGroup gap={3}>
            <SwitcherGroup labels={labels} className="flex-1" />
            <SearchIconButton />
            <FiltersButton />
          </NavigateHeadGroup>
        </NavigateHeadBody>
      </NavigateHead>
    )
  }
  return (
    <NavigateHead size="mobile" divider>
      <NavigateHeadBody className="gap-6">
        {heading}
        <SwitcherGroup labels={labels} />
        <FilterTools />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head05({ t }: { t: HeadType }) {
  const labels = ["Popular", "New", "High Price", "Low Price"]
  return (
    <NavigateHead size={headSize(t)} divider>
      <NavigateHeadBody className={t === "mobile" ? "gap-6" : "gap-10"}>
        <SwitcherGroup labels={labels} className={t === "desktop" ? "w-136" : t === "tablet" ? "w-82" : undefined} />
        <FilterTools className={t === "desktop" ? "w-136" : t === "tablet" ? "w-82" : undefined} />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

const tabItems = [
  ["Main", "/icons/material-home.svg"],
  ["Order", "/icons/material-list.svg"],
  ["Favorite", "/icons/material-favorite.svg"],
  ["Bag", "/icons/material-shopping-cart.svg"],
  ["Settnings", "/icons/material-settings.svg"],
]

/** Figma Tab-Group-Pilled: 32px pill items with a 20px left icon. */
function TabGroupPilled({ activeFirst = false, favorites = "Favorite" }: { activeFirst?: boolean; favorites?: string }) {
  return (
    <NavigateHeadGroup gap={2} wrap>
      {tabItems.map(([l, i], n) => (
        <Button key={l} variant={activeFirst && n === 0 ? "outline" : "ghost"} shape="pill" size="32">
          <ButtonIcon src={i} className="size-5" />
          {l === "Favorite" ? favorites : l}
        </Button>
      ))}
    </NavigateHeadGroup>
  )
}

function Head06({ t }: { t: HeadType }) {
  return (
    <NavigateHead size={headSize(t)} divider>
      <NavigateHeadBody className={t === "mobile" ? "items-start gap-6" : "gap-10"}>
        <HeadHeading icon="/icons/material-home.svg">Electronic</HeadHeading>
        <TabGroupPilled />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

function Head07({ t }: { t: HeadType }) {
  return (
    <NavigateHead size={headSize(t)} divider>
      <NavigateHeadBody className={t === "desktop" ? "gap-10" : "flex-col items-stretch gap-6"}>
        <TabGroupPilled activeFirst favorites="Favorites" />
        <SearchSubscribe />
      </NavigateHeadBody>
    </NavigateHead>
  )
}

// ---------- List-Item left-slot swaps ----------

function LeftSlotSwaps() {
  return (
    <Sidebar layout="commerce-card-sm">
      <SidebarCard pad="narrow">
        <SidebarItemRow>
          <SidebarItemLeading>
            <Checkbox defaultChecked aria-label="Checkbox" />
          </SidebarItemLeading>
          <SidebarItemLabel>Checkbox</SidebarItemLabel>
          <SidebarItemEnd>
            <Badge variant="base" size="square-20" shape="pill">
              1
            </Badge>
          </SidebarItemEnd>
        </SidebarItemRow>
        <RadioGroup defaultValue="radio" className="gap-0">
          <SidebarItemRow>
            <SidebarItemLeading>
              <RadioGroupItem value="radio" aria-label="Radio" />
            </SidebarItemLeading>
            <SidebarItemLabel>Radio</SidebarItemLabel>
          </SidebarItemRow>
        </RadioGroup>
        <SidebarItemRow>
          <SidebarItemLeading>
            <Switch defaultChecked aria-label="Switcher" />
          </SidebarItemLeading>
          <SidebarItemLabel>Switcher</SidebarItemLabel>
        </SidebarItemRow>
        <SidebarItemRow>
          <SidebarItemLeading>
            <Avatar size="20">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </SidebarItemLeading>
          <SidebarItemLabel>Avatar text</SidebarItemLabel>
        </SidebarItemRow>
        <SidebarItemRow>
          <SidebarItemLeading>
            <Avatar size="20">
              <AvatarImage src={photo} alt="" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </SidebarItemLeading>
          <SidebarItemLabel>Avatar image</SidebarItemLabel>
        </SidebarItemRow>
      </SidebarCard>
    </Sidebar>
  )
}

export default function Page() {
  return (
    <main className="flex flex-col gap-10 p-10">
      {(["desktop", "tablet", "mobile"] as const).map((s) => (
        <Frame key={s} title={`Footer-Commerce Type=${s[0].toUpperCase()}${s.slice(1)}`}>
          <FooterCommerce size={s} />
        </Frame>
      ))}
      {(["1600", "360"] as const).map((s) => (
        <Frame key={s} title={`Newsletter Commerce Type=${s}`}>
          <NewsletterCommerce size={s} />
        </Frame>
      ))}
      {(["1600", "768", "360"] as const).map((s) => (
        <Frame key={s} title={`Navigate-Commerce Type=${s}`}>
          <NavigateCommerce size={s} />
        </Frame>
      ))}
      <HeadFrame title="Head-01 Type=Desktop, Tablet, Mobile">{(t) => <Head01 t={t} />}</HeadFrame>
      <HeadFrame title="Head-02 Type=Desktop, Tablet, Mobile">{(t) => <Head02 t={t} />}</HeadFrame>
      <HeadFrame title="Head-03 Type=Default" types={["desktop"]}>
        {() => <Head03 />}
      </HeadFrame>
      <HeadFrame title="Head-04 Type=Desktop, Tablet, Mobile">{(t) => <Head04 t={t} />}</HeadFrame>
      <HeadFrame title="Head-05 Type=Desktop, Tablet, Mobile">{(t) => <Head05 t={t} />}</HeadFrame>
      <HeadFrame title="Head-06 Type=Desktop, Tablet, Mobile">{(t) => <Head06 t={t} />}</HeadFrame>
      <HeadFrame title="Head-07 Type=Desktop, Tablet, Mobile">{(t) => <Head07 t={t} />}</HeadFrame>
      <div className="flex flex-wrap items-start gap-10">
        <Frame title="List-Item left-slot swaps (Checkbox, Radio, Switcher, Avatar-Text, Avatar-Image)">
          <LeftSlotSwaps />
        </Frame>
        <Frame title="Sidebar-Commerce-01">
          <Sidebar01 />
        </Frame>
        <Frame title="Sidebar-Commerce-02">
          <Sidebar02 />
        </Frame>
        <Frame title="Sidebar-Commerce-03">
          <Sidebar03 />
        </Frame>
        <Frame title="Sidebar-Commerce-04">
          <Sidebar04 />
        </Frame>
      </div>
    </main>
  )
}
