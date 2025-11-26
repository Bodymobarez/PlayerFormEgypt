import { db } from "./db";
import { clubs } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Seeding database...");

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
      clubId: "ceramica-cleopatra",
      name: "سيراميكا كليوباترا",
      logoUrl: "/logos/ceramica_cleopatra.png",
      primaryColor: "hsl(27 100% 50%)",
      username: "ceramica",
      password: "ceramica123",
      assessmentPrice: 4000,
    },
    {
      clubId: "bank-ahly",
      name: "البنك الأهلي المصري",
      logoUrl: "/logos/national_bank_of_egypt.png",
      primaryColor: "hsl(210 100% 50%)",
      username: "bankahly",
      password: "bankahly123",
      assessmentPrice: 4000,
    },
    {
      clubId: "zed-fc",
      name: "نادي زيد",
      logoUrl: "/logos/zed.png",
      primaryColor: "hsl(39 100% 50%)",
      username: "zed",
      password: "zed123",
      assessmentPrice: 3500,
    },
    {
      clubId: "petrojet",
      name: "بترجيت",
      logoUrl: "/logos/petrojet.png",
      primaryColor: "hsl(0 100% 50%)",
      username: "petrojet",
      password: "petrojet123",
      assessmentPrice: 4000,
    },
    {
      clubId: "modern-sport",
      name: "نادي الرياضة الحديثة",
      logoUrl: "/logos/modern_sport.png",
      primaryColor: "hsl(120 60% 40%)",
      username: "modernsport",
      password: "modernsport123",
      assessmentPrice: 3500,
    },
    {
      clubId: "el-gouna",
      name: "الجونة",
      logoUrl: "/logos/el_gouna.png",
      primaryColor: "hsl(0 100% 40%)",
      username: "gouna",
      password: "gouna123",
      assessmentPrice: 3500,
    },
    {
      clubId: "enppi",
      name: "إنبي",
      logoUrl: "/logos/enppi.png",
      primaryColor: "hsl(0 0% 0%)",
      username: "enppi",
      password: "enppi123",
      assessmentPrice: 3500,
    },
    {
      clubId: "ismaily",
      name: "الإسماعيلي",
      logoUrl: "/logos/ismaily.png",
      primaryColor: "hsl(0 100% 50%)",
      username: "ismaily",
      password: "ismaily123",
      assessmentPrice: 4000,
    },
    {
      clubId: "ghazl-mahalla",
      name: "غزل المحلة",
      logoUrl: "/logos/ghazl_el_mahalla.png",
      primaryColor: "hsl(210 100% 50%)",
      username: "ghazl",
      password: "ghazl123",
      assessmentPrice: 3500,
    },
    {
      clubId: "smouha",
      name: "سموحة",
      logoUrl: "/logos/smouha.png",
      primaryColor: "hsl(0 0% 100%)",
      username: "smouha",
      password: "smouha123",
      assessmentPrice: 3500,
    },
    {
      clubId: "al-ittihad-alex",
      name: "الاتحاد السكندري",
      logoUrl: "/logos/al_ittihad_alexandria.png",
      primaryColor: "hsl(220 80% 50%)",
      username: "ittihad",
      password: "ittihad123",
      assessmentPrice: 4000,
    },
    {
      clubId: "talaea-gaish",
      name: "طلائع الجيش",
      logoUrl: "/logos/tala_ea_el_gaish.png",
      primaryColor: "hsl(0 100% 50%)",
      username: "talaaea",
      password: "talaaea123",
      assessmentPrice: 3500,
    },
    {
      clubId: "pharco",
      name: "فارکو",
      logoUrl: "/logos/pharco.png",
      primaryColor: "hsl(220 100% 50%)",
      username: "pharco",
      password: "pharco123",
      assessmentPrice: 3500,
    },
    {
      clubId: "haras-hodoud",
      name: "حراس الحدود",
      logoUrl: "/logos/haras_el_hodoud.png",
      primaryColor: "hsl(210 70% 40%)",
      username: "harashodoud",
      password: "harashodoud123",
      assessmentPrice: 3500,
    },
  ];

  let seeded = 0;

  for (const clubData of CLUBS_DATA) {
    // Check if club already exists
    const existing = await db
      .select()
      .from(clubs)
      .where(eq(clubs.clubId, clubData.clubId));

    if (!existing || existing.length === 0) {
      const hashedPassword = await bcrypt.hash(clubData.password, 10);
      await db.insert(clubs).values({
        ...clubData,
        password: hashedPassword,
      });
      seeded++;
      console.log(`✓ Added club: ${clubData.name}`);
    } else {
      console.log(`- Club already exists: ${clubData.name}`);
    }
  }

  console.log(`\nDatabase seeding completed! Added ${seeded} clubs.`);
}

seedDatabase()
  .then(() => {
    console.log("Seeding finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
