import * as React from "react"

import { Activation } from "@/components/auth/activation"
import { CheckEmail } from "@/components/auth/check-email"
import { ForgotPassword } from "@/components/auth/forgot-password"
import { NewPassword } from "@/components/auth/new-password"
import { PasswordResetDone } from "@/components/auth/password-reset-done"
import { SignIn01 } from "@/components/auth/sign-in-01"
import { SignIn02 } from "@/components/auth/sign-in-02"
import { SignUp01 } from "@/components/auth/sign-up-01"
import { SignUp02 } from "@/components/auth/sign-up-02"
import { TwoFactorAuthentication } from "@/components/auth/two-factor-authentication"

// Mirrors the Figma Auth templates page (7058:304041): ten templates, one variant each (Type=Default).
// Deterministic 21x21 placeholder code (Figma ships no QR image).
const N = 21
function cell(x: number, y: number) {
  const finder = (fx: number, fy: number) => {
    const dx = x - fx
    const dy = y - fy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
    return edge || core
  }
  for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) {
    const f = finder(fx, fy)
    if (f !== null) return f
  }
  if ((x === 7 || y === 7 || x === N - 8 || y === N - 8) && (x < 8 || y < 8)) return false
  return (x * 7 + y * 13 + x * y) % 3 === 0
}

function PlaceholderCode() {
  const rects: React.ReactNode[] = []
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (cell(x, y)) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
  return (
    <svg viewBox={`0 0 ${N} ${N}`} className="fill-base-900" shapeRendering="crispEdges" role="img" aria-label="QR code">
      {rects}
    </svg>
  )
}

function Frame({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{name}</h2>
      <div className="flex w-fit rounded-r16 bg-background-0 p-10 outline outline-background-100 -outline-offset-1">{children}</div>
    </section>
  )
}

export default function AuthTemplatesPreviewPage() {
  return (
    <main className="flex flex-col gap-12 bg-background-10 p-10">
      <h1 className="text-24 font-bold text-base-900">Auth templates</h1>
      <div className="flex flex-wrap items-start gap-10">
        <Frame name="Sign-In-01">
          <SignIn01 />
        </Frame>
        <Frame name="Sign-In-02">
          <SignIn02 />
        </Frame>
        <Frame name="Sign-Up-01">
          <SignUp01 />
        </Frame>
        <Frame name="Sign-Up-02">
          <SignUp02 />
        </Frame>
        <Frame name="Forgot-Password">
          <ForgotPassword />
        </Frame>
        <Frame name="New-Password">
          <NewPassword />
        </Frame>
        <Frame name="Check-Email">
          <CheckEmail />
        </Frame>
        <Frame name="Password-Reset-Done">
          <PasswordResetDone />
        </Frame>
        <Frame name="Two-Factor-Authentication">
          <TwoFactorAuthentication qr={<PlaceholderCode />} pinActive />
        </Frame>
        <Frame name="Activation">
          <Activation pinActive />
        </Frame>
      </div>
    </main>
  )
}
