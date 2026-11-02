import {
  Browser,
  BrowserActions,
  BrowserAddress,
  BrowserControls,
  Mockup,
  MockupScreen,
  type MockupDevice,
} from "@/components/ui/mockup"

// Mirrors the Figma Mockups page (11662:1003): iPad, iPhone and Browser sets.

const ipads: { name: string; device: MockupDevice }[] = [
  { name: "iPad mini", device: "ipad-mini" },
  { name: 'iPad Pro 11"', device: "ipad-pro-11" },
  { name: 'iPad Pro 13"', device: "ipad-pro-13" },
]

const iphones: { name: string; device: MockupDevice }[] = [
  { name: "iPhone 16", device: "iphone-16" },
  { name: "iPhone 16 Pro", device: "iphone-16-pro" },
  { name: "iPhone 16 Pro Plus", device: "iphone-16-pro-plus" },
  { name: "iPhone 16 Pro Max", device: "iphone-16-pro-max" },
]

function Group({ title, items }: { title: string; items: { name: string; device: MockupDevice }[] }) {
  return (
    <section className="flex flex-col gap-16">
      <h2 className="text-20 leading-28 font-semibold text-base-900">{title}</h2>
      <div className="flex flex-wrap items-start gap-24">
        {items.map((item) => (
          <figure key={item.device} className="flex flex-col gap-8">
            <figcaption className="text-12 leading-20 text-base-500">{item.name}</figcaption>
            <Mockup device={item.device}>
              <MockupScreen />
            </Mockup>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <main className="flex flex-col gap-48 bg-background-0 p-48">
      <Group title="iPad" items={ipads} />
      <Group title="iPhone" items={iphones} />
      <section className="flex flex-col gap-16">
        <h2 className="text-20 leading-28 font-semibold text-base-900">Browser</h2>
        <Browser>
          <BrowserControls />
          <BrowserAddress>www.spline.one</BrowserAddress>
          <BrowserActions />
        </Browser>
      </section>
    </main>
  )
}
