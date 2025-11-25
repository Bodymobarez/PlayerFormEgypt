import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// Clubs table
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  clubId: text("club_id").notNull().unique(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  primaryColor: text("primary_color").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Club = typeof clubs.$inferSelect;

// Players table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
