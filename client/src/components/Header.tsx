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
  // Saudi Pro League Clubs
  {
    id: "al-hilal",
    name: "نادي الهلال السعودي",
    logoUrl: "https://via.placeholder.com/150/000000/FFFFFF?text=الهلال",
    primaryColor: "hsl(0 0% 0%)",
    assessmentPrice: 6000,
    leagueId: "saudi",
  },
  {
    id: "al-nassr",
    name: "نادي النصر",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=النصر",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5500,
    leagueId: "saudi",
  },
  {
    id: "al-faisaly",
    name: "نادي الفيصلي",
    logoUrl: "https://via.placeholder.com/150/000000/FFCC00?text=الفيصلي",
    primaryColor: "hsl(0 0% 0%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-ahli-saudi",
    name: "نادي الأهلي السعودي",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=الأهلي",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5500,
    leagueId: "saudi",
  },
  {
    id: "al-shabab",
    name: "نادي الشباب السعودي",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=الشباب",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "saudi",
  },
  {
    id: "al-taawon",
    name: "نادي التعاون",
    logoUrl: "https://via.placeholder.com/150/FFCC00/000000?text=التعاون",
    primaryColor: "hsl(38 100% 50%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  {
    id: "al-ittihad-saudi",
    name: "نادي الاتحاد السعودي",
    logoUrl: "https://via.placeholder.com/150/000000/FFD700?text=الاتحاد",
    primaryColor: "hsl(0 0% 0%)",
    assessmentPrice: 5500,
    leagueId: "saudi",
  },
  {
    id: "al-raed",
    name: "نادي الريد",
    logoUrl: "https://via.placeholder.com/150/DD0000/FFFFFF?text=الريد",
    primaryColor: "hsl(3 100% 45%)",
    assessmentPrice: 4500,
    leagueId: "saudi",
  },
  // UAE Pro League Clubs
  {
    id: "al-ain",
    name: "نادي العين",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFD700?text=العين",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "al-ahli-uae",
    name: "نادي الأهلي الإماراتي",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=الأهليUAE",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5500,
    leagueId: "uae",
  },
  {
    id: "sharjah",
    name: "نادي الشارقة",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=الشارقة",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "uae",
  },
  {
    id: "dubai-fc",
    name: "نادي دبي",
    logoUrl: "https://via.placeholder.com/150/000000/FF0000?text=دبي",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 5000,
    leagueId: "uae",
  },
  {
    id: "fujairah",
    name: "نادي الفجيرة",
    logoUrl: "https://via.placeholder.com/150/228B22/FFFFFF?text=الفجيرة",
    primaryColor: "hsl(120 100% 25%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "khor-fakkan",
    name: "نادي خورفكان",
    logoUrl: "https://via.placeholder.com/150/6A0DAD/FFFFFF?text=خورفكان",
    primaryColor: "hsl(270 100% 35%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "ras-khaimah",
    name: "نادي رأس الخيمة",
    logoUrl: "https://via.placeholder.com/150/66BB6A/FFFFFF?text=رأسالخيمة",
    primaryColor: "hsl(120 100% 40%)",
    assessmentPrice: 4500,
    leagueId: "uae",
  },
  {
    id: "umm-al-quwain",
    name: "نادي أم القيوين",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=أمالقيوين",
    primaryColor: "hsl(0 100% 50%)",
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
