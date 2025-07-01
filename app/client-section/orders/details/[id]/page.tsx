"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Download, MessageCircle, Printer, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"
import { Label } from "@/components/ui/label"

// Sample order data
const getOrderData = (id: string) => {
  // Try to get the order from localStorage first
  try {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const foundOrder = storedOrders.find((order) => order.id === id)

    if (foundOrder) {
      // Ensure the order has a details property
      return {
        ...foundOrder,
        details: foundOrder.details || {
          origin: "غير محدد",
          destination: "غير محدد",
          weight: "غير محدد",
          dimensions: "غير محدد",
          items: "غير محدد",
          specialInstructions: "غير محدد",
        },
      }
    }
  } catch (error) {
    console.error("Error fetching order from localStorage:", error)
  }

  // Fallback to sample data if not found
  return {
    id,
    policyNumber: `POL-${id.substring(2)}`,
    clientName: "شركة الفا للتجارة",
    serviceType: "شحن",
    status: "قيد المراجعة",
    createdAt: "25/03/1445",
    details: {
      origin: "الرياض، المملكة العربية السعودية",
      destination: "دبي، الإمارات العربية المتحدة",
      weight: "250 كجم",
      dimensions: "120 × 80 × 100 سم",
      items: "5 صناديق",
      specialInstructions: "يرجى التعامل بحذر، محتويات قابلة للكسر",
    },
    timeline: [
      {
        date: "25/03/1445",
        time: "10:30 ص",
        status: "تم إنشاء الطلب",
        description: "تم إنشاء الطلب بنجاح وإرساله للمراجعة",
      },
      {
        date: "25/03/1445",
        time: "11:45 ص",
        status: "قيد المراجعة",
        description: "جاري مراجعة الطلب من قبل فريق العمليات",
      },
      {
        date: "25/03/1445",
        time: "02:15 م",
        status: "طلب مستندات إضافية",
        description: "يرجى تقديم صورة من الفاتورة التجارية وشهادة المنشأ",
      },
    ],
    documents: [
      {
        name: "بوليصة الشحن",
        status: "مطلوب",
        uploadDate: null,
      },
      {
        name: "الفاتورة التجارية",
        status: "تم الرفع",
        uploadDate: "25/03/1445",
      },
      {
        name: "شهادة المنشأ",
        status: "مطلوب",
        uploadDate: null,
      },
    ],
    messages: [
      {
        sender: "النظام",
        message: "تم إنشاء الطلب بنجاح",
        date: "25/03/1445",
        time: "10:30 ص",
      },
      {
        sender: "فريق العمليات",
        message: "يرجى تقديم صورة من الفاتورة التجارية وشهادة المنشأ لاستكمال الطلب",
        date: "25/03/1445",
        time: "02:15 م",
      },
    ],
  }
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = ""

  switch (status) {
    case "موافق عليه":
      color = "bg-green-50 text-green-700"
      break
    case "قيد المراجعة":
      color = "bg-blue-50 text-blue-700"
      break
    case "مرفوض":
      color = "bg-red-50 text-red-700"
      break
    case "بانتظار مستندات إضافية":
      color = "bg-yellow-50 text-yellow-700"
      break
    default:
      color = "bg-gray-50 text-gray-700"
  }

  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
}

export default function OrderDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const view = searchParams.get("view") || "client"
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [policies, setPolicies] = useState([])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const orderData = getOrderData(id)
      setOrder(orderData)

      // Check if there are policies in localStorage
      try {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        const foundOrder = storedOrders.find((order) => order.id === id)

        if (foundOrder && foundOrder.policies) {
          setPolicies(foundOrder.policies)
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
      }

      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Link href="/client-section/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 ml-2" />
              العودة للطلبات
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 ml-2" />
              طباعة
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">معلومات الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم الطلب:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم البوليصة:</span>
                  <span className="font-medium">{order.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الإنشاء:</span>
                  <span className="font-medium">{order.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">نوع الخدمة:</span>
                  <span className="font-medium">{order.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الحالة:</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">معلومات العميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">اسم العميل:</span>
                  <span className="font-medium">{order.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">رقم الهاتف:</span>
                  <span className="font-medium">+966 50 123 4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">البريد الإلكتروني:</span>
                  <span className="font-medium">info@alpha-trading.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">العنوان:</span>
                  <span className="font-medium">الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">الإجراءات المطلوبة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-1">مستندات مطلوبة</h4>
                  <p className="text-sm text-yellow-700">يرجى تقديم المستندات المطلوبة لاستكمال معالجة الطلب</p>
                  <Button size="sm" className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                    رفع المستندات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">تفاصيل الطلب</TabsTrigger>
            <TabsTrigger value="timeline">مسار الطلب</TabsTrigger>
            <TabsTrigger value="documents">المستندات</TabsTrigger>
            <TabsTrigger value="messages">المراسلات</TabsTrigger>
            {policies && policies.length > 0 && <TabsTrigger value="policy">البوليصة</TabsTrigger>}
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الشحنة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">مكان الانطلاق</h4>
                      <p>{order.details?.origin || "غير محدد"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">الوجهة</h4>
                      <p>{order.details?.destination || "غير محدد"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">الوزن</h4>
                      <p>{order.details?.weight || "غير محدد"}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">الأبعاد</h4>
                      <p>{order.details?.dimensions || "غير محدد"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">المحتويات</h4>
                      <p>{order.details?.items || "غير محدد"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">تعليمات خاصة</h4>
                      <p>{order.details?.specialInstructions || "غير محدد"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>مسار الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event: any, index: number) => (
                      <div key={index} className="mb-8 relative">
                        {/* Timeline connector */}
                        {index < order.timeline.length - 1 && (
                          <div className="absolute top-6 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                        )}

                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center z-10">
                            <span className="text-white text-xs">{index + 1}</span>
                          </div>

                          <div className="mr-4 flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium">{event.status}</h4>
                              <div className="text-sm text-gray-500">
                                {event.date} - {event.time}
                              </div>
                            </div>
                            <p className="text-gray-600">{event.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">لا توجد بيانات لمسار الطلب</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>المستندات المطلوبة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.documents && order.documents.length > 0 ? (
                    order.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          {doc.uploadDate && <p className="text-sm text-gray-500">تم الرفع: {doc.uploadDate}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant={doc.status === "تم الرفع" ? "success" : "destructive"}>{doc.status}</Badge>

                          {doc.status === "مطلوب" ? (
                            <Button size="sm">رفع المستند</Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              عرض المستند
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">لا توجد مستندات مطلوبة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>المراسلات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {order.messages && order.messages.length > 0 ? (
                    order.messages.map((msg: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          msg.sender === "فريق العمليات"
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium">{msg.sender}</h4>
                          <div className="text-xs text-gray-500">
                            {msg.date} - {msg.time}
                          </div>
                        </div>
                        <p className="text-gray-700">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-muted-foreground">لا توجد مراسلات</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <textarea
                    className="flex-grow p-2 border rounded-md"
                    placeholder="اكتب رسالتك هنا..."
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <Button className="self-end">
                    <MessageCircle className="h-4 w-4 ml-2" />
                    إرسال
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policy Tab */}
          <TabsContent value="policy">
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل البوليصة</CardTitle>
              </CardHeader>
              <CardContent>
                {policies && policies.length > 0 ? (
                  policies.map((policy: any) => (
                    <div key={policy.id} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">رقم البوليصة</Label>
                          <p className="font-medium">{policy.policyNumber}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">اسم المصدر</Label>
                          <p className="font-medium">{policy.sourceName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">اسم المستورد</Label>
                          <p className="font-medium">{policy.importerName}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">بلد القدوم</Label>
                          <p className="font-medium">{policy.originCountry}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">بلد الوصول</Label>
                          <p className="font-medium">{policy.destinationCountry}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">المنفذ</Label>
                          <p className="font-medium">{policy.port}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">عدد الطرود</Label>
                          <p className="font-medium">{policy.packagesCount}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">الوزن</Label>
                          <p className="font-medium">
                            {policy.weight} {policy.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">لا توجد بوليصات مضافة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
