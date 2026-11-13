"use server"

import { updateTag } from "next/cache"
import { z } from "zod"

import { getViewerId } from "@/lib/auth/viewer"
import { FORM_ERROR_MESSAGE, fieldMessage } from "@/lib/forms/field-message"
import * as m from "@/lib/chat/mutations"
import * as s from "@/lib/chat/schemas"
import { conversationTag, userChatTag } from "@/lib/chat/tags"
import type { ChatMessage, WriteResult } from "@/lib/chat/types"
import type { ActionState } from "@/lib/projects/action-state"

// Chat Server Actions: signed-in user (auth.protect) → Zod parse → mutation (access check + transaction) →
// updateTag for every affected user. Expected failures come back as an error state, never thrown.

type ChatActionState = ActionState & { conversationId?: string; sent?: ChatMessage }

function expire(r: WriteResult) {
  for (const id of r.userIds) updateTag(userChatTag(id))
  updateTag(conversationTag(r.conversationId))
}

async function run<S extends z.ZodType>(
  schema: S,
  raw: unknown,
  write: (userId: string, input: z.output<S>) => Promise<WriteResult>,
): Promise<ChatActionState> {
  const userId = await getViewerId()
  const parsed = schema.safeParse(raw, { reportInput: true })
  if (!parsed.success) {
    return { status: "error", message: FORM_ERROR_MESSAGE, fieldErrors: z.flattenError(parsed.error, fieldMessage).fieldErrors }
  }
  try {
    const result = await write(userId, parsed.data)
    expire(result)
    return { status: "ok", conversationId: result.conversationId, sent: result.message }
  } catch (error) {
    if (error instanceof m.ChatError) return { status: "error", message: error.message }
    console.error("[chat action]", error)
    return { status: "error", message: "Something went wrong, try again" }
  }
}

export async function startDirectAction(input: z.input<typeof s.startDirectInput>): Promise<ChatActionState> {
  return run(s.startDirectInput, input, (userId, { userId: otherId }) => m.startDirect(userId, otherId))
}

export async function ensureProjectConversationAction(input: z.input<typeof s.ensureProjectConversationInput>): Promise<ChatActionState> {
  return run(s.ensureProjectConversationInput, input, (userId, { projectId }) => m.ensureProjectConversation(userId, projectId))
}

export async function sendMessageAction(input: z.input<typeof s.sendMessageInput>): Promise<ChatActionState> {
  return run(s.sendMessageInput, input, m.sendMessage)
}

export async function sendProjectMessageAction(_state: ActionState, form: FormData): Promise<ActionState> {
  const userId = await getViewerId()
  const parsed = s.sendProjectMessageForm.safeParse(Object.fromEntries(form), { reportInput: true })
  if (!parsed.success) {
    return { status: "error", message: FORM_ERROR_MESSAGE, fieldErrors: z.flattenError(parsed.error, fieldMessage).fieldErrors }
  }
  try {
    // Both mutations check project membership.
    const conversation = await m.ensureProjectConversation(userId, parsed.data.projectId)
    expire(conversation)
    const sent = await m.sendMessage(userId, { conversationId: conversation.conversationId, body: parsed.data.body })
    expire(sent)
    return { status: "ok" }
  } catch (error) {
    if (error instanceof m.ChatError) return { status: "error", message: error.message }
    console.error("[chat action]", error)
    return { status: "error", message: "Something went wrong, try again" }
  }
}

export async function markReadAction(input: z.input<typeof s.markReadInput>): Promise<ChatActionState> {
  return run(s.markReadInput, input, (userId, { conversationId }) => m.markRead(userId, conversationId))
}
