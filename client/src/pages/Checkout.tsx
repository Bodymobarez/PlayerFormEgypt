import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle, XCircle, Copy, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PaymentDetails {
  paymentStatus: string;
  assessmentId: number;
  playerName?: string;
  clubName?: string;
  amount?: number;
  transactionId?: string;
  createdAt?: string;
}

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<PaymentDetails | null>(null);

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
          setDetails(data);
          setMessage("تم التسجيل بنجاح!");
        } else if (data.paymentStatus === "pending") {
          setStatus("loading");
          setMessage("جاري معالجة الدفع...");
          setDetails(data);
          // Retry after 3 seconds
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          setStatus("error");
          setMessage("فشل التحقق من الدفع. يرجى المحاولة مرة أخرى.");
          setDetails(data);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("حدث خطأ أثناء التحقق من الدفع. تحقق من الاتصال بالإنترنت");
      });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رقم التسجيل",
      className: "bg-blue-600 text-white border-none",
    });
  };

  const getCurrencySymbol = (leagueId?: string): string => {
    const LEAGUES = [
      { id: "egypt", currencySymbol: "ج.م" },
      { id: "saudi", currencySymbol: "﷼" },
      { id: "uae", currencySymbol: "د.إ" },
    ];
    const league = LEAGUES.find(l => l.id === leagueId);
    return league?.currencySymbol || "ج.م";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        {status === "loading" && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">جاري المعالجة...</CardTitle>
              <CardDescription className="text-blue-100">يرجى الانتظار قليلاً</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6 py-12">
              <Loader className="h-20 w-20 animate-spin text-blue-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">جاري التحقق من الدفع</p>
                <p className="text-sm text-muted-foreground">سيتم تحديث الصفحة تلقائياً عند اكتمال المعالجة</p>
              </div>
            </CardContent>
          </Card>
        )}

        {status === "success" && (
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-3">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">تم بنجاح!</CardTitle>
              <CardDescription className="text-green-100">تم قبول التسجيل والدفع</CardDescription>
            </CardHeader>
            <CardContent className="py-8 space-y-6">
              {/* Main Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-center font-semibold">شكراً لك على التسجيل في الاختبارات</p>
              </div>

              {/* Registration Details */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="text-center pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-2">رقم التسجيل</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-bold text-foreground">{details?.assessmentId}</p>
                    <button
                      onClick={() => copyToClipboard(String(details?.assessmentId))}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      title="نسخ رقم التسجيل"
                    >
                      <Copy className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {details?.playerName && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">اسم اللاعب</p>
                    <p className="font-semibold text-foreground">{details.playerName}</p>
                  </div>
                )}

                {details?.clubName && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">النادي</p>
                    <p className="font-semibold text-foreground">{details.clubName}</p>
                  </div>
                )}

                {details?.amount && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">المبلغ المدفوع</p>
                    <p className="font-semibold text-green-600">{(details.amount / 100).toFixed(2)} {getCurrencySymbol()}</p>
                  </div>
                )}

                {details?.createdAt && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">وقت التسجيل</p>
                    <p className="font-semibold text-foreground">{new Date(details.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                )}

                {details?.transactionId && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">معرّف المعاملة</p>
                    <p className="font-mono text-xs text-foreground break-all">{details.transactionId}</p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">الخطوات التالية:</p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">1.</span>
                    <span>احفظ رقم التسجيل في مكان آمن</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">2.</span>
                    <span>سيتم إرسال بيانات الاختبار عبر الواتس أو البريد الإلكتروني</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">3.</span>
                    <span>تأكد من حضورك في الموعد المحدد</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => navigate("/")} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Home className="h-4 w-4 ml-2" />
                  العودة للرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-3">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-3xl">حدث خطأ</CardTitle>
              <CardDescription className="text-red-100">لم نتمكن من إتمام العملية</CardDescription>
            </CardHeader>
            <CardContent className="py-8 space-y-6">
              {/* Error Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-semibold mb-2">عذراً</p>
                <p className="text-red-600 text-sm">{message}</p>
              </div>

              {/* Troubleshooting */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-900 mb-3">حاول المتابعة:</p>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>تحقق من رصيد حسابك البنكي</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>جرّب بطاقة ائتمان أخرى</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>تأكد من بيانات البطاقة</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>تحقق من اتصالك بالإنترنت</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => navigate("/")} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Home className="h-4 w-4 ml-2" />
                  المحاولة مرة أخرى
                </Button>
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground text-center">
                في حالة استمرار المشكلة، يرجى التواصل مع دعم العملاء
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
