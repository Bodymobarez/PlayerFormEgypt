import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Redirect } from "wouter";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: number;
  fullName: string;
  birthDate: string;
  position: string;
  phone: string;
  nationalId: string;
}

export default function Dashboard() {
  const { club, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players, isLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await fetch("/api/players");
      if (!response.ok) throw new Error("Failed to fetch players");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/players/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete player");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف اللاعب من السجل",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف اللاعب",
        variant: "destructive",
      });
    },
  });

  if (authLoading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (!club) return <Redirect to="/login" />;

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
              <p className="text-sm text-muted-foreground">لوحة إدارة اللاعبين</p>
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
                <div className="text-4xl font-bold text-primary">{players?.length || 0}</div>
                <p className="text-muted-foreground mt-1">إجمالي اللاعبين المسجلين</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Players Table */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-2xl">اللاعبون المسجلون</CardTitle>
            <Button className="gap-2" data-testid="button-add-player">
              <Plus className="h-4 w-4" />
              إضافة لاعب
            </Button>
          </CardHeader>
          <CardContent>
            {!players || players.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">لا توجد بيانات لاعبين حتى الآن</p>
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
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id} data-testid={`row-player-${player.id}`}>
                        <TableCell className="font-medium">{player.fullName}</TableCell>
                        <TableCell>{player.nationalId}</TableCell>
                        <TableCell>{player.birthDate}</TableCell>
                        <TableCell>{player.position}</TableCell>
                        <TableCell dir="ltr">{player.phone}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(player.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${player.id}`}
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
