import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      setMessage("معرف الجلسة غير موجود");
      return;
    }

    // Verify payment with backend
    fetch(`/api/checkout/status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentStatus === "completed") {
          setStatus("success");
          setMessage(`شكراً لك! تم التسجيل في الاختبارات بنجاح. رقم التسجيل: ${data.assessmentId}`);
        } else {
          setStatus("error");
          setMessage("فشل التحقق من الدفع. يرجى المحاولة مرة أخرى.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("حدث خطأ أثناء التحقق من الدفع");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl">حالة الدفع</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader className="h-16 w-16 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">جاري التحقق من الدفع...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div className="space-y-2">
                <p className="font-bold text-lg text-green-600">تم بنجاح!</p>
                <p className="text-foreground">{message}</p>
              </div>
              <Button onClick={() => navigate("/")} className="w-full">
                العودة للرئيسية
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <div className="space-y-2">
                <p className="font-bold text-lg text-destructive">خطأ</p>
                <p className="text-foreground">{message}</p>
              </div>
              <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                العودة للمحاولة مرة أخرى
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
