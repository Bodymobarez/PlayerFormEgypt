import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class NotificationService {
  private transporter: any;

  constructor() {
    // Configure email transporter
    const emailService = process.env.EMAIL_SERVICE || "gmail";
    
    if (emailService === "smtp") {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      // Default: Gmail or other service via environment variables
      this.transporter = nodemailer.createTransport({
        service: emailService,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async sendRegistrationConfirmation(
    playerEmail: string,
    playerName: string,
    clubName: string,
    assessmentDate?: string
  ): Promise<void> {
    if (!process.env.EMAIL_USER) {
      console.log(`[EMAIL SIMULATION] Registration confirmation would be sent to: ${playerEmail}`);
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تم تسجيلك بنجاح</h2>
        <p>مرحباً ${playerName},</p>
        <p>تم استقبال طلب التسجيل الخاص بك في <strong>${clubName}</strong>.</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>بيانات التسجيل:</strong></p>
          <ul>
            <li>النادي: ${clubName}</li>
            <li>الاسم: ${playerName}</li>
            <li>الحالة: في انتظار الدفع</li>
            ${assessmentDate ? `<li>موعد الاختبار: ${assessmentDate}</li>` : ""}
          </ul>
        </div>
        <p>سيتم إخطارك برسالة بريدية عند إتمام الدفع وتأكيد موعد الاختبار.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          © Soccer Hunters - منصة اختبارات اللاعبين
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: playerEmail,
        subject: `تأكيد التسجيل في ${clubName}`,
        html,
      });
      console.log(`Email sent to ${playerEmail}`);
    } catch (error) {
      console.error("Email send error:", error);
    }
  }

  async sendPaymentConfirmation(
    playerEmail: string,
    playerName: string,
    clubName: string,
    amount: number
  ): Promise<void> {
    if (!process.env.EMAIL_USER) {
      console.log(`[EMAIL SIMULATION] Payment confirmation would be sent to: ${playerEmail}`);
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>تم استقبال الدفع بنجاح</h2>
        <p>مرحباً ${playerName},</p>
        <p>شكراً لك على دفع رسم التسجيل. تم استقبال دفعتك بنجاح.</p>
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #4caf50;">
          <p><strong>بيانات الدفع:</strong></p>
          <ul>
            <li>النادي: ${clubName}</li>
            <li>المبلغ: ${amount} ج.م</li>
            <li>الحالة: <span style="color: #4caf50; font-weight: bold;">مكتمل ✓</span></li>
          </ul>
        </div>
        <p>سيتم التواصل معك قريباً لتحديد موعد الاختبار والتفاصيل المتعلقة به.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          © Soccer Hunters - منصة اختبارات اللاعبين
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: playerEmail,
        subject: `تأكيد الدفع - ${clubName}`,
        html,
      });
      console.log(`Payment confirmation sent to ${playerEmail}`);
    } catch (error) {
      console.error("Email send error:", error);
    }
  }

  async sendChatNotification(
    playerEmail: string,
    playerName: string,
    clubName: string,
    message: string
  ): Promise<void> {
    if (!process.env.EMAIL_USER) {
      console.log(`[EMAIL SIMULATION] Chat notification would be sent to: ${playerEmail}`);
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
        <h2>رسالة جديدة من الدعم الفني</h2>
        <p>مرحباً ${playerName},</p>
        <p>لديك رسالة جديدة من فريق دعم ${clubName}:</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #2196f3;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p><a href="https://soccerhunters.com" style="color: #2196f3; text-decoration: none;">اضغط هنا للرد على الرسالة</a></p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          © Soccer Hunters - منصة اختبارات اللاعبين
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: playerEmail,
        subject: `رسالة جديدة من ${clubName}`,
        html,
      });
    } catch (error) {
      console.error("Email send error:", error);
    }
  }
}

export const notificationService = new NotificationService();
