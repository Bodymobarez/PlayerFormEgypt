import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Copy, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSession {
  id: string;
  method: string;
  amount: number;
  status: string;
  reference?: string;
  instructions?: string;
  expiresAt: string;
}

export default function PaymentInstructions() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`/api/payment/session/${sessionId}`);
        if (!response.ok) throw new Error("فشل جلب معلومات الدفع");
        const json = await response.json();
        // Unwrap the response formatter
        const data = json.data || json;
        setSession(data);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل تحميل معلومات الدفع",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodName = (method: string) => {
    const names: Record<string, string> = {
      vodafone_cash: "فودافون كاش",
      anistapaي: "AnistaPay",
      e_wallet: "المحفظة الإلكترونية",
      bank_transfer: "تحويل بنكي",
    };
    return names[method] || method;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">فشل تحميل معلومات الدفع</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-3">تعليمات الدفع</h1>
          <p className="text-lg text-muted-foreground">
            {getMethodName(session.method)}
          </p>
        </div>

        {/* Amount Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">المبلغ المطلوب</p>
              <p className="text-5xl font-bold text-green-700 mb-4">
                {(session.amount / 100).toFixed(2)} ج.م
              </p>
              {session.reference && (
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground mb-2">رقم المرجع</p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="text-xl font-mono font-bold text-green-700">
                      {session.reference}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(session.reference!)}
                      className="gap-2"
                      data-testid="button-copy-reference"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          تم النسخ
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          نسخ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>خطوات الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-sm font-mono leading-relaxed text-right">
              {session.instructions}
            </div>
          </CardContent>
        </Card>

        {/* Expiry Warning */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6 flex items-start gap-4">
            <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-amber-900 mb-2">
                انتبه: هذه الجلسة ستنتهي في 24 ساعة
              </p>
              <p className="text-sm text-amber-800">
                يجب عليك إتمام الدفع قبل انتهاء المدة المحددة، وإلا سيتم إلغاء الطلب
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1"
            data-testid="button-cancel"
          >
            إلغاء
          </Button>
          <Button
            onClick={() => navigate(`/payment-success?session_id=${sessionId}&method=${session.method}`)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            data-testid="button-confirm-payment"
          >
            تأكيد الدفع
          </Button>
        </div>

        {/* Support Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-center text-blue-800">
              هل واجهت مشكلة؟{" "}
              <a href="mailto:support@soccerhunters.com" className="font-semibold text-blue-600 hover:underline">
                تواصل معنا
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
