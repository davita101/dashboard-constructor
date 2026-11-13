"use client"

import * as React from "react"

import { Button, ButtonIcon } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemLeft,
  DropdownMenuItemTitle,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MenuItem = { label: string; onSelect?: () => void }

/**
 * Card head "more" menu (Icon-Cell 60). Items with `onSelect` run it (e.g. open a dialog rendered next to the
 * menu); items without one are not built yet and show the "Coming soon" toast.
 */
function ProjectCardMenu({ label, items }: { label: string; items: MenuItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="muted" size="icon-60" shape="rounded" aria-label={label}>
            <ButtonIcon src="/icons/material-more-horiz.svg" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.label} onClick={item.onSelect} {...(item.onSelect ? {} : { "data-soon": "" })}>
              <DropdownMenuItemLeft>
                <DropdownMenuItemTitle>{item.label}</DropdownMenuItemTitle>
              </DropdownMenuItemLeft>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProjectCardMenu, type MenuItem }
