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
