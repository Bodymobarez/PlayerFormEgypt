import Stripe from "stripe";
import { getStripeSecretKey } from "../stripe-client";
import { storage } from "../storage";
import { StripeError, PaymentError } from "../errors";

export class PaymentService {
  private stripe: Stripe | null = null;

  async getStripeClient(): Promise<Stripe> {
    if (!this.stripe) {
      const secretKey = await getStripeSecretKey();
      this.stripe = new Stripe(secretKey);
    }
    return this.stripe;
  }

  async createCheckoutSession(
    assessmentId: number,
    clubId: string,
    amount: number,
    playerName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string | null; sessionId: string }> {
    try {
      const stripe = await this.getStripeClient();
      const club = await storage.getClubByClubId(clubId);

      if (!club) {
        throw new PaymentError("Club not found");
      }

      const sessionParams: any = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "egp",
              unit_amount: amount,
              product_data: {
                name: `اختبار ${club.name}`,
                description: `تسجيل اللاعب ${playerName}`,
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
          assessmentId: assessmentId.toString(),
          clubId,
        },
        billing_address_collection: "auto",
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      // Update assessment with Stripe session ID
      await storage.updateAssessment(assessmentId, {
        stripeCheckoutSessionId: session.id,
      });

      return {
        url: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new StripeError(error.message, {
          stripeCode: error.code,
          stripeType: error.type,
        });
      }
      throw error;
    }
  }

  async verifyCheckoutSession(
    sessionId: string
  ): Promise<{
    paymentStatus: "paid" | "unpaid" | "no_payment_required";
    assessmentId?: number;
    amount: number;
    customerEmail?: string;
  }> {
    try {
      const stripe = await this.getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent", "customer"],
      });

      const assessmentId = session.metadata?.assessmentId
        ? parseInt(session.metadata.assessmentId)
        : undefined;

      // Update assessment payment status
      if (assessmentId) {
        await storage.updateAssessment(assessmentId, {
          paymentStatus:
            session.payment_status === "paid" ? "completed" : "pending",
          stripeCheckoutSessionId: sessionId,
        });
      }

      return {
        paymentStatus: session.payment_status as any,
        assessmentId,
        amount: session.amount_total || 0,
        customerEmail:
          typeof session.customer_email === "string"
            ? session.customer_email
            : undefined,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new StripeError("Failed to verify payment session", {
          stripeCode: error.code,
        });
      }
      throw error;
    }
  }

  async handlePaymentIntentSucceeded(
    paymentIntentId: string
  ): Promise<void> {
    try {
      const stripe = await this.getStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        { expand: ["charges"] }
      );

      // Update assessment with payment intent ID
      const assessmentId = paymentIntent.metadata?.assessmentId
        ? parseInt(paymentIntent.metadata.assessmentId)
        : null;

      if (assessmentId) {
        await storage.updateAssessment(assessmentId, {
          paymentStatus: "completed",
          stripePaymentIntentId: paymentIntentId,
        });
      }
    } catch (error) {
      console.error("Error handling payment intent:", error);
      throw error;
    }
  }

  async handlePaymentIntentFailed(paymentIntentId: string): Promise<void> {
    try {
      const assessmentId = await this.getAssessmentIdFromPaymentIntent(
        paymentIntentId
      );

      if (assessmentId) {
        await storage.updateAssessment(assessmentId, {
          paymentStatus: "failed",
        });
      }
    } catch (error) {
      console.error("Error handling payment failure:", error);
      throw error;
    }
  }

  private async getAssessmentIdFromPaymentIntent(
    paymentIntentId: string
  ): Promise<number | null> {
    try {
      const stripe = await this.getStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent.metadata?.assessmentId
        ? parseInt(paymentIntent.metadata.assessmentId)
        : null;
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();
