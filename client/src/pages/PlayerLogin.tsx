import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader, User, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlayerLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/player/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل تسجيل الدخول");
      }

      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك",
      });
      navigate("/player/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-background to-emerald-50 flex items-center justify-center p-4" dir="rtl">
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
          <CardHeader className="text-center space-y-2 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">دخول اللاعب</CardTitle>
            <CardDescription className="text-base">
              سجل دخولك لمتابعة اختباراتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-username"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-player-password"
                  className="h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-player-login-submit"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري الدخول...
                  </>
                ) : (
                  "دخول"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p className="mb-3">ليس لديك حساب؟</p>
                <Link href="/player/register">
                  <Button variant="outline" className="w-full">
                    إنشاء حساب جديد
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
