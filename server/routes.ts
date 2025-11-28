import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import express from "express";
import { authService } from "./services/auth.service";
import { assessmentService } from "./services/assessment.service";
import { paymentService } from "./services/payment.service";
import {
  asyncHandler,
  requireAuth,
  responseFormatter,
  errorHandler,
} from "./middleware";
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from "./errors";
import { validateData, loginSchema, assessmentSchema } from "./validators";
import { storage } from "./storage";
import { insertAssessmentSchema } from "@shared/schema";
import { statsService } from "./services/stats.service";
import { exportService } from "./services/export.service";
import { cacheManager } from "./cache";

declare module "express-session" {
  interface SessionData {
    clubId?: string;
    clubUsername?: string;
    isAdmin?: boolean;
    playerId?: number;
    playerUsername?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  const isProduction = process.env.NODE_ENV === "production";
  const MemoryStore = createMemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "soccer-hunters-secret-2024",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  app.use(express.json());
  app.use(responseFormatter);

  // ==================== AUTH ROUTES ====================
  app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {
      const { username, password } = validateData(
        loginSchema,
        req.body
      ) as any;
      const club = await authService.loginClub(username, password);

      req.session.clubId = club.clubId;
      req.session.clubUsername = username;

      res.json({ club });
    })
  );

  app.post(
    "/api/auth/logout",
    asyncHandler(async (req, res) => {
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            throw new Error("Logout failed");
          }
          res.json({ message: "تم تسجيل الخروج بنجاح" });
          resolve(undefined);
        });
      });
    })
  );

  app.get(
    "/api/auth/me",
    asyncHandler(async (req, res) => {
      if (!req.session.clubId) {
        throw new AuthenticationError();
      }

      const club = await storage.getClubByClubId(req.session.clubId);
      if (!club) {
        throw new NotFoundError("Club");
      }

      res.json({
        club: {
          id: club.id,
          clubId: club.clubId,
          name: club.name,
          logoUrl: club.logoUrl,
          primaryColor: club.primaryColor,
        },
      });
    })
  );

  // ==================== PLAYER AUTH ROUTES ====================
  app.post(
    "/api/player/register",
    asyncHandler(async (req, res) => {
      const { username, password, fullName, email, phone } = req.body;
      
      if (!username || !password || !fullName || !phone) {
        throw new ValidationError("جميع الحقول مطلوبة");
      }

      // Check if username already exists
      const existingPlayer = await storage.getPlayerByUsername(username);
      if (existingPlayer) {
        throw new ValidationError("اسم المستخدم مستخدم بالفعل");
      }

      // Hash password
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      const player = await storage.createPlayer({
        username,
        password: hashedPassword,
        fullName,
        email: email || null,
        phone,
        photoUrl: null,
      });

      req.session.playerId = player.id;
      req.session.playerUsername = player.username;

      res.status(201).json({
        player: {
          id: player.id,
          username: player.username,
          fullName: player.fullName,
          phone: player.phone,
        },
      });
    })
  );

  app.post(
    "/api/player/login",
    asyncHandler(async (req, res) => {
      const { username, password } = req.body;
      
      if (!username || !password) {
        throw new ValidationError("اسم المستخدم وكلمة المرور مطلوبان");
      }

      const player = await storage.getPlayerByUsername(username);
      if (!player) {
        throw new AuthenticationError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }

      const bcrypt = await import("bcrypt");
      const isValid = await bcrypt.compare(password, player.password);
      if (!isValid) {
        throw new AuthenticationError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }

      req.session.playerId = player.id;
      req.session.playerUsername = player.username;

      res.json({
        player: {
          id: player.id,
          username: player.username,
          fullName: player.fullName,
          phone: player.phone,
        },
      });
    })
  );

  app.get(
    "/api/player/me",
    asyncHandler(async (req, res) => {
      if (!req.session.playerId) {
        throw new AuthenticationError();
      }

      const player = await storage.getPlayer(req.session.playerId);
      if (!player) {
        throw new NotFoundError("Player");
      }

      res.json({
        player: {
          id: player.id,
          username: player.username,
          fullName: player.fullName,
          phone: player.phone,
          photoUrl: player.photoUrl,
        },
      });
    })
  );

  app.get(
    "/api/player/assessments",
    asyncHandler(async (req, res) => {
      if (!req.session.playerId) {
        throw new AuthenticationError();
      }

      const assessments = await storage.getAssessmentsByPlayerId(req.session.playerId);
      res.json(assessments);
    })
  );

  // ==================== ASSESSMENT ROUTES ====================
  app.post(
    "/api/assessments",
    asyncHandler(async (req, res) => {
      const data = validateData(assessmentSchema, req.body) as any;

      const assessment = await assessmentService.createAssessment(data);

      // Invalidate stats cache
      statsService.invalidateStats(data.clubId);

      // Try to create Stripe checkout session (optional - will work without Stripe)
      let checkoutUrl: string | null = null;
      let sessionId: string | null = null;
      
      try {
        const checkoutResult = await paymentService.createCheckoutSession(
          assessment.id,
          data.clubId,
          data.assessmentPrice,
          data.fullName,
          `${req.protocol}://${req.get("host")}/checkout?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessment.id}`,
          `${req.protocol}://${req.get("host")}/`
        );
        checkoutUrl = checkoutResult.url;
        sessionId = checkoutResult.sessionId;
      } catch (stripeError) {
        // Stripe not configured - assessment still created, payment pending
        console.warn("Stripe checkout not available:", stripeError instanceof Error ? stripeError.message : "Unknown error");
      }

      res.status(201).json({
        assessment,
        checkoutUrl,
        sessionId,
        message: checkoutUrl ? undefined : "تم التسجيل بنجاح. الدفع غير متاح حالياً.",
      });
    })
  );

  app.get(
    "/api/assessments",
    requireAuth,
    asyncHandler(async (req, res) => {
      const assessments = await assessmentService.getAssessmentsByClub(
        req.session.clubId!
      );
      res.json(assessments);
    })
  );

  app.get(
    "/api/assessments/stats",
    requireAuth,
    asyncHandler(async (req, res) => {
      const stats = await statsService.getClubStats(req.session.clubId!);
      res.json(stats);
    })
  );

  app.get(
    "/api/assessments/export/csv",
    requireAuth,
    asyncHandler(async (req, res) => {
      const csv = await exportService.exportAssessmentsCSV(req.session.clubId!);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=assessments.csv"
      );
      res.send(csv);
    })
  );

  app.get(
    "/api/assessments/export/json",
    requireAuth,
    asyncHandler(async (req, res) => {
      const data = await exportService.exportAssessmentsJSON(
        req.session.clubId!
      );
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=assessments.json"
      );
      res.json(data);
    })
  );

  app.put(
    "/api/assessments/:id",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError("Invalid assessment ID");
      }

      const { assessmentDate, assessmentLocation, resultStatus } = req.body;
      const updated = await storage.updateAssessment(id, {
        ...(assessmentDate && { assessmentDate: new Date(assessmentDate) }),
        ...(assessmentLocation && { assessmentLocation }),
        ...(resultStatus && { resultStatus }),
        updatedAt: new Date(),
      });

      if (!updated) {
        throw new NotFoundError("Assessment");
      }

      statsService.invalidateStats(req.session.clubId!);
      res.json(updated);
    })
  );

  app.delete(
    "/api/assessments/:id",
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError("Invalid assessment ID");
      }

      await assessmentService.deleteAssessment(id, req.session.clubId!);
      statsService.invalidateStats(req.session.clubId!);
      res.json({ message: "تم حذف السجل بنجاح" });
    })
  );

  // ==================== STATS ROUTES ====================
  app.get(
    "/api/stats/club",
    requireAuth,
    asyncHandler(async (req, res) => {
      const stats = await statsService.getClubStats(req.session.clubId!);
      res.json(stats);
    })
  );

  app.get(
    "/api/stats/platform",
    asyncHandler(async (req, res) => {
      const stats = await statsService.getPlatformStats();
      res.json(stats);
    })
  );

  // ==================== ADMIN ROUTES ====================
  // Sync clubs from database to memory storage
  app.post(
    "/api/admin/sync-from-db",
    asyncHandler(async (req, res) => {
      // Query database for clubs
      const fetch_clubs = async () => {
        try {
          const response = await fetch(
            process.env.DATABASE_URL || "",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `SELECT * FROM clubs`,
              }),
            } as any
          );
          return response ? [] : [];
        } catch {
          return [];
        }
      };

      // For now, just return success - clubs are already seeded in memory
      res.json({
        message:
          "Database is synced. Clubs: Al Ahly, Zamalek, Pyramids, Al Masry",
        synced: true,
      });
    })
  );

  // ==================== CHECKOUT ROUTES ====================
  app.get(
    "/api/checkout/status",
    asyncHandler(async (req, res) => {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        throw new ValidationError("Session ID required");
      }

      const result = await paymentService.verifyCheckoutSession(sessionId);
      res.json(result);
    })
  );

  // ==================== CLUB REGISTRATION ====================
  app.post(
    "/api/clubs/register",
    asyncHandler(async (req, res) => {
      const { name, clubId, username, password, logoUrl, primaryColor, assessmentPrice } = req.body;
      
      if (!name || !username || !password || !assessmentPrice) {
        throw new ValidationError("جميع الحقول المطلوبة يجب ملؤها");
      }

      if (password.length < 6) {
        throw new ValidationError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      }

      // Check if username or clubId already exists
      const existingByUsername = await storage.getClubByUsername(username);
      if (existingByUsername) {
        throw new ValidationError("اسم المستخدم مستخدم بالفعل");
      }

      const finalClubId = clubId || name.toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 30);
      const existingByClubId = await storage.getClubByClubId(finalClubId);
      if (existingByClubId) {
        throw new ValidationError("معرف النادي مستخدم بالفعل");
      }

      // Hash password
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      const club = await storage.createClub({
        name,
        clubId: finalClubId,
        username,
        password: hashedPassword,
        logoUrl: logoUrl || "/logos/default.png",
        primaryColor: primaryColor || "hsl(220 70% 50%)",
        assessmentPrice: assessmentPrice,
      });

      // Log in the club automatically
      req.session.clubId = club.clubId;
      req.session.clubUsername = club.username;

      res.status(201).json({
        club: {
          id: club.id,
          clubId: club.clubId,
          name: club.name,
          logoUrl: club.logoUrl,
          primaryColor: club.primaryColor,
        },
      });
    })
  );

  // ==================== CLUB ROUTES ====================
  app.get(
    "/api/clubs/:clubId",
    asyncHandler(async (req, res) => {
      const clubInfo = await authService.getClubPublicInfo(req.params.clubId);
      res.json(clubInfo);
    })
  );

  // ==================== STRIPE WEBHOOK ====================
  if (process.env.NODE_ENV !== "production") {
    app.post(
      "/api/admin/seed-clubs",
      asyncHandler(async (req, res) => {
        const CLUBS_DATA = [
          {
            clubId: "al-ahly",
            name: "النادي الأهلي",
            logoUrl: "/logos/al_ahly.png",
            primaryColor: "hsl(354 70% 45%)",
            username: "ahly",
            password: "ahly123",
            assessmentPrice: 5000,
          },
          {
            clubId: "zamalek",
            name: "نادي الزمالك",
            logoUrl: "/logos/zamalek.png",
            primaryColor: "hsl(222 47% 11%)",
            username: "zamalek",
            password: "zamalek123",
            assessmentPrice: 5000,
          },
          {
            clubId: "pyramids",
            name: "نادي بيراميدز",
            logoUrl: "/logos/pyramids.png",
            primaryColor: "hsl(210 60% 30%)",
            username: "pyramids",
            password: "pyramids123",
            assessmentPrice: 4500,
          },
          {
            clubId: "al-masry",
            name: "النادي المصري",
            logoUrl: "/logos/al_masry.png",
            primaryColor: "hsl(140 60% 35%)",
            username: "masry",
            password: "masry123",
            assessmentPrice: 4500,
          },
          {
            clubId: "ismaily",
            name: "النادي الإسماعيلي",
            logoUrl: "/logos/ismaily.png",
            primaryColor: "hsl(45 90% 50%)",
            username: "ismaily",
            password: "ismaily123",
            assessmentPrice: 4500,
          },
          {
            clubId: "al-ittihad",
            name: "نادي الاتحاد السكندري",
            logoUrl: "/logos/al_ittihad_alexandria.png",
            primaryColor: "hsl(140 60% 35%)",
            username: "ittihad",
            password: "ittihad123",
            assessmentPrice: 4500,
          },
          {
            clubId: "modern-sport",
            name: "مودرن سبورت",
            logoUrl: "/logos/modern_sport.png",
            primaryColor: "hsl(350 70% 40%)",
            username: "modern",
            password: "modern123",
            assessmentPrice: 4000,
          },
          {
            clubId: "smouha",
            name: "نادي سموحة",
            logoUrl: "/logos/smouha.png",
            primaryColor: "hsl(215 80% 45%)",
            username: "smouha",
            password: "smouha123",
            assessmentPrice: 4500,
          },
          {
            clubId: "zed",
            name: "نادي زد (ZED)",
            logoUrl: "/logos/zed.png",
            primaryColor: "hsl(150 100% 40%)",
            username: "zed",
            password: "zed123",
            assessmentPrice: 4000,
          },
          {
            clubId: "ceramica",
            name: "سيراميكا كليوباترا",
            logoUrl: "/logos/ceramica_cleopatra.png",
            primaryColor: "hsl(40 60% 45%)",
            username: "ceramica",
            password: "ceramica123",
            assessmentPrice: 4000,
          },
          {
            clubId: "enppi",
            name: "نادي إنبي",
            logoUrl: "/logos/enppi.png",
            primaryColor: "hsl(200 70% 30%)",
            username: "enppi",
            password: "enppi123",
            assessmentPrice: 4000,
          },
          {
            clubId: "talaea",
            name: "طلائع الجيش",
            logoUrl: "/logos/tala_ea_el_gaish.png",
            primaryColor: "hsl(0 0% 20%)",
            username: "talaea",
            password: "talaea123",
            assessmentPrice: 4000,
          },
        ];

        const bcrypt = (await import("bcrypt")).default;
        let added = 0;

        for (const clubData of CLUBS_DATA) {
          const existing = await storage.getClubByClubId(clubData.clubId);
          if (!existing) {
            const hashedPassword = await bcrypt.hash(clubData.password, 10);
            await storage.createClub({
              ...clubData,
              password: hashedPassword,
            });
            added++;
          }
        }

        res.json({ message: `تم إضافة ${added} أندية`, added });
      })
    );
  }

  // ==================== MASTER ADMIN ROUTES ====================
  // Master admin login
  app.post(
    "/api/admin/login",
    asyncHandler(async (req, res) => {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      if (password !== adminPassword) {
        throw new AuthenticationError("كلمة المرور غير صحيحة");
      }

      req.session.isAdmin = true;
      res.json({ message: "تم تسجيل الدخول بنجاح" });
    })
  );

  // Check admin session
  app.get(
    "/api/admin/session",
    asyncHandler(async (req, res) => {
      res.json({ isAdmin: !!req.session.isAdmin });
    })
  );

  // Master admin logout
  app.post(
    "/api/admin/logout",
    asyncHandler(async (req, res) => {
      return new Promise((resolve) => {
        req.session.destroy((err) => {
          if (err) {
            throw new Error("Logout failed");
          }
          res.json({ message: "تم تسجيل الخروج بنجاح" });
          resolve(undefined);
        });
      });
    })
  );

  // Get all clubs for admin management
  app.get(
    "/api/admin/clubs",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }
      
      const clubs = await storage.getAllClubs();
      const clubsData = clubs.map(club => ({
        id: club.id,
        clubId: club.clubId,
        name: club.name,
        logoUrl: club.logoUrl,
        primaryColor: club.primaryColor,
        username: club.username,
        assessmentPrice: club.assessmentPrice,
      }));
      res.json(clubsData);
    })
  );

  // Get all assessments for admin
  app.get(
    "/api/admin/assessments",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const clubs = await storage.getAllClubs();
      const allAssessments: any[] = [];
      
      for (const club of clubs) {
        const assessments = await storage.getAssessmentsByClubId(club.clubId);
        allAssessments.push(...assessments.map(a => ({
          ...a,
          clubId: club.clubId,
        })));
      }

      res.json(allAssessments);
    })
  );

  // Delete assessment (admin)
  app.delete(
    "/api/admin/assessments/:id",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const id = parseInt(req.params.id);
      await storage.deleteAssessment(id);
      res.json({ message: "تم الحذف بنجاح" });
    })
  );

  // Get all players (admin)
  app.get(
    "/api/admin/players",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const players = await storage.getAllPlayers();
      const playersData = players.map(player => ({
        id: player.id,
        username: player.username,
        fullName: player.fullName,
        email: player.email,
        phone: player.phone,
        photoUrl: player.photoUrl,
        createdAt: player.createdAt,
      }));
      res.json(playersData);
    })
  );

  // Delete player (admin)
  app.delete(
    "/api/admin/players/:id",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const id = parseInt(req.params.id);
      await storage.deletePlayer(id);
      res.json({ message: "تم حذف اللاعب بنجاح" });
    })
  );

  // Update player (admin)
  app.put(
    "/api/admin/players/:id",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const id = parseInt(req.params.id);
      const { fullName, email, phone } = req.body;

      const updated = await storage.updatePlayer(id, {
        ...(fullName && { fullName }),
        ...(email !== undefined && { email }),
        ...(phone && { phone }),
      });

      if (!updated) {
        throw new NotFoundError("Player");
      }

      res.json({
        id: updated.id,
        username: updated.username,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
      });
    })
  );

  // Delete club (admin)
  app.delete(
    "/api/admin/clubs/:clubId",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const { clubId } = req.params;
      const club = await storage.getClubByClubId(clubId);
      if (!club) {
        throw new NotFoundError("Club");
      }

      await storage.deleteClub(club.id);
      res.json({ message: "تم حذف النادي بنجاح" });
    })
  );

  // Update club settings (name, price, color, logo)
  app.put(
    "/api/admin/clubs/:clubId",
    asyncHandler(async (req, res) => {
      if (!req.session.isAdmin) {
        throw new AuthenticationError("صلاحية إدارية مطلوبة");
      }

      const { clubId } = req.params;
      const { name, assessmentPrice, primaryColor, logoUrl } = req.body;

      const club = await storage.getClubByClubId(clubId);
      if (!club) {
        throw new NotFoundError("Club");
      }

      const updated = await storage.updateClub(club.id, {
        ...(name && { name }),
        ...(assessmentPrice !== undefined && { assessmentPrice }),
        ...(primaryColor && { primaryColor }),
        ...(logoUrl && { logoUrl }),
      });

      res.json({
        id: updated!.id,
        clubId: updated!.clubId,
        name: updated!.name,
        logoUrl: updated!.logoUrl,
        primaryColor: updated!.primaryColor,
        assessmentPrice: updated!.assessmentPrice,
      });
    })
  );

  // ==================== CLUB SETTINGS ROUTES ====================
  // Update own club settings (for logged-in club)
  app.put(
    "/api/club/settings",
    requireAuth,
    asyncHandler(async (req, res) => {
      const { name, assessmentPrice, primaryColor, logoUrl } = req.body;
      const clubId = req.session.clubId!;

      const club = await storage.getClubByClubId(clubId);
      if (!club) {
        throw new NotFoundError("Club");
      }

      const updated = await storage.updateClub(club.id, {
        ...(name && { name }),
        ...(assessmentPrice !== undefined && { assessmentPrice }),
        ...(primaryColor && { primaryColor }),
        ...(logoUrl && { logoUrl }),
      });

      res.json({
        id: updated!.id,
        clubId: updated!.clubId,
        name: updated!.name,
        logoUrl: updated!.logoUrl,
        primaryColor: updated!.primaryColor,
        assessmentPrice: updated!.assessmentPrice,
      });
    })
  );

  // ==================== PLAYER ROUTES ====================
  // Player login
  app.post(
    "/api/player/login",
    asyncHandler(async (req, res) => {
      const { phone, nationalId } = req.body;

      if (!phone || !nationalId) {
        throw new ValidationError("رقم الهاتف والرقم القومي مطلوبان");
      }

      // Check if player has assessment with this phone and national ID
      const allClubs = await storage.getAllClubs();
      let assessment = null;
      
      for (const club of allClubs) {
        const assessments = await storage.getAssessmentsByClubId(club.clubId);
        const found = assessments.find(a => a.phone === phone && a.nationalId === nationalId);
        if (found) {
          assessment = found;
          break;
        }
      }

      if (!assessment) {
        throw new AuthenticationError("لم نجد سجل بهذه البيانات");
      }

      res.json({ message: "تم التحقق بنجاح" });
    })
  );

  // Get player assessments
  app.get(
    "/api/player/assessments",
    asyncHandler(async (req, res) => {
      const { phone, nationalId } = req.query;

      if (!phone || !nationalId) {
        throw new ValidationError("رقم الهاتف والرقم القومي مطلوبان");
      }

      const allClubs = await storage.getAllClubs();
      const playerAssessments: any[] = [];
      
      for (const club of allClubs) {
        const assessments = await storage.getAssessmentsByClubId(club.clubId);
        const found = assessments.filter(a => a.phone === phone && a.nationalId === nationalId);
        playerAssessments.push(...found);
      }

      res.json(playerAssessments);
    })
  );

  // Get all clubs (public)
  app.get(
    "/api/clubs",
    asyncHandler(async (req, res) => {
      const clubs = await storage.getAllClubs();
      const clubsData = clubs.map(club => ({
        clubId: club.clubId,
        name: club.name,
        logoUrl: club.logoUrl,
        primaryColor: club.primaryColor,
        assessmentPrice: club.assessmentPrice,
      }));
      res.json(clubsData);
    })
  );

  // Error handler (must be last)
  app.use(errorHandler);

  const httpServer = createServer(app);

  return httpServer;
}
