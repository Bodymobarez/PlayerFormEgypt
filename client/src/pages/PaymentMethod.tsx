import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  logo: string;
  bgColor: string;
  available: boolean;
}

export default function PaymentMethod() {
  const [, navigate] = useLocation();

  const methods: PaymentMethodOption[] = [
    {
      id: "credit-card",
      name: "البطاقة الائتمانية",
      description: "الدفع عبر بطاقة ائتمان أو خصم (Visa / Mastercard)",
      logo: "/payment-logos/visa.png",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      available: true,
    },
    {
      id: "vodafone",
      name: "فودافون كاش",
      description: "تحويل الأموال من محفظة فودافون كاش",
      logo: "/payment-logos/vodafone-cash.png",
      bgColor: "bg-gradient-to-br from-red-600 to-red-800",
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

  const handlePaymentSelect = (methodId: string) => {
    if (methodId === "credit-card") {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 py-12 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">اختر طريقة الدفع</h1>
          <p className="text-lg text-gray-600">اختر الطريقة التي تناسبك للدفع الآمن والسريع</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={`overflow-hidden transition-all duration-300 border-0 shadow-lg ${
                method.available 
                  ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" 
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
          <p className="text-blue-700 text-sm">بيانات الدفع محمية بأحدث تقنيات التشفير SSL</p>
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
      </div>
    </div>
  );
}
