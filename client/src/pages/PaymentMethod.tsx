import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Check, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  logo: string;
  bgColor: string;
  available: boolean;
  phoneNumber?: string;
}

export default function PaymentMethod() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const vodafoneNumber = "01061887799";

  const methods: PaymentMethodOption[] = [
    {
      id: "vodafone",
      name: "فودافون كاش",
      description: "تحويل الأموال من محفظة فودافون كاش",
      logo: "/payment-logos/vodafone-cash.png",
      bgColor: "bg-gradient-to-br from-red-600 to-red-800",
      available: true,
      phoneNumber: vodafoneNumber,
    },
    {
      id: "credit-card",
      name: "البطاقة الائتمانية",
      description: "الدفع عبر بطاقة ائتمان أو خصم (Visa / Mastercard)",
      logo: "/payment-logos/visa.png",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      available: false,
    },
    {
      id: "instapay",
      name: "انستاباي",
      description: "الدفع الفوري عبر تطبيق انستاباي",
      logo: "/payment-logos/instapay-logo.png",
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-800",
      available: false,
    },
    {
      id: "e-wallet",
      name: "المحفظة الإلكترونية",
      description: "الدفع عبر محفظتك الإلكترونية",
      logo: "/payment-logos/ewallet.png",
      bgColor: "bg-gradient-to-br from-sky-500 to-sky-700",
      available: false,
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      description: "التحويل المباشر من حسابك البنكي",
      logo: "/payment-logos/bank-transfer.png",
      bgColor: "bg-gradient-to-br from-slate-600 to-slate-800",
      available: false,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(vodafoneNumber);
      setCopied(true);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رقم فودافون كاش",
        className: "bg-green-600 text-white border-none",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "خطأ",
        description: "فشل نسخ الرقم",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSelect = (methodId: string) => {
    if (methodId === "vodafone") {
      setShowInstructions(true);
    } else if (methodId === "credit-card") {
      const assessmentData = sessionStorage.getItem("assessmentData");
      if (assessmentData) {
        const data = JSON.parse(assessmentData);
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          navigate("/checkout");
        }
      } else {
        navigate("/");
      }
    }
  };

  const assessmentData = sessionStorage.getItem("assessmentData");
  const parsedData = assessmentData ? JSON.parse(assessmentData) : null;
  
  // Handle both wrapped (data.assessment) and unwrapped (assessment) formats
  const assessment = parsedData?.data?.assessment || parsedData?.assessment;
  const amount = assessment?.assessmentPrice 
    ? (assessment.assessmentPrice / 100).toFixed(0) 
    : "---";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-12 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">اختر طريقة الدفع</h1>
          <p className="text-lg text-gray-600">اختر الطريقة التي تناسبك للدفع الآمن والسريع</p>
          {amount !== "---" && (
            <div className="mt-4 inline-block bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full font-bold text-lg">
              المبلغ المطلوب: {amount} جنيه
            </div>
          )}
        </div>

        {showInstructions ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 text-white text-center">
                <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <img 
                    src="/payment-logos/vodafone-cash.png" 
                    alt="Vodafone Cash"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">الدفع عبر فودافون كاش</h2>
                <p className="text-red-100">اتبع الخطوات التالية لإتمام الدفع</p>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-gray-600 mb-3">رقم فودافون كاش</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-gray-900 tracking-wider" dir="ltr">
                      {vodafoneNumber}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="border-red-200 hover:bg-red-50"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 font-bold mb-2">المبلغ المطلوب</p>
                  <p className="text-3xl font-bold text-amber-900">{amount} جنيه</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900">خطوات الدفع:</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                      <span>افتح تطبيق فودافون كاش أو اطلب *9*{vodafoneNumber}#</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                      <span>اختر "تحويل أموال" أو "Send Money"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                      <span>أدخل الرقم: <strong dir="ltr">{vodafoneNumber}</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                      <span>أدخل المبلغ: <strong>{amount} جنيه</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">5</span>
                      <span>أكد العملية بالرقم السري</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    بعد الدفع
                  </p>
                  <p className="text-emerald-700">
                    أرسل صورة من إيصال التحويل على واتساب للرقم 
                    <a 
                      href={`https://wa.me/2${vodafoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline mx-1" 
                      dir="ltr"
                    >
                      {vodafoneNumber}
                    </a>
                    مع اسم اللاعب
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowInstructions(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    رجوع
                  </Button>
                  <a
                    href={`https://wa.me/2${vodafoneNumber}?text=${encodeURIComponent(`السلام عليكم، قمت بتحويل مبلغ ${amount} جنيه لتسجيل اختبار اللاعب`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 ml-2" />
                      تواصل واتساب
                    </Button>
                  </a>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  العودة للصفحة الرئيسية
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {methods.map((method) => (
                <Card
                  key={method.id}
                  className={`overflow-hidden transition-all duration-300 border-0 shadow-lg ${
                    method.available 
                      ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer ring-2 ring-red-500 ring-offset-2" 
                      : "opacity-80"
                  }`}
                  onClick={() => method.available && handlePaymentSelect(method.id)}
                >
                  <div className={`${method.bgColor} p-5 relative min-h-[160px] flex items-center justify-center`}>
                    <div className="bg-white rounded-2xl p-4 shadow-xl">
                      <img 
                        src={method.logo} 
                        alt={method.name}
                        className="h-20 w-auto object-contain max-w-[180px]"
                      />
                    </div>
                    {method.available && (
                      <span className="absolute top-3 left-3 bg-green-500 px-4 py-1.5 rounded-full text-sm font-bold text-white animate-pulse">
                        متاح الآن
                      </span>
                    )}
                    {!method.available && (
                      <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white">
                        قريباً
                      </span>
                    )}
                  </div>

                  <CardContent className="pt-5 pb-5 bg-white">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{method.description}</p>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaymentSelect(method.id);
                      }}
                      disabled={!method.available}
                      className={`w-full h-12 text-base font-bold ${
                        method.available
                          ? `${method.bgColor} text-white hover:opacity-90 shadow-md`
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {method.available ? (
                        <span className="flex items-center justify-center gap-2">
                          اختر هذه الطريقة
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      ) : (
                        "غير متاح حالياً"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-bold text-blue-900">جميع المعاملات آمنة وموثوقة</span>
              </div>
              <p className="text-blue-700 text-sm">بيانات الدفع محمية بأحدث تقنيات التشفير</p>
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                العودة للتسجيل
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
