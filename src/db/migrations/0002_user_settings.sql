CREATE TYPE "public"."theme_mode" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" "theme_mode",
	"locale" text,
	"widget_layout" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "user_settings_select_self" ON "user_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("user_settings"."user_id" = (select auth.jwt() ->> 'sub'));