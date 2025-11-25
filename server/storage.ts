import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { type User, type InsertUser, type Club, type InsertClub, type Player, type InsertPlayer, users, clubs, players } from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

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
  
  // Player methods
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayersByClubId(clubId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  deletePlayer(id: number): Promise<void>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
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
    const result = await db.select().from(clubs).where(eq(clubs.username, username));
    return result[0];
  }

  async getClubByClubId(clubId: string): Promise<Club | undefined> {
    const result = await db.select().from(clubs).where(eq(clubs.clubId, clubId));
    return result[0];
  }

  async getAllClubs(): Promise<Club[]> {
    return await db.select().from(clubs);
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const result = await db.insert(clubs).values(insertClub).returning();
    return result[0];
  }

  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    const result = await db.select().from(players).where(eq(players.id, id));
    return result[0];
  }

  async getPlayersByClubId(clubId: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.clubId, clubId));
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const result = await db.insert(players).values(insertPlayer).returning();
    return result[0];
  }

  async deletePlayer(id: number): Promise<void> {
    await db.delete(players).where(eq(players.id, id));
  }
}

export const storage = new DbStorage();
