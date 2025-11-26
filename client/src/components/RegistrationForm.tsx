import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Club } from "./Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Shield, Activity, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  fullName: z.string().min(10, "الاسم يجب أن يكون رباعياً على الأقل"),
  birthDate: z.string().refine((val) => val !== "", "تاريخ الميلاد مطلوب"),
  birthPlace: z.string().min(2, "محل الميلاد مطلوب"),
  nationalId: z.string().length(14, "الرقم القومي يجب أن يكون ١٤ رقماً").regex(/^\d+$/, "أرقام فقط"),
  address: z.string().min(5, "العنوان بالتفصيل مطلوب"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "رقم هاتف غير صحيح"),
  guardianPhone: z.string().regex(/^01[0125][0-9]{8}$/, "رقم هاتف غير صحيح"),
  guardianName: z.string().min(3, "اسم ولي الأمر مطلوب"),
  school: z.string().optional(),
  position: z.string().min(1, "مركز اللعب مطلوب"),
  height: z.string().optional(),
  weight: z.string().optional(),
  previousClub: z.string().optional(),
  medicalHistory: z.string().optional(),
});

interface RegistrationFormProps {
  selectedClub: Club | null;
}

export function RegistrationForm({ selectedClub }: RegistrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      birthPlace: "",
      nationalId: "",
      address: "",
      phone: "",
      guardianPhone: "",
      guardianName: "",
      school: "",
      position: "",
      height: "",
      weight: "",
      previousClub: "",
      medicalHistory: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedClub) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار النادي أولاً من القائمة العلوية",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          clubId: selectedClub.id,
          assessmentPrice: selectedClub.assessmentPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل حفظ البيانات");
      }

      const response_data = await response.json();
      const assessment_data = response_data.data; // Unwrap the response formatter

      toast({
        title: "تم التسجيل بنجاح",
        description: "اختر طريقة الدفع التي تفضلها",
        className: "bg-green-600 text-white border-none",
      });

      // Redirect to payment methods
      if (assessment_data && assessment_data.redirectUrl) {
        window.location.href = assessment_data.redirectUrl;
      } else if (assessment_data && assessment_data.assessment) {
        // Fallback: manually redirect if redirectUrl not present
        window.location.href = `/payment-methods?assessment_id=${assessment_data.assessment.id}`;
      }
      
      form.reset();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <Card className="shadow-xl border-t-4" style={{ borderTopColor: selectedClub?.primaryColor || 'var(--color-primary)' }}>
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-3xl font-bold text-foreground">استمارة اختبار اللاعب</CardTitle>
          <CardDescription className="text-lg">
            {selectedClub ? (
              <>
                تسجيل في اختبارات {selectedClub.name}
                <br />
                <span className="text-primary font-bold text-base">رسم التسجيل: {(selectedClub.assessmentPrice / 100).toFixed(2)} جنيه</span>
              </>
            ) : "يرجى اختيار النادي للبدء في التسجيل"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-right" dir="rtl">
              
              {/* Section 1: Personal Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary pb-2 border-b">
                  <User className="h-5 w-5" />
                  <h3 className="font-bold text-lg">البيانات الشخصية</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>الاسم رباعي</FormLabel>
                        <FormControl>
                          <Input placeholder="اكتب اسم اللاعب كاملاً..." {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الرقم القومي (١٤ رقم)</FormLabel>
                        <FormControl>
                          <Input placeholder="الرقم الموجود في شهادة الميلاد" maxLength={14} {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ الميلاد</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>محل الميلاد</FormLabel>
                        <FormControl>
                          <Input placeholder="المحافظة / المدينة" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدرسة / الجامعة</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم المدرسة أو الكلية" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary pb-2 border-b">
                  <Phone className="h-5 w-5" />
                  <h3 className="font-bold text-lg">بيانات التواصل</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>العنوان بالتفصيل</FormLabel>
                        <FormControl>
                          <Input placeholder="اسم الشارع، رقم المنزل، المنطقة..." {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم هاتف اللاعب</FormLabel>
                        <FormControl>
                          <Input placeholder="01xxxxxxxxx" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم هاتف ولي الأمر</FormLabel>
                        <FormControl>
                          <Input placeholder="01xxxxxxxxx" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم ولي الأمر</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم ثلاثي" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Sports Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary pb-2 border-b">
                  <Activity className="h-5 w-5" />
                  <h3 className="font-bold text-lg">البيانات الرياضية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مركز اللعب</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting} dir="rtl">
                          <FormControl>
                            <SelectTrigger className="bg-muted/30">
                              <SelectValue placeholder="اختر المركز" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gk">حارس مرمى</SelectItem>
                            <SelectItem value="cb">مدافع</SelectItem>
                            <SelectItem value="lb">ظهير أيسر</SelectItem>
                            <SelectItem value="rb">ظهير أيمن</SelectItem>
                            <SelectItem value="cm">وسط ملعب</SelectItem>
                            <SelectItem value="st">مهاجم</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الطول (سم)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="175" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوزن (كجم)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70" {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousClub"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>النادي السابق</FormLabel>
                        <FormControl>
                          <Input placeholder="اكتب اسم النادي السابق..." {...field} disabled={isSubmitting} className="bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                بعد إتمام هذه الاستمارة، ستنتقل إلى صفحة الدفع لإتمام التسجيل في الاختبارات
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform"
                disabled={isSubmitting}
                style={{ backgroundColor: selectedClub?.primaryColor || 'var(--color-primary)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin ml-2" />
                    جاري المتابعة...
                  </>
                ) : (
                  `متابعة إلى الدفع - ${selectedClub ? (selectedClub.assessmentPrice / 100).toFixed(2) : '0'} جنيه`
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
