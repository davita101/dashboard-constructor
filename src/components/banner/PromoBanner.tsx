"use client"

import Image from "next/image"
import { useState } from "react"

import {
  Banner,
  BannerClose,
  BannerDescription,
  BannerHeader,
  BannerMedia,
  BannerTitle,
} from "@/components/ui/banner"

type PromoBannerProps = {
  title: React.ReactNode
  description?: React.ReactNode
  image?: { src: string; alt: string }
  dismissible?: boolean
  onClose?: () => void
  className?: string
}

export function PromoBanner({
  title,
  description,
  image,
  dismissible = true,
  onClose,
  className,
}: PromoBannerProps) {
  const [open, setOpen] = useState(true)
  if (!open) return null

  const close = () => {
    setOpen(false)
    onClose?.()
  }

  return (
    <Banner className={className}>
      <BannerHeader>
        <BannerTitle>{title}</BannerTitle>
        {description && <BannerDescription>{description}</BannerDescription>}
      </BannerHeader>
      {image && (
        <BannerMedia>
          <Image src={image.src} alt={image.alt} width={240} height={160} />
        </BannerMedia>
      )}
      {dismissible && <BannerClose onClick={close} />}
    </Banner>
  )
}
