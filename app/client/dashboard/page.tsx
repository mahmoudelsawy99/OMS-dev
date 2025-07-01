"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, Truck, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ClientDashboard() {
  const router = useRouter()

  // Mock data for client dashboard
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: "12",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    { title: "قيد التنفيذ", value: "5", icon: <Clock className="h-5 w-5" />, color: "bg-amber-100 text-amber-600" },
    { title: "مكتملة", value: "7", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
    {
      title: "بانتظار المراجعة",
      value: "2",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  const recentOrders = [
    { id: "OP00012", service: "شحن", status: "قيد التنفيذ", date: "٢٥/٠٣/١٤٤٥" },
    { id: "OP00011", service: "تخليص", status: "مكتمل", date: "٢٤/٠٣/١٤٤٥" },
    { id: "OP00010", service: "نقل", status: "مكتمل", date: "٢٣/٠٣/١٤٤٥" },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة تحكم العميل</h1>
        <Button onClick={() => router.push("/client/orders/new")}>إنشاء طلب جديد</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card text-card-foreground">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="mb-6 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg">آخر الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {order.service === "شحن" && <Package className="h-5 w-5 text-blue-500" />}
                  {order.service === "تخليص" && <FileText className="h-5 w-5 text-purple-500" />}
                  {order.service === "نقل" && <Truck className="h-5 w-5 text-orange-500" />}
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{order.date}</p>
                  <p
                    className={`text-sm ${
                      order.status === "مكتمل"
                        ? "text-green-600"
                        : order.status === "قيد التنفيذ"
                          ? "text-amber-600"
                          : "text-blue-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => router.push("/client/orders")}>
              عرض جميع الطلبات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2"
              onClick={() => router.push("/client/orders/new")}
            >
              <Package className="h-6 w-6" />
              <span>طلب شحن جديد</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2"
              onClick={() => router.push("/client/orders/new")}
            >
              <FileText className="h-6 w-6" />
              <span>طلب تخليص جديد</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2"
              onClick={() => router.push("/client/orders/new")}
            >
              <Truck className="h-6 w-6" />
              <span>طلب نقل جديد</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
