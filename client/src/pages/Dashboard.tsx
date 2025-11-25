import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Redirect } from "wouter";
import { LogOut, Trash2, CheckCircle, Clock } from "lucide-react";
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
}

export default function Dashboard() {
  const { club, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ["assessments"],
    queryFn: async () => {
      const response = await fetch("/api/assessments");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      return response.json();
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الرقم القومي</TableHead>
                      <TableHead className="text-right">تاريخ الميلاد</TableHead>
                      <TableHead className="text-right">المركز</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">الدفع</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id} data-testid={`row-assessment-${assessment.id}`}>
                        <TableCell className="font-medium">{assessment.fullName}</TableCell>
                        <TableCell>{assessment.nationalId}</TableCell>
                        <TableCell>{assessment.birthDate}</TableCell>
                        <TableCell>{assessment.position}</TableCell>
                        <TableCell dir="ltr">{assessment.phone}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {assessment.paymentStatus === "completed" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">مدفوع</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600">في الانتظار</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(assessment.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${assessment.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
