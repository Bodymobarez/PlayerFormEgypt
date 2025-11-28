import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users (site admins)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Players table - for player accounts
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Clubs table - with assessment price
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  clubId: text("club_id").notNull().unique(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  primaryColor: text("primary_color").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  assessmentPrice: integer("assessment_price").notNull().default(5000), // Price in cents
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
  stripeProductId: true,
  stripePriceId: true,
});
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

// Player Assessments table
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id"),
  clubId: text("club_id").notNull(),
  fullName: text("full_name").notNull(),
  birthDate: text("birth_date").notNull(),
  birthPlace: text("birth_place").notNull(),
  nationalId: text("national_id").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  guardianPhone: text("guardian_phone").notNull(),
  guardianName: text("guardian_name").notNull(),
  school: text("school"),
  position: text("position").notNull(),
  height: text("height"),
  weight: text("weight"),
  previousClub: text("previous_club"),
  medicalHistory: text("medical_history"),
  playerPhotoUrl: text("player_photo_url"),
  // Payment related
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  assessmentPrice: integer("assessment_price").notNull(), // Price at time of registration
  // Assessment related
  assessmentDate: timestamp("assessment_date"),
  assessmentLocation: text("assessment_location"),
  assessmentStatus: text("assessment_status").notNull().default("registered"), // registered, in_progress, completed, not_attended
  resultStatus: text("result_status"), // accepted, rejected, null = pending
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  playerId: true,
  createdAt: true,
  updatedAt: true,
  stripeCheckoutSessionId: true,
  stripePaymentIntentId: true,
  paymentStatus: true,
  assessmentDate: true,
  assessmentLocation: true,
  assessmentStatus: true,
  notes: true,
});
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
