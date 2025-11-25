import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { insertAssessmentSchema, insertClubSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { getStripeSecretKey } from "./stripe-client";

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

  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const validation = insertAssessmentSchema.safeParse(req.body);
      if (!validation.success) {
        const error = fromZodError(validation.error);
        return res.status(400).json({ message: error.message });
      }

      const assessment = await storage.createAssessment({
        ...validation.data,
        assessmentPrice: req.body.assessmentPrice,
      });

      // Create Stripe checkout session
      try {
        const stripe = new Stripe(await getStripeSecretKey());
        const club = await storage.getClubByClubId(validation.data.clubId);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "egp",
                unit_amount: req.body.assessmentPrice,
                product_data: {
                  name: `اختبار ${club?.name || "النادي"}`,
                  description: `تسجيل اللاعب ${validation.data.fullName}`,
                },
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${req.protocol}://${req.get('host')}/checkout?session_id={CHECKOUT_SESSION_ID}&assessment_id=${assessment.id}`,
          cancel_url: `${req.protocol}://${req.get('host')}/`,
          metadata: {
            assessmentId: assessment.id.toString(),
          },
        });

        res.status(201).json({
          assessment,
          checkoutUrl: session.url,
        });
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        res.status(201).json({ assessment, checkoutUrl: null });
      }
    } catch (error) {
      console.error("Create assessment error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء حفظ البيانات" });
    }
  });

  app.get("/api/assessments", requireAuth, async (req, res) => {
    try {
      const assessments = await storage.getAssessmentsByClubId(req.session.clubId!);
      res.json(assessments);
    } catch (error) {
      console.error("Get assessments error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات" });
    }
  });

  app.delete("/api/assessments/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "معرف الاختبار غير صحيح" });
      }

      await storage.deleteAssessment(id);
      res.json({ message: "تم حذف السجل بنجاح" });
    } catch (error) {
      console.error("Delete assessment error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
    }
  });

  app.get("/api/checkout/status", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        return res.status(400).json({ message: "معرف الجلسة مطلوب" });
      }

      const stripe = new Stripe(await getStripeSecretKey());
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        const assessmentId = session.metadata?.assessmentId;
        if (assessmentId) {
          const assessment = await storage.getAssessment(parseInt(assessmentId));
          if (assessment) {
            await storage.updateAssessment(parseInt(assessmentId), {
              paymentStatus: "completed",
              stripeCheckoutSessionId: sessionId,
            });
          }
        }
        res.json({
          paymentStatus: "completed",
          assessmentId,
        });
      } else {
        res.json({ paymentStatus: "pending" });
      }
    } catch (error) {
      console.error("Checkout status error:", error);
      res.status(500).json({ message: "حدث خطأ" });
    }
  });

  // Admin routes to seed clubs (dev only)
  if (process.env.NODE_ENV !== "production") {
    app.post("/api/admin/seed-clubs", async (req, res) => {
      try {
        const CLUBS_DATA = [
          { clubId: "al-ahly", name: "النادي الأهلي", logoUrl: "/logos/al_ahly.png", primaryColor: "hsl(354 70% 45%)", username: "ahly", password: "ahly123", assessmentPrice: 5000 },
          { clubId: "zamalek", name: "نادي الزمالك", logoUrl: "/logos/zamalek.png", primaryColor: "hsl(222 47% 11%)", username: "zamalek", password: "zamalek123", assessmentPrice: 5000 },
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
