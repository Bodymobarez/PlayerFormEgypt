import { db } from "./db";
import { clubs } from "@shared/schema";
import bcrypt from "bcrypt";

const CLUBS_DATA = [
  {
    clubId: "al-ahly",
    name: "النادي الأهلي",
    logoUrl: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)",
    username: "ahly",
    password: "ahly123",
    assessmentPrice: 5000,
  },
  {
    clubId: "zamalek",
    name: "نادي الزمالك",
    logoUrl: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)",
    username: "zamalek",
    password: "zamalek123",
    assessmentPrice: 5000,
  },
  {
    clubId: "pyramids",
    name: "نادي بيراميدز",
    logoUrl: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)",
    username: "pyramids",
    password: "pyramids123",
    assessmentPrice: 4500,
  },
  {
    clubId: "al-masry",
    name: "النادي المصري",
    logoUrl: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)",
    username: "masry",
    password: "masry123",
    assessmentPrice: 4500,
  },
  {
    clubId: "ismaily",
    name: "النادي الإسماعيلي",
    logoUrl: "/logos/ismaily.png",
    primaryColor: "hsl(45 90% 50%)",
    username: "ismaily",
    password: "ismaily123",
    assessmentPrice: 4500,
  },
  {
    clubId: "al-ittihad",
    name: "نادي الاتحاد السكندري",
    logoUrl: "/logos/al_ittihad_alexandria.png",
    primaryColor: "hsl(140 60% 35%)",
    username: "ittihad",
    password: "ittihad123",
    assessmentPrice: 4500,
  },
  {
    clubId: "modern-sport",
    name: "مودرن سبورت",
    logoUrl: "/logos/modern_sport.png",
    primaryColor: "hsl(350 70% 40%)",
    username: "modern",
    password: "modern123",
    assessmentPrice: 4000,
  },
  {
    clubId: "smouha",
    name: "نادي سموحة",
    logoUrl: "/logos/smouha.png",
    primaryColor: "hsl(215 80% 45%)",
    username: "smouha",
    password: "smouha123",
    assessmentPrice: 4500,
  },
  {
    clubId: "zed",
    name: "نادي زد (ZED)",
    logoUrl: "/logos/zed.png",
    primaryColor: "hsl(150 100% 40%)",
    username: "zed",
    password: "zed123",
    assessmentPrice: 4000,
  },
  {
    clubId: "ceramica",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(40 60% 45%)",
    username: "ceramica",
    password: "ceramica123",
    assessmentPrice: 4000,
  },
  {
    clubId: "enppi",
    name: "نادي إنبي",
    logoUrl: "/logos/enppi.png",
    primaryColor: "hsl(200 70% 30%)",
    username: "enppi",
    password: "enppi123",
    assessmentPrice: 4000,
  },
  {
    clubId: "talaea",
    name: "طلائع الجيش",
    logoUrl: "/logos/tala_ea_el_gaish.png",
    primaryColor: "hsl(0 0% 20%)",
    username: "talaea",
    password: "talaea123",
    assessmentPrice: 4000,
  },
];

async function seed() {
  console.log("🌱 Starting seed...");
  try {
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
