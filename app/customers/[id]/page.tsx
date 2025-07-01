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

export default function CustomerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Fetch customer data
    const customerId = params.id
    const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
    const foundCustomer = storedCustomers.find((c) => c.id === customerId)

    if (foundCustomer) {
      setCustomer(foundCustomer)
    }

    // Fetch orders for this customer
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const customerOrders = storedOrders.filter((order) => order.clientId === customerId)
    setOrders(customerOrders)

    // Mock invoices data
    setInvoices([])
  }, [params.id])

  const handleDelete = () => {
    // Delete customer
    const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
    const updatedCustomers = storedCustomers.filter((c) => c.id !== customer.id)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    // Navigate back to customers list
    router.push("/customers")
  }

  const handleCreateOrder = () => {
    router.push("/orders/new")
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">تفاصيل العميل</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">لم يتم العثور على العميل</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تفاصيل العميل</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            العودة
          </Button>
          <Button onClick={handleCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            إنشاء طلب جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Customer Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>معلومات العميل</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل
                </Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>تأكيد الحذف</DialogTitle>
                      <DialogDescription>
                        هل أنت متأكد من رغبتك في حذف هذا العميل؟ هذا الإجراء لا يمكن التراجع عنه.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        حذف
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CardDescription>{customer.type === "individual" ? "عميل فرد" : "عميل شركة"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {customer.type === "individual" ? (
                  <User className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {customer.type === "individual" ? "رقم الهوية" : "رقم السجل التجاري"}:{" "}
                    {customer.idNumber || "غير متوفر"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">رقم الجوال</div>
                    <div>{customer.phone || "غير متوفر"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                    <div>{customer.email || "غير متوفر"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">العنوان</div>
                    <div>{customer.address || "غير متوفر"}</div>
                  </div>
                </div>

                {customer.type === "company" && (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">الشخص المسؤول</div>
                        <div>{customer.contactPerson || "غير متوفر"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">الرقم الضريبي</div>
                        <div>{customer.taxNumber || "غير متوفر"}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>ملخص النشاط</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">عدد الطلبات</div>
                <div className="font-medium">{orders.length}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">قيمة الطلبات</div>
                <div className="font-medium">
                  {orders.reduce((total, order) => total + (order.totalAmount || 0), 0)} ريال
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">آخر طلب</div>
                <div className="font-medium">
                  {orders.length > 0
                    ? orders.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))[0].creationDate
                    : "لا يوجد"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Orders, Invoices, Notes */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="invoices">الفواتير</TabsTrigger>
          <TabsTrigger value="notes">الملاحظات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>نظرة عامة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{orders.length}</div>
                      <p className="text-sm text-muted-foreground text-center">إجمالي الطلبات</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{orders.filter((o) => o.status === "موافق عليه").length}</div>
                      <p className="text-sm text-muted-foreground text-center">الطلبات المكتملة</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold">{invoices.length}</div>
                      <p className="text-sm text-muted-foreground text-center">الفواتير</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>الطلبات</CardTitle>
                <Button onClick={handleCreateOrder}>
                  <Plus className="h-4 w-4 mr-2" />
                  إنشاء طلب جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>رقم البوليصة</TableHead>
                      <TableHead>نوع الخدمة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.policyNumber || "—"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {order.services.map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service === "import"
                                  ? "تخليص وارد"
                                  : service === "export"
                                    ? "تخليص صادر"
                                    : service === "shipping"
                                      ? "شحن"
                                      : service === "transport"
                                        ? "نقل"
                                        : service === "storage"
                                          ? "تخزين"
                                          : service}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "قيد المراجعة"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "موافق عليه"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "مرفوض"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.creationDate}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">لا توجد طلبات لهذا العميل</p>
                  <Button onClick={handleCreateOrder}>
                    <Plus className="h-4 w-4 mr-2" />
                    إنشاء طلب جديد
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>الفواتير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد فواتير لهذا العميل</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>الملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">لا توجد ملاحظات لهذا العميل</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
