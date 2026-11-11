import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'bookings' table
export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(), // Using reservation code like NPB-729013
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  tourId: text('tour_id').notNull(),
  tourName: text('tour_name').notNull(),
  travelDate: text('travel_date').notNull(),
  travelers: integer('travelers').notNull(),
  addOns: text('add_ons'), // Serialized JSON array of add-ons
  totalPrice: integer('total_price').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentStatus: text('payment_status').notNull(), // 'Paid' | 'Pending'
  createdDate: text('created_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships for the 'users' table
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

// Define relationships for the 'bookings' table
export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));
