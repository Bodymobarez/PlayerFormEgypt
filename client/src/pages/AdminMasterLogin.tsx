import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMasterLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "فشل تسجيل الدخول");
      }
      return response.json();
    },
    onSuccess: () => {
      navigate("/admin/master");
    },
    onError: (error: any) => {
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
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-2 pb-8">
            <h1 className="text-4xl font-bold text-primary">Soccer Hunters</h1>
            <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
            <CardDescription className="text-base">
              نظام إدارة الاختبارات والأندية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  كلمة المرور الرئيسية
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  data-testid="input-master-password"
                  className="h-12 text-base"
                />
              </div>

              {loginMutation.isError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm text-center">
                  كلمة المرور غير صحيحة
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform"
                data-testid="button-master-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري الدخول...
                  </>
                ) : (
                  "الدخول للوحة التحكم"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p>كلمة المرور الافتراضية:</p>
                <p className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  admin123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
