import { useState } from "react";
import { Header, CLUBS, Club } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function Home() {
  // Default to first club or null, let's default to null to force selection for "official" feel
  const [selectedClub, setSelectedClub] = useState<Club | null>(CLUBS[0]);

  const handleClubChange = (clubId: string) => {
    const club = CLUBS.find(c => c.id === clubId) || null;
    setSelectedClub(club);
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      <Header selectedClub={selectedClub} onClubChange={handleClubChange} />
      
      <main className="container mx-auto px-4 pt-8">
        <div className="max-w-4xl mx-auto mb-8 text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            بوابة قطاع الناشئين
          </h2>
          <p className="text-muted-foreground text-lg">
            منصة التسجيل الإلكتروني الموحدة للأندية المصرية
          </p>
        </div>

        <RegistrationForm selectedClub={selectedClub} />
      </main>

      <footer className="border-t border-border mt-auto bg-white py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>© 2024 الاتحاد المصري لكرة القدم - جميع الحقوق محفوظة</p>
          <p className="mt-1">تم التطوير بواسطة قطاع التكنولوجيا والمعلومات</p>
        </div>
      </footer>
    </div>
  );
}
