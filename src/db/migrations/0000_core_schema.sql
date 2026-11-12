CREATE TYPE "public"."task_status" AS ENUM('new', 'in_work', 'done', 'failed');--> statement-breakpoint
CREATE TYPE "public"."project_event_kind" AS ENUM('member', 'comment', 'stage', 'file', 'task');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"avatar" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_members" (
	"project_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_members_project_id_user_id_pk" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "project_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_stages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"client_id" uuid,
	"owner_id" text,
	"income" numeric(12, 2) DEFAULT 0 NOT NULL,
	"cost" numeric(12, 2) DEFAULT 0 NOT NULL,
	"deadline" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "task_assignees" (
	"task_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "task_assignees_task_id_user_id_pk" PRIMARY KEY("task_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "task_assignees" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "task_labels" (
	"task_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	CONSTRAINT "task_labels_task_id_label_id_pk" PRIMARY KEY("task_id","label_id")
);
--> statement-breakpoint
ALTER TABLE "task_labels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"stage_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'new' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"start_date" date,
	"due_date" date,
	"cover" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"actor_id" text,
	"kind" "project_event_kind" NOT NULL,
	"title" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"stage_id" uuid,
	"task_id" uuid,
	"uploader_id" text,
	"name" text NOT NULL,
	"storage_path" text NOT NULL,
	"size" bigint NOT NULL,
	"mime" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "files_storagePath_unique" UNIQUE("storage_path")
);
--> statement-breakpoint
ALTER TABLE "files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_stages" ADD CONSTRAINT "project_stages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labels" ADD CONSTRAINT "labels_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_stage_id_project_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."project_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_events" ADD CONSTRAINT "project_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_events" ADD CONSTRAINT "project_events_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_stage_id_project_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."project_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_members_user_id_index" ON "project_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "project_stages_project_id_position_index" ON "project_stages" USING btree ("project_id","position");--> statement-breakpoint
CREATE INDEX "projects_client_id_index" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "projects_owner_id_index" ON "projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "projects_updated_at_index" ON "projects" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "labels_project_id_index" ON "labels" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "task_assignees_user_id_index" ON "task_assignees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "task_labels_label_id_index" ON "task_labels" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "tasks_project_id_status_position_index" ON "tasks" USING btree ("project_id","status","position");--> statement-breakpoint
CREATE INDEX "tasks_stage_id_index" ON "tasks" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX "project_events_project_id_at_index" ON "project_events" USING btree ("project_id","at");--> statement-breakpoint
CREATE INDEX "project_events_at_index" ON "project_events" USING btree ("at");--> statement-breakpoint
CREATE INDEX "files_project_id_index" ON "files" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "files_stage_id_index" ON "files" USING btree ("stage_id");--> statement-breakpoint
CREATE INDEX "files_task_id_index" ON "files" USING btree ("task_id");--> statement-breakpoint
CREATE VIEW "public"."project_stats" WITH (security_invoker = true) AS (
    select
      p.id as project_id,
      (select count(*) from project_stages s where s.project_id = p.id)::int as stages,
      (select count(*) from project_members m where m.project_id = p.id)::int as members,
      (select count(*) from files f where f.project_id = p.id)::int as files,
      t.total as tasks,
      t.new as tasks_new,
      t.in_work as tasks_in_work,
      t.done as tasks_done,
      t.failed as tasks_failed,
      case when t.total = 0 then 0 else round(100.0 * t.done / t.total)::int end as progress
    from projects p
    cross join lateral (
      select
        count(*)::int as total,
        (count(*) filter (where status = 'new'))::int as new,
        (count(*) filter (where status = 'in_work'))::int as in_work,
        (count(*) filter (where status = 'done'))::int as done,
        (count(*) filter (where status = 'failed'))::int as failed
      from tasks where tasks.project_id = p.id
    ) t
  );--> statement-breakpoint
CREATE VIEW "public"."stage_stats" WITH (security_invoker = true) AS (
    select
      s.id as stage_id,
      (select count(*) from tasks t where t.stage_id = s.id)::int as tasks,
      (select count(distinct a.user_id) from task_assignees a join tasks t on t.id = a.task_id where t.stage_id = s.id)::int as members,
      (select count(*) from files f where f.stage_id = s.id)::int as files
    from project_stages s
  );--> statement-breakpoint
CREATE POLICY "users_select_self" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("users"."id" = (select auth.jwt() ->> 'sub'));--> statement-breakpoint
CREATE POLICY "clients_select_member" ON "clients" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("clients"."id" in (select client_id from projects));--> statement-breakpoint
CREATE POLICY "project_members_select_self" ON "project_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("project_members"."user_id" = (select auth.jwt() ->> 'sub'));--> statement-breakpoint
CREATE POLICY "project_stages_select_member" ON "project_stages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("project_stages"."project_id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));--> statement-breakpoint
CREATE POLICY "projects_select_member" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("projects"."id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));--> statement-breakpoint
CREATE POLICY "labels_select_member" ON "labels" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("labels"."project_id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));--> statement-breakpoint
CREATE POLICY "task_assignees_select_member" ON "task_assignees" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("task_assignees"."task_id" in (select id from tasks));--> statement-breakpoint
CREATE POLICY "task_labels_select_member" ON "task_labels" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("task_labels"."task_id" in (select id from tasks));--> statement-breakpoint
CREATE POLICY "tasks_select_member" ON "tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("tasks"."project_id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));--> statement-breakpoint
CREATE POLICY "project_events_select_member" ON "project_events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("project_events"."project_id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));--> statement-breakpoint
CREATE POLICY "files_select_member" ON "files" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("files"."project_id" in (select project_id from project_members where user_id = (select auth.jwt() ->> 'sub')));