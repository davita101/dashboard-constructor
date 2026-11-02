import { CartesianChart, type CartesianKind, type ChartLines, type ChartYAxis } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"

const lineKinds: [string, CartesianKind][] = [
  ["Line-White-Chart", "line"],
  ["Line-Gradient-White-Chart", "line-gradient"],
  ["Line-Step-White-Chart", "line-step"],
  ["Line-Area-White-Chart", "line-area"],
]
const yTypes: [string, ChartYAxis][] = [
  ["Left Y Data", "left"],
  ["Right Y Data", "right"],
  ["No Y Data", "none"],
  ["2 Y Data", "both"],
]
const lineModes: ChartLines[] = ["grid", "line", "none"]
const simple: [string, CartesianKind, boolean][] = [
  ["Column-Type-1-White-Chart", "column-1", false],
  ["Column-Type-2-White-Chart", "column-2", true],
  ["Column-Type-3-White-Chart", "column-3", true],
  ["Column-Type-4-White-Chart", "column-4", false],
  ["Column-Type-5-White-Chart", "column-5", true],
  ["Column-Type-6-White-Chart", "column-6", true],
  ["Bar-White-Chart", "bar", false],
  ["Bar-Double-White-Chart", "bar-double", false],
  ["Candle-White-Chart", "candle", false],
]
const stackedTypes: [string, ChartYAxis][] = [
  ["2 Y Data", "both"],
  ["Right Y Data", "right"],
  ["Left Y Data", "left"],
]
const counts = [7, 6, 5, 4, 3, 2]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-white">{title}</h2>
      <div className="flex flex-wrap gap-8">{children}</div>
    </section>
  )
}

function Cell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-default text-12 leading-20 text-white-alpha-50">{caption}</p>
      {children}
    </div>
  )
}

export default function ChartWhitePreviewPage() {
  return (
    <main className="min-h-screen bg-black">
    <div className="mx-auto flex max-w-desktop flex-col gap-12 p-8">
      {lineKinds.map(([title, kind]) => (
        <Section key={title} title={title}>
          {yTypes.flatMap(([yName, y]) =>
            lineModes.map((lines) => (
              <Cell key={`${yName}${lines}`} caption={`Type=${yName}, Lines=${lines}`}>
                <CartesianChart theme="white" kind={kind} yAxis={y} lines={lines} />
              </Cell>
            )),
          )}
        </Section>
      ))}
      {simple.map(([title, kind, tooltip]) => (
        <Section key={title} title={title}>
          {lineModes.map((lines) => (
            <Cell key={lines} caption={`Lines=${lines}`}>
              <CartesianChart theme="white" kind={kind} lines={lines} tooltip={tooltip} />
            </Cell>
          ))}
        </Section>
      ))}
      {(["bar-stacked", "bar-negative"] as CartesianKind[]).map((kind) => (
        <Section key={kind} title={kind === "bar-stacked" ? "Bar-Stacked-White-Chart" : "Bar-Negative-Values-White-Chart"}>
          {stackedTypes.flatMap(([yName, y]) =>
            lineModes.map((lines) => (
              <Cell key={`${yName}${lines}`} caption={`Type=${yName}, Lines=${lines}`}>
                <CartesianChart theme="white" kind={kind} yAxis={y} lines={lines} tooltip={false} />
              </Cell>
            )),
          )}
        </Section>
      ))}
      <Section title="Donut-White-Chart">
        {counts.map((n) => (
          <Cell key={n} caption={`Type=${n} Charts`}>
            <RadialChart theme="white" kind="donut" count={n} />
          </Cell>
        ))}
      </Section>
      <Section title="Pie-White-Chart">
        {counts.map((n) => (
          <Cell key={n} caption={`Type=${n} Charts`}>
            <RadialChart theme="white" kind="pie" count={n} />
          </Cell>
        ))}
      </Section>
      <Section title="Progress-White-Chart">
        <Cell caption="Type=Center Text">
          <RadialChart theme="white" kind="progress" text />
        </Cell>
        <Cell caption="Type=No Text">
          <RadialChart theme="white" kind="progress" />
        </Cell>
      </Section>
      <Section title="Progress-Half-White-Chart">
        <Cell caption="Type=Text, Style=Default">
          <RadialChart theme="white" kind="progress-half" text />
        </Cell>
        <Cell caption="Type=No Text, Style=Default">
          <RadialChart theme="white" kind="progress-half" />
        </Cell>
      </Section>
    </div>
    </main>
  )
}
