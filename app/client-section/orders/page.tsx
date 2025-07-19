"use client"

import { useState, useEffect } from "react"
import { ArrowDown, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"
import { ordersAPI } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

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

export default function ClientSectionOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Load orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to load from API first
        const result = await ordersAPI.getAll()
        
        if (result.success) {
          // Transform API data to match frontend format
          const transformedOrders = result.data.map(order => ({
            id: order._id || order.id,
            policyNumber: order.policies?.[0]?.policyNumber || `POL-${order._id?.slice(-5) || '00000'}`,
            clientName: order.clientName || order.client?.name || "غير محدد",
            serviceType: order.services?.map(service => {
              const serviceNames = {
                import: "تخليص جمركي",
                export: "تخليص جمركي",
                shipping: "شحن",
                transport: "نقل",
                storage: "تخزين",
              }
              return serviceNames[service] || service
            }).join(" - ") || "غير محدد",
            status: order.status || "قيد المراجعة",
            createdAt: order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString('ar-SA')
              : "غير محدد",
          }))
          
          setOrders(transformedOrders)
        } else {
          console.error('Failed to load orders:', result.error)
          
          // Fallback to localStorage
          const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
          const transformedStoredOrders = storedOrders.map(order => ({
            id: order.id,
            policyNumber: order.policies?.[0]?.policyNumber || `POL-${order.id?.slice(-5) || '00000'}`,
            clientName: order.clientName || "غير محدد",
            serviceType: order.services?.map(service => {
              const serviceNames = {
                import: "تخليص جمركي",
                export: "تخليص جمركي",
                shipping: "شحن",
                transport: "نقل",
                storage: "تخزين",
              }
              return serviceNames[service] || service
            }).join(" - ") || "غير محدد",
            status: order.status || "قيد المراجعة",
            createdAt: order.creationDate || "غير محدد",
          }))
          
          setOrders(transformedStoredOrders)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("فشل في تحميل الطلبات")
        
        // Fallback to localStorage
        try {
          const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
          const transformedStoredOrders = storedOrders.map(order => ({
            id: order.id,
            policyNumber: order.policies?.[0]?.policyNumber || `POL-${order.id?.slice(-5) || '00000'}`,
            clientName: order.clientName || "غير محدد",
            serviceType: order.services?.map(service => {
              const serviceNames = {
                import: "تخليص جمركي",
                export: "تخليص جمركي",
                shipping: "شحن",
                transport: "نقل",
                storage: "تخزين",
              }
              return serviceNames[service] || service
            }).join(" - ") || "غير محدد",
            status: order.status || "قيد المراجعة",
            createdAt: order.creationDate || "غير محدد",
          }))
          
          setOrders(transformedStoredOrders)
        } catch (localStorageError) {
          console.error("Error loading from localStorage:", localStorageError)
          setError("فشل في تحميل الطلبات من التخزين المحلي")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const result = await ordersAPI.getAll()
      if (result.success) {
        const transformedOrders = result.data.map(order => ({
          id: order._id || order.id,
          policyNumber: order.policies?.[0]?.policyNumber || `POL-${order._id?.slice(-5) || '00000'}`,
          clientName: order.clientName || order.client?.name || "غير محدد",
          serviceType: order.services?.map(service => {
            const serviceNames = {
              import: "تخليص جمركي",
              export: "تخليص جمركي",
              shipping: "شحن",
              transport: "نقل",
              storage: "تخزين",
            }
            return serviceNames[service] || service
          }).join(" - ") || "غير محدد",
          status: order.status || "قيد المراجعة",
          createdAt: order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString('ar-SA')
            : "غير محدد",
        }))
        setOrders(transformedOrders)
        toast({
          title: "تم التحديث",
          description: "تم تحديث قائمة الطلبات بنجاح",
        })
      }
    } catch (error) {
      console.error("Error refreshing orders:", error)
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث قائمة الطلبات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    return selectedStatus === "all" || order.status === selectedStatus
  })

  if (loading && orders.length === 0) {
    return (
      <ProtectedRoute>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg">جاري تحميل الطلبات...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && orders.length === 0) {
    return (
      <ProtectedRoute>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-lg text-red-600">{error}</p>
            <Button onClick={handleRefresh}>إعادة المحاولة</Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-gray-600">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
                <SelectItem value="بانتظار مستندات إضافية">بانتظار مستندات إضافية</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="option1">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حسب النظام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">حسب النظام</SelectItem>
                <SelectItem value="option2">الخيار الثاني</SelectItem>
                <SelectItem value="option3">الخيار الثالث</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-7 gap-4 p-4 border-b text-sm font-medium text-gray-500">
            <div className="text-center">الإعدادات</div>
            <div className="flex items-center justify-end gap-1">
              تاريخ الإنشاء
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">
              حالة الطلب
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">نوع الخدمة</div>
            <div className="flex items-center justify-end gap-1">
              اسم العميل
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">رقم البوليصة</div>
            <div className="flex items-center justify-end gap-1">
              رقم الطلب
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          <div className="divide-y">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-7 gap-4 p-4 text-sm hover:bg-gray-50">
                  <div className="text-center">...</div>
                  <div className="text-end">{order.createdAt}</div>
                  <div className="text-end">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-end">{order.serviceType}</div>
                  <div className="text-end font-medium">{order.clientName}</div>
                  <div className="text-end text-gray-500">
                    <button
                      onClick={() => (window.location.href = `/client-section/orders/details/${order.id}?view=client`)}
                      className="hover:underline cursor-pointer"
                    >
                      {order.policyNumber}
                    </button>
                  </div>
                  <div className="text-end text-blue-600">
                    <button
                      onClick={() => (window.location.href = `/client-section/orders/details/${order.id}?view=client`)}
                      className="hover:underline cursor-pointer"
                    >
                      {order.id}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {loading ? "جاري التحميل..." : "لا توجد طلبات متطابقة مع المعايير المحددة"}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
