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

export default function ClientShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState([])
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    // Mock data for client shipments
    const mockShipments = [
      {
        id: "SH00012",
        policyNumber: "POL-5678",
        type: "air",
        status: "in_transit",
        origin: "الرياض",
        destination: "دبي",
        creationDate: "٢٥/٠٣/١٤٤٥",
        estimatedDelivery: "٣٠/٠٣/١٤٤٥",
        weight: "25 كجم",
        trackingNumber: "TRK123456",
      },
      {
        id: "SH00011",
        policyNumber: "POL-5677",
        type: "sea",
        status: "delivered",
        origin: "جدة",
        destination: "شنغهاي",
        creationDate: "٢٤/٠٣/١٤٤٥",
        estimatedDelivery: "١٠/٠٤/١٤٤٥",
        weight: "500 كجم",
        trackingNumber: "TRK123455",
      },
      {
        id: "SH00010",
        policyNumber: "POL-5676",
        type: "land",
        status: "delivered",
        origin: "الدمام",
        destination: "الرياض",
        creationDate: "٢٣/٠٣/١٤٤٥",
        estimatedDelivery: "٢٥/٠٣/١٤٤٥",
        weight: "150 كجم",
        trackingNumber: "TRK123454",
      },
      {
        id: "SH00009",
        policyNumber: "POL-5675",
        type: "air",
        status: "processing",
        origin: "الرياض",
        destination: "القاهرة",
        creationDate: "٢٢/٠٣/١٤٤٥",
        estimatedDelivery: "٢٧/٠٣/١٤٤٥",
        weight: "30 كجم",
        trackingNumber: "TRK123453",
      },
      {
        id: "SH00008",
        policyNumber: "POL-5674",
        type: "sea",
        status: "in_transit",
        origin: "جدة",
        destination: "مومباي",
        creationDate: "٢١/٠٣/١٤٤٥",
        estimatedDelivery: "٠٥/٠٤/١٤٤٥",
        weight: "1200 كجم",
        trackingNumber: "TRK123452",
      },
      {
        id: "SH00007",
        policyNumber: "POL-5673",
        type: "air",
        status: "processing",
        origin: "الرياض",
        destination: "لندن",
        creationDate: "٢٠/٠٣/١٤٤٥",
        estimatedDelivery: "٢٦/٠٣/١٤٤٥",
        weight: "45 كجم",
        trackingNumber: "TRK123451",
      },
      {
        id: "SH00006",
        policyNumber: "POL-5672",
        type: "land",
        status: "delivered",
        origin: "الرياض",
        destination: "جدة",
        creationDate: "١٩/٠٣/١٤٤٥",
        estimatedDelivery: "٢١/٠٣/١٤٤٥",
        weight: "200 كجم",
        trackingNumber: "TRK123450",
      },
      {
        id: "SH00005",
        policyNumber: "POL-5671",
        type: "sea",
        status: "delivered",
        origin: "الدمام",
        destination: "روتردام",
        creationDate: "١٨/٠٣/١٤٤٥",
        estimatedDelivery: "٠١/٠٤/١٤٤٥",
        weight: "2500 كجم",
        trackingNumber: "TRK123449",
      },
    ]
    setShipments(mockShipments)
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getShipmentTypeName = (type) => {
    const typeNames = {
      air: "شحن جوي",
      sea: "شحن بحري",
      land: "شحن بري",
    }
    return typeNames[type] || type
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">قيد المعالجة</Badge>
      case "in_transit":
        return <Badge className="bg-amber-100 text-amber-800">في الطريق</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">تم التسليم</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800">متأخر</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Filter shipments based on search term, status, and type
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || shipment.status === filterStatus
    const matchesType = filterType === "all" || shipment.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  // Sort filtered shipments
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate shipments
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentShipments = sortedShipments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">شحناتي</h1>
        <Button onClick={() => router.push("/client/shipments/new")}>
          <Plus className="h-4 w-4 ml-2" />
          طلب شحنة جديدة
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث برقم الشحنة أو رقم التتبع"
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
                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                    <SelectItem value="in_transit">في الطريق</SelectItem>
                    <SelectItem value="delivered">تم التسليم</SelectItem>
                    <SelectItem value="delayed">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="جميع أنواع الشحن" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع أنواع الشحن</SelectItem>
                    <SelectItem value="air">شحن جوي</SelectItem>
                    <SelectItem value="sea">شحن بحري</SelectItem>
                    <SelectItem value="land">شحن بري</SelectItem>
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

      {/* Shipments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("id")}>
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      رقم الشحنة
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("policyNumber")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      رقم البوليصة
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-slate-50" onClick={() => handleSort("type")}>
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      نوع الشحن
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      الحالة
                    </div>
                  </TableHead>
                  <TableHead className="text-right">المسار</TableHead>
                  <TableHead
                    className="text-right cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSort("creationDate")}
                  >
                    <div className="flex items-center justify-end">
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                      تاريخ الإنشاء
                    </div>
                  </TableHead>
                  <TableHead className="text-right">الوزن</TableHead>
                  <TableHead className="text-right">رقم التتبع</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentShipments.length > 0 ? (
                  currentShipments.map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-slate-50">
                      <TableCell>
                        <Link href={`/client/shipments/${shipment.id}`} className="text-blue-600 hover:underline">
                          {shipment.id}
                        </Link>
                      </TableCell>
                      <TableCell>{shipment.policyNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getShipmentTypeName(shipment.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <span>{shipment.origin}</span>
                          <span className="mx-1">→</span>
                          <span>{shipment.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.creationDate}</TableCell>
                      <TableCell>{shipment.weight}</TableCell>
                      <TableCell>{shipment.trackingNumber}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/client/shipments/${shipment.id}`)}>
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>تتبع الشحنة</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 ml-2" />
                              طباعة بوليصة الشحن
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      لا توجد شحنات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {sortedShipments.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            عرض {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedShipments.length)} من أصل{" "}
            {sortedShipments.length} شحنة
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
