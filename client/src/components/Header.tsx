import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

export interface Club {
  id: string;
  name: string;
  primaryColor: string;
  assessmentPrice: number;
  wikipediaLogo?: string;
}

export interface ClubData extends Club {
  wikipediaLogo: string;
}

export const CLUBS: ClubData[] = [
  { id: "al-ahly", name: "النادي الأهلي", primaryColor: "hsl(354 70% 45%)", assessmentPrice: 5000, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/7/70/Al_Ahly_SC_logo.svg" },
  { id: "zamalek", name: "نادي الزمالك", primaryColor: "hsl(222 47% 11%)", assessmentPrice: 5000, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/e/ef/Zamalek_SC_logo.svg" },
  { id: "pyramids", name: "نادي بيراميدز", primaryColor: "hsl(210 60% 30%)", assessmentPrice: 4500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/8/8a/Pyramids_FC_logo.svg" },
  { id: "al-masry", name: "النادي المصري", primaryColor: "hsl(140 60% 35%)", assessmentPrice: 4500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/9/90/Al_Masry_SC_logo.svg" },
  { id: "ismaily", name: "النادي الإسماعيلي", primaryColor: "hsl(45 90% 50%)", assessmentPrice: 4000, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/7/7d/Ismaily_SC_logo.svg" },
  { id: "al-ittihad", name: "الاتحاد السكندري", primaryColor: "hsl(340 60% 40%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/f/f0/Ittihad_Alexandria_SC_logo.svg" },
  { id: "nbe", name: "البنك الأهلي", primaryColor: "hsl(220 70% 40%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/5/5e/National_Bank_of_Egypt_SC_logo.svg" },
  { id: "ceramica", name: "سيراميكا كليوباترا", primaryColor: "hsl(30 75% 45%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/c/c0/Ceramica_Cleopatra_FC_logo.svg" },
  { id: "enppi", name: "إنبي", primaryColor: "hsl(200 75% 45%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/2/2a/ENPPI_SC_logo.svg" },
  { id: "modern-sport", name: "مودرن سبورت", primaryColor: "hsl(270 70% 40%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/0/0d/Modern_Sport_FC_logo.svg" },
  { id: "talaea-el-gaish", name: "طلائع الجيش", primaryColor: "hsl(0 0% 20%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/a/a4/Tala%27ea_El_Gaish_SC_logo.svg" },
  { id: "zed", name: "زد", primaryColor: "hsl(260 70% 50%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/c/c3/ZED_FC_logo.svg" },
  { id: "pharco", name: "فاركو", primaryColor: "hsl(200 80% 45%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/9/9d/Pharco_FC_logo.svg" },
  { id: "el-gouna", name: "الجونة", primaryColor: "hsl(45 90% 50%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/e/e0/El_Gouna_FC_logo.svg" },
  { id: "ghazl-mahalla", name: "غزل المحلة", primaryColor: "hsl(0 85% 50%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/7/7f/Ghazl_El_Mahalla_SC_logo.svg" },
  { id: "petrojet", name: "بتروجيت", primaryColor: "hsl(45 85% 45%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/0/0f/Petrojet_SC_logo.svg" },
  { id: "smouha", name: "سموحة", primaryColor: "hsl(200 70% 40%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/1/1a/Smouha_SC_logo.svg" },
  { id: "haras-el-hodoud", name: "حرس الحدود", primaryColor: "hsl(120 50% 40%)", assessmentPrice: 3500, wikipediaLogo: "https://upload.wikimedia.org/wikipedia/en/7/73/Haras_El_Hodoud_SC_logo.svg" },
];

function ClubBadge({ club }: { club: Club }) {
  if (club.wikipediaLogo) {
    return (
      <img 
        src={club.wikipediaLogo} 
        alt={club.name} 
        className="h-6 w-6 object-contain flex-shrink-0" 
        title={club.name}
        onError={(e) => {
          const initial = club.name.charAt(0);
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = "h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0";
            fallback.style.backgroundColor = club.primaryColor;
            fallback.title = club.name;
            fallback.textContent = initial;
            parent.replaceChild(fallback, e.target as HTMLImageElement);
          }
        }}
      />
    );
  }
  const initial = club.name.charAt(0);
  return (
    <div
      className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: club.primaryColor }}
      title={club.name}
    >
      {initial}
    </div>
  );
}

interface HeaderProps {
  selectedClub: Club | null;
  onClubChange: (clubId: string) => void;
}

export function Header({ selectedClub, onClubChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4" dir="rtl">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-2 rounded-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Soccer Hunters</h1>
            <p className="text-xs text-muted-foreground">منصة اختبارات اللاعبين</p>
          </div>
        </div>

        {/* Club Selector */}
        <div className="flex items-center gap-3">
          {selectedClub && (
            <div className="hidden sm:flex items-center gap-2">
              <ClubBadge club={selectedClub} />
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedClub.name}</p>
                <p className="text-xs text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(2)} ج.م</p>
              </div>
            </div>
          )}
          <Select value={selectedClub?.id || ""} onValueChange={onClubChange}>
            <SelectTrigger className="w-[200px] bg-muted" dir="rtl">
              <SelectValue placeholder="اختر النادي..." />
            </SelectTrigger>
            <SelectContent dir="rtl" className="max-h-64 overflow-y-auto">
              {CLUBS.map((club) => (
                <SelectItem key={club.id} value={club.id}>
                  <div className="flex items-center gap-2">
                    <ClubBadge club={club} />
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
