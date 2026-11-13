import { relations } from "drizzle-orm"

import { conversationMembers, conversations, messages } from "./chat"
import { clients } from "./clients"
import { projectEvents } from "./events"
import { files } from "./files"
import { projectMembers, projects, projectStages } from "./projects"
import { labels, taskAssignees, taskLabels, tasks } from "./tasks"
import { users } from "./users"

// For db.query.* (relational queries). No SQL of their own.

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(projectMembers),
  assignments: many(taskAssignees),
}))

export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  members: many(projectMembers),
  stages: many(projectStages),
  tasks: many(tasks),
  labels: many(labels),
  events: many(projectEvents),
  files: many(files),
}))

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, { fields: [projectMembers.projectId], references: [projects.id] }),
  user: one(users, { fields: [projectMembers.userId], references: [users.id] }),
}))

export const projectStagesRelations = relations(projectStages, ({ one, many }) => ({
  project: one(projects, { fields: [projectStages.projectId], references: [projects.id] }),
  tasks: many(tasks),
  files: many(files),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  stage: one(projectStages, { fields: [tasks.stageId], references: [projectStages.id] }),
  creator: one(users, { fields: [tasks.createdBy], references: [users.id] }),
  assignees: many(taskAssignees),
  labels: many(taskLabels),
  files: many(files),
}))

export const taskAssigneesRelations = relations(taskAssignees, ({ one }) => ({
  task: one(tasks, { fields: [taskAssignees.taskId], references: [tasks.id] }),
  user: one(users, { fields: [taskAssignees.userId], references: [users.id] }),
}))

export const labelsRelations = relations(labels, ({ one, many }) => ({
  project: one(projects, { fields: [labels.projectId], references: [projects.id] }),
  tasks: many(taskLabels),
}))

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
  task: one(tasks, { fields: [taskLabels.taskId], references: [tasks.id] }),
  label: one(labels, { fields: [taskLabels.labelId], references: [labels.id] }),
}))

export const projectEventsRelations = relations(projectEvents, ({ one }) => ({
  project: one(projects, { fields: [projectEvents.projectId], references: [projects.id] }),
  actor: one(users, { fields: [projectEvents.actorId], references: [users.id] }),
}))

export const filesRelations = relations(files, ({ one }) => ({
  project: one(projects, { fields: [files.projectId], references: [projects.id] }),
  stage: one(projectStages, { fields: [files.stageId], references: [projectStages.id] }),
  task: one(tasks, { fields: [files.taskId], references: [tasks.id] }),
  uploader: one(users, { fields: [files.uploaderId], references: [users.id] }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  project: one(projects, { fields: [conversations.projectId], references: [projects.id] }),
  creator: one(users, { fields: [conversations.createdBy], references: [users.id] }),
  members: many(conversationMembers),
  messages: many(messages),
}))

export const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, { fields: [conversationMembers.conversationId], references: [conversations.id] }),
  user: one(users, { fields: [conversationMembers.userId], references: [users.id] }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  author: one(users, { fields: [messages.authorId], references: [users.id] }),
}))
