"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Filter, Download, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth, type EntityType, type RoleType } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"
import { usersAPI, customersAPI } from "@/lib/api"

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    entity: "PRO" as EntityType,
    role: "DATA_ENTRY" as RoleType,
    entityId: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load users and related data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load users from API
        const usersResult = await usersAPI.getAll()
        if (usersResult.success) {
          setUsers(usersResult.data || [])
        } else {
          console.error('Failed to load users:', usersResult.error)
          toast({
            title: "خطأ في تحميل المستخدمين",
            description: "فشل في تحميل بيانات المستخدمين",
            variant: "destructive",
          })
          // Fallback to localStorage if API fails
          const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
          setUsers(storedUsers)
        }

        // Load customers for entity selection
        const customersResult = await customersAPI.getAll()
        if (customersResult.success) {
          setClients(customersResult.data || [])
        } else {
          // Fallback to localStorage
          const storedClients = JSON.parse(localStorage.getItem("customers") || "[]")
          setClients(storedClients)
        }

        // Load suppliers (fallback to localStorage for now)
        const storedSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]")
        setSuppliers(storedSuppliers)

      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "خطأ في الاتصال",
          description: "فشل في الاتصال بالخادم",
          variant: "destructive",
        })
        // Fallback to localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
        const storedClients = JSON.parse(localStorage.getItem("customers") || "[]")
        const storedSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]")
        setUsers(storedUsers)
        setClients(storedClients)
        setSuppliers(storedSuppliers)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddUser = async () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    if ((newUser.entity === "CLIENT" || newUser.entity === "SUPPLIER") && !newUser.entityId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار الشركة",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Create user via API
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        entity: newUser.entity,
        role: newUser.role,
        entityId: newUser.entityId || undefined,
      }

      const result = await usersAPI.create(userData)
      
      if (result.success) {
        // Add new user to local state
        const newUserWithId = {
          ...result.data,
          id: result.data._id || result.data.id
        }
        setUsers(prev => [...prev, newUserWithId])

        // Reset form
        setNewUser({
          name: "",
          email: "",
          password: "",
          entity: "PRO" as EntityType,
          role: "DATA_ENTRY" as RoleType,
          entityId: "",
        })
        setIsDialogOpen(false)

        toast({
          title: "تمت الإضافة بنجاح",
          description: `تم إضافة المستخدم ${newUser.name} بنجاح`,
        })
      } else {
        toast({
          title: "خطأ في إضافة المستخدم",
          description: result.error || "فشل في إضافة المستخدم",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding user:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      const result = await usersAPI.update(userId, { isActive })
      
      if (result.success) {
        // Update local state
        const updatedUsers = users.map((u) => {
          if (u.id === userId || u._id === userId) {
            return { ...u, isActive }
          }
          return u
        })
        setUsers(updatedUsers)

        toast({
          title: "تم تحديث الحالة",
          description: `تم ${isActive ? "تفعيل" : "تعطيل"} المستخدم بنجاح`,
        })
      } else {
        toast({
          title: "خطأ في تحديث الحالة",
          description: result.error || "فشل في تحديث حالة المستخدم",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const result = await usersAPI.delete(userId)
      
      if (result.success) {
        // Remove user from local state
        const updatedUsers = users.filter((u) => u.id !== userId && u._id !== userId)
        setUsers(updatedUsers)

        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المستخدم بنجاح",
        })
      } else {
        toast({
          title: "خطأ في حذف المستخدم",
          description: result.error || "فشل في حذف المستخدم",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    }
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesEntity = filterEntity === "all" || user.entity === filterEntity

    return matchesSearch && matchesRole && matchesEntity
  })

  // Get available roles based on selected entity
  const getAvailableRoles = () => {
    switch (newUser.entity) {
      case "PRO":
        return [
          { value: "GENERAL_MANAGER", label: "المدير العام" },
          { value: "CLEARANCE_MANAGER", label: "مدير التخليص" },
          { value: "OPERATIONS_MANAGER", label: "مدير العمليات" },
          { value: "TRANSLATOR", label: "مترجم" },
          { value: "CUSTOMS_BROKER", label: "مخلص جمركي" },
          { value: "DRIVER", label: "سائق" },
          { value: "ACCOUNTANT", label: "محاسب" },
          { value: "DATA_ENTRY", label: "مدخل بيانات" },
        ]
      case "CLIENT":
        return [
          { value: "CLIENT_MANAGER", label: "مدير" },
          { value: "CLIENT_SUPERVISOR", label: "مشرف" },
          { value: "CLIENT_DATA_ENTRY", label: "مدخل بيانات" },
        ]
      case "SUPPLIER":
        return [
          { value: "SUPPLIER_MANAGER", label: "مدير" },
          { value: "SUPPLIER_SUPERVISOR", label: "مشرف" },
          { value: "SUPPLIER_DATA_ENTRY", label: "مدخل بيانات" },
        ]
      default:
        return []
    }
  }

  // Helper function to display role name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      GENERAL_MANAGER: "المدير العام",
      CLEARANCE_MANAGER: "مدير التخليص",
      OPERATIONS_MANAGER: "مدير العمليات",
      TRANSLATOR: "مترجم",
      CUSTOMS_BROKER: "مخلص جمركي",
      DRIVER: "سائق",
      ACCOUNTANT: "محاسب",
      DATA_ENTRY: "مدخل بيانات",
      CLIENT_MANAGER: "مدير",
      CLIENT_SUPERVISOR: "مشرف",
      CLIENT_DATA_ENTRY: "مدخل بيانات",
      SUPPLIER_MANAGER: "مدير",
      SUPPLIER_SUPERVISOR: "مشرف",
      SUPPLIER_DATA_ENTRY: "مدخل بيانات",
    }
    return roleNames[role] || role
  }

  // Helper function to display entity name
  const getEntityDisplayName = (entity) => {
    const entityNames = {
      PRO: "شركة",
      CLIENT: "عميل",
      SUPPLIER: "مورد",
    }
    return entityNames[entity] || entity
  }

  // Helper function to get user initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={["admin", "GENERAL_MANAGER"]}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل المستخدمين...</p>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin", "GENERAL_MANAGER"]}>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="ml-2 h-4 w-4" />
                  إضافة مستخدم جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المستخدم الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="entity" className="text-right">
                      نوع الكيان
                    </Label>
                    <Select
                      value={newUser.entity}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, entity: value as EntityType, role: "DATA_ENTRY" as RoleType })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRO">شركة</SelectItem>
                        <SelectItem value="CLIENT">عميل</SelectItem>
                        <SelectItem value="SUPPLIER">مورد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      الدور
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value as RoleType })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(newUser.entity === "CLIENT" || newUser.entity === "SUPPLIER") && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entityId" className="text-right">
                        الشركة
                      </Label>
                      <Select
                        value={newUser.entityId}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, entityId: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الشركة" />
                        </SelectTrigger>
                        <SelectContent>
                          {(newUser.entity === "CLIENT" ? clients : suppliers).map((item) => (
                            <SelectItem key={item.id || item._id} value={item.id || item._id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="button" onClick={handleAddUser} disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإضافة..." : "إضافة"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="البحث في المستخدمين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="تصفية حسب الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="GENERAL_MANAGER">المدير العام</SelectItem>
                      <SelectItem value="OPERATIONS_MANAGER">مدير العمليات</SelectItem>
                      <SelectItem value="CLEARANCE_MANAGER">مدير التخليص</SelectItem>
                      <SelectItem value="TRANSLATOR">مترجم</SelectItem>
                      <SelectItem value="CUSTOMS_BROKER">مخلص جمركي</SelectItem>
                      <SelectItem value="DRIVER">سائق</SelectItem>
                      <SelectItem value="ACCOUNTANT">محاسب</SelectItem>
                      <SelectItem value="DATA_ENTRY">مدخل بيانات</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterEntity} onValueChange={setFilterEntity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="تصفية حسب الكيان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الكيانات</SelectItem>
                      <SelectItem value="PRO">شركة</SelectItem>
                      <SelectItem value="CLIENT">عميل</SelectItem>
                      <SelectItem value="SUPPLIER">مورد</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>نوع الكيان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id || user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getEntityDisplayName(user.entity)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "destructive"}>
                          {user.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleUpdateUserStatus(user.id || user._id, !user.isActive)}
                            >
                              {user.isActive ? "تعطيل" : "تفعيل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id || user._id)}
                              className="text-destructive"
                            >
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  )
}
