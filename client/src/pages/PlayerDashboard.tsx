import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlayerAssessment {
  id: number;
  fullName: string;
  clubId: string;
  phone: string;
  nationalId: string;
  position: string;
  paymentStatus: "pending" | "completed" | "failed";
  resultStatus: string | null;
  assessmentDate?: string;
  assessmentLocation?: string;
  createdAt: string;
}

interface Club {
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
}

export default function PlayerDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerNationalId, setPlayerNationalId] = useState("");

  useEffect(() => {
    const phone = sessionStorage.getItem("playerPhone");
    const nationalId = sessionStorage.getItem("playerNationalId");
    if (!phone || !nationalId) {
      navigate("/player/login");
    } else {
      setPlayerPhone(phone);
      setPlayerNationalId(nationalId);
    }
  }, [navigate]);

  const { data: assessments = [] } = useQuery<PlayerAssessment[]>({
    queryKey: ["player", "assessments", playerPhone, playerNationalId],
    enabled: !!playerPhone && !!playerNationalId,
    queryFn: async () => {
      const response = await fetch(`/api/player/assessments?phone=${playerPhone}&nationalId=${playerNationalId}`);
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const { data: clubs = [] } = useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem("playerPhone");
    sessionStorage.removeItem("playerNationalId");
    navigate("/player/login");
  };

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.clubId === clubId);
    return club?.name || clubId;
  };

  const getClubColor = (clubId: string) => {
    const club = clubs.find(c => c.clubId === clubId);
    return club?.primaryColor || "hsl(354 70% 45%)";
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return {
        icon: <Clock className="h-5 w-5" />,
        text: "قيد المراجعة",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      };
    }
    if (status === "accepted") {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "تم قبولك ✓",
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    }
    return {
      icon: <XCircle className="h-5 w-5" />,
      text: "للأسف تم رفضك",
      color: "text-red-600",
      bgColor: "bg-red-50",
    };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">سيراميكا كليوباترا</h1>
            <p className="text-sm text-muted-foreground">حالة اختبارك</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
            data-testid="button-player-logout"
          >
            <LogOut className="h-4 w-4" />
            تسجيل خروج
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {assessments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">لم تقم بالتسجيل في أي اختبار بعد</p>
              <Button asChild>
                <a href="/">العودة للتسجيل</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => {
              const badge = getStatusBadge(assessment.resultStatus);
              return (
                <Card key={assessment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader
                    className="pb-3"
                    style={{
                      borderTop: `4px solid ${getClubColor(assessment.clubId)}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{getClubName(assessment.clubId)}</h3>
                        <p className="text-sm text-muted-foreground">تاريخ التسجيل: {new Date(assessment.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${badge.color} ${badge.bgColor}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">الاسم</p>
                        <p className="font-medium text-lg">{assessment.fullName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">مركز اللعب</p>
                        <p className="font-medium text-lg">{assessment.position}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">حالة الدفع</p>
                        <p className={`font-medium text-lg ${assessment.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"}`}>
                          {assessment.paymentStatus === "completed" ? "تم الدفع ✓" : "في الانتظار"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">التاريخ</p>
                        <p className="font-medium text-lg">
                          {assessment.assessmentDate
                            ? new Date(assessment.assessmentDate).toLocaleDateString("ar-EG")
                            : "لم يتم تحديده"}
                        </p>
                      </div>
                    </div>

                    {assessment.assessmentLocation && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">مكان الاختبار</p>
                        <p className="font-medium">{assessment.assessmentLocation}</p>
                      </div>
                    )}

                    {assessment.resultStatus && (
                      <div
                        className={`p-4 rounded-lg font-medium text-center text-lg ${
                          assessment.resultStatus === "accepted"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {assessment.resultStatus === "accepted"
                          ? "🎉 تهانينا! تم قبول طلبك في الاختبار"
                          : "شكراً لك على المشاركة، سيتم التواصل معك"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
