"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  Download,
  Eye,
  Send,
  Upload,
  Info,
  Truck,
  RefreshCw,
  FileCheck,
  Copy,
  Share2,
  MoreHorizontal,
  Filter,
  Search,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [documents, setDocuments] = useState([])
  const [trackingUpdates, setTrackingUpdates] = useState([])
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // Fetch order data
    const fetchOrder = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch from an API
        // For now, we'll simulate by retrieving from localStorage
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        const foundOrder = storedOrders.find((order) => order.id === params.id)

        if (foundOrder) {
          setOrder(foundOrder)

          // Generate mock messages if none exist
          if (!foundOrder.messages) {
            const mockMessages = [
              {
                id: "msg1",
                sender: "system",
                content: "تم إنشاء الطلب بنجاح",
                timestamp: foundOrder.creationDate,
                isRead: true,
              },
              {
                id: "msg2",
                sender: "company",
                content: "تم استلام طلبكم وجاري مراجعته من قبل فريقنا",
                timestamp: foundOrder.creationDate,
                isRead: true,
              },
            ]

            if (foundOrder.status === "موافق عليه") {
              mockMessages.push({
                id: "msg3",
                sender: "company",
                content: "تمت الموافقة على طلبكم وجاري العمل عليه",
                timestamp: foundOrder.creationDate,
                isRead: false,
              })
            } else if (foundOrder.status === "مرفوض") {
              mockMessages.push({
                id: "msg3",
                sender: "company",
                content:
                  "نعتذر، تم رفض طلبكم للأسباب التالية: " +
                  (foundOrder.rejectionReason || "عدم اكتمال المستندات المطلوبة"),
                timestamp: foundOrder.creationDate,
                isRead: false,
              })
            } else if (foundOrder.status === "بانتظار مستندات إضافية") {
              mockMessages.push({
                id: "msg3",
                sender: "company",
                content: "يرجى توفير المستندات الإضافية التالية لاستكمال طلبكم",
                timestamp: foundOrder.creationDate,
                isRead: false,
              })
            }

            setMessages(mockMessages)

            // Count unread messages
            const unread = mockMessages.filter((msg) => !msg.isRead && msg.sender !== "client").length
            setUnreadMessages(unread)
          } else {
            setMessages(foundOrder.messages)

            // Count unread messages
            const unread = foundOrder.messages.filter((msg) => !msg.isRead && msg.sender !== "client").length
            setUnreadMessages(unread)
          }

          // Generate mock documents if none exist
          if (foundOrder.documents) {
            setDocuments(foundOrder.documents)
          } else {
            const mockDocuments = [
              {
                id: "doc1",
                name: "بوليصة الشحن.pdf",
                type: "application/pdf",
                status: "approved",
                uploadDate: foundOrder.creationDate,
              },
              {
                id: "doc2",
                name: "فاتورة الشراء.pdf",
                type: "application/pdf",
                status: "pending",
                uploadDate: foundOrder.creationDate,
              },
            ]
            setDocuments(mockDocuments)
          }

          // Generate tracking updates
          generateTrackingUpdates(foundOrder)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  // Generate tracking updates based on order status
  const generateTrackingUpdates = (order) => {
    if (order && order.status === "موافق عليه") {
      // محاكاة تحديثات تتبع الطلب
      const mockTrackingUpdates = [
        {
          id: "track1",
          status: "تم استلام الطلب",
          timestamp: order.creationDate,
          details: "تم استلام طلبك وإضافته إلى نظامنا",
          completed: true,
        },
        {
          id: "track2",
          status: "تمت الموافقة على الطلب",
          timestamp: new Date().toLocaleDateString("ar-SA"),
          details: "تم مراجعة طلبك والموافقة عليه",
          completed: true,
        },
      ]

      // إضافة تحديثات إضافية حسب نوع الخدمة
      if (order.services?.includes("shipping")) {
        mockTrackingUpdates.push({
          id: "track3",
          status: "جاري تجهيز الشحنة",
          timestamp: "—",
          details: "جاري العمل على تجهيز شحنتك",
          completed: false,
        })
      }

      if (order.services?.includes("import") || order.services?.includes("export")) {
        mockTrackingUpdates.push({
          id: "track3",
          status: "جاري إجراءات التخليص",
          timestamp: "—",
          details: "جاري العمل على إجراءات التخليص الجمركي",
          completed: false,
        })
      }

      if (order.services?.includes("transport")) {
        mockTrackingUpdates.push({
          id: "track3",
          status: "جاري تجهيز النقل",
          timestamp: "—",
          details: "جاري تجهيز وسيلة النقل المناسبة",
          completed: false,
        })
      }

      setTrackingUpdates(mockTrackingUpdates)
    } else {
      // Reset tracking updates if order is not approved
      setTrackingUpdates([])
    }
  }

  // إضافة وظيفة تحديث حالة قراءة الرسائل
  useEffect(() => {
    if (activeTab === "messages" && messages.length > 0) {
      // تحديث حالة قراءة الرسائل عند فتح تبويب المحادثات
      const updatedMessages = messages.map((msg) => ({
        ...msg,
        isRead: true,
      }))

      setMessages(updatedMessages)
      setUnreadMessages(0)

      // حفظ حالة قراءة الرسائل في localStorage
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const updatedOrders = storedOrders.map((o) => {
        if (o.id === order?.id) {
          return { ...o, messages: updatedMessages }
        }
        return o
      })
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    }
  }, [activeTab, order?.id])

  // تحسين وظيفة إرسال الرسائل
  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: `msg${messages.length + 1}`,
      sender: "client",
      content: newMessage,
      timestamp: new Date().toLocaleDateString("ar-SA"),
      isRead: false,
    }

    // إضافة الرسالة إلى قائمة الرسائل
    const updatedMessages = [...messages, newMsg]
    setMessages(updatedMessages)

    // حفظ الرسائل في localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = storedOrders.map((o) => {
      if (o.id === order.id) {
        return { ...o, messages: updatedMessages }
      }
      return o
    })
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    setNewMessage("")

    toast({
      title: "تم إرسال الرسالة",
      description: "سيتم الرد عليك في أقرب وقت ممكن",
    })

    // محاكاة رد تلقائي من النظام بعد ثانيتين
    setTimeout(() => {
      const autoReply = {
        id: `msg${updatedMessages.length + 1}`,
        sender: "company",
        content: "شكراً لتواصلك معنا. سيقوم أحد ممثلي خدمة العملاء بالرد عليك قريباً.",
        timestamp: new Date().toLocaleDateString("ar-SA"),
        isRead: false,
      }

      const updatedWithReply = [...updatedMessages, autoReply]
      setMessages(updatedWithReply)
      setUnreadMessages(1)

      // حفظ الرسائل المحدثة في localStorage
      const latestOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const ordersWithReply = latestOrders.map((o) => {
        if (o.id === order.id) {
          return { ...o, messages: updatedWithReply }
        }
        return o
      })
      localStorage.setItem("orders", JSON.stringify(ordersWithReply))
    }, 2000)
  }

  // تحسين وظيفة رفع المستندات
  const handleUploadDocument = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newDocs = Array.from(files).map((file) => ({
      id: `doc${documents.length + Date.now()}`,
      name: file.name,
      type: file.type,
      status: "pending",
      uploadDate: new Date().toLocaleDateString("ar-SA"),
    }))

    // إضافة المستندات إلى قائمة المستندات
    const updatedDocs = [...documents, ...newDocs]
    setDocuments(updatedDocs)

    // حفظ المستندات في localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const updatedOrders = storedOrders.map((o) => {
      if (o.id === order.id) {
        return { ...o, documents: updatedDocs }
      }
      return o
    })
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // إضافة رسالة نظام تفيد برفع المستندات
    const systemMsg = {
      id: `msg${messages.length + 1}`,
      sender: "system",
      content: `تم رفع ${newDocs.length} مستند جديد. سيتم مراجعتها من قبل فريقنا.`,
      timestamp: new Date().toLocaleDateString("ar-SA"),
      isRead: false,
    }

    const updatedMessages = [...messages, systemMsg]
    setMessages(updatedMessages)

    // تحديث الرسائل في localStorage
    const ordersWithMessage = updatedOrders.map((o) => {
      if (o.id === order.id) {
        return { ...o, messages: updatedMessages }
      }
      return o
    })
    localStorage.setItem("orders", JSON.stringify(ordersWithMessage))

    toast({
      title: "تم رفع المستندات",
      description: "سيتم مراجعة المستندات من قبل فريقنا",
    })

    // محاكاة تغيير حالة المستند بعد 3 ثوان
    setTimeout(() => {
      const randomStatus = Math.random() > 0.3 ? "approved" : "pending"
      const docsWithStatus = updatedDocs.map((doc) => {
        if (newDocs.some((newDoc) => newDoc.id === doc.id)) {
          return { ...doc, status: randomStatus }
        }
        return doc
      })

      setDocuments(docsWithStatus)

      // حفظ المستندات المحدثة في localStorage
      const latestOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const ordersWithUpdatedDocs = latestOrders.map((o) => {
        if (o.id === order.id) {
          return { ...o, documents: docsWithStatus }
        }
        return o
      })
      localStorage.setItem("orders", JSON.stringify(ordersWithUpdatedDocs))

      // إضافة رسالة نظام تفيد بتغيير حالة المستندات
      if (randomStatus === "approved") {
        const statusMsg = {
          id: `msg${updatedMessages.length + 1}`,
          sender: "system",
          content: "تمت الموافقة على المستندات المرفقة.",
          timestamp: new Date().toLocaleDateString("ar-SA"),
          isRead: false,
        }

        const messagesWithStatus = [...updatedMessages, statusMsg]
        setMessages(messagesWithStatus)
        setUnreadMessages(unreadMessages + 1)

        // تحديث الرسائل في localStorage
        const ordersWithStatusMsg = ordersWithUpdatedDocs.map((o) => {
          if (o.id === order.id) {
            return { ...o, messages: messagesWithStatus }
          }
          return o
        })
        localStorage.setItem("orders", JSON.stringify(ordersWithStatusMsg))
      }
    }, 3000)
  }

  // تحسين وظيفة عرض المستندات
  const handleViewDocument = (doc) => {
    toast({
      title: "عرض المستند",
      description: `جاري فتح المستند: ${doc.name}`,
    })
    // في التطبيق الحقيقي، هنا سيتم فتح المستند في نافذة جديدة أو عرضه في مشغل مستندات
  }

  // تحسين وظيفة تنزيل المستندات
  const handleDownloadDocument = (doc) => {
    toast({
      title: "تنزيل المستند",
      description: `جاري تنزيل المستند: ${doc.name}`,
    })
    // في التطبيق الحقيقي، هنا سيتم تنزيل المستند
  }

  // تحسين وظيفة طباعة تفاصيل الطلب
  const handlePrintOrderDetails = () => {
    toast({
      title: "طباعة التفاصيل",
      description: "جاري إعداد صفحة الطباعة...",
    })
    // في التطبيق الحقيقي، هنا سيتم إعداد صفحة الطباعة
    window.print()
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

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">تمت الموافقة</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">قيد المراجعة</Badge>
      default:
        return <Badge>{status}</Badge>
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

  const getCityName = (cityCode) => {
    const cities = {
      riyadh: "الرياض",
      jeddah: "جدة",
      dammam: "الدمام",
      makkah: "مكة المكرمة",
    }
    return cities[cityCode] || cityCode
  }

  // إضافة وظيفة تحديث حالة الطلب (محاكاة)
  const handleSimulateStatusUpdate = () => {
    if (order.status === "قيد المراجعة") {
      // محاكاة تغيير حالة الطلب من قيد المراجعة إلى موافق عليه
      const updatedOrder = { ...order, status: "موافق عليه" }
      setOrder(updatedOrder)

      // إضافة رسالة نظام تفيد بتغيير الحالة
      const statusMsg = {
        id: `msg${messages.length + 1}`,
        sender: "system",
        content: "تمت الموافقة على طلبك وجاري العمل عليه.",
        timestamp: new Date().toLocaleDateString("ar-SA"),
        isRead: false,
      }

      const updatedMessages = [...messages, statusMsg]
      setMessages(updatedMessages)
      setUnreadMessages(unreadMessages + 1)

      // حفظ التغييرات في localStorage
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const updatedOrders = storedOrders.map((o) => {
        if (o.id === order.id) {
          return { ...updatedOrder, messages: updatedMessages }
        }
        return o
      })
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      toast({
        title: "تحديث حالة الطلب",
        description: "تمت الموافقة على طلبك!",
      })

      // Generate tracking updates for the approved order
      generateTrackingUpdates(updatedOrder)
    }
  }

  // إضافة زر لمحاكاة تحديث الحالة (للعرض التوضيحي فقط)
  useEffect(() => {
    if (order && order.status === "قيد المراجعة") {
      const timer = setTimeout(() => {
        handleSimulateStatusUpdate()
      }, 10000) // تحديث الحالة بعد 10 ثوان للعرض التوضيحي

      return () => clearTimeout(timer)
    }
  }, [order?.id, order?.status])

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg mb-4">لم يتم العثور على الطلب</p>
          <Button variant="outline" onClick={() => router.push("/client/orders")}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة إلى الطلبات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="ml-2" onClick={() => router.push("/client/orders")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">طلب #{order.id}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Badge variant="outline" className="ml-2">
                {getServiceName(order.services?.[0] || "import")}
              </Badge>
              {order.services?.length > 1 && order.services[1] && (
                <Badge variant="outline">{getServiceName(order.services[1])}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={handlePrintOrderDetails}>
            <FileText className="h-4 w-4 ml-1" />
            طباعة
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <MoreHorizontal className="h-4 w-4 ml-1" />
                المزيد
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 className="h-4 w-4 ml-2" />
                مشاركة الطلب
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                <Copy className="h-4 w-4 ml-2" />
                نسخ رقم الطلب
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTab("documents")}>
                <Upload className="h-4 w-4 ml-2" />
                رفع مستندات
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("messages")}>
                <MessageSquare className="h-4 w-4 ml-2" />
                التواصل مع خدمة العملاء
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Ticket Status Banner */}
      <Card
        className={`mb-6 ${
          order.status === "موافق عليه"
            ? "bg-green-50 border-green-200"
            : order.status === "مرفوض"
              ? "bg-red-50 border-red-200"
              : order.status === "بانتظار مستندات إضافية"
                ? "bg-amber-50 border-amber-200"
                : "bg-blue-50 border-blue-200"
        }`}
      >
        <CardContent className="p-4 flex items-center">
          {order.status === "موافق عليه" && (
            <>
              <CheckCircle className="h-6 w-6 text-green-600 ml-3" />
              <div>
                <h3 className="font-medium text-green-800">تمت الموافقة على الطلب</h3>
                <p className="text-sm text-green-700">تم تحويل الطلب إلى أمر تشغيل وجاري العمل عليه</p>
              </div>
            </>
          )}
          {order.status === "مرفوض" && (
            <>
              <XCircle className="h-6 w-6 text-red-600 ml-3" />
              <div>
                <h3 className="font-medium text-red-800">تم رفض الطلب</h3>
                <p className="text-sm text-red-700">
                  {order.rejectionReason ? `سبب الرفض: ${order.rejectionReason}` : "لم يتم تحديد سبب للرفض"}
                </p>
              </div>
            </>
          )}
          {order.status === "بانتظار مستندات إضافية" && (
            <>
              <AlertCircle className="h-6 w-6 text-amber-600 ml-3" />
              <div>
                <h3 className="font-medium text-amber-800">مطلوب مستندات إضافية</h3>
                <p className="text-sm text-amber-700">يرجى توفير المستندات المطلوبة لاستكمال طلبك</p>
              </div>
            </>
          )}
          {order.status === "قيد المراجعة" && (
            <>
              <Clock className="h-6 w-6 text-blue-600 ml-3" />
              <div>
                <h3 className="font-medium text-blue-800">طلبك قيد المراجعة</h3>
                <p className="text-sm text-blue-700">سيتم إشعارك بأي تحديثات على طلبك</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Main Summary Card */}
      <Card className="bg-white shadow-sm border-0 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">رقم الطلب</div>
                  <div className="font-medium text-lg">{order.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">تاريخ الإنشاء</div>
                  <div className="font-medium text-lg">{order.creationDate}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">رقم البوليصة</div>
                  <div className="font-medium text-lg">{order.policyNumber || "غير متوفر"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">رقم البيان الجمركي</div>
                  <div className="font-medium text-lg">{order.declarationNumber || "غير متوفر"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">الخدمات</div>
                  <div className="flex flex-wrap gap-1">
                    {order.services?.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {getServiceName(service)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">الحالة</div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-muted-foreground mb-2">إجراءات سريعة</div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="h-9" onClick={() => setActiveTab("messages")}>
                    <MessageSquare className="h-4 w-4 ml-1" />
                    التواصل مع خدمة العملاء
                  </Button>
                  <Button variant="outline" size="sm" className="h-9" onClick={() => setActiveTab("documents")}>
                    <Upload className="h-4 w-4 ml-1" />
                    رفع مستندات جديدة
                  </Button>
                  <Button variant="outline" size="sm" className="h-9" onClick={handlePrintOrderDetails}>
                    <FileText className="h-4 w-4 ml-1" />
                    طباعة تفاصيل الطلب
                  </Button>
                </div>
              </div>
            </div>

            {/* Shipping Status Information */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">حالة الشحنة</div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex flex-col space-y-4">
                  {order.status === "موافق عليه" ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 border-2 border-white">
                          <Truck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">في الطريق</div>
                          <div className="text-sm text-muted-foreground">آخر تحديث: 17/04/2025</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">جاري</Badge>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 border-2 border-white">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">بانتظار الموافقة</div>
                          <div className="text-sm text-muted-foreground">آخر تحديث: {order.creationDate}</div>
                        </div>
                      </div>
                      <Badge variant="outline">قيد الانتظار</Badge>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setActiveTab("tracking")}
                    disabled={order.status !== "موافق عليه"}
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    {order.status === "موافق عليه" ? "عرض تفاصيل التتبع" : "غير متاح حالياً"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200">
            <div className="flex items-center px-4 overflow-x-auto scrollbar-hide">
              <TabsList className="h-16 bg-transparent p-0 relative">
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200"></div>
                <TabsTrigger
                  value="overview"
                  className="relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>نظرة عامة</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span>تفاصيل الطلب</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="tracking"
                  className="relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    <span>تتبع الطلب</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FileCheck className="h-5 w-5 text-amber-600" />
                    <span>المستندات</span>
                    {documents.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-600 text-[10px]">
                        {documents.length}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="relative h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <span>المحادثات</span>
                    {unreadMessages > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-600 text-[10px]">
                        {unreadMessages}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 scale-x-0 transition-transform duration-200 data-[state=active]:scale-x-100"></div>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2 pl-4">
                <Button variant="outline" size="sm" className="gap-1 rounded-full">
                  <Filter className="h-4 w-4 ml-1" />
                  تصفية
                </Button>
                <Button variant="outline" size="sm" className="gap-1 rounded-full">
                  <Search className="h-4 w-4 ml-1" />
                  بحث
                </Button>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">رقم الطلب</h3>
                      <p className="font-medium">{order.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">رقم البوليصة</h3>
                      <p className="font-medium">{order.policyNumber || "—"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">تاريخ الإنشاء</h3>
                      <p className="font-medium">{order.creationDate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">حالة الطلب</h3>
                      <p className="font-medium">{getStatusBadge(order.status)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">الخدمات المطلوبة</h3>
                    <div className="flex flex-wrap gap-2">
                      {order.services?.map((service) => (
                        <Badge key={service} className="px-3 py-1">
                          {getServiceName(service)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Show specific service details based on selected services */}
                  {order.services?.includes("shipping") && order.shippingType && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-medium mb-2">تفاصيل الشحن</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">نوع الشحن</p>
                          <p className="font-medium">
                            {order.shippingType === "fob"
                              ? "FOB (تسليم ظهر السفينة)"
                              : "Door to Door (من الباب إلى الباب)"}
                          </p>
                        </div>
                        {order.factoryContact && (
                          <div>
                            <p className="text-sm text-muted-foreground">معلومات المصنع</p>
                            <p className="font-medium">{order.factoryContact.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.services?.includes("transport") && order.transportType && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-medium mb-2">تفاصيل النقل</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">نوع النقل</p>
                          <p className="font-medium">{order.transportType === "dina" ? "دينة" : "تريلا"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">نوع التبريد</p>
                          <p className="font-medium">
                            {order.transportTemperature === "refrigerated" ? "مبرد" : "جاف"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">المغادرة</p>
                          <p className="font-medium">
                            {getCityName(order.departureCity)} - {order.departureDistrict}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الوصول</p>
                          <p className="font-medium">
                            {getCityName(order.arrivalCity)} - {order.arrivalDistrict}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">آخر التحديثات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages && messages.length > 0 ? (
                      messages.slice(-3).map((message) => (
                        <div key={message.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {message.sender === "system" ? (
                                <Info className="h-5 w-5 text-blue-500 ml-2" />
                              ) : message.sender === "company" ? (
                                <User className="h-5 w-5 text-purple-500 ml-2" />
                              ) : (
                                <User className="h-5 w-5 text-green-500 ml-2" />
                              )}
                              <span className="font-medium">
                                {message.sender === "system"
                                  ? "النظام"
                                  : message.sender === "company"
                                    ? "خدمة العملاء"
                                    : "أنت"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <p className="mt-2 text-sm">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">لا توجد تحديثات حديثة</p>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("messages")}>
                      عرض جميع المحادثات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تفاصيل الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Details */}
                <div>
                  <h3 className="font-medium mb-2">الخدمات المطلوبة</h3>
                  <div className="flex flex-wrap gap-2">
                    {order.services?.map((service) => (
                      <Badge key={service} className="px-3 py-1">
                        {getServiceName(service)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                {order.services?.includes("shipping") && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">تفاصيل الشحن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">نوع الشحن</p>
                        <p className="font-medium">
                          {order.shippingType === "fob"
                            ? "FOB (تسليم ظهر السفينة)"
                            : "Door to Door (من الباب إلى الباب)"}
                        </p>
                      </div>

                      {order.factoryContact && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">اسم المصنع/الشركة</p>
                            <p className="font-medium">{order.factoryContact.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                            <p className="font-medium">{order.factoryContact.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                            <p className="font-medium">{order.factoryContact.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">العنوان</p>
                            <p className="font-medium">{order.factoryContact.address}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Transport Details */}
                {order.services?.includes("transport") && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">تفاصيل النقل</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">نوع النقل</p>
                        <p className="font-medium">{order.transportType === "dina" ? "دينة" : "تريلا"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">نوع التبريد</p>
                        <p className="font-medium">{order.transportTemperature === "refrigerated" ? "مبرد" : "جاف"}</p>
                      </div>

                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2 text-primary flex items-center">
                          <MapPin className="h-4 w-4 ml-2" />
                          معلومات المغادرة
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">المدينة:</span>
                            <span className="font-medium">{getCityName(order.departureCity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">الحي:</span>
                            <span className="font-medium">{order.departureDistrict}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2 text-primary flex items-center">
                          <MapPin className="h-4 w-4 ml-2" />
                          معلومات الوصول
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">المدينة:</span>
                            <span className="font-medium">{getCityName(order.arrivalCity)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">الحي:</span>
                            <span className="font-medium">{order.arrivalDistrict}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Import/Export Details */}
                {(order.services?.includes("import") || order.services?.includes("export")) && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">
                      {order.services?.includes("import") ? "تفاصيل التخليص الوارد" : "تفاصيل التخليص الصادر"}
                    </h3>
                    <div className="border rounded-md p-4 bg-slate-50">
                      <p className="text-center text-muted-foreground">
                        {order.status === "موافق عليه"
                          ? "جاري العمل على إجراءات التخليص الجمركي"
                          : "سيتم عرض تفاصيل التخليص بعد الموافقة على الطلب"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تتبع الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-8">
                    {trackingUpdates.map((update, index) => (
                      <div key={update.id} className="relative pr-8">
                        <div
                          className={`absolute right-0 top-1 w-6 h-6 rounded-full ${
                            update.completed ? "bg-green-500" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          {update.completed ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-medium ${!update.completed && "text-muted-foreground"}`}>
                            {update.status}
                          </h4>
                          <p className="text-sm text-muted-foreground">{update.timestamp}</p>
                          <p className="text-sm mt-1">{update.details}</p>
                        </div>
                      </div>
                    ))}

                    {/* إضافة خطوة الاكتمال النهائية */}
                    <div className="relative pr-8">
                      <div className="absolute right-0 top-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-muted-foreground">اكتمال الطلب</h4>
                        <p className="text-sm text-muted-foreground">—</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* معلومات إضافية عن التتبع */}
                {order.status === "موافق عليه" && (
                  <div className="mt-8 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-medium mb-2">معلومات التتبع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">رقم التتبع</p>
                        <p className="font-medium">{order.id}-TRK</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">الوقت المتوقع للإنجاز</p>
                        <p className="font-medium">3-5 أيام عمل</p>
                      </div>
                      {order.services?.includes("transport") && (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">موقع الشحنة الحالي</p>
                            <p className="font-medium">{getCityName(order.departureCity)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">الوجهة النهائية</p>
                            <p className="font-medium">{getCityName(order.arrivalCity)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {order.status === "موافق عليه" && (
                  <div className="mt-6">
                    <Progress value={60} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>استلام الطلب</span>
                      <span>في الطريق</span>
                      <span>التسليم النهائي</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="p-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">المستندات</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4 ml-1" />
                    تصفية
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 ml-2" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">تم الرفع: {doc.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDocumentStatusBadge(doc.status)}
                          <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">لا توجد مستندات مرفقة</p>
                )}

                {/* Upload New Documents */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-4">رفع مستندات جديدة</h3>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملفات هنا أو</p>
                    <Input type="file" multiple className="mx-auto max-w-xs" onChange={handleUploadDocument} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>
                      <Upload className="h-4 w-4 ml-2" />
                      رفع المستندات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="p-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">المحادثات</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.sender === "client"
                            ? "bg-primary text-primary-foreground"
                            : message.sender === "system"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-muted"
                        } rounded-lg p-3`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs">
                            {message.sender === "system"
                              ? "النظام"
                              : message.sender === "company"
                                ? "خدمة العملاء"
                                : "أنت"}
                          </span>
                          <span className="text-xs">{message.timestamp}</span>
                        </div>
                        <p>{message.content}</p>
                        {message.sender !== "client" && (
                          <div className="text-xs mt-1 text-right">{message.isRead ? "تم القراءة" : ""}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="اكتب رسالتك هنا..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
