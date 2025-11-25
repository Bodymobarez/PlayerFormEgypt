import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Redirect } from "wouter";
import { LogOut, Trash2, CheckCircle, Clock, Settings, Edit2, X, Save } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: number;
  fullName: string;
  birthDate: string;
  position: string;
  phone: string;
  nationalId: string;
  paymentStatus: "pending" | "completed" | "failed";
  assessmentPrice: number;
  createdAt: string;
  assessmentDate?: string;
  assessmentLocation?: string;
  resultStatus?: string;
}

export default function Dashboard() {
  const { club, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    assessmentDate?: string;
    assessmentLocation?: string;
    resultStatus?: string;
  }>({});

  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ["assessments"],
    queryFn: async () => {
      const response = await fetch("/api/assessments");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await fetch(`/api/assessments/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      setEditingId(null);
      setEditForm({});
      toast({ title: "تم التحديث بنجاح" });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحديث",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السجل من قائمة الاختبارات",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف السجل",
        variant: "destructive",
      });
    },
  });

  if (authLoading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!club) return <Redirect to="/login" />;

  const completedPayments = assessments?.filter((a) => a.paymentStatus === "completed").length || 0;
  const totalRevenue = assessments?.reduce((sum, a) => sum + (a.paymentStatus === "completed" ? a.assessmentPrice : 0), 0) || 0;

  return (
    <div
      className="min-h-screen bg-background pb-20"
      style={{
        backgroundImage: `linear-gradient(135deg, ${club.primaryColor}15 0%, transparent 100%)`,
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={club.logoUrl} alt={club.name} className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{club.name}</h1>
              <p className="text-sm text-muted-foreground">لوحة إدارة الاختبارات</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="gap-2"
                data-testid="button-admin-settings"
              >
                <Settings className="h-4 w-4" />
                الإعدادات
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => logout()}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
        <div className="h-1" style={{ backgroundColor: club.primaryColor }} />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{assessments?.length || 0}</div>
                <p className="text-muted-foreground mt-1">إجمالي التسجيلات</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{completedPayments}</div>
                <p className="text-muted-foreground mt-1">الدفعات المكتملة</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{(totalRevenue / 100).toFixed(2)} ج.م</div>
                <p className="text-muted-foreground mt-1">إجمالي الإيرادات</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessments Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">قائمة التسجيلات</CardTitle>
          </CardHeader>
          <CardContent>
            {!assessments || assessments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">لا توجد تسجيلات في الاختبارات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors">
                    {editingId === assessment.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>تاريخ الاختبار</Label>
                            <Input
                              type="date"
                              value={editForm.assessmentDate || ""}
                              onChange={(e) => setEditForm({ ...editForm, assessmentDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>مكان الاختبار (الملعب)</Label>
                            <Input
                              placeholder="مثال: ملعب النادي الأهلي"
                              value={editForm.assessmentLocation || ""}
                              onChange={(e) => setEditForm({ ...editForm, assessmentLocation: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>النتيجة</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant={editForm.resultStatus === "accepted" ? "default" : "outline"}
                              onClick={() => setEditForm({ ...editForm, resultStatus: "accepted" })}
                              className="flex-1"
                              data-testid={`button-accept-${assessment.id}`}
                            >
                              ✓ قبول
                            </Button>
                            <Button
                              size="sm"
                              variant={editForm.resultStatus === "rejected" ? "default" : "outline"}
                              onClick={() => setEditForm({ ...editForm, resultStatus: "rejected" })}
                              className="flex-1"
                              data-testid={`button-reject-${assessment.id}`}
                            >
                              ✗ رفض
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateMutation.mutate({ id: assessment.id, updates: editForm })}
                            disabled={updateMutation.isPending}
                            className="flex-1"
                            data-testid={`button-save-${assessment.id}`}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{assessment.fullName}</h3>
                            <p className="text-sm text-muted-foreground">الرقم القومي: {assessment.nationalId}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(assessment.id);
                                setEditForm({
                                  assessmentDate: assessment.assessmentDate || "",
                                  assessmentLocation: assessment.assessmentLocation || "",
                                  resultStatus: assessment.resultStatus || "",
                                });
                              }}
                              data-testid={`button-edit-${assessment.id}`}
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              تحديث
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(assessment.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${assessment.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">المركز</p>
                            <p className="font-medium">{assessment.position}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الهاتف</p>
                            <p className="font-medium" dir="ltr">{assessment.phone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الدفع</p>
                            <div className="flex items-center gap-1">
                              {assessment.paymentStatus === "completed" ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-green-600 font-medium">مدفوع</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                  <span className="text-yellow-600 font-medium">في الانتظار</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">التسجيل</p>
                            <p className="font-medium">{new Date(assessment.createdAt).toLocaleDateString("ar-EG")}</p>
                          </div>
                        </div>

                        {assessment.assessmentDate && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">اختبار في</p>
                            <p className="font-medium text-blue-900">
                              {new Date(assessment.assessmentDate).toLocaleDateString("ar-EG")} - {assessment.assessmentLocation}
                            </p>
                          </div>
                        )}

                        {assessment.resultStatus && (
                          <div
                            className={`p-3 rounded-lg font-medium text-center ${
                              assessment.resultStatus === "accepted"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {assessment.resultStatus === "accepted" ? "✓ تم قبول اللاعب" : "✗ تم رفض اللاعب"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
