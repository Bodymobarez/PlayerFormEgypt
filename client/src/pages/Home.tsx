import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Redirect, Link } from "wouter";
import { Header, CLUBS, Club } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
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
    if (clubs.length > 0 && !selectedClub) {
      setSelectedClub(clubs[0]);
    }
  }, [clubs, selectedClub]);

  useEffect(() => {
    if (selectedClub && apiClubs) {
      const updatedClub = clubs.find(c => c.id === selectedClub.id);
      if (updatedClub && updatedClub.assessmentPrice !== selectedClub.assessmentPrice) {
        setSelectedClub(updatedClub);
      }
    }
  }, [apiClubs, selectedClub, clubs]);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const handleClubChange = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId) || null;
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Soccer Hunters</h1>
                <p className="text-xs text-green-300">صائدو الكرة</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10" data-testid="header-club-login">
                  <Building2 className="h-4 w-4 ml-2" />
                  الأندية
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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-green-300 text-sm mb-6">
              <Star className="h-4 w-4" />
              <span>أكبر منصة اختبارات لاعبين في مصر</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              حقق حلمك
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                وانضم لنادي أحلامك
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              سجل في اختبارات أكبر الأندية المصرية واحصل على فرصتك للاحتراف مع أفضل الفرق
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button
                size="lg"
                className="text-lg h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/30 gap-3"
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
                <Users className="h-5 w-5 text-green-400" />
                <span>+5000 لاعب مسجل</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span>18 نادي</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
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
                title: "اختر النادي",
                description: "اختر النادي الذي تريد التسجيل في اختباراته من بين 18 نادي",
                color: "text-blue-500",
                bg: "bg-blue-100",
              },
              {
                icon: ClipboardCheck,
                title: "سجل بياناتك",
                description: "أكمل استمارة التسجيل ببياناتك الشخصية ومركز لعبك",
                color: "text-purple-500",
                bg: "bg-purple-100",
              },
              {
                icon: CreditCard,
                title: "ادفع الاشتراك",
                description: "ادفع رسوم الاختبار عن طريق فودافون كاش أو البطاقة",
                color: "text-green-500",
                bg: "bg-green-100",
              },
              {
                icon: Trophy,
                title: "احضر الاختبار",
                description: "احضر في الموعد المحدد واظهر مهاراتك أمام المدربين",
                color: "text-yellow-500",
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الأندية المشاركة</h2>
            <p className="text-muted-foreground text-lg">
              أندية الدوري المصري الممتاز
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 max-w-6xl mx-auto">
            {clubs.slice(0, 18).map((club) => (
              <div
                key={club.id}
                className="group cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => {
                  setSelectedClub(club);
                  scrollToRegistration();
                }}
              >
                <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all border border-gray-100 aspect-square flex flex-col items-center justify-center">
                  <img 
                    src={club.logoUrl} 
                    alt={club.name}
                    className="w-12 h-12 object-contain mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logos/default.png";
                    }}
                  />
                  <p className="text-xs font-medium text-center text-gray-700 line-clamp-2">{club.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">أنا لاعب</h3>
              <p className="text-gray-400 mb-6 text-sm">
                سجل في اختبارات النادي وابدأ رحلة الاحتراف
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">أنا نادي</h3>
              <p className="text-gray-400 mb-6 text-sm">
                أدر اختبارات ناديك وتابع اللاعبين المسجلين
              </p>
              <div className="space-y-3">
                <Link href="/club/register" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" data-testid="button-club-register-card">
                    تسجيل نادي جديد
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" data-testid="button-club-login-card">
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
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">سجل في الاختبار</h2>
              <p className="text-muted-foreground text-lg">
                أكمل بياناتك وانضم لنادي أحلامك
              </p>
            </div>
            
            <Header selectedClub={selectedClub} onClubChange={handleClubChange} clubs={clubs} minimal />
            <div className="mt-8">
              <RegistrationForm selectedClub={selectedClub} />
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز تبدأ رحلتك؟</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            آلاف اللاعبين سجلوا بالفعل وحصلوا على فرصتهم. لا تضيع فرصتك!
          </p>
          <Button
            size="lg"
            className="text-lg h-14 px-10 bg-white text-green-700 hover:bg-gray-100 shadow-2xl"
            onClick={scrollToRegistration}
            data-testid="button-cta-register"
          >
            <UserPlus className="h-5 w-5 ml-2" />
            سجل الآن مجاناً
          </Button>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Soccer Hunters</h3>
                  <p className="text-xs text-gray-400">صائدو الكرة</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                أكبر منصة لاختبارات لاعبي كرة القدم في مصر. نربط بين اللاعبين الموهوبين وأكبر الأندية المصرية.
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
            <p>© 2024 Soccer Hunters - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
