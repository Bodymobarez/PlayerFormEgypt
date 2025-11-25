import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { insertPlayerSchema, insertClubSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";

declare module "express-session" {
  interface SessionData {
    clubId?: string;
    clubUsername?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "egyptian-football-league-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  // Auth middleware
  function requireAuth(req: any, res: any, next: any) {
    if (!req.session.clubId) {
      return res.status(401).json({ message: "يجب تسجيل الدخول أولاً" });
    }
    next();
  }

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
      }

      const club = await storage.getClubByUsername(username);
      if (!club) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      const passwordMatch = await bcrypt.compare(password, club.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      req.session.clubId = club.clubId;
      req.session.clubUsername = club.username;

      res.json({
        club: {
          id: club.id,
          clubId: club.clubId,
          name: club.name,
          logoUrl: club.logoUrl,
          primaryColor: club.primaryColor,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج" });
      }
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.clubId) {
      return res.status(401).json({ message: "غير مسجل" });
    }

    try {
      const club = await storage.getClubByClubId(req.session.clubId);
      if (!club) {
        return res.status(404).json({ message: "النادي غير موجود" });
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
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  // Player routes
  app.post("/api/players", async (req, res) => {
    try {
      const validation = insertPlayerSchema.safeParse(req.body);
      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const player = await storage.createPlayer(validation.data);
      res.status(201).json(player);
    } catch (error) {
      console.error("Create player error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء حفظ بيانات اللاعب" });
    }
  });

  app.get("/api/players", requireAuth, async (req, res) => {
    try {
      const players = await storage.getPlayersByClubId(req.session.clubId!);
      res.json(players);
    } catch (error) {
      console.error("Get players error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
    }
  });

  app.delete("/api/players/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "معرف اللاعب غير صحيح" });
      }

      await storage.deletePlayer(id);
      res.json({ message: "تم حذف اللاعب بنجاح" });
    } catch (error) {
      console.error("Delete player error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
    }
  });

  // Admin routes to seed clubs (only in dev mode)
  if (process.env.NODE_ENV !== "production") {
    app.post("/api/admin/seed-clubs", async (req, res) => {
      try {
        const CLUBS_DATA = [
          { clubId: "al-ahly", name: "النادي الأهلي", logoUrl: "/logos/al_ahly.png", primaryColor: "hsl(354 70% 45%)", username: "ahly", password: "ahly123" },
          { clubId: "zamalek", name: "نادي الزمالك", logoUrl: "/logos/zamalek.png", primaryColor: "hsl(222 47% 11%)", username: "zamalek", password: "zamalek123" },
          { clubId: "pyramids", name: "نادي بيراميدز", logoUrl: "/logos/pyramids.png", primaryColor: "hsl(210 60% 30%)", username: "pyramids", password: "pyramids123" },
          { clubId: "al-masry", name: "النادي المصري", logoUrl: "/logos/al_masry.png", primaryColor: "hsl(140 60% 35%)", username: "masry", password: "masry123" },
        ];

        let added = 0;
        for (const clubData of CLUBS_DATA) {
          const existing = await storage.getClubByClubId(clubData.clubId);
          if (!existing) {
            const hashedPassword = await bcrypt.hash(clubData.password, 10);
            await storage.createClub({ ...clubData, password: hashedPassword });
            added++;
          }
        }
        
        res.json({ message: `تم إضافة ${added} أندية` });
      } catch (error) {
        console.error("Seed error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء إضافة البيانات" });
      }
    });
  }

  const httpServer = createServer(app);

  return httpServer;
}
