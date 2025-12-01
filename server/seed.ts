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

const CLUBS_DATA = [
  // Egyptian League
  {
    clubId: "al-ahly",
    name: "النادي الأهلي",
    logoUrl: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)",
    leagueId: "egypt",
    username: "ahly",
    password: "ahly123",
    assessmentPrice: 5000,
  },
  {
    clubId: "zamalek",
    name: "نادي الزمالك",
    logoUrl: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)",
    leagueId: "egypt",
    username: "zamalek",
    password: "zamalek123",
    assessmentPrice: 5000,
  },
  {
    clubId: "pyramids",
    name: "نادي بيراميدز",
    logoUrl: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)",
    leagueId: "egypt",
    username: "pyramids",
    password: "pyramids123",
    assessmentPrice: 4500,
  },
  {
    clubId: "al-masry",
    name: "النادي المصري",
    logoUrl: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)",
    leagueId: "egypt",
    username: "masry",
    password: "masry123",
    assessmentPrice: 4500,
  },
  {
    clubId: "ismaily",
    name: "النادي الإسماعيلي",
    logoUrl: "/logos/ismaily.png",
    primaryColor: "hsl(45 90% 50%)",
    leagueId: "egypt",
    username: "ismaily",
    password: "ismaily123",
    assessmentPrice: 4500,
  },
  {
    clubId: "al-ittihad",
    name: "نادي الاتحاد السكندري",
    logoUrl: "/logos/al_ittihad_alexandria.png",
    primaryColor: "hsl(140 60% 35%)",
    leagueId: "egypt",
    username: "ittihad",
    password: "ittihad123",
    assessmentPrice: 4500,
  },
  {
    clubId: "modern-sport",
    name: "مودرن سبورت",
    logoUrl: "/logos/modern_sport.png",
    primaryColor: "hsl(350 70% 40%)",
    leagueId: "egypt",
    username: "modern",
    password: "modern123",
    assessmentPrice: 4000,
  },
  {
    clubId: "smouha",
    name: "نادي سموحة",
    logoUrl: "/logos/smouha.png",
    primaryColor: "hsl(215 80% 45%)",
    leagueId: "egypt",
    username: "smouha",
    password: "smouha123",
    assessmentPrice: 4500,
  },
  {
    clubId: "zed",
    name: "نادي زد (ZED)",
    logoUrl: "/logos/zed.png",
    primaryColor: "hsl(150 100% 40%)",
    leagueId: "egypt",
    username: "zed",
    password: "zed123",
    assessmentPrice: 4000,
  },
  {
    clubId: "ceramica",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(40 60% 45%)",
    leagueId: "egypt",
    username: "ceramica",
    password: "ceramica123",
    assessmentPrice: 4000,
  },
  {
    clubId: "enppi",
    name: "نادي إنبي",
    logoUrl: "/logos/enppi.png",
    primaryColor: "hsl(200 70% 30%)",
    leagueId: "egypt",
    username: "enppi",
    password: "enppi123",
    assessmentPrice: 4000,
  },
  {
    clubId: "talaea",
    name: "طلائع الجيش",
    logoUrl: "/logos/tala_ea_el_gaish.png",
    primaryColor: "hsl(0 0% 20%)",
    leagueId: "egypt",
    username: "talaea",
    password: "talaea123",
    assessmentPrice: 4000,
  },
  // Saudi Pro League
  {
    clubId: "al-hilal",
    name: "نادي الهلال السعودي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/Al_Hilal_FC_logo.png",
    primaryColor: "hsl(0 0% 0%)",
    leagueId: "saudi",
    username: "al-hilal",
    password: "hilal123",
    assessmentPrice: 6000,
  },
  {
    clubId: "al-nassr",
    name: "نادي النصر",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d7/Al_Nassr_FC_Logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "saudi",
    username: "al-nassr",
    password: "nassr123",
    assessmentPrice: 5500,
  },
  {
    clubId: "al-faisaly",
    name: "نادي الفيصلي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/98/Al_Faisaly_FC_Logo.png",
    primaryColor: "hsl(0 0% 0%)",
    leagueId: "saudi",
    username: "al-faisaly",
    password: "faisaly123",
    assessmentPrice: 5000,
  },
  {
    clubId: "al-ahli-saudi",
    name: "نادي الأهلي السعودي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0e/AlAhli_FC_Logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "saudi",
    username: "al-ahli-saudi",
    password: "ahli-saudi123",
    assessmentPrice: 5500,
  },
  {
    clubId: "al-shabab",
    name: "نادي الشباب السعودي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/fa/Al_Shabab_FC_logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "saudi",
    username: "al-shabab",
    password: "shabab123",
    assessmentPrice: 5000,
  },
  {
    clubId: "al-taawon",
    name: "نادي التعاون",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/0f/Al_Taawon_FC_Logo.png",
    primaryColor: "hsl(38 100% 50%)",
    leagueId: "saudi",
    username: "al-taawon",
    password: "taawon123",
    assessmentPrice: 4500,
  },
  {
    clubId: "al-ittihad-saudi",
    name: "نادي الاتحاد السعودي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/f/f0/Al_Ittihad_FC_logo.png",
    primaryColor: "hsl(0 0% 0%)",
    leagueId: "saudi",
    username: "al-ittihad-saudi",
    password: "ittihad-saudi123",
    assessmentPrice: 5500,
  },
  {
    clubId: "al-raed",
    name: "نادي الريد",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d8/Al-Raed_FC_Logo.png",
    primaryColor: "hsl(3 100% 45%)",
    leagueId: "saudi",
    username: "al-raed",
    password: "raed123",
    assessmentPrice: 4500,
  },
  // UAE Pro League
  {
    clubId: "al-ain",
    name: "نادي العين",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/6/60/Al_Ain_FC_logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "uae",
    username: "al-ain",
    password: "ain123",
    assessmentPrice: 5500,
  },
  {
    clubId: "al-ahli-uae",
    name: "نادي الأهلي الإماراتي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/04/Al_Ahli_UAE_FC_logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "uae",
    username: "al-ahli-uae",
    password: "ahli-uae123",
    assessmentPrice: 5500,
  },
  {
    clubId: "sharjah",
    name: "نادي الشارقة",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/7/70/Sharjah_FC_Logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "uae",
    username: "sharjah",
    password: "sharjah123",
    assessmentPrice: 5000,
  },
  {
    clubId: "dubai-fc",
    name: "نادي دبي",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/c4/Dubai_FC_logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "uae",
    username: "dubai-fc",
    password: "dubai123",
    assessmentPrice: 5000,
  },
  {
    clubId: "fujairah",
    name: "نادي الفجيرة",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/4/47/Fujairah_FC_Logo.png",
    primaryColor: "hsl(120 100% 25%)",
    leagueId: "uae",
    username: "fujairah",
    password: "fujairah123",
    assessmentPrice: 4500,
  },
  {
    clubId: "khor-fakkan",
    name: "نادي خورفكان",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/09/Khorfakkan_FC_Logo.png",
    primaryColor: "hsl(270 100% 35%)",
    leagueId: "uae",
    username: "khor-fakkan",
    password: "khor123",
    assessmentPrice: 4500,
  },
  {
    clubId: "ras-khaimah",
    name: "نادي رأس الخيمة",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/35/RAS_KHAIMAH_FC.png",
    primaryColor: "hsl(120 100% 40%)",
    leagueId: "uae",
    username: "ras-khaimah",
    password: "ras123",
    assessmentPrice: 4500,
  },
  {
    clubId: "umm-al-quwain",
    name: "نادي أم القيوين",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/3f/Umm_Al_Quwain_FC_Logo.png",
    primaryColor: "hsl(0 100% 50%)",
    leagueId: "uae",
    username: "umm-al-quwain",
    password: "umm123",
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
