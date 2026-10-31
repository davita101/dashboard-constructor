import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandCategory,
  CommandContent,
  CommandFooter,
  CommandItem,
  CommandItemDescription,
  CommandItemKeys,
  CommandItemLeading,
  CommandItemMain,
  CommandItemName,
  CommandItemText,
  CommandList,
  CommandPreview,
  CommandSearch,
  CommandSearchAddon,
  CommandSearchInput,
  CommandSplit,
  CommandTabs,
  type CommandCorner,
} from "@/components/ui/command"
import { InputGroupIcon, InputGroupKbd } from "@/components/ui/input-group"
import { PaymentCardBrand } from "@/components/ui/payment-card-brand"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerifyIcon } from "@/components/ui/verify-icon"

// Mirrors the Figma Command Menu page (9402:27554): Command-Component (Type × State × Corner),
// then the 12 Command-Menu-* frames, each Rounded and Pilled.

const corners: CommandCorner[] = ["rounded", "pilled"]
const icon = "/icons/material-default-icon.svg"
const avatars = [
  "/images/avatars/avatar-1.png",
  "/images/avatars/avatar-2.png",
  "/images/avatars/avatar-3.png",
  "/images/avatars/avatar-4.png",
  "/images/avatars/avatar-5.png",
  "/images/avatars/avatar-6.png",
]

type Row = {
  name: string
  text?: string
  keys?: string[]
  selected?: boolean
  hover?: boolean
  lead: React.ReactNode
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Rows({ rows, lines = "1" }: { rows: Row[]; lines?: "1" | "2" }) {
  return rows.map((row, i) => (
    <CommandItem key={`${row.name}-${i}`} lines={lines} state={row.selected ? "active" : row.hover ? "hover" : "default"}>
      <CommandItemMain>
        <CommandItemLeading>{row.lead}</CommandItemLeading>
        <CommandItemText>
          <CommandItemName>
            {row.name}
            {lines === "1" && row.text && <CommandItemDescription>{row.text}</CommandItemDescription>}
          </CommandItemName>
          {lines === "2" && row.text && <CommandItemDescription>{row.text}</CommandItemDescription>}
        </CommandItemText>
      </CommandItemMain>
      {row.keys && <CommandItemKeys keys={row.keys} />}
    </CommandItem>
  ))
}

function Search() {
  return (
    <CommandSearch>
      <CommandSearchAddon>
        <InputGroupIcon src={icon} />
      </CommandSearchAddon>
      <CommandSearchInput placeholder="Search..." aria-label="Search" />
      <CommandSearchAddon align="inline-end">
        <InputGroupKbd size="20">⌘</InputGroupKbd>
        <InputGroupKbd size="20">K</InputGroupKbd>
      </CommandSearchAddon>
    </CommandSearch>
  )
}

function PillTabs({ active, tabs }: { active: string; tabs: string[] }) {
  return (
    <CommandTabs>
      <Tabs defaultValue={active}>
        <TabsList variant="pill" size="xs">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </CommandTabs>
  )
}

type Group = { title: string; count?: number; rows: Row[] }

function Menu({
  corner,
  tabs,
  groups,
  lines = "1",
}: {
  corner: CommandCorner
  tabs?: { active: string; items: string[] }
  groups: Group[]
  lines?: "1" | "2"
}) {
  return (
    <Command corner={corner}>
      <CommandContent>
        <Search />
        {tabs && <PillTabs active={tabs.active} tabs={tabs.items} />}
        <CommandList>
          {groups.map((group, i) => (
            <div key={`${group.title}-${i}`} className="flex flex-col gap-1">
              {group.title && <CommandCategory title={group.title} count={group.count} />}
              <Rows rows={group.rows} lines={lines} />
            </div>
          ))}
        </CommandList>
      </CommandContent>
      <CommandFooter />
    </Command>
  )
}

const cmd = (key: string) => ["⌘", key]
const iconLead = <InputGroupIcon src={icon} className="size-4" />
const initials = (t: string) => (
  <Avatar size="20" shape="rounded">
    <AvatarFallback>{t}</AvatarFallback>
  </Avatar>
)
const face = (i: number, story = false) => (
  <Avatar size="20" shape="rounded" story={story}>
    <AvatarImage src={avatars[i % avatars.length]} alt="" />
    <AvatarFallback>M</AvatarFallback>
  </Avatar>
)

const defaultGroups: Group[] = [
  {
    title: "Suggestions",
    rows: [
      { name: "Find and Replace...", keys: cmd("/"), lead: iconLead },
      { name: "Select All", keys: cmd("A"), lead: iconLead, hover: true },
      { name: "Undo", keys: cmd("Z"), lead: iconLead, selected: true },
    ],
  },
  {
    title: "Common Settings",
    rows: [
      { name: "Show Rules", keys: cmd("R"), lead: <Checkbox size="16" color="primary-dark" defaultChecked aria-label="Show Rules" />, selected: true },
      { name: "Snap to pixel grid", keys: cmd("P"), lead: <Checkbox size="16" color="primary-dark" aria-label="Snap" /> },
      { name: "Minimize UI", keys: ["⌘", "↵"], lead: <Checkbox size="16" color="primary-dark" aria-label="Minimize" /> },
      { name: "Show/Hide UI", keys: cmd("P"), lead: <Checkbox size="16" color="primary-dark" aria-label="Show/Hide" /> },
    ],
  },
]

const people = [
  ["Jack Williamson", "Product Marketing Administrator"],
  ["Heidi Sauer III", "Product Manager"],
  ["Marion Anderson", "District Manager"],
]
const users = [
  ["Wade Cummerata", "Sales Associate"],
  ["Doyle Treutel", "Project Manager"],
  ["Marion Anderson", "Data Analyst"],
  ["Ed Ernser", "Regional Director"],
]
const usersGroups: Group[] = [
  {
    title: "Recent",
    count: 8,
    rows: people.map(([name, text], i) => ({ name, text, keys: cmd(["/", "A", "Z"][i]), lead: face(i, i === 1), hover: i === 1, selected: i === 2 })),
  },
  {
    title: "All Users",
    count: 12,
    rows: users.map(([name, text], i) => ({ name, text, keys: cmd(["R", "P", "P", "P"][i]), lead: i === 0 ? initials("M") : face(i + 2) })),
  },
]

const companies = [
  ["InnovateUS", "Innovative Solutions"],
  ["TanzanTech", "Dynamic Ventures"],
  ["Spanova", "Creative Concepts"],
  ["US Ventures", "Tech Innovations"],
  ["Belgium Innovations", "Smart Products"],
  ["SwedeSolutions", "Future Designs"],
  ["French Flair Tech", "Next Gen"],
]
const brandRows: Row[] = companies.map(([name, text], i) => ({
  name,
  text,
  hover: i === 1,
  selected: i === 2,
  lead:
    i === 0 ? (
      <Avatar size="20" shape="rounded" frame="logo">
        <AvatarImage src="/images/avatars/logo-adobe.png" alt="" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    ) : (
      initials(name[0])
    ),
}))

const countries = [
  ["United States", "759 Product Sales"],
  ["Tanzania", "823 Product Sales"],
  ["Spain", "947 Product Sales"],
  ["United States", "583 Product Sales"],
  ["Belgium", "295 Product Sales"],
  ["Sweden", "159 Product Sales"],
  ["France", "374 Product Sales"],
]
const flag = (c: string) => initials(c.slice(0, 2).toUpperCase())
const countryGroups: Group[] = [
  {
    title: "Latest Countries",
    count: 9,
    rows: countries.slice(0, 3).map(([name, text], i) => ({ name, text, lead: flag(name), hover: i === 1, selected: i === 2 })),
  },
  {
    title: "All Users",
    count: 12,
    rows: countries.slice(3).map(([name, text], i) => ({ name, text, lead: flag(name), hover: i === 1 })),
  },
]

const iconRows: Row[] = [
  { name: "Text Files", text: "Select Text Layers", keys: cmd("/"), lead: iconLead },
  { name: "Video Files", text: "Select Text Layers", keys: cmd("/"), lead: iconLead, selected: true },
  { name: "Calendar", text: "Add Text", keys: cmd("/"), lead: iconLead },
  { name: "Tables", text: "Add Text", keys: cmd("/"), lead: iconLead },
  { name: "Code", text: "Add Text", keys: cmd("/"), lead: iconLead },
]

const controlGroups: Group[] = [
  {
    title: "",
    rows: countries.slice(0, 4).map(([name, text], i) => ({
      name,
      text,
      lead: <Switch size="sm" color="primary-dark" defaultChecked={i === 2} aria-label={name} />,
      selected: i === 2,
      hover: i === 1,
    })),
  },
  {
    title: "All Users",
    count: 12,
    rows: countries.slice(4).map(([name, text], i) => ({
      name,
      text,
      lead: (
        <RadioGroup defaultValue={i === 1 ? name.toLowerCase() : undefined} className="gap-0">
          <RadioGroupItem size="16" color="primary-dark" value={name.toLowerCase()} aria-label={name} />
        </RadioGroup>
      ),
      selected: i === 1,
    })),
  },
]

const payRows = (names: string[][], offset: number): Row[] =>
  names.map(([name, text], i) => ({
    name,
    text,
    lead: <PaymentCardBrand size="24" src={i % 2 ? "/icons/mastercard.svg" : "/icons/brands/visa.png"} brand={i % 2 ? "Mastercard" : "Visa"} />,
    selected: i + offset === 2,
    hover: i + offset === 1,
  }))
const paymentGroups: Group[] = [
  { title: "Last Payments", count: 8, rows: payRows([["Jack Williamson 4567", "$450"], ["Heidi Sauer III 9876", "$750"], ["Marion Anderson 2345", "$500"]], 0) },
  { title: "All Users", count: 12, rows: payRows([["Wade Cummerata 8765", "$850"], ["Doyle Treutel 3456", "$300"], ["Marion Anderson 7654", "$950"], ["Ed Ernser 6543", "$650"]], 3) },
]

function Split({ corner, rows, panel }: { corner: CommandCorner; rows: Row[]; panel: React.ReactNode }) {
  return (
    <Command corner={corner} layout="split">
      <CommandContent>
        <Search />
        <CommandSplit>
          <CommandList className="w-75 flex-none">
            <Rows rows={rows} />
          </CommandList>
          <CommandPreview>{panel}</CommandPreview>
        </CommandSplit>
      </CommandContent>
      <CommandFooter />
    </Command>
  )
}

function PreviewButtons({ primary, secondary, primaryIcon, secondaryIcon }: { primary: string; secondary: string; primaryIcon: string; secondaryIcon: string }) {
  return (
    <div className="flex gap-2">
      <Button variant="dark" size="32" shape="rounded">
        <ButtonIcon src={primaryIcon} />
        {primary}
      </Button>
      <Button variant="ghost" size="32" shape="rounded">
        <ButtonIcon src={secondaryIcon} />
        {secondary}
      </Button>
    </div>
  )
}

function SocialButtons({ icons }: { icons: { src: string; label: string }[] }) {
  return (
    <div className="flex gap-3">
      {icons.map((item) => (
        <Button key={item.label} variant="outline" size="icon-32" shape="pill" aria-label={item.label}>
          <ButtonIcon src={item.src} />
        </Button>
      ))}
    </div>
  )
}

function ProfilePanel({ detail }: { detail: "bio" | "list" }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center font-default">
      {detail === "bio" && <div className="h-18 w-full rounded-r8 bg-cover" style={{ backgroundImage: "url(/images/banners/banner-1.png)" }} />}
      <div className="relative size-15">
        <Avatar size="60" shape="rounded" frame="profile">
          <AvatarImage src="/images/avatars/profile.png" alt="" />
          <AvatarFallback>JT</AvatarFallback>
        </Avatar>
        <VerifyIcon color="blue" className="absolute right-0 bottom-0 size-5" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-14 leading-24 font-bold text-base-800">Jogn Trees</p>
        <p className="text-12 leading-20 font-bold text-base-500">@jogntrees</p>
      </div>
      <p className="text-10 leading-16 font-semibold text-base-500">
        {detail === "bio"
          ? "I am a Designer, Webflow fanatic, husband, father, and car guy with a passion for design and front-end development."
          : "Joined Apr 26, 2084 · Des Moines, US · 166 Followers"}
      </p>
      {detail === "bio" && (
        <SocialButtons
          icons={[
            { src: "/icons/brands/x-twitter.png", label: "X" },
            { src: "/icons/material-default-icon.svg", label: "Instagram" },
            { src: "/icons/brands/facebook.png", label: "Facebook" },
          ]}
        />
      )}
      <PreviewButtons primary="Follow" secondary="Profile" primaryIcon="/icons/material-add-circle.svg" secondaryIcon="/icons/material-account-circle.svg" />
    </div>
  )
}

function CompanyPanel({ detail }: { detail: "bio" | "list" }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center font-default">
      {detail === "bio" && <div className="h-18 w-full rounded-r8 bg-cover" style={{ backgroundImage: "url(/images/banners/banner-1.png)" }} />}
      <Avatar size="60" shape="rounded" frame="logo">
        <AvatarFallback>miro</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <p className="text-12 leading-20 font-bold text-base-500">Software as a service</p>
        <p className="text-14 leading-24 font-bold text-base-800">Miro Realtime Board</p>
      </div>
      <p className="text-10 leading-16 font-semibold text-base-500">
        {detail === "bio"
          ? "Miro, formerly known as RealtimeBoard, is a digital collaboration platform designed to facilitate remote."
          : "2011 Founded · Des Moines, US · Private Type"}
      </p>
      {detail === "bio" && (
        <SocialButtons
          icons={[
            { src: "/icons/material-language.svg", label: "Website" },
            { src: "/icons/material-mail-outline.svg", label: "Mail" },
            { src: "/icons/activity/comment-soft.svg", label: "Chat" },
          ]}
        />
      )}
      <PreviewButtons primary={detail === "bio" ? "Add Company" : "Add"} secondary="Profile" primaryIcon="/icons/material-add-circle.svg" secondaryIcon="/icons/material-account-circle.svg" />
    </div>
  )
}

const profileRows: Row[] = [
  ["Jack Williamson", "Product Marketing Administrator"],
  ["Marion Anderson", "Data Analyst"],
  ["Heidi Sauer III", "Product Manager"],
  ["Marion Anderson", "District Manager"],
  ["Doyle Treutel", "Project Manager"],
  ["Marion Anderson", "Data Analyst"],
  ["Ed Ernser", "Regional Director"],
  ["Wade Cummerata", "Sales Associate"],
  ["Marion Anderson", "Data Analyst"],
  ["Doyle Treutel", "Project Manager"],
].map(([name, text], i) => ({ name, text, lead: i === 7 ? initials("M") : face(i), hover: i === 2, selected: i === 3 }))

const companyRows: Row[] = [
  ...brandRows,
  ...["Spanova", "Spanova", "Spanova"].map((name) => ({ name, text: "Creative Concepts", lead: initials(name[0]) })),
]

function CommandComponentRow({ corner }: { corner: CommandCorner }) {
  return (
    <Command corner={corner} className="w-50 shadow-none">
      <CommandCategory title="Name Item" count={1} />
      {(["1", "2"] as const).flatMap((lines) =>
        (["default", "hover", "active"] as const).map((state) => (
          <CommandItem key={`${lines}-${state}`} lines={lines} state={state}>
            <CommandItemMain>
              <CommandItemText>
                <CommandItemName>Name Item</CommandItemName>
                {lines === "2" && <CommandItemDescription>Add Text</CommandItemDescription>}
              </CommandItemText>
            </CommandItemMain>
            <CommandItemKeys keys={["⌘", "/"]} />
          </CommandItem>
        ))
      )}
      <CommandFooter />
    </Command>
  )
}

export default function CommandMenuPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Command-Component: Category / Item Line / Item 2 Line (Default, Hover, Active) / Footer × Rounded, Pilled">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <CommandComponentRow key={corner} corner={corner} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Default (tabs, categories, icons and checkboxes)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} tabs={{ active: "All", items: ["All", "Assets", "Plugins & widgets"] }} groups={defaultGroups} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Users">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} groups={usersGroups} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Brand-Icons">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} tabs={{ active: "Plugins & widgets", items: ["All", "Assets", "Plugins & widgets"] }} groups={[{ title: "", rows: brandRows }]} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Country">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} groups={countryGroups} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Icons (Item 2 Line)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} lines="2" groups={[{ title: "", rows: iconRows }]} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Controls (switcher, radio)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} groups={controlGroups} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Payment">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Menu key={corner} corner={corner} groups={paymentGroups} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Profile-Type-1 (user + bio preview)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Split key={corner} corner={corner} rows={profileRows} panel={<ProfilePanel detail="bio" />} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Profile-Type-2 (user + details preview)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Split key={corner} corner={corner} rows={profileRows} panel={<ProfilePanel detail="list" />} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Profile-Company-Type-1 (company + bio preview)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Split key={corner} corner={corner} rows={companyRows} panel={<CompanyPanel detail="bio" />} />
          ))}
        </div>
      </Section>

      <Section title="Command-Menu-Profile-Company-Type-2 (company + details preview)">
        <div className="flex flex-wrap gap-8">
          {corners.map((corner) => (
            <Split key={corner} corner={corner} rows={companyRows} panel={<CompanyPanel detail="list" />} />
          ))}
        </div>
      </Section>
    </main>
  )
}
