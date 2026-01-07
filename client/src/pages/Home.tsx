import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Link } from "wouter";
import { Header, CLUBS, LEAGUES, Club, League } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LogIn, 
  Settings, 
  UserPlus, 
  Building2, 
  Trophy, 
  Users, 
  ClipboardCheck,
  CreditCard,
  Star,
  ChevronDown,
  Shield,
} from "lucide-react";

interface ClubFromAPI {
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  assessmentPrice?: number;
}

export default function Home() {
  const { club: authClub, isAuthenticated } = useAuth();
  // سيراميكا كليوباترا فقط - لا حاجة لاختيار الدوري أو النادي
  const [selectedClub, setSelectedClub] = useState<Club | null>(CLUBS[0] || null);
  const [showRegistration, setShowRegistration] = useState(false);

  const { data: apiClubs } = useQuery<ClubFromAPI[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs", {
        credentials: "include",
      });
      if (!response.ok) return [];
      const json = await response.json();
      return json.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  // تحديث بيانات النادي من API إذا كانت متاحة
  const clubs: Club[] = CLUBS.map(staticClub => {
    const apiClub = apiClubs?.find(c => c.clubId === staticClub.id);
    if (apiClub) {
      return {
        ...staticClub,
        name: apiClub.name || staticClub.name,
        logoUrl: apiClub.logoUrl || staticClub.logoUrl,
        primaryColor: apiClub.primaryColor || staticClub.primaryColor,
        assessmentPrice: apiClub.assessmentPrice ?? staticClub.assessmentPrice,
      };
    }
    return staticClub;
  });

  useEffect(() => {
    // تأكد من أن النادي المختار هو سيراميكا كليوباترا
    if (clubs.length > 0) {
      const ceramicaClub = clubs.find(c => c.id === "ceramica-cleopatra") || clubs[0];
      if (ceramicaClub) {
        setSelectedClub(prevClub => {
          // تحديث فقط إذا تغيرت البيانات
          if (!prevClub || prevClub.id !== ceramicaClub.id) {
            return ceramicaClub;
          }
          
          const hasChanges = 
            ceramicaClub.assessmentPrice !== prevClub.assessmentPrice ||
            ceramicaClub.name !== prevClub.name ||
            ceramicaClub.logoUrl !== prevClub.logoUrl ||
            ceramicaClub.primaryColor !== prevClub.primaryColor;
          
          return hasChanges ? ceramicaClub : prevClub;
        });
      }
    }
  }, [clubs, apiClubs]);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const handleClubChange = (clubId: string) => {
    // لا حاجة للتغيير - نادي واحد فقط
    const club = clubs.find(c => c.id === clubId) || clubs[0] || null;
    setSelectedClub(club);
  };

  const scrollToRegistration = () => {
    setShowRegistration(true);
    setTimeout(() => {
      document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              {selectedClub && (
                <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              )}
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white">سيراميكا كليوباترا</h1>
                <p className="text-[10px] sm:text-xs" style={{ color: 'hsl(43 96% 58%)' }}>Cleopatra F.C.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10" data-testid="header-club-login">
                  <Building2 className="h-4 w-4 ml-2" />
                  دخول النادي
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="ghost" className="text-white hover:bg-white/10" data-testid="header-admin-login">
                  <Settings className="h-4 w-4 ml-2" />
                  الإدارة
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6" style={{ color: 'hsl(43 96% 58%)' }}>
              <Star className="h-4 w-4" />
              <span>منصة التسجيل في اختبارات سيراميكا كليوباترا</span>
            </div>
            
            {/* تم إزالة اختيار الدوري - النادي واحد فقط */}
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
              انضم إلى
              <br />
              <span className="text-transparent bg-clip-text" style={{ 
                backgroundImage: 'linear-gradient(to right, hsl(43 96% 58%), hsl(0 84% 48%))'
              }}>
                سيراميكا كليوباترا
              </span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              سجل في اختبارات نادي سيراميكا كليوباترا واحصل على فرصتك للاحتراف مع واحد من أفضل أندية الدوري المصري
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button
                size="lg"
                className="text-lg h-14 px-8 shadow-2xl gap-3"
                style={{
                  background: 'linear-gradient(to right, hsl(0 84% 48%), hsl(0 84% 42%))',
                  boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.3), 0 10px 10px -5px rgba(220, 38, 38, 0.2)'
                }}
                onClick={scrollToRegistration}
                data-testid="button-start-registration"
              >
                <UserPlus className="h-5 w-5" />
                سجل الآن كلاعب
              </Button>
              
              <Link href="/player/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg h-14 px-8 border-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm gap-3"
                  data-testid="button-player-login-hero"
                >
                  <LogIn className="h-5 w-5" />
                  دخول اللاعب
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: 'hsl(43 96% 58%)' }} />
                <span>+5000 لاعب مسجل</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" style={{ color: 'hsl(43 96% 58%)' }} />
                <span>تأسس 2007</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" style={{ color: 'hsl(222 47% 11%)' }} />
                <span>دفع آمن</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف تعمل المنصة؟</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              خطوات بسيطة تفصلك عن حلمك بالاحتراف
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Building2,
                title: "سيراميكا كليوباترا",
                description: "التسجيل في اختبارات نادي سيراميكا كليوباترا",
                color: "text-red-600",
                bg: "bg-red-100",
              },
              {
                icon: ClipboardCheck,
                title: "سجل بياناتك",
                description: "أكمل استمارة التسجيل ببياناتك الشخصية ومركز لعبك",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
              },
              {
                icon: CreditCard,
                title: "ادفع الاشتراك",
                description: "ادفع رسوم الاختبار عن طريق فودافون كاش أو البطاقة",
                color: "text-red-600",
                bg: "bg-red-100",
              },
              {
                icon: Trophy,
                title: "احضر الاختبار",
                description: "احضر في الموعد المحدد واظهر مهاراتك أمام المدربين",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <step.icon className={`h-10 w-10 ${step.color}`} />
                </div>
                <div className="text-2xl font-bold text-muted-foreground mb-2">{index + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">سيراميكا كليوباترا</h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              نادي سيراميكا كليوباترا لكرة القدم - تأسس عام 2007
            </p>
          </div>
          
          {selectedClub && (
            <div className="flex justify-center">
              <div 
                className="group cursor-pointer transform hover:scale-105 transition-transform max-w-md w-full"
                onClick={() => {
                  scrollToRegistration();
                }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 flex flex-col items-center justify-center" style={{
                  borderColor: selectedClub.primaryColor
                }}>
                  <img 
                    src={selectedClub.logoUrl} 
                    alt={selectedClub.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain mb-3 sm:mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logos/default.png";
                    }}
                  />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-2" style={{ color: selectedClub.primaryColor }}>{selectedClub.name}</h3>
                  <p className="text-muted-foreground text-center">Cleopatra F.C.</p>
                  <div className="mt-4 px-6 py-2 rounded-full" style={{ 
                    backgroundColor: selectedClub.primaryColor,
                    color: 'white'
                  }}>
                    <span className="font-semibold">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{
                background: 'linear-gradient(to bottom right, hsl(0 84% 48%), hsl(0 84% 42%))'
              }}>
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">أنا لاعب</h3>
              <p className="text-gray-400 mb-6 text-sm">
                سجل في اختبارات سيراميكا كليوباترا وابدأ رحلة الاحتراف
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  style={{
                    background: 'linear-gradient(to right, hsl(0 84% 48%), hsl(0 84% 42%))'
                  }}
                  onClick={scrollToRegistration}
                  data-testid="button-player-register-card"
                >
                  تسجيل جديد
                </Button>
                <Link href="/player/login" className="block">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="button-player-login-card">
                    دخول حسابي
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{
                background: 'linear-gradient(to bottom right, hsl(43 96% 58%), hsl(43 96% 52%))'
              }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">دخول النادي</h3>
              <p className="text-gray-400 mb-6 text-sm">
                أدر اختبارات سيراميكا كليوباترا وتابع اللاعبين المسجلين
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button 
                    className="w-full" 
                    style={{
                      background: 'linear-gradient(to right, hsl(43 96% 58%), hsl(43 96% 52%))'
                    }}
                    data-testid="button-club-login-card"
                  >
                    دخول النادي
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">إدارة المنصة</h3>
              <p className="text-gray-400 mb-6 text-sm">
                لوحة تحكم شاملة لإدارة الأندية والأسعار
              </p>
              <div className="space-y-3">
                <Link href="/admin/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" data-testid="button-admin-login-card">
                    دخول لوحة التحكم
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showRegistration && (
        <section id="registration-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">سجل في الاختبار</h2>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                أكمل بياناتك وانضم لنادي أحلامك
              </p>
            </div>
            
            {/* لا حاجة للـ Header - النادي واحد فقط */}
            {selectedClub && (
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md flex items-center gap-3 sm:gap-4">
                  <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain" />
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{selectedClub.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(0)} ج.م</p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-8">
              <RegistrationForm selectedClub={selectedClub} />
            </div>
          </div>
        </section>
      )}

      <section className="py-16 text-white text-center" style={{
        background: 'linear-gradient(to right, hsl(0 84% 48%), hsl(0 84% 42%))'
      }}>
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">جاهز تبدأ رحلتك مع سيراميكا كليوباترا؟</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            آلاف اللاعبين سجلوا بالفعل وحصلوا على فرصتهم. لا تضيع فرصتك للانضمام إلى واحد من أفضل الأندية!
          </p>
          <Button
            size="lg"
            className="text-lg h-14 px-10 bg-white shadow-2xl hover:bg-gray-100"
            style={{ color: 'hsl(0 84% 48%)' }}
            onClick={scrollToRegistration}
            data-testid="button-cta-register"
          >
            <UserPlus className="h-5 w-5 ml-2" />
            سجل الآن
          </Button>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                {selectedClub && (
                  <img src={selectedClub.logoUrl} alt={selectedClub.name} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                )}
                <div>
                  <h3 className="text-sm sm:text-base font-bold">سيراميكا كليوباترا</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">Cleopatra F.C.</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                منصة التسجيل في اختبارات نادي سيراميكا كليوباترا لكرة القدم. انضم إلى النادي وابدأ رحلتك في عالم الاحتراف.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/player/register" className="hover:text-white transition">تسجيل لاعب</a></li>
                <li><a href="/player/login" className="hover:text-white transition">دخول اللاعب</a></li>
                <li><a href="/club/register" className="hover:text-white transition">تسجيل نادي</a></li>
                <li><a href="/login" className="hover:text-white transition">دخول النادي</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <p className="text-gray-400 text-sm mb-2">
                للاستفسارات والدعم الفني
              </p>
              <p className="text-green-400 text-sm">
                support@soccerhunters.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2024 سيراميكا كليوباترا - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
