"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, MapPin, RefreshCw } from "lucide-react"
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
import { vehiclesAPI } from "@/lib/api"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    type: "تريلا",
    model: "",
    plateNumber: "",
    driver: "",
    location: "الرياض",
  })

  // Load vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to load from API first
        const result = await vehiclesAPI.getAll()
        
        if (result.success) {
          // Transform API data to match frontend format
          const transformedVehicles = result.data.map(vehicle => ({
            id: vehicle._id || vehicle.id,
            type: vehicle.type || "تريلا",
            model: vehicle.model || "غير محدد",
            plateNumber: vehicle.plateNumber || "غير محدد",
            status: vehicle.status || "available",
            driver: vehicle.driver || vehicle.driverName || "غير محدد",
            location: vehicle.location || "الرياض",
          }))
          
          setVehicles(transformedVehicles)
        } else {
          console.error('Failed to load vehicles:', result.error)
          
          // Fallback to localStorage
          const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
          const transformedStoredVehicles = storedVehicles.map(vehicle => ({
            id: vehicle.id,
            type: vehicle.type || "تريلا",
            model: vehicle.model || "غير محدد",
            plateNumber: vehicle.plateNumber || "غير محدد",
            status: vehicle.status || "available",
            driver: vehicle.driver || "غير محدد",
            location: vehicle.location || "الرياض",
          }))
          
          setVehicles(transformedStoredVehicles)
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        setError("فشل في تحميل المركبات")
        
        // Fallback to localStorage
        try {
          const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
          const transformedStoredVehicles = storedVehicles.map(vehicle => ({
            id: vehicle.id,
            type: vehicle.type || "تريلا",
            model: vehicle.model || "غير محدد",
            plateNumber: vehicle.plateNumber || "غير محدد",
            status: vehicle.status || "available",
            driver: vehicle.driver || "غير محدد",
            location: vehicle.location || "الرياض",
          }))
          
          setVehicles(transformedStoredVehicles)
        } catch (localStorageError) {
          console.error("Error loading from localStorage:", localStorageError)
          setError("فشل في تحميل المركبات من التخزين المحلي")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const result = await vehiclesAPI.getAll()
      if (result.success) {
        const transformedVehicles = result.data.map(vehicle => ({
          id: vehicle._id || vehicle.id,
          type: vehicle.type || "تريلا",
          model: vehicle.model || "غير محدد",
          plateNumber: vehicle.plateNumber || "غير محدد",
          status: vehicle.status || "available",
          driver: vehicle.driver || vehicle.driverName || "غير محدد",
          location: vehicle.location || "الرياض",
        }))
        setVehicles(transformedVehicles)
        toast({
          title: "تم التحديث",
          description: "تم تحديث قائمة المركبات بنجاح",
        })
      }
    } catch (error) {
      console.error("Error refreshing vehicles:", error)
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث قائمة المركبات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddVehicle = async () => {
    if (!newVehicle.model || !newVehicle.plateNumber || !newVehicle.driver) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const vehicleData = {
      type: newVehicle.type,
      model: newVehicle.model,
      plateNumber: newVehicle.plateNumber,
      driver: newVehicle.driver,
      location: newVehicle.location,
      status: "available",
    }

    try {
      const result = await vehiclesAPI.create(vehicleData)
      
      if (result.success) {
        const newVehicleData = {
          id: result.data._id || result.data.id,
          ...vehicleData,
        }
        
        setVehicles([...vehicles, newVehicleData])
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
          description: `تم إضافة المركبة ${newVehicleData.plateNumber} بنجاح`,
        })
      } else {
        toast({
          title: "خطأ في الإضافة",
          description: result.error || "فشل في إضافة المركبة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding vehicle:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
      
      // Fallback to localStorage
      const vehicleId = `V${(vehicles.length + 1).toString().padStart(3, "0")}`
      const vehicleToAdd = {
        id: vehicleId,
        ...vehicleData,
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

      // Save to localStorage
      try {
        const storedVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]")
        localStorage.setItem("vehicles", JSON.stringify([...storedVehicles, vehicleToAdd]))
      } catch (localStorageError) {
        console.error("Error saving to localStorage:", localStorageError)
      }

      toast({
        title: "تمت الإضافة بنجاح (محلي)",
        description: `تم إضافة المركبة ${vehicleToAdd.plateNumber} إلى التخزين المحلي`,
      })
    }
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

  if (loading && vehicles.length === 0) {
    return (
      <ProtectedRoute>
        <RoleGuard permissions={["DRIVE_VEHICLES"]} fallback={<AccessDenied />}>
          <div className="container mx-auto flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg">جاري تحميل المركبات...</p>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    )
  }

  if (error && vehicles.length === 0) {
    return (
      <ProtectedRoute>
        <RoleGuard permissions={["DRIVE_VEHICLES"]} fallback={<AccessDenied />}>
          <div className="container mx-auto flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <p className="text-lg text-red-600">{error}</p>
              <Button onClick={handleRefresh}>إعادة المحاولة</Button>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <RoleGuard permissions={["DRIVE_VEHICLES"]} fallback={<AccessDenied />}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold">إدارة المركبات</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
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
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleAddVehicle}>إضافة المركبة</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2">{vehicles.length}</div>
                <CardTitle className="text-lg">إجمالي المركبات</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-green-600">
                  {vehicles.filter((v) => v.status === "available").length}
                </div>
                <CardTitle className="text-lg">متاح</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-blue-600">
                  {vehicles.filter((v) => v.status === "in_transit").length}
                </div>
                <CardTitle className="text-lg">في مهمة</CardTitle>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold mb-2 text-amber-600">
                  {vehicles.filter((v) => v.status === "maintenance").length}
                </div>
                <CardTitle className="text-lg">صيانة</CardTitle>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>قائمة المركبات</CardTitle>
                <div className="relative mt-4 md:mt-0">
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
                      <TableHead className="text-right">نوع المركبة</TableHead>
                      <TableHead className="text-right">الموديل</TableHead>
                      <TableHead className="text-right">رقم اللوحة</TableHead>
                      <TableHead className="text-right">السائق</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {vehicle.location}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                                <DropdownMenuItem>تعديل المركبة</DropdownMenuItem>
                                <DropdownMenuItem>تتبع الموقع</DropdownMenuItem>
                                <DropdownMenuItem>جدولة صيانة</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {loading ? "جاري التحميل..." : "لا توجد مركبات متطابقة مع معايير البحث"}
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
