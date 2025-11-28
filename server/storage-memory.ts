import { type User, type InsertUser, type Club, type InsertClub, type Assessment, type InsertAssessment, type Player, type InsertPlayer } from "@shared/schema";

let users: User[] = [];
let playersList: Player[] = [];
let nextPlayerId = 1;
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
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;
  deleteClub(id: number): Promise<void>;
  getClub(id: number): Promise<Club | undefined>;
  getClubByUsername(username: string): Promise<Club | undefined>;
  getClubByClubId(clubId: string): Promise<Club | undefined>;
  getAllClubs(): Promise<Club[]>;
  createClub(club: InsertClub): Promise<Club>;
  updateClub(id: number, updates: Partial<Club>): Promise<Club | undefined>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAssessmentsByClubId(clubId: string): Promise<Assessment[]>;
  getAssessmentsByPlayerId(playerId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment & { assessmentPrice: number; playerId?: number }): Promise<Assessment>;
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

  async getPlayer(id: number): Promise<Player | undefined> {
    return playersList.find((p) => p.id === id);
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    return playersList.find((p) => p.username === username);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const newPlayer: Player = {
      id: nextPlayerId++,
      username: player.username,
      password: player.password,
      fullName: player.fullName,
      email: player.email || null,
      phone: player.phone,
      photoUrl: player.photoUrl || null,
      createdAt: new Date(),
    };
    playersList.push(newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined> {
    const player = playersList.find((p) => p.id === id);
    if (player) {
      Object.assign(player, updates);
    }
    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return [...playersList];
  }

  async deletePlayer(id: number): Promise<void> {
    const index = playersList.findIndex((p) => p.id === id);
    if (index !== -1) {
      playersList.splice(index, 1);
    }
  }

  async deleteClub(id: number): Promise<void> {
    const index = clubs.findIndex((c) => c.id === id);
    if (index !== -1) {
      clubs.splice(index, 1);
    }
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

  async getAssessmentsByPlayerId(playerId: number): Promise<Assessment[]> {
    return assessments.filter((a) => a.playerId === playerId);
  }

  async createAssessment(
    assessment: InsertAssessment & { assessmentPrice: number; playerId?: number }
  ): Promise<Assessment> {
    const newAssessment: Assessment = {
      id: nextAssessmentId++,
      ...assessment,
      playerId: assessment.playerId || null,
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
      // Add sample assessments from multiple governorates
      assessments = [
        // القاهرة
        { id: 5, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "علي محمود أحمد", birthDate: "2005-05-15", birthPlace: "القاهرة", nationalId: "30005151234567", address: "القاهرة - مصر الجديدة", phone: "01012345678", guardianPhone: "01087654321", guardianName: "محمود أحمد", school: "مدرسة النيل", position: "مهاجم", height: "175", weight: "70", previousClub: "نادي الجزيرة", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-01"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "أداء ممتاز", createdAt: new Date("2025-01-15"), updatedAt: new Date("2025-01-30") },
        { id: 6, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "محمد عزت إبراهيم", birthDate: "2006-03-22", birthPlace: "القاهرة", nationalId: "30006032234567", address: "القاهرة - العباسية", phone: "01087654321", guardianPhone: "01012345678", guardianName: "عزت إبراهيم", school: "مدرسة الشروق", position: "لاعب وسط", height: "168", weight: "65", previousClub: "نادي الترجي", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-03"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "جيد جداً", createdAt: new Date("2025-01-12"), updatedAt: new Date("2025-01-28") },
        { id: 7, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "أحمد سعيد كامل", birthDate: "2005-07-10", birthPlace: "القاهرة", nationalId: "30005071234567", address: "القاهرة - الدقي", phone: "01156789012", guardianPhone: "01234567890", guardianName: "سعيد كامل", school: "مدرسة الرحاب", position: "مدافع", height: "180", weight: "75", previousClub: null, medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-25"), updatedAt: new Date("2025-01-25") },
        { id: 8, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "حسن أحمد محمد", birthDate: "2006-01-15", birthPlace: "القاهرة", nationalId: "30006011234567", address: "القاهرة - الشيخ زايد", phone: "01198765432", guardianPhone: "01187654321", guardianName: "أحمد محمد", school: "مدرسة المستقبل", position: "مهاجم", height: "172", weight: "68", previousClub: "نادي الهلال", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-02"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "يحتاج تحسن", createdAt: new Date("2025-01-18"), updatedAt: new Date("2025-01-26") },
        
        // الإسكندرية
        { id: 9, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "محمد أحمد علي", birthDate: "2006-08-20", birthPlace: "الإسكندرية", nationalId: "30006201234567", address: "الإسكندرية - سيدي بشر", phone: "01098765432", guardianPhone: "01056789123", guardianName: "أحمد علي", school: "مدرسة الإسكندرية", position: "لاعب وسط", height: "172", weight: "68", previousClub: "نادي الشرقية", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-05"), assessmentLocation: "ملعب الزمالك", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "يحتاج تطوير", createdAt: new Date("2025-01-10"), updatedAt: new Date("2025-01-28") },
        { id: 10, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "عمر شرقاوي حسن", birthDate: "2005-11-05", birthPlace: "الإسكندرية", nationalId: "30005110234567", address: "الإسكندرية - المنتزه", phone: "01167890123", guardianPhone: "01145678901", guardianName: "شرقاوي حسن", school: "مدرسة الفيروز", position: "حارس", height: "190", weight: "80", previousClub: "نادي الشرطة", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-22"), updatedAt: new Date("2025-01-22") },
        { id: 11, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "علاء الدين محمود", birthDate: "2005-06-18", birthPlace: "الإسكندرية", nationalId: "30005061234567", address: "الإسكندرية - الدخيلة", phone: "01178901234", guardianPhone: "01167890123", guardianName: "محمود إسماعيل", school: "مدرسة المجد", position: "مدافع", height: "176", weight: "72", previousClub: "نادي فلاح", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-04"), assessmentLocation: "ملعب الزمالك", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "أداء جيد", createdAt: new Date("2025-01-16"), updatedAt: new Date("2025-01-29") },
        
        // الجيزة
        { id: 12, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "يوسف محمد أحمد", birthDate: "2005-12-10", birthPlace: "الجيزة", nationalId: "30005121234567", address: "الجيزة - الهرم", phone: "01189012345", guardianPhone: "01156789012", guardianName: "محمد أحمد", school: "مدرسة النيل", position: "مهاجم", height: "173", weight: "69", previousClub: "نادي الشرقية", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-06"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "ممتاز", createdAt: new Date("2025-01-19"), updatedAt: new Date("2025-01-31") },
        { id: 13, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "طارق محمد حسني", birthDate: "2006-04-08", birthPlace: "الجيزة", nationalId: "30006040234567", address: "الجيزة - الشيخ زايد", phone: "01190123456", guardianPhone: "01178901234", guardianName: "محمد حسني", school: "مدرسة القاهرة", position: "لاعب وسط", height: "169", weight: "66", previousClub: "نادي الزمالك", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-23"), updatedAt: new Date("2025-01-23") },
        
        // المنيا
        { id: 14, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "صابر السيد علي", birthDate: "2005-09-03", birthPlace: "المنيا", nationalId: "30005090234567", address: "المنيا - مركز المنيا", phone: "01167890123", guardianPhone: "01145678901", guardianName: "السيد علي", school: "مدرسة المنيا الثانوية", position: "حارس", height: "187", weight: "78", previousClub: "نادي المنيا", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-07"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "انعكاسات جيدة", createdAt: new Date("2025-01-14"), updatedAt: new Date("2025-01-27") },
        { id: 15, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "فادي كمال عطية", birthDate: "2006-02-25", birthPlace: "المنيا", nationalId: "30006022234567", address: "المنيا - مركز سمالوط", phone: "01178901234", guardianPhone: "01156789012", guardianName: "كمال عطية", school: "مدرسة المستقبل", position: "مدافع", height: "174", weight: "71", previousClub: null, medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-24"), updatedAt: new Date("2025-01-24") },
        
        // القليوبية
        { id: 16, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "رضا محمود سالم", birthDate: "2005-08-12", birthPlace: "القليوبية", nationalId: "30005081234567", address: "القليوبية - بنها", phone: "01189012345", guardianPhone: "01167890123", guardianName: "محمود سالم", school: "مدرسة بنها", position: "مهاجم", height: "171", weight: "67", previousClub: "نادي النجم", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-08"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "جهود طيبة", createdAt: new Date("2025-01-17"), updatedAt: new Date("2025-01-25") },
        
        // الفيوم
        { id: 17, playerId: null, playerPhotoUrl: null, clubId: "al-ahly", fullName: "وائل إسماعيل منصور", birthDate: "2006-05-30", birthPlace: "الفيوم", nationalId: "30006053234567", address: "الفيوم - القاهرة الجديدة", phone: "01190123456", guardianPhone: "01178901234", guardianName: "إسماعيل منصور", school: "مدرسة الفيوم", position: "لاعب وسط", height: "170", weight: "65", previousClub: "نادي الفيوم", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-21"), updatedAt: new Date("2025-01-21") },
      ];
      nextAssessmentId = 18;
    }
  }
}

export const storage = new MemoryStorage();

// Initialize sample data
storage.initializeSampleData();
