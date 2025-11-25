import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import { Header, CLUBS } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Club } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";

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
            منصة اختبارات اللاعبين
          </h2>
          <p className="text-muted-foreground text-lg">
            سجل في اختبارات النادي واشترك في الموسم الجديد
          </p>
        </div>

        {/* Admin Cards */}
        <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Club Admin */}
          <Card className="bg-primary/5 border-primary/20 p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-foreground">مسؤول النادي؟</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              قم بتسجيل الدخول لعرض والتحكم في قائمة اللاعبين المسجلين
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 w-full"
              data-testid="button-club-admin-login"
            >
              <a href="/login">
                <LogIn className="h-5 w-5" />
                دخول النادي
              </a>
            </Button>
          </Card>

          {/* Master Admin */}
          <Card className="bg-blue-50 border-blue-200 p-6 text-center">
            <h3 className="text-xl font-bold mb-2 text-blue-900">مسؤول البلاتفورم؟</h3>
            <p className="text-blue-700 mb-4 text-sm">
              لوحة تحكم رئيسية لإدارة جميع الأندية والاختبارات والأسعار
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 w-full bg-blue-600 hover:bg-blue-700"
              data-testid="button-master-admin-login"
            >
              <a href="/admin/login">
                <Settings className="h-5 w-5" />
                لوحة التحكم
              </a>
            </Button>
          </Card>
        </div>

        <RegistrationForm selectedClub={selectedClub} />
      </main>

      <footer className="border-t border-border mt-auto bg-white py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>© 2024 Soccer Hunters - جميع الحقوق محفوظة</p>
          <p className="mt-1">منصة متخصصة في اختبارات لاعبي كرة القدم</p>
        </div>
      </footer>
    </div>
  );
}
