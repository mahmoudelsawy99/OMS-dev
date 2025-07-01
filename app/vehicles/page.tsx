"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, MapPin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProtectedRoute } from "@/components/protected-route"
import { RoleGuard } from "@/components/role-guard"
import { toast } from "@/hooks/use-toast"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: "V001",
      type: "تريلا",
      model: "مرسيدس",
      plateNumber: "ABC 1234",
      status: "available",
      driver: "أحمد محمد",
      location: "الرياض",
    },
    {
      id: "V002",
      type: "دينة",
      model: "ايسوزو",
      plateNumber: "DEF 5678",
      status: "in_transit",
      driver: "محمد علي",
      location: "جدة",
    },
    {
      id: "V003",
      type: "تريلا",
      model: "مان",
      plateNumber: "GHI 9012",
      status: "maintenance",
      driver: "خالد عبدالله",
      location: "الدمام",
    },
    {
      id: "V004",
      type: "دينة",
      model: "هينو",
      plateNumber: "JKL 3456",
      status: "available",
      driver: "سعد محمد",
      location: "الرياض",
    },
    {
      id: "V005",
      type: "تريلا",
      model: "فولفو",
      plateNumber: "MNO 7890",
      status: "in_transit",
      driver: "عبدالرحمن خالد",
      location: "مكة",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    type: "تريلا",
    model: "",
    plateNumber: "",
    driver: "",
    location: "الرياض",
  })

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddVehicle = () => {
    if (!newVehicle.model || !newVehicle.plateNumber || !newVehicle.driver) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const vehicleId = `V${(vehicles.length + 1).toString().padStart(3, "0")}`
    const vehicleToAdd = {
      id: vehicleId,
      ...newVehicle,
      status: "available",
    }

    setVehicles([...vehicles, vehicleToAdd])
    setNewVehicle({
      type: "تريلا",
      model: "",
      plateNumber: "",
      driver: "",
      location: "الرياض",
    })
    setIsDialogOpen(false)

    toast({
      title: "تمت الإضافة بنجاح",
      description: `تم إضافة المركبة ${vehicleToAdd.plateNumber} بنجاح`,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">متاح</Badge>
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800">في مهمة</Badge>
      case "maintenance":
        return <Badge className="bg-amber-100 text-amber-800">صيانة</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <RoleGuard permissions={["DRIVE_VEHICLES"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة المركبات</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مركبة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إضافة مركبة جديدة</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      نوع المركبة
                    </Label>
                    <Select
                      value={newVehicle.type}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر نوع المركبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تريلا">تريلا</SelectItem>
                        <SelectItem value="دينة">دينة</SelectItem>
                        <SelectItem value="شاحنة">شاحنة</SelectItem>
                        <SelectItem value="بيك أب">بيك أب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model" className="text-right">
                      الموديل
                    </Label>
                    <Input
                      id="model"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plateNumber" className="text-right">
                      رقم اللوحة
                    </Label>
                    <Input
                      id="plateNumber"
                      value={newVehicle.plateNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="driver" className="text-right">
                      السائق
                    </Label>
                    <Input
                      id="driver"
                      value={newVehicle.driver}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      الموقع
                    </Label>
                    <Select
                      value={newVehicle.location}
                      onValueChange={(value) => setNewVehicle({ ...newVehicle, location: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر الموقع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="جدة">جدة</SelectItem>
                        <SelectItem value="الدمام">الدمام</SelectItem>
                        <SelectItem value="مكة">مكة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddVehicle}>إضافة</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{vehicles.length}</div>
                <CardTitle className="text-lg">إجمالي المركبات</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{vehicles.filter((v) => v.status === "available").length}</div>
                <CardTitle className="text-lg">المركبات المتاحة</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">
                  {vehicles.filter((v) => v.status === "in_transit").length}
                </div>
                <CardTitle className="text-lg">المركبات في مهمة</CardTitle>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>قائمة المركبات</CardTitle>
                <div className="relative mt-2 md:mt-0">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث برقم اللوحة أو اسم السائق"
                    className="pr-10 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم المركبة</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">الموديل</TableHead>
                      <TableHead className="text-right">رقم اللوحة</TableHead>
                      <TableHead className="text-right">السائق</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-left">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium">{vehicle.id}</TableCell>
                          <TableCell>{vehicle.type}</TableCell>
                          <TableCell>{vehicle.model}</TableCell>
                          <TableCell>{vehicle.plateNumber}</TableCell>
                          <TableCell>{vehicle.driver}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                              {vehicle.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">فتح القائمة</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                                <DropdownMenuItem>تعديل</DropdownMenuItem>
                                <DropdownMenuItem>تغيير الحالة</DropdownMenuItem>
                                <DropdownMenuItem>تعيين مهمة</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
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

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h2 className="text-2xl font-bold mb-2">غير مصرح بالوصول</h2>
      <p className="text-muted-foreground mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
    </div>
  )
}
