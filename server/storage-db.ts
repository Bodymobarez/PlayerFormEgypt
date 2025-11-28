import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Club,
  type InsertClub,
  type Assessment,
  type InsertAssessment,
  type Player,
  type InsertPlayer,
  users,
  clubs,
  assessments,
  players,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;
  deleteClub(id: number): Promise<void>;
  getClub(id: number): Promise<Club | undefined>;
  getClubByUsername(username: string): Promise<Club | undefined>;
  getClubByClubId(clubId: string): Promise<Club | undefined>;
  getAllClubs(): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, updates: Partial<Club>): Promise<Club | undefined>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByClubId(clubId: string): Promise<Assessment[]>;
  getAssessmentsByPlayerId(playerId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment & { assessmentPrice: number; playerId?: number }): Promise<Assessment>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined>;
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

  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    const result = await db
      .select()
      .from(players)
      .where(eq(players.username, username));
    return result[0];
  }

  async getAllPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(insertPlayer).returning();
    return result[0];
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined> {
    const result = await db
      .update(players)
      .set(updates)
      .where(eq(players.id, id))
      .returning();
    return result[0];
  }

  async deletePlayer(id: number): Promise<void> {
    await db.delete(players).where(eq(players.id, id));
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

  async deleteClub(id: number): Promise<void> {
    await db.delete(clubs).where(eq(clubs.id, id));
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

  async getAssessmentsByPlayerId(playerId: number): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.playerId, playerId));
  }

  async createAssessment(
    insertAssessment: InsertAssessment & { assessmentPrice: number; playerId?: number }
  ): Promise<Assessment> {
    const result = await db
      .insert(assessments)
      .values({
        ...insertAssessment,
        playerId: insertAssessment.playerId || null,
      })
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
