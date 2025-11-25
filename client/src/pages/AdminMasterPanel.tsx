import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Redirect, useLocation } from "wouter";
import { LogOut, Edit2, X, Save, Trash2, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClubData {
  id: number;
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  username: string;
  assessmentPrice: number;
}

interface AssessmentData {
  id: number;
  clubId: string;
  fullName: string;
  phone: string;
  paymentStatus: "pending" | "completed" | "failed";
  assessmentPrice: number;
  createdAt: string;
}

interface AdminSession {
  isAdmin: boolean;
}

export default function AdminMasterPanel() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClubData>>({});
  const [tab, setTab] = useState<"clubs" | "assessments" | "stats">("clubs");

  // Check admin session
  const { data: session } = useQuery<AdminSession>({
    queryKey: ["admin", "session"],
    queryFn: async () => {
      const response = await fetch("/api/admin/session");
      if (!response.ok) return { isAdmin: false };
      const json = await response.json();
      return json.data || { isAdmin: false };
    },
  });

  const { data: clubs = [] } = useQuery<ClubData[]>({
    queryKey: ["admin", "master", "clubs"],
    enabled: session?.isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/clubs");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const { data: assessments = [] } = useQuery<AssessmentData[]>({
    queryKey: ["admin", "master", "assessments"],
    enabled: session?.isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/assessments");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const updateClubMutation = useMutation({
    mutationFn: async (data: { clubId: string; updates: Partial<ClubData> }) => {
      const response = await fetch(`/api/admin/clubs/${data.clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "clubs"] });
      setEditingClubId(null);
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

  const deleteAssessmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/assessments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "assessments"] });
      toast({ title: "تم الحذف بنجاح" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("فشل تسجيل الخروج");
    },
    onSuccess: () => {
      navigate("/admin/login");
    },
  });

  if (!session?.isAdmin) return <Redirect to="/admin/login" />;

  const clubNames: { [key: string]: string } = {};
  clubs.forEach(club => {
    clubNames[club.clubId] = club.name;
  });

  const completedPayments = assessments.filter(a => a.paymentStatus === "completed").length;
  const totalRevenue = assessments.reduce((sum, a) => 
    sum + (a.paymentStatus === "completed" ? a.assessmentPrice : 0), 0
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Soccer Hunters</h1>
            <p className="text-sm text-muted-foreground">لوحة التحكم الرئيسية</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            className="gap-2"
            data-testid="button-master-logout"
          >
            <LogOut className="h-4 w-4" />
            تسجيل خروج
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          <Button
            variant={tab === "clubs" ? "default" : "ghost"}
            onClick={() => setTab("clubs")}
            className="rounded-b-none"
            data-testid="tab-clubs"
          >
            إدارة الأندية
          </Button>
          <Button
            variant={tab === "assessments" ? "default" : "ghost"}
            onClick={() => setTab("assessments")}
            className="rounded-b-none"
            data-testid="tab-assessments"
          >
            قائمة الاختبارات
          </Button>
          <Button
            variant={tab === "stats" ? "default" : "ghost"}
            onClick={() => setTab("stats")}
            className="rounded-b-none"
            data-testid="tab-stats"
          >
            الإحصائيات
          </Button>
        </div>

        {/* Stats Tab */}
        {tab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{clubs.length}</div>
                  <p className="text-muted-foreground mt-1">عدد الأندية</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{assessments.length}</div>
                  <p className="text-muted-foreground mt-1">إجمالي الاختبارات</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{totalRevenue.toLocaleString()}</div>
                  <p className="text-muted-foreground mt-1">الإيرادات (ج.م)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clubs Tab */}
        {tab === "clubs" && (
          <div className="grid gap-4">
            {clubs.map((club) => (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e0e0e0' width='40' height='40'/%3E%3C/svg%3E";
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-bold">{editingClubId === club.id ? editForm.name : club.name}</h3>
                        <p className="text-sm text-muted-foreground">@{club.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingClubId === club.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateClubMutation.mutate({ clubId: club.clubId, updates: editForm })}
                            disabled={updateClubMutation.isPending}
                            data-testid={`button-save-club-${club.id}`}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingClubId(null);
                              setEditForm({});
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingClubId(club.id);
                            setEditForm(club);
                          }}
                          data-testid={`button-edit-club-${club.id}`}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          تعديل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {editingClubId === club.id ? (
                    <>
                      <div className="space-y-2">
                        <Label>اسم النادي</Label>
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>قيمة الاشتراك (جنيه)</Label>
                        <Input
                          type="number"
                          value={editForm.assessmentPrice || 0}
                          onChange={(e) =>
                            setEditForm({ ...editForm, assessmentPrice: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>اللون الأساسي</Label>
                        <div className="flex gap-2">
                          <Input
                            value={editForm.primaryColor || ""}
                            onChange={(e) => setEditForm({ ...editForm, primaryColor: e.target.value })}
                            placeholder="hsl(354 70% 45%)"
                            className="flex-1"
                          />
                          <div
                            className="w-12 h-10 rounded border border-border"
                            style={{ backgroundColor: editForm.primaryColor }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">الاشتراك</p>
                        <p className="text-2xl font-bold text-primary">{club.assessmentPrice} ج.م</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">اللون</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: club.primaryColor }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Assessments Tab */}
        {tab === "assessments" && (
          <Card>
            <CardHeader>
              <CardTitle>قائمة جميع الاختبارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-2">اللاعب</th>
                      <th className="text-right py-2 px-2">الهاتف</th>
                      <th className="text-right py-2 px-2">النادي</th>
                      <th className="text-right py-2 px-2">السعر</th>
                      <th className="text-right py-2 px-2">الحالة</th>
                      <th className="text-right py-2 px-2">التاريخ</th>
                      <th className="text-right py-2 px-2">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-2 font-medium">{assessment.fullName}</td>
                        <td className="py-2 px-2">{assessment.phone}</td>
                        <td className="py-2 px-2">{clubNames[assessment.clubId] || assessment.clubId}</td>
                        <td className="py-2 px-2">{assessment.assessmentPrice} ج.م</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            {assessment.paymentStatus === "completed" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">مدفوع</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-yellow-600">في الانتظار</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-xs">
                          {new Date(assessment.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-2 px-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAssessmentMutation.mutate(assessment.id)}
                            disabled={deleteAssessmentMutation.isPending}
                            data-testid={`button-delete-assessment-${assessment.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
