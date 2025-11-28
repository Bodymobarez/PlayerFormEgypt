import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

export interface Club {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  assessmentPrice: number;
}

export const CLUBS: Club[] = [
  {
    id: "al-ahly",
    name: "النادي الأهلي",
    logoUrl: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)",
    assessmentPrice: 5000,
  },
  {
    id: "zamalek",
    name: "نادي الزمالك",
    logoUrl: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)",
    assessmentPrice: 5000,
  },
  {
    id: "pyramids",
    name: "نادي بيراميدز",
    logoUrl: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)",
    assessmentPrice: 4500,
  },
  {
    id: "al-masry",
    name: "النادي المصري",
    logoUrl: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)",
    assessmentPrice: 4500,
  },
  {
    id: "ceramica-cleopatra",
    name: "سيراميكا كليوباترا",
    logoUrl: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(27 100% 50%)",
    assessmentPrice: 4000,
  },
  {
    id: "bank-ahly",
    name: "البنك الأهلي المصري",
    logoUrl: "/logos/national_bank_of_egypt.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 4000,
  },
  {
    id: "zed-fc",
    name: "نادي زيد",
    logoUrl: "/logos/zed.png",
    primaryColor: "hsl(39 100% 50%)",
    assessmentPrice: 3500,
  },
  {
    id: "petrojet",
    name: "بترجيت",
    logoUrl: "/logos/petrojet.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 4000,
  },
  {
    id: "modern-sport",
    name: "مودرن سبورت",
    logoUrl: "/logos/modern_sport.png",
    primaryColor: "hsl(120 60% 40%)",
    assessmentPrice: 3500,
  },
  {
    id: "el-gouna",
    name: "الجونة",
    logoUrl: "/logos/el_gouna.png",
    primaryColor: "hsl(0 100% 40%)",
    assessmentPrice: 3500,
  },
  {
    id: "enppi",
    name: "إنبي",
    logoUrl: "/logos/enppi.png",
    primaryColor: "hsl(0 0% 0%)",
    assessmentPrice: 3500,
  },
  {
    id: "ismaily",
    name: "الإسماعيلي",
    logoUrl: "/logos/ismaily.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 4000,
  },
  {
    id: "ghazl-mahalla",
    name: "غزل المحلة",
    logoUrl: "/logos/ghazl_el_mahalla.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 3500,
  },
  {
    id: "smouha",
    name: "سموحة",
    logoUrl: "/logos/smouha.png",
    primaryColor: "hsl(210 100% 50%)",
    assessmentPrice: 3500,
  },
  {
    id: "al-ittihad-alex",
    name: "الاتحاد السكندري",
    logoUrl: "/logos/al_ittihad_alexandria.png",
    primaryColor: "hsl(220 80% 50%)",
    assessmentPrice: 4000,
  },
  {
    id: "talaea-gaish",
    name: "طلائع الجيش",
    logoUrl: "/logos/tala_ea_el_gaish.png",
    primaryColor: "hsl(0 100% 50%)",
    assessmentPrice: 3500,
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
    name: "حراس الحدود",
    logoUrl: "/logos/haras_el_hodoud.png",
    primaryColor: "hsl(210 70% 40%)",
    assessmentPrice: 3500,
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
              <p className="text-sm text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} ج.م</p>
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
                <p className="text-xs text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} ج.م</p>
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
