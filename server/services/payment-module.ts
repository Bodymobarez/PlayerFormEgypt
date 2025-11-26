import Stripe from "stripe";
import { getStripeSecretKey } from "../stripe-client";
import { storage } from "../storage";
import { PaymentError } from "../errors";

export type PaymentMethod = "card" | "vodafone_cash" | "anistapaي" | "e_wallet" | "bank_transfer";

export interface PaymentConfig {
  assessmentId: number;
  clubId: string;
  amount: number; // in EGP cents
  playerName: string;
  playerPhone: string;
  playerEmail: string;
  method: PaymentMethod;
}

export interface PaymentSession {
  id: string;
  method: PaymentMethod;
  assessmentId: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  redirectUrl?: string;
  instructions?: string;
  reference?: string;
  createdAt: Date;
  expiresAt: Date;
}

// Simulated payment sessions storage (in production, use database)
const paymentSessions = new Map<string, PaymentSession>();

export class PaymentModule {
  private stripe: Stripe | null = null;

  async getStripeClient(): Promise<Stripe> {
    if (!this.stripe) {
      const secretKey = await getStripeSecretKey();
      this.stripe = new Stripe(secretKey);
    }
    return this.stripe;
  }

  async createPaymentSession(config: PaymentConfig): Promise<PaymentSession> {
    const sessionId = `${config.method}-${config.assessmentId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    switch (config.method) {
      case "card":
        return this.createStripeSession(config, sessionId);
      case "vodafone_cash":
        return this.createVodafoneCashSession(config, sessionId);
      case "anistapaي":
        return this.createAnistaPaySession(config, sessionId);
      case "e_wallet":
        return this.createEWalletSession(config, sessionId);
      case "bank_transfer":
        return this.createBankTransferSession(config, sessionId);
      default:
        throw new PaymentError("Unsupported payment method");
    }
  }

  private async createStripeSession(
    config: PaymentConfig,
    sessionId: string
  ): Promise<PaymentSession> {
    try {
      const stripe = await this.getStripeClient();
      const club = await storage.getClubByClubId(config.clubId);

      if (!club) {
        throw new PaymentError("Club not found");
      }

      const successUrl = `${process.env.APP_URL || "http://localhost:5000"}/payment-success?session_id={CHECKOUT_SESSION_ID}&method=card`;
      const cancelUrl = `${process.env.APP_URL || "http://localhost:5000"}/payment-methods?assessment_id=${config.assessmentId}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "egp",
              unit_amount: config.amount,
              product_data: {
                name: `اختبار ${club.name}`,
                description: `تسجيل اللاعب ${config.playerName}`,
                images: club.logoUrl ? [club.logoUrl] : [],
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          assessmentId: config.assessmentId.toString(),
          clubId: config.clubId,
          method: "card",
        },
      });

      await storage.updateAssessment(config.assessmentId, {
        stripeCheckoutSessionId: session.id,
      });

      const paymentSession: PaymentSession = {
        id: sessionId,
        method: "card",
        assessmentId: config.assessmentId,
        amount: config.amount,
        status: "pending",
        redirectUrl: session.url || undefined,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      paymentSessions.set(sessionId, paymentSession);
      return paymentSession;
    } catch (error) {
      throw new PaymentError(`Stripe error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private createVodafoneCashSession(config: PaymentConfig, sessionId: string): PaymentSession {
    const amountEgp = config.amount / 100;
    const reference = Math.random().toString(36).substring(2, 10).toUpperCase();

    const session: PaymentSession = {
      id: sessionId,
      method: "vodafone_cash",
      assessmentId: config.assessmentId,
      amount: config.amount,
      status: "pending",
      reference,
      instructions: `
        رقم الاستقبال: ${reference}
        المبلغ: ${amountEgp.toFixed(2)} جنيه مصري
        
        خطوات الدفع:
        1. اتصل ب *111# من هاتف فودافون
        2. اختر "تحويل أموال" أو "دفع فواتير"
        3. ادخل الرقم: ${config.playerPhone}
        4. ادخل المبلغ: ${amountEgp.toFixed(2)} جنيه
        5. أدخل رقم المرجع: ${reference}
      `,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    paymentSessions.set(sessionId, session);
    return session;
  }

  private createAnistaPaySession(config: PaymentConfig, sessionId: string): PaymentSession {
    const reference = Math.random().toString(36).substring(2, 15).toUpperCase();

    const session: PaymentSession = {
      id: sessionId,
      method: "anistapaي",
      assessmentId: config.assessmentId,
      amount: config.amount,
      status: "pending",
      reference,
      instructions: `
        رقم المرجع: ${reference}
        المبلغ: ${(config.amount / 100).toFixed(2)} جنيه مصري
        
        خطوات الدفع:
        1. افتح تطبيق AnistaPay على هاتفك
        2. اختر "دفع الفواتير"
        3. ادخل رقم المرجع: ${reference}
        4. تحقق من البيانات
        5. أتمم عملية الدفع
      `,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    paymentSessions.set(sessionId, session);
    return session;
  }

  private createEWalletSession(config: PaymentConfig, sessionId: string): PaymentSession {
    const reference = `EW-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const session: PaymentSession = {
      id: sessionId,
      method: "e_wallet",
      assessmentId: config.assessmentId,
      amount: config.amount,
      status: "pending",
      reference,
      instructions: `
        رقم المرجع: ${reference}
        المبلغ: ${(config.amount / 100).toFixed(2)} جنيه مصري
        
        خطوات الدفع:
        1. استخدم محفظتك الإلكترونية المفضلة
        2. ادخل رقم المرجع: ${reference}
        3. ادخل المبلغ المطلوب
        4. أتمم عملية التحويل
        
        الخدمات المدعومة:
        - فودافون كاش
        - اتصالات كاش
        - أورنج موني
      `,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    paymentSessions.set(sessionId, session);
    return session;
  }

  private createBankTransferSession(config: PaymentConfig, sessionId: string): PaymentSession {
    const reference = `BANK-${config.assessmentId}-${Date.now()}`.substring(0, 20);

    const session: PaymentSession = {
      id: sessionId,
      method: "bank_transfer",
      assessmentId: config.assessmentId,
      amount: config.amount,
      status: "pending",
      reference,
      instructions: `
        رقم المرجع: ${reference}
        المبلغ: ${(config.amount / 100).toFixed(2)} جنيه مصري
        
        بيانات الحساب البنكي:
        اسم الحساب: Soccer Hunters
        رقم الحساب: 1234567890
        رقم التحويل الدولي (IBAN): EG1234567890123456789012
        كود البنك: CBEGEGCX
        اسم البنك: البنك الأهلي المصري
        
        عند التحويل، استخدم المرجع: ${reference}
        سيتم تأكيد الدفع تلقائياً عند استقبال المبلغ
      `,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    paymentSessions.set(sessionId, session);
    return session;
  }

  getPaymentSession(sessionId: string): PaymentSession | undefined {
    return paymentSessions.get(sessionId);
  }

  async verifyPayment(sessionId: string): Promise<PaymentSession | null> {
    const session = paymentSessions.get(sessionId);

    if (!session) {
      return null;
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      return null;
    }

    // For card payments, verify with Stripe
    if (session.method === "card") {
      const stripe = await this.getStripeClient();
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (stripeSession.payment_status === "paid") {
        session.status = "completed";
        await storage.updateAssessment(session.assessmentId, {
          paymentStatus: "completed",
        });
      }
    }

    return session;
  }

  async completePayment(sessionId: string): Promise<void> {
    const session = paymentSessions.get(sessionId);

    if (!session) {
      throw new PaymentError("Payment session not found");
    }

    session.status = "completed";

    await storage.updateAssessment(session.assessmentId, {
      paymentStatus: "completed",
    });
  }

  getPaymentMethods(): Array<{ id: PaymentMethod; name: string; icon: string; description: string }> {
    return [
      {
        id: "card",
        name: "البطاقة الائتمانية",
        icon: "💳",
        description: "الدفع عبر بطاقة ائتمانية أو بطاقة خصم",
      },
      {
        id: "vodafone_cash",
        name: "فودافون كاش",
        icon: "📱",
        description: "تحويل أموال من محفظة فودافون كاش",
      },
      {
        id: "anistapaي",
        name: "AnistaPay",
        icon: "💰",
        description: "الدفع عبر تطبيق AnistaPay",
      },
      {
        id: "e_wallet",
        name: "المحفظة الإلكترونية",
        icon: "🏦",
        description: "الدفع عبر محافظك الإلكترونية",
      },
      {
        id: "bank_transfer",
        name: "تحويل بنكي",
        icon: "🏛️",
        description: "التحويل المباشر من حسابك البنكي",
      },
    ];
  }
}

export const paymentModule = new PaymentModule();
