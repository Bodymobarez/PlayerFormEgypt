import { db } from "./db";
import { clubs } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Seeding database...");

  // سيراميكا كليوباترا فقط
  const CLUBS_DATA = [
    {
      clubId: "ceramica-cleopatra",
      name: "سيراميكا كليوباترا",
      logoUrl: "/logos/ceramica_cleopatra.png",
      primaryColor: "hsl(0 84% 48%)", // أحمر من اللوجو
      username: "ceramica",
      password: "ceramica123",
      assessmentPrice: 4000,
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
