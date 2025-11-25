import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-2 pb-8">
            <CardTitle className="text-3xl font-bold text-primary">
              تسجيل دخول النادي
            </CardTitle>
            <CardDescription className="text-base">
              منصة تسجيل الناشئين والبراعم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loginMutation.isPending}
                  data-testid="input-username"
                  className="h-12 text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  أدخل اسم المستخدم الخاص بنادك
                </p>
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
                  data-testid="input-password"
                  className="h-12 text-base"
                />
              </div>

              {loginMutation.isError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm text-center">
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "حدث خطأ في تسجيل الدخول"}
                </div>
              )}

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform"
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="pt-4 border-t text-center text-sm text-muted-foreground">
                <p>بيانات تجريبية:</p>
                <p className="mt-2 font-mono text-xs bg-muted p-2 rounded">
                  <strong>Username:</strong> ahly<br />
                  <strong>Password:</strong> ahly123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
