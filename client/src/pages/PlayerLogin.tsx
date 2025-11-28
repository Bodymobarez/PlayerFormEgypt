import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader, Phone, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PlayerLogin() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !nationalId) {
      toast({
        title: "تنبيه",
        description: "الرجاء إدخال رقم الهاتف والرقم القومي",
        variant: "destructive",
      });
      return;
    }

    if (phone.length !== 11) {
      toast({
        title: "خطأ",
        description: "رقم الهاتف يجب أن يكون 11 رقم",
        variant: "destructive",
      });
      return;
    }

    if (nationalId.length !== 14) {
      toast({
        title: "خطأ",
        description: "الرقم القومي يجب أن يكون 14 رقم",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/player/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, nationalId }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل التحقق من البيانات");
      }

      // Store in session storage
      sessionStorage.setItem("playerPhone", phone);
      sessionStorage.setItem("playerNationalId", nationalId);
      navigate("/player/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "لم نجد سجل بهذه البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-background to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-purple-200">
          <CardHeader className="text-center space-y-2 pb-8">
            <h1 className="text-4xl font-bold text-purple-600">Soccer Hunters</h1>
            <CardTitle className="text-2xl">دخول اللاعب</CardTitle>
            <CardDescription className="text-base">
              تتبع حالة اختبارك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  maxLength={11}
                  data-testid="input-player-phone"
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">11 رقم بدءاً من 01</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId" className="text-base font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  الرقم القومي
                </Label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder="12345678901234"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  disabled={isLoading}
                  maxLength={14}
                  data-testid="input-player-national-id"
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">14 رقم</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform bg-purple-600 hover:bg-purple-700"
                data-testid="button-player-login-submit"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري البحث...
                  </>
                ) : (
                  "دخول"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p className="mb-3">لم تسجل بعد؟</p>
                <Button variant="outline" asChild className="w-full">
                  <a href="/">الرجوع للتسجيل</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
