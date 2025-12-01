import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

function getCurrencySymbol(leagueId?: string): string {
  switch (leagueId) {
    case "saudi":
      return "﷼";
    case "uae":
      return "د.إ";
    case "egypt":
    default:
      return "ج.م";
  }
}

export interface Club {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  assessmentPrice: number;
  leagueId?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
}

export const LEAGUES: League[] = [
  {
    id: "egypt",
    name: "الدوري المصري",
    country: "مصر",
    currency: "EGP",
    currencySymbol: "ج.م",
  },
  {
    id: "saudi",
    name: "دوري كأس الأمير محمد بن سلمان",
    country: "السعودية",
    currency: "SAR",
    currencySymbol: "﷼",
  },
  {
    id: "uae",
    name: "دوري الاتحاد الإماراتي",
    country: "الإمارات",
    currency: "AED",
    currencySymbol: "د.إ",
  },
];

export const CLUBS: Club[] = [
  // Egyptian League Clubs
  {
    id: "al-ahly",
    name: "النادي الأهلي",
    logoUrl: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)",
    assessmentPrice: 5000,
    leagueId: "egypt",
  },
  {
    id: "zamalek",
    name: "نادي الزمالك",
    logoUrl: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)",
    assessmentPrice: 5000,
    leagueId: "egypt",
  },
  {
    id: "pyramids",
    name: "نادي بيراميدز",
    logoUrl: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)",
    assessmentPrice: 4500,
    leagueId: "egypt",
  },
  {
    id: "al-masry",
    name: "النادي المصري",
    logoUrl: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)",
    assessmentPrice: 4500,
    leagueId: "egypt",
  },
  {
    id: "ceramica-cleopatra",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(27 100% 50%)",
    assessmentPrice: 4000,
    leagueId: "egypt",
  },
  {
    id: "bank-ahly",
    name: "البنك الأهلي المصري",
    logoUrl: "/logos/national_bank_of_egypt.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 4000,
    leagueId: "egypt",
  },
  {
    id: "zed-fc",
    name: "نادي زيد",
    logoUrl: "/logos/zed.png",
    primaryColor: "hsl(39 100% 50%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "petrojet",
    name: "بترجيت",
    logoUrl: "/logos/petrojet.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 4000,
    leagueId: "egypt",
  },
  {
    id: "modern-sport",
    name: "مودرن سبورت",
    logoUrl: "/logos/modern_sport.png",
    primaryColor: "hsl(120 60% 40%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "el-gouna",
    name: "الجونة",
    logoUrl: "/logos/el_gouna.png",
    primaryColor: "hsl(0 100% 40%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "enppi",
    name: "إنبي",
    logoUrl: "/logos/enppi.png",
    primaryColor: "hsl(0 0% 0%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "ismaily",
    name: "الإسماعيلي",
    logoUrl: "/logos/ismaily.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 4000,
    leagueId: "egypt",
  },
  {
    id: "ghazl-mahalla",
    name: "غزل المحلة",
    logoUrl: "/logos/ghazl_el_mahalla.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "smouha",
    name: "سموحة",
    logoUrl: "/logos/smouha.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "al-ittihad-alex",
    name: "الاتحاد السكندري",
    logoUrl: "/logos/al_ittihad_alexandria.png",
    primaryColor: "hsl(220 80% 50%)",
    assessmentPrice: 4000,
    leagueId: "egypt",
  },
  {
    id: "talaea-gaish",
    name: "طلائع الجيش",
    logoUrl: "/logos/tala_ea_el_gaish.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  {
    id: "pharco",
    name: "فارکو",
    logoUrl: "/logos/pharco.png",
    primaryColor: "hsl(220 100% 50%)",
    assessmentPrice: 3500,
  },
  {
    id: "haras-hodoud",
    name: "حرس الحدود",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Haras_El_Hodoud_logo_2018.png",
    primaryColor: "hsl(210 70% 40%)",
    assessmentPrice: 4000,
  },
  {
    id: "wadi-degla",
    name: "وادي دجلة",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/08/Wadi_Degla_Logo.png",
    primaryColor: "hsl(340 80% 45%)",
    assessmentPrice: 4500,
  },
  {
    id: "mokawloon",
    name: "المقاولون العرب",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/27/Al_Mokawloon_Al_Arab_SC_logo.png",
    primaryColor: "hsl(45 90% 50%)",
    assessmentPrice: 4500,
  },
  {
    id: "kahraba-ismailia",
    name: "كهرباء الإسماعيلية",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Kahrabaa_Ismailia_Co.jpg",
    primaryColor: "hsl(210 70% 50%)",
    assessmentPrice: 3500,
    leagueId: "egypt",
  },
  // Saudi Pro League Clubs - 18 teams
  {
    id: "al-nassr",
    name: "نادي النصر",
    logoUrl: "/logos/al_nassr.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 6000,
    leagueId: "saudi",
  },
  {
    id: "al-hilal",
    name: "نادي الهلال",
    logoUrl: "/logos/al_hilal.png",
    primaryColor: "hsl(220 100% 30%)",
    assessmentPrice: 6000,
    leagueId: "saudi",
  },
  {
    id: "al-taawon",
    name: "نادي التعاون",
    logoUrl: "/logos/al_taawoun.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-ahli-saudi",
    name: "نادي الأهلي السعودي",
    logoUrl: "/logos/al_ahli_saudi.png",
    primaryColor: "hsl(120 100% 25%)",
    assessmentPrice: 5500,
    leagueId: "saudi",
  },
  {
    id: "al-qadisiyah",
    name: "نادي القادسية",
    logoUrl: "/logos/al_qadisiyah.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-khaleej",
    name: "نادي الخليج",
    logoUrl: "/logos/al_khaleej.png",
    primaryColor: "hsl(200 100% 35%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-ittihad-saudi",
    name: "نادي الاتحاد",
    logoUrl: "/logos/al_ittihad.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 6000,
    leagueId: "saudi",
  },
  {
    id: "neom",
    name: "نادي نيوم",
    logoUrl: "/logos/neom.png",
    primaryColor: "hsl(200 50% 40%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-ettifaq",
    name: "نادي الاتفاق",
    logoUrl: "/logos/al_ettifaq.png",
    primaryColor: "hsl(120 80% 30%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-feiha",
    name: "نادي الفيحاء",
    logoUrl: "/logos/al_fayha.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-kholood",
    name: "نادي الخلود",
    logoUrl: "/logos/al_kholood.png",
    primaryColor: "hsl(25 100% 50%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-hazm",
    name: "نادي الحزم",
    logoUrl: "/logos/al_hazm.png",
    primaryColor: "hsl(120 60% 35%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-shabab",
    name: "نادي الشباب",
    logoUrl: "/logos/al_shabab.png",
    primaryColor: "hsl(0 80% 45%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-riyadh",
    name: "نادي الرياض",
    logoUrl: "/logos/al_riyadh.png",
    primaryColor: "hsl(200 100% 40%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-akhdoud",
    name: "نادي الأخدود",
    logoUrl: "/logos/al_akhdoud.png",
    primaryColor: "hsl(220 100% 40%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "damac",
    name: "نادي ضمك",
    logoUrl: "/logos/damac.png",
    primaryColor: "hsl(0 80% 45%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-fateh",
    name: "نادي الفتح",
    logoUrl: "/logos/al_fateh.png",
    primaryColor: "hsl(120 60% 35%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-najma",
    name: "نادي النجمة",
    logoUrl: "/logos/al_najma.svg",
    primaryColor: "hsl(120 100% 25%)",
    assessmentPrice: 4000,
    leagueId: "saudi",
  },
  // UAE Pro League Clubs - 14 teams
  {
    id: "al-ain",
    name: "نادي العين",
    logoUrl: "/logos/al_ain.png",
    primaryColor: "hsl(280 60% 35%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "al-wahda",
    name: "نادي الوحدة",
    logoUrl: "/logos/al_wahda.png",
    primaryColor: "hsl(0 70% 40%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "shabab-al-ahli",
    name: "نادي شباب الأهلي",
    logoUrl: "/logos/shabab_al_ahli.svg",
    primaryColor: "hsl(0 80% 45%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "al-wasl",
    name: "نادي الوصل",
    logoUrl: "/logos/al_wasl.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "uae",
  },
  {
    id: "al-jazira",
    name: "نادي الجزيرة",
    logoUrl: "/logos/al_jazira.png",
    primaryColor: "hsl(0 70% 40%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "al-dhafra",
    name: "نادي الظفرة",
    logoUrl: "/logos/al_dhafra.png",
    primaryColor: "hsl(220 80% 40%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "al-nasr-dubai",
    name: "نادي النصر",
    logoUrl: "/logos/al_nasr_dubai.svg",
    primaryColor: "hsl(220 100% 40%)",
    assessmentPrice: 5000,
    leagueId: "uae",
  },
  {
    id: "al-ittihad-kalba",
    name: "نادي اتحاد كلباء",
    logoUrl: "/logos/al_ittihad_kalba.png",
    primaryColor: "hsl(25 100% 50%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "ajman",
    name: "نادي عجمان",
    logoUrl: "/logos/ajman.png",
    primaryColor: "hsl(25 100% 50%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "khor-fakkan",
    name: "نادي خورفكان",
    logoUrl: "/logos/khor_fakkan.png",
    primaryColor: "hsl(270 60% 40%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "sharjah",
    name: "نادي الشارقة",
    logoUrl: "/logos/sharjah.png",
    primaryColor: "hsl(0 80% 45%)",
    assessmentPrice: 5000,
    leagueId: "uae",
  },
  {
    id: "al-bataeh",
    name: "نادي البطائح",
    logoUrl: "/logos/al_bataeh.png",
    primaryColor: "hsl(45 100% 50%)",
    assessmentPrice: 4000,
    leagueId: "uae",
  },
  {
    id: "baniyas",
    name: "نادي بني ياس",
    logoUrl: "/logos/baniyas.png",
    primaryColor: "hsl(280 50% 40%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "dibba",
    name: "نادي دبا",
    logoUrl: "/logos/dibba.png",
    primaryColor: "hsl(200 80% 45%)",
    assessmentPrice: 4000,
    leagueId: "uae",
  },
];

interface HeaderProps {
  selectedClub: Club | null;
  onClubChange: (clubId: string) => void;
  clubs?: Club[];
  minimal?: boolean;
}

export function Header({ selectedClub, onClubChange, clubs = CLUBS, minimal = false }: HeaderProps) {
  if (minimal) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-white rounded-xl shadow-md max-w-xl mx-auto" dir="rtl">
        {selectedClub && (
          <div className="flex items-center gap-3">
            <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-14 w-14 object-contain" />
            <div>
              <p className="text-lg font-bold text-foreground">{selectedClub.name}</p>
              <p className="text-sm text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} {getCurrencySymbol(selectedClub.leagueId)}</p>
            </div>
          </div>
        )}
        <Select value={selectedClub?.id || ""} onValueChange={onClubChange}>
          <SelectTrigger className="w-[200px] bg-muted" dir="rtl">
            <SelectValue placeholder="اختر النادي..." />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                <div className="flex items-center gap-2">
                  <img src={club.logoUrl} alt={club.name} className="h-5 w-5 object-contain" />
                  {club.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4" dir="rtl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-2 rounded-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Soccer Hunters</h1>
            <p className="text-xs text-muted-foreground">منصة اختبارات اللاعبين</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedClub && (
            <div className="hidden sm:flex items-center gap-2">
              <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-10 w-10 object-contain" />
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedClub.name}</p>
                <p className="text-xs text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} {getCurrencySymbol(selectedClub.leagueId)}</p>
              </div>
            </div>
          )}
          <Select value={selectedClub?.id || ""} onValueChange={onClubChange}>
            <SelectTrigger className="w-[200px] bg-muted" dir="rtl">
              <SelectValue placeholder="اختر النادي..." />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {clubs.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  <div className="flex items-center gap-2">
                    <img src={club.logoUrl} alt={club.name} className="h-5 w-5 object-contain" />
                    {club.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
