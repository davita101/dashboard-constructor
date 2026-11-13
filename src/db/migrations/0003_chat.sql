CREATE TYPE "public"."conversation_kind" AS ENUM('project', 'direct');--> statement-breakpoint
CREATE TABLE "conversation_members" (
	"conversation_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_read_at" timestamp with time zone,
	CONSTRAINT "conversation_members_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "conversation_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "conversation_kind" NOT NULL,
	"project_id" uuid,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_message_at" timestamp with time zone,
	CONSTRAINT "conversations_kind_project_check" CHECK (("conversations"."kind" = 'project') = ("conversations"."project_id" is not null))
);
--> statement-breakpoint
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"author_id" text,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_at" timestamp with time zone,
	CONSTRAINT "messages_body_length_check" CHECK (char_length("messages"."body") between 1 and 4000)
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversation_members_user_id_index" ON "conversation_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversations_project_id_unique" ON "conversations" USING btree ("project_id") WHERE "conversations"."project_id" is not null;--> statement-breakpoint
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages" USING btree ("conversation_id","created_at" desc);--> statement-breakpoint
-- Conversations the signed-in user may read: direct ones they are a member of + project chats of their projects.
-- SECURITY DEFINER so the policies on conversation_members don't recurse into themselves.
create or replace function public.viewer_conversation_ids() returns setof uuid
  language sql stable security definer
  set search_path = ''
as $$
  select conversation_id from public.conversation_members
  where user_id = (select auth.jwt() ->> 'sub')
  union
  select c.id from public.conversations c
  join public.project_members pm on pm.project_id = c.project_id
  where c.kind = 'project' and pm.user_id = (select auth.jwt() ->> 'sub')
$$;--> statement-breakpoint
revoke all on function public.viewer_conversation_ids() from public;--> statement-breakpoint
grant execute on function public.viewer_conversation_ids() to authenticated;--> statement-breakpoint
CREATE POLICY "conversation_members_select_viewer" ON "conversation_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("conversation_members"."conversation_id" in (select public.viewer_conversation_ids()));--> statement-breakpoint
CREATE POLICY "conversations_select_viewer" ON "conversations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("conversations"."id" in (select public.viewer_conversation_ids()));--> statement-breakpoint
CREATE POLICY "messages_select_viewer" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("messages"."conversation_id" in (select public.viewer_conversation_ids()));--> statement-breakpoint
DO $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
     ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
