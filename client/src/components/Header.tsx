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
  { id: "ismaili", name: "النادي الإسماعيلي", logoUrl: "/logos/ismaili.png", primaryColor: "hsl(0 70% 50%)", assessmentPrice: 4000 },
  { id: "al-qassim", name: "نادي المقاصة", logoUrl: "/logos/al_qassim.png", primaryColor: "hsl(45 100% 50%)", assessmentPrice: 3500 },
  { id: "tanta", name: "نادي طنطا", logoUrl: "/logos/tanta.png", primaryColor: "hsl(270 60% 50%)", assessmentPrice: 3500 },
  { id: "military", name: "نادي الإنتاج الحربي", logoUrl: "/logos/military.png", primaryColor: "hsl(180 60% 40%)", assessmentPrice: 3500 },
  { id: "al-teraji", name: "نادي الترجي", logoUrl: "/logos/al_teraji.png", primaryColor: "hsl(30 100% 50%)", assessmentPrice: 3500 },
  { id: "al-gouna", name: "نادي الجونة", logoUrl: "/logos/al_gouna.png", primaryColor: "hsl(200 70% 50%)", assessmentPrice: 3500 },
  { id: "mansoura", name: "نادي المنصورة", logoUrl: "/logos/mansoura.png", primaryColor: "hsl(60 70% 50%)", assessmentPrice: 3500 },
  { id: "kafr-sheikh", name: "نادي كفر الشيخ", logoUrl: "/logos/kafr_sheikh.png", primaryColor: "hsl(120 60% 40%)", assessmentPrice: 3500 },
  { id: "aswan", name: "نادي أسوان", logoUrl: "/logos/aswan.png", primaryColor: "hsl(200 80% 50%)", assessmentPrice: 3500 },
  { id: "al-mokawloon", name: "نادي المقاولون العرب", logoUrl: "/logos/al_mokawloon.png", primaryColor: "hsl(50 100% 50%)", assessmentPrice: 3500 },
  { id: "nbe", name: "نادي البنك الأهلي", logoUrl: "/logos/nbe.png", primaryColor: "hsl(180 70% 45%)", assessmentPrice: 3500 },
  { id: "arab-contractors", name: "نادي المقاولون", logoUrl: "/logos/arab_contractors.png", primaryColor: "hsl(30 80% 50%)", assessmentPrice: 3500 },
  { id: "wadi-degla", name: "نادي وادي دجلة", logoUrl: "/logos/wadi_degla.png", primaryColor: "hsl(90 70% 50%)", assessmentPrice: 3500 },
  { id: "petrojet", name: "نادي بتروجت", logoUrl: "/logos/petrojet.png", primaryColor: "hsl(10 70% 50%)", assessmentPrice: 3500 },
  { id: "zagazig", name: "نادي الزقازيق", logoUrl: "/logos/zagazig.png", primaryColor: "hsl(0 80% 50%)", assessmentPrice: 3500 },
  { id: "sharkia", name: "نادي الشرقية", logoUrl: "/logos/sharkia.png", primaryColor: "hsl(120 70% 50%)", assessmentPrice: 3500 },
  { id: "talaat-harb", name: "نادي طلعت حرب", logoUrl: "/logos/talaat_harb.png", primaryColor: "hsl(240 70% 50%)", assessmentPrice: 3500 },
  { id: "el-geish", name: "نادي الجيش", logoUrl: "/logos/el_geish.png", primaryColor: "hsl(240 60% 40%)", assessmentPrice: 3500 },
  { id: "sheikh-zayed", name: "نادي الشيخ زايد", logoUrl: "/logos/sheikh_zayed.png", primaryColor: "hsl(0 60% 50%)", assessmentPrice: 3500 },
  { id: "future-fc", name: "نادي المستقبل", logoUrl: "/logos/future_fc.png", primaryColor: "hsl(60 100% 50%)", assessmentPrice: 3500 },
  { id: "amriya", name: "نادي العمرية", logoUrl: "/logos/amriya.png", primaryColor: "hsl(280 60% 50%)", assessmentPrice: 3500 },
  { id: "coast-guard", name: "نادي خفر السواحل", logoUrl: "/logos/coast_guard.png", primaryColor: "hsl(200 80% 45%)", assessmentPrice: 3500 },
  { id: "olympic", name: "نادي الأولمبي", logoUrl: "/logos/olympic.png", primaryColor: "hsl(280 70% 55%)", assessmentPrice: 3500 },
  { id: "port-said", name: "نادي بورسعيد", logoUrl: "/logos/port_said.png", primaryColor: "hsl(10 90% 50%)", assessmentPrice: 3500 },
  { id: "suez", name: "نادي السويس", logoUrl: "/logos/suez.png", primaryColor: "hsl(240 80% 50%)", assessmentPrice: 3500 },
  { id: "fayoum", name: "نادي الفيوم", logoUrl: "/logos/fayoum.png", primaryColor: "hsl(30 70% 50%)", assessmentPrice: 3500 },
  { id: "beni-suef", name: "نادي بني سويف", logoUrl: "/logos/beni_suef.png", primaryColor: "hsl(120 80% 50%)", assessmentPrice: 3500 },
  { id: "minya", name: "نادي المنيا", logoUrl: "/logos/minya.png", primaryColor: "hsl(60 80% 50%)", assessmentPrice: 3500 },
  { id: "lycee", name: "نادي الليسيه", logoUrl: "/logos/lycee.png", primaryColor: "hsl(200 60% 50%)", assessmentPrice: 3500 },
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
            <SelectContent dir="rtl">
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
