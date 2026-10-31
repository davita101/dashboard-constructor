import { NewTask } from "@/components/task/new-task"
import { TaskCard } from "@/components/task/task-card"
import { TaskDescription } from "@/components/task/task-description"
import { TaskList } from "@/components/task/task-list"

// Mirrors the Figma Task page (12276:31748): Task-Card, Task-List, New-Task, Task-Description.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-default text-14 leading-24 font-bold text-base-800">{title}</h2>
      {children}
    </section>
  )
}

export default function TaskPage() {
  return (
    <main className="mx-auto flex max-w-desktop flex-col gap-12 p-8">
      <h1 className="font-default text-24 leading-32 font-bold text-base-900">Task</h1>
      <Section title="Task-Card">
        <TaskCard />
      </Section>
      <Section title="Task-List">
        <TaskList />
      </Section>
      <Section title="New-Task">
        <NewTask />
      </Section>
      <Section title="Task-Description">
        <TaskDescription />
      </Section>
    </main>
  )
}
