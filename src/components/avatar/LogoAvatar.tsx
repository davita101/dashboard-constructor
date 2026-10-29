import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type LogoAvatarProps = {
  size?: "128" | "96" | "80" | "60" | "40"
  shape?: "rounded" | "circle"
  src: string
  alt: string
  /** "wordmark" = Figma Avatar-Logo, "icon" = Figma Brand-Logo. */
  kind?: "wordmark" | "icon"
  /** Shown while the logo loads or if it fails. */
  fallback?: string
  className?: string
}

export function LogoAvatar({
  size = "80",
  shape = "rounded",
  src,
  alt,
  kind = "wordmark",
  fallback,
  className,
}: LogoAvatarProps) {
  return (
    <Avatar size={size} shape={shape} frame={kind === "icon" ? "brand" : "logo"} className={className}>
      <AvatarImage src={src} alt={alt} />
      {fallback && <AvatarFallback variant="dark">{fallback}</AvatarFallback>}
    </Avatar>
  )
}
