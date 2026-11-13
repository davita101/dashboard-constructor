"use client"

import { useEffect, useRef } from "react"

import { useSupabase } from "@/lib/supabase/client"

export type StreamedMessage = {
  id: string
  conversationId: string
  authorId: string | null
  body: string
  createdAt: Date
  editedAt: Date | null
}

type MessageRow = {
  id: string
  conversation_id: string
  author_id: string | null
  body: string
  created_at: string
  edited_at: string | null
}

// Realtime payloads carry only the `messages` row: author name/avatar are not included.
// The consumer resolves them from an already-loaded members list, or refetches.
export function parseMessageRow(row: MessageRow): StreamedMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    authorId: row.author_id,
    body: row.body,
    createdAt: new Date(row.created_at),
    editedAt: row.edited_at ? new Date(row.edited_at) : null,
  }
}

// Delivers newly inserted messages of one conversation (RLS applies via the Clerk token).
export function useMessageStream(conversationId: string | null, onMessage: (m: StreamedMessage) => void) {
  const supabase = useSupabase()
  const handler = useRef(onMessage)
  useEffect(() => {
    handler.current = onMessage
  })

  useEffect(() => {
    if (!conversationId) return
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => handler.current(parseMessageRow(payload.new as MessageRow)),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [supabase, conversationId])
}
