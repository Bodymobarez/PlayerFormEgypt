import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

export interface Club {
  id: string;
  name: string;
  primaryColor: string;
  assessmentPrice: number;
}

export const CLUBS: Club[] = [
  { id: "al-ahly", name: "النادي الأهلي", primaryColor: "hsl(354 70% 45%)", assessmentPrice: 5000 },
  { id: "zamalek", name: "نادي الزمالك", primaryColor: "hsl(222 47% 11%)", assessmentPrice: 5000 },
  { id: "pyramids", name: "نادي بيراميدز", primaryColor: "hsl(210 60% 30%)", assessmentPrice: 4500 },
  { id: "al-masry", name: "النادي المصري", primaryColor: "hsl(140 60% 35%)", assessmentPrice: 4500 },
  { id: "ismaily", name: "النادي الإسماعيلي", primaryColor: "hsl(45 90% 50%)", assessmentPrice: 4000 },
  { id: "al-ittihad", name: "الاتحاد السكندري", primaryColor: "hsl(340 60% 40%)", assessmentPrice: 3500 },
  { id: "petro-sport", name: "بترو سبورت", primaryColor: "hsl(45 90% 45%)", assessmentPrice: 3500 },
  { id: "ghazl-mahalla", name: "غزل المحلة", primaryColor: "hsl(0 85% 50%)", assessmentPrice: 3500 },
  { id: "daqahlia", name: "الدقهلية", primaryColor: "hsl(150 70% 40%)", assessmentPrice: 3500 },
  { id: "tanta", name: "طنطا", primaryColor: "hsl(25 85% 45%)", assessmentPrice: 3500 },
  { id: "sporting-alexandria", name: "سبورتنج الإسكندرية", primaryColor: "hsl(30 75% 40%)", assessmentPrice: 3500 },
  { id: "ahly-benha", name: "أهلي بنها", primaryColor: "hsl(354 70% 45%)", assessmentPrice: 3500 },
  { id: "modern-sport", name: "الرياضة الحديثة", primaryColor: "hsl(270 70% 40%)", assessmentPrice: 3500 },
  { id: "misr-makasa", name: "مصر المقاصة", primaryColor: "hsl(0 0% 30%)", assessmentPrice: 3500 },
  { id: "enppi", name: "إنبي", primaryColor: "hsl(200 75% 45%)", assessmentPrice: 3500 },
  { id: "smouha", name: "سموحة", primaryColor: "hsl(200 70% 40%)", assessmentPrice: 3500 },
  { id: "arab-contractors", name: "المقاولون العرب", primaryColor: "hsl(30 80% 40%)", assessmentPrice: 3500 },
  { id: "alex-union", name: "اتحاد الإسكندرية", primaryColor: "hsl(260 70% 40%)", assessmentPrice: 3500 },
];

function ClubBadge({ club }: { club: Club }) {
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
