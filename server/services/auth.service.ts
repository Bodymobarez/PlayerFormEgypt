import bcrypt from "bcrypt";
import { storage } from "../storage";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "../errors";

export class AuthService {
  async loginClub(username: string, password: string) {
    if (!username || !password) {
      throw new AuthenticationError("Username and password required");
    }

    const club = await storage.getClubByUsername(username);
    if (!club) {
      throw new AuthenticationError("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, club.password);
    if (!passwordMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    return {
      id: club.id,
      clubId: club.clubId,
      name: club.name,
      logoUrl: club.logoUrl,
      primaryColor: club.primaryColor,
    };
  }

  async validateClubAccess(clubId: string, requestingClubId?: string) {
    const club = await storage.getClubByClubId(clubId);
    if (!club) {
      throw new NotFoundError("Club");
    }

    if (requestingClubId && requestingClubId !== clubId) {
      throw new AuthorizationError("Access denied to this club");
    }

    return club;
  }

  async getClubPublicInfo(clubId: string) {
    const club = await storage.getClubByClubId(clubId);
    if (!club) {
      throw new NotFoundError("Club");
    }

    return {
      name: club.name,
      logoUrl: club.logoUrl,
      primaryColor: club.primaryColor,
      assessmentPrice: club.assessmentPrice,
    };
  }
}

export const authService = new AuthService();
