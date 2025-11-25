import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
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
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "soccer-hunters-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
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

  // ==================== ASSESSMENT ROUTES ====================
  app.post(
    "/api/assessments",
    asyncHandler(async (req, res) => {
      const data = validateData(assessmentSchema, req.body) as any;

      const assessment = await assessmentService.createAssessment(data);

      // Invalidate stats cache
      statsService.invalidateStats(data.clubId);

      // Create Stripe checkout session
      const { url: checkoutUrl, sessionId } =
        await paymentService.createCheckoutSession(
          assessment.id,
          data.clubId,
          data.assessmentPrice,
          data.fullName,
          `${req.protocol}://${req.get("host")}/checkout?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessment.id}`,
          `${req.protocol}://${req.get("host")}/`
        );

      res.status(201).json({
        assessment,
        checkoutUrl,
        sessionId,
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

  // Error handler (must be last)
  app.use(errorHandler);

  const httpServer = createServer(app);

  return httpServer;
}
