import { storage } from "../storage";
import { cacheManager } from "../cache";

export class StatsService {
  private CACHE_TTL = 600000; // 10 minutes

  async getClubStats(clubId: string) {
    const cacheKey = `club-stats-${clubId}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const assessments = await storage.getAssessmentsByClubId(clubId);

    const stats = {
      summary: {
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
        conversionRate:
          assessments.length > 0
            ? (
                (assessments.filter((a) => a.paymentStatus === "completed")
                  .length /
                  assessments.length) *
                100
              ).toFixed(2)
            : "0",
      },
      byPosition: this.groupByPosition(assessments),
      byAge: this.groupByAge(assessments),
      byPaymentStatus: this.groupByPaymentStatus(assessments),
      recentRegistrations: assessments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((a) => ({
          id: a.id,
          name: a.fullName,
          position: a.position,
          paymentStatus: a.paymentStatus,
          createdAt: a.createdAt,
        })),
      topPositions: Object.entries(this.groupByPosition(assessments))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    };

    cacheManager.set(cacheKey, stats, this.CACHE_TTL);
    return stats;
  }

  async getPlatformStats() {
    const cacheKey = "platform-stats";
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    const clubs = await storage.getAllClubs();
    let totalAssessments = 0;
    let totalRevenue = 0;
    const clubStats = [];

    for (const club of clubs) {
      const assessments = await storage.getAssessmentsByClubId(club.clubId);
      const completed = assessments.filter(
        (a) => a.paymentStatus === "completed"
      ).length;
      const revenue = assessments
        .filter((a) => a.paymentStatus === "completed")
        .reduce((sum, a) => sum + a.assessmentPrice, 0);

      totalAssessments += assessments.length;
      totalRevenue += revenue;

      clubStats.push({
        clubId: club.clubId,
        clubName: club.name,
        totalRegistrations: assessments.length,
        completedPayments: completed,
        revenue,
      });
    }

    const stats = {
      totalClubs: clubs.length,
      totalAssessments,
      totalRevenue,
      averageRevenuePerClub: clubs.length > 0 ? totalRevenue / clubs.length : 0,
      averageRegistrationsPerClub:
        clubs.length > 0 ? totalAssessments / clubs.length : 0,
      clubStats: clubStats.sort((a, b) => b.revenue - a.revenue),
    };

    cacheManager.set(cacheKey, stats, this.CACHE_TTL);
    return stats;
  }

  private groupByPosition(assessments: any[]): Record<string, number> {
    const groups: Record<string, number> = {};
    assessments.forEach((a) => {
      groups[a.position] = (groups[a.position] || 0) + 1;
    });
    return groups;
  }

  private groupByAge(assessments: any[]): Record<string, number> {
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

  private groupByPaymentStatus(
    assessments: any[]
  ): Record<string, number> {
    const groups: Record<string, number> = {
      completed: 0,
      pending: 0,
      failed: 0,
    };
    assessments.forEach((a) => {
      groups[a.paymentStatus] = (groups[a.paymentStatus] || 0) + 1;
    });
    return groups;
  }

  invalidateStats(clubId?: string) {
    if (clubId) {
      cacheManager.invalidate(`club-stats-${clubId}`);
    } else {
      cacheManager.invalidate("platform-stats");
    }
  }
}

export const statsService = new StatsService();
