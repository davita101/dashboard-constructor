import { Progress, ProgressDot, ProgressValue } from "@/components/ui/progress"
import { progressColors, type ProgressColor } from "@/components/ui/progress-colors"
import {
  ProgressArcLabel,
  ProgressArcValue,
  ProgressCircle,
  ProgressHalf,
  type ProgressCircleSize,
  type ProgressHalfSize,
} from "@/components/ui/progress-circle"
import { ProgressPercent } from "@/components/ui/progress-percent"

// Mirrors the Figma Progress page (4313:34129): Progress-Line, Progress-Dot, Progress-Percent,
// Progress-Circular, Progress-Circle-Half, plus the Playground frame (12188:157).

const fills = [0, 3, 5, 10, 25, 35, 50, 60, 75, 90, 100]
// Figma Progress-Line has no Black style.
const lineColors = progressColors.filter((color) => color !== "black")
const circleSizes: ProgressCircleSize[] = ["128", "72", "56", "48", "36", "24", "16"]
const halfSizes: ProgressHalfSize[] = ["128", "96", "72", "60", "48", "40", "32", "24", "20"]

function Section({
  title,
  children,
  inverted = false,
}: {
  title: string
  children: React.ReactNode
  inverted?: boolean
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      <div
        className={
          inverted
            ? "flex flex-col gap-6 overflow-x-auto rounded-r16 bg-base-900 p-6"
            : "flex flex-col gap-6 overflow-x-auto"
        }
      >
        {children}
      </div>
    </section>
  )
}

function ColorName({ color }: { color: ProgressColor }) {
  return (
    <span className="w-16 shrink-0 font-default text-12 leading-20 text-base-500 capitalize">
      {color}
    </span>
  )
}

function LineRow({ color, size }: { color: ProgressColor; size: "default" | "small" }) {
  return (
    <div className="flex items-center gap-4">
      <ColorName color={color} />
      {fills.map((fill) => (
        <div key={fill} className={size === "small" ? "w-7.5 shrink-0" : "w-50 shrink-0"}>
          <Progress
            value={fill}
            color={color}
            size={size}
            aria-label={`${color} ${fill}%`}
            title={`Size=${size}, Style=${color}, Fill=${fill}%`}
          />
        </div>
      ))}
    </div>
  )
}

export default function ProgressPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Playground">
        <div className="flex w-100 flex-col gap-5">
          <Progress value={75} aria-label="Upload">
            <ProgressValue />
          </Progress>
          <Progress value={50} color="emerald" size="small" aria-label="Sync">
            <ProgressValue />
          </Progress>
        </div>
        <div className="flex w-100 flex-col gap-16 pt-12">
          <ProgressPercent value={70} aria-label="Volume" />
          <ProgressPercent value={55} size="small" aria-label="Brightness" />
        </div>
        <div className="flex items-center gap-5 pt-6">
          <ProgressCircle value={78} size="128" aria-label="Sales">
            <ProgressArcValue />
            <ProgressArcLabel>Sales</ProgressArcLabel>
          </ProgressCircle>
          <ProgressCircle value={44} size="72" color="pink">
            <ProgressArcValue />
            <ProgressArcLabel>Income</ProgressArcLabel>
          </ProgressCircle>
          <ProgressCircle value={15} size="56" color="emerald" aria-label="Emerald">
            <ProgressArcValue />
          </ProgressCircle>
          <ProgressCircle value={80} size="48" color="green" aria-label="Green">
            <ProgressArcValue />
          </ProgressCircle>
          <ProgressCircle value={50} size="36" color="violet" aria-label="Violet">
            <ProgressArcValue />
          </ProgressCircle>
          <ProgressCircle value={50} size="24" color="amber" aria-label="Amber" />
          <ProgressCircle value={35} size="16" color="fuchsia" aria-label="Fuchsia" />
        </div>
        <div className="flex items-end gap-10 pt-6">
          <ProgressHalf value={75} size="128">
            <ProgressArcValue />
            <ProgressArcLabel>Description</ProgressArcLabel>
          </ProgressHalf>
          <ProgressHalf value={54} size="96" color="yellow">
            <ProgressArcValue />
            <ProgressArcLabel>Description</ProgressArcLabel>
          </ProgressHalf>
          <ProgressHalf value={44} size="72" color="rose">
            <ProgressArcValue />
            <ProgressArcLabel>Description</ProgressArcLabel>
          </ProgressHalf>
          <ProgressHalf value={60} size="60" color="emerald" aria-label="Sales">
            <ProgressArcValue />
          </ProgressHalf>
          <ProgressHalf value={60} size="48" color="sky" aria-label="Sky">
            <ProgressArcValue />
          </ProgressHalf>
        </div>
      </Section>

      <Section title="Progress-Line, Size=Default (200px), Fill 0% to 100%">
        {lineColors
          .filter((color) => color !== "white")
          .map((color) => (
            <LineRow key={color} color={color} size="default" />
          ))}
      </Section>

      <Section title="Progress-Line, Size=Small (30px)">
        {lineColors
          .filter((color) => color !== "white")
          .map((color) => (
            <LineRow key={color} color={color} size="small" />
          ))}
      </Section>

      <Section title="Progress-Line, Style=White" inverted>
        <LineRow color="white" size="default" />
        <LineRow color="white" size="small" />
      </Section>

      <Section title="Progress-Line with value label">
        <div className="flex w-100 flex-col gap-4">
          {(["primary", "primary-dark", "orange", "teal"] as const).map((color) => (
            <Progress key={color} value={60} color={color} aria-label={color}>
              <ProgressValue />
            </Progress>
          ))}
          <Progress value={60} size="small" aria-label="Small">
            <ProgressValue />
          </Progress>
        </div>
      </Section>

      <Section title="Progress-Dot, Type = Default | Hover | Active">
        <div className="flex items-center gap-8">
          <ProgressDot state="default" />
          <ProgressDot state="hover" />
          <ProgressDot state="active" />
          <ProgressDot state="default" size="small" />
        </div>
      </Section>

      <Section title="Progress-Percent, Type = Default | Small">
        <div className="flex w-60 flex-col gap-16 pt-12">
          {[10, 50, 100].map((value) => (
            <ProgressPercent key={value} value={value} aria-label={`Default ${value}%`} />
          ))}
          <ProgressPercent value={75} size="small" aria-label="Small 75%" />
        </div>
      </Section>

      <Section title="Progress-Circular, Size 128 / 72 / 56 / 48 / 36 / 24 / 16">
        {progressColors
          .filter((color) => color !== "white")
          .map((color) => (
            <div key={color} className="flex items-center gap-5">
              <ColorName color={color} />
              {circleSizes.map((size) => (
                <ProgressCircle key={size} value={75} size={size} color={color} aria-label={color}>
                  <ProgressArcValue />
                  <ProgressArcLabel>Description</ProgressArcLabel>
                </ProgressCircle>
              ))}
            </div>
          ))}
      </Section>

      <Section title="Progress-Circular, Style=White" inverted>
        <div className="flex items-center gap-5">
          {circleSizes.map((size) => (
            <ProgressCircle key={size} value={75} size={size} color="white" aria-label="White">
              <ProgressArcValue />
              <ProgressArcLabel>Description</ProgressArcLabel>
            </ProgressCircle>
          ))}
        </div>
      </Section>

      <Section title="Progress-Circle-Half, Size 128 / 96 / 72 / 60 / 48 / 40 / 32 / 24 / 20">
        {progressColors
          .filter((color) => color !== "white")
          .map((color) => (
            <div key={color} className="flex items-end gap-5">
              <ColorName color={color} />
              {halfSizes.map((size) => (
                <ProgressHalf key={size} value={75} size={size} color={color} aria-label={color}>
                  <ProgressArcValue />
                  <ProgressArcLabel>Description</ProgressArcLabel>
                </ProgressHalf>
              ))}
            </div>
          ))}
      </Section>

      <Section title="Progress-Circle-Half, Style=White" inverted>
        <div className="flex items-end gap-5">
          {halfSizes.map((size) => (
            <ProgressHalf key={size} value={75} size={size} color="white" aria-label="White">
              <ProgressArcValue />
              <ProgressArcLabel>Description</ProgressArcLabel>
            </ProgressHalf>
          ))}
        </div>
      </Section>
    </main>
  )
}
