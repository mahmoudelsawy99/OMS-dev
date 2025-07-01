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

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    entity: "PRO" as EntityType,
    role: "DATA_ENTRY" as RoleType,
    entityId: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clients, setClients] = useState([])
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    // تحميل المستخدمين
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(storedUsers)

    // تحميل العملاء والموردين للاختيار من بينهم عند إنشاء مستخدم جديد
    const storedClients = JSON.parse(localStorage.getItem("customers") || "[]")
    setClients(storedClients)

    const storedSuppliers = JSON.parse(localStorage.getItem("suppliers") || "[]")
    setSuppliers(storedSuppliers)
  }, [])

  const handleAddUser = () => {
    // التحقق من صحة البيانات
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    // التحقق من وجود معرف الكيان إذا كان العميل أو المورد
    if ((newUser.entity === "CLIENT" || newUser.entity === "SUPPLIER") && !newUser.entityId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار الشركة",
        variant: "destructive",
      })
      return
    }

    // إنشاء معرف فريد للمستخدم الجديد
    const newId = `U${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    // إنشاء كائن المستخدم الجديد
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      entity: newUser.entity,
      role: newUser.role,
      entityId: newUser.entityId || undefined,
    }

    // إضافة المستخدم إلى قائمة المستخدمين
    const updatedUsers = [...users, userToAdd]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // إعادة تعيين نموذج إضافة المستخدم
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
  }

  const handleUpdateUserStatus = (userId, isActive) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return { ...u, isActive }
      }
      return u
    })
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "تم تحديث الحالة",
      description: `تم ${isActive ? "تفعيل" : "تعطيل"} المستخدم بنجاح`,
    })
  }

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((u) => u.id !== userId)
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف المستخدم بنجاح",
    })
  }

  // تصفية المستخدمين بناءً على البحث والفلاتر
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === "all" || user.role === filterRole
    const matchesEntity = filterEntity === "all" || user.entity === filterEntity

    return matchesSearch && matchesRole && matchesEntity
  })

  // تحديث أدوار المستخدم بناءً على نوع الكيان المحدد
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

  // دالة مساعدة لعرض اسم الدور بشكل مناسب
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
      CLIENT_MANAGER: "مدير (عميل)",
      CLIENT_SUPERVISOR: "مشرف (عميل)",
      CLIENT_DATA_ENTRY: "مدخل بيانات (عميل)",
      SUPPLIER_MANAGER: "مدير (مورد)",
      SUPPLIER_SUPERVISOR: "مشرف (مورد)",
      SUPPLIER_DATA_ENTRY: "مدخل بيانات (مورد)",
    }
    return roleNames[role] || role
  }

  // دالة مساعدة لعرض اسم الكيان بشكل مناسب
  const getEntityDisplayName = (entity) => {
    const entityNames = {
      PRO: "شركتنا",
      CLIENT: "عميل",
      SUPPLIER: "مورد",
    }
    return entityNames[entity] || entity
  }

  // دالة مساعدة للحصول على الأحرف الأولى من اسم المستخدم
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <ProtectedRoute>
      <RoleGuard permissions={["VIEW_USERS"]}>
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
            <RoleGuard permissions={["CREATE_USER"]}>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة مستخدم
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات المستخدم الجديد. سيتم إرسال بريد إلكتروني للمستخدم بتفاصيل الحساب.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right col-span-1">
                        الاسم
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right col-span-1">
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entity" className="text-right col-span-1">
                        الكيان
                      </Label>
                      <Select
                        value={newUser.entity}
                        onValueChange={(value) => {
                          // عند تغيير الكيان، نعيد تعيين الدور والمعرف
                          setNewUser({
                            ...newUser,
                            entity: value as EntityType,
                            role:
                              value === "PRO"
                                ? "DATA_ENTRY"
                                : value === "CLIENT"
                                  ? "CLIENT_DATA_ENTRY"
                                  : "SUPPLIER_DATA_ENTRY",
                            entityId: "",
                          })
                        }}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الكيان" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRO">شركتنا</SelectItem>
                          <SelectItem value="CLIENT">عميل</SelectItem>
                          <SelectItem value="SUPPLIER">مورد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* عرض قائمة الشركات إذا كان الكيان عميل أو مورد */}
                    {(newUser.entity === "CLIENT" || newUser.entity === "SUPPLIER") && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="entityId" className="text-right col-span-1">
                          الشركة
                        </Label>
                        <Select
                          value={newUser.entityId}
                          onValueChange={(value) => setNewUser({ ...newUser, entityId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الشركة" />
                          </SelectTrigger>
                          <SelectContent>
                            {newUser.entity === "CLIENT"
                              ? clients.map((client) => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))
                              : suppliers.map((supplier) => (
                                  <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right col-span-1">
                        الدور
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value as RoleType })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الدور" />
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right col-span-1">
                        كلمة المرور
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddUser}>
                      إضافة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </RoleGuard>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث باسم المستخدم أو البريد الإلكتروني"
                    className="pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="جميع الأدوار" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الأدوار</SelectItem>
                        <SelectItem value="GENERAL_MANAGER">المدير العام</SelectItem>
                        <SelectItem value="OPERATIONS_MANAGER">مدير العمليات</SelectItem>
                        <SelectItem value="CLEARANCE_MANAGER">مدير التخليص</SelectItem>
                        <SelectItem value="DATA_ENTRY">مدخل بيانات</SelectItem>
                        <SelectItem value="CLIENT_MANAGER">مدير (عميل)</SelectItem>
                        <SelectItem value="SUPPLIER_MANAGER">مدير (مورد)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={filterEntity} onValueChange={setFilterEntity}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="جميع الكيانات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الكيانات</SelectItem>
                        <SelectItem value="PRO">شركتنا</SelectItem>
                        <SelectItem value="CLIENT">عميل</SelectItem>
                        <SelectItem value="SUPPLIER">مورد</SelectItem>
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

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">الدور</TableHead>
                      <TableHead className="text-right">الكيان</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <TableRow key={u.id} className="hover:bg-slate-50">
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={u.name} />
                              <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getRoleDisplayName(u.role)}</Badge>
                          </TableCell>
                          <TableCell>{getEntityDisplayName(u.entity)}</TableCell>
                          <TableCell>
                            <RoleGuard permissions={["EDIT_USER", "DELETE_USER"]}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">فتح القائمة</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                  <RoleGuard permissions={["EDIT_USER"]}>
                                    <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                                    <DropdownMenuItem>تعديل</DropdownMenuItem>
                                    <DropdownMenuItem>إعادة تعيين كلمة المرور</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleUpdateUserStatus(u.id, !u.isActive)}>
                                      {u.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
                                    </DropdownMenuItem>
                                  </RoleGuard>
                                  <RoleGuard permissions={["DELETE_USER"]}>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(u.id)}>
                                      حذف
                                    </DropdownMenuItem>
                                  </RoleGuard>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </RoleGuard>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          لا توجد نتائج مطابقة لمعايير البحث
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  )
}
