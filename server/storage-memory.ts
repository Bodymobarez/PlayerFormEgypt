import { type User, type InsertUser, type Club, type InsertClub, type Assessment, type InsertAssessment, type Team, type InsertTeam, type Player, type InsertPlayer } from "@shared/schema";

let users: User[] = [];
let teams: Team[] = [];
let players: Player[] = [];
// Egyptian Premier League 2024-25 - 18 Teams with Wikipedia logos
let clubs: (Club)[] = [
  { id: 1, clubId: "al-ahly", name: "النادي الأهلي", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/70/Al_Ahly_SC_logo.svg", primaryColor: "hsl(354 70% 45%)", username: "ahly", password: "$2b$10$dtHKjQHDh9pdcnb0hIcDXejPcWGmjmZEnjiyCiAj6fX1pFQZo5a9K", assessmentPrice: 5000, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 2, clubId: "zamalek", name: "نادي الزمالك", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/ef/Zamalek_SC_logo.svg", primaryColor: "hsl(222 47% 11%)", username: "zamalek", password: "$2b$10$ys.vYCLcSFSUKsFUDm3gpeZTTaaFbheDjAbRku.oopc2/0/KvVZUW", assessmentPrice: 5000, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 3, clubId: "pyramids", name: "نادي بيراميدز", logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/87/Pyramids_FC_%282020%29.png", primaryColor: "hsl(210 60% 30%)", username: "pyramids", password: "$2b$10$QUWdAtXZ52gNb7H5ocrsMuHnxKqQXkysOGSxjemnKBNmgp1AzNJhu", assessmentPrice: 4500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 4, clubId: "al-masry", name: "النادي المصري", logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/90/Al_Masry_SC.png", primaryColor: "hsl(140 60% 35%)", username: "masry", password: "$2b$10$TAm4ZTtgoKz02U1js4u.DuB1erUyDMNWmR27m9qvaRhd1T4Csxunq", assessmentPrice: 4500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 5, clubId: "ismaily", name: "النادي الإسماعيلي", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7d/Ismaily_SC.png", primaryColor: "hsl(45 90% 50%)", username: "ismaily", password: "$2b$10$1QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 4000, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 6, clubId: "al-ittihad", name: "الاتحاد السكندري", logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/Ittihad_of_Alexandria.png", primaryColor: "hsl(340 60% 40%)", username: "ittihad", password: "$2b$10$2QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 7, clubId: "nbe", name: "البنك الأهلي", logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/5e/National_Bank_of_Egypt_SC.png", primaryColor: "hsl(220 70% 40%)", username: "nbe", password: "$2b$10$3QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 8, clubId: "ceramica", name: "سيراميكا كليوباترا", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c0/Ceramica_Cleopatra_FC.png", primaryColor: "hsl(30 75% 45%)", username: "ceramica", password: "$2b$10$4QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 9, clubId: "enppi", name: "إنبي", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/ENPPI_SC_Logo.svg", primaryColor: "hsl(200 75% 45%)", username: "enppi", password: "$2b$10$5QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 10, clubId: "modern-sport", name: "مودرن سبورت", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Modern_Sport_FC.png", primaryColor: "hsl(270 70% 40%)", username: "modern", password: "$2b$10$6QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 11, clubId: "talaea-el-gaish", name: "طلائع الجيش", logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a4/Tala%27ea_El_Gaish_SC.png", primaryColor: "hsl(0 0% 20%)", username: "talaea", password: "$2b$10$7QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 12, clubId: "zed", name: "زد", logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/ZED_FC.png", primaryColor: "hsl(260 70% 50%)", username: "zed", password: "$2b$10$8QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 13, clubId: "pharco", name: "فاركو", logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/9d/Pharco_FC.png", primaryColor: "hsl(200 80% 45%)", username: "pharco", password: "$2b$10$9QxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 14, clubId: "el-gouna", name: "الجونة", logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e0/El_Gouna_FC.png", primaryColor: "hsl(45 90% 50%)", username: "gouna", password: "$2b$10$aQxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 15, clubId: "ghazl-mahalla", name: "غزل المحلة", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/7f/Ghazl_El_Mahalla_SC.png", primaryColor: "hsl(0 85% 50%)", username: "ghazl", password: "$2b$10$bQxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 16, clubId: "petrojet", name: "بتروجيت", logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0f/Petrojet_SC.png", primaryColor: "hsl(45 85% 45%)", username: "petrojet", password: "$2b$10$cQxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 17, clubId: "smouha", name: "سموحة", logoUrl: "https://upload.wikimedia.org/wikipedia/en/1/1a/Smouha_SC.png", primaryColor: "hsl(200 70% 40%)", username: "smouha", password: "$2b$10$dQxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
  { id: 18, clubId: "haras-el-hodoud", name: "حرس الحدود", logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/73/Haras_El_Hodoud_SC.png", primaryColor: "hsl(120 50% 40%)", username: "haras", password: "$2b$10$eQxQw9q.vV3m.qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9qQq9q", assessmentPrice: 3500, stripeProductId: null, stripePriceId: null, createdAt: new Date("2025-01-01") },
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
  getTeamsByClubId(clubId: string): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, updates: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<void>;
  getPlayersByTeamId(teamId: number): Promise<Player[]>;
  getPlayersByClubId(clubId: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;
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

  async getTeamsByClubId(clubId: string): Promise<Team[]> {
    return teams.filter((t) => t.clubId === clubId);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const newTeam: Team = {
      id: teams.length + 1,
      ...team,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Team;
    teams.push(newTeam);
    return newTeam;
  }

  async updateTeam(id: number, updates: Partial<Team>): Promise<Team | undefined> {
    const team = teams.find((t) => t.id === id);
    if (team) {
      Object.assign(team, updates);
    }
    return team;
  }

  async deleteTeam(id: number): Promise<void> {
    teams = teams.filter((t) => t.id !== id);
  }

  async getPlayersByTeamId(teamId: number): Promise<Player[]> {
    return players.filter((p) => p.teamId === teamId);
  }

  async getPlayersByClubId(clubId: string): Promise<Player[]> {
    return players.filter((p) => p.clubId === clubId);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const newPlayer: Player = {
      id: players.length + 1,
      ...player,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Player;
    players.push(newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: number, updates: Partial<Player>): Promise<Player | undefined> {
    const player = players.find((p) => p.id === id);
    if (player) {
      Object.assign(player, updates);
    }
    return player;
  }

  async deletePlayer(id: number): Promise<void> {
    players = players.filter((p) => p.id !== id);
  }

  // Add some sample assessments with various statuses for testing
  async initializeSampleData(): Promise<void> {
    if (assessments.length === 0) {
      // Add sample assessments from multiple governorates
      assessments = [
        // القاهرة
        { id: 5, clubId: "al-ahly", fullName: "علي محمود أحمد", birthDate: "2005-05-15", birthPlace: "القاهرة", nationalId: "30005151234567", address: "القاهرة - مصر الجديدة", phone: "01012345678", guardianPhone: "01087654321", guardianName: "محمود أحمد", school: "مدرسة النيل", position: "مهاجم", height: "175", weight: "70", previousClub: "نادي الجزيرة", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-01"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "أداء ممتاز", createdAt: new Date("2025-01-15"), updatedAt: new Date("2025-01-30") },
        { id: 6, clubId: "al-ahly", fullName: "محمد عزت إبراهيم", birthDate: "2006-03-22", birthPlace: "القاهرة", nationalId: "30006032234567", address: "القاهرة - العباسية", phone: "01087654321", guardianPhone: "01012345678", guardianName: "عزت إبراهيم", school: "مدرسة الشروق", position: "لاعب وسط", height: "168", weight: "65", previousClub: "نادي الترجي", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-03"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "جيد جداً", createdAt: new Date("2025-01-12"), updatedAt: new Date("2025-01-28") },
        { id: 7, clubId: "al-ahly", fullName: "أحمد سعيد كامل", birthDate: "2005-07-10", birthPlace: "القاهرة", nationalId: "30005071234567", address: "القاهرة - الدقي", phone: "01156789012", guardianPhone: "01234567890", guardianName: "سعيد كامل", school: "مدرسة الرحاب", position: "مدافع", height: "180", weight: "75", previousClub: null, medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-25"), updatedAt: new Date("2025-01-25") },
        { id: 8, clubId: "al-ahly", fullName: "حسن أحمد محمد", birthDate: "2006-01-15", birthPlace: "القاهرة", nationalId: "30006011234567", address: "القاهرة - الشيخ زايد", phone: "01198765432", guardianPhone: "01187654321", guardianName: "أحمد محمد", school: "مدرسة المستقبل", position: "مهاجم", height: "172", weight: "68", previousClub: "نادي الهلال", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-02"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "يحتاج تحسن", createdAt: new Date("2025-01-18"), updatedAt: new Date("2025-01-26") },
        
        // الإسكندرية
        { id: 9, clubId: "al-ahly", fullName: "محمد أحمد علي", birthDate: "2006-08-20", birthPlace: "الإسكندرية", nationalId: "30006201234567", address: "الإسكندرية - سيدي بشر", phone: "01098765432", guardianPhone: "01056789123", guardianName: "أحمد علي", school: "مدرسة الإسكندرية", position: "لاعب وسط", height: "172", weight: "68", previousClub: "نادي الشرقية", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-05"), assessmentLocation: "ملعب الزمالك", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "يحتاج تطوير", createdAt: new Date("2025-01-10"), updatedAt: new Date("2025-01-28") },
        { id: 10, clubId: "al-ahly", fullName: "عمر شرقاوي حسن", birthDate: "2005-11-05", birthPlace: "الإسكندرية", nationalId: "30005110234567", address: "الإسكندرية - المنتزه", phone: "01167890123", guardianPhone: "01145678901", guardianName: "شرقاوي حسن", school: "مدرسة الفيروز", position: "حارس", height: "190", weight: "80", previousClub: "نادي الشرطة", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-22"), updatedAt: new Date("2025-01-22") },
        { id: 11, clubId: "al-ahly", fullName: "علاء الدين محمود", birthDate: "2005-06-18", birthPlace: "الإسكندرية", nationalId: "30005061234567", address: "الإسكندرية - الدخيلة", phone: "01178901234", guardianPhone: "01167890123", guardianName: "محمود إسماعيل", school: "مدرسة المجد", position: "مدافع", height: "176", weight: "72", previousClub: "نادي فلاح", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-04"), assessmentLocation: "ملعب الزمالك", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "أداء جيد", createdAt: new Date("2025-01-16"), updatedAt: new Date("2025-01-29") },
        
        // الجيزة
        { id: 12, clubId: "al-ahly", fullName: "يوسف محمد أحمد", birthDate: "2005-12-10", birthPlace: "الجيزة", nationalId: "30005121234567", address: "الجيزة - الهرم", phone: "01189012345", guardianPhone: "01156789012", guardianName: "محمد أحمد", school: "مدرسة النيل", position: "مهاجم", height: "173", weight: "69", previousClub: "نادي الشرقية", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-06"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "ممتاز", createdAt: new Date("2025-01-19"), updatedAt: new Date("2025-01-31") },
        { id: 13, clubId: "al-ahly", fullName: "طارق محمد حسني", birthDate: "2006-04-08", birthPlace: "الجيزة", nationalId: "30006040234567", address: "الجيزة - الشيخ زايد", phone: "01190123456", guardianPhone: "01178901234", guardianName: "محمد حسني", school: "مدرسة القاهرة", position: "لاعب وسط", height: "169", weight: "66", previousClub: "نادي الزمالك", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-23"), updatedAt: new Date("2025-01-23") },
        
        // المنيا
        { id: 14, clubId: "al-ahly", fullName: "صابر السيد علي", birthDate: "2005-09-03", birthPlace: "المنيا", nationalId: "30005090234567", address: "المنيا - مركز المنيا", phone: "01167890123", guardianPhone: "01145678901", guardianName: "السيد علي", school: "مدرسة المنيا الثانوية", position: "حارس", height: "187", weight: "78", previousClub: "نادي المنيا", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-07"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "accepted", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "انعكاسات جيدة", createdAt: new Date("2025-01-14"), updatedAt: new Date("2025-01-27") },
        { id: 15, clubId: "al-ahly", fullName: "فادي كمال عطية", birthDate: "2006-02-25", birthPlace: "المنيا", nationalId: "30006022234567", address: "المنيا - مركز سمالوط", phone: "01178901234", guardianPhone: "01156789012", guardianName: "كمال عطية", school: "مدرسة المستقبل", position: "مدافع", height: "174", weight: "71", previousClub: null, medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-24"), updatedAt: new Date("2025-01-24") },
        
        // القليوبية
        { id: 16, clubId: "al-ahly", fullName: "رضا محمود سالم", birthDate: "2005-08-12", birthPlace: "القليوبية", nationalId: "30005081234567", address: "القليوبية - بنها", phone: "01189012345", guardianPhone: "01167890123", guardianName: "محمود سالم", school: "مدرسة بنها", position: "مهاجم", height: "171", weight: "67", previousClub: "نادي النجم", medicalHistory: "لا توجد", paymentStatus: "completed", assessmentPrice: 5000, assessmentDate: new Date("2025-02-08"), assessmentLocation: "ملعب النادي الأهلي", assessmentStatus: "completed", resultStatus: "rejected", stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: "جهود طيبة", createdAt: new Date("2025-01-17"), updatedAt: new Date("2025-01-25") },
        
        // الفيوم
        { id: 17, clubId: "al-ahly", fullName: "وائل إسماعيل منصور", birthDate: "2006-05-30", birthPlace: "الفيوم", nationalId: "30006053234567", address: "الفيوم - القاهرة الجديدة", phone: "01190123456", guardianPhone: "01178901234", guardianName: "إسماعيل منصور", school: "مدرسة الفيوم", position: "لاعب وسط", height: "170", weight: "65", previousClub: "نادي الفيوم", medicalHistory: "لا توجد", paymentStatus: "pending", assessmentPrice: 5000, assessmentDate: null, assessmentLocation: null, assessmentStatus: "registered", resultStatus: null, stripeCheckoutSessionId: null, stripePaymentIntentId: null, notes: null, createdAt: new Date("2025-01-21"), updatedAt: new Date("2025-01-21") },
      ];
      nextAssessmentId = 18;
    }
  }
}

export const storage = new MemoryStorage();

// Initialize sample data
storage.initializeSampleData();
