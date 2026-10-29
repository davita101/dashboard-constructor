import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  CalendarEvent,
  CalendarEventDot,
  CalendarEventFooter,
  CalendarEventMeta,
  CalendarEventTime,
  CalendarEventTimes,
  CalendarEventTitle,
  type CalendarEventColor,
  type CalendarEventSize,
} from "@/components/ui/calendar-event"
import {
  EventCalendar,
  EventCalendarActions,
  EventCalendarDate,
  EventCalendarDay,
  EventCalendarDayEvents,
  EventCalendarDayHead,
  EventCalendarDayNumber,
  EventCalendarGrid,
  EventCalendarHeader,
  EventCalendarMore,
  EventCalendarSlot,
  EventCalendarSlotEvent,
  EventCalendarTimeLabel,
  EventCalendarTitle,
  EventCalendarWeekday,
} from "@/components/ui/event-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mirrors the Figma Calendar page (12256:118505): the component sets, then the
// Week and Month Calendar Blocks (sample data from the Figma blocks, January 2056).
// The Year block is built from mini month calendars that live on another Figma page.

const colors: CalendarEventColor[] = [
  "primary", "green", "orange", "sky", "purple", "pink", "red", "amber",
  "yellow", "teal", "rose", "lime", "indigo", "emerald", "violet",
]
const sizes: CalendarEventSize[] = ["small", "default"]
const photos = [1, 2, 3, 4, 5, 6].map((n) => `/images/avatars/avatar-${n}.png`)

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

function Attendees({ size }: { size: CalendarEventSize }) {
  const avatarSize = size === "small" ? "16" : "20"
  return (
    <CalendarEventFooter>
      <AvatarGroup size={avatarSize}>
        {photos.map((src, i) => (
          <Avatar key={src} size={avatarSize}>
            <AvatarImage src={src} alt="" />
            <AvatarFallback>{`A${i + 1}`}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </CalendarEventFooter>
  )
}

/* ---------- Week view ---------- */

type WeekEvent = { day: number; start: number; slots: number; color: CalendarEventColor; title: string; people?: boolean }

const week = [
  { weekday: "Mon", date: 12 },
  { weekday: "Tue", date: 13 },
  { weekday: "Wed", date: 14, today: true },
  { weekday: "Thu", date: 15 },
  { weekday: "Fri", date: 16 },
  { weekday: "Sat", date: 17 },
  { weekday: "Sun", date: 18 },
]
const firstHour = 11
const hours = 10
const slotCount = hours * 2

// `start` and `slots` count 30-min slots from 11:00
const weekEvents: WeekEvent[] = [
  { day: 0, start: 1, slots: 2, color: "primary", title: "Eco-Friendly Living Expo" },
  { day: 0, start: 5, slots: 6, color: "teal", title: "Sustainable Living Workshop", people: true },
  { day: 0, start: 12, slots: 2, color: "sky", title: "Charity Run for Hope" },
  { day: 1, start: 0, slots: 1, color: "primary", title: "Name Event Change To Something Longer" },
  { day: 1, start: 7, slots: 2, color: "primary", title: "Health and Wellness Summit" },
  { day: 1, start: 9, slots: 2, color: "orange", title: "Outdoor Movie Night" },
  { day: 1, start: 11, slots: 1, color: "green", title: "Tech Innovation Fair" },
  { day: 2, start: 4, slots: 2, color: "green", title: "Winter Wonderland Market" },
  { day: 2, start: 6, slots: 2, color: "pink", title: "Dance Marathon" },
  { day: 2, start: 14, slots: 5, color: "sky", title: "Science Fair Extravaganza", people: true },
  { day: 3, start: 0, slots: 6, color: "indigo", title: "Gastronomy Week" },
  { day: 3, start: 6, slots: 4, color: "red", title: "Fashion Forward Runway", people: true },
  { day: 3, start: 10, slots: 1, color: "indigo", title: "Fashion Forward Talks" },
  { day: 3, start: 11, slots: 1, color: "lime", title: "Family Fun Day" },
  { day: 3, start: 15, slots: 2, color: "red", title: "Vintage Car Show", people: true },
  { day: 4, start: 1, slots: 2, color: "primary", title: "Literary Gala Night" },
  { day: 4, start: 12, slots: 6, color: "green", title: "Family Fun Day", people: true },
  { day: 5, start: 0, slots: 1, color: "purple", title: "Culinary Delights" },
  { day: 5, start: 1, slots: 1, color: "red", title: "Music Under the Stars" },
  { day: 5, start: 2, slots: 1, color: "amber", title: "Art in the Park" },
  { day: 5, start: 10, slots: 4, color: "green", title: "Local Heroes Awards", people: true },
  { day: 5, start: 15, slots: 5, color: "sky", title: "Pet Adoption Day", people: true },
  { day: 6, start: 7, slots: 2, color: "primary", title: "Global Cultures Festival" },
  { day: 6, start: 9, slots: 2, color: "purple", title: "Craft Beer Festival" },
  { day: 6, start: 11, slots: 2, color: "pink", title: "Photography Showcase" },
]

function slotTime(slot: number) {
  const minutes = firstHour * 60 + slot * 30
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`
}

function WeekEventCard({ event }: { event: WeekEvent }) {
  const start = slotTime(event.start)
  const end = slotTime(event.start + event.slots)
  if (event.slots === 1) {
    return (
      <CalendarEvent type="compact" size="small" color={event.color} render={<button type="button" />}>
        <CalendarEventTime dateTime={start}>{start}</CalendarEventTime>
        <CalendarEventTitle>{event.title}</CalendarEventTitle>
      </CalendarEvent>
    )
  }
  return (
    <CalendarEvent type="full" size="small" color={event.color} render={<button type="button" />}>
      <CalendarEventTitle>{event.title}</CalendarEventTitle>
      {event.people && event.slots >= 3 && <Attendees size="small" />}
      <CalendarEventTimes>
        <CalendarEventTime dateTime={start}>{start}</CalendarEventTime>
        <CalendarEventTime dateTime={end}>{end}</CalendarEventTime>
      </CalendarEventTimes>
    </CalendarEvent>
  )
}

function WeekView({ days }: { days: number[] }) {
  return (
    <EventCalendarGrid
      view="week"
      className={days.length === 1 ? "grid-cols-[--spacing(10)_minmax(0,1fr)]" : undefined}
    >
      <EventCalendarTimeLabel style={{ gridColumn: 1, gridRow: 1 }} />
      {Array.from({ length: hours }, (_, h) => (
        <EventCalendarTimeLabel key={h} style={{ gridColumn: 1, gridRow: `${2 + h * 2} / span 2` }}>
          {`${firstHour + h}:00`}
        </EventCalendarTimeLabel>
      ))}
      {days.map((day, col) => (
        <EventCalendarDayHead key={`head-${day}`} today={week[day].today} style={{ gridColumn: col + 2, gridRow: 1 }}>
          <EventCalendarWeekday>{week[day].weekday}</EventCalendarWeekday>
          <EventCalendarDayNumber>{week[day].date}</EventCalendarDayNumber>
        </EventCalendarDayHead>
      ))}
      {days.map((day, col) =>
        Array.from({ length: slotCount }, (_, slot) => (
          <EventCalendarSlot key={`slot-${day}-${slot}`} style={{ gridColumn: col + 2, gridRow: slot + 2 }} />
        ))
      )}
      {weekEvents
        .filter((event) => days.includes(event.day))
        .map((event) => (
          <EventCalendarSlotEvent
            key={`${event.day}-${event.start}`}
            style={{ gridColumn: days.indexOf(event.day) + 2, gridRow: `${event.start + 2} / span ${event.slots}` }}
          >
            <WeekEventCard event={event} />
          </EventCalendarSlotEvent>
        ))}
    </EventCalendarGrid>
  )
}

/* ---------- Month view ---------- */

type MonthEvent = { title: string; time: string; color: CalendarEventColor }

const monthEvents: Record<string, MonthEvent[]> = {
  "0-2": [
    { title: "Dreams in the Sky", time: "10AM", color: "primary" },
    { title: "Wonders of the Wild", time: "11AM", color: "green" },
  ],
  "0-5": [
    { title: "Twilight Tunes Festival", time: "10AM", color: "primary" },
    { title: "Future Tech Showcase", time: "11AM", color: "green" },
    { title: "Creative Expressions in Art", time: "12AM", color: "orange" },
    { title: "Gourmet Food Festival", time: "1PM", color: "sky" },
    { title: "Jazz Night", time: "3PM", color: "purple" },
  ],
  "1-2": [{ title: "Festival of Colors", time: "10AM", color: "purple" }],
  "2-1": [
    { title: "Twilight Tunes Festival", time: "10AM", color: "primary" },
    { title: "Future Tech Showcase", time: "11AM", color: "green" },
    { title: "Creative Expressions in Art", time: "12AM", color: "orange" },
  ],
  "2-3": [{ title: "Festival of Lights", time: "10AM", color: "primary" }],
  "2-6": [{ title: "Harmony in the Hills", time: "10AM", color: "purple" }],
  "3-1": [{ title: "Alright, let's go!", time: "10AM", color: "primary" }],
  "3-2": [
    { title: "Twilight Tunes Festival", time: "10AM", color: "primary" },
    { title: "Future Tech Showcase", time: "11AM", color: "green" },
  ],
  "4-6": [{ title: "Rhythms of the River", time: "09:00", color: "primary" }],
}

// January 2056 starts on a Saturday; the Figma block shows Dec 30 – Feb 2
function monthCell(row: number, col: number) {
  const n = row * 7 + col - 1
  if (n < 1) return { date: 31 + n, month: "other" as const }
  if (n > 31) return { date: n - 31, month: "other" as const }
  return { date: n, month: "current" as const }
}

const maxVisible = 4

function MonthView() {
  return (
    <EventCalendarGrid view="month">
      {week.map((day) => (
        <EventCalendarDayHead key={day.weekday} today={day.today}>
          <EventCalendarWeekday>{day.weekday}</EventCalendarWeekday>
        </EventCalendarDayHead>
      ))}
      {Array.from({ length: 5 }, (_, row) =>
        week.map((_, col) => {
          const { date, month } = monthCell(row, col)
          const events = monthEvents[`${row}-${col}`] ?? []
          return (
            <EventCalendarDay key={`${row}-${col}`} month={month} today={month === "current" && date === 8}>
              <EventCalendarDate>{date}</EventCalendarDate>
              {events.length > 0 && (
                <EventCalendarDayEvents>
                  {events.slice(0, maxVisible).map((event) => (
                    <CalendarEvent key={event.title} type="text" size="small" color={event.color} render={<button type="button" />}>
                      <CalendarEventDot />
                      <CalendarEventTitle>{event.title}</CalendarEventTitle>
                      <CalendarEventMeta>{event.time}</CalendarEventMeta>
                    </CalendarEvent>
                  ))}
                  {events.length > maxVisible && (
                    <EventCalendarMore render={<button type="button" />}>More</EventCalendarMore>
                  )}
                </EventCalendarDayEvents>
              )}
            </EventCalendarDay>
          )
        })
      )}
    </EventCalendarGrid>
  )
}

/* ---------- Block ---------- */

function CalendarBlock() {
  return (
    <EventCalendar className="w-full max-w-desktop">
      <Tabs defaultValue="week" className="gap-0">
        <EventCalendarHeader>
          <EventCalendarTitle>January 2056</EventCalendarTitle>
          <TabsList variant="pill" className="w-full md:w-80 lg:w-100">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year" disabled>
              Year
            </TabsTrigger>
          </TabsList>
          <EventCalendarActions>
            <Button variant="outline" size="28">
              Today
            </Button>
            <Button variant="dark" size="28">
              Add Event
            </Button>
          </EventCalendarActions>
        </EventCalendarHeader>
        <TabsContent value="day">
          <WeekView days={[2]} />
        </TabsContent>
        <TabsContent value="week">
          <WeekView days={[0, 1, 2, 3, 4, 5, 6]} />
        </TabsContent>
        <TabsContent value="month">
          <MonthView />
        </TabsContent>
      </Tabs>
    </EventCalendar>
  )
}

/* ---------- Page ---------- */

export default function CalendarPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Week / Month Calendar Block (Day · Week · Month tabs)">
        <CalendarBlock />
      </Section>

      {sizes.map((size) => (
        <Section key={size} title={`Event-Calendar-Component: Size=${size === "small" ? "Small" : "Default"} (Full, Compact, Text)`}>
          <div className="flex flex-wrap gap-4">
            {colors.map((color) => (
              <div key={color} className="flex w-31 flex-col gap-2">
                <CalendarEvent type="full" size={size} color={color} className="h-20">
                  <CalendarEventTitle>Name Event</CalendarEventTitle>
                  <CalendarEventTimes>
                    <CalendarEventTime>09:00</CalendarEventTime>
                    <CalendarEventTime>10:00</CalendarEventTime>
                  </CalendarEventTimes>
                </CalendarEvent>
                <CalendarEvent type="compact" size={size} color={color}>
                  <CalendarEventTime>09:00</CalendarEventTime>
                  <CalendarEventTitle>Name Event</CalendarEventTitle>
                </CalendarEvent>
                <CalendarEvent type="text" size={size} color={color}>
                  <CalendarEventDot />
                  <CalendarEventTitle>Name Event</CalendarEventTitle>
                  <CalendarEventMeta>09:00</CalendarEventMeta>
                </CalendarEvent>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Full event with Footer (attendees, hidden by default in Figma)">
        <div className="flex flex-wrap gap-4">
          {sizes.map((size) => (
            <CalendarEvent key={size} type="full" size={size} color="teal" className="h-30 w-35">
              <CalendarEventTitle>Sustainable Living Workshop</CalendarEventTitle>
              <Attendees size={size} />
              <CalendarEventTimes>
                <CalendarEventTime>09:00</CalendarEventTime>
                <CalendarEventTime>12:00</CalendarEventTime>
              </CalendarEventTimes>
            </CalendarEvent>
          ))}
        </div>
      </Section>

      <Section title="Date-Calendar-Component: Date Head, Date Head Today, Time, Empty">
        <div className="flex flex-wrap items-start gap-8 bg-background-0 p-4">
          <EventCalendarDayHead className="w-37.5">
            <EventCalendarWeekday>Mon</EventCalendarWeekday>
            <EventCalendarDayNumber>12</EventCalendarDayNumber>
          </EventCalendarDayHead>
          <EventCalendarDayHead today className="w-37.5">
            <EventCalendarWeekday>Mon</EventCalendarWeekday>
            <EventCalendarDayNumber>12</EventCalendarDayNumber>
          </EventCalendarDayHead>
          <EventCalendarTimeLabel className="h-20 w-10">12:00</EventCalendarTimeLabel>
          <EventCalendarTimeLabel className="size-10" />
        </div>
      </Section>

      <Section title="Cell-Month-Calendar-Component: Empty, Today, Other Month × Empty / Event">
        <div className="grid grid-cols-3 bg-background-0 md:w-105">
          {(["current", "today", "other"] as const).map((kind) => (
            <EventCalendarDay key={`empty-${kind}`} month={kind === "other" ? "other" : "current"} today={kind === "today"} className="h-35">
              <EventCalendarDate>01</EventCalendarDate>
            </EventCalendarDay>
          ))}
          {(["current", "today", "other"] as const).map((kind) => (
            <EventCalendarDay key={`event-${kind}`} month={kind === "other" ? "other" : "current"} today={kind === "today"} className="h-35">
              <EventCalendarDate>01</EventCalendarDate>
              <EventCalendarDayEvents>
                {(["primary", "green", "orange", "sky"] as const).map((color, i) => (
                  <CalendarEvent key={color} type="text" size="small" color={color}>
                    <CalendarEventDot />
                    <CalendarEventTitle>Name Event</CalendarEventTitle>
                    <CalendarEventMeta>{`${10 + i}AM`}</CalendarEventMeta>
                  </CalendarEvent>
                ))}
                <EventCalendarMore>More</EventCalendarMore>
              </EventCalendarDayEvents>
            </EventCalendarDay>
          ))}
        </div>
      </Section>

      <Section title="Cell-Day-Week-Calendar-Component: Empty 30 min, Event 30 min → 3 hour">
        <div className="flex flex-wrap items-start gap-4">
          <EventCalendarSlot className="h-10 w-35 bg-background-0" />
          {[1, 2, 3, 4, 5, 6].map((slots) => (
            <EventCalendarSlotEvent key={slots} className="w-35 bg-background-0" style={{ height: `calc(var(--spacing) * ${slots * 10})` }}>
              {slots === 1 ? (
                <CalendarEvent type="compact" size="small">
                  <CalendarEventTime>09:00</CalendarEventTime>
                  <CalendarEventTitle>Name Event</CalendarEventTitle>
                </CalendarEvent>
              ) : (
                <CalendarEvent type="full" size="small">
                  <CalendarEventTitle>Name Event</CalendarEventTitle>
                  <CalendarEventTimes>
                    <CalendarEventTime>09:00</CalendarEventTime>
                    <CalendarEventTime>10:00</CalendarEventTime>
                  </CalendarEventTimes>
                </CalendarEvent>
              )}
            </EventCalendarSlotEvent>
          ))}
        </div>
      </Section>
    </main>
  )
}
