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
  { id: "al-ahly", name: "النادي الأهلي", logoUrl: "/logos/al_ahly.png", primaryColor: "hsl(354 70% 45%)", assessmentPrice: 5000 },
  { id: "zamalek", name: "نادي الزمالك", logoUrl: "/logos/zamalek.png", primaryColor: "hsl(222 47% 11%)", assessmentPrice: 5000 },
  { id: "pyramids", name: "نادي بيراميدز", logoUrl: "/logos/pyramids.png", primaryColor: "hsl(210 60% 30%)", assessmentPrice: 4500 },
  { id: "al-masry", name: "النادي المصري", logoUrl: "/logos/al_masry.png", primaryColor: "hsl(140 60% 35%)", assessmentPrice: 4500 },
  { id: "ismaily", name: "النادي الإسماعيلي", logoUrl: "/logos/ismaily.png", primaryColor: "hsl(45 90% 50%)", assessmentPrice: 4000 },
  { id: "tanta", name: "نادي طنطا", logoUrl: "/logos/tanta.png", primaryColor: "hsl(25 85% 45%)", assessmentPrice: 3500 },
  { id: "al-mansoura", name: "نادي المنصورة", logoUrl: "/logos/al_mansoura.png", primaryColor: "hsl(200 70% 40%)", assessmentPrice: 3500 },
  { id: "aswan", name: "نادي أسوان", logoUrl: "/logos/aswan.png", primaryColor: "hsl(10 80% 50%)", assessmentPrice: 3500 },
  { id: "al-ittihad", name: "الاتحاد السكندري", logoUrl: "/logos/al_ittihad.png", primaryColor: "hsl(340 60% 40%)", assessmentPrice: 3500 },
  { id: "al-ahly-benha", name: "أهلي بنها", logoUrl: "/logos/al_ahly_benha.png", primaryColor: "hsl(354 70% 45%)", assessmentPrice: 3000 },
  { id: "ghazl-mahalla", name: "غزل المحلة", logoUrl: "/logos/ghazl_mahalla.png", primaryColor: "hsl(0 85% 50%)", assessmentPrice: 3000 },
  { id: "misr-railway", name: "مصر للسكك الحديدية", logoUrl: "/logos/misr_railway.png", primaryColor: "hsl(0 0% 20%)", assessmentPrice: 3000 },
  { id: "petro-sport", name: "نادي بترو سبورت", logoUrl: "/logos/petro_sport.png", primaryColor: "hsl(45 90% 45%)", assessmentPrice: 3000 },
  { id: "daqahlia", name: "نادي الدقهلية", logoUrl: "/logos/daqahlia.png", primaryColor: "hsl(150 70% 40%)", assessmentPrice: 3000 },
  { id: "alyoum-sport", name: "نادي اليوم الرياضي", logoUrl: "/logos/alyoum_sport.png", primaryColor: "hsl(60 85% 45%)", assessmentPrice: 3000 },
  { id: "arab-contractors", name: "المقاولون العرب", logoUrl: "/logos/arab_contractors.png", primaryColor: "hsl(30 80% 40%)", assessmentPrice: 3000 },
  { id: "enppi", name: "نادي إنبي", logoUrl: "/logos/enppi.png", primaryColor: "hsl(200 75% 45%)", assessmentPrice: 3000 },
  { id: "modern-sport", name: "نادي الرياضة الحديثة", logoUrl: "/logos/modern_sport.png", primaryColor: "hsl(270 70% 40%)", assessmentPrice: 3000 },
  { id: "misr-makasa", name: "مصر المقاصة", logoUrl: "/logos/misr_makasa.png", primaryColor: "hsl(0 0% 30%)", assessmentPrice: 3000 },
  { id: "zagazig", name: "نادي الزقازيق", logoUrl: "/logos/zagazig.png", primaryColor: "hsl(180 70% 40%)", assessmentPrice: 3000 },
  { id: "qena", name: "نادي قنا", logoUrl: "/logos/qena.png", primaryColor: "hsl(40 85% 45%)", assessmentPrice: 3000 },
  { id: "sohag", name: "نادي سوهاج", logoUrl: "/logos/sohag.png", primaryColor: "hsl(280 70% 40%)", assessmentPrice: 3000 },
  { id: "assiut", name: "نادي أسيوط", logoUrl: "/logos/assiut.png", primaryColor: "hsl(20 85% 45%)", assessmentPrice: 3000 },
  { id: "beni-suef", name: "نادي بني سويف", logoUrl: "/logos/beni_suef.png", primaryColor: "hsl(150 75% 40%)", assessmentPrice: 3000 },
  { id: "fayyoum", name: "نادي الفيوم", logoUrl: "/logos/fayyoum.png", primaryColor: "hsl(60 80% 45%)", assessmentPrice: 3000 },
  { id: "giza", name: "نادي الجيزة", logoUrl: "/logos/giza.png", primaryColor: "hsl(200 70% 40%)", assessmentPrice: 3000 },
  { id: "helwan", name: "نادي حلوان", logoUrl: "/logos/helwan.png", primaryColor: "hsl(0 85% 50%)", assessmentPrice: 3000 },
  { id: "october-city", name: "نادي مدينة أكتوبر", logoUrl: "/logos/october_city.png", primaryColor: "hsl(240 85% 45%)", assessmentPrice: 3000 },
  { id: "zayed-military", name: "نادي النادي العسكري", logoUrl: "/logos/zayed_military.png", primaryColor: "hsl(0 0% 20%)", assessmentPrice: 3000 },
  { id: "sporting-alexandria", name: "نادي سبورتنج الإسكندرية", logoUrl: "/logos/sporting_alexandria.png", primaryColor: "hsl(30 75% 40%)", assessmentPrice: 3000 },
  { id: "alexandria-union", name: "اتحاد الإسكندرية", logoUrl: "/logos/alexandria_union.png", primaryColor: "hsl(260 70% 40%)", assessmentPrice: 3000 },
  { id: "matarya", name: "نادي المطرية", logoUrl: "/logos/matarya.png", primaryColor: "hsl(100 70% 40%)", assessmentPrice: 3000 },
  { id: "sporting-cairo", name: "نادي سبورتنج", logoUrl: "/logos/sporting_cairo.png", primaryColor: "hsl(200 80% 45%)", assessmentPrice: 3000 },
];

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
              <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-10 w-10 object-contain" />
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
