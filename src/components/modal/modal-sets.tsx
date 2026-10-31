import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxField, CheckboxFieldContent, CheckboxFieldTitle } from "@/components/ui/checkbox-field"
import {
  DialogModalActions,
  DialogModalBody,
  DialogModalClose,
  DialogModalDescription,
  DialogModalFooter,
  DialogModalHead,
  DialogModalHeading,
  DialogModalIcon,
  DialogModalTitle,
  DialogPanel,
} from "@/components/ui/dialog"
import { DoubleInput } from "@/components/ui/double-input"
import { Field, FieldDescription, FieldHeader, FieldLabel, FieldLabelIcon } from "@/components/ui/field"
import { FileUpload } from "@/components/ui/file-upload"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupJoin } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { PaymentCardBrand } from "@/components/ui/payment-card-brand"
import { RadioCard, RadioCardContent, RadioCardDescription, RadioCardTitle } from "@/components/ui/radio-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  SwitchCard,
  SwitchCardContent,
  SwitchCardDescription,
  SwitchCardIcon,
  SwitchCardMedia,
  SwitchCardTitle,
} from "@/components/ui/switch-card"

// Figma `❖ Modal` content sets (Type=Default): Head-Modal-Component + content + Footer-Modal-Component.

function ModalShell({
  title,
  about,
  children,
  footer,
  size = "md",
  align = "left",
}: {
  title: string
  about?: string
  children?: React.ReactNode
  footer: React.ReactNode
  size?: "sm" | "md" | "lg"
  align?: "left" | "center"
}) {
  return (
    <DialogPanel variant="modal" layout="modal" size={size} aria-label={title}>
      <DialogModalHead align={align}>
        <DialogModalIcon />
        <DialogModalHeading>
          <DialogModalTitle>{title}</DialogModalTitle>
          {about && <DialogModalDescription>{about}</DialogModalDescription>}
        </DialogModalHeading>
        <DialogModalClose />
      </DialogModalHead>
      {children && <DialogModalBody>{children}</DialogModalBody>}
      {footer}
    </DialogPanel>
  )
}

function SingleAction({ label }: { label: string }) {
  return (
    <DialogModalFooter layout="block">
      <DialogModalActions>
        <Button variant="dark" size="32">
          {label}
        </Button>
      </DialogModalActions>
    </DialogModalFooter>
  )
}

function CancelAndAction({ label }: { label: string }) {
  return (
    <DialogModalFooter layout="block">
      <DialogModalActions>
        <Button variant="outline" size="32">
          Cancel
        </Button>
        <Button variant="dark" size="32">
          {label}
        </Button>
      </DialogModalActions>
    </DialogModalFooter>
  )
}

function LabeledField({ label, children, id }: { label: string; children: React.ReactNode; id: string }) {
  return (
    <Field size="32" shape="rounded">
      <FieldHeader>
        <FieldLabel htmlFor={id}>
          {label}
          <FieldLabelIcon />
        </FieldLabel>
      </FieldHeader>
      {children}
    </Field>
  )
}

export function ModalPayment() {
  return (
    <ModalShell title="Payment Card Method" about="Fill in the fields for payment" footer={<SingleAction label="Pay Now" />}>
      <Field size="32" shape="rounded">
        <FieldHeader>
          <FieldLabel htmlFor="modal-card">
            Payment Card
            <FieldLabelIcon />
          </FieldLabel>
        </FieldHeader>
        <DoubleInput layout="joined" size="32" aria-label="Payment card">
          <InputGroup size="32" shape="rounded">
            <InputGroupInput id="modal-card" inputMode="numeric" placeholder="Card Number" />
            <InputGroupAddon align="inline-end">
              <PaymentCardBrand shape="rounded" size="32" />
            </InputGroupAddon>
          </InputGroup>
          <InputGroupJoin size="32" shape="rounded">
            {["00 / 00", "CSV", "Zip Code"].map((placeholder) => (
              <InputGroup key={placeholder}>
                <InputGroupInput aria-label={placeholder} inputMode="numeric" placeholder={placeholder} />
              </InputGroup>
            ))}
          </InputGroupJoin>
        </DoubleInput>
      </Field>
      <LabeledField id="modal-street" label="Street Address">
        <Input id="modal-street" size="32" placeholder="Street Address" />
      </LabeledField>
      <DoubleInput layout="horizontal" size="32">
        <LabeledField id="modal-number" label="Number">
          <Input id="modal-number" size="32" placeholder="Number" />
        </LabeledField>
        <LabeledField id="modal-zip" label="ZIP">
          <Input id="modal-zip" size="32" placeholder="ZIP" />
        </LabeledField>
      </DoubleInput>
      <LabeledField id="modal-state" label="State">
        <Input id="modal-state" size="32" placeholder="State / Province" />
      </LabeledField>
    </ModalShell>
  )
}

export function ModalForm() {
  return (
    <ModalShell title="Contact Details" about="Tell us how to reach you" footer={<CancelAndAction label="Save" />}>
      <LabeledField id="modal-name" label="Full Name">
        <Input id="modal-name" size="32" placeholder="Full Name" />
      </LabeledField>
      <LabeledField id="modal-email" label="Email">
        <Input id="modal-email" size="32" placeholder="Email" />
      </LabeledField>
      <LabeledField id="modal-phone" label="Phone">
        <Input id="modal-phone" size="32" placeholder="Phone" />
      </LabeledField>
    </ModalShell>
  )
}

const plans = [
  { value: "starter", title: "Starter Plan", about: "Best for learning how to Use" },
  { value: "basic", title: "Basic Site Plan", about: "$14 / mo billed yearly" },
  { value: "cms", title: "CMS Site Plan", about: "$24 / mo billed yearly" },
  { value: "business", title: "Business Site Plan", about: "$38 / mo billed yearly" },
]

export function ModalRadioList() {
  return (
    <ModalShell
      title="Select Plans"
      about="Our free Starter Site plan is great for trying. Purchase a paid Site plan to publish, host, and unlock additional features."
      footer={<SingleAction label="Pay Now" />}
    >
      <RadioGroup aria-label="Plans" defaultValue="starter" className="flex flex-col gap-3">
        {plans.map((plan) => (
          <RadioCard key={plan.value}>
            <RadioCardContent>
              <RadioCardTitle>{plan.title}</RadioCardTitle>
              <RadioCardDescription>{plan.about}</RadioCardDescription>
            </RadioCardContent>
            <RadioGroupItem value={plan.value} color="primary-dark" />
          </RadioCard>
        ))}
      </RadioGroup>
    </ModalShell>
  )
}

function SwitchRows({ rows }: { rows: { title: string; about: string; on?: boolean }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <SwitchCard key={row.title}>
          <SwitchCardMedia>
            <SwitchCardIcon />
          </SwitchCardMedia>
          <SwitchCardContent>
            <SwitchCardTitle>{row.title}</SwitchCardTitle>
            <SwitchCardDescription>{row.about}</SwitchCardDescription>
          </SwitchCardContent>
          <Switch color="primary-dark" defaultChecked={row.on} aria-label={row.title} />
        </SwitchCard>
      ))}
    </div>
  )
}

export function ModalSwitcherList() {
  return (
    <ModalShell
      title="Notifications"
      about="Choose what you want to be notified about"
      footer={<SingleAction label="Save Changes" />}
    >
      <SwitchRows
        rows={[
          { title: "Email", about: "Receive updates by email", on: true },
          { title: "Push", about: "Receive push notifications", on: true },
          { title: "SMS", about: "Receive text messages" },
          { title: "Weekly digest", about: "A summary every Monday" },
        ]}
      />
    </ModalShell>
  )
}

export function ModalSwitcherPayment() {
  return (
    <ModalShell title="Payment Methods" about="Choose how you want to pay" footer={<SingleAction label="Pay Now" />}>
      <SwitchRows
        rows={[
          { title: "Mastercard", about: "Ending in 4242", on: true },
          { title: "Visa", about: "Ending in 1881" },
          { title: "PayPal", about: "Connected account" },
          { title: "Apple Pay", about: "Wallet on this device" },
        ]}
      />
    </ModalShell>
  )
}

export function ModalSwitcherUsers() {
  const users = ["Alex Morgan", "Jamie Lee", "Sam Rivera", "Taylor Kim"]
  return (
    <ModalShell
      title="Team Access"
      about="Manage who can edit this project"
      footer={<SingleAction label="Save Changes" />}
    >
      <div className="flex flex-col gap-3">
        {users.map((user, index) => (
          <SwitchCard key={user}>
            <SwitchCardMedia>
              <Avatar size="32">
                <AvatarFallback>{user.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </SwitchCardMedia>
            <SwitchCardContent>
              <SwitchCardTitle>{user}</SwitchCardTitle>
              <SwitchCardDescription>Can edit</SwitchCardDescription>
            </SwitchCardContent>
            <Switch color="primary-dark" defaultChecked={index < 2} aria-label={user} />
          </SwitchCard>
        ))}
      </div>
    </ModalShell>
  )
}

export function ModalFiles() {
  return (
    <ModalShell
      title="Upload Files"
      about="Attach the documents you want to share"
      footer={<CancelAndAction label="Upload" />}
    >
      <FileUpload id="modal-files" kind="files" aria-label="Upload files" />
      <FileUpload id="modal-images" kind="images" accept="image/png,image/jpeg,image/gif" aria-label="Upload images" />
    </ModalShell>
  )
}

export function ModalTwoFactor() {
  return (
    <ModalShell
      title="Two-Factor Authentication"
      about="Enter the 6-digit code from your authenticator app"
      footer={
        <DialogModalFooter layout="block">
          <CheckboxField>
            <Checkbox color="primary-dark" />
            <CheckboxFieldContent>
              <CheckboxFieldTitle>Trust this device</CheckboxFieldTitle>
            </CheckboxFieldContent>
          </CheckboxField>
          <DialogModalActions>
            <Button variant="dark" size="32">
              Verify
            </Button>
          </DialogModalActions>
        </DialogModalFooter>
      }
    >
      <Field size="48" className="items-center">
        <InputOTP maxLength={6} size="40" aria-label="Verification code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>Didn&apos;t get a code? Resend</FieldDescription>
      </Field>
    </ModalShell>
  )
}

export function ModalPin() {
  return (
    <ModalShell title="Enter PIN" about="Type your 4-digit PIN" align="center" footer={<SingleAction label="Confirm" />}>
      <Field size="48" className="items-center">
        <InputOTP maxLength={4} size="48" aria-label="PIN">
          <InputOTPGroup>
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </ModalShell>
  )
}

/** No Calendar primitive yet: range select and summary only (see design/known-gaps.md). */
export function ModalDateRange() {
  return (
    <ModalShell title="Select Date Range" size="lg" footer={<SingleAction label="Apply" />}>
      <LabeledField id="modal-range" label="Range">
        <Input id="modal-range" size="32" defaultValue="Today" />
      </LabeledField>
      <DialogModalDescription className="text-center">
        Selected from 13 March to 15 February 2078
      </DialogModalDescription>
    </ModalShell>
  )
}

/** Player-Video has no primitive yet: content area omitted (see design/known-gaps.md). */
export function ModalWelcome() {
  return (
    <ModalShell
      title="First Step Welcome!"
      about="You can add people to your project send"
      align="center"
      footer={
        <DialogModalFooter layout="block">
          <CheckboxField>
            <Checkbox color="primary-dark" />
            <CheckboxFieldContent>
              <CheckboxFieldTitle>Don&apos;t ask again</CheckboxFieldTitle>
            </CheckboxFieldContent>
          </CheckboxField>
          <DialogModalActions>
            <Button variant="outline" size="32">
              Close
            </Button>
            <Button variant="dark" size="32">
              Pay Now
            </Button>
          </DialogModalActions>
        </DialogModalFooter>
      }
    />
  )
}
