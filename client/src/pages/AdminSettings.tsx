import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Redirect, Link } from "wouter";
import { LogOut, Save, Edit2, X, ArrowRight, Building2, Palette, DollarSign, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClubSettings {
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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ClubSettings>>({});

  const { data: clubSettings, isLoading: settingsLoading } = useQuery<ClubSettings | null>({
    queryKey: ["club", "settings", club?.clubId],
    queryFn: async () => {
      if (!club?.clubId) return null;
      const response = await fetch(`/api/clubs/${club.clubId}`, {
        credentials: "include",
      });
      if (!response.ok) return null;
      const json = await response.json();
      return json.data || null;
    },
    enabled: !!club?.clubId,
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<ClubSettings>) => {
      const response = await fetch(`/api/admin/clubs/${club?.clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setIsEditing(false);
      setEditForm({});
      toast({
        title: "تم التحديث بنجاح",
        description: "تم حفظ إعدادات النادي",
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

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!club) return <Redirect to="/login" />;

  const startEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: clubSettings?.name || club.name,
      assessmentPrice: clubSettings?.assessmentPrice || 5000,
      primaryColor: clubSettings?.primaryColor || club.primaryColor,
      logoUrl: clubSettings?.logoUrl || club.logoUrl,
    });
  };

  const handleSave = () => {
    updateMutation.mutate(editForm);
  };

  const displayData = clubSettings || {
    name: club.name,
    logoUrl: club.logoUrl,
    primaryColor: club.primaryColor,
    assessmentPrice: 5000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للوحة التحكم
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">إعدادات النادي</h1>
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Club Info Card */}
        <Card className="shadow-lg mb-6 overflow-hidden">
          <div 
            className="h-32 flex items-center justify-center"
            style={{ backgroundColor: displayData.primaryColor }}
          >
            <img 
              src={displayData.logoUrl} 
              alt={displayData.name} 
              className="h-20 w-20 object-contain bg-white rounded-full p-2 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23e0e0e0' width='80' height='80' rx='40'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24' fill='%23999'%3E🏟%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{isEditing ? editForm.name : displayData.name}</CardTitle>
            <p className="text-muted-foreground">@{club.clubId}</p>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex justify-center">
              {!isEditing ? (
                <Button onClick={startEdit} className="gap-2" data-testid="button-edit-settings">
                  <Edit2 className="h-4 w-4" />
                  تعديل الإعدادات
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    disabled={updateMutation.isPending}
                    className="gap-2"
                    data-testid="button-save-settings"
                  >
                    <Save className="h-4 w-4" />
                    {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({});
                    }}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-4 w-4" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings Cards */}
        <div className="grid gap-4">
          {/* Club Name */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">اسم النادي</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-2"
                      data-testid="input-club-name"
                    />
                  ) : (
                    <p className="text-lg font-semibold mt-1">{displayData.name}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Price */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">قيمة الاشتراك في الاختبار</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="number"
                        value={editForm.assessmentPrice || 0}
                        onChange={(e) => setEditForm({ ...editForm, assessmentPrice: Number(e.target.value) })}
                        className="w-32"
                        data-testid="input-assessment-price"
                      />
                      <span className="text-muted-foreground">جنيه مصري</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {displayData.assessmentPrice?.toLocaleString()} ج.م
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Color */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">اللون الأساسي للنادي</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        value={editForm.primaryColor || ""}
                        onChange={(e) => setEditForm({ ...editForm, primaryColor: e.target.value })}
                        placeholder="مثال: hsl(354 70% 45%)"
                        className="flex-1"
                        data-testid="input-primary-color"
                      />
                      <div
                        className="w-12 h-10 rounded-lg border-2 border-border shadow-inner"
                        style={{ backgroundColor: editForm.primaryColor }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-border shadow-inner"
                        style={{ backgroundColor: displayData.primaryColor }}
                      />
                      <code className="text-sm bg-muted px-2 py-1 rounded">{displayData.primaryColor}</code>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo URL */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Image className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">رابط شعار النادي</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.logoUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                      placeholder="/logos/club.png"
                      className="mt-2"
                      data-testid="input-logo-url"
                    />
                  ) : (
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-2 break-all">
                      {displayData.logoUrl}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
