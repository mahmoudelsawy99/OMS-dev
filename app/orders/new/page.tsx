"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, Upload, Search, ChevronRight, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CreateOrderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("client")
  const [selectedClient, setSelectedClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedServices, setSelectedServices] = useState([])
  const [documents, setDocuments] = useState([])
  const [shippingType, setShippingType] = useState("")
  const [transportType, setTransportType] = useState("")
  const [transportVehicle, setTransportVehicle] = useState("")
  const [transportTemperature, setTransportTemperature] = useState("")
  const [departureCity, setDepartureCity] = useState("")
  const [departureDistrict, setDepartureDistrict] = useState("")
  const [arrivalCity, setArrivalCity] = useState("")
  const [arrivalDistrict, setArrivalDistrict] = useState("")
  const [factoryContact, setFactoryContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })
  const [orderComplete, setOrderComplete] = useState(false)
  const [customers, setCustomers] = useState([])

  // Load customers from localStorage
  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    }
  }, [])

  // Filter clients based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  )

  // Handle service selection
  const toggleService = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  // Handle file upload
  const handleFileUpload = (type, files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      documentType: type,
    }))
    setDocuments([...documents, ...newFiles])
  }

  // Next step handler
  const handleNextStep = () => {
    const tabOrder = ["client", "services", "documents", "review"]
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
    }
  }

  // تعديل نموذج الطلب لإضافة حقل رقم البوليصة
  // Submit order handler
  const handleSubmitOrder = () => {
    // Generate a random order ID
    const orderId =
      "OP" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")

    // Generate a random policy number
    const policyNumber =
      "POL-" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")

    // Create order object
    const newOrder = {
      id: orderId,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      services: selectedServices,
      status: "قيد المراجعة",
      creationDate: new Date().toLocaleDateString("ar-SA"),
      documents: documents,
      shippingType,
      transportType,
      transportTemperature,
      departureCity,
      departureDistrict,
      arrivalCity,
      arrivalDistrict,
      factoryContact,
      policyNumber,
    }

    // In a real app, you would save this to your database
    // For now, we'll simulate by storing in localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]))

    setOrderComplete(true)
    toast({
      title: "تم إنشاء الطلب بنجاح",
      description: `رقم الطلب: ${orderId}`,
    })
  }

  // Redirect to orders page
  const goToOrdersPage = () => {
    router.push("/orders")
  }

  // Determine which documents to show based on selected services
  const getRequiredDocuments = () => {
    if (selectedServices.includes("shipping")) {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">نوع الشحن</h3>
            <RadioGroup value={shippingType} onValueChange={setShippingType} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fob" id="fob" />
                <Label htmlFor="fob" className="mr-2">
                  FOB (تسليم ظهر السفينة)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="door_to_door" id="door_to_door" />
                <Label htmlFor="door_to_door" className="mr-2">
                  Door to Door (من الباب إلى الباب)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {shippingType && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات التواصل مع المصنع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="factory_name">اسم المصنع / الشركة</Label>
                    <Input
                      id="factory_name"
                      value={factoryContact.name}
                      onChange={(e) => setFactoryContact({ ...factoryContact, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="factory_phone">رقم الهاتف</Label>
                    <Input
                      id="factory_phone"
                      value={factoryContact.phone}
                      onChange={(e) => setFactoryContact({ ...factoryContact, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="factory_email">البريد الإلكتروني</Label>
                    <Input
                      id="factory_email"
                      type="email"
                      value={factoryContact.email}
                      onChange={(e) => setFactoryContact({ ...factoryContact, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="factory_address">العنوان</Label>
                    <Textarea
                      id="factory_address"
                      value={factoryContact.address}
                      onChange={(e) => setFactoryContact({ ...factoryContact, address: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">مرفقات الشحنة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملفات هنا أو</p>
                    <Input
                      type="file"
                      multiple
                      className="mx-auto max-w-xs"
                      onChange={(e) => handleFileUpload("shipping_attachments", e.target.files)}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    } else if (selectedServices.includes("import")) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بوليصة الشحن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملف هنا أو</p>
                <Input
                  type="file"
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("bill_of_lading", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فواتير الشحنة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملفات هنا أو</p>
                <Input
                  type="file"
                  multiple
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("import_invoices", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (selectedServices.includes("export")) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">بوليصة الشحن</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملف هنا أو</p>
                <Input
                  type="file"
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("bill_of_lading", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فواتير الشحنة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملفات هنا أو</p>
                <Input
                  type="file"
                  multiple
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("export_invoices", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (selectedServices.includes("transport")) {
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">نوع النقل</h3>
            <RadioGroup value={transportType} onValueChange={setTransportType} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dina" id="dina" />
                <Label htmlFor="dina" className="mr-2">
                  دينة
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trailer" id="trailer" />
                <Label htmlFor="trailer" className="mr-2">
                  تريلا
                </Label>
              </div>
            </RadioGroup>
          </div>

          {transportType && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">نوع التبريد</h3>
                <RadioGroup value={transportTemperature} onValueChange={setTransportTemperature} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refrigerated" id="refrigerated" />
                    <Label htmlFor="refrigerated" className="mr-2">
                      مبرد
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dry" id="dry" />
                    <Label htmlFor="dry" className="mr-2">
                      جاف
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات المغادرة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="departure_city">المدينة</Label>
                    <Select value={departureCity} onValueChange={setDepartureCity}>
                      <SelectTrigger id="departure_city">
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                        <SelectItem value="makkah">مكة المكرمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departure_district">الحي</Label>
                    <Input
                      id="departure_district"
                      value={departureDistrict}
                      onChange={(e) => setDepartureDistrict(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">معلومات الوصول</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="arrival_city">المدينة</Label>
                    <Select value={arrivalCity} onValueChange={setArrivalCity}>
                      <SelectTrigger id="arrival_city">
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                        <SelectItem value="makkah">مكة المكرمة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="arrival_district">الحي</Label>
                    <Input
                      id="arrival_district"
                      value={arrivalDistrict}
                      onChange={(e) => setArrivalDistrict(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    } else {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">يرجى اختيار الخدمات المطلوبة أولاً</p>
        </div>
      )
    }
  }

  // Check if documents are ready based on selected services
  const areDocumentsReady = () => {
    if (selectedServices.includes("shipping")) {
      return shippingType && factoryContact.name && documents.some((d) => d.documentType === "shipping_attachments")
    } else if (selectedServices.includes("import") || selectedServices.includes("export")) {
      return (
        documents.some((d) => d.documentType === "bill_of_lading") &&
        (documents.some((d) => d.documentType === "import_invoices") ||
          documents.some((d) => d.documentType === "export_invoices"))
      )
    } else if (selectedServices.includes("transport")) {
      return transportType && transportTemperature && departureCity && arrivalCity
    }
    return false
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">إنشاء طلب جديد</h1>

      {/* Main Content */}
      <Card className="h-full">
        <CardContent className="h-full pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="client" className="data-[state=active]:bg-background rounded-md py-2 px-3 text-sm">
                العميل
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-background rounded-md py-2 px-3 text-sm">
                الخدمات
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-background rounded-md py-2 px-3 text-sm">
                المستندات
              </TabsTrigger>
              <TabsTrigger value="review" className="data-[state=active]:bg-background rounded-md py-2 px-3 text-sm">
                المراجعة
              </TabsTrigger>
            </TabsList>

            {/* Client Selection Tab */}
            <TabsContent value="client" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">اختيار العميل</h2>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث باسم العميل أو رقم العميل أو رقم الجوال"
                    className="pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم العميل</TableHead>
                        <TableHead className="text-right">نوع العميل</TableHead>
                        <TableHead className="text-right">رقم الجوال</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id} className={selectedClient?.id === customer.id ? "bg-muted" : ""}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.type === "individual" ? "فرد" : "شركة"}</TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell>
                              <Button
                                variant={selectedClient?.id === customer.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedClient(customer)}
                              >
                                {selectedClient?.id === customer.id ? "تم الاختيار" : "اختيار"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            لا يوجد عملاء مطابقين لبحثك
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/customers/add")}>
                    إضافة عميل جديد
                  </Button>
                  <Button onClick={handleNextStep} disabled={!selectedClient}>
                    التالي
                    <ChevronRight className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Services Selection Tab */}
            <TabsContent value="services" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">اختيار الخدمات</h2>
                <p className="text-muted-foreground">يمكنك اختيار خدمة واحدة أو أكثر</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className={`cursor-pointer border-2 ${selectedServices.includes("import") ? "border-primary" : "border-border"}`}
                    onClick={() => toggleService("import")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Package className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-medium text-lg">تخليص وارد</h3>
                      <p className="text-sm text-muted-foreground mt-2">تخليص البضائع الواردة من خارج المملكة</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${selectedServices.includes("export") ? "border-primary" : "border-border"}`}
                    onClick={() => toggleService("export")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Package className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-medium text-lg">تخليص صادر</h3>
                      <p className="text-sm text-muted-foreground mt-2">تخليص البضائع المصدرة خارج المملكة</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${selectedServices.includes("shipping") ? "border-primary" : "border-border"}`}
                    onClick={() => toggleService("shipping")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Package className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-medium text-lg">شحن</h3>
                      <p className="text-sm text-muted-foreground mt-2">خدمات الشحن البري والبحري والجوي</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${selectedServices.includes("transport") ? "border-primary" : "border-border"}`}
                    onClick={() => toggleService("transport")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Truck className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-medium text-lg">نقل</h3>
                      <p className="text-sm text-muted-foreground mt-2">خدمات النقل داخل المملكة</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer border-2 ${selectedServices.includes("storage") ? "border-primary" : "border-border"}`}
                    onClick={() => toggleService("storage")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                      <Package className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="font-medium text-lg">تخزين</h3>
                      <p className="text-sm text-muted-foreground mt-2">خدمات التخزين في مستودعاتنا</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={selectedServices.length === 0}>
                    التالي
                    <ChevronRight className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Documents Upload Tab */}
            <TabsContent value="documents" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">المستندات المطلوبة</h2>
                <p className="text-muted-foreground">يرجى رفع المستندات المطلوبة حسب نوع الخدمة المختارة</p>

                {getRequiredDocuments()}

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!areDocumentsReady()}>
                    التالي
                    <ChevronRight className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">مراجعة الطلب</h2>

                {!orderComplete ? (
                  <>
                    {/* إضافة رقم البوليصة في صفحة المراجعة */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">ملخص الطلب</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">العميل:</span>
                          <span className="font-medium">{selectedClient?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">رقم البوليصة:</span>
                          <span className="font-medium">سيتم إنشاؤه تلقائياً</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">الخدمات:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {selectedServices.map((service) => (
                              <Badge key={service} variant="outline">
                                {service === "import"
                                  ? "تخليص وارد"
                                  : service === "export"
                                    ? "تخليص صادر"
                                    : service === "shipping"
                                      ? "شحن"
                                      : service === "transport"
                                        ? "نقل"
                                        : service === "storage"
                                          ? "تخزين"
                                          : service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedServices.includes("shipping") && shippingType && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">نوع الشحن:</span>
                            <span className="font-medium">
                              {shippingType === "fob" ? "FOB (تسليم ظهر السفينة)" : "Door to Door (من الباب إلى الباب)"}
                            </span>
                          </div>
                        )}
                        {selectedServices.includes("transport") && transportType && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">نوع النقل:</span>
                              <span className="font-medium">{transportType === "dina" ? "دينة" : "تريلا"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">نوع التبريد:</span>
                              <span className="font-medium">
                                {transportTemperature === "refrigerated" ? "مبرد" : "جاف"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">المغادرة:</span>
                              <span className="font-medium">
                                {departureCity} - {departureDistrict}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">الوصول:</span>
                              <span className="font-medium">
                                {arrivalCity} - {arrivalDistrict}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">عدد المستندات المرفقة:</span>
                          <span className="font-medium">{documents.length}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={handleSubmitOrder}>إرسال الطلب</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card className="border-2 border-green-500">
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                        <h3 className="text-xl font-bold mb-2">تم إرسال طلبك بنجاح</h3>
                        <p className="text-muted-foreground mb-4">
                          سيقوم فريقنا بمراجعة طلبك والرد عليك في أقرب وقت ممكن
                        </p>
                        <Button onClick={goToOrdersPage}>الذهاب إلى صفحة الطلبات</Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
