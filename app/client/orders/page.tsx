"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, MoreHorizontal, ChevronsUpDown, Search, Filter, Download, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ordersAPI } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function ClientOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
            services: order.services || [],
            status: order.status || "قيد المراجعة",
            creationDate: order.createdAt 
              ? new Date(order.createdAt).toLocaleDateString('ar-SA')
              : "غير محدد",
            totalAmount: order.totalAmount || "غير محدد",
            trackingNumber: order.trackingNumber || `TRK${order._id?.slice(-6) || '000000'}`,
            clientName: order.clientName || order.client?.name || "غير محدد",
          }))
          
          setOrders(transformedOrders)
        } else {
          console.error('Failed to load orders:', result.error)
          
          // Fallback to localStorage
          const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
          const transformedStoredOrders = storedOrders.map(order => ({
            id: order.id,
            services: order.services || [],
            status: order.status || "قيد المراجعة",
            creationDate: order.creationDate || "غير محدد",
            totalAmount: order.totalAmount || "غير محدد",
            trackingNumber: order.trackingNumber || `TRK${order.id?.slice(-6) || '000000'}`,
            clientName: order.clientName || "غير محدد",
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
            services: order.services || [],
            status: order.status || "قيد المراجعة",
            creationDate: order.creationDate || "غير محدد",
            totalAmount: order.totalAmount || "غير محدد",
            trackingNumber: order.trackingNumber || `TRK${order.id?.slice(-6) || '000000'}`,
            clientName: order.clientName || "غير محدد",
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
      case "قيد التنفيذ":
        return <Badge className="bg-amber-100 text-amber-800">{status}</Badge>
      case "مكتمل":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>
      case "مرفوض":
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>
      case "بانتظار مستندات إضافية":
        return <Badge className="bg-purple-100 text-purple-800">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Filter orders based on search term, status, and service
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesService = filterService === "all" || order.services.includes(filterService)

    return matchesSearch && matchesStatus && matchesService
  })

  // Sort filtered orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue, bValue

    if (
      sortColumn === "id" ||
      sortColumn === "status" ||
      sortColumn === "creationDate" ||
      sortColumn === "trackingNumber"
    ) {
      aValue = a[sortColumn]
      bValue = b[sortColumn]
    } else if (sortColumn === "services") {
      aValue = a.services.map((s) => getServiceName(s)).join(", ")
      bValue = b.services.map((s) => getServiceName(s)).join(", ")
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate orders
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const result = await ordersAPI.getAll()
      if (result.success) {
        const transformedOrders = result.data.map(order => ({
          id: order._id || order.id,
          services: order.services || [],
          status: order.status || "قيد المراجعة",
          creationDate: order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString('ar-SA')
            : "غير محدد",
          totalAmount: order.totalAmount || "غير محدد",
          trackingNumber: order.trackingNumber || `TRK${order._id?.slice(-6) || '000000'}`,
          clientName: order.clientName || order.client?.name || "غير محدد",
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

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg">جاري تحميل الطلبات...</p>
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">{error}</p>
          <Button onClick={handleRefresh}>إعادة المحاولة</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button onClick={() => router.push("/client/orders/new")}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء طلب جديد
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث برقم الطلب أو رقم التتبع أو اسم العميل"
                className="pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="جميع الحالات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                    <SelectItem value="مكتمل">مكتمل</SelectItem>
                    <SelectItem value="مرفوض">مرفوض</SelectItem>
                    <SelectItem value="بانتظار مستندات إضافية">بانتظار مستندات إضافية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterService} onValueChange={setFilterService}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="جميع الخدمات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الخدمات</SelectItem>
                    <SelectItem value="import">تخليص وارد</SelectItem>
                    <SelectItem value="export">تخليص صادر</SelectItem>
                    <SelectItem value="shipping">شحن</SelectItem>
                    <SelectItem value="transport">نقل</SelectItem>
                    <SelectItem value="storage">تخزين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("id")}>
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      رقم الطلب
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("services")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      نوع الخدمة
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      حالة الطلب
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("creationDate")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      تاريخ الإنشاء
                    </div>
                  </TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("trackingNumber")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      رقم التتبع
                    </div>
                  </TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Link href={`/client/orders/${order.id}`} className="text-blue-600 hover:underline">
                          {order.id}
                        </Link>
                      </TableCell>
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
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>{order.trackingNumber}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/client/orders/${order.id}`)}>
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>تتبع الشحنة</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 ml-2" />
                              طباعة الفاتورة
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {loading ? "جاري التحميل..." : "لا توجد طلبات متطابقة مع معايير البحث"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {sortedOrders.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            عرض {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedOrders.length)} من أصل {sortedOrders.length} طلب
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber

                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink isActive={currentPage === pageNumber} onClick={() => handlePageChange(pageNumber)}>
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
