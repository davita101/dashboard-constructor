import { sql } from "drizzle-orm"
import { integer, pgView, uuid } from "drizzle-orm/pg-core"

// Counts and progress are derived, never stored. Correlated subqueries avoid join fan-out.
// security_invoker: the view runs with the caller's rights, so Supabase RLS applies through it.

/** Per-project counters: KPI tiles, project cards, "Project implementation" (progress). */
export const projectStats = pgView("project_stats", {
  projectId: uuid("project_id").notNull(),
  stages: integer("stages").notNull(),
  members: integer("members").notNull(),
  files: integer("files").notNull(),
  tasks: integer("tasks").notNull(),
  tasksNew: integer("tasks_new").notNull(),
  tasksInWork: integer("tasks_in_work").notNull(),
  tasksDone: integer("tasks_done").notNull(),
  tasksFailed: integer("tasks_failed").notNull(),
  /** 0–100: done / all tasks. */
  progress: integer("progress").notNull(),
})
  .with({ securityInvoker: true })
  .as(sql`
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
  `)

/** Per-stage counters for the stage list. `members` = distinct assignees of the stage's tasks. */
export const stageStats = pgView("stage_stats", {
  stageId: uuid("stage_id").notNull(),
  tasks: integer("tasks").notNull(),
  members: integer("members").notNull(),
  files: integer("files").notNull(),
})
  .with({ securityInvoker: true })
  .as(sql`
    select
      s.id as stage_id,
      (select count(*) from tasks t where t.stage_id = s.id)::int as tasks,
      (select count(distinct a.user_id) from task_assignees a join tasks t on t.id = a.task_id where t.stage_id = s.id)::int as members,
      (select count(*) from files f where f.stage_id = s.id)::int as files
    from project_stages s
  `)
