import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader, User, Lock, Phone, Mail, UserPlus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlayerRegister() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password || !formData.fullName || !formData.phone) {
      toast({
        title: "تنبيه",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    if (formData.phone.length !== 11) {
      toast({
        title: "خطأ",
        description: "رقم الهاتف يجب أن يكون 11 رقم",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/player/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          email: formData.email || null,
          phone: formData.phone,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل التسجيل");
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: "مرحباً بك في سوكر هانترز",
      });
      navigate("/player/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء التسجيل",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-background to-emerald-50 flex items-center justify-center p-4 py-8" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
        
        <Card className="shadow-2xl border-emerald-200">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل لاعب جديد</CardTitle>
            <CardDescription className="text-base">
              أنشئ حسابك للتسجيل في اختبارات الأندية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  الاسم الكامل *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-fullname"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اسم المستخدم *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="اختر اسم مستخدم"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-username"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01234567890"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isLoading}
                  maxLength={11}
                  data-testid="input-player-phone"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني (اختياري)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-email"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  كلمة المرور *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="6 أحرف على الأقل"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-password"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  تأكيد كلمة المرور *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="أعد كتابة كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-confirm-password"
                  className="h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-player-register-submit"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p className="mb-3">لديك حساب بالفعل؟</p>
                <Link href="/player/login">
                  <Button variant="outline" className="w-full">
                    تسجيل الدخول
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
