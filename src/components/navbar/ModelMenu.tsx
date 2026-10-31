import { Button, ButtonIcon } from "@/components/ui/button"
import {
  DropdownMenuItem,
  DropdownMenuItemDescription,
  DropdownMenuItemLeft,
  DropdownMenuItemRight,
  DropdownMenuItemText,
  DropdownMenuItemTitle,
  DropdownMenuPanel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Figma Menu-2-Dropdown-Rounded (Navigate-02): two double-line items split by a divider,
// the first with a "Try Free" outline button on the right.
export function ModelMenu({ className }: { className?: string }) {
  return (
    <DropdownMenuPanel shape="rounded" size="wide" className={className}>
      <DropdownMenuItem layout="double">
        <DropdownMenuItemLeft>
          <DropdownMenuItemText>
            <DropdownMenuItemTitle>AI Chat 1.6 Pro</DropdownMenuItemTitle>
            <DropdownMenuItemDescription>Upgrade your plan for more credits</DropdownMenuItemDescription>
          </DropdownMenuItemText>
        </DropdownMenuItemLeft>
        <DropdownMenuItemRight>
          <Button variant="outline" size="24" shape="pill">
            Try Free
          </Button>
        </DropdownMenuItemRight>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem layout="double">
        <DropdownMenuItemLeft>
          <DropdownMenuItemText>
            <DropdownMenuItemTitle>AI Chat 1.6 Lite</DropdownMenuItemTitle>
            <DropdownMenuItemDescription>A Lightweight agent for everyday tasks</DropdownMenuItemDescription>
          </DropdownMenuItemText>
        </DropdownMenuItemLeft>
      </DropdownMenuItem>
    </DropdownMenuPanel>
  )
}

export function ModelTrigger() {
  return (
    <Button variant="outline" size="32" shape="pill">
      Chat AI 1.5 Lite
      <ButtonIcon src="/icons/material-expand-more.svg" position="end" className="size-4" />
    </Button>
  )
}
