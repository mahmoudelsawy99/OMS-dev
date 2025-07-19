"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Search, MoreHorizontal, Download, Filter, Eye, FileText, RefreshCw } from "lucide-react"
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
import { invoicesAPI } from "@/lib/api"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    orderNumber: "",
    amount: "",
    status: "pending",
  })

  // Load invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to load from API first
        const result = await invoicesAPI.getAll()
        
        if (result.success) {
          // Transform API data to match frontend format
          const transformedInvoices = result.data.map(invoice => ({
            id: invoice._id || invoice.id,
            clientName: invoice.clientName || invoice.client?.name || "غير محدد",
            orderNumber: invoice.orderNumber || invoice.order?.id || "غير محدد",
            amount: invoice.amount || 0,
            status: invoice.status || "pending",
            date: invoice.createdAt 
              ? new Date(invoice.createdAt).toLocaleDateString('ar-SA')
              : new Date().toLocaleDateString('ar-SA'),
          }))
          
          setInvoices(transformedInvoices)
        } else {
          console.error('Failed to load invoices:', result.error)
          
          // Fallback to localStorage
          const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
          const transformedStoredInvoices = storedInvoices.map(invoice => ({
            id: invoice.id,
            clientName: invoice.clientName || "غير محدد",
            orderNumber: invoice.orderNumber || "غير محدد",
            amount: invoice.amount || 0,
            status: invoice.status || "pending",
            date: invoice.date || new Date().toLocaleDateString('ar-SA'),
          }))
          
          setInvoices(transformedStoredInvoices)
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
        setError("فشل في تحميل الفواتير")
        
        // Fallback to localStorage
        try {
          const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
          const transformedStoredInvoices = storedInvoices.map(invoice => ({
            id: invoice.id,
            clientName: invoice.clientName || "غير محدد",
            orderNumber: invoice.orderNumber || "غير محدد",
            amount: invoice.amount || 0,
            status: invoice.status || "pending",
            date: invoice.date || new Date().toLocaleDateString('ar-SA'),
          }))
          
          setInvoices(transformedStoredInvoices)
        } catch (localStorageError) {
          console.error("Error loading from localStorage:", localStorageError)
          setError("فشل في تحميل الفواتير من التخزين المحلي")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const result = await invoicesAPI.getAll()
      if (result.success) {
        const transformedInvoices = result.data.map(invoice => ({
          id: invoice._id || invoice.id,
          clientName: invoice.clientName || invoice.client?.name || "غير محدد",
          orderNumber: invoice.orderNumber || invoice.order?.id || "غير محدد",
          amount: invoice.amount || 0,
          status: invoice.status || "pending",
          date: invoice.createdAt 
            ? new Date(invoice.createdAt).toLocaleDateString('ar-SA')
            : new Date().toLocaleDateString('ar-SA'),
        }))
        setInvoices(transformedInvoices)
        toast({
          title: "تم التحديث",
          description: "تم تحديث قائمة الفواتير بنجاح",
        })
      }
    } catch (error) {
      console.error("Error refreshing invoices:", error)
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث قائمة الفواتير",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || invoice.status === filterStatus),
  )

  const handleAddInvoice = async () => {
    if (!newInvoice.clientName || !newInvoice.orderNumber || !newInvoice.amount) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const invoiceData = {
      clientName: newInvoice.clientName,
      orderNumber: newInvoice.orderNumber,
      amount: Number.parseFloat(newInvoice.amount),
      status: newInvoice.status,
    }

    try {
      const result = await invoicesAPI.create(invoiceData)
      
      if (result.success) {
        const newInvoiceData = {
          id: result.data._id || result.data.id,
          ...invoiceData,
          date: new Date().toLocaleDateString("ar-SA"),
        }
        
        setInvoices([...invoices, newInvoiceData])
        setNewInvoice({
          clientName: "",
          orderNumber: "",
          amount: "",
          status: "pending",
        })
        setIsDialogOpen(false)

        toast({
          title: "تمت الإضافة بنجاح",
          description: `تم إضافة الفاتورة ${newInvoiceData.id} بنجاح`,
        })
      } else {
        toast({
          title: "خطأ في الإضافة",
          description: result.error || "فشل في إضافة الفاتورة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding invoice:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
      
      // Fallback to localStorage
      const invoiceId = `INV-2024-${(invoices.length + 1).toString().padStart(3, "0")}`
      const invoiceToAdd = {
        id: invoiceId,
        ...invoiceData,
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

      // Save to localStorage
      try {
        const storedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
        localStorage.setItem("invoices", JSON.stringify([...storedInvoices, invoiceToAdd]))
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError)
      }

      toast({
        title: "تمت الإضافة بنجاح (محلي)",
        description: `تم إضافة الفاتورة ${invoiceId} إلى التخزين المحلي`,
      })
    }
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

  if (loading && invoices.length === 0) {
    return (
      <ProtectedRoute>
        <RoleGuard permissions={["VIEW_INVOICES"]} fallback={<AccessDenied />}>
          <div className="container mx-auto flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg">جاري تحميل الفواتير...</p>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    )
  }

  if (error && invoices.length === 0) {
    return (
      <ProtectedRoute>
        <RoleGuard permissions={["VIEW_INVOICES"]} fallback={<AccessDenied />}>
          <div className="container mx-auto flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <p className="text-lg text-red-600">{error}</p>
              <Button onClick={handleRefresh}>إعادة المحاولة</Button>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <RoleGuard permissions={["VIEW_INVOICES"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة الفواتير</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
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
                            <SelectItem value="pending">قيد الانتظار</SelectItem>
                            <SelectItem value="paid">مدفوعة</SelectItem>
                            <SelectItem value="overdue">متأخرة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleAddInvoice}>إضافة الفاتورة</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </RoleGuard>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{invoices.length}</div>
                <CardTitle className="text-lg">إجمالي الفواتير</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-green-600">{getTotalAmount()}</div>
                <CardTitle className="text-lg">إجمالي المبالغ</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-blue-600">{getPaidAmount()}</div>
                <CardTitle className="text-lg">المبالغ المدفوعة</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-red-600">{getPendingAmount()}</div>
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
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="paid">مدفوعة</SelectItem>
                        <SelectItem value="overdue">متأخرة</SelectItem>
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
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 ml-2" />
                                    عرض التفاصيل
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 ml-2" />
                                    تحميل الفاتورة
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CreditCard className="h-4 w-4 ml-2" />
                                    تسجيل الدفع
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          {loading ? "جاري التحميل..." : "لا توجد فواتير متطابقة مع معايير البحث"}
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
