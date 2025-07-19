"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  User,
  Package,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
} from "lucide-react"
import { customersAPI, ordersAPI } from "@/lib/api"

export default function CreateOrderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("client")
  const [isLoading, setIsLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [documents, setDocuments] = useState([])
  const [shippingType, setShippingType] = useState("")
  const [transportType, setTransportType] = useState("")
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
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  // Load customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true)
      try {
        const result = await customersAPI.getAll()
        if (result.success) {
          setCustomers(result.data.data || result.data || [])
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
        setLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter clients based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Previous step handler
  const handlePreviousStep = () => {
    const tabOrder = ["client", "services", "documents", "review"]
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  // Submit order handler
  const handleSubmitOrder = async () => {
    if (!selectedClient) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار العميل",
        variant: "destructive",
      })
      return
    }

    if (selectedServices.length === 0) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار خدمة واحدة على الأقل",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create order object with proper API format
      const orderData = {
        customer: selectedClient._id || selectedClient.id,
        clientName: selectedClient.name,
        services: selectedServices,
        status: "قيد المراجعة",
        documents: documents,
        shippingType,
        transportType,
        transportTemperature,
        departureCity,
        departureDistrict,
        arrivalCity,
        arrivalDistrict,
        factoryContact,
        // Add required fields for API
        serviceType: selectedServices[0], // Use first service as primary
        origin: {
          address: `${departureCity}, ${departureDistrict}`,
          city: departureCity,
          district: departureDistrict,
        },
        destination: {
          address: `${arrivalCity}, ${arrivalDistrict}`,
          city: arrivalCity,
          district: arrivalDistrict,
        },
        cargo: {
          description: "شحنة عامة",
          weight: 1000, // Default weight
          type: "general",
        },
        pricing: {
          basePrice: 1000, // Default price
          currency: "SAR",
        },
      }

      const result = await ordersAPI.create(orderData)
      if (result.success) {
        setOrderComplete(true)
        toast({
          title: "تم إنشاء الطلب بنجاح",
          description: `رقم الطلب: ${result.data._id || result.data.id}`,
        })
      } else {
        throw new Error(result.error || "فشل في إنشاء الطلب")
      }
    } catch (error) {
      console.error("Failed to create order:", error)
      toast({
        title: "خطأ في إنشاء الطلب",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
              <CardTitle className="text-lg">شهادة المنشأ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملف هنا أو</p>
                <Input
                  type="file"
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("certificate_of_origin", e.target.files)}
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
              <CardTitle className="text-lg">شهادة المنشأ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملف هنا أو</p>
                <Input
                  type="file"
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("certificate_of_origin", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">فاتورة تجارية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملف هنا أو</p>
                <Input
                  type="file"
                  className="mx-auto max-w-xs"
                  onChange={(e) => handleFileUpload("commercial_invoice", e.target.files)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    } else if (selectedServices.includes("transport")) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات النقل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure_city">مدينة المغادرة</Label>
                  <Input
                    id="departure_city"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="departure_district">حي المغادرة</Label>
                  <Input
                    id="departure_district"
                    value={departureDistrict}
                    onChange={(e) => setDepartureDistrict(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival_city">مدينة الوصول</Label>
                  <Input
                    id="arrival_city"
                    value={arrivalCity}
                    onChange={(e) => setArrivalCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="arrival_district">حي الوصول</Label>
                  <Input
                    id="arrival_district"
                    value={arrivalDistrict}
                    onChange={(e) => setArrivalDistrict(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="transport_type">نوع النقل</Label>
                <RadioGroup value={transportType} onValueChange={setTransportType} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="refrigerated" id="refrigerated" />
                    <Label htmlFor="refrigerated" className="mr-2">
                      نقل مبرد
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dry" id="dry" />
                    <Label htmlFor="dry" className="mr-2">
                      نقل جاف
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {transportType === "refrigerated" && (
                <div>
                  <Label htmlFor="temperature">درجة الحرارة المطلوبة</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="مثال: -18"
                    value={transportTemperature}
                    onChange={(e) => setTransportTemperature(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">اختر الخدمات المطلوبة لعرض المستندات المطلوبة</p>
      </div>
    )
  }

  // Check if documents are ready
  const areDocumentsReady = () => {
    if (selectedServices.includes("shipping") && !shippingType) return false
    if (selectedServices.includes("transport") && (!departureCity || !arrivalCity)) return false
    return true
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">تم إنشاء الطلب بنجاح</h1>
            <p className="text-muted-foreground">سيتم مراجعة طلبك والرد عليك قريباً</p>
          </div>
          <Button onClick={goToOrdersPage} className="w-full">
            عرض جميع الطلبات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">إنشاء طلب جديد</h1>
          <Button variant="outline" onClick={() => router.back()}>
            العودة
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="client">العميل</TabsTrigger>
            <TabsTrigger value="services" disabled={!selectedClient}>
              الخدمات
            </TabsTrigger>
            <TabsTrigger value="documents" disabled={selectedServices.length === 0}>
              المستندات
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!areDocumentsReady()}>
              المراجعة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اختيار العميل</CardTitle>
                <CardDescription>ابحث عن العميل أو اختر من القائمة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن العميل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                {loadingCustomers ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer._id || customer.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedClient?._id === customer._id || selectedClient?.id === customer.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedClient(customer)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                          <Badge variant={customer.type === "company" ? "default" : "secondary"}>
                            {customer.type === "company" ? "شركة" : "فرد"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedClient && (
              <div className="flex justify-end">
                <Button onClick={handleNextStep}>
                  التالي
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اختيار الخدمات</CardTitle>
                <CardDescription>اختر الخدمات المطلوبة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {[
                    { id: "shipping", name: "شحن", description: "خدمات الشحن البحري والجوي" },
                    { id: "import", name: "تخليص وارد", description: "تخليص البضائع الواردة" },
                    { id: "export", name: "تخليص صادر", description: "تخليص البضائع المصدرة" },
                    { id: "transport", name: "نقل", description: "خدمات النقل المحلي" },
                  ].map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedServices.includes(service.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        {selectedServices.includes(service.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                السابق
              </Button>
              <Button onClick={handleNextStep} disabled={selectedServices.length === 0}>
                التالي
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المستندات المطلوبة</CardTitle>
                <CardDescription>قم برفع المستندات المطلوبة للخدمات المختارة</CardDescription>
              </CardHeader>
              <CardContent>{getRequiredDocuments()}</CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                السابق
              </Button>
              <Button onClick={handleNextStep} disabled={!areDocumentsReady()}>
                التالي
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مراجعة الطلب</CardTitle>
                <CardDescription>راجع تفاصيل الطلب قبل الإرسال</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">معلومات العميل</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p><strong>الاسم:</strong> {selectedClient?.name}</p>
                    <p><strong>البريد الإلكتروني:</strong> {selectedClient?.email}</p>
                    <p><strong>الهاتف:</strong> {selectedClient?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">الخدمات المختارة</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service === "shipping" && "شحن"}
                        {service === "import" && "تخليص وارد"}
                        {service === "export" && "تخليص صادر"}
                        {service === "transport" && "نقل"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">المستندات المرفقة</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {documents.length > 0 ? (
                      <ul className="space-y-1">
                        {documents.map((doc) => (
                          <li key={doc.id} className="text-sm">
                            📎 {doc.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">لا توجد مستندات مرفقة</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                السابق
              </Button>
              <Button onClick={handleSubmitOrder} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    جاري إنشاء الطلب...
                  </>
                ) : (
                  "إنشاء الطلب"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
