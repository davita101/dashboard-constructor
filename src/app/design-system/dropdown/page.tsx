"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHead,
  DropdownMenuHeadTitle,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemAddon,
  DropdownMenuItemDescription,
  DropdownMenuItemLeft,
  DropdownMenuItemRight,
  DropdownMenuItemText,
  DropdownMenuItemTitle,
  DropdownMenuPanel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuUser,
  DropdownMenuUserEmail,
  DropdownMenuUserName,
  DropdownMenuValue,
  useDropdownMenuLayout,
  useDropdownMenuShape,
  type DropdownMenuItemState,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PaymentCardBrand } from "@/components/ui/payment-card-brand"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

// Mirrors Figma Dropdown (4290:12174): Item, Item-2, Menu, Menu-2, Head-Footer, Divider x Rounded | Pilled.
const shapes = [
  { name: "Rounded", shape: "rounded" },
  { name: "Pilled", shape: "pilled" },
] as const
const states: { name: string; state: DropdownMenuItemState }[] = [
  { name: "Default", state: "default" },
  { name: "Hover", state: "hover" },
  { name: "Active", state: "active" },
  { name: "Disabled", state: "disabled" },
]

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-14 font-bold text-base-900">{title}</h3>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="px-4 text-10 leading-16 font-semibold text-base-500">{children}</p>
}

// Slot contents: existing primitives, sized like the Figma instances.
function SlotAvatar({ src = "/images/avatars/avatar-1.png", parts = true }: { src?: string; parts?: boolean }) {
  const layout = useDropdownMenuLayout()
  return (
    <Avatar size="24" shape={layout === "double" ? "circle" : "rounded"} story={parts}>
      <AvatarImage src={src} alt="" />
      <AvatarFallback>JS</AvatarFallback>
      {parts && <AvatarBadge />}
      {parts && (
        <Badge variant="solid" color="red" size="square-12" className="absolute -top-1 -right-1 z-10">
          1
        </Badge>
      )}
    </Avatar>
  )
}

function SlotFlag({ code = "US" }: { code?: string }) {
  return (
    <Avatar size="24">
      <AvatarFallback variant="placeholder">{code}</AvatarFallback>
    </Avatar>
  )
}

function SlotRadio() {
  return (
    <RadioGroup defaultValue="on" aria-label="Option">
      <RadioGroupItem value="on" />
    </RadioGroup>
  )
}

function SlotButton() {
  const shape = useDropdownMenuShape()
  const layout = useDropdownMenuLayout()
  if (layout === "double") {
    return (
      <Button variant="outline" size="24" shape="pill">
        Button
      </Button>
    )
  }
  return (
    <Button variant="outline" size="20" shape={shape === "pilled" ? "pill" : "rounded"}>
      Button
    </Button>
  )
}

function HeadButton({ size = "24", full }: { size?: "24" | "28"; full?: boolean }) {
  const shape = useDropdownMenuShape()
  return (
    <Button
      variant="outline"
      size={size}
      shape={shape === "pilled" ? "pill" : "rounded"}
      className={full ? "w-full" : undefined}
    >
      Button
    </Button>
  )
}

function HeadInput() {
  const shape = useDropdownMenuShape()
  return <Input size="32" shape={shape === "pilled" ? "pill" : "rounded"} placeholder="Text" aria-label="Text" />
}

const leadSlots: { name: string; node: React.ReactNode }[] = [
  { name: "Icon", node: <DropdownMenuIcon name="material-default-icon" /> },
  { name: "Payment", node: <PaymentCardBrand size="40" /> },
  { name: "Avatar", node: <SlotAvatar /> },
  { name: "Flag", node: <SlotFlag /> },
  { name: "Checkbox", node: <Checkbox defaultChecked aria-label="Checkbox" /> },
  { name: "Radio", node: <SlotRadio /> },
  { name: "Switcher", node: <Switch defaultChecked aria-label="Switcher" /> },
]

const trailSlots: { name: string; node: React.ReactNode }[] = [
  { name: "Text", node: <DropdownMenuValue>140</DropdownMenuValue> },
  { name: "Right Button", node: <SlotButton /> },
  { name: "Icon", node: <DropdownMenuIcon name="material-chevron-right" /> },
  { name: "Right Payment", node: <PaymentCardBrand size="40" /> },
  { name: "Right Avatar", node: <SlotAvatar /> },
  { name: "Right Flag", node: <SlotFlag /> },
  { name: "Right Checkbox", node: <Checkbox defaultChecked aria-label="Checkbox" /> },
  { name: "Right Radio", node: <SlotRadio /> },
  { name: "Right Switcher", node: <Switch defaultChecked aria-label="Switcher" /> },
]

function DefaultItem({ state, value }: { state?: DropdownMenuItemState; value?: boolean }) {
  return (
    <DropdownMenuItem state={state}>
      <DropdownMenuItemLeft>
        <DropdownMenuItemAddon>
          <DropdownMenuIcon name="material-default-icon" />
        </DropdownMenuItemAddon>
        <DropdownMenuItemTitle>Text Dropdown</DropdownMenuItemTitle>
      </DropdownMenuItemLeft>
      <DropdownMenuItemRight>
        {value && <DropdownMenuValue>140</DropdownMenuValue>}
        <DropdownMenuIcon name="material-chevron-right" />
      </DropdownMenuItemRight>
    </DropdownMenuItem>
  )
}

function DoubleItem({ state, lead, right }: { state?: DropdownMenuItemState; lead?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <DropdownMenuItem layout="double" state={state}>
      <DropdownMenuItemLeft>
        {lead && <DropdownMenuItemAddon>{lead}</DropdownMenuItemAddon>}
        <DropdownMenuItemText>
          <DropdownMenuItemTitle>Text Dropdown</DropdownMenuItemTitle>
          <DropdownMenuItemDescription>Upgrade your plan for more credits</DropdownMenuItemDescription>
        </DropdownMenuItemText>
      </DropdownMenuItemLeft>
      {right && <DropdownMenuItemRight>{right}</DropdownMenuItemRight>}
    </DropdownMenuItem>
  )
}

function HeadDefault({ title }: { title: string }) {
  return (
    <DropdownMenuHead>
      <DropdownMenuHeadTitle>{title}</DropdownMenuHeadTitle>
    </DropdownMenuHead>
  )
}

export default function DropdownPage() {
  return (
    <main className="flex flex-col gap-10 bg-background-10 p-10 font-default">
      <h1 className="text-24 font-bold text-base-900">Dropdown</h1>
      {shapes.map(({ name, shape }) => (
        <div key={shape} className="flex flex-col gap-8">
          <h2 className="text-18 font-bold text-primary-600">{name}</h2>

          <Row title={`Item-Dropdown-${name} (State)`}>
            <DropdownMenuPanel shape={shape} surface="none" className="gap-2">
              {states.map((s) => (
                <React.Fragment key={s.name}>
                  <Caption>{s.name}</Caption>
                  <DefaultItem state={s.state} />
                </React.Fragment>
              ))}
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape} surface="none" className="gap-2">
              {states.map((s) => (
                <React.Fragment key={s.name}>
                  <Caption>{s.name} + Text</Caption>
                  <DefaultItem state={s.state} value />
                </React.Fragment>
              ))}
            </DropdownMenuPanel>
          </Row>

          <Row title={`Item-Dropdown-${name} (Left slots / Right slots)`}>
            <DropdownMenuPanel shape={shape}>
              {leadSlots.map((slot) => (
                <DropdownMenuItem key={slot.name}>
                  <DropdownMenuItemLeft>
                    <DropdownMenuItemAddon>{slot.node}</DropdownMenuItemAddon>
                    <DropdownMenuItemTitle>{slot.name}</DropdownMenuItemTitle>
                  </DropdownMenuItemLeft>
                </DropdownMenuItem>
              ))}
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape}>
              {trailSlots.map((slot) => (
                <DropdownMenuItem key={slot.name}>
                  <DropdownMenuItemLeft>
                    <DropdownMenuItemAddon>
                      <DropdownMenuIcon name="material-default-icon" />
                    </DropdownMenuItemAddon>
                    <DropdownMenuItemTitle>{slot.name}</DropdownMenuItemTitle>
                  </DropdownMenuItemLeft>
                  <DropdownMenuItemRight>
                    <DropdownMenuItemAddon side="end">{slot.node}</DropdownMenuItemAddon>
                  </DropdownMenuItemRight>
                </DropdownMenuItem>
              ))}
            </DropdownMenuPanel>
          </Row>

          <Row title={`Item-2-Dropdown-${name} (State)`}>
            <DropdownMenuPanel shape={shape} surface="none" className="gap-2">
              {states.map((s) => (
                <React.Fragment key={s.name}>
                  <Caption>{s.name}</Caption>
                  <DoubleItem state={s.state} />
                </React.Fragment>
              ))}
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape} surface="none" className="gap-2">
              {states.map((s) => (
                <React.Fragment key={s.name}>
                  <Caption>{s.name} + Icon + Text</Caption>
                  <DoubleItem
                    state={s.state}
                    lead={<DropdownMenuIcon name="material-default-icon" size="28" />}
                    right={<DropdownMenuValue>140</DropdownMenuValue>}
                  />
                </React.Fragment>
              ))}
            </DropdownMenuPanel>
          </Row>

          <Row title={`Item-2-Dropdown-${name} (Left slots / Right slots)`}>
            <DropdownMenuPanel shape={shape} size="wide">
              {leadSlots.map((slot) => (
                <DoubleItem
                  key={slot.name}
                  lead={slot.name === "Icon" ? <DropdownMenuIcon name="material-default-icon" size="28" /> : slot.node}
                />
              ))}
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape} size="wide">
              <DoubleItem right={<DropdownMenuValue>140</DropdownMenuValue>} />
              <DoubleItem right={<SlotButton />} />
              <DoubleItem right={<DropdownMenuIcon name="material-chevron-right" />} />
            </DropdownMenuPanel>
          </Row>

          <Row title={`Menu-Dropdown-${name} / Menu-2-Dropdown-${name}`}>
            <DropdownMenuPanel shape={shape}>
              <HeadDefault title="Text Heading" />
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DefaultItem />
                <DropdownMenuSeparator />
                <DefaultItem />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <HeadDefault title="Text Footer" />
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape} size="wide">
              <DropdownMenuGroup>
                <DoubleItem />
                <DropdownMenuSeparator />
                <DoubleItem />
                <DropdownMenuSeparator />
                <DoubleItem />
              </DropdownMenuGroup>
            </DropdownMenuPanel>
          </Row>

          <Row title={`Head-Footer-Dropdown-${name} (Type) / Divider-Dropdown-${name}`}>
            <DropdownMenuPanel shape={shape} surface="none" className="gap-2">
              <Caption>Default</Caption>
              <DropdownMenuHead>
                <DropdownMenuHeadTitle>Text Heading</DropdownMenuHeadTitle>
                <DropdownMenuItemRight className="pr-0">
                  <DropdownMenuValue>140</DropdownMenuValue>
                  <HeadButton />
                  <DropdownMenuIcon name="material-chevron-right" />
                </DropdownMenuItemRight>
              </DropdownMenuHead>
              <Caption>Button</Caption>
              <DropdownMenuHead type="button">
                <HeadButton size="28" full />
              </DropdownMenuHead>
              <Caption>Form</Caption>
              <DropdownMenuHead type="form">
                <HeadInput />
              </DropdownMenuHead>
              <Caption>User</Caption>
              <DropdownMenuHead type="user">
                <DropdownMenuUser>
                  <DropdownMenuUserName>
                    John Smith
                    <DropdownMenuIcon name="material-expand-more" />
                  </DropdownMenuUserName>
                  <DropdownMenuUserEmail>jhonsmith@gmail.com</DropdownMenuUserEmail>
                </DropdownMenuUser>
                <Avatar size="40" story>
                  <AvatarImage src="/images/avatars/avatar-2.png" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                  <AvatarBadge />
                  <Badge variant="solid" color="red" size="square-16" className="absolute -top-0.5 -right-0.5 z-10">
                    1
                  </Badge>
                </Avatar>
              </DropdownMenuHead>
              <Caption>Divider</Caption>
              <DropdownMenuSeparator />
            </DropdownMenuPanel>
          </Row>

          <Row title="Live popup (keyboard + pointer states)">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Menu</Button>} />
              <DropdownMenuContent shape={shape}>
                <HeadDefault title="Menu Open" />
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DefaultItem value />
                  <DefaultItem value />
                  <DropdownMenuItem disabled>
                    <DropdownMenuItemLeft>
                      <DropdownMenuItemAddon>
                        <DropdownMenuIcon name="material-delete" />
                      </DropdownMenuItemAddon>
                      <DropdownMenuItemTitle>Disabled</DropdownMenuItemTitle>
                    </DropdownMenuItemLeft>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <HeadDefault title="Text Footer" />
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Payment</Button>} />
              <DropdownMenuContent shape={shape}>
                <DropdownMenuHead type="form">
                  <HeadInput />
                </DropdownMenuHead>
                <DropdownMenuGroup>
                  {["Master Card", "Visa Card", "Apple Pay"].map((label) => (
                    <DropdownMenuItem key={label}>
                      <DropdownMenuItemLeft>
                        <DropdownMenuItemAddon>
                          <PaymentCardBrand size="40" />
                        </DropdownMenuItemAddon>
                        <DropdownMenuItemTitle>{label}</DropdownMenuItemTitle>
                      </DropdownMenuItemLeft>
                      <DropdownMenuItemRight>
                        <SlotButton />
                      </DropdownMenuItemRight>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Countries</Button>} />
              <DropdownMenuContent shape={shape}>
                <HeadDefault title="Select Countries" />
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {[
                    ["US", "United States"],
                    ["SE", "Sweden"],
                    ["GB", "United Kingdom"],
                  ].map(([code, label]) => (
                    <DropdownMenuItem key={code}>
                      <DropdownMenuItemLeft>
                        <DropdownMenuItemAddon>
                          <SlotFlag code={code} />
                        </DropdownMenuItemAddon>
                        <DropdownMenuItemTitle>{label}</DropdownMenuItemTitle>
                      </DropdownMenuItemLeft>
                      <DropdownMenuItemRight>
                        <DropdownMenuIcon name="material-close" />
                      </DropdownMenuItemRight>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Menu-2</Button>} />
              <DropdownMenuContent shape={shape} size="wide">
                <DropdownMenuGroup>
                  <DoubleItem lead={<DropdownMenuIcon name="material-default-icon" size="28" />} />
                  <DropdownMenuSeparator />
                  <DoubleItem lead={<DropdownMenuIcon name="material-default-icon" size="28" />} />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </div>
      ))}
    </main>
  )
}
