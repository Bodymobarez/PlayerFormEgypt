import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Loader, 
  Shield, 
  Users, 
  BarChart3, 
  CreditCard, 
  Building2,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginMutation } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }
    login({ username, password });
  };

  const features = [
    {
      icon: Users,
      title: "إدارة التسجيلات",
      description: "تابع جميع طلبات الاختبار المقدمة لناديك",
    },
    {
      icon: BarChart3,
      title: "إحصائيات متقدمة",
      description: "تقارير وإحصائيات شاملة عن أداء التسجيلات",
    },
    {
      icon: CreditCard,
      title: "متابعة المدفوعات",
      description: "تتبع حالة المدفوعات والإيرادات بسهولة",
    },
    {
      icon: Shield,
      title: "أمان عالي",
      description: "حماية كاملة لبيانات ناديك واللاعبين",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900" dir="rtl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2000')] bg-cover bg-center opacity-10" />
      
      <div className="relative min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowRight className="h-5 w-5" />
            <span>العودة للرئيسية</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">سيراميكا كليوباترا</h1>
              <p className="text-white/70">Cleopatra F.C.</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            أدر ناديك باحترافية
            <br />
            <span className="text-emerald-300">واكتشف المواهب الجديدة</span>
          </h2>

          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            منصة متكاملة لإدارة اختبارات اللاعبين ومتابعة التسجيلات والمدفوعات بكل سهولة
          </p>

          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <feature.icon className="h-8 w-8 text-emerald-300 mb-3" />
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm">
              نادي جديد؟{" "}
              <Link href="/club/register" className="text-emerald-300 hover:text-emerald-200 font-medium">
                سجل ناديك الآن
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center text-white">
              <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                <ArrowRight className="h-5 w-5" />
                <span>العودة للرئيسية</span>
              </Link>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold">سيراميكا كليوباترا</h1>
                  <p className="text-sm text-white/70">Cleopatra F.C.</p>
                </div>
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center space-y-2 pb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  تسجيل دخول النادي
                </CardTitle>
                <CardDescription className="text-base">
                  أدخل بيانات الدخول للوصول للوحة التحكم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base font-medium">
                      اسم المستخدم
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="أدخل اسم المستخدم الخاص بناديك"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loginMutation.isPending}
                      data-testid="input-club-username"
                      className="h-12 text-base"
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginMutation.isPending}
                      data-testid="input-club-password"
                      className="h-12 text-base"
                      autoComplete="current-password"
                    />
                  </div>

                  {loginMutation.isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                      {loginMutation.error instanceof Error
                        ? loginMutation.error.message
                        : "حدث خطأ في تسجيل الدخول"}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg"
                    data-testid="button-club-login"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin ml-2" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 ml-2" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-4 pt-4">
                    <Link 
                      href="/club/register"
                      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors text-sm font-medium"
                    >
                      <UserPlus className="h-4 w-4" />
                      سجل ناديك
                    </Link>
                    <button
                      type="button"
                      onClick={() => toast({
                        title: "استعادة كلمة المرور",
                        description: "تواصل مع الدعم الفني على support@soccerhunters.com لاستعادة كلمة المرور",
                      })}
                      className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <HelpCircle className="h-4 w-4" />
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-emerald-800 text-sm">بيانات تجريبية</p>
                        <p className="text-xs text-emerald-600 mt-1 font-mono">
                          اسم المستخدم: ahly | كلمة المرور: ahly123
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-white/60 text-sm mt-6">
              بالدخول للمنصة، أنت توافق على{" "}
              <a href="#" className="text-white/80 hover:text-white">شروط الاستخدام</a>
              {" "}و{" "}
              <a href="#" className="text-white/80 hover:text-white">سياسة الخصوصية</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
