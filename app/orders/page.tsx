"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  FileText,
  MoreHorizontal,
  ChevronsUpDownIcon as ChevronUpDown,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  X,
  FileImage,
  FileIcon as FilePdf,
  FileTextIcon,
  User,
  Calendar,
  Tag,
  Clock,
  Package,
  Upload,
  AlertCircle,
  Info,
  Truck,
  ShieldCheck,
  Clipboard,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [previewDocument, setPreviewDocument] = useState<{ name: string; type: string; url: string } | null>(null)

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")

    // If no orders in localStorage, use mock data
    if (storedOrders.length === 0) {
      const mockOrders = [
        {
          id: "OP00001",
          clientName: "أحمد محمد",
          services: ["shipping"],
          status: "قيد المراجعة",
          creationDate: "٢٥/٠٣/١٤٤٥",
          policyNumber: "POL-12345",
          declarationNumber: "DEC-5678",
          documents: [{ name: "فاتورة الشحن.pdf" }, { name: "صورة البضاعة.jpg" }, { name: "تفاصيل الطلب.docx" }],
        },
        {
          id: "OP00002",
          clientName: "شركة الفا",
          services: ["import", "transport"],
          status: "موافق عليه",
          creationDate: "٢٤/٠٣/١٤٤٥",
          policyNumber: "POL-12346",
          declarationNumber: "DEC-5679",
          documents: [{ name: "شهادة المنشأ.pdf" }],
        },
        {
          id: "OP00003",
          clientName: "مؤسسة النور",
          services: ["export"],
          status: "مرفوض",
          creationDate: "٢٣/٠٣/١٤٤٥",
          policyNumber: "POL-12347",
          declarationNumber: "DEC-5680",
          documents: [],
        },
        {
          id: "OP00004",
          clientName: "خالد عبدالله",
          services: ["transport"],
          status: "بانتظار مستندات إضافية",
          creationDate: "٢٢/٠٣/١٤٤٥",
          policyNumber: "POL-12348",
          declarationNumber: "",
          documents: null,
        },
      ]
      setOrders(mockOrders)
      localStorage.setItem("orders", JSON.stringify(mockOrders))
    } else {
      // Update orders with the latest policy information
      const updatedOrders = storedOrders.map((order) => {
        // If the order has policies, use the first policy number as the order's policy number
        if (order.policies && order.policies.length > 0) {
          return {
            ...order,
            policyNumber: order.policies[0].policyNumber,
          }
        }
        return order
      })
      setOrders(updatedOrders)
    }
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getServiceName = (service) => {
    const serviceNames = {
      import: "تخليص وارد",
      export: "تخليص صادر",
      shipping: "شحن",
      transport: "نقل",
      storage: "تخزين",
    }
    return serviceNames[service] || service
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "قيد المراجعة":
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>
      case "موافق عليه":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>
      case "مرفوض":
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>
      case "بانتظار مستندات إضافية":
        return <Badge className="bg-amber-100 text-amber-800">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredAndSortedOrders = orders
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort((a, b) => {
      if (!sortColumn) return 0
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const handleAddOrder = () => {
    router.push("/orders/new")
  }

  const getDocumentType = (name: string) => {
    const extension = name.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) return "image"
    if (["pdf"].includes(extension || "")) return "pdf"
    return "other"
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="h-4 w-4 ml-2 text-blue-500" />
      case "pdf":
        return <FilePdf className="h-4 w-4 ml-2 text-red-500" />
      default:
        return <FileTextIcon className="h-4 w-4 ml-2 text-blue-500" />
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">الطلبات</h1>

      {/* Stats cards */}
      <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border rounded-md bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.filter((o) => o.services.includes("export")).length}</div>
            <p className="text-sm text-muted-foreground text-center">تخليص صادر</p>
          </CardContent>
        </Card>
        <Card className="border rounded-md bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.filter((o) => o.services.includes("transport")).length}</div>
            <p className="text-sm text-muted-foreground text-center">طلبات النقل</p>
          </CardContent>
        </Card>
        <Card className="border rounded-md bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.filter((o) => o.services.includes("shipping")).length}</div>
            <p className="text-sm text-muted-foreground text-center">طلبات الشحن</p>
          </CardContent>
        </Card>
        <Card className="border rounded-md bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "قيد المراجعة").length}</div>
            <p className="text-sm text-muted-foreground text-center">طلبات جديدة</p>
          </CardContent>
        </Card>
        <Card className="border rounded-md bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.filter((o) => o.services.includes("import")).length}</div>
            <p className="text-sm text-muted-foreground text-center">تخليص وارد</p>
          </CardContent>
        </Card>
        <Card className="border rounded-md bg-slate-900 dark:bg-slate-800 text-white">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-sm text-center">جميع الطلبات</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="default" className="bg-slate-900 text-white flex gap-2" onClick={handleAddOrder}>
            <Plus className="h-5 w-5" />
            إضافة طلب جديد
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-md border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter">تصفية حسب الحالة:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="filter">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                  <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                  <SelectItem value="بانتظار مستندات إضافية">بانتظار مستندات إضافية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              تصدير
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("id")}>
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    رقم الطلب
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort("policyNumber")}
                >
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    رقم البوليصة
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort("declarationNumber")}
                >
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    رقم البيان
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort("clientName")}
                >
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    اسم العميل
                  </div>
                </TableHead>
                <TableHead className="text-right">نوع الخدمة</TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("status")}>
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    حالة الطلب
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort("creationDate")}
                >
                  <div className="flex items-center justify-end">
                    <ChevronUpDown className="ml-2 h-4 w-4" />
                    تاريخ الإنشاء
                  </div>
                </TableHead>
                <TableHead className="text-left">الإعدادات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.policyNumber ? (
                      <Link href={`/orders/${order.id}?tab=policy`} className="text-blue-600 hover:underline">
                        {order.policyNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {order.declarationNumber ? (
                      <Link href={`/orders/${order.id}?tab=declaration`} className="text-blue-600 hover:underline">
                        {order.declarationNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {order.services.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {getServiceName(service)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.creationDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-96" align="end">
                        <div className="p-4 border-b bg-slate-50">
                          <div className="flex items-center mb-2">
                            <Info className="h-5 w-5 text-slate-600 ml-2" />
                            <h4 className="font-medium text-lg">تفاصيل الطلب</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm bg-white p-3 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 text-slate-500 ml-2" />
                              <span className="text-muted-foreground ml-1">رقم الطلب:</span>
                              <span className="font-medium">{order.id}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-slate-500 ml-2" />
                              <span className="text-muted-foreground ml-1">العميل:</span>
                              <span className="font-medium">{order.clientName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-slate-500 ml-2" />
                              <span className="text-muted-foreground ml-1">التاريخ:</span>
                              <span className="font-medium">{order.creationDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-slate-500 ml-2" />
                              <span className="text-muted-foreground ml-1">الحالة:</span>
                              <span
                                className={`font-medium ${
                                  order.status === "موافق عليه"
                                    ? "text-green-600"
                                    : order.status === "مرفوض"
                                      ? "text-red-600"
                                      : order.status === "بانتظار مستندات إضافية"
                                        ? "text-amber-600"
                                        : "text-blue-600"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border-b">
                          <div className="flex items-center mb-2">
                            <Clipboard className="h-5 w-5 text-slate-600 ml-2" />
                            <h4 className="font-medium text-lg">المرفقات</h4>
                          </div>
                          <div className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2 bg-white p-2 rounded-md shadow-sm">
                            {order.documents && order.documents.length > 0 ? (
                              order.documents.map((doc, index) => {
                                // تحديد نوع المستند ورابط وهمي للعرض
                                const docType = getDocumentType(doc.name)
                                const docUrl = `/placeholder.svg?height=600&width=800&query=document preview for ${doc.name}`

                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2 border-b border-slate-100 last:border-0"
                                  >
                                    <div className="flex items-center">
                                      {getDocumentIcon(docType)}
                                      <span className="truncate max-w-[180px]">{doc.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 mr-1 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={() =>
                                          setPreviewDocument({
                                            name: doc.name,
                                            type: docType,
                                            url: docUrl,
                                          })
                                        }
                                        title="معاينة"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                        title="تنزيل"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-muted-foreground py-4 text-center flex flex-col items-center">
                                <FileText className="h-8 w-8 mb-2 text-slate-300" />
                                <p>لا توجد مرفقات</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Upload className="h-4 w-4 ml-1" />
                                  إضافة مرفق
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50">
                          <div className="flex items-center mb-3">
                            <ShieldCheck className="h-5 w-5 text-slate-600 ml-2" />
                            <h4 className="font-medium text-lg">الإجراءات</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 transition-colors"
                                onClick={() => {
                                  toast({
                                    title: "تمت الموافقة على الطلب",
                                    description: `تم تحديث حالة الطلب ${order.id} إلى موافق عليه`,
                                  })
                                }}
                              >
                                <CheckCircle className="h-4 w-4 ml-1" />
                                موافقة
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1 transition-colors"
                                onClick={() => {
                                  toast({
                                    title: "تم رفض الطلب",
                                    description: `تم تحديث حالة الطلب ${order.id} إلى مرفوض`,
                                  })
                                }}
                              >
                                <XCircle className="h-4 w-4 ml-1" />
                                رفض
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="transition-colors hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
                                onClick={() => {
                                  const dialog = document.createElement("dialog")
                                  dialog.innerHTML = `
              <div class="p-4 max-w-md mx-auto">
                <h3 class="text-lg font-bold mb-2">طلب مستندات إضافية</h3>
                <textarea class="w-full p-2 border rounded mb-2" rows="3" placeholder="أدخل المتطلبات الإضافية"></textarea>
                <div class="flex justify-end gap-2">
                  <button class="px-3 py-1 bg-gray-200 rounded" onclick="this.closest('dialog').close()">إلغاء</button>
                  <button class="px-3 py-1 bg-blue-600 text-white rounded" onclick="this.closest('dialog').close()">إرسال</button>
                </div>
              </div>
            `
                                  document.body.appendChild(dialog)
                                  dialog.showModal()
                                  dialog.addEventListener("close", () => {
                                    document.body.removeChild(dialog)
                                    toast({
                                      title: "تم طلب مستندات إضافية",
                                      description: `تم إرسال طلب مستندات إضافية للطلب ${order.id}`,
                                    })
                                  })
                                }}
                              >
                                <AlertCircle className="h-4 w-4 ml-1" />
                                طلب مستندات
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="transition-colors hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                              >
                                <Truck className="h-4 w-4 ml-1" />
                                تتبع الشحنة
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              <Package className="h-4 w-4 ml-1" />
                              عرض تفاصيل الطلب
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* مكون معاينة المستندات */}
      <Dialog open={previewDocument !== null} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center">
              {previewDocument && getDocumentIcon(previewDocument.type)}
              <span className="mr-2">{previewDocument?.name}</span>
            </DialogTitle>
            <DialogClose className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-[300px] bg-slate-50 rounded-md">
            {previewDocument &&
              (previewDocument.type === "image" ? (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={previewDocument.url || "/placeholder.svg"}
                    alt={previewDocument.name}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                </div>
              ) : previewDocument.type === "pdf" ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <FilePdf className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-center">معاينة ملف PDF</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">{previewDocument.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <FileTextIcon className="h-16 w-16 text-blue-500 mb-4" />
                  <p className="text-center">معاينة المستند</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">{previewDocument.name}</p>
                </div>
              ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="ml-2" onClick={() => setPreviewDocument(null)}>
              إغلاق
            </Button>
            <Button>
              <Download className="h-4 w-4 ml-2" />
              تنزيل
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
