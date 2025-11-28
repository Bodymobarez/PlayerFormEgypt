import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  logoComponent?: React.ReactNode;
  bgColor: string;
  available: boolean;
}

function VodafoneLogo() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14">
      <circle cx="50" cy="50" r="45" fill="#E60000"/>
      <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" fill="white"/>
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">V</text>
    </svg>
  );
}

function VisaMastercardLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 80 50" className="h-10 w-16">
        <rect width="80" height="50" rx="4" fill="#1A1F71"/>
        <text x="40" y="32" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontStyle="italic">VISA</text>
      </svg>
      <svg viewBox="0 0 80 50" className="h-10 w-16">
        <rect width="80" height="50" rx="4" fill="#000"/>
        <circle cx="30" cy="25" r="18" fill="#EB001B"/>
        <circle cx="50" cy="25" r="18" fill="#F79E1B"/>
        <circle cx="40" cy="25" r="10" fill="#FF5F00"/>
      </svg>
    </div>
  );
}

function InstaPayLogo() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14">
      <circle cx="50" cy="50" r="45" fill="#00A651"/>
      <path d="M30 50 L45 65 L70 35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="50" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">InstaPay</text>
    </svg>
  );
}

function WalletLogo() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14">
      <rect x="10" y="25" width="80" height="55" rx="8" fill="#8B5CF6"/>
      <rect x="55" y="40" width="30" height="25" rx="4" fill="#A78BFA"/>
      <circle cx="70" cy="52" r="6" fill="white"/>
      <rect x="20" y="35" width="25" height="4" rx="2" fill="#C4B5FD"/>
      <rect x="20" y="43" width="18" height="4" rx="2" fill="#C4B5FD"/>
    </svg>
  );
}

function BankLogo() {
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14">
      <polygon points="50,10 90,35 10,35" fill="#059669"/>
      <rect x="15" y="38" width="70" height="5" fill="#059669"/>
      <rect x="20" y="45" width="10" height="35" fill="#10B981"/>
      <rect x="35" y="45" width="10" height="35" fill="#10B981"/>
      <rect x="55" y="45" width="10" height="35" fill="#10B981"/>
      <rect x="70" y="45" width="10" height="35" fill="#10B981"/>
      <rect x="15" y="82" width="70" height="8" fill="#059669"/>
    </svg>
  );
}

export default function PaymentMethod() {
  const [, navigate] = useLocation();

  const methods: PaymentMethodOption[] = [
    {
      id: "credit-card",
      name: "البطاقة الائتمانية",
      description: "الدفع عبر بطاقة ائتمان أو خصم (Visa / Mastercard)",
      logoComponent: <VisaMastercardLogo />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      available: true,
    },
    {
      id: "vodafone",
      name: "فودافون كاش",
      description: "تحويل الأموال من محفظة فودافون كاش",
      logoComponent: <VodafoneLogo />,
      bgColor: "bg-gradient-to-br from-red-500 to-red-700",
      available: false,
    },
    {
      id: "instapay",
      name: "انستاباي",
      description: "الدفع الفوري عبر تطبيق انستاباي",
      logoComponent: <InstaPayLogo />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
      available: false,
    },
    {
      id: "e-wallet",
      name: "المحفظة الإلكترونية",
      description: "الدفع عبر محفظتك الإلكترونية",
      logoComponent: <WalletLogo />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
      available: false,
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      description: "التحويل المباشر من حسابك البنكي",
      logoComponent: <BankLogo />,
      bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
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
                  : "opacity-70"
              }`}
              onClick={() => method.available && handlePaymentSelect(method.id)}
            >
              <div className={`${method.bgColor} p-6 relative`}>
                <div className="flex justify-between items-start">
                  <div className="bg-white/90 rounded-xl p-3 shadow-lg">
                    {method.logoComponent}
                  </div>
                  {!method.available && (
                    <span className="bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white">
                      قريباً
                    </span>
                  )}
                </div>
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
