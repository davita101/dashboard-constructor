import { CartesianChart, type CartesianKind, type ChartLines, type ChartYAxis } from "@/components/charts/cartesian-chart"
import { RadialChart } from "@/components/charts/radial-chart"

const lineKinds: [string, CartesianKind][] = [
  ["Line-Chart", "line"],
  ["Line-Gradient-Chart", "line-gradient"],
  ["Line-Step-Chart", "line-step"],
  ["Line-Area-Chart", "line-area"],
]
const yTypes: [string, ChartYAxis][] = [
  ["Left Y Data", "left"],
  ["Right Y Data", "right"],
  ["No Y Data", "none"],
  ["2 Y Data", "both"],
]
const lineModes: ChartLines[] = ["grid", "line", "none"]
const simple: [string, CartesianKind, boolean][] = [
  ["Column-Type-1-Chart", "column-1", false],
  ["Column-Type-2-Chart", "column-2", true],
  ["Column-Type-3-Chart", "column-3", true],
  ["Column-Type-4-Chart", "column-4", false],
  ["Column-Type-5-Chart", "column-5", true],
  ["Column-Type-6-Chart", "column-6", true],
  ["Bar-Chart", "bar", false],
  ["Bar-Double-Chart", "bar-double", false],
  ["Candle-Chart", "candle", false],
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
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap gap-8">{children}</div>
    </section>
  )
}

function Cell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-default text-12 leading-20 text-base-500">{caption}</p>
      {children}
    </div>
  )
}

export default function ChartPreviewPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-12 p-8">
      {lineKinds.map(([title, kind]) => (
        <Section key={title} title={title}>
          {yTypes.flatMap(([yName, y]) =>
            lineModes.map((lines) => (
              <Cell key={`${yName}${lines}`} caption={`Type=${yName}, Lines=${lines}`}>
                <CartesianChart kind={kind} yAxis={y} lines={lines} />
              </Cell>
            )),
          )}
        </Section>
      ))}
      {simple.map(([title, kind, tooltip]) => (
        <Section key={title} title={title}>
          {lineModes.map((lines) => (
            <Cell key={lines} caption={`Lines=${lines}`}>
              <CartesianChart kind={kind} lines={lines} tooltip={tooltip} />
            </Cell>
          ))}
        </Section>
      ))}
      {(["bar-stacked", "bar-negative"] as CartesianKind[]).map((kind) => (
        <Section key={kind} title={kind === "bar-stacked" ? "Bar-Stacked-Chart" : "Bar-Negative-Values-Chart"}>
          {stackedTypes.flatMap(([yName, y]) =>
            lineModes.map((lines) => (
              <Cell key={`${yName}${lines}`} caption={`Type=${yName}, Lines=${lines}`}>
                <CartesianChart kind={kind} yAxis={y} lines={lines} tooltip={false} />
              </Cell>
            )),
          )}
        </Section>
      ))}
      <Section title="Donut-Chart">
        {counts.map((n) => (
          <Cell key={n} caption={`Type=${n} Charts`}>
            <RadialChart kind="donut" count={n} />
          </Cell>
        ))}
      </Section>
      <Section title="Pie-Chart">
        {counts.map((n) => (
          <Cell key={n} caption={`Type=${n} Charts`}>
            <RadialChart kind="pie" count={n} />
          </Cell>
        ))}
      </Section>
      <Section title="Progress-Chart">
        <Cell caption="Type=Center Text">
          <RadialChart kind="progress" text />
        </Cell>
        <Cell caption="Type=No Text">
          <RadialChart kind="progress" />
        </Cell>
      </Section>
      <Section title="Rings-Chart">
        <Cell caption="Type=Rings (Income / Cost / Profit)">
          <RadialChart kind="rings" />
        </Cell>
      </Section>
      <Section title="Progress-Half-Chart">
        <Cell caption="Type=Text, Style=Default">
          <RadialChart kind="progress-half" text />
        </Cell>
        <Cell caption="Type=No Text, Style=Default">
          <RadialChart kind="progress-half" />
        </Cell>
      </Section>
    </main>
  )
}
