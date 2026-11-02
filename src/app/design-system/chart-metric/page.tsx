import * as React from "react"

import {
  ChartColumnsMini,
  ChartLine,
  ChartLineArea,
  ChartMap,
  ChartPie,
  ChartStep,
  type ChartTone,
} from "@/components/ui/chart-parts"
import {
  ChartMetricActions,
  ChartMetricAmount,
  ChartMetricAmounts,
  ChartMetricBody,
  ChartMetricCard,
  ChartMetricChart,
  ChartMetricColorCard,
  ChartMetricFooter,
  ChartMetricHead,
  ChartMetricList,
  ChartMetricPlot,
  ChartMetricStats,
  ChartMetricTooltip,
  ChartMetricWideBody,
  colorCardTones,
} from "@/components/ui/chart-metric"
import { ProgressCircle, ProgressHalf } from "@/components/ui/progress-circle"

// Mirrors the Figma Charts Metrics page (9880:5306).

type Appearance = "default" | "image"
const appearances: Appearance[] = ["default", "image"]
const typeName = (a: Appearance) => `Type=${a === "image" ? "Image" : "Default"}`

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  )
}

function Cell({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-12 leading-20 text-base-500">{caption}</p>
      {children}
    </div>
  )
}

/** Compact Metric-*-Card: Head, stats + chart, Footer. */
function Compact({
  appearance,
  size = "md",
  chart,
  pr,
}: {
  appearance: Appearance
  size?: "sm" | "md"
  chart: React.ReactNode
  pr?: boolean
}) {
  return (
    <ChartMetricCard appearance={appearance} size={size}>
      <ChartMetricHead />
      <ChartMetricBody className={pr ? "pr-8" : undefined}>
        <ChartMetricStats />
        <ChartMetricChart>{chart}</ChartMetricChart>
      </ChartMetricBody>
      <ChartMetricFooter />
    </ChartMetricCard>
  )
}

/** Revenue card: Amount, plot with tooltip, Actions footer. */
function Revenue({ appearance, plot }: { appearance: Appearance; plot: React.ReactNode }) {
  return (
    <ChartMetricCard appearance={appearance} size="lg">
      <div className="flex flex-col gap-4 p-5">
        <ChartMetricAmount />
        <ChartMetricPlot>
          {plot}
          <ChartMetricTooltip className="top-4 left-30" />
        </ChartMetricPlot>
      </div>
      <ChartMetricActions />
    </ChartMetricCard>
  )
}

function Large({ appearance, title, children }: { appearance: Appearance; title: string; children: React.ReactNode }) {
  return (
    <ChartMetricCard appearance={appearance} size="lg">
      <ChartMetricHead size="large" title={title} />
      <ChartMetricBody layout="stack" className="pt-5">
        {children}
      </ChartMetricBody>
      <ChartMetricActions size="lg" divider={false} />
    </ChartMetricCard>
  )
}

function line(tone: ChartTone, tone2: ChartTone, a: Appearance) {
  return (
    <>
      <ChartLine tone={a === "image" ? tone2 : tone} type={2} preserveAspectRatio="none" />
      <ChartLine tone={a === "image" ? "white-40" : tone2} type={1} preserveAspectRatio="none" />
    </>
  )
}

export default function ChartMetricPreviewPage() {
  return (
    <main className="mx-auto font-default flex max-w-desktop flex-col gap-12 p-8">
      <Section title="Metric-Area-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact
              appearance={a}
              size="sm"
              chart={<ChartLineArea tone={a === "image" ? "white" : "blue"} type={1} className="h-30 w-23.25" preserveAspectRatio="none" />}
            />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Line-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact
              appearance={a}
              size="sm"
              chart={<ChartLine tone={a === "image" ? "white" : "blue"} type={1} className="h-27 w-23.25" preserveAspectRatio="none" />}
            />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Chart-Pie-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact
              appearance={a}
              pr
              chart={
                <span className="relative size-22">
                  <ChartPie tone="purple" shade={500} className="absolute inset-0 size-full" />
                  <ChartPie tone="green" shade={500} percent={90} className="absolute inset-0 size-full" />
                  <span className="absolute inset-[34%] rounded-full bg-background-0 group-data-[appearance=image]/metric:bg-black" />
                </span>
              }
            />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Progress-Chart-Pie-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact appearance={a} chart={<ProgressHalf size="96" value={50} color={a === "image" ? "white" : "blue"} aria-label="50%" />} />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Progress-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact appearance={a} chart={<ProgressCircle size="56" value={50} color={a === "image" ? "white" : "green"} aria-label="50%" />} />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Column-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Compact appearance={a} chart={<ChartColumnsMini tone={a === "image" ? "white" : "blue"} type={4} />} />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Line-Chart-Card (Revenue)">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Revenue appearance={a} plot={line("sky", "blue", a)} />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Line-2-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Revenue
              appearance={a}
              plot={
                <>
                  <ChartLineArea tone="green" type={2} preserveAspectRatio="none" />
                  <ChartLine tone={a === "image" ? "red" : "orange"} type={2} preserveAspectRatio="none" />
                </>
              }
            />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Area-Chart-Card (Revenue)">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Revenue appearance={a} plot={<ChartLineArea tone={a === "image" ? "white" : "pink"} type={1} preserveAspectRatio="none" />} />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Steps-Chart-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <Revenue
              appearance={a}
              plot={
                <>
                  <ChartStep tone={a === "image" ? "lime" : "indigo"} preserveAspectRatio="none" />
                  <ChartStep tone={a === "image" ? "orange" : "amber"} tall={false} preserveAspectRatio="none" />
                </>
              }
            />
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Chart-Card / Metric-Chart-White-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={a === "image" ? "White" : "Default"}>
            <Large appearance={a} title="Line Chart Sample">
              <ChartMetricAmounts>
                <ChartMetricAmount size="lg" heading="Revenue" tone="pink" />
                <ChartMetricAmount size="lg" heading="Views" tone="blue" value="32,540" delta="1,05%" additionalText="vs. 28,540 last" />
              </ChartMetricAmounts>
              <ChartMetricList appearance={a} />
            </Large>
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Map-Card / Metric-Map-White-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={a === "image" ? "White" : "Default"}>
            <Large appearance={a} title="Map">
              <div className="relative pt-5">
                <ChartMap appearance={a === "image" ? "white" : "default"} />
                <ChartMetricTooltip className="top-8 left-24 min-w-14">Tooltip</ChartMetricTooltip>
              </div>
              <ChartMetricList appearance={a} />
            </Large>
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Card">
        {appearances.map((a) => (
          <Cell key={a} caption={typeName(a)}>
            <ChartMetricCard appearance={a} size="wide">
              <ChartMetricWideBody />
              <ChartMetricFooter size="wide" link="Heading" />
            </ChartMetricCard>
          </Cell>
        ))}
      </Section>
      <Section title="Metric-Color-Card">
        {colorCardTones.flatMap((tone) =>
          [false, true].map((soft) => (
            <Cell key={`${tone}${soft}`} caption={`Type=${tone}${soft ? " Soft" : ""}`}>
              <ChartMetricColorCard tone={tone} soft={soft} />
            </Cell>
          )),
        )}
      </Section>
    </main>
  )
}
