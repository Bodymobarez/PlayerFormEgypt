import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader, Building2, User, Lock, Image, Palette, DollarSign, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClubRegister() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    clubId: "",
    username: "",
    password: "",
    confirmPassword: "",
    logoUrl: "",
    primaryColor: "hsl(220 70% 50%)",
    assessmentPrice: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateClubId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  };

  const handleNameChange = (value: string) => {
    handleChange("name", value);
    if (!formData.clubId) {
      handleChange("clubId", generateClubId(value));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.username || !formData.password || !formData.assessmentPrice) {
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

    const price = parseFloat(formData.assessmentPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال قيمة اشتراك صحيحة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/clubs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          clubId: formData.clubId || generateClubId(formData.name),
          username: formData.username,
          password: formData.password,
          logoUrl: formData.logoUrl || "/logos/default.png",
          primaryColor: formData.primaryColor,
          assessmentPrice: Math.round(price * 100),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل التسجيل");
      }

      toast({
        title: "تم التسجيل بنجاح",
        description: "مرحباً بناديكم في سوكر هانترز",
      });
      navigate("/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-background to-blue-50 flex items-center justify-center p-4 py-8" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
        
        <Card className="shadow-2xl border-blue-200">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل نادي جديد</CardTitle>
            <CardDescription className="text-base">
              سجل ناديك لاستقبال طلبات اللاعبين
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  اسم النادي *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="مثال: نادي الفتح الرياضي"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-club-name"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clubId" className="text-base font-medium flex items-center gap-2">
                  معرف النادي (اختياري)
                </Label>
                <Input
                  id="clubId"
                  type="text"
                  placeholder="al-fatah"
                  value={formData.clubId}
                  onChange={(e) => handleChange("clubId", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-club-id"
                  className="h-12 text-base font-mono"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">يستخدم في الرابط، اتركه فارغاً للتوليد التلقائي</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    اسم المستخدم *
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="club_admin"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    disabled={isLoading}
                    data-testid="input-club-username"
                    className="h-12 text-base"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentPrice" className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    قيمة الاشتراك *
                  </Label>
                  <Input
                    id="assessmentPrice"
                    type="number"
                    placeholder="500"
                    value={formData.assessmentPrice}
                    onChange={(e) => handleChange("assessmentPrice", e.target.value)}
                    disabled={isLoading}
                    data-testid="input-club-price"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    data-testid="input-club-password"
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
                    data-testid="input-club-confirm-password"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-base font-medium flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  رابط شعار النادي (اختياري)
                </Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  disabled={isLoading}
                  data-testid="input-club-logo"
                  className="h-12 text-base"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-base font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  اللون الأساسي
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="text"
                    placeholder="hsl(220 70% 50%)"
                    value={formData.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    disabled={isLoading}
                    data-testid="input-club-color"
                    className="h-12 text-base flex-1"
                    dir="ltr"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border shadow-inner flex-shrink-0"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform bg-blue-600 hover:bg-blue-700"
                data-testid="button-club-register-submit"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  "تسجيل النادي"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p className="mb-3">ناديك مسجل بالفعل؟</p>
                <Link href="/login">
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
