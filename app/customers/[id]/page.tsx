"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { customersAPI, ordersAPI } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function CustomerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadCustomerData = async () => {
      setLoading(true)
      try {
        const customerId = params.id

        // Load customer data from API
        const customerResult = await customersAPI.getById(customerId)
        if (customerResult.success) {
          setCustomer(customerResult.data)
        } else {
          console.error('Failed to load customer:', customerResult.error)
          // Fallback to localStorage
          const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
          const foundCustomer = storedCustomers.find((c) => c.id === customerId)
          if (foundCustomer) {
            setCustomer(foundCustomer)
          } else {
            toast({
              title: "خطأ في تحميل بيانات العميل",
              description: "لم يتم العثور على العميل",
              variant: "destructive",
            })
            router.push("/customers")
            return
          }
        }

        // Load orders for this customer
        const ordersResult = await ordersAPI.getAll()
        if (ordersResult.success) {
          const customerOrders = ordersResult.data.filter((order) => 
            order.clientId === customerId || order.customer === customerId
          )
          setOrders(customerOrders)
        } else {
          // Fallback to localStorage
          const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
          const customerOrders = storedOrders.filter((order) => order.clientId === customerId)
          setOrders(customerOrders)
        }

        // Mock invoices data for now
        setInvoices([])

      } catch (error) {
        console.error('Error loading customer data:', error)
        toast({
          title: "خطأ في الاتصال",
          description: "فشل في الاتصال بالخادم",
          variant: "destructive",
        })
        // Fallback to localStorage
        const customerId = params.id
        const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        const foundCustomer = storedCustomers.find((c) => c.id === customerId)
        const customerOrders = storedOrders.filter((order) => order.clientId === customerId)
        
        if (foundCustomer) {
          setCustomer(foundCustomer)
          setOrders(customerOrders)
        }
      } finally {
        setLoading(false)
      }
    }

    loadCustomerData()
  }, [params.id, router])

  const handleDeleteCustomer = async () => {
    try {
      const result = await customersAPI.delete(params.id)
      
      if (result.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف العميل بنجاح",
        })
        router.push("/customers")
      } else {
        toast({
          title: "خطأ في حذف العميل",
          description: result.error || "فشل في حذف العميل",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCustomer = async (updatedData) => {
    try {
      const result = await customersAPI.update(params.id, updatedData)
      
      if (result.success) {
        setCustomer(result.data)
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث بيانات العميل بنجاح",
        })
      } else {
        toast({
          title: "خطأ في تحديث العميل",
          description: result.error || "فشل في تحديث العميل",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating customer:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات العميل...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لم يتم العثور على العميل</p>
          <Button onClick={() => router.push("/customers")} className="mt-4">
            العودة إلى قائمة العملاء
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">
              {customer.type === "company" ? "شركة" : "فرد"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="ml-2 h-4 w-4" />
            تعديل
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من حذف العميل "{customer.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={handleDeleteCustomer}>
                  حذف
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="ml-2 h-4 w-4" />
              المعلومات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">الاسم</label>
                <p className="text-sm">{customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">النوع</label>
                <Badge variant="outline">
                  {customer.type === "company" ? "شركة" : "فرد"}
                </Badge>
              </div>
              {customer.contactPerson && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الشخص المسؤول</label>
                  <p className="text-sm">{customer.contactPerson}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="ml-2 h-4 w-4" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                <p className="text-sm">{customer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                <p className="text-sm">{customer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="ml-2 h-4 w-4" />
              العنوان
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                <p className="text-sm">{customer.address}</p>
              </div>
              {customer.taxNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الرقم الضريبي</label>
                  <p className="text-sm">{customer.taxNumber}</p>
                </div>
              )}
              {customer.idNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رقم الهوية</label>
                  <p className="text-sm">{customer.idNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="invoices">الفواتير</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">إجمالي الفواتير</p>
                    <p className="text-2xl font-bold">{invoices.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">الطلبات المعلقة</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(order => order.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">تاريخ التسجيل</p>
                    <p className="text-sm">
                      {customer.createdAt 
                        ? new Date(customer.createdAt).toLocaleDateString('ar-SA')
                        : "غير محدد"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات</CardTitle>
              <CardDescription>
                قائمة جميع الطلبات المرتبطة بهذا العميل
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>الخدمات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id || order._id}>
                        <TableCell>{order.id || order._id}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {order.services?.map((service, index) => (
                              <Badge key={index} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === "completed" ? "default" :
                            order.status === "pending" ? "secondary" :
                            "destructive"
                          }>
                            {order.status === "completed" ? "مكتمل" :
                             order.status === "pending" ? "معلق" :
                             order.status === "cancelled" ? "ملغي" : order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString('ar-SA')
                            : "غير محدد"
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/orders/${order.id || order._id}`)}
                          >
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات لهذا العميل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الفواتير</CardTitle>
              <CardDescription>
                قائمة جميع الفواتير المرتبطة بهذا العميل
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.amount} ريال</TableCell>
                        <TableCell>
                          <Badge variant={
                            invoice.status === "paid" ? "default" :
                            invoice.status === "pending" ? "secondary" :
                            "destructive"
                          }>
                            {invoice.status === "paid" ? "مدفوع" :
                             invoice.status === "pending" ? "معلق" :
                             invoice.status === "overdue" ? "متأخر" : invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد فواتير لهذا العميل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

