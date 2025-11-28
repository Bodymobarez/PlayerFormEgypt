import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Loader, 
  Shield, 
  Settings,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Crown,
  BarChart3,
  Users,
  Building2,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMasterLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في لوحة تحكم الإدارة",
      });
      navigate("/admin/master");
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "بيانات غير صحيحة",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال كلمة المرور",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username: username || "admin", password });
  };

  const adminFeatures = [
    {
      icon: Building2,
      title: "إدارة الأندية",
      description: "إضافة وتعديل وإدارة جميع الأندية المسجلة في المنصة",
    },
    {
      icon: Users,
      title: "إدارة اللاعبين",
      description: "مراجعة جميع التسجيلات وبيانات اللاعبين المسجلين",
    },
    {
      icon: BarChart3,
      title: "تقارير شاملة",
      description: "إحصائيات وتقارير تفصيلية عن أداء المنصة",
    },
    {
      icon: Settings,
      title: "إعدادات النظام",
      description: "تحكم كامل في إعدادات وتكوينات المنصة",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000')] bg-cover bg-center opacity-5" />
      
      <div className="relative min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowRight className="h-5 w-5" />
            <span>العودة للرئيسية</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 backdrop-blur flex items-center justify-center border border-amber-500/30">
              <Crown className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
              <p className="text-white/70">Soccer Hunters</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            تحكم كامل
            <br />
            <span className="text-amber-400">في منصة Soccer Hunters</span>
          </h2>

          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            لوحة تحكم متكاملة لإدارة الأندية واللاعبين والمدفوعات وجميع جوانب المنصة
          </p>

          <div className="grid grid-cols-2 gap-6">
            {adminFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <feature.icon className="h-8 w-8 text-amber-400 mb-3" />
                <h3 className="font-bold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <p className="font-medium text-amber-200 text-sm">منطقة محمية</p>
                <p className="text-xs text-amber-100/70 mt-1">
                  هذه اللوحة مخصصة للمسؤولين المعتمدين فقط. الوصول غير المصرح به محظور.
                </p>
              </div>
            </div>
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
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 backdrop-blur flex items-center justify-center border border-amber-500/30">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold">لوحة تحكم الإدارة</h1>
                  <p className="text-sm text-white/70">Soccer Hunters</p>
                </div>
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
              <CardHeader className="text-center space-y-2 pb-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-2 shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  دخول الإدارة العليا
                </CardTitle>
                <CardDescription className="text-base">
                  أدخل بيانات الدخول للوصول للوحة التحكم الرئيسية
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
                      placeholder="أدخل اسم المستخدم (اختياري)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loginMutation.isPending}
                      data-testid="input-admin-username"
                      className="h-12 text-base"
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      كلمة المرور الرئيسية
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loginMutation.isPending}
                        data-testid="input-admin-password"
                        className="h-12 text-base pl-12"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {loginMutation.isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {loginMutation.error instanceof Error
                        ? loginMutation.error.message
                        : "حدث خطأ في تسجيل الدخول"}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg"
                    data-testid="button-admin-login"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin ml-2" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 ml-2" />
                        دخول لوحة التحكم
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-slate-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">بيانات تجريبية</p>
                        <p className="text-xs text-slate-600 mt-1 font-mono">
                          كلمة المرور: admin123
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    هل أنت نادي؟{" "}
                    <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                      دخول الأندية
                    </Link>
                  </p>
                  <p className="text-sm text-gray-500">
                    هل أنت لاعب؟{" "}
                    <Link href="/player/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      دخول اللاعبين
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium text-red-200 text-sm">تحذير أمني</p>
                  <p className="text-xs text-red-100/70 mt-1">
                    لا تشارك بيانات الدخول مع أي شخص. جميع محاولات الدخول يتم تسجيلها ومراقبتها.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
