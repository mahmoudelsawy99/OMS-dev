"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Search, MoreHorizontal, Download, Filter, Eye, FileText } from "lucide-react"
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      clientName: "شركة الفا للتجارة",
      orderNumber: "OP00001",
      amount: 15000,
      status: "paid",
      date: "٢٥/٠٣/١٤٤٥",
    },
    {
      id: "INV-2024-002",
      clientName: "أحمد محمد",
      orderNumber: "OP00002",
      amount: 8500,
      status: "pending",
      date: "٢٦/٠٣/١٤٤٥",
    },
    {
      id: "INV-2024-003",
      clientName: "مؤسسة النور",
      orderNumber: "OP00003",
      amount: 12000,
      status: "overdue",
      date: "٢٧/٠٣/١٤٤٥",
    },
    {
      id: "INV-2024-004",
      clientName: "خالد عبدالله",
      orderNumber: "OP00004",
      amount: 5000,
      status: "paid",
      date: "٢٨/٠٣/١٤٤٥",
    },
    {
      id: "INV-2024-005",
      clientName: "شركة بيتا للخدمات",
      orderNumber: "OP00005",
      amount: 18000,
      status: "pending",
      date: "٢٩/٠٣/١٤٤٥",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    orderNumber: "",
    amount: "",
    status: "pending",
  })

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || invoice.status === filterStatus),
  )

  const handleAddInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.orderNumber || !newInvoice.amount) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const invoiceId = `INV-2024-${(invoices.length + 1).toString().padStart(3, "0")}`
    const invoiceToAdd = {
      id: invoiceId,
      ...newInvoice,
      amount: Number.parseFloat(newInvoice.amount),
      date: new Date().toLocaleDateString("ar-SA"),
    }

    setInvoices([...invoices, invoiceToAdd])
    setNewInvoice({
      clientName: "",
      orderNumber: "",
      amount: "",
      status: "pending",
    })
    setIsDialogOpen(false)

    toast({
      title: "تمت الإضافة بنجاح",
      description: `تم إضافة الفاتورة ${invoiceId} بنجاح`,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">مدفوعة</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">قيد الانتظار</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">متأخرة</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTotalAmount = () => {
    return invoices.reduce((total, invoice) => total + invoice.amount, 0).toLocaleString()
  }

  const getPaidAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((total, invoice) => total + invoice.amount, 0)
      .toLocaleString()
  }

  const getPendingAmount = () => {
    return invoices
      .filter((invoice) => invoice.status === "pending" || invoice.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount, 0)
      .toLocaleString()
  }

  return (
    <ProtectedRoute>
      <RoleGuard permissions={["VIEW_INVOICES"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة الفواتير</h1>
            <RoleGuard permissions={["CREATE_INVOICE"]}>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة فاتورة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة فاتورة جديدة</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clientName" className="text-right">
                        اسم العميل
                      </Label>
                      <Input
                        id="clientName"
                        value={newInvoice.clientName}
                        onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="orderNumber" className="text-right">
                        رقم الطلب
                      </Label>
                      <Input
                        id="orderNumber"
                        value={newInvoice.orderNumber}
                        onChange={(e) => setNewInvoice({ ...newInvoice, orderNumber: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        المبلغ
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        الحالة
                      </Label>
                      <Select
                        value={newInvoice.status}
                        onValueChange={(value) => setNewInvoice({ ...newInvoice, status: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">مدفوعة</SelectItem>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="overdue">متأخرة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddInvoice}>إضافة</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </RoleGuard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{getTotalAmount()} ريال</div>
                <CardTitle className="text-lg">إجمالي الفواتير</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-green-600">{getPaidAmount()} ريال</div>
                <CardTitle className="text-lg">المبالغ المدفوعة</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-amber-600">{getPendingAmount()} ريال</div>
                <CardTitle className="text-lg">المبالغ المعلقة</CardTitle>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>قائمة الفواتير</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="البحث برقم الفاتورة أو اسم العميل"
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
                        <SelectItem value="paid">مدفوعة</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="overdue">متأخرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الفاتورة</TableHead>
                      <TableHead className="text-right">اسم العميل</TableHead>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.clientName}</TableCell>
                          <TableCell>{invoice.orderNumber}</TableCell>
                          <TableCell>{invoice.amount.toLocaleString()} ريال</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">فتح القائمة</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 ml-2" />
                                  عرض التفاصيل
                                </DropdownMenuItem>
                                <RoleGuard permissions={["EDIT_INVOICE"]}>
                                  <DropdownMenuItem>تعديل</DropdownMenuItem>
                                </RoleGuard>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 ml-2" />
                                  طباعة
                                </DropdownMenuItem>
                                <RoleGuard permissions={["MANAGE_PAYMENTS"]}>
                                  <DropdownMenuItem>
                                    <CreditCard className="h-4 w-4 ml-2" />
                                    تسجيل دفعة
                                  </DropdownMenuItem>
                                </RoleGuard>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
