import { LogoAvatar } from "@/components/avatar/LogoAvatar"
import { ProfileAvatar } from "@/components/avatar/ProfileAvatar"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  type AvatarFallbackVariant,
  type AvatarSize,
} from "@/components/ui/avatar"
import { VerifyIcon, type VerifyIconColor } from "@/components/ui/verify-icon"

// Mirrors the Figma Avatars page (4313:42252).

const sizes = ["60", "48", "40", "32", "24", "20", "16", "12"] as const satisfies AvatarSize[]
const styles: AvatarFallbackVariant[] = [
  "primary-soft", "primary", "green-soft", "green", "orange-soft", "orange", "purple-soft", "purple",
  "red-soft", "red", "yellow-soft", "yellow", "sky-soft", "sky", "pink-soft", "pink",
  "amber-soft", "amber", "teal-soft", "teal", "dark",
]
const photos = [1, 2, 3, 4, 5, 6].map((n) => `/images/avatars/avatar-${n}.png`)
const verifyColors: VerifyIconColor[] = [
  "primary", "orange", "purple", "red", "yellow", "green", "sky", "pink", "amber", "teal", "blue",
  "indigo", "violet", "fuchsia", "rose", "emerald", "cyan", "lime", "black", "base-500", "base-700", "base-900",
]
const tileSizes = ["128", "96", "80", "60", "40"] as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function AvatarPreviewPage() {
  return (
    <main className="flex flex-1 flex-col gap-16 bg-background-10 px-4 py-20 md:px-20">
      <Section title="Avatar-Text">
        <div className="flex flex-col gap-4 overflow-x-auto">
          {styles.map((style) => (
            <div key={style} className="flex items-center gap-4">
              {sizes.flatMap((size) =>
                (["circle", "rounded"] as const).map((shape) => (
                  <Avatar key={`${size}-${shape}`} size={size} shape={shape}>
                    <AvatarFallback variant={style}>M</AvatarFallback>
                  </Avatar>
                ))
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Avatar-Image">
        <div className="flex flex-col gap-4 overflow-x-auto">
          {[...photos, "/images/avatars/no-avatar.png", "/images/avatars/no-avatar-dark.png"].map((src) => (
            <div key={src} className="flex items-center gap-4">
              {sizes.flatMap((size) =>
                (["circle", "rounded"] as const).map((shape) => (
                  <Avatar key={`${size}-${shape}`} size={size} shape={shape}>
                    <AvatarImage src={src} alt="" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                ))
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Status and Story">
        <div className="flex items-center gap-6">
          {sizes.map((size) => (
            <Avatar key={size} size={size} story>
              <AvatarImage src={photos[0]} alt="" />
              <AvatarFallback>M</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          ))}
        </div>
      </Section>

      <Section title="Avatar-Group">
        <div className="flex flex-col gap-10">
          {sizes.map((size) => (
            <AvatarGroup key={size} size={size}>
              {photos.map((src) => (
                <Avatar key={src} size={size}>
                  <AvatarImage src={src} alt="" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
              ))}
              <AvatarGroupCount>+2</AvatarGroupCount>
            </AvatarGroup>
          ))}
        </div>
      </Section>

      <Section title="Avatar-Logo, Profile, Brand-Logo">
        {(["rounded", "circle"] as const).map((shape) => (
          <div key={shape} className="flex flex-wrap items-center gap-8">
            {tileSizes.map((size) => (
              <LogoAvatar key={`logo-${size}`} size={size} shape={shape} src="/images/avatars/logo-adobe.png" alt="Adobe" />
            ))}
            {tileSizes.map((size) => (
              <ProfileAvatar
                key={`profile-${size}`}
                size={size}
                shape={shape}
                src="/images/avatars/profile.png"
                alt="Profile photo"
                verified="primary"
              />
            ))}
            {tileSizes.map((size) => (
              <LogoAvatar
                key={`brand-${size}`}
                size={size}
                shape={shape}
                kind="icon"
                src="/images/avatars/brand-product-hunt.png"
                alt="Product Hunt"
              />
            ))}
          </div>
        ))}
      </Section>

      <Section title="Verify-Icon">
        <div className="flex flex-wrap gap-4">
          {verifyColors.map((color) => (
            <VerifyIcon key={color} color={color} />
          ))}
        </div>
      </Section>
    </main>
  )
}
