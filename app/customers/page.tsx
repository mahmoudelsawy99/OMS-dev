"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { customersAPI } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

type Customer = {
  _id: string
  name: string
  type: "individual" | "company"
  phone: string
  email: string
  address: {
    street: string
    city: string
    country: string
  }
  contactPerson?: {
    name: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

export default function CustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState("10")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const result = await customersAPI.getAll()
      if (result.success) {
        setCustomers(result.data)
      } else {
        toast({
          title: "خطأ في تحميل العملاء",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Delete customer with optimistic update
  const handleDeleteCustomer = async (customerId: string) => {
    // Optimistic update
    const customerToDelete = customers.find(c => c._id === customerId)
    setCustomers(prev => prev.filter(c => c._id !== customerId))
    setDeletingId(customerId)

    try {
      const result = await customersAPI.delete(customerId)
      if (result.success) {
        toast({
          title: "تم حذف العميل",
          description: "تم حذف العميل بنجاح",
        })
      } else {
        // Revert on error
        if (customerToDelete) {
          setCustomers(prev => [...prev, customerToDelete])
        }
        toast({
          title: "خطأ في حذف العميل",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      // Revert on error
      if (customerToDelete) {
        setCustomers(prev => [...prev, customerToDelete])
      }
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2">جاري تحميل العملاء...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">العملاء</h1>
          <RoleGuard permissions={["customers.create"]}>
            <Link href="/customers/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> إضافة عميل
              </Button>
            </Link>
          </RoleGuard>
        </div>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <span className="mr-2">إظهار</span>
            <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="ml-2">سجلات</span>
          </div>
          <div className="flex items-center w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            <Input
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>
        <div className="border rounded-lg overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px] font-bold">كود العميل</TableHead>
                <TableHead className="font-bold">اسم العميل</TableHead>
                <TableHead className="font-bold hidden md:table-cell">نوع العميل</TableHead>
                <TableHead className="font-bold hidden md:table-cell">رقم الجوال</TableHead>
                <TableHead className="font-bold hidden md:table-cell">البريد الإلكتروني</TableHead>
                <TableHead className="text-right font-bold">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? "لا توجد نتائج للبحث المحدد" : "لا يوجد عملاء حتى الآن"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.slice(0, Number.parseInt(entriesPerPage)).map((customer) => (
                  <TableRow key={customer._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <Link href={`/customers/${customer._id}`} className="text-blue-600 hover:underline">
                        {customer._id.slice(-6).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer._id}`} className="text-blue-600 hover:underline">
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {customer.type === "individual" ? "فرد" : "شركة"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <RoleGuard permissions={["customers.read"]}>
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                عرض التفاصيل
                              </Link>
                            </DropdownMenuItem>
                          </RoleGuard>
                          <RoleGuard permissions={["customers.update"]}>
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                تعديل
                              </Link>
                            </DropdownMenuItem>
                          </RoleGuard>
                          <DropdownMenuSeparator />
                          <RoleGuard permissions={["customers.delete"]}>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCustomer(customer._id)}
                              disabled={deletingId === customer._id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deletingId === customer._id ? "جاري الحذف..." : "حذف"}
                            </DropdownMenuItem>
                          </RoleGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          إظهار {Math.min(filteredCustomers.length, Number.parseInt(entriesPerPage))} من أصل {filteredCustomers.length}{" "}
          سجل
        </div>
      </div>
    </ProtectedRoute>
  )
}
