import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import leagueLogo from "@assets/generated_images/egyptian_youth_football_league_official_logo.png";

// Logos
import redEagleLogo from "@assets/generated_images/red_eagle_sports_club_logo.png";
import whiteKnightLogo from "@assets/generated_images/white_knight_sports_club_logo.png";
import yellowCoastalLogo from "@assets/generated_images/yellow_coastal_sports_club_logo.png";
import pyramidsLogo from "@assets/generated_images/pyramids_fc_logo_approximation.png";
import masryLogo from "@assets/generated_images/al_masry_sc_logo_approximation.png";
import ittihadLogo from "@assets/generated_images/al_ittihad_alexandria_logo_approximation.png";
import futureLogo from "@assets/generated_images/modern_future_fc_logo_approximation.png";
import smouhaLogo from "@assets/generated_images/smouha_sc_logo_approximation.png";
import zedLogo from "@assets/generated_images/zed_fc_logo_approximation.png";
import ceramicaLogo from "@assets/generated_images/ceramica_cleopatra_logo_approximation.png";
import enppiLogo from "@assets/generated_images/enppi_club_logo_approximation.png";
import talaeaLogo from "@assets/generated_images/talaea_el_gaish_logo_approximation.png";
import bankLogo from "@assets/generated_images/bank_al_ahly_logo_approximation.png";

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
    logo: redEagleLogo,
    primaryColor: "hsl(354 70% 45%)"
  },
  {
    id: "zamalek",
    name: "نادي الزمالك",
    logo: whiteKnightLogo,
    primaryColor: "hsl(222 47% 11%)" 
  },
  {
    id: "pyramids",
    name: "نادي بيراميدز",
    logo: pyramidsLogo,
    primaryColor: "hsl(210 60% 30%)"
  },
  {
    id: "masry",
    name: "النادي المصري",
    logo: masryLogo,
    primaryColor: "hsl(140 60% 35%)"
  },
  {
    id: "ismaily",
    name: "النادي الإسماعيلي",
    logo: yellowCoastalLogo,
    primaryColor: "hsl(45 90% 50%)"
  },
  {
    id: "ittihad",
    name: "نادي الاتحاد السكندري",
    logo: ittihadLogo,
    primaryColor: "hsl(140 60% 35%)"
  },
  {
    id: "future",
    name: "مودرن فيوتشر",
    logo: futureLogo,
    primaryColor: "hsl(350 70% 40%)"
  },
  {
    id: "smouha",
    name: "نادي سموحة",
    logo: smouhaLogo,
    primaryColor: "hsl(215 80% 45%)"
  },
  {
    id: "zed",
    name: "نادي زد (ZED)",
    logo: zedLogo,
    primaryColor: "hsl(150 100% 40%)"
  },
  {
    id: "ceramica",
    name: "سيراميكا كليوباترا",
    logo: ceramicaLogo,
    primaryColor: "hsl(40 60% 45%)"
  },
  {
    id: "enppi",
    name: "نادي إنبي",
    logo: enppiLogo,
    primaryColor: "hsl(200 70% 30%)"
  },
  {
    id: "talaea",
    name: "طلائع الجيش",
    logo: talaeaLogo,
    primaryColor: "hsl(0 0% 20%)"
  },
  {
    id: "bank",
    name: "البنك الأهلي",
    logo: bankLogo,
    primaryColor: "hsl(30 80% 50%)"
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
