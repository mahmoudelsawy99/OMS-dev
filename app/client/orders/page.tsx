"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, MoreHorizontal, ChevronsUpDown, Search, Filter, Download } from "lucide-react"
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

export default function ClientOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterService, setFilterService] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Mock data for client orders
    const mockOrders = [
      {
        id: "OP00012",
        services: ["shipping"],
        status: "قيد التنفيذ",
        creationDate: "٢٥/٠٣/١٤٤٥",
        totalAmount: "1,500 ريال",
        trackingNumber: "TRK123456",
      },
      {
        id: "OP00011",
        services: ["import"],
        status: "مكتمل",
        creationDate: "٢٤/٠٣/١٤٤٥",
        totalAmount: "3,200 ريال",
        trackingNumber: "TRK123455",
      },
      {
        id: "OP00010",
        services: ["transport"],
        status: "مكتمل",
        creationDate: "٢٣/٠٣/١٤٤٥",
        totalAmount: "800 ريال",
        trackingNumber: "TRK123454",
      },
      {
        id: "OP00009",
        services: ["export"],
        status: "مرفوض",
        creationDate: "٢٢/٠٣/١٤٤٥",
        totalAmount: "2,100 ريال",
        trackingNumber: "TRK123453",
      },
      {
        id: "OP00008",
        services: ["import", "transport"],
        status: "بانتظار مستندات إضافية",
        creationDate: "٢١/٠٣/١٤٤٥",
        totalAmount: "4,500 ريال",
        trackingNumber: "TRK123452",
      },
      {
        id: "OP00007",
        services: ["shipping"],
        status: "قيد المراجعة",
        creationDate: "٢٠/٠٣/١٤٤٥",
        totalAmount: "1,800 ريال",
        trackingNumber: "TRK123451",
      },
      {
        id: "OP00006",
        services: ["transport"],
        status: "مكتمل",
        creationDate: "١٩/٠٣/١٤٤٥",
        totalAmount: "950 ريال",
        trackingNumber: "TRK123450",
      },
      {
        id: "OP00005",
        services: ["import"],
        status: "مكتمل",
        creationDate: "١٨/٠٣/١٤٤٥",
        totalAmount: "2,700 ريال",
        trackingNumber: "TRK123449",
      },
      {
        id: "OP00004",
        services: ["export"],
        status: "مكتمل",
        creationDate: "١٧/٠٣/١٤٤٥",
        totalAmount: "1,950 ريال",
        trackingNumber: "TRK123448",
      },
      {
        id: "OP00003",
        services: ["shipping", "transport"],
        status: "مكتمل",
        creationDate: "١٦/٠٣/١٤٤٥",
        totalAmount: "3,100 ريال",
        trackingNumber: "TRK123447",
      },
      {
        id: "OP00002",
        services: ["import"],
        status: "مكتمل",
        creationDate: "١٥/٠٣/١٤٤٥",
        totalAmount: "2,300 ريال",
        trackingNumber: "TRK123446",
      },
      {
        id: "OP00001",
        services: ["transport"],
        status: "مكتمل",
        creationDate: "١٤/٠٣/١٤٤٥",
        totalAmount: "750 ريال",
        trackingNumber: "TRK123445",
      },
    ]

    setOrders(mockOrders)
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
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">طلباتي</h1>
        <Button onClick={() => router.push("/client/orders/new")}>
          <Plus className="h-4 w-4 ml-2" />
          إنشاء طلب جديد
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث برقم الطلب أو رقم التتبع"
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
                      لا توجد طلبات متطابقة مع معايير البحث
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
