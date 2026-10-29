import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerifyIcon, type VerifyIconColor } from "@/components/ui/verify-icon"

// Figma Profile: framed photo + verify badge bottom-right (24px from 80 up, 20px at 60, 16px at 40)
const verifySize = { "128": "size-6", "96": "size-6", "80": "size-6", "60": "size-5", "40": "size-4" }

type ProfileAvatarProps = {
  size?: keyof typeof verifySize
  shape?: "rounded" | "circle"
  src: string
  alt: string
  initials?: string
  /** Verify badge color; omit to hide the badge. */
  verified?: VerifyIconColor
  className?: string
}

export function ProfileAvatar({
  size = "128",
  shape = "rounded",
  src,
  alt,
  initials,
  verified,
  className,
}: ProfileAvatarProps) {
  return (
    <Avatar size={size} shape={shape} frame="profile" className={className}>
      <AvatarImage src={src} alt={alt} />
      {initials && <AvatarFallback>{initials}</AvatarFallback>}
      {verified && <VerifyIcon color={verified} className={`absolute right-0 bottom-0 ${verifySize[size]}`} />}
    </Avatar>
  )
}
