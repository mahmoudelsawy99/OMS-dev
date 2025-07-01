"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, FileText, Users, Truck, CreditCard } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { RoleGuard } from "@/components/role-guard"
import { ProtectedRoute } from "@/components/protected-route"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">مرحباً، {user?.name}</h2>
            <p className="text-muted-foreground">
              {getRoleDisplayName(user?.role)} - {getEntityDisplayName(user?.entity)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RoleGuard permissions={["VIEW_ALL_ORDERS", "VIEW_OWN_ORDERS"]}>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">الطلبات</CardTitle>
                <p className="text-3xl font-bold">24</p>
              </CardContent>
            </Card>
          </RoleGuard>

          <RoleGuard permissions={["VIEW_CLIENTS"]}>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">العملاء</CardTitle>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>
          </RoleGuard>

          <RoleGuard permissions={["VIEW_INVOICES"]}>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <CreditCard className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">الفواتير</CardTitle>
                <p className="text-3xl font-bold">8</p>
              </CardContent>
            </Card>
          </RoleGuard>

          <RoleGuard permissions={["DRIVE_VEHICLES"]}>
            <Card className="bg-card text-card-foreground">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Truck className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">المركبات</CardTitle>
                <p className="text-3xl font-bold">5</p>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RoleGuard permissions={["VIEW_REPORTS"]}>
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>إحصائيات الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                  <BarChart2 className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </RoleGuard>

          <RoleGuard permissions={["VIEW_ALL_ORDERS", "VIEW_OWN_ORDERS"]}>
            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>آخر الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">طلب #{1000 + i}</p>
                        <p className="text-sm text-muted-foreground">تخليص جمركي</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">قيد التنفيذ</Badge>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      عرض جميع الطلبات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// دوال مساعدة لعرض أسماء الأدوار والكيانات بشكل مناسب
function getRoleDisplayName(role) {
  const roleNames = {
    GENERAL_MANAGER: "المدير العام",
    CLEARANCE_MANAGER: "مدير التخليص",
    OPERATIONS_MANAGER: "مدير العمليات",
    TRANSLATOR: "مترجم",
    CUSTOMS_BROKER: "مخلص جمركي",
    DRIVER: "سائق",
    ACCOUNTANT: "محاسب",
    DATA_ENTRY: "مدخل بيانات",
    CLIENT_MANAGER: "مدير (عميل)",
    CLIENT_SUPERVISOR: "مشرف (عميل)",
    CLIENT_DATA_ENTRY: "مدخل بيانات (عميل)",
    SUPPLIER_MANAGER: "مدير (مورد)",
    SUPPLIER_SUPERVISOR: "مشرف (مورد)",
    SUPPLIER_DATA_ENTRY: "مدخل بيانات (مورد)",
  }
  return roleNames[role] || role
}

function getEntityDisplayName(entity) {
  const entityNames = {
    PRO: "شركتنا",
    CLIENT: "عميل",
    SUPPLIER: "مورد",
  }
  return entityNames[entity] || entity
}
