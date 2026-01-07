import { db } from "./db";
import { clubs, leagues } from "@shared/schema";
import bcrypt from "bcrypt";

const LEAGUES_DATA = [
  {
    leagueId: "egypt",
    name: "الدوري المصري",
    country: "مصر",
    currency: "EGP",
    currencySymbol: "ج.م",
  },
  {
    leagueId: "saudi",
    name: "دوري كأس الأمير محمد بن سلمان",
    country: "السعودية",
    currency: "SAR",
    currencySymbol: "﷼",
  },
  {
    leagueId: "uae",
    name: "دوري الاتحاد الإماراتي",
    country: "الإمارات",
    currency: "AED",
    currencySymbol: "د.إ",
  },
];

// سيراميكا كليوباترا فقط
const CLUBS_DATA = [
  {
    clubId: "ceramica-cleopatra",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(0 84% 48%)", // أحمر من اللوجو
    leagueId: "egypt",
    username: "ceramica",
    password: "ceramica123",
    assessmentPrice: 4000,
  },
];

async function seed() {
  console.log("🌱 Starting seed...");
  try {
    // Seed leagues
    for (const leagueData of LEAGUES_DATA) {
      await db.insert(leagues).values(leagueData).onConflictDoNothing();
      console.log(`✓ Added league: ${leagueData.name}`);
    }
    
    // Seed clubs
    for (const clubData of CLUBS_DATA) {
      const hashedPassword = await bcrypt.hash(clubData.password, 10);
      await db.insert(clubs).values({
        ...clubData,
        password: hashedPassword,
      }).onConflictDoNothing();
      console.log(`✓ Added ${clubData.name}`);
    }
    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
