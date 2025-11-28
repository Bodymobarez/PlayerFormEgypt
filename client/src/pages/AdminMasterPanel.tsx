import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Redirect, useLocation } from "wouter";
import { 
  LogOut, Edit2, X, Save, Trash2, CheckCircle, Clock, 
  Users, Shield, Building2, Activity, TrendingUp, 
  DollarSign, Search, ChevronDown, ChevronUp, Eye, EyeOff,
  AlertTriangle, User, Phone, Mail, Calendar, MoreVertical,
  FileText, Download, Settings, Crown, RefreshCw, Ban
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClubData {
  id: number;
  clubId: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  username: string;
  assessmentPrice: number;
}

interface PlayerData {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string;
  photoUrl: string | null;
  createdAt: string;
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
  
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [editClubForm, setEditClubForm] = useState<Partial<ClubData>>({});
  const [editPlayerForm, setEditPlayerForm] = useState<Partial<PlayerData>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'club' | 'player' | 'assessment', id: number | string, name: string} | null>(null);

  // Check admin session
  const { data: session, isLoading: sessionLoading } = useQuery<AdminSession>({
    queryKey: ["admin", "session"],
    queryFn: async () => {
      const response = await fetch("/api/admin/session", { credentials: "include" });
      if (!response.ok) return { isAdmin: false };
      const json = await response.json();
      return json.data || { isAdmin: false };
    },
  });

  // Fetch clubs
  const { data: clubs = [], refetch: refetchClubs } = useQuery<ClubData[]>({
    queryKey: ["admin", "master", "clubs"],
    enabled: session?.isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/clubs", { credentials: "include" });
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return Array.isArray(json) ? json : (json.data || []);
    },
  });

  // Fetch players
  const { data: players = [], refetch: refetchPlayers } = useQuery<PlayerData[]>({
    queryKey: ["admin", "master", "players"],
    enabled: session?.isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/players", { credentials: "include" });
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return Array.isArray(json) ? json : (json.data || []);
    },
  });

  // Fetch assessments
  const { data: assessments = [], refetch: refetchAssessments } = useQuery<AssessmentData[]>({
    queryKey: ["admin", "master", "assessments"],
    enabled: session?.isAdmin,
    queryFn: async () => {
      const response = await fetch("/api/admin/assessments", { credentials: "include" });
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return Array.isArray(json) ? json : (json.data || []);
    },
  });

  // Mutations
  const updateClubMutation = useMutation({
    mutationFn: async (data: { clubId: string; updates: Partial<ClubData> }) => {
      const response = await fetch(`/api/admin/clubs/${data.clubId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "clubs"] });
      setEditingClubId(null);
      setEditClubForm({});
      toast({ title: "تم تحديث بيانات النادي بنجاح", className: "bg-green-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<PlayerData> }) => {
      const response = await fetch(`/api/admin/players/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "players"] });
      setEditingPlayerId(null);
      setEditPlayerForm({});
      toast({ title: "تم تحديث بيانات اللاعب بنجاح", className: "bg-green-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    },
  });

  const deleteClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "clubs"] });
      setDeleteConfirm(null);
      toast({ title: "تم حذف النادي بنجاح", className: "bg-red-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/players/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "players"] });
      setDeleteConfirm(null);
      toast({ title: "تم حذف اللاعب بنجاح", className: "bg-red-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/assessments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "master", "assessments"] });
      setDeleteConfirm(null);
      toast({ title: "تم حذف الاختبار بنجاح" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/logout", { 
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل تسجيل الخروج");
    },
    onSuccess: () => {
      navigate("/admin/login");
    },
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session?.isAdmin) return <Redirect to="/admin/login" />;

  // Computed data
  const clubNames: { [key: string]: string } = {};
  clubs.forEach(club => {
    clubNames[club.clubId] = club.name;
  });

  const completedPayments = assessments.filter(a => a.paymentStatus === "completed").length;
  const pendingPayments = assessments.filter(a => a.paymentStatus === "pending").length;
  const totalRevenue = assessments.reduce((sum, a) => 
    sum + (a.paymentStatus === "completed" ? a.assessmentPrice : 0), 0
  );

  // Filter functions
  const filteredClubs = clubs.filter(club => 
    club.name.includes(searchQuery) || 
    club.username.includes(searchQuery) ||
    club.clubId.includes(searchQuery)
  );

  const filteredPlayers = players.filter(player =>
    player.fullName.includes(searchQuery) ||
    player.username.includes(searchQuery) ||
    player.phone.includes(searchQuery)
  );

  const filteredAssessments = assessments.filter(assessment =>
    assessment.fullName.includes(searchQuery) ||
    assessment.phone.includes(searchQuery) ||
    clubNames[assessment.clubId]?.includes(searchQuery)
  );

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    
    if (deleteConfirm.type === 'club') {
      deleteClubMutation.mutate(deleteConfirm.id as string);
    } else if (deleteConfirm.type === 'player') {
      deletePlayerMutation.mutate(deleteConfirm.id as number);
    } else if (deleteConfirm.type === 'assessment') {
      deleteAssessmentMutation.mutate(deleteConfirm.id as number);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Soccer Hunters</h1>
                  <p className="text-xs text-amber-500">لوحة تحكم المشرف</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  refetchClubs();
                  refetchPlayers();
                  refetchAssessments();
                  toast({ title: "تم تحديث البيانات" });
                }}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
                data-testid="button-refresh-data"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                <Crown className="w-3 h-3 ml-1" />
                مشرف رئيسي
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                data-testid="button-master-logout"
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-900/30 border-blue-800/50 hover:border-blue-600/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 mb-1">الأندية</p>
                  <p className="text-3xl font-bold text-white">{clubs.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-900/30 border-emerald-800/50 hover:border-emerald-600/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-300 mb-1">اللاعبين</p>
                  <p className="text-3xl font-bold text-white">{players.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-900/30 border-purple-800/50 hover:border-purple-600/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300 mb-1">الاختبارات</p>
                  <p className="text-3xl font-bold text-white">{assessments.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/50 to-amber-900/30 border-amber-800/50 hover:border-amber-600/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-300 mb-1">الإيرادات</p>
                  <p className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-amber-400">جنيه مصري</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="بحث في الأندية واللاعبين والاختبارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 focus:border-amber-500"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800 p-1 gap-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              data-testid="tab-overview"
            >
              <Activity className="w-4 h-4 ml-2" />
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger 
              value="clubs" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              data-testid="tab-clubs"
            >
              <Building2 className="w-4 h-4 ml-2" />
              الأندية ({clubs.length})
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              data-testid="tab-players"
            >
              <Users className="w-4 h-4 ml-2" />
              اللاعبين ({players.length})
            </TabsTrigger>
            <TabsTrigger 
              value="assessments" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              data-testid="tab-assessments"
            >
              <FileText className="w-4 h-4 ml-2" />
              الاختبارات ({assessments.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Status Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    حالة المدفوعات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-400">مدفوعات مكتملة</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 text-lg px-4">{completedPayments}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-400">في الانتظار</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-lg px-4">{pendingPayments}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    آخر الاختبارات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {assessments.slice(0, 5).map((assessment) => (
                        <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{assessment.fullName}</p>
                              <p className="text-xs text-gray-500">{clubNames[assessment.clubId] || assessment.clubId}</p>
                            </div>
                          </div>
                          {assessment.paymentStatus === "completed" ? (
                            <Badge className="bg-green-500/20 text-green-400">مدفوع</Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400">قيد الانتظار</Badge>
                          )}
                        </div>
                      ))}
                      {assessments.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          لا توجد اختبارات حتى الآن
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Top Clubs */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  الأندية المسجلة
                </CardTitle>
                <CardDescription className="text-gray-400">
                  قائمة بجميع الأندية المسجلة في المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {clubs.slice(0, 12).map((club) => (
                    <div key={club.id} className="flex flex-col items-center p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-12 h-12 object-contain mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23374151' width='48' height='48' rx='8'/%3E%3C/svg%3E";
                        }}
                      />
                      <p className="text-sm font-medium text-white text-center truncate w-full">{club.name}</p>
                      <p className="text-xs text-gray-500">{club.assessmentPrice} ج.م</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Tab */}
          <TabsContent value="clubs" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">إدارة الأندية</CardTitle>
                <CardDescription className="text-gray-400">
                  تعديل بيانات الأندية وإعداداتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClubs.map((club) => (
                    <div 
                      key={club.id} 
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="w-14 h-14 object-contain rounded-xl bg-gray-700/50 p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect fill='%23374151' width='56' height='56' rx='12'/%3E%3C/svg%3E";
                          }}
                        />
                        <div>
                          {editingClubId === club.id ? (
                            <Input
                              value={editClubForm.name || ""}
                              onChange={(e) => setEditClubForm({ ...editClubForm, name: e.target.value })}
                              className="bg-gray-700 border-gray-600 text-white mb-2"
                              data-testid={`input-club-name-${club.id}`}
                            />
                          ) : (
                            <h3 className="text-lg font-bold text-white">{club.name}</h3>
                          )}
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>@{club.username}</span>
                            <span className="text-gray-600">•</span>
                            {editingClubId === club.id ? (
                              <Input
                                type="number"
                                value={editClubForm.assessmentPrice || 0}
                                onChange={(e) => setEditClubForm({ ...editClubForm, assessmentPrice: Number(e.target.value) })}
                                className="bg-gray-700 border-gray-600 text-white w-24 h-8"
                                data-testid={`input-club-price-${club.id}`}
                              />
                            ) : (
                              <span className="text-amber-400">{club.assessmentPrice} ج.م</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-gray-600" 
                          style={{ backgroundColor: club.primaryColor }}
                          title="لون النادي"
                        />
                        
                        {editingClubId === club.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateClubMutation.mutate({ clubId: club.clubId, updates: editClubForm })}
                              disabled={updateClubMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                              data-testid={`button-save-club-${club.id}`}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingClubId(null);
                                setEditClubForm({});
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingClubId(club.id);
                                  setEditClubForm(club);
                                }}
                                className="text-gray-300 focus:text-white focus:bg-gray-700"
                              >
                                <Edit2 className="w-4 h-4 ml-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm({ type: 'club', id: club.clubId, name: club.name })}
                                className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredClubs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد أندية مطابقة للبحث</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">إدارة اللاعبين</CardTitle>
                <CardDescription className="text-gray-400">
                  قائمة بجميع اللاعبين المسجلين في المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPlayers.map((player) => (
                    <div 
                      key={player.id} 
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center overflow-hidden">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          {editingPlayerId === player.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editPlayerForm.fullName || ""}
                                onChange={(e) => setEditPlayerForm({ ...editPlayerForm, fullName: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white"
                                placeholder="الاسم الكامل"
                                data-testid={`input-player-name-${player.id}`}
                              />
                              <div className="flex gap-2">
                                <Input
                                  value={editPlayerForm.phone || ""}
                                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, phone: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-white"
                                  placeholder="الهاتف"
                                  data-testid={`input-player-phone-${player.id}`}
                                />
                                <Input
                                  value={editPlayerForm.email || ""}
                                  onChange={(e) => setEditPlayerForm({ ...editPlayerForm, email: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-white"
                                  placeholder="البريد الإلكتروني"
                                  data-testid={`input-player-email-${player.id}`}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-bold text-white">{player.fullName}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  @{player.username}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {player.phone}
                                </span>
                                {player.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {player.email}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          <Calendar className="w-3 h-3 inline ml-1" />
                          {new Date(player.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                        
                        {editingPlayerId === player.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePlayerMutation.mutate({ id: player.id, updates: editPlayerForm })}
                              disabled={updatePlayerMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                              data-testid={`button-save-player-${player.id}`}
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingPlayerId(null);
                                setEditPlayerForm({});
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingPlayerId(player.id);
                                  setEditPlayerForm(player);
                                }}
                                className="text-gray-300 focus:text-white focus:bg-gray-700"
                              >
                                <Edit2 className="w-4 h-4 ml-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                onClick={() => setDeleteConfirm({ type: 'player', id: player.id, name: player.fullName })}
                                className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredPlayers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا يوجد لاعبين مسجلين حتى الآن</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">قائمة الاختبارات</CardTitle>
                <CardDescription className="text-gray-400">
                  جميع اختبارات التقييم المسجلة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">اللاعب</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">الهاتف</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">النادي</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">السعر</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">الحالة</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">التاريخ</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessments.map((assessment) => (
                        <tr key={assessment.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-medium text-white">{assessment.fullName}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-400">{assessment.phone}</td>
                          <td className="py-4 px-4 text-gray-400">{clubNames[assessment.clubId] || assessment.clubId}</td>
                          <td className="py-4 px-4">
                            <span className="text-amber-400 font-medium">{assessment.assessmentPrice} ج.م</span>
                          </td>
                          <td className="py-4 px-4">
                            {assessment.paymentStatus === "completed" ? (
                              <Badge className="bg-green-500/20 text-green-400">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                مدفوع
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400">
                                <Clock className="w-3 h-3 ml-1" />
                                قيد الانتظار
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-500 text-sm">
                            {new Date(assessment.createdAt).toLocaleDateString("ar-EG")}
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteConfirm({ type: 'assessment', id: assessment.id, name: assessment.fullName })}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-delete-assessment-${assessment.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredAssessments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد اختبارات مسجلة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              هل أنت متأكد من حذف {deleteConfirm?.type === 'club' ? 'النادي' : deleteConfirm?.type === 'player' ? 'اللاعب' : 'الاختبار'} "{deleteConfirm?.name}"؟
              <br />
              <span className="text-red-400">هذا الإجراء لا يمكن التراجع عنه.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
