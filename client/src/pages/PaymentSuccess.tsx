import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle, AlertCircle, Download, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AssessmentData {
  id: number;
  fullName: string;
  position: string;
  birthDate: string;
  nationalId: string;
  phone: string;
  clubId: string;
  assessmentPrice: number;
  paymentStatus: string;
  createdAt: string;
}

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
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
        if (data.paymentStatus === "completed" && data.assessment) {
          setStatus("success");
          setAssessment(data.assessment);
          setMessage("تم التسجيل والدفع بنجاح!");
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

  const downloadReceipt = () => {
    if (!assessment) return;
    
    const receipt = `
السند الضريبي - Soccer Hunters
=====================================
رقم التسجيل: ${assessment.id}
التاريخ: ${new Date(assessment.createdAt).toLocaleDateString("ar-EG")}

بيانات اللاعب:
الاسم: ${assessment.fullName}
الرقم القومي: ${assessment.nationalId}
المركز: ${assessment.position}
الهاتف: ${assessment.phone}

تفاصيل الدفع:
المبلغ المدفوع: ${(assessment.assessmentPrice / 100).toFixed(2)} جنيه مصري
حالة الدفع: مكتمل
معرّف الجلسة: ${new URLSearchParams(window.location.search).get("session_id")}

شكراً لتسجيلك في اختباراتنا!
للمزيد من المعلومات، يرجى زيارة: soccerhunters.com
    `;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receipt));
    element.setAttribute("download", `receipt_${assessment.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-green-200">
        <CardHeader className="text-center pb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
          {status === "success" && (
            <>
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-3xl text-green-700">تم الدفع بنجاح!</CardTitle>
              <CardDescription className="text-lg text-green-600 mt-2">
                شكراً لتسجيلك في منصة Soccer Hunters
              </CardDescription>
            </>
          )}
          {status === "loading" && (
            <>
              <Loader className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">جاري التحقق من الدفع...</CardTitle>
            </>
          )}
          {status === "error" && (
            <>
              <AlertCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl text-destructive">خطأ في الدفع</CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="pt-8">
          {status === "loading" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">يرجى الانتظار...</p>
            </div>
          )}

          {status === "success" && assessment && (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">
                  ✓ تم قبول دفعتك وتسجيل بيانات الاختبار الخاصة بك بنجاح
                </p>
              </div>

              {/* Registration Number */}
              <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-muted-foreground">رقم التسجيل</p>
                <p className="text-3xl font-bold text-blue-700">#{assessment.id}</p>
                <p className="text-xs text-muted-foreground mt-2">احفظ هذا الرقم للمراجعة</p>
              </div>

              <Separator />

              {/* Player Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">بيانات اللاعب</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">الاسم</p>
                      <p className="font-semibold text-foreground">{assessment.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الرقم القومي</p>
                      <p className="font-semibold text-foreground" dir="ltr">{assessment.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">المركز</p>
                      <p className="font-semibold text-foreground">{assessment.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الهاتف</p>
                      <p className="font-semibold text-foreground" dir="ltr">{assessment.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">تفاصيل الدفع</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">المبلغ المدفوع</p>
                      <p className="font-bold text-2xl text-green-600">
                        {(assessment.assessmentPrice / 100).toFixed(2)} ج.م
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">حالة الدفع</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="font-semibold text-green-600">مكتمل</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                      <p className="font-semibold">
                        {new Date(assessment.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Next Steps */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-bold text-amber-900 mb-3">الخطوات التالية:</h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>✓ سيتم مراجعة بياناتك من قبل فريق النادي</li>
                  <li>✓ سوف نرسل لك تفاصيل موعد الاختبار برسالة بريدية</li>
                  <li>✓ يمكنك متابعة حالة اختبارك من خلال بيانات هاتفك</li>
                  <li>✓ للاستفسارات، تواصل مع فريق الدعم</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={downloadReceipt}
                  variant="outline"
                  className="gap-2"
                  data-testid="button-download-receipt"
                >
                  <Download className="h-4 w-4" />
                  تحميل السند
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  data-testid="button-contact-support"
                >
                  <Mail className="h-4 w-4" />
                  تواصل معنا
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-back-home"
                >
                  العودة للرئيسية
                </Button>
              </div>

              {/* Support Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-muted-foreground">
                <p>لديك استفسارات؟</p>
                <p className="mt-1">
                  تواصل معنا على:{" "}
                  <a href="mailto:support@soccerhunters.com" className="text-primary font-semibold">
                    support@soccerhunters.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <p className="text-center text-foreground text-lg">{message}</p>
              <div className="space-y-3">
                <Button onClick={() => navigate("/")} className="w-full" size="lg">
                  العودة للرئيسية
                </Button>
                <Button onClick={() => navigate("/")} variant="outline" className="w-full" size="lg">
                  المحاولة مرة أخرى
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
