import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Redirect } from "wouter";
import { 
  LogOut, Trash2, CheckCircle, Clock, Settings, Edit2, X, Save,
  Search, Users, DollarSign, TrendingUp, MapPin, Phone, Calendar,
  FileText, Download, RefreshCw, Filter, MoreVertical, User, CreditCard,
  AlertTriangle, ChevronDown, Eye
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Assessment {
  id: number;
  fullName: string;
  birthDate: string;
  birthPlace: string;
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
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "completed" | "pending">("all");
  const [resultFilter, setResultFilter] = useState<"all" | "accepted" | "rejected" | "none">("all");
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("registrations");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [editForm, setEditForm] = useState<{
    assessmentDate?: string;
    assessmentLocation?: string;
    resultStatus?: string;
  }>({});
  const [expandedGovernorates, setExpandedGovernorates] = useState<Set<string>>(new Set());

  const { data: assessments, isLoading, refetch } = useQuery<Assessment[]>({
    queryKey: ["assessments"],
    queryFn: async () => {
      const response = await fetch("/api/assessments", { credentials: "include" });
      if (!response.ok) throw new Error("فشل جلب البيانات");
      const json = await response.json();
      return Array.isArray(json) ? json : (json.data || []);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const response = await fetch(`/api/assessments/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data.updates),
      });
      if (!response.ok) throw new Error("فشل التحديث");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      setEditingId(null);
      setEditForm({});
      toast({ title: "تم التحديث بنجاح", className: "bg-emerald-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء التحديث", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/assessments/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      setDeleteConfirm(null);
      toast({ title: "تم الحذف بنجاح", className: "bg-red-600 text-white" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "حدث خطأ أثناء حذف السجل", variant: "destructive" });
    },
  });

  // Filter and compute data
  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    return assessments.filter(a => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        a.fullName.includes(searchQuery) ||
        a.phone.includes(searchQuery) ||
        a.nationalId.includes(searchQuery) ||
        a.birthPlace.includes(searchQuery);
      
      // Payment filter
      const matchesPayment = paymentFilter === "all" || a.paymentStatus === paymentFilter;
      
      // Result filter
      const matchesResult = resultFilter === "all" || 
        (resultFilter === "none" && !a.resultStatus) ||
        a.resultStatus === resultFilter;
      
      // Governorate filter
      const matchesGovernorate = governorateFilter === "all" || a.birthPlace === governorateFilter;
      
      return matchesSearch && matchesPayment && matchesResult && matchesGovernorate;
    });
  }, [assessments, searchQuery, paymentFilter, resultFilter, governorateFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!assessments) return { total: 0, completed: 0, pending: 0, revenue: 0, accepted: 0, rejected: 0 };
    
    return {
      total: assessments.length,
      completed: assessments.filter(a => a.paymentStatus === "completed").length,
      pending: assessments.filter(a => a.paymentStatus === "pending").length,
      revenue: assessments.reduce((sum, a) => sum + (a.paymentStatus === "completed" ? a.assessmentPrice : 0), 0),
      accepted: assessments.filter(a => a.resultStatus === "accepted").length,
      rejected: assessments.filter(a => a.resultStatus === "rejected").length,
    };
  }, [assessments]);

  // Get unique governorates
  const governorates = useMemo(() => {
    if (!assessments) return [];
    const unique = Array.from(new Set(assessments.map(a => a.birthPlace)));
    return unique.sort();
  }, [assessments]);

  // Group by governorate
  const groupedByGovernorate = useMemo(() => {
    return filteredAssessments.reduce((groups, assessment) => {
      const gov = assessment.birthPlace || "غير محدد";
      if (!groups[gov]) groups[gov] = [];
      groups[gov].push(assessment);
      return groups;
    }, {} as Record<string, Assessment[]>);
  }, [filteredAssessments]);

  const sortedGovernorates = Object.keys(groupedByGovernorate).sort();

  const toggleGovernorate = (gov: string) => {
    const newSet = new Set(expandedGovernorates);
    if (newSet.has(gov)) {
      newSet.delete(gov);
    } else {
      newSet.add(gov);
    }
    setExpandedGovernorates(newSet);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!club) return <Redirect to="/login" />;

  // Dynamic primary color from club
  const primaryColor = club.primaryColor || "hsl(160 84% 39%)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30" dir="rtl">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <img 
                  src={club.logoUrl} 
                  alt={club.name} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{club.name}</h1>
                <p className="text-xs text-slate-500">لوحة إدارة الاختبارات</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  refetch();
                  toast({ title: "تم تحديث البيانات" });
                }}
                className="text-slate-600 hover:text-slate-900"
                data-testid="button-refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Link href="/admin/settings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                  data-testid="button-admin-settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}80)` }} />
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">إجمالي التسجيلات</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 mb-1">الدفعات المكتملة</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 mb-1">في الانتظار</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1">الإيرادات</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-purple-500">جنيه مصري</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="بحث بالاسم، الهاتف، الرقم القومي، المحافظة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 border-slate-200"
                  data-testid="input-search"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v as any)}>
                  <SelectTrigger className="w-[140px] border-slate-200" data-testid="select-payment-filter">
                    <CreditCard className="w-4 h-4 ml-2 text-slate-400" />
                    <SelectValue placeholder="حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    <SelectItem value="completed">مدفوع</SelectItem>
                    <SelectItem value="pending">في الانتظار</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={resultFilter} onValueChange={(v) => setResultFilter(v as any)}>
                  <SelectTrigger className="w-[140px] border-slate-200" data-testid="select-result-filter">
                    <Filter className="w-4 h-4 ml-2 text-slate-400" />
                    <SelectValue placeholder="نتيجة الاختبار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل النتائج</SelectItem>
                    <SelectItem value="accepted">مقبول</SelectItem>
                    <SelectItem value="rejected">مرفوض</SelectItem>
                    <SelectItem value="none">لم يُحدد بعد</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={governorateFilter} onValueChange={setGovernorateFilter}>
                  <SelectTrigger className="w-[160px] border-slate-200" data-testid="select-governorate-filter">
                    <MapPin className="w-4 h-4 ml-2 text-slate-400" />
                    <SelectValue placeholder="المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المحافظات</SelectItem>
                    {governorates.map((gov) => (
                      <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Active filters */}
            {(searchQuery || paymentFilter !== "all" || resultFilter !== "all" || governorateFilter !== "all") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500">الفلاتر النشطة:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    بحث: {searchQuery}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {paymentFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    الدفع: {paymentFilter === "completed" ? "مدفوع" : "في الانتظار"}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPaymentFilter("all")} />
                  </Badge>
                )}
                {resultFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    النتيجة: {resultFilter === "accepted" ? "مقبول" : resultFilter === "rejected" ? "مرفوض" : "لم يُحدد"}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setResultFilter("all")} />
                  </Badge>
                )}
                {governorateFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {governorateFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setGovernorateFilter("all")} />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setPaymentFilter("all");
                    setResultFilter("all");
                    setGovernorateFilter("all");
                  }}
                  className="text-red-500 hover:text-red-600 text-xs"
                >
                  مسح الكل
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 p-1 mb-6 gap-1">
            <TabsTrigger 
              value="registrations" 
              className="data-[state=active]:text-white"
              style={{
                ...({} as any),
                ...(activeTab === "registrations" ? {
                  backgroundColor: primaryColor
                } : {})
              }}
              data-testid="tab-registrations"
            >
              <Users className="w-4 h-4 ml-2" />
              التسجيلات ({filteredAssessments.length})
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              data-testid="tab-statistics"
            >
              <TrendingUp className="w-4 h-4 ml-2" />
              الإحصائيات
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-slate-900">قائمة التسجيلات</CardTitle>
                    <CardDescription>
                      {filteredAssessments.length} تسجيل {governorateFilter !== "all" ? `في ${governorateFilter}` : "في جميع المحافظات"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredAssessments.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 mb-2">لا توجد تسجيلات مطابقة</p>
                    <p className="text-sm text-slate-400">جرب تغيير معايير البحث أو الفلاتر</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {sortedGovernorates.map((governorate) => (
                      <Collapsible 
                        key={governorate} 
                        open={expandedGovernorates.has(governorate) || expandedGovernorates.size === 0}
                        onOpenChange={() => toggleGovernorate(governorate)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-slate-600" />
                              </div>
                              <div className="text-right">
                                <h3 className="font-bold text-slate-900">{governorate}</h3>
                                <p className="text-sm text-slate-500">{groupedByGovernorate[governorate].length} لاعب</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="secondary" 
                                className="bg-emerald-100 text-emerald-700"
                              >
                                {groupedByGovernorate[governorate].filter(a => a.paymentStatus === "completed").length} مدفوع
                              </Badge>
                              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedGovernorates.has(governorate) ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="px-4 pb-4 space-y-3">
                            {groupedByGovernorate[governorate].map((assessment) => (
                              <div 
                                key={assessment.id} 
                                className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-all"
                              >
                                {editingId === assessment.id ? (
                                  // Edit Mode
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                                      <User className="w-5 h-5 text-slate-400" />
                                      <span className="font-bold text-slate-900">{assessment.fullName}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-slate-600">تاريخ الاختبار</Label>
                                        <Input
                                          type="date"
                                          value={editForm.assessmentDate || ""}
                                          onChange={(e) => setEditForm({ ...editForm, assessmentDate: e.target.value })}
                                          className="mt-1 border-slate-200"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-slate-600">مكان الاختبار</Label>
                                        <Input
                                          placeholder="ملعب النادي"
                                          value={editForm.assessmentLocation || ""}
                                          onChange={(e) => setEditForm({ ...editForm, assessmentLocation: e.target.value })}
                                          className="mt-1 border-slate-200"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-slate-600">نتيجة الاختبار</Label>
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          size="sm"
                                          variant={editForm.resultStatus === "accepted" ? "default" : "outline"}
                                          onClick={() => setEditForm({ ...editForm, resultStatus: "accepted" })}
                                          className={`flex-1 ${editForm.resultStatus === "accepted" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                                          data-testid={`button-accept-${assessment.id}`}
                                        >
                                          <CheckCircle className="w-4 h-4 ml-2" />
                                          قبول
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={editForm.resultStatus === "rejected" ? "default" : "outline"}
                                          onClick={() => setEditForm({ ...editForm, resultStatus: "rejected" })}
                                          className={`flex-1 ${editForm.resultStatus === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}`}
                                          data-testid={`button-reject-${assessment.id}`}
                                        >
                                          <X className="w-4 h-4 ml-2" />
                                          رفض
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-2">
                                      <Button
                                        size="sm"
                                        onClick={() => updateMutation.mutate({ id: assessment.id, updates: editForm })}
                                        disabled={updateMutation.isPending}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                        data-testid={`button-save-${assessment.id}`}
                                      >
                                        <Save className="w-4 h-4 ml-2" />
                                        حفظ التغييرات
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
                                        إلغاء
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  // View Mode
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                          <User className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-lg text-slate-900">{assessment.fullName}</h3>
                                          <p className="text-sm text-slate-500">{assessment.nationalId}</p>
                                        </div>
                                      </div>
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setEditingId(assessment.id);
                                              setEditForm({
                                                assessmentDate: assessment.assessmentDate || "",
                                                assessmentLocation: assessment.assessmentLocation || "",
                                                resultStatus: assessment.resultStatus || "",
                                              });
                                            }}
                                          >
                                            <Edit2 className="w-4 h-4 ml-2" />
                                            تعديل البيانات
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() => setDeleteConfirm({ id: assessment.id, name: assessment.fullName })}
                                            className="text-red-600 focus:text-red-600"
                                          >
                                            <Trash2 className="w-4 h-4 ml-2" />
                                            حذف التسجيل
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                                      <div className="bg-slate-50 rounded-lg p-2">
                                        <p className="text-xs text-slate-500 mb-1">المركز</p>
                                        <p className="font-medium text-slate-900">{assessment.position}</p>
                                      </div>
                                      <div className="bg-slate-50 rounded-lg p-2">
                                        <p className="text-xs text-slate-500 mb-1">الهاتف</p>
                                        <p className="font-medium text-slate-900" dir="ltr">{assessment.phone}</p>
                                      </div>
                                      <div className="bg-slate-50 rounded-lg p-2">
                                        <p className="text-xs text-slate-500 mb-1">حالة الدفع</p>
                                        {assessment.paymentStatus === "completed" ? (
                                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                            <CheckCircle className="w-3 h-3 ml-1" />
                                            مدفوع
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                            <Clock className="w-3 h-3 ml-1" />
                                            في الانتظار
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="bg-slate-50 rounded-lg p-2">
                                        <p className="text-xs text-slate-500 mb-1">التسجيل</p>
                                        <p className="font-medium text-slate-900 text-sm">
                                          {new Date(assessment.createdAt).toLocaleDateString("ar-EG")}
                                        </p>
                                      </div>
                                    </div>

                                    {assessment.assessmentDate && (
                                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <div>
                                          <p className="text-xs text-blue-600">موعد الاختبار</p>
                                          <p className="font-medium text-blue-900">
                                            {new Date(assessment.assessmentDate).toLocaleDateString("ar-EG")} - {assessment.assessmentLocation}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {assessment.resultStatus && (
                                      <div
                                        className={`p-3 rounded-lg font-medium text-center flex items-center justify-center gap-2 ${
                                          assessment.resultStatus === "accepted"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                        }`}
                                      >
                                        {assessment.resultStatus === "accepted" ? (
                                          <>
                                            <CheckCircle className="w-5 h-5" />
                                            تم قبول اللاعب
                                          </>
                                        ) : (
                                          <>
                                            <X className="w-5 h-5" />
                                            تم رفض اللاعب
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    ملخص الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-700">لاعبين مقبولين</span>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-lg px-4">{stats.accepted}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <X className="w-5 h-5 text-red-600" />
                      <span className="text-red-700">لاعبين مرفوضين</span>
                    </div>
                    <Badge className="bg-red-600 text-white text-lg px-4">{stats.rejected}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700">في انتظار التقييم</span>
                    </div>
                    <Badge className="bg-slate-600 text-white text-lg px-4">
                      {stats.total - stats.accepted - stats.rejected}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    التوزيع الجغرافي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-3">
                      {governorates.map((gov) => {
                        const count = assessments?.filter(a => a.birthPlace === gov).length || 0;
                        const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        
                        return (
                          <div key={gov} className="flex items-center gap-3">
                            <div className="w-24 text-sm text-slate-700 truncate">{gov}</div>
                            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-l from-emerald-500 to-emerald-600 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-left text-sm font-medium text-slate-900">{count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف تسجيل "{deleteConfirm?.name}"؟
              <br />
              <span className="text-red-500">هذا الإجراء لا يمكن التراجع عنه.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
