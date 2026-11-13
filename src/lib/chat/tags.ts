// Cache tags for chat. Messages and the conversation list are read uncached (unread counts must be fresh, realtime
// reads messages live), so nothing tags them yet; actions still expire these for a future cached read.

/** Everything one user sees in chat (list, unread counts). */
export const userChatTag = (userId: string) => `user-chat:${userId}`

/** One conversation, across every participant. */
export const conversationTag = (conversationId: string) => `conversation:${conversationId}`
