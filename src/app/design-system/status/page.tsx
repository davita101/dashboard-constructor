import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Status, type StatusBorder, type StatusColor, type StatusType } from "@/components/ui/status"

// Mirrors the Figma Status page (9463:285753), component set 459:14.

const colors = [
  { color: "primary", label: "Primary" },
  { color: "online", label: "Online" },
  { color: "offline", label: "Offline" },
  { color: "work", label: "Work" },
  { color: "busy", label: "Busy" },
  { color: "orange", label: "Orange" },
  { color: "purple", label: "Purple" },
  { color: "yellow", label: "Yellow" },
  { color: "green", label: "Green" },
  { color: "sky", label: "Sky" },
  { color: "pink", label: "Pink" },
  { color: "red", label: "Red" },
  { color: "gray", label: "Gray" },
] as const satisfies { color: StatusColor; label: string }[]

const columns = [
  { type: "center", border: "0" },
  { type: "center", border: "1" },
  { type: "center", border: "2" },
  { type: "center", border: "3" },
  { type: "border", border: "1" },
  { type: "border", border: "2" },
  { type: "border", border: "3" },
] as const satisfies { type: StatusType; border: StatusBorder }[]

const typeLabel: Record<StatusType, string> = { center: "Center", border: "Border" }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="font-default text-11 leading-20 font-semibold text-base-500">{children}</span>
}

export default function StatusPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Status: Style × Type × Border">
        <div className="overflow-x-auto pb-2">
          <table className="border-separate border-spacing-x-6 border-spacing-y-3">
            <thead>
              <tr>
                <th />
                {columns.map(({ type, border }) => (
                  <th key={`${type}-${border}`} className="text-left">
                    <Caption>
                      {typeLabel[type]} {border}
                    </Caption>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colors.map(({ color, label }) => (
                <tr key={color}>
                  <th className="text-left">
                    <Caption>{label}</Caption>
                  </th>
                  {columns.map(({ type, border }) => (
                    <td key={`${type}-${border}`} className="text-center">
                      <Status type={type} border={border} color={color} aria-label={`${label} status`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="On a white surface (Figma frame)">
        <div className="flex flex-wrap items-center gap-6 rounded-r16 bg-background-0 p-8">
          {colors.map(({ color }) =>
            columns.map(({ type, border }) => (
              <Status key={`${color}-${type}-${border}`} type={type} border={border} color={color} />
            ))
          )}
        </div>
      </Section>

      <Section title="In AvatarBadge">
        <div className="flex items-center gap-6">
          {(["online", "offline", "work", "busy"] as const).map((color) => (
            <div key={color} className="flex flex-col items-center gap-3">
              <Avatar size="48">
                <AvatarImage src="/images/avatars/avatar-1.png" alt="" />
                <AvatarFallback>M</AvatarFallback>
                <AvatarBadge color={color} aria-label={color} />
              </Avatar>
              <Caption>{color}</Caption>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
