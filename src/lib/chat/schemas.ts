import { z } from "zod"

// Input of the chat Server Actions (./actions.ts). The signed-in user always comes from auth(), never from the client.

const id = z.uuid()

export const startDirectInput = z.object({ userId: z.string().trim().min(1) })
export const sendMessageInput = z.object({ conversationId: id, body: z.string().trim().min(1).max(4000) })
export const markReadInput = z.object({ conversationId: id })
export const ensureProjectConversationInput = z.object({ projectId: id })
export const sendProjectMessageForm = z.object({ projectId: id, body: z.string().trim().min(1).max(4000) })
