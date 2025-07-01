"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"
import { Badge } from "@/components/ui/badge"

export default function SupplierDashboard() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <RoleGuard entities={["SUPPLIER"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">لوحة تحكم المورد</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">الطلبات</CardTitle>
                <p className="text-3xl font-bold">18</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Clock className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">قيد التنفيذ</CardTitle>
                <p className="text-3xl font-bold">7</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <CheckCircle className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">مكتملة</CardTitle>
                <p className="text-3xl font-bold">10</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <AlertCircle className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl mb-2">بانتظار الرد</CardTitle>
                <p className="text-3xl font-bold">1</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>آخر الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">طلب #{2000 + i}</p>
                      <p className="text-sm text-muted-foreground">توريد بضائع</p>
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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => router.push("/supplier/orders")}
                >
                  <FileText className="h-6 w-6" />
                  <span>عرض الطلبات</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => router.push("/supplier/products")}
                >
                  <Package className="h-6 w-6" />
                  <span>إدارة المنتجات</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => router.push("/supplier/shipments")}
                >
                  <Truck className="h-6 w-6" />
                  <span>تتبع الشحنات</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  )
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h2 className="text-2xl font-bold mb-2">غير مصرح بالوصول</h2>
      <p className="text-muted-foreground mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
    </div>
  )
}
