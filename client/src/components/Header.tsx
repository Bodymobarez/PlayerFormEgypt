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
  // سيراميكا كليوباترا فقط
  {
    id: "ceramica-cleopatra",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(0 84% 48%)", // أحمر من اللوجو
    assessmentPrice: 4000,
    leagueId: "egypt",
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
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <div>
              <p className="text-sm sm:text-base md:text-lg font-bold text-foreground">{selectedClub.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} {getCurrencySymbol(selectedClub.leagueId)}</p>
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
    <header className="sticky top-0 z-40 bg-white border-b-2 shadow-lg" style={{
      borderColor: selectedClub?.primaryColor || 'hsl(0 84% 48%)'
    }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4" dir="rtl">
        <div className="flex items-center gap-3">
          {selectedClub && (
            <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-10 w-10 object-contain" />
          )}
          <div>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground">سيراميكا كليوباترا</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Cleopatra F.C.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedClub && (
            <div className="hidden sm:flex items-center gap-2">
              <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-8 w-8 md:h-10 md:w-10 object-contain" />
              <div>
                <p className="text-xs md:text-sm font-semibold text-foreground">{selectedClub.name}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} {getCurrencySymbol(selectedClub.leagueId)}</p>
              </div>
            </div>
          )}
          {/* لا حاجة لاختيار النادي - نادي واحد فقط */}
        </div>
      </div>
    </header>
  );
}
