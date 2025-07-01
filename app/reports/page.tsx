"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, PieChart, LineChart, Download, Filter } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <RoleGuard permissions={["VIEW_REPORTS"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">التقارير والإحصائيات</h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select defaultValue="month">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="الفترة الزمنية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">آخر أسبوع</SelectItem>
                    <SelectItem value="month">آخر شهر</SelectItem>
                    <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                    <SelectItem value="year">آخر سنة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تصدير التقارير
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">إجمالي الطلبات</h3>
                  <p className="text-2xl font-bold">124</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600">↑ 12%</span> مقارنة بالشهر الماضي
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">إجمالي الإيرادات</h3>
                  <p className="text-2xl font-bold">45,200 ريال</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600">↑ 8%</span> مقارنة بالشهر الماضي
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">متوسط وقت التنفيذ</h3>
                  <p className="text-2xl font-bold">3.2 يوم</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-red-600">↓ 0.5 يوم</span> مقارنة بالشهر الماضي
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الطلبات حسب النوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                  <PieChart className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                  <BarChart2 className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تطور عدد الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-50 rounded-md">
                <LineChart className="h-16 w-16 text-muted-foreground" />
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
