import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import leagueLogo from "@assets/generated_images/egyptian_youth_football_league_official_logo.png";

export interface Club {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
}

export const CLUBS: Club[] = [
  {
    id: "ahly",
    name: "النادي الأهلي",
    logo: "/logos/al_ahly.png",
    primaryColor: "hsl(354 70% 45%)"
  },
  {
    id: "zamalek",
    name: "نادي الزمالك",
    logo: "/logos/zamalek.png",
    primaryColor: "hsl(222 47% 11%)" 
  },
  {
    id: "pyramids",
    name: "نادي بيراميدز",
    logo: "/logos/pyramids.png",
    primaryColor: "hsl(210 60% 30%)"
  },
  {
    id: "masry",
    name: "النادي المصري",
    logo: "/logos/al_masry.png",
    primaryColor: "hsl(140 60% 35%)"
  },
  {
    id: "ismaily",
    name: "النادي الإسماعيلي",
    logo: "/logos/ismaily.png",
    primaryColor: "hsl(45 90% 50%)"
  },
  {
    id: "ittihad",
    name: "نادي الاتحاد السكندري",
    logo: "/logos/al_ittihad_alexandria.png",
    primaryColor: "hsl(140 60% 35%)"
  },
  {
    id: "modern_sport",
    name: "مودرن سبورت",
    logo: "/logos/modern_sport.png",
    primaryColor: "hsl(350 70% 40%)"
  },
  {
    id: "smouha",
    name: "نادي سموحة",
    logo: "/logos/smouha.png",
    primaryColor: "hsl(215 80% 45%)"
  },
  {
    id: "zed",
    name: "نادي زد (ZED)",
    logo: "/logos/zed.png",
    primaryColor: "hsl(150 100% 40%)"
  },
  {
    id: "ceramica",
    name: "سيراميكا كليوباترا",
    logo: "/logos/ceramica_cleopatra.png",
    primaryColor: "hsl(40 60% 45%)"
  },
  {
    id: "enppi",
    name: "نادي إنبي",
    logo: "/logos/enppi.png",
    primaryColor: "hsl(200 70% 30%)"
  },
  {
    id: "talaea",
    name: "طلائع الجيش",
    logo: "/logos/tala_ea_el_gaish.png",
    primaryColor: "hsl(0 0% 20%)"
  },
  {
    id: "bank",
    name: "البنك الأهلي",
    logo: "/logos/national_bank_of_egypt.png",
    primaryColor: "hsl(30 80% 50%)"
  },
  {
    id: "pharco",
    name: "نادي فاركو",
    logo: "/logos/pharco.png",
    primaryColor: "hsl(25 90% 50%)"
  },
  {
    id: "gouna",
    name: "نادي الجونة",
    logo: "/logos/el_gouna.png",
    primaryColor: "hsl(210 20% 80%)"
  },
  {
    id: "mokawloon",
    name: "المقاولون العرب",
    logo: "/logos/al_mokawloon_al_arab.png",
    primaryColor: "hsl(50 90% 50%)"
  },
  {
    id: "ghazl",
    name: "غزل المحلة",
    logo: "/logos/ghazl_el_mahalla.png",
    primaryColor: "hsl(190 70% 45%)"
  },
  {
    id: "haras",
    name: "حرس الحدود",
    logo: "/logos/haras_el_hodoud.png",
    primaryColor: "hsl(0 70% 40%)"
  },
  {
    id: "petrojet",
    name: "بتروجيت",
    logo: "/logos/petrojet.png",
    primaryColor: "hsl(210 80% 40%)"
  }
];

interface HeaderProps {
  selectedClub: Club | null;
  onClubChange: (clubId: string) => void;
}

export function Header({ selectedClub, onClubChange }: HeaderProps) {
  return (
    <div className="w-full bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Right Side - League Logo */}
          <div className="flex items-center gap-4 order-2 md:order-1">
            <img 
              src={leagueLogo} 
              alt="Egyptian Youth League" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-sm"
            />
            <div className="text-right hidden md:block">
              <h1 className="text-xl font-bold text-foreground">الاتحاد المصري لكرة القدم</h1>
              <p className="text-sm text-muted-foreground">قطاع الناشئين والبراعم</p>
            </div>
          </div>

          {/* Center - Title (Mobile Only) */}
          <div className="text-center md:hidden order-1 w-full">
            <h1 className="text-xl font-bold text-primary">استمارة تسجيل لاعب</h1>
          </div>

          {/* Left Side - Club Selection & Logo */}
          <div className="flex items-center gap-4 order-3 w-full md:w-auto justify-end">
             <div className="w-full md:w-[280px]">
                <Select onValueChange={onClubChange} defaultValue={selectedClub?.id}>
                  <SelectTrigger className="w-full text-right h-12" dir="rtl">
                    <SelectValue placeholder="اختر النادي..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="max-h-[300px]">
                    {CLUBS.map((club) => (
                      <SelectItem key={club.id} value={club.id} className="cursor-pointer">
                        <div className="flex items-center gap-3 py-1">
                          <img src={club.logo} className="h-8 w-8 object-contain" />
                          <span className="font-medium">{club.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             {selectedClub ? (
                <img 
                  src={selectedClub.logo} 
                  alt={selectedClub.name} 
                  className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-sm transition-all duration-300 animate-in fade-in zoom-in"
                />
             ) : (
               <div className="h-16 w-16 md:h-20 md:w-20 border-2 border-dashed border-muted rounded-full flex items-center justify-center bg-muted/50">
                 <span className="text-xs text-muted-foreground text-center px-1">شعار النادي</span>
               </div>
             )}
          </div>
        </div>
      </div>
      {/* Colored Stripe based on selection */}
      <div 
        className="h-1.5 w-full transition-colors duration-500"
        style={{ backgroundColor: selectedClub?.primaryColor || 'var(--color-primary)' }}
      />
    </div>
  );
}
