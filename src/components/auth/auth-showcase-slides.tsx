import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge, BadgeDot } from "@/components/ui/badge"
import { LogoAvatar } from "@/components/avatar/LogoAvatar"
import { ProfileAvatar } from "@/components/avatar/ProfileAvatar"
import { TaskList } from "@/components/task/task-list"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  CalendarEvent,
  CalendarEventTime,
  CalendarEventTimes,
  CalendarEventTitle,
} from "@/components/ui/calendar-event"
import { EventCalendarDayHead, EventCalendarDayNumber, EventCalendarWeekday } from "@/components/ui/event-calendar"
import { FileUpload } from "@/components/ui/file-upload"
import {
  FileUploadItem,
  FileUploadItemActions,
  FileUploadItemBadge,
  FileUploadItemContent,
  FileUploadItemDescription,
  FileUploadItemMedia,
  FileUploadItemName,
  FileUploadItemRemove,
  FileUploadItemStatusIcon,
} from "@/components/ui/file-upload-item"
import {
  Notification,
  NotificationClose,
  NotificationContent,
  NotificationIcon,
  NotificationImage,
  NotificationMeta,
  NotificationText,
  NotificationTitle,
} from "@/components/ui/notification"
import {
  ProfileCard,
  ProfileCardActions,
  ProfileCardAvatar,
  ProfileCardBanner,
  ProfileCardBio,
  ProfileCardContent,
  ProfileCardHead,
  ProfileCardName,
  ProfileCardSubtitle,
  ProfileCardTitle,
} from "@/components/ui/profile-card"
import { Progress, ProgressValue } from "@/components/ui/progress"
import { ProgressCircle } from "@/components/ui/progress-circle"

// Slides 2-6 of the sign-in showcase. Each block fills the slide 1 box: 524px wide and about 352px
// tall at lg, 280px wide at 360, with the same 12px gap between items.

const TASKS = ["Header Page Update", "Checkout Flow Review", "Product Page Redesign"]
const PHOTOS = ["/images/avatars/avatar-1.png", "/images/avatars/avatar-2.png", "/images/avatars/avatar-3.png", "/images/avatars/avatar-4.png"]

function TeamFaces({ size }: { size: "32" | "24" }) {
  return (
    <AvatarGroup size={size}>
      {PHOTOS.map((src) => (
        <Avatar key={src} size={size}>
          <AvatarImage src={src} alt="" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+8</AvatarGroupCount>
    </AvatarGroup>
  )
}

function TasksSlide() {
  return (
    <div className="flex w-full flex-col gap-3 **:data-[slot=task]:w-full lg:**:data-[slot=task]:flex-row lg:**:data-[slot=task]:justify-between">
      <div className="flex items-center gap-3 rounded-r20 bg-background-0 p-3 font-default text-base-800">
        <ProgressCircle size="48" value={64} color="blue" aria-label="Sprint progress 64%" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-14 leading-24 font-bold">Sprint progress</span>
          <span className="text-12 leading-20 font-semibold text-base-500">16 of 25 tasks done</span>
        </div>
        <TeamFaces size="32" />
      </div>
      {TASKS.map((title) => (
        <TaskList key={title} title={title} />
      ))}
    </div>
  )
}

const NOTIFICATIONS = [
  { title: "New comment on Header Page", meta: "2 minutes ago", icon: "/icons/material-mail-outline.svg", src: "/images/avatars/avatar-1.png" },
  { title: "Order 4821 shipped", meta: "1 hour ago", icon: "/icons/material-notifications.svg", src: "/images/avatars/avatar-2.png" },
  { title: "Invoice paid", meta: "Yesterday", icon: "/icons/material-done.svg", src: "/images/avatars/avatar-3.png" },
  { title: "All tasks completed", meta: "2 days ago", icon: "/icons/material-done-all.svg", src: "/images/avatars/avatar-4.png" },
  { title: "Welcome to the team", meta: "3 days ago", icon: "/icons/material-notifications.svg", src: "/images/avatars/avatar-5.png" },
  { title: "Password updated", meta: "Last week", icon: "/icons/material-done.svg", src: "/images/avatars/avatar-6.png" },
  { title: "New follower", meta: "Last week", icon: "/icons/material-mail-outline.svg", src: "/images/avatars/avatar-1.png" },
]

function NotificationsSlide() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <Badge variant="white" size="32">
          <BadgeDot />
          {NOTIFICATIONS.length} new
        </Badge>
        <Button variant="white" size="32" shape="pill">
          <ButtonIcon src="/icons/material-done-all.svg" />
          Mark all read
        </Button>
      </div>
      {NOTIFICATIONS.map(({ title, meta, icon, src }, i) => (
        <Notification key={title} layout="inline" className={i > 2 ? "w-full lg:hidden" : "w-full"}>
          <NotificationImage src={src} />
          <NotificationContent className="items-center justify-between py-2 pr-4 pl-2">
            <div className="flex min-w-0 items-center gap-3">
              <NotificationIcon icon={icon} />
              <NotificationText>
                <NotificationTitle>{title}</NotificationTitle>
                <NotificationMeta>{meta}</NotificationMeta>
              </NotificationText>
            </div>
            <NotificationClose />
          </NotificationContent>
        </Notification>
      ))}
      <Button variant="white" size="32" shape="pill" className="w-full">
        View all notifications
      </Button>
    </div>
  )
}

type Event = {
  extra?: boolean
  type: "full" | "compact"
  color: React.ComponentProps<typeof CalendarEvent>["color"]
  title: string
  start: string
  end?: string
}

const days: { weekday: string; date: number; today?: boolean; events: Event[] }[] = [
  {
    weekday: "Mon",
    date: 12,
    events: [
      { type: "full", color: "primary", title: "Design Review", start: "09:00", end: "10:00" },
      { type: "compact", color: "sky", title: "Gym", start: "11:00" },
      { type: "full", color: "green", title: "Team Sync", start: "13:00", end: "14:00" },
      { type: "compact", color: "pink", title: "Retro", start: "16:00" },
      { extra: true, type: "full", color: "orange", title: "Budget Talk", start: "17:00", end: "18:00" },
      { extra: true, type: "full", color: "sky", title: "Planning", start: "18:00", end: "19:00" },
      { extra: true, type: "compact", color: "purple", title: "Call", start: "19:00" },
    ],
  },
  {
    weekday: "Tue",
    date: 13,
    today: true,
    events: [
      { type: "compact", color: "purple", title: "Demo", start: "08:00" },
      { type: "full", color: "orange", title: "Launch Prep", start: "10:00", end: "11:30" },
      { type: "full", color: "primary", title: "Client Call", start: "13:00", end: "14:00" },
      { type: "compact", color: "green", title: "Lunch", start: "15:00" },
      { extra: true, type: "full", color: "pink", title: "Standup", start: "16:00", end: "16:30" },
      { extra: true, type: "full", color: "sky", title: "1:1 Chat", start: "17:00", end: "18:00" },
      { extra: true, type: "compact", color: "primary", title: "Wrap", start: "18:00" },
    ],
  },
  {
    weekday: "Wed",
    date: 14,
    events: [
      { type: "full", color: "pink", title: "Sprint Plan", start: "09:30", end: "10:30" },
      { type: "compact", color: "orange", title: "Coffee", start: "11:00" },
      { type: "compact", color: "primary", title: "Review", start: "13:00" },
      { type: "full", color: "purple", title: "Workshop", start: "15:00", end: "16:30" },
      { extra: true, type: "full", color: "green", title: "Design QA", start: "17:00", end: "18:00" },
      { extra: true, type: "full", color: "orange", title: "Release", start: "18:00", end: "19:00" },
      { extra: true, type: "compact", color: "pink", title: "Party", start: "19:00" },
    ],
  },
]

function WeekSlide() {
  return (
    <div className="flex w-full flex-col gap-3 rounded-r20 bg-background-0 p-3 lg:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-32" shape="pill" aria-label="Previous week">
            <ButtonIcon src="/icons/material-chevron-left.svg" />
          </Button>
          <Button variant="outline" size="icon-32" shape="pill" aria-label="Next week">
            <ButtonIcon src="/icons/material-chevron-right.svg" />
          </Button>
        </div>
        <Button variant="dark" size="32" shape="pill">
          <ButtonIcon src="/icons/material-add-circle.svg" />
          New event
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2 lg:gap-6">
      {days.map((day) => (
        <div key={day.weekday} className="flex min-w-0 flex-col gap-3">
          <EventCalendarDayHead today={day.today}>
            <EventCalendarWeekday>{day.weekday}</EventCalendarWeekday>
            <EventCalendarDayNumber>{day.date}</EventCalendarDayNumber>
          </EventCalendarDayHead>
          {day.events.map((event) =>
            event.type === "full" ? (
              <CalendarEvent key={event.title} type="full" size="small" color={event.color} className={cn("h-24 lg:h-16", event.extra && "lg:hidden")}>
                <CalendarEventTitle>{event.title}</CalendarEventTitle>
                <CalendarEventTimes>
                  <CalendarEventTime>{event.start}</CalendarEventTime>
                  <CalendarEventTime>{event.end}</CalendarEventTime>
                </CalendarEventTimes>
              </CalendarEvent>
            ) : (
              <CalendarEvent key={event.title} type="compact" size="small" color={event.color} className={event.extra ? "lg:hidden" : undefined}>
                <CalendarEventTime>{event.start}</CalendarEventTime>
                <CalendarEventTitle>{event.title}</CalendarEventTitle>
              </CalendarEvent>
            )
          )}
        </div>
      ))}
      </div>
    </div>
  )
}

function FileRow({ name, status, size }: { name: string; status: "done" | "progress"; size?: string }) {
  return (
    <FileUploadItem status={status}>
      <FileUploadItemMedia>
        <FileUploadItemBadge />
        <FileUploadItemContent>
          <FileUploadItemName>{name}</FileUploadItemName>
          {status === "done" ? (
            <FileUploadItemDescription>{size}</FileUploadItemDescription>
          ) : (
            <Progress value={64} size="small" aria-label={`${name} upload`}>
              <ProgressValue size="default" />
            </Progress>
          )}
        </FileUploadItemContent>
      </FileUploadItemMedia>
      <FileUploadItemActions>
        {status === "done" && <FileUploadItemStatusIcon />}
        <FileUploadItemRemove />
      </FileUploadItemActions>
    </FileUploadItem>
  )
}

// Showcase only: nothing here uploads. The inner `inert` block takes the area and its buttons out of the tab
// order, the accessibility tree and hit testing; the outer handlers stop a dropped file from navigating the
// browser to it.
function FilesSlide() {
  const ignore = (event: React.DragEvent) => event.preventDefault()
  return (
    <div onDragOver={ignore} onDrop={ignore} className="w-full">
    <div inert className="flex w-full flex-col gap-3 select-none">
      <FileUpload kind="files" className="h-50 lg:h-30" />
      <div className="flex h-10 items-center gap-3 rounded-full bg-background-0 px-4 font-default text-12 leading-20 font-bold text-base-800">
        <span className="shrink-0">Total upload</span>
        <Progress value={64} aria-label="Total upload">
          <ProgressValue />
        </Progress>
      </div>
      <FileRow name="Brand-Guidelines.pdf" status="done" size="5.6mb of 5.6mb" />
      <FileRow name="Product-Photos.zip" status="progress" />
      <FileRow name="Q4-Report.xlsx" status="done" size="2.1mb of 2.1mb" />
      <div className="contents lg:hidden">
        <FileRow name="Logo-Pack.svg" status="done" size="0.8mb of 0.8mb" />
        <FileRow name="Banner-Draft.png" status="progress" />
        <FileRow name="Invoice-0421.pdf" status="done" size="0.3mb of 0.3mb" />
        <FileRow name="Press-Kit.zip" status="done" size="9.4mb of 9.4mb" />
      </div>
    </div>
    </div>
  )
}

function TeamCard({ kind }: { kind: "user" | "company" }) {
  const user = kind === "user"
  return (
    <ProfileCard layout="image" className="w-full min-w-0 rounded-r20 bg-background-0 p-3">
      <ProfileCardHead>
        <ProfileCardBanner src="/images/banners/banner-1.png" />
        <ProfileCardAvatar>
          {user ? (
            <ProfileAvatar size="60" shape="circle" src="/images/avatars/avatar-1.png" alt="Jogn Trees" verified="primary" />
          ) : (
            <LogoAvatar size="60" shape="circle" src="/images/avatars/logo-adobe.png" alt="Miro" />
          )}
        </ProfileCardAvatar>
      </ProfileCardHead>
      <ProfileCardContent>
        <ProfileCardName>
          <ProfileCardTitle>{user ? "Jogn Trees" : "Miro Realtime Board"}</ProfileCardTitle>
          <ProfileCardSubtitle>{user ? "@jogntrees" : "Software as a service"}</ProfileCardSubtitle>
        </ProfileCardName>
        <ProfileCardBio className="w-full">
          {user ? "Designer, Webflow fanatic and front-end enthusiast." : "Online whiteboard for visual collaboration across teams."}
        </ProfileCardBio>
        <ProfileCardActions>
          <Button variant="dark" size="32" shape="pill">
            <ButtonIcon src="/icons/material-add-circle.svg" />
            {user ? "Follow" : "Add"}
          </Button>
        </ProfileCardActions>
      </ProfileCardContent>
    </ProfileCard>
  )
}

function TeamSlide() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6">
        <TeamCard kind="user" />
        <TeamCard kind="company" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <TeamFaces size="32" />
        <Badge variant="white" size="32">
          <BadgeDot />
          12 members
        </Badge>
        <Button variant="white" size="32" shape="pill">
          <ButtonIcon src="/icons/material-add-circle.svg" />
          Invite
        </Button>
      </div>
    </div>
  )
}

export { FilesSlide, NotificationsSlide, TasksSlide, TeamSlide, WeekSlide }
