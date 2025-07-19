"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { customersAPI } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  type: "individual" | "company"
  address: {
    street: string
    city: string
    country: string
  }
  contactPerson?: {
    name: string
    phone: string
  }
  taxId?: string
  idNumber?: string
  createdAt: string
  updatedAt: string
}

export default function MigratedCustomersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "individual" | "company">("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch customers with proper error handling
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

  // Filter customers based on search and type
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    
    const matchesType = filterType === "all" || customer.type === filterType
    
    return matchesSearch && matchesType
  })

  // Get customer type badge
  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case "individual":
        return <Badge variant="secondary">فرد</Badge>
      case "company":
        return <Badge variant="default">شركة</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">العملاء</h1>
            <p className="text-muted-foreground">
              إدارة العملاء والمعلومات الخاصة بهم
            </p>
          </div>
          <RoleGuard permissions={["customers.create"]}>
            <Button onClick={() => router.push("/customers/add")}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة عميل
            </Button>
          </RoleGuard>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="البحث في العملاء..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                >
                  الكل
                </Button>
                <Button
                  variant={filterType === "individual" ? "default" : "outline"}
                  onClick={() => setFilterType("individual")}
                >
                  أفراد
                </Button>
                <Button
                  variant={filterType === "company" ? "default" : "outline"}
                  onClick={() => setFilterType("company")}
                >
                  شركات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <div className="grid gap-4">
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== "all" 
                      ? "لا توجد نتائج للبحث المحدد"
                      : "لا يوجد عملاء حتى الآن"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => (
              <Card key={customer._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        {getCustomerTypeBadge(customer.type)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">البريد الإلكتروني:</span> {customer.email}
                        </div>
                        <div>
                          <span className="font-medium">الهاتف:</span> {customer.phone}
                        </div>
                        <div>
                          <span className="font-medium">المدينة:</span> {customer.address.city}
                        </div>
                        <div>
                          <span className="font-medium">تاريخ الإنشاء:</span> {formatDate(customer.createdAt)}
                        </div>
                      </div>
                      {customer.contactPerson && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">الشخص المسؤول:</span> {customer.contactPerson.name}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <RoleGuard permissions={["customers.read"]}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/customers/${customer._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                      <RoleGuard permissions={["customers.update"]}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/customers/${customer._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                      <RoleGuard permissions={["customers.delete"]}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer._id)}
                          disabled={deletingId === customer._id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          إجمالي العملاء: {customers.length} | 
          النتائج المعروضة: {filteredCustomers.length}
        </div>
      </div>
    </ProtectedRoute>
  )
} 