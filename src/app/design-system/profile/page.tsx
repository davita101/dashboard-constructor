import Image from "next/image"

import { LogoAvatar } from "@/components/avatar/LogoAvatar"
import { ProfileAvatar } from "@/components/avatar/ProfileAvatar"
import { Button, ButtonIcon } from "@/components/ui/button"
import {
  ProfileCard,
  ProfileCardActions,
  ProfileCardAvatar,
  ProfileCardBanner,
  ProfileCardBio,
  ProfileCardContent,
  ProfileCardHead,
  ProfileCardHeader,
  ProfileCardList,
  ProfileCardListItem,
  ProfileCardName,
  ProfileCardSocial,
  ProfileCardSubtitle,
  ProfileCardTitle,
} from "@/components/ui/profile-card"

// Mirrors the Figma Profile page (11638:16498): Profile-User-Image, Profile-Company-Image, Profile-User, Profile-Company.

type Shape = "pill" | "rounded"
const shapes: Shape[] = ["pill", "rounded"]
const avatarShape = (s: Shape) => (s === "pill" ? "circle" : "rounded")

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-16 leading-24 font-bold text-base-800">{title}</h2>
      <div className="flex flex-wrap gap-10">{children}</div>
    </section>
  )
}

function SocialButton({ icon, label, shape, raster }: { icon: string; label: string; shape: Shape; raster?: boolean }) {
  return (
    <Button variant="outline" size="icon-32" shape={shape} aria-label={label} className="text-base-600">
      {raster ? <Image src={icon} alt="" width={16} height={16} className="size-4 grayscale" /> : <ButtonIcon src={icon} />}
    </Button>
  )
}

function Actions({ shape, primary, secondaryIcon }: { shape: Shape; primary: string; secondaryIcon: string }) {
  return (
    <ProfileCardActions>
      <Button variant="dark" size="32" shape={shape}>
        <ButtonIcon src="/icons/material-add-circle.svg" />
        {primary}
      </Button>
      <Button variant="ghost" size="32" shape={shape}>
        <ButtonIcon src={secondaryIcon} />
        Profile
      </Button>
    </ProfileCardActions>
  )
}

function UserImage({ shape }: { shape: Shape }) {
  return (
    <ProfileCard layout="image" shape={shape}>
      <ProfileCardHead>
        <ProfileCardBanner src="/images/banners/banner-1.png" />
        <ProfileCardAvatar>
          <ProfileAvatar size="60" shape={avatarShape(shape)} src="/images/avatars/avatar-1.png" alt="Jogn Trees" verified="primary" />
        </ProfileCardAvatar>
      </ProfileCardHead>
      <ProfileCardContent>
        <ProfileCardName>
          <ProfileCardTitle>Jogn Trees</ProfileCardTitle>
          <ProfileCardSubtitle>@jogntrees</ProfileCardSubtitle>
        </ProfileCardName>
        <ProfileCardBio>
          I am a Designer, Webflow fanatic, husband, father, and car guy with a passion for design and front-end development.
        </ProfileCardBio>
        <ProfileCardSocial>
          <SocialButton shape={shape} label="X" icon="/icons/brands/x-twitter.png" />
          <SocialButton shape={shape} label="Instagram" icon="/icons/material-instagram.svg" />
          <SocialButton shape={shape} label="Facebook" raster icon="/icons/brands/facebook.png" />
        </ProfileCardSocial>
        <Actions shape={shape} primary="Follow" secondaryIcon="/icons/material-person.svg" />
      </ProfileCardContent>
    </ProfileCard>
  )
}

function CompanyImage({ shape }: { shape: Shape }) {
  return (
    <ProfileCard layout="image" shape={shape}>
      <ProfileCardHead>
        <ProfileCardBanner src="/images/banners/banner-1.png" />
        <ProfileCardAvatar>
          <LogoAvatar size="60" shape={avatarShape(shape)} src="/images/avatars/logo-adobe.png" alt="Miro" />
        </ProfileCardAvatar>
      </ProfileCardHead>
      <ProfileCardContent>
        <ProfileCardName>
          <ProfileCardTitle>Miro Realtime Board</ProfileCardTitle>
          <ProfileCardSubtitle>Software as a service</ProfileCardSubtitle>
        </ProfileCardName>
        <ProfileCardBio>
          Miro, formerly known as RealtimeBoard, is a digital collaboration platform designed to facilitate remote.
        </ProfileCardBio>
        <ProfileCardSocial>
          <SocialButton shape={shape} label="Website" icon="/icons/material-language.svg" />
          <SocialButton shape={shape} label="Email" icon="/icons/material-mail-outline.svg" />
          <SocialButton shape={shape} label="Message" icon="/icons/material-chat-bubble.svg" />
        </ProfileCardSocial>
        <Actions shape={shape} primary="Add Company" secondaryIcon="/icons/material-work.svg" />
      </ProfileCardContent>
    </ProfileCard>
  )
}

function User({ shape }: { shape: Shape }) {
  return (
    <ProfileCard layout="list" shape={shape}>
      <ProfileAvatar size="60" shape={avatarShape(shape)} src="/images/avatars/avatar-1.png" alt="Jogn Trees" verified="primary" />
      <ProfileCardHeader>
        <ProfileCardSubtitle>@jogntrees</ProfileCardSubtitle>
        <ProfileCardTitle>Jogn Trees</ProfileCardTitle>
      </ProfileCardHeader>
      <ProfileCardList>
        <ProfileCardListItem icon="/icons/material-today.svg">Joined Apr 26, 2084</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-pin-drop.svg">Des Moines, US</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-supervisor-account.svg">166 Followers</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-share.svg">Visit Website</ProfileCardListItem>
      </ProfileCardList>
      <Actions shape={shape} primary="Follow" secondaryIcon="/icons/material-person.svg" />
    </ProfileCard>
  )
}

function Company({ shape }: { shape: Shape }) {
  return (
    <ProfileCard layout="list" shape={shape}>
      <LogoAvatar size="60" shape={avatarShape(shape)} src="/images/avatars/logo-adobe.png" alt="Miro" />
      <ProfileCardHeader>
        <ProfileCardSubtitle>Software as a service</ProfileCardSubtitle>
        <ProfileCardTitle>Miro Realtime Board</ProfileCardTitle>
      </ProfileCardHeader>
      <ProfileCardList>
        <ProfileCardListItem icon="/icons/material-today.svg">2011 Founded</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-pin-drop.svg">Des Moines, US</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-domain.svg">Private Type</ProfileCardListItem>
        <ProfileCardListItem icon="/icons/material-share.svg">Visit Website</ProfileCardListItem>
      </ProfileCardList>
      <Actions shape={shape} primary="Add" secondaryIcon="/icons/material-work.svg" />
    </ProfileCard>
  )
}

export default function ProfilePreviewPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-10 p-10 font-default">
      <Section title="Profile-User-Image">
        {shapes.map((s) => <UserImage key={s} shape={s} />)}
      </Section>
      <Section title="Profile-Company-Image">
        {shapes.map((s) => <CompanyImage key={s} shape={s} />)}
      </Section>
      <Section title="Profile-User">
        {shapes.map((s) => <User key={s} shape={s} />)}
      </Section>
      <Section title="Profile-Company">
        {shapes.map((s) => <Company key={s} shape={s} />)}
      </Section>
    </main>
  )
}
