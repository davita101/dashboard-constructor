import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHead,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemDescription,
  DropdownMenuItemMain,
  DropdownMenuItemText,
  DropdownMenuItemTrail,
  DropdownMenuPanel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Mirrors Figma Dropdown (4290:12174): Item, Item-2, Menu, Menu-2, Head-Footer, Divider x Rounded | Pilled.
const shapes = ["rounded", "pilled"] as const
const states = [
  { name: "Default", className: "" },
  { name: "Hover", className: "bg-base-50" },
  { name: "Active", className: "bg-base-100" },
  { name: "Disabled", className: "opacity-50" },
] as const

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-14 font-bold text-base-900">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

export default function DropdownPage() {
  return (
    <main className="flex flex-col gap-10 bg-background-10 p-10 font-default">
      <h1 className="text-24 font-bold text-base-900">Dropdown</h1>
      {shapes.map((shape) => (
        <div key={shape} className="flex flex-col gap-8">
          <h2 className="text-18 font-bold text-primary-600 capitalize">{shape}</h2>
          <Row title="Item states">
            {states.map((s) => (
              <DropdownMenuPanel key={s.name} shape={shape}>
                <p className="px-2 text-10 text-base-500">{s.name}</p>
                <DropdownMenuItem className={s.className} disabled={s.name === "Disabled"}>
                  <DropdownMenuItemMain>
                    <DropdownMenuIcon name="material-default-icon" />
                    Text Dropdown
                  </DropdownMenuItemMain>
                  <DropdownMenuItemTrail>
                    140
                    <DropdownMenuIcon name="material-chevron-right" />
                  </DropdownMenuItemTrail>
                </DropdownMenuItem>
              </DropdownMenuPanel>
            ))}
          </Row>
          <Row title="Item-2 states">
            {states.map((s) => (
              <DropdownMenuPanel key={s.name} shape={shape}>
                <DropdownMenuItem layout="double" className={s.className} disabled={s.name === "Disabled"}>
                  <DropdownMenuItemMain>
                    <DropdownMenuItemText>
                      Text Dropdown
                      <DropdownMenuItemDescription>Upgrade your plan for more credits</DropdownMenuItemDescription>
                    </DropdownMenuItemText>
                  </DropdownMenuItemMain>
                </DropdownMenuItem>
              </DropdownMenuPanel>
            ))}
          </Row>
          <Row title="Menu / Menu-2 / Head-Footer / Divider">
            <DropdownMenuPanel shape={shape}>
              <DropdownMenuHead>
                Text Heading
              </DropdownMenuHead>
              <DropdownMenuSeparator />
              {[1, 2].map((i) => (
                <DropdownMenuItem key={i}>
                  <DropdownMenuItemMain>
                    <DropdownMenuIcon name="material-default-icon" />
                    Text Dropdown
                  </DropdownMenuItemMain>
                  <DropdownMenuItemTrail>
                    <DropdownMenuIcon name="material-chevron-right" />
                  </DropdownMenuItemTrail>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuHead>Text Footer</DropdownMenuHead>
            </DropdownMenuPanel>
            <DropdownMenuPanel shape={shape} size="wide">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} layout="double">
                  <DropdownMenuItemText>
                    Text Dropdown
                    <DropdownMenuItemDescription>Upgrade your plan for more credits</DropdownMenuItemDescription>
                  </DropdownMenuItemText>
                </DropdownMenuItem>
              ))}
            </DropdownMenuPanel>
          </Row>
          <Row title="Live popup">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
              <DropdownMenuContent shape={shape}>
                <DropdownMenuItem>
                  <DropdownMenuItemMain>Text Dropdown</DropdownMenuItemMain>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <DropdownMenuItemMain>Disabled</DropdownMenuItemMain>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Row>
        </div>
      ))}
    </main>
  )
}
