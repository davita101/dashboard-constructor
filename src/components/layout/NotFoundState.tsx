"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

// 404 content: Figma Empty-States (Type=Default) with "Back Screen" and a way home.
export function NotFoundState({ className }: { className?: string }) {
  const t = useTranslations("notFound")
  const router = useRouter()

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <EmptyIcon src="/icons/material-search.svg" />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={() => router.back()}>
          {t("back")}
        </Button>
        <Button variant="dark" nativeButton={false} render={<Link href="/dashboard" />}>
          {t("home")}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
