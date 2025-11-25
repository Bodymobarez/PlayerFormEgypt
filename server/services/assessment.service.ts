import { storage } from "../storage";
import { NotFoundError, ValidationError } from "../errors";
import type { InsertAssessment } from "@shared/schema";

export class AssessmentService {
  async createAssessment(data: InsertAssessment & { assessmentPrice: number }) {
    // Validate assessment data
    if (!data.clubId || !data.fullName || !data.nationalId) {
      throw new ValidationError("Missing required assessment fields");
    }

    // Check for duplicate registration (same national ID + same club)
    const existingAssessments = await storage.getAssessmentsByClubId(data.clubId);
    const duplicate = existingAssessments.find(
      (a) => a.nationalId === data.nationalId
    );

    if (duplicate) {
      throw new ValidationError(
        "This player is already registered for this club's assessment",
        { nationalId: data.nationalId }
      );
    }

    return await storage.createAssessment(data);
  }

  async getAssessmentsByClub(clubId: string) {
    const assessments = await storage.getAssessmentsByClubId(clubId);
    return assessments.map((a) => this.sanitizeAssessment(a));
  }

  async getAssessmentStats(clubId: string) {
    const assessments = await storage.getAssessmentsByClubId(clubId);

    const stats = {
      totalRegistrations: assessments.length,
      completedPayments: assessments.filter(
        (a) => a.paymentStatus === "completed"
      ).length,
      pendingPayments: assessments.filter(
        (a) => a.paymentStatus === "pending"
      ).length,
      failedPayments: assessments.filter(
        (a) => a.paymentStatus === "failed"
      ).length,
      totalRevenue: assessments
        .filter((a) => a.paymentStatus === "completed")
        .reduce((sum, a) => sum + a.assessmentPrice, 0),
      byPosition: this.groupByPosition(assessments),
      byAge: this.groupByAge(assessments),
    };

    return stats;
  }

  async deleteAssessment(id: number, clubId: string) {
    const assessment = await storage.getAssessment(id);
    if (!assessment) {
      throw new NotFoundError("Assessment");
    }

    if (assessment.clubId !== clubId) {
      throw new ValidationError("Cannot delete assessment from another club");
    }

    await storage.deleteAssessment(id);
  }

  private sanitizeAssessment(assessment: any) {
    return {
      id: assessment.id,
      fullName: assessment.fullName,
      nationalId: assessment.nationalId,
      position: assessment.position,
      phone: assessment.phone,
      birthDate: assessment.birthDate,
      paymentStatus: assessment.paymentStatus,
      assessmentPrice: assessment.assessmentPrice,
      createdAt: assessment.createdAt,
    };
  }

  private groupByPosition(
    assessments: any[]
  ): Record<string, number> {
    const groups: Record<string, number> = {};
    assessments.forEach((a) => {
      groups[a.position] = (groups[a.position] || 0) + 1;
    });
    return groups;
  }

  private groupByAge(
    assessments: any[]
  ): Record<string, number> {
    const groups: Record<string, number> = {};
    assessments.forEach((a) => {
      const birthDate = new Date(a.birthDate);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      const ageGroup =
        age < 12 ? "U12" : age < 15 ? "U15" : age < 18 ? "U18" : "Adult";
      groups[ageGroup] = (groups[ageGroup] || 0) + 1;
    });
    return groups;
  }
}

export const assessmentService = new AssessmentService();
