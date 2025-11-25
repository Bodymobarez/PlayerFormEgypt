import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Club,
  type InsertClub,
  type Assessment,
  type InsertAssessment,
  users,
  clubs,
  assessments,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Club methods
  getClub(id: number): Promise<Club | undefined>;
  getClubByUsername(username: string): Promise<Club | undefined>;
  getClubByClubId(clubId: string): Promise<Club | undefined>;
  getAllClubs(): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, updates: Partial<Club>): Promise<Club | undefined>;

  // Assessment methods
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByClubId(clubId: string): Promise<Assessment[]>;
  createAssessment(
    assessment: InsertAssessment & { assessmentPrice: number }
  ): Promise<Assessment>;
  updateAssessment(
    id: number,
    updates: Partial<Assessment>
  ): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<void>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Club methods
  async getClub(id: number): Promise<Club | undefined> {
    const result = await db.select().from(clubs).where(eq(clubs.id, id));
    return result[0];
  }

  async getClubByUsername(username: string): Promise<Club | undefined> {
    const result = await db
      .select()
      .from(clubs)
      .where(eq(clubs.username, username));
    return result[0];
  }

  async getClubByClubId(clubId: string): Promise<Club | undefined> {
    const result = await db
      .select()
      .from(clubs)
      .where(eq(clubs.clubId, clubId));
    return result[0];
  }

  async getAllClubs(): Promise<Club[]> {
    return await db.select().from(clubs);
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const result = await db.insert(clubs).values(insertClub).returning();
    return result[0];
  }

  async updateClub(
    id: number,
    updates: Partial<Club>
  ): Promise<Club | undefined> {
    const result = await db
      .update(clubs)
      .set(updates)
      .where(eq(clubs.id, id))
      .returning();
    return result[0];
  }

  // Assessment methods
  async getAssessment(id: number): Promise<Assessment | undefined> {
    const result = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id));
    return result[0];
  }

  async getAssessmentsByClubId(clubId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.clubId, clubId));
  }

  async createAssessment(
    insertAssessment: InsertAssessment & { assessmentPrice: number }
  ): Promise<Assessment> {
    const result = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return result[0];
  }

  async updateAssessment(
    id: number,
    updates: Partial<Assessment>
  ): Promise<Assessment | undefined> {
    const result = await db
      .update(assessments)
      .set(updates)
      .where(eq(assessments.id, id))
      .returning();
    return result[0];
  }

  async deleteAssessment(id: number): Promise<void> {
    await db.delete(assessments).where(eq(assessments.id, id));
  }
}

export const storage = new DbStorage();
