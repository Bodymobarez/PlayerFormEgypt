import { storage } from "../storage";

export class ExportService {
  async exportAssessmentsCSV(clubId: string): Promise<string> {
    const assessments = await storage.getAssessmentsByClubId(clubId);

    const headers = [
      "رقم التسجيل",
      "الاسم الكامل",
      "الرقم القومي",
      "تاريخ الميلاد",
      "المركز",
      "الهاتف",
      "الطول",
      "الوزن",
      "النادي السابق",
      "حالة الدفع",
      "تاريخ التسجيل",
    ];

    const rows = assessments.map((a) => [
      a.id,
      a.fullName,
      a.nationalId,
      a.birthDate,
      a.position,
      a.phone,
      a.height || "-",
      a.weight || "-",
      a.previousClub || "-",
      this.getPaymentStatusArabic(a.paymentStatus),
      new Date(a.createdAt).toLocaleDateString("ar-EG"),
    ]);

    let csv = headers.map((h) => `"${h}"`).join(",") + "\n";
    csv += rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    return csv;
  }

  async exportAssessmentsJSON(clubId: string): Promise<any> {
    const assessments = await storage.getAssessmentsByClubId(clubId);
    const club = await storage.getClubByClubId(clubId);

    return {
      club: {
        id: club?.clubId,
        name: club?.name,
        exportDate: new Date().toISOString(),
      },
      summary: {
        total: assessments.length,
        completed: assessments.filter((a) => a.paymentStatus === "completed")
          .length,
        pending: assessments.filter((a) => a.paymentStatus === "pending").length,
        failed: assessments.filter((a) => a.paymentStatus === "failed").length,
      },
      data: assessments.map((a) => ({
        id: a.id,
        name: a.fullName,
        nationalId: a.nationalId,
        birthDate: a.birthDate,
        position: a.position,
        contact: {
          phone: a.phone,
          guardianPhone: a.guardianPhone,
          guardianName: a.guardianName,
        },
        physical: {
          height: a.height,
          weight: a.weight,
        },
        background: {
          previousClub: a.previousClub,
          medicalHistory: a.medicalHistory,
        },
        payment: {
          status: a.paymentStatus,
          amount: a.assessmentPrice,
        },
        registeredAt: a.createdAt,
      })),
    };
  }

  private getPaymentStatusArabic(
    status: string
  ): string {
    const statusMap: Record<string, string> = {
      completed: "مكتمل",
      pending: "قيد الانتظار",
      failed: "فشل",
    };
    return statusMap[status] || status;
  }
}

export const exportService = new ExportService();
