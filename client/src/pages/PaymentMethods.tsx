import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export default function PaymentMethods() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const assessmentId = searchParams.get("assessment_id");

  const { data: paymentMethods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const response = await fetch("/api/payment/methods");
      if (!response.ok) throw new Error("فشل جلب طرق الدفع");
      const json = await response.json();
      // Unwrap the response formatter
      return json.data || json;
    },
  });

  const handleSelectMethod = async (methodId: string) => {
    if (!assessmentId) {
      toast({
        title: "خطأ",
        description: "معرف التسجيل مفقود",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSelectedMethod(methodId);

    try {
      const response = await fetch("/api/payment/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: parseInt(assessmentId),
          method: methodId,
        }),
      });

      if (!response.ok) throw new Error("فشل إنشاء جلسة الدفع");

      const json = await response.json();
      const data = json.data || json;

      if (methodId === "card" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        navigate(`/payment-instructions?session_id=${data.id}`);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء معالجة طلبك",
        variant: "destructive",
      });
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">اختر طريقة الدفع</h1>
          <p className="text-lg text-muted-foreground">
            اختر الطريقة التي تناسبك للدفع الآمن والسريع
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {/* Payment Methods Grid */}
        {!isLoading && paymentMethods && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedMethod === method.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => !isProcessing && handleSelectMethod(method.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{method.icon}</div>
                    {selectedMethod === method.id && !isProcessing && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{method.description}</p>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMethod(method.id);
                    }}
                    disabled={isProcessing && selectedMethod !== method.id}
                    className="w-full gap-2"
                    data-testid={`button-select-${method.id}`}
                  >
                    {isProcessing && selectedMethod === method.id ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4" />
                        اختر هذه الطريقة
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">معلومات أمان مهمة</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>✓ جميع طرق الدفع آمنة وموثوقة</p>
            <p>✓ بيانات الدفع محمية بتشفير عالي المستوى</p>
            <p>✓ يمكنك تتبع حالة الدفع في أي وقت</p>
            <p>✓ في حالة المشاكل، تواصل مع فريق الدعم</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
