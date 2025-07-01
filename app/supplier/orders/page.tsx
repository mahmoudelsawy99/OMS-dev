"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"
import { toast } from "@/hooks/use-toast"

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "SO001",
      clientName: "شركة الفا للتجارة",
      type: "توريد بضائع",
      status: "pending",
      date: "٢٥/٠٣/١٤٤٥",
      amount: 15000,
    },
    {
      id: "SO002",
      clientName: "مؤسسة النور",
      type: "توريد معدات",
      status: "approved",
      date: "٢٤/٠٣/١٤٤٥",
      amount: 8500,
    },
    {
      id: "SO003",
      clientName: "شركة الفا للتجارة",
      type: "توريد بضائع",
      status: "rejected",
      date: "٢٣/٠٣/١٤٤٥",
      amount: 12000,
    },
    {
      id: "SO004",
      clientName: "خالد عبدالله",
      type: "توريد قطع غيار",
      status: "approved",
      date: "٢٢/٠٣/١٤٤٥",
      amount: 5000,
    },
    {
      id: "SO005",
      clientName: "شركة بيتا للخدمات",
      type: "توريد معدات",
      status: "pending",
      date: "٢١/٠٣/١٤٤٥",
      amount: 18000,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || order.status === filterStatus),
  )

  const handleApproveOrder = (orderId) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order))
    setOrders(updatedOrders)
    toast({
      title: "تمت الموافقة على الطلب",
      description: `تم تحديث حالة الطلب ${orderId} إلى موافق عليه`,
    })
  }

  const handleRejectOrder = (orderId) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: "rejected" } : order))
    setOrders(updatedOrders)
    toast({
      title: "تم رفض الطلب",
      description: `تم تحديث حالة الطلب ${orderId} إلى مرفوض`,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">تمت الموافقة</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">قيد الانتظار</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <RoleGuard entities={["SUPPLIER"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">إدارة الطلبات</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{orders.length}</div>
                <CardTitle className="text-lg">إجمالي الطلبات</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{orders.filter((o) => o.status === "pending").length}</div>
                <CardTitle className="text-lg">بانتظار الموافقة</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{orders.filter((o) => o.status === "approved").length}</div>
                <CardTitle className="text-lg">تمت الموافقة</CardTitle>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>قائمة الطلبات</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث برقم الطلب أو اسم العميل"
                      className="pr-10 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="جميع الحالات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الحالات</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="approved">تمت الموافقة</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">اسم العميل</TableHead>
                      <TableHead className="text-right">نوع الطلب</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.clientName}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>{order.amount.toLocaleString()} ريال</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <RoleGuard permissions={["APPROVE_ORDER", "REJECT_ORDER"]}>
                                {order.status === "pending" && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => handleApproveOrder(order.id)}>
                                        <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                                        موافقة
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleRejectOrder(order.id)}>
                                        <XCircle className="h-4 w-4 ml-2 text-red-600" />
                                        رفض
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </RoleGuard>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          لا توجد نتائج مطابقة لمعايير البحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
