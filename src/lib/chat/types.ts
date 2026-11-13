export type ChatAuthor = { id: string; name: string; avatar: string | null }

export type ConversationSummary = {
  id: string
  kind: "project" | "direct"
  projectId: string | null
  /** Project name, or the other participant's name for direct chats. */
  title: string
  /** Other participant (direct only). */
  peer: ChatAuthor | null
  lastMessage: { body: string; authorId: string | null; createdAt: Date } | null
  lastMessageAt: Date | null
  unreadCount: number
}

export type ChatMessage = {
  id: string
  conversationId: string
  body: string
  createdAt: Date
  editedAt: Date | null
  author: ChatAuthor | null
}

export type WriteResult = {
  conversationId: string
  /** Users whose chat view changes (for `updateTag`). */
  userIds: string[]
  message?: ChatMessage
}
