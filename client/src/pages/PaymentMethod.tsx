import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, CreditCard, Wallet, Building2, ArrowRight } from "lucide-react";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

export default function PaymentMethod() {
  const [, navigate] = useLocation();

  const methods: PaymentMethodOption[] = [
    {
      id: "vodafone",
      name: "فودافون كاش",
      description: "تحويل الأموال من محفظة فودافون كاش",
      icon: <Smartphone className="h-12 w-12" />,
      color: "from-red-500 to-red-600",
      available: false,
    },
    {
      id: "credit-card",
      name: "البطاقة الائتمانية",
      description: "الدفع عبر بطاقة ائتمان أو خصم",
      icon: <CreditCard className="h-12 w-12" />,
      color: "from-blue-500 to-blue-600",
      available: true,
    },
    {
      id: "e-wallet",
      name: "المحفظة الإلكترونية",
      description: "الدفع عبر محفظتك الإلكترونية",
      icon: <Wallet className="h-12 w-12" />,
      color: "from-purple-500 to-purple-600",
      available: false,
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      description: "التحويل المباشر من حسابك البنكي",
      icon: <Building2 className="h-12 w-12" />,
      color: "from-emerald-500 to-emerald-600",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">اختر طريقة الدفع</h1>
          <p className="text-lg text-muted-foreground">اختر الطريقة التي تناسبك للدفع الآمن والسريع</p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                !method.available ? "opacity-50" : "cursor-pointer hover:shadow-xl"
              }`}
            >
              <div className={`bg-gradient-to-r ${method.color} p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-3">
                      {method.icon}
                    </div>
                  </div>
                  {!method.available && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      قريباً
                    </span>
                  )}
                </div>
              </div>

              <CardContent className="pt-6 pb-4">
                <CardTitle className="text-xl mb-2 text-foreground">{method.name}</CardTitle>
                <CardDescription className="text-sm mb-6">{method.description}</CardDescription>

                <Button
                  onClick={() => handlePaymentSelect(method.id)}
                  disabled={!method.available}
                  className={`w-full ${
                    method.available
                      ? "bg-gradient-to-r " + method.color + " text-white hover:opacity-90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {method.available ? (
                    <>
                      اختر هذه الطريقة
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </>
                  ) : (
                    "غير متاح حالياً"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">🔒 جميع المعاملات آمنة وموثوقة</span>
            <br />
            <span className="text-blue-800">بيانات الدفع محمية بأحدث تقنيات التشفير</span>
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="text-foreground border-foreground hover:bg-foreground/10"
          >
            العودة للتسجيل
          </Button>
        </div>
      </div>
    </div>
  );
}
