import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import leagueLogo from "@assets/generated_images/egyptian_youth_football_league_official_logo.png";
import redEagleLogo from "@assets/generated_images/red_eagle_sports_club_logo.png";
import whiteKnightLogo from "@assets/generated_images/white_knight_sports_club_logo.png";
import yellowCoastalLogo from "@assets/generated_images/yellow_coastal_sports_club_logo.png";

export interface Club {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
}

export const CLUBS: Club[] = [
  {
    id: "red-eagles",
    name: "النادي الأهلي للناشئين",
    logo: redEagleLogo,
    primaryColor: "hsl(354 70% 45%)"
  },
  {
    id: "white-knights",
    name: "نادي الزمالك للبراعم",
    logo: whiteKnightLogo,
    primaryColor: "hsl(222 47% 11%)" 
  },
  {
    id: "yellow-coastal",
    name: "النادي الإسماعيلي",
    logo: yellowCoastalLogo,
    primaryColor: "hsl(43 96% 58%)"
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
             <div className="w-full md:w-[250px]">
                <Select onValueChange={onClubChange} defaultValue={selectedClub?.id}>
                  <SelectTrigger className="w-full text-right" dir="rtl">
                    <SelectValue placeholder="اختر النادي..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {CLUBS.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        <div className="flex items-center gap-2">
                          <img src={club.logo} className="h-6 w-6 object-contain" />
                          <span>{club.name}</span>
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
