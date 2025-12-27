
import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const equipment = pgTable('equipment', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  teamId: integer('team_id').references(() => teams.id),
  serialNumber: text('serial_number'),
  department: text('department'),
  location: text('location'),
  status: text('status').default('Active'),
});

export const maintenanceRequests = pgTable('maintenance_requests', {
  id: serial('id').primaryKey(),
  subject: text('subject').notNull(),
  equipmentId: integer('equipment_id').references(() => equipment.id),
  type: text('type').notNull(), // Corrective | Preventive
  status: text('status').default('New'),
  scheduledDate: timestamp('scheduled_date'),
  createdAt: timestamp('created_at').defaultNow(),
});
