import { type User, type InsertUser, type Club, type InsertClub, type Assessment, type InsertAssessment } from "@shared/schema";

let users: User[] = [];
// All clubs with hashed passwords (generated with bcrypt)
let clubs: (Club)[] = [
  {
    id: 1,
    clubId: "al-ahly",
    name: "النادي الأهلي",
    logoUrl: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)",
    username: "ahly",
    password: "$2b$10$dtHKjQHDh9pdcnb0hIcDXejPcWGmjmZEnjiyCiAj6fX1pFQZo5a9K", // password: "ahly123"
    assessmentPrice: 5000,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    clubId: "zamalek",
    name: "نادي الزمالك",
    logoUrl: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)",
    username: "zamalek",
    password: "$2b$10$ys.vYCLcSFSUKsFUDm3gpeZTTaaFbheDjAbRku.oopc2/0/KvVZUW", // password: "zamalek123"
    assessmentPrice: 5000,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 3,
    clubId: "pyramids",
    name: "نادي بيراميدز",
    logoUrl: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)",
    username: "pyramids",
    password: "$2b$10$QUWdAtXZ52gNb7H5ocrsMuHnxKqQXkysOGSxjemnKBNmgp1AzNJhu", // password: "pyramids123"
    assessmentPrice: 4500,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 4,
    clubId: "al-masry",
    name: "النادي المصري",
    logoUrl: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)",
    username: "masry",
    password: "$2b$10$TAm4ZTtgoKz02U1js4u.DuB1erUyDMNWmR27m9qvaRhd1T4Csxunq", // password: "masry123"
    assessmentPrice: 4500,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date("2025-01-01"),
  },
];
let assessments: Assessment[] = [];
let nextUserId = 1;
let nextAssessmentId = 5;

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getClub(id: number): Promise<Club | undefined>;
  getClubByUsername(username: string): Promise<Club | undefined>;
  getClubByClubId(clubId: string): Promise<Club | undefined>;
  getAllClubs(): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, updates: Partial<Club>): Promise<Club | undefined>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByClubId(clubId: string): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment & { assessmentPrice: number }): Promise<Assessment>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<void>;
}

export class MemoryStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return users.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find((u) => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user-${nextUserId++}`,
      ...user,
    };
    users.push(newUser);
    return newUser;
  }

  async getClub(id: number): Promise<Club | undefined> {
    return clubs.find((c) => c.id === id);
  }

  async getClubByUsername(username: string): Promise<Club | undefined> {
    return clubs.find((c) => c.username === username);
  }

  async getClubByClubId(clubId: string): Promise<Club | undefined> {
    return clubs.find((c) => c.clubId === clubId);
  }

  async getAllClubs(): Promise<Club[]> {
    return [...clubs];
  }

  async createClub(club: InsertClub): Promise<Club> {
    const newClub: Club = {
      id: clubs.length + 1,
      ...club,
      stripeProductId: null,
      stripePriceId: null,
      createdAt: new Date(),
    } as Club;
    clubs.push(newClub);
    return newClub;
  }

  async updateClub(id: number, updates: Partial<Club>): Promise<Club | undefined> {
    const club = clubs.find((c) => c.id === id);
    if (club) {
      Object.assign(club, updates);
    }
    return club;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return assessments.find((a) => a.id === id);
  }

  async getAssessmentsByClubId(clubId: string): Promise<Assessment[]> {
    return assessments.filter((a) => a.clubId === clubId);
  }

  async createAssessment(
    assessment: InsertAssessment & { assessmentPrice: number }
  ): Promise<Assessment> {
    const newAssessment: Assessment = {
      id: nextAssessmentId++,
      ...assessment,
      paymentStatus: "pending",
      createdAt: new Date(),
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
    } as Assessment;
    assessments.push(newAssessment);
    return newAssessment;
  }

  async updateAssessment(
    id: number,
    updates: Partial<Assessment>
  ): Promise<Assessment | undefined> {
    const assessment = assessments.find((a) => a.id === id);
    if (assessment) {
      Object.assign(assessment, updates);
    }
    return assessment;
  }

  async deleteAssessment(id: number): Promise<void> {
    assessments = assessments.filter((a) => a.id !== id);
  }

  // Add some sample assessments with various statuses for testing
  async initializeSampleData(): Promise<void> {
    if (assessments.length === 0) {
      // Add sample assessments with different result statuses
      assessments = [
        {
          id: 5,
          clubId: "al-ahly",
          fullName: "علي محمود أحمد",
          birthDate: "2005-05-15",
          birthPlace: "القاهرة",
          nationalId: "30005151234567",
          address: "القاهرة - مصر الجديدة",
          phone: "01012345678",
          guardianPhone: "01087654321",
          guardianName: "محمود أحمد",
          school: "مدرسة النيل",
          position: "مهاجم",
          height: "175",
          weight: "70",
          previousClub: "نادي الجزيرة",
          medicalHistory: "لا توجد",
          paymentStatus: "completed",
          assessmentPrice: 5000,
          assessmentDate: new Date("2025-02-01"),
          assessmentLocation: "ملعب النادي الأهلي",
          assessmentStatus: "completed",
          resultStatus: "accepted",
          stripeCheckoutSessionId: null,
          stripePaymentIntentId: null,
          notes: "أداء ممتاز",
          createdAt: new Date("2025-01-15"),
          updatedAt: new Date("2025-01-30"),
        },
        {
          id: 6,
          clubId: "zamalek",
          fullName: "محمد أحمد علي",
          birthDate: "2006-08-20",
          birthPlace: "الإسكندرية",
          nationalId: "30006201234567",
          address: "الإسكندرية - سيدي بشر",
          phone: "01098765432",
          guardianPhone: "01056789123",
          guardianName: "أحمد علي",
          school: "مدرسة الإسكندرية",
          position: "لاعب وسط",
          height: "172",
          weight: "68",
          previousClub: "نادي الشرقية",
          medicalHistory: "لا توجد",
          paymentStatus: "completed",
          assessmentPrice: 5000,
          assessmentDate: new Date("2025-02-05"),
          assessmentLocation: "ملعب الزمالك",
          assessmentStatus: "completed",
          resultStatus: "rejected",
          stripeCheckoutSessionId: null,
          stripePaymentIntentId: null,
          notes: "يحتاج تطوير في التمرير",
          createdAt: new Date("2025-01-10"),
          updatedAt: new Date("2025-01-28"),
        },
        {
          id: 7,
          clubId: "pyramids",
          fullName: "يوسف محمد أحمد",
          birthDate: "2005-12-10",
          birthPlace: "المنيا",
          nationalId: "30005121234567",
          address: "المنيا",
          phone: "01123456789",
          guardianPhone: "01145678901",
          guardianName: "محمد أحمد",
          school: "مدرسة المنيا",
          position: "حارس",
          height: "188",
          weight: "75",
          previousClub: "نادي المنيا",
          medicalHistory: "لا توجد",
          paymentStatus: "pending",
          assessmentPrice: 4500,
          assessmentDate: null,
          assessmentLocation: null,
          assessmentStatus: "registered",
          resultStatus: null,
          stripeCheckoutSessionId: null,
          stripePaymentIntentId: null,
          notes: null,
          createdAt: new Date("2025-01-20"),
          updatedAt: new Date("2025-01-20"),
        },
      ];
    }
  }
}

export const storage = new MemoryStorage();

// Initialize sample data
storage.initializeSampleData();
