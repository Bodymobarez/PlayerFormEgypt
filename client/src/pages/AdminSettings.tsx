import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Redirect } from "wouter";
import { LogOut, Save, Edit2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClubAdmin {
  id: number;
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  username: string;
  assessmentPrice: number;
}

export default function AdminSettings() {
  const { club, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ClubAdmin>>({});

  const { data: clubs = [] } = useQuery<ClubAdmin[]>({
    queryKey: ["admin", "clubs"],
    queryFn: async () => {
      const response = await fetch("/api/admin/clubs");
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return json.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { clubId: string; updates: Partial<ClubAdmin> }) => {
      const response = await fetch(`/api/admin/clubs/${data.clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "clubs"] });
      setEditingId(null);
      setEditForm({});
      toast({
        title: "تم التحديث بنجاح",
        description: "تم حفظ تغييرات النادي",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحديث",
        variant: "destructive",
      });
    },
  });

  if (authLoading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!club) return <Redirect to="/login" />;

  const startEdit = (club: ClubAdmin) => {
    setEditingId(club.id);
    setEditForm(club);
  };

  const handleSave = () => {
    const club = clubs.find(c => c.id === editingId);
    if (!club) return;
    
    updateMutation.mutate({
      clubId: club.clubId,
      updates: editForm,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">إدارة النوادي والاشتراكات</h1>
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {clubs.map((clubData) => (
            <Card key={clubData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={clubData.logoUrl} 
                      alt={clubData.name} 
                      className="h-10 w-10 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23e0e0e0' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='12' fill='%23999'%3E--%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{editingId === clubData.id ? editForm.name : clubData.name}</h3>
                      <p className="text-sm text-muted-foreground">@{clubData.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editingId === clubData.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                          data-testid={`button-save-${clubData.id}`}
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
                          data-testid={`button-cancel-${clubData.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(clubData)}
                        data-testid={`button-edit-${clubData.id}`}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        تعديل
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {editingId === clubData.id ? (
                  <>
                    <div className="space-y-2">
                      <Label>اسم النادي</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        data-testid={`input-name-${clubData.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>قيمة الاشتراك (جنيه مصري)</Label>
                      <Input
                        type="number"
                        value={editForm.assessmentPrice || 0}
                        onChange={(e) =>
                          setEditForm({ ...editForm, assessmentPrice: Number(e.target.value) })
                        }
                        data-testid={`input-price-${clubData.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>اللون الأساسي</Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={editForm.primaryColor || ""}
                          onChange={(e) => setEditForm({ ...editForm, primaryColor: e.target.value })}
                          placeholder="مثال: hsl(354 70% 45%)"
                          data-testid={`input-color-${clubData.id}`}
                          className="flex-1"
                        />
                        <div
                          className="w-12 h-10 rounded border border-border"
                          style={{ backgroundColor: editForm.primaryColor }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>رابط الشعار</Label>
                      <Input
                        value={editForm.logoUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                        data-testid={`input-logo-${clubData.id}`}
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">قيمة الاشتراك</p>
                      <p className="text-2xl font-bold text-primary">{clubData.assessmentPrice.toLocaleString()} ج.م</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">اللون الأساسي</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: clubData.primaryColor }}
                        />
                        <code className="text-xs">{clubData.primaryColor}</code>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
