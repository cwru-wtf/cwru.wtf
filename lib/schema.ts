import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  interests: text('interests').notNull(),
  isApproved: boolean('is_approved'), // Default is null (pending)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const actionLogs = pgTable('action_logs', {
  id: serial('id').primaryKey(),
  submissionId: integer('submission_id').references(() => submissions.id),
  action: text('action').notNull(), // 'approved', 'rejected', 'email_sent', etc.
  details: text('details'), // Additional information about the action
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type ActionLog = typeof actionLogs.$inferSelect;
export type NewActionLog = typeof actionLogs.$inferInsert;
