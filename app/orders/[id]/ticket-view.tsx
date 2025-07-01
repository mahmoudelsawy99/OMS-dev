"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  User,
  FileText,
  CheckCircle,
  Eye,
  Download,
  Clock,
  MapPin,
  MessageSquare,
  XCircle,
} from "lucide-react"

interface TicketViewProps {
  order: any
  getCityName: (cityCode: string) => string
}

export function TicketView({ order, getCityName }: TicketViewProps) {
  return (
    <div className="space-y-6">
      {/* رسالة الموافقة */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
        <CheckCircle className="h-6 w-6 text-green-600 ml-3" />
        <div>
          <h3 className="font-medium text-green-800">تمت الموافقة على الطلب</h3>
          <p className="text-sm text-green-700">تم تحويل الطلب إلى أمر تشغيل وجاري العمل عليه</p>
        </div>
      </div>

      {/* معلومات التيكت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات الشحنة */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 ml-2 text-primary" />
              معلومات الشحنة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">رقم الشحنة:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">تاريخ الإنشاء:</span>
              <span className="font-medium">{order.creationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">الخدمات:</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {order.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
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
            {order.services.includes("transport") && (
              <>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">نوع النقل:</span>
                    <span className="font-medium">{order.transportType === "dina" ? "دينة" : "تريلا"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">نوع التبريد:</span>
                    <span className="font-medium">
                      {order.transportTemperature === "refrigerated" ? "مبرد" : "جاف"}
                    </span>
                  </div>
                </div>
              </>
            )}
            {order.services.includes("shipping") && (
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">نوع الشحن:</span>
                  <span className="font-medium">
                    {order.shippingType === "fob" ? "FOB (تسليم ظهر السفينة)" : "Door to Door (من الباب إلى الباب)"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات العميل */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 ml-2 text-primary" />
              معلومات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">اسم العميل:</span>
              <span className="font-medium">{order.clientName}</span>
            </div>
            {order.factoryContact && (
              <div className="border-t pt-2 mt-2">
                <h4 className="text-sm font-medium mb-2">معلومات المصنع/الشركة:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span>{order.factoryContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الهاتف:</span>
                    <span>{order.factoryContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span>{order.factoryContact.email}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات التفويض والمرفقات */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 ml-2 text-primary" />
              المرفقات والتفويض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">عدد المرفقات:</span>
              <span className="font-medium">{order.documents?.length || 0}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <h4 className="text-sm font-medium mb-2">المستندات المرفقة:</h4>
              {order.documents && order.documents.length > 0 ? (
                <ul className="space-y-1">
                  {order.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 ml-2 text-blue-600" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">لا توجد مستندات مرفقة</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تفاصيل الشحنة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">تفاصيل الشحنة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.services.includes("transport") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 text-primary flex items-center">
                    <MapPin className="h-4 w-4 ml-2" />
                    معلومات المغادرة
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">المدينة:</span>
                      <span className="font-medium">{getCityName(order.departureCity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">الحي:</span>
                      <span className="font-medium">{order.departureDistrict}</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2 text-primary flex items-center">
                    <MapPin className="h-4 w-4 ml-2" />
                    معلومات الوصول
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">المدينة:</span>
                      <span className="font-medium">{getCityName(order.arrivalCity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">الحي:</span>
                      <span className="font-medium">{order.arrivalDistrict}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {order.factoryContact && order.factoryContact.address && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2 text-primary flex items-center">
                  <MapPin className="h-4 w-4 ml-2" />
                  عنوان المصنع/الشركة
                </h3>
                <p>{order.factoryContact.address}</p>
              </div>
            )}

            {/* حالة التتبع */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4 text-primary flex items-center">
                <Clock className="h-4 w-4 ml-2" />
                حالة الطلب
              </h3>
              <div className="relative">
                <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">تم إنشاء الطلب</h4>
                      <p className="text-sm text-muted-foreground">{order.creationDate}</p>
                    </div>
                  </div>
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">تمت الموافقة على الطلب</h4>
                      <p className="text-sm text-muted-foreground">تم تحويل الطلب إلى أمر تشغيل</p>
                    </div>
                  </div>
                  <div className="relative pr-8">
                    <div className="absolute right-0 top-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground">جاري العمل على الطلب</h4>
                      <p className="text-sm text-muted-foreground">سيتم تحديث الحالة قريباً</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <FileText className="h-4 w-4 ml-2" />
          طباعة التيكت
        </Button>
        <Button>
          <MessageSquare className="h-4 w-4 ml-2" />
          التواصل مع العميل
        </Button>
      </div>
    </div>
  )
}

// إضافة مكون لعرض حالة الرفض
export function RejectedView({ order, getCityName, onReopenOrder }) {
  return (
    <div className="space-y-6">
      {/* رسالة الرفض */}
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
        <XCircle className="h-6 w-6 text-red-600 ml-3" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800">تم رفض الطلب</h3>
          <p className="text-sm text-red-700">
            {order.rejectionReason ? `سبب الرفض: ${order.rejectionReason}` : "لم يتم تحديد سبب للرفض"}
          </p>
        </div>
      </div>

      {/* معلومات الطلب المرفوض */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات الشحنة */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 ml-2 text-primary" />
              معلومات الشحنة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">رقم الشحنة:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">تاريخ الإنشاء:</span>
              <span className="font-medium">{order.creationDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">الخدمات:</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {order.services.map((service) => (
                  <Badge key={service} variant="outline" className="text-xs">
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
          </CardContent>
        </Card>

        {/* معلومات العميل */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 ml-2 text-primary" />
              معلومات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">اسم العميل:</span>
              <span className="font-medium">{order.clientName}</span>
            </div>
          </CardContent>
        </Card>

        {/* معلومات التفويض والمرفقات */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 ml-2 text-primary" />
              المرفقات والتفويض
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">عدد المرفقات:</span>
              <span className="font-medium">{order.documents?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* سبب الرفض */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">سبب الرفض</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-red-200 rounded-md p-4 bg-red-50">
            <p className="text-red-700">{order.rejectionReason || "لم يتم تحديد سبب للرفض"}</p>
          </div>
        </CardContent>
      </Card>

      {/* خيار إعادة فتح الطلب */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إعادة فتح الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              يمكنك إعادة فتح هذا الطلب إذا كنت ترغب في مراجعته مرة أخرى أو تعديل البيانات المطلوبة.
            </p>
            <Button onClick={onReopenOrder} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 ml-2" />
              إعادة فتح الطلب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// تصدير المكونات
