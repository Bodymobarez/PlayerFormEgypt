import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import { Header, CLUBS } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Club } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Home() {
  const { club: authClub, isAuthenticated } = useAuth();
  const [selectedClub, setSelectedClub] = useState<Club | null>(CLUBS[0]);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

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

        {/* Admin Login Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-primary/5 border-primary/20 p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-foreground">مسؤول النادي؟</h3>
            <p className="text-muted-foreground mb-4">
              قم بتسجيل الدخول لعرض والتحكم في بيانات اللاعبين المسجلين
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2"
              data-testid="button-admin-login"
            >
              <a href="/login">
                <LogIn className="h-5 w-5" />
                تسجيل دخول الإدارة
              </a>
            </Button>
          </Card>
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
