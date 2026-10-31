import * as React from "react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Badge, BadgeDot } from "@/components/ui/badge"
import { Button, ButtonCounter, ButtonIcon } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Counter } from "@/components/ui/counter"
import { Input } from "@/components/ui/input"
import { ProgressCircle, ProgressArcValue } from "@/components/ui/progress-circle"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TableCell,
  TableCellChart,
  TableCellContent,
  TableCellDescription,
  TableCellIcon,
  TableCellImage,
  TableCellLogo,
  TableCellProgress,
  TableCellSort,
  TableCellTitle,
  type TableCellSize,
} from "@/components/ui/table-cell"

// Mirrors the Figma Cells UI (Tables) page (5026:42162): 38 cell sets, each Size 60 / 48 / 40 / 32
// (rows) × Style Default / Border / Head & Select (columns).

type CellStyle = "default" | "border" | "head"
type Align = "left" | "center"

const sizes: TableCellSize[] = ["60", "48", "40", "32"]
const sizeLabel: Record<TableCellSize, string> = {
  "60": "Extra Large (60)",
  "48": "Large (48)",
  "40": "Default (40)",
  "32": "Small (32)",
}
const styles: { id: CellStyle; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "border", label: "Border" },
  { id: "head", label: "Head & Select" },
]
const photo = "/images/avatars/avatar-1.png"
const avatarSize = { "60": "40", "48": "32", "40": "32", "32": "24" } as const
const buttonSize = { "60": "32", "48": "32", "40": "24", "32": "24" } as const
const badgeSize = { "60": "24", "48": "24", "40": "20", "32": "20" } as const
const boxSize = { "60": "20", "48": "20", "40": "20", "32": "16" } as const
const counterSize = { "60": "32", "48": "24", "40": "24", "32": "24" } as const
const inputSize = { "60": "32", "48": "32", "40": "32", "32": "24" } as const
const tabSize = { "60": "xs", "48": "xs", "40": "xs", "32": "micro" } as const
const circleSize = { "60": "36", "48": "24", "40": "24", "32": "16" } as const
const buttonGroupSize = { "60": "32", "48": "32", "40": "24", "32": "24" } as const

type CellProps = React.ComponentProps<typeof TableCell>

function Matrix({
  title,
  children,
  extraStyles,
  aligns = ["left"],
}: {
  title: string
  children: (cell: { size: TableCellSize; style: CellStyle; align: Align; props: CellProps; primary?: boolean }) => React.ReactNode
  extraStyles?: boolean
  aligns?: Align[]
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {aligns.map((align) => (
        <div key={align} className="flex flex-col gap-2">
          {aligns.length > 1 && (
            <p className="font-default text-11 leading-20 font-semibold text-base-500">Position = {align}</p>
          )}
          <div className="grid grid-cols-[repeat(3,minmax(0,max-content))] items-start gap-x-8 gap-y-4 lg:grid-cols-[repeat(3,300px)]">
            {sizes.flatMap((size) =>
              styles.map(({ id, label }) => (
                <div key={`${size}-${id}`} className="flex flex-col gap-1">
                  <span className="font-default text-10 leading-16 text-base-400">
                    {sizeLabel[size]} / {label}
                  </span>
                  {children({
                    size,
                    style: id,
                    align,
                    props: { size, style: id, align },
                  })}
                </div>
              ))
            )}
            {extraStyles &&
              sizes.map((size) => (
                <div key={`${size}-primary`} className="flex flex-col gap-1">
                  <span className="font-default text-10 leading-16 text-base-400">
                    {sizeLabel[size]} / Head &amp; Select Primary
                  </span>
                  {children({ size, style: "border", align, primary: true, props: { size, style: "border", align } })}
                </div>
              ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Pair({ tone }: { tone?: "primary" }) {
  return (
    <TableCellContent>
      <TableCellTitle tone={tone}>Heading</TableCellTitle>
      <TableCellDescription tone={tone ? "primary-soft" : "muted"}>Heading</TableCellDescription>
    </TableCellContent>
  )
}

function Avatars({ size }: { size: TableCellSize }) {
  return (
    <Avatar size={avatarSize[size]}>
      <AvatarImage src={photo} alt="" />
      <AvatarFallback>MH</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  )
}

export default function CellUiTablePreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Matrix title="Empty-Cell">{({ props }) => <TableCell {...props} className="w-30" />}</Matrix>

      <Matrix title="Text-Cell" extraStyles aligns={["left", "center"]}>
        {({ props, size, primary }) =>
          primary ? (
            <TableCell {...props} padding="loose" className={size === "60" ? "w-62" : "w-58"}>
              <TableCellIcon tone="primary" />
              <TableCellTitle tone="primary">Heading</TableCellTitle>
              <TableCellTitle tone="primary">Heading</TableCellTitle>
              <TableCellTitle tone="primary-soft">Heading</TableCellTitle>
              <TableCellIcon tone="primary" />
              <TableCellSort direction="up" />
            </TableCell>
          ) : (
            <TableCell {...props} padding="loose" className={size === "60" ? "w-62" : "w-58"}>
              <TableCellIcon />
              <TableCellTitle>Heading</TableCellTitle>
              <TableCellTitle tone="link">Heading</TableCellTitle>
              <TableCellTitle tone="muted">Heading</TableCellTitle>
              <TableCellIcon tone="soft" />
              <TableCellSort direction="up" />
            </TableCell>
          )
        }
      </Matrix>

      <Matrix title="Text-Cell-Primary" aligns={["left", "center"]}>
        {({ props }) => (
          <TableCell {...props} padding="loose">
            <TableCellIcon tone="primary" />
            <TableCellTitle tone="primary">Heading</TableCellTitle>
            <TableCellTitle tone="primary-soft">Heading</TableCellTitle>
            <TableCellIcon tone="primary" />
            <TableCellSort direction="down" />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Text-Line-Cell" aligns={["left", "center"]}>
        {({ props }) => (
          <TableCell {...props}>
            <TableCellIcon />
            <TableCellContent>
              <TableCellTitle>Heading</TableCellTitle>
              <TableCellDescription>Heading</TableCellDescription>
            </TableCellContent>
            <TableCellIcon />
            <TableCellSort />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Avatars-Group-Image-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <AvatarGroup size={size === "60" ? "32" : size === "48" ? "24" : "20"}>
              {[1, 2, 3, 4].map((n) => (
                <Avatar key={n} size={size === "60" ? "32" : size === "48" ? "24" : "20"}>
                  <AvatarImage src={`/images/avatars/avatar-${n}.png`} alt="" />
                  <AvatarFallback>MH</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Avatar-Image-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <Avatars size={size} />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Avatar-Text-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <Avatar size={avatarSize[size]}>
              <AvatarFallback>MH</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Payment-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellLogo src="/icons/brands/visa.png" alt="Visa" className="h-6 w-10 rounded-r6 outline outline-background-100 -outline-offset-1" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Country-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellLogo src="/icons/brands/maestro.png" alt="Flag" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Crypto-Cell">
        {({ props }) => (
          <TableCell {...props} padding="loose">
            <TableCellLogo src="/icons/brands/telegram.png" alt="Crypto" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Brand-Cell">
        {({ props }) => (
          <TableCell {...props} padding="loose">
            <TableCellLogo src="/icons/brands/pinterest.png" alt="Brand" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Social-Cell">
        {({ props }) => (
          <TableCell {...props} padding="loose">
            <TableCellLogo src="/icons/brands/facebook.png" alt="Facebook" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Image-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellImage src="/images/banners/banner-1.png" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Image-Button-Cell">
        {({ props }) => (
          <TableCell {...props} className="w-60 justify-between">
            <span className="flex items-center gap-3">
              <TableCellImage src="/images/banners/banner-1.png" />
              <Pair />
            </span>
            <Button variant="black-soft" size="icon-32" aria-label="Play">
              <ButtonIcon src="/icons/material-play-arrow-white.svg" />
            </Button>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Checkbox-Cell" aligns={["left", "center"]}>
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Checkbox size={boxSize[size]} defaultChecked aria-label="Select" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Radio-Cell" aligns={["left", "center"]}>
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" size={boxSize[size]} aria-label="Select" />
            </RadioGroup>
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Switcher-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Switch size={size === "32" ? "sm" : "default"} defaultChecked aria-label="Toggle" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Progress-Horizontal-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellProgress value={100} />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Progress-Circular-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <ProgressCircle value={75} size={circleSize[size]}>
              {size !== "32" && <ProgressArcValue />}
            </ProgressCircle>
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Chart-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellChart />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Logotype-Cell">
        {({ props }) => (
          <TableCell {...props}>
            <TableCellLogo src="/icons/brands/x-twitter.png" alt="Logotype" />
            <Pair />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Badges-Group-Cell">
        {({ props, size }) => (
          <TableCell {...props} className="gap-1">
            {(["blue", "green", "purple", "pink"] as const).map((c) => (
              <Badge key={c} variant="soft-border" color={c} size={badgeSize[size]}>
                Badge
              </Badge>
            ))}
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Badge-Sqaure-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Badge variant="base" size={size === "40" || size === "32" ? "square-20" : "square-24"}>
              1
            </Badge>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Badge-Icon-Feature-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Badge variant="solid" size={size === "32" ? "square-24" : "square-32"}>
              <ButtonIcon src="/icons/material-default-icon.svg" className="size-4" />
            </Badge>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Badge-Icon-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Badge variant="base" size={size === "40" || size === "32" ? "square-20" : "square-24"}>
              <ButtonIcon src="/icons/material-default-icon.svg" className="size-3" />
            </Badge>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Badge-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Badge variant="base" size={badgeSize[size]}>
              <ButtonIcon src="/icons/material-default-icon.svg" className="size-4" />
              Badge
              <BadgeDot />
            </Badge>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Input-Cell">
        {({ props, size }) => (
          <TableCell {...props} className="w-40">
            <Input size={inputSize[size]} placeholder="Add Text" aria-label="Text" />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Tab-Cell">
        {({ props, size }) => (
          <TableCell {...props} padding="loose">
            <Tabs defaultValue="a">
              <TabsList variant="pill" size={tabSize[size]}>
                <TabsTrigger value="a">Tab</TabsTrigger>
                <TabsTrigger value="b">Tab</TabsTrigger>
                <TabsTrigger value="c">Tab</TabsTrigger>
              </TabsList>
            </Tabs>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Count-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <Counter size={counterSize[size]} defaultValue={0} aria-label="Count" />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Icon-Cell">
        {({ props }) => (
          <TableCell {...props} padding="none" className="justify-center aspect-square h-auto">
            <TableCellIcon className="size-6" />
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Icons-Cell">
        {({ props }) => (
          <TableCell {...props} className="gap-3">
            {[1, 2, 3].map((n) => (
              <span key={n} className="flex items-center gap-2">
                <TableCellIcon className="size-4" />
                <TableCellTitle tone="default" className="text-10 leading-16">1</TableCellTitle>
              </span>
            ))}
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Group-Buttons-Cell">
        {({ props, size }) => (
          <TableCell {...props} className="gap-3">
            {[1, 2, 3].map((n) => (
              <Button key={n} variant="outline" size={buttonSize[size]}>
                <ButtonIcon src="/icons/material-default-icon.svg" />
                Button
                <ButtonCounter size="square-16" variant="base">1</ButtonCounter>
              </Button>
            ))}
          </TableCell>
        )}
      </Matrix>

      {(["primary", "primary-soft", "outline"] as const).map((variant) => (
        <React.Fragment key={variant}>
          {(["Hug", "Fill"] as const).map((type) => (
            <Matrix
              key={type}
              title={`Button-${variant === "primary" ? "Primary" : variant === "outline" ? "Secondary" : "Primary-Soft"}-Cell, Type = ${type}`}
            >
              {({ props, size }) => (
                <TableCell {...props} className={type === "Fill" ? "w-60" : undefined}>
                  <Button variant={variant} size={buttonSize[size]} className={type === "Fill" ? "flex-1" : undefined}>
                    <ButtonIcon src="/icons/material-default-icon.svg" />
                    Button
                    <ButtonCounter size="square-16" variant={variant === "primary" ? "white-soft" : "base"}>1</ButtonCounter>
                  </Button>
                </TableCell>
              )}
            </Matrix>
          ))}
        </React.Fragment>
      ))}

      <Matrix title="Button-Group-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <ButtonGroup size={buttonGroupSize[size]} shape="rounded">
              {[1, 2, 3].map((n) => (
                <Button key={n} variant="outline" size={buttonSize[size]} shape="rounded">
                  <ButtonIcon src="/icons/material-default-icon.svg" />
                  Button
                </Button>
              ))}
            </ButtonGroup>
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Buttons-Icon-Cell">
        {({ props, size }) => (
          <TableCell {...props} className="gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Button key={n} variant="outline" size={size === "40" || size === "32" ? "icon-24" : "icon-32"} aria-label="Action">
                <ButtonIcon src="/icons/material-default-icon.svg" />
              </Button>
            ))}
          </TableCell>
        )}
      </Matrix>

      <Matrix title="Button-Icon-Cell">
        {({ props, size }) => (
          <TableCell {...props}>
            <Button variant="outline" size={size === "40" || size === "32" ? "icon-24" : "icon-32"} aria-label="Action">
              <ButtonIcon src="/icons/material-default-icon.svg" />
            </Button>
          </TableCell>
        )}
      </Matrix>
    </main>
  )
}
