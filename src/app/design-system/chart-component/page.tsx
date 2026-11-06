import {
  ChartAmount,
  ChartArea,
  ChartCandle,
  ChartColumn,
  ChartColumnsMini,
  ChartDot,
  ChartLegendList,
  ChartLine,
  ChartLineArea,
  ChartMap,
  ChartPie,
  ChartProgressCard,
  ChartTrend,
  ChartValue,
  ChartStep,
  type ChartShade,
  type ChartTone,
} from "@/components/ui/chart-parts"
import { ProgressCircle, ProgressHalf } from "@/components/ui/progress-circle"

// Mirrors the Figma Charts Components page (5035:13716).

const hues: ChartTone[] = [
  "primary", "green", "orange", "sky", "purple", "pink", "red", "amber", "yellow", "teal",
  "blue", "lime", "cyan", "emerald", "rose", "fuchsia", "violet", "indigo",
]
const withDark: ChartTone[] = [...hues, "dark"]
const withWhite: ChartTone[] = [...withDark, "white"]
const shades: ChartShade[] = [600, 500, 400, 300, 200, 100]
const pieShades: ChartShade[] = [900, 800, 700, 600, 500, 400, 300]
const pieHues: ChartTone[] = ["primary", "green", "orange", "sky", "purple", "pink", "red", "amber", "yellow", "teal"]
const percents = [100, 90, 76, 64, 48, 36, 16] as const
const progressPercents = [100, 92, 86, 75, 64, 48, 36, 16]
const progressColors = [
  "primary", "green", "blue", "lime", "cyan", "emerald", "rose", "fuchsia", "violet", "indigo",
  "orange", "sky", "purple", "pink", "red", "amber", "yellow", "teal", "gray",
] as const
const amountSizes = [12, 14, 16, 18, 20, 24, 30] as const

function Section({ title, dark, children }: { title: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 leading-24 font-bold text-base-800">{title}</h2>
      <div className={dark ? "flex flex-wrap items-start gap-4 rounded-r12 bg-base-900 p-6" : "flex flex-wrap items-start gap-4"}>
        {children}
      </div>
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

export default function ChartComponentPreviewPage() {
  return (
    <main className="mx-auto flex max-w-desktop font-default flex-col gap-12 p-8">
      <Section title="Legend-Component">
        <Cell caption="Type=Horizontal, Style=Default">
          <ChartLegendList type="horizontal" />
        </Cell>
        <div className="rounded-r12 bg-base-900 p-4">
          <Cell caption="Type=Horizontal, Style=Image">
            <ChartLegendList type="horizontal" appearance="image" />
          </Cell>
        </div>
        <Cell caption="Type=Vertical, Style=Default">
          <ChartLegendList type="vertical" />
        </Cell>
        <div className="rounded-r12 bg-base-900 p-4">
          <Cell caption="Type=Vertical, Style=Image">
            <ChartLegendList type="vertical" appearance="image" />
          </Cell>
        </div>
      </Section>
      <Section title="Amount-Component">
        {(["default", "image"] as const).map((appearance) => (
          <div
            key={appearance}
            className={
              appearance === "image"
                ? "flex flex-wrap items-start gap-4 rounded-r12 bg-base-900 p-6"
                : "flex flex-wrap items-start gap-4"
            }
          >
            {amountSizes.map((size) => (
              <Cell key={size} caption={`Size=${size}, Style=${appearance}`}>
                <ChartAmount size={size} appearance={appearance} />
              </Cell>
            ))}
          </div>
        ))}
      </Section>
      <Section title="Progress-Card-Component">
        <Cell caption="Style=Default, Type=Progress (Up)">
          <ChartProgressCard trend="up" />
        </Cell>
        <Cell caption="Style=Default, Type=Progress (Down)">
          <ChartProgressCard trend="down" />
        </Cell>
        <Cell caption="Style=Default, Type=Head">
          <ChartProgressCard type="head" />
        </Cell>
        <div className="flex gap-6 rounded-r12 bg-base-900 p-6">
          <Cell caption="Style=Image, Type=Progress">
            <ChartProgressCard appearance="image" />
          </Cell>
          <Cell caption="Style=Image, Type=Head">
            <ChartProgressCard type="head" appearance="image" />
          </Cell>
        </div>
      </Section>
      <Section title="Candle-Chart-Component">
        {(["up", "down"] as const).flatMap((type) =>
          ([1, 2, 3] as const).map((style) => (
            <Cell key={`${type}${style}`} caption={`Type=${type}, Style=${style}`}>
              <ChartCandle type={type} style={style} />
            </Cell>
          )),
        )}
      </Section>
      <Section title="Map-Component / Map-White-Component">
        <Cell caption="Type=Default">
          <ChartMap />
        </Cell>
        <Cell caption="Map-White Type=Default">
          <ChartMap appearance="white" />
        </Cell>
      </Section>
      <Section title="Chart-Step-Component">
        {[...withDark, "white" as ChartTone].map((tone, i) => (
          <Cell key={tone} caption={tone}>
            <ChartStep tone={tone} tall={i % 3 !== 1} />
          </Cell>
        ))}
      </Section>
      <Section title="Progress-Half-Chart-Component">
        {progressColors.map((color) => (
          <div key={color} className="flex flex-col gap-2">
            {progressPercents.map((value) => (
              <ProgressHalf key={value} size="56" value={value} color={color} aria-label={`${color} ${value}%`} />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          {progressPercents.map((value) => (
            <ProgressHalf key={value} size="56" value={value} color="black" aria-label={`Dark ${value}%`} />
          ))}
        </div>
      </Section>
      <Section title="Progress-Chart-Component">
        {progressColors.map((color) => (
          <div key={color} className="flex flex-col gap-2">
            {progressPercents.map((value) => (
              <ProgressCircle key={value} size="56" value={value} color={color} aria-label={`${color} ${value}%`} />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          {progressPercents.map((value) => (
            <ProgressCircle key={value} size="56" value={value} color="black" aria-label={`Dark ${value}%`} />
          ))}
        </div>
      </Section>
      <Section title="Chart-Pie-Donut-Component / Chart-Pie-Component">
        {(["donut", "pie"] as const).map((type) => (
          <div key={type} className="flex flex-col gap-4">
            <p className="text-12 leading-20 font-bold text-base-700">{type}</p>
            {pieHues.map((tone) => (
              <div key={tone} className="flex flex-col gap-1">
                {pieShades.map((shade) => (
                  <div key={shade} className="flex items-center gap-2">
                    {percents.map((percent) => (
                      <ChartPie key={percent} type={type} tone={tone} shade={shade} percent={percent} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>
      <Section title="Chart-Column-Component">
        {hues.flatMap((tone) =>
          (["solid", "right", "left", "top", "bottom"] as const).map((fill) => (
            <Cell key={`${tone}${fill}`} caption={`${tone} ${fill}`}>
              <ChartColumn tone={tone} shade={500} fill={fill} />
            </Cell>
          )),
        )}
        {([600, 400, 300, 200, 100] as ChartShade[]).map((shade) => (
          <Cell key={shade} caption={`primary ${shade}`}>
            <ChartColumn shade={shade} />
          </Cell>
        ))}
        <Cell caption="Purple 30%">
          <ChartColumn tone="purple" fill="alpha-30" />
        </Cell>
        <Cell caption="Purple 10%">
          <ChartColumn tone="purple" fill="alpha-10" />
        </Cell>
        <Cell caption="Gray 100">
          <ChartColumn tone="gray" shade={100} />
        </Cell>
        <Cell caption="Gray 800">
          <ChartColumn tone="gray" shade={800} />
        </Cell>
        <Cell caption="Dark">
          <ChartColumn tone="dark" />
        </Cell>
        <div className="flex gap-6 rounded-r12 bg-base-900 p-4">
          {(["white", "white-80", "white-60", "white-40", "white-20"] as const).map((tone) => (
            <Cell key={tone} caption={tone}>
              <ChartColumn tone={tone} />
            </Cell>
          ))}
        </div>
      </Section>
      <Section title="Line-Chart-Component (Style x Type 1-3)">
        {[...withDark, "gray" as ChartTone].flatMap((tone) =>
          ([1, 2, 3] as const).map((type) => (
            <Cell key={`${tone}${type}`} caption={`${tone}, Type=${type}`}>
              <ChartLine tone={tone} type={type} />
            </Cell>
          )),
        )}
      </Section>
      <Section title="Chart-Dot-Component (Style x Border x Type)">
        {(["border", "center"] as const).flatMap((type) =>
          ([1, 2] as const).flatMap((border) =>
            [...hues, "gray" as ChartTone, "dark" as ChartTone].map((tone) => (
              <Cell key={`${type}${border}${tone}`} caption={`${tone}, Border=${border}, ${type}`}>
                <div className="flex flex-col items-start gap-2">
                  {shades.map((shade) => (
                    <ChartDot key={shade} tone={tone} shade={shade} type={type} border={border} />
                  ))}
                </div>
              </Cell>
            )),
          ),
        )}
      </Section>
      <Section title="Line-Area-Chart-Component (Style x Type 1-10)">
        {withDark.flatMap((tone) =>
          (tone === "primary" ? ([1, 2, 3, 4, 5, 6, 7, 9, 10] as const) : ([1, 4, 7] as const)).map((type) => (
            <Cell key={`${tone}${type}`} caption={`${tone}, Type=${type}`}>
              <ChartLineArea tone={tone} type={type} />
            </Cell>
          )),
        )}
      </Section>
      <Section title="Area-Chart-Component (Style x Type 1-10)" dark>
        {withWhite.flatMap((tone) =>
          (tone === "primary" ? ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) : ([2, 10] as const)).map((type) => (
            <Cell key={`${tone}${type}`} caption={`${tone}, Type=${type}`}>
              <ChartArea tone={tone} type={type} />
            </Cell>
          )),
        )}
      </Section>
      <Section title="Finance value + stacked trend (Projects)">
        {(["green", "purple"] as const).map((tone) => (
          <Cell key={tone} caption={`ChartValue ${tone}`}>
            <ChartValue tone={tone}>$ 14.000</ChartValue>
          </Cell>
        ))}
        <Cell caption="ChartTrend size=stack up">
          <ChartTrend direction="up" size="stack">+23%</ChartTrend>
        </Cell>
        <Cell caption="ChartTrend size=stack down">
          <ChartTrend direction="down" size="stack">-11%</ChartTrend>
        </Cell>
      </Section>
      <Section title="Chart-Columns-Mini-Component">
        {[...withDark, "white" as ChartTone].map((tone) => (
          <div key={tone} className="flex flex-col gap-4 p-2">
            {([1, 2, 3, 4, 5, 6] as const).map((type) => (
              <Cell key={type} caption={`${tone}, Type=${type}`}>
                <ChartColumnsMini tone={tone} type={type} />
              </Cell>
            ))}
          </div>
        ))}
      </Section>
    </main>
  )
}
