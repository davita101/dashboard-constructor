import {
  MailInput,
  MailInputAction,
  MailInputActions,
  MailInputBody,
  MailInputCard,
  MailInputCardHead,
  MailInputFooter,
  MailInputHead,
  MailInputReply,
  MailInputSend,
  MailInputSender,
  MailInputToolbar,
} from "@/components/ui/mail-input"

const actions = [
  { icon: "/icons/material-format-color-text.svg", label: "Text color" },
  { icon: "/icons/material-attachment.svg", label: "Attach file" },
  { icon: "/icons/material-link.svg", label: "Insert link" },
  { icon: "/icons/material-mood.svg", label: "Emoji" },
  { icon: "/icons/material-image.svg", label: "Insert photo" },
  { icon: "/icons/material-more-vert.svg", label: "More" },
]

/** Composed mail input. `autoFocus` shows the Figma Active state. */
export function MailInputDemo({ autoFocus }: { autoFocus?: boolean }) {
  return (
    <MailInput>
      <MailInputHead>
        <MailInputSender name="John Smith" src="/images/avatars/avatar-1.png" />
        <MailInputReply>Replay</MailInputReply>
      </MailInputHead>
      <MailInputCard>
        <MailInputCardHead>
          <span>noreply@gumroad.com</span>
          <MailInputAction icon="/icons/material-zoom-out-map.svg" label="Expand" />
        </MailInputCardHead>
        <MailInputBody aria-label="Mail body" placeholder="Type your Mail" autoFocus={autoFocus} />
        <MailInputFooter>
          <MailInputToolbar>
            <MailInputActions>
              {actions.map((a) => (
                <MailInputAction key={a.label} {...a} />
              ))}
            </MailInputActions>
            <MailInputAction icon="/icons/material-delete.svg" label="Delete" />
          </MailInputToolbar>
          <MailInputSend>Send</MailInputSend>
        </MailInputFooter>
      </MailInputCard>
    </MailInput>
  )
}
