"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Plus,
  RefreshCw,
  FileCheck,
  Package,
  Calculator,
  Clock,
  Copy,
  MapPin,
  ChevronRight,
  Printer,
  Share2,
  MoreHorizontal,
  Bell,
  BarChart,
  ShieldCheck,
  Pencil,
  Trash2,
  Phone,
  Mail,
  Settings,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Timeline } from "./timeline"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { AddPolicyDialog } from "./add-policy-dialog"
import { AddSialDialog } from "./add-sial"
import { AddCustomsDialog } from "./add-customs"
import { AddPurchaseInvoiceDialog } from "./add-purchase-invoice"
import { AddTransportDialog } from "./add-transport-dialog"
import ShipmentCharts from "../../../components/shipment-charts"

// Add this new component after the existing imports
// مكون التيكت القابل لإعادة الاستخدام
interface TicketCardProps {
  type: "policy" | "transport" | "invoice" | "customs" | "sial" | "note" | "attachment"
  icon?: React.ReactNode
  label?: string
  title: string
  summary?: string
  date?: string
  reference?: string
  status?: string
  hasAttachments?: boolean
  onView?: () => void
  onViewAttachments?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const TicketCard = ({
  type,
  icon,
  label,
  title,
  summary,
  date,
  reference,
  status,
  hasAttachments = false,
  onView,
  onViewAttachments,
  onEdit,
  onDelete,
}: TicketCardProps) => {
  // تحديد الألوان والأيقونات حسب نوع التيكت
  const typeConfig = {
    policy: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-400",
      icon: icon || <FileText className="h-5 w-5" />,
      label: label || "WB",
    },
    transport: {
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverColor: "hover:border-indigo-400",
      icon: icon || <Truck className="h-5 w-5" />,
      label: label || "TR",
    },
    invoice: {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-400",
      icon: icon || <Calculator className="h-5 w-5" />,
      label: label || "INV",
    },
    customs: {
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverColor: "hover:border-amber-400",
      icon: icon || <FileCheck className="h-5 w-5" />,
      label: label || "CD",
    },
    sial: {
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-400",
      icon: icon || <Package className="h-5 w-5" />,
      label: label || "SL",
    },
    note: {
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
      hoverColor: "hover:border-gray-400",
      icon: icon || <AlertCircle className="h-5 w-5" />,
      label: label || "NT",
    },
    attachment: {
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      hoverColor: "hover:border-rose-400",
      icon: icon || <FileText className="h-5 w-5" />,
      label: label || "AT",
    },
  }

  const config = typeConfig[type]

  return (
    <div
      className={`p-4 rounded-2xl shadow-sm border ${config.borderColor} ${config.hoverColor} transition-all duration-200 bg-white`}
    >
      <div className="flex items-center gap-4">
        {/* الجزء الأيسر - الأيقونة أو نوع التيكت */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
          <div className={`${config.textColor}`}>{config.icon}</div>
        </div>

        {/* الجزء الأوسط - المعلومات الأساسية */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">{title}</h3>
          {summary && <p className="text-sm text-gray-500 truncate">{summary}</p>}
          <div className="flex items-center gap-3 mt-1">
            {date && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {date}
              </span>
            )}
            {reference && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Copy className="h-3 w-3 mr-1" />
                {reference}
              </span>
            )}
            {status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {/* الجزء الأيمن - العمليات */}
        <div className="flex items-center gap-1">
          {onView && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {hasAttachments && onViewAttachments && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewAttachments}>
              <FileText className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// مكون التيكت القابل لإعادة الاستخدام - النسخة المحسنة
const TicketCardImproved = ({
  type,
  icon,
  label,
  title,
  summary,
  date,
  reference,
  status,
  hasAttachments = false,
  onView,
  onViewAttachments,
  onEdit,
  onDelete,
}: TicketCardProps) => {
  // تحديد الألوان والأيقونات حسب نوع التيكت
  const typeConfig = {
    policy: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-400",
      icon: icon || <FileText className="h-5 w-5" />,
      label: label || "WB",
    },
    transport: {
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverColor: "hover:border-indigo-400",
      icon: icon || <Truck className="h-5 w-5" />,
      label: label || "TR",
    },
    invoice: {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-400",
      icon: icon || <Calculator className="h-5 w-5" />,
      label: label || "INV",
    },
    customs: {
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverColor: "hover:border-amber-400",
      icon: icon || <FileCheck className="h-5 w-5" />,
      label: label || "CD",
    },
    sial: {
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-400",
      icon: icon || <Package className="h-5 w-5" />,
      label: label || "SL",
    },
    note: {
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-200",
      hoverColor: "hover:border-gray-400",
      icon: icon || <AlertCircle className="h-5 w-5" />,
      label: label || "NT",
    },
    attachment: {
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      hoverColor: "hover:border-rose-400",
      icon: icon || <FileText className="h-5 w-5" />,
      label: label || "AT",
    },
  }

  const config = typeConfig[type]

  return (
    <div
      className={`p-4 rounded-2xl shadow-sm border ${config.borderColor} ${config.hoverColor} transition-all duration-200 bg-white hover:shadow-md`}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* الجزء الأيسر - الأيقونة أو نوع التيكت */}
        <div className="col-span-2 sm:col-span-1">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <div className={`${config.textColor}`}>{config.icon}</div>
          </div>
        </div>

        {/* الجزء الأوسط - المعلومات الأساسية */}
        <div className="col-span-7 sm:col-span-9 flex flex-col min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">{title}</h3>
          {summary && <p className="text-sm text-gray-500 line-clamp-1">{summary}</p>}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {date && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {date}
              </span>
            )}
            {reference && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Copy className="h-3 w-3 mr-1" />
                {reference}
              </span>
            )}
            {status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
              >
                {status}
              </span>
            )}
          </div>
        </div>

        {/* الجزء الأيمن - العمليات */}
        <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1">
          {onView && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {hasAttachments && onViewAttachments && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewAttachments}>
              <FileText className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// مكون لعرض حالة التيكت
const OrderStatusBadge = ({ status }) => {
  let statusConfig = {
    color: "bg-gray-100 text-gray-800",
    icon: null,
    label: status,
  }

  switch (status) {
    case "موافق عليه":
      statusConfig = {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle className="h-4 w-4 ml-1" />,
        label: "موافق عليه",
      }
      break
    case "قيد المراجعة":
      statusConfig = {
        color: "bg-blue-100 text-blue-800 border-blue-300",
        icon: <AlertCircle className="h-4 w-4 ml-1" />,
        label: "قيد المراجعة",
      }
      break
    case "مرفوض":
      statusConfig = {
        color: "bg-red-100 text-red-800 border-red-300",
        icon: <XCircle className="h-4 w-4 ml-1" />,
        label: "مرفوض",
      }
      break
    case "بانتظار مستندات إضافية":
      statusConfig = {
        color: "bg-amber-100 text-amber-800 border-amber-300",
        icon: <FileText className="h-4 w-4 ml-1" />,
        label: "بانتظار مستندات",
      }
      break
    case "جاري العمل":
      statusConfig = {
        color: "bg-purple-100 text-purple-800 border-purple-300",
        icon: <Truck className="h-4 w-4 ml-1" />,
        label: "جاري العمل",
      }
      break
    case "مكتمل":
      statusConfig = {
        color: "bg-green-100 text-green-800 border-green-300",
        icon: <CheckCircle className="h-4 w-4 ml-1" />,
        label: "مكتمل",
      }
      break
  }

  return (
    <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusConfig.color}`}>
      {statusConfig.icon}
      <span>{statusConfig.label}</span>
    </div>
  )
}

// مكون لعرض إحصائيات الشحنة التفصيلية
const ShipmentStatsCard = () => {
  return (
    <Card className="bg-white shadow-sm border-0 mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">إحصائيات الشحنة</CardTitle>
            <CardDescription>معلومات تفصيلية عن الشحنة الحالية</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            آخر تحديث: {new Date().toLocaleTimeString("ar-SA")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-blue-700">السرعة الحالية</div>
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">75 كم/س</div>
            <div className="text-xs text-blue-600 mt-1">متوسط السرعة: 70 كم/س</div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-green-700">الوقت المتبقي</div>
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">6 ساعات</div>
            <div className="text-xs text-green-600 mt-1">الوصول: 20/04/2025</div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-amber-700">المسافة المقطوعة</div>
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold">350 كم</div>
            <div className="text-xs text-amber-600 mt-1">إجمالي المسافة: 800 كم</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-purple-700">المسافة المتبقية</div>
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">450 كم</div>
            <div className="text-xs text-purple-600 mt-1">نسبة الإنجاز: 44%</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium">تقدم الرحلة</div>
              <div className="text-sm text-muted-foreground">44%</div>
            </div>
            <Progress value={44} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">معلومات الطريق</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">نوع الطريق</span>
                  <span className="font-medium">طريق سريع</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">حالة الطريق</span>
                  <span className="font-medium">جيدة</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">الازدحام المروري</span>
                  <span className="font-medium">منخفض</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">نقاط التفتيش</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">معلومات الشاحنة</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">رقم الشاحنة</span>
                  <span className="font-medium">TR-7842</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">اسم السائق</span>
                  <span className="font-medium">أحمد محمد</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">استهلاك الوقود</span>
                  <span className="font-medium">32 لتر/100كم</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">درجة الحرارة</span>
                  <span className="font-medium">4°م (مبرد)</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">الظروف الجوية على طول المسار</h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">الرياض</div>
                <div className="text-2xl my-1">☀️</div>
                <div className="text-sm font-medium">38°م</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">الخرج</div>
                <div className="text-2xl my-1">☀️</div>
                <div className="text-sm font-medium">37°م</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">الدوادمي</div>
                <div className="text-2xl my-1">🌤️</div>
                <div className="text-sm font-medium">36°م</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">الطائف</div>
                <div className="text-2xl my-1">⛅</div>
                <div className="text-sm font-medium">32°م</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="text-xs text-gray-500">جدة</div>
                <div className="text-2xl my-1">🌤️</div>
                <div className="text-sm font-medium">34°م</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t">
        <div className="w-full flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">ملاحظة:</span> البيانات تقديرية وقد تتغير حسب ظروف الطريق والطقس
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// مكون لعرض حالة تتبع الشحنة
const ShipmentTrackingCard = ({ setIsUpdateStatusDialogOpen }) => {
  return (
    <Card className="bg-white shadow-sm border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">تتبع الشحنة</CardTitle>
            <CardDescription>آخر تحديثات حالة الشحنة</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-gray-200 z-0"></div>

          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-6">
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ml-2 border-4 border-white">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">تم استلام الطلب</div>
                    <div className="text-sm text-muted-foreground">12/04/2025</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">مكتمل</Badge>
                </div>
                <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm">تم استلام طلبك وجاري تجهيزه للشحن</div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ml-2 border-4 border-white">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">تم شحن البضاعة</div>
                    <div className="text-sm text-muted-foreground">15/04/2025</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">مكتمل</Badge>
                </div>
                <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm">
                  تم شحن البضاعة من المصدر وهي في طريقها إلى الميناء
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 border-4 border-white">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">في الطريق</div>
                    <div className="text-sm text-muted-foreground">17/04/2025</div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">جاري</Badge>
                </div>
                <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm">البضاعة في طريقها إلى الوجهة النهائية</div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 border-4 border-white">
                    <Package className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">التسليم النهائي</div>
                    <div className="text-sm text-muted-foreground">متوقع: 20/04/2025</div>
                  </div>
                  <Badge variant="outline">قادم</Badge>
                </div>
                <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm">
                  من المتوقع وصول الشحنة إلى الوجهة النهائية في هذا التاريخ
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 border-4 border-white">
                    <FileCheck className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">التخليص الجمركي</div>
                    <div className="text-sm text-muted-foreground">متوقع: 22/04/2025</div>
                  </div>
                  <Badge variant="outline">قادم</Badge>
                </div>
                <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm">
                  سيتم البدء في إجراءات التخليص الجمركي بعد وصول الشحنة
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="mt-4">
          <Progress value={60} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>استلام الطلب</span>
            <span>في الطريق</span>
            <span>التسليم النهائي</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          className="w-full bg-primary text-white hover:bg-primary/90"
          onClick={() => setIsUpdateStatusDialogOpen(true)}
        >
          <RefreshCw className="ml-2" size={16} />
          تحديث حالة الشحنة
        </Button>
      </CardFooter>
    </Card>
  )
}

// مكون لعرض معلومات الطلب الأساسية
const OrderSummaryCard = ({ order, id }) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-2">
        <div className="text-sm text-muted-foreground">رقم الطلب</div>
        <div className="font-medium text-lg">{id}</div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-muted-foreground">تاريخ الإنشاء</div>
        <div className="font-medium text-lg">{order.creationDate}</div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-muted-foreground">الحالة</div>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  )
}

// مكون لعرض معلومات المدير
const ProjectManagerCard = () => {
  return (
    <div className="flex items-center">
      <Avatar className="h-10 w-10 ml-3">
        <AvatarImage src="/diverse-group-city.png" />
        <AvatarFallback>JA</AvatarFallback>
      </Avatar>
      <div>
        <div className="text-sm text-muted-foreground">مدير المشروع</div>
        <div className="font-medium">محمد أحمد</div>
      </div>
    </div>
  )
}

// مكون لعرض الإجراءات السريعة
const QuickActionsCard = ({
  setIsPolicyDialogOpen,
  setIsSialDialogOpen,
  setIsPurchaseInvoiceDialogOpen,
  setIsCustomsDialogOpen,
  setIsTransportDialogOpen,
  setIsRequestMissingItemsDialogOpen,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsPolicyDialogOpen(true)}>
        <FileText className="h-4 w-4 ml-1" />
        إضافة بوليصة
      </Button>
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsSialDialogOpen(true)}>
        <Package className="h-4 w-4 ml-1" />
        إضافة سال
      </Button>
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsCustomsDialogOpen(true)}>
        <FileCheck className="h-4 w-4 ml-1" />
        بيان جمركي
      </Button>
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsPurchaseInvoiceDialogOpen(true)}>
        <Calculator className="h-4 w-4 ml-1" />
        فاتورة شراء
      </Button>
      <Button variant="outline" size="sm" className="h-9" onClick={() => setIsTransportDialogOpen(true)}>
        <Truck className="h-4 w-4 ml-1" />
        إضافة نقل
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => {
          toast({
            title: "طباعة إشعار تسليم",
            description: "تم طباعة إشعار التسليم بنجاح",
          })
        }}
      >
        <Printer className="h-4 w-4 ml-1" />
        إشعار تسليم
      </Button>
    </div>
  )
}

export default function OrderDetailsPage({ MapComponent }) {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("operations")
  const [adminResponse, setAdminResponse] = useState(null)
  const [additionalDocsRequired, setAdditionalDocsRequired] = useState([])
  const [rejectionReason, setRejectionReason] = useState("")
  const [additionalDocsList, setAdditionalDocsList] = useState([
    { id: 1, name: "شهادة المنشأ", required: false },
    { id: 2, name: "شهادة المطابقة", required: false },
    { id: 3, name: "شهادة صحية", required: false },
    { id: 4, name: "تفويض", required: false },
  ])
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false)
  const [isSialDialogOpen, setIsSialDialogOpen] = useState(false)
  const [policies, setPolicies] = useState([])
  const [activeComponents, setActiveComponents] = useState([])

  // Add this state variable with the other state variables
  const [isCustomsDialogOpen, setIsCustomsDialogOpen] = useState(false)
  const [customsDeclarations, setCustomsDeclarations] = useState([])
  // Add this state and handler for SIAL data
  const [sials, setSials] = useState([])
  const [isPurchaseInvoiceDialogOpen, setIsPurchaseInvoiceDialogOpen] = useState(false)
  const [purchaseInvoices, setPurchaseInvoices] = useState([])
  const [isTransportDialogOpen, setIsTransportDialogOpen] = useState(false)
  const [transportLocations, setTransportLocations] = useState([])
  const [isRequestMissingItemsDialogOpen, setIsRequestMissingItemsDialogOpen] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  // Primero, añadir el estado para el modal de تحديث de estado
  // Añadir esto junto a los otros estados في الدالة OrderDetailsPage
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [statusUpdateNote, setStatusUpdateNote] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("in_transit")

  // Update the handleAddPolicy function to save policies to the order in localStorage
  const handleAddPolicy = (policyData) => {
    const newPolicy = { ...policyData, id: Date.now() }
    const updatedPolicies = [...policies, newPolicy]
    setPolicies(updatedPolicies)

    // Save the policy to the order in localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const orderIndex = storedOrders.findIndex((o) => o.id === id)

      if (orderIndex !== -1) {
        storedOrders[orderIndex] = {
          ...storedOrders[orderIndex],
          policies: updatedPolicies,
        }
      } else {
        // If order doesn't exist in localStorage, create it
        storedOrders.push({
          id,
          policies: updatedPolicies,
          // Add other order details as needed
          status: order.status,
          clientName: order.clientName,
          creationDate: order.creationDate,
        })
      }

      localStorage.setItem("orders", JSON.stringify(storedOrders))
    } catch (error) {
      console.error("Error saving policy to localStorage:", error)
    }

    // Add policy tab if it doesn't exist
    if (!activeComponents.some((comp) => comp.id === "policy")) {
      setActiveComponents([
        ...activeComponents,
        {
          id: "policy",
          label: "البوليصة",
          isDefault: false,
        },
      ])
    }

    setActiveTab("policy")
    toast({
      title: "تمت إضافة البوليصة",
      description: "تم إضافة البوليصة بنجاح",
    })
  }

  // Add this handler function for saving SIAL data
  const handleAddSial = (sialData) => {
    const newSial = { ...sialData, id: Date.now() }
    const updatedSials = [...sials, newSial]
    setSials(updatedSials)

    // Save the SIAL to the order in localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const orderIndex = storedOrders.findIndex((o) => o.id === id)

      if (orderIndex !== -1) {
        storedOrders[orderIndex] = {
          ...storedOrders[orderIndex],
          sials: updatedSials,
        }
      } else {
        // If order doesn't exist in localStorage, create it
        storedOrders.push({
          id,
          sials: updatedSials,
          status: order.status,
          clientName: order.clientName,
          creationDate: order.creationDate,
        })
      }

      localStorage.setItem("orders", JSON.stringify(storedOrders))
    } catch (error) {
      console.error("Error saving SIAL to localStorage:", error)
    }

    // Add SIAL tab if it doesn't exist
    if (!activeComponents.some((comp) => comp.id === "sial")) {
      setActiveComponents([
        ...activeComponents,
        {
          id: "sial",
          label: "السال",
          isDefault: false,
        },
      ])
    }

    setActiveTab("sial")
    toast({
      title: "تمت إضافة السال",
      description: "تم إضافة السال بنجاح",
    })
  }

  // Add this handler function after the handleAddSial function
  const handleAddCustomsDeclaration = (customsData) => {
    const newCustomsDeclaration = { ...customsData, id: Date.now() }
    const updatedCustomsDeclarations = [...customsDeclarations, newCustomsDeclaration]
    setCustomsDeclarations(updatedCustomsDeclarations)

    // Save the customs declaration to the order in localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const orderIndex = storedOrders.findIndex((o) => o.id === id)

      if (orderIndex !== -1) {
        storedOrders[orderIndex] = {
          ...storedOrders[orderIndex],
          customsDeclarations: updatedCustomsDeclarations,
        }
      } else {
        // If order doesn't exist in localStorage, create it
        storedOrders.push({
          id,
          customsDeclarations: updatedCustomsDeclarations,
          status: order.status,
          clientName: order.clientName,
          creationDate: order.creationDate,
        })
      }

      localStorage.setItem("orders", JSON.stringify(storedOrders))
    } catch (error) {
      console.error("Error saving customs declaration to localStorage:", error)
    }

    // Add customs tab if it doesn't exist
    if (!activeComponents.some((comp) => comp.id === "customs")) {
      setActiveComponents([
        ...activeComponents,
        {
          id: "customs",
          label: "البيانات الجمركية",
          isDefault: false,
        },
      ])
    }

    setActiveTab("customs")
    toast({
      title: "تمت إضافة البيان الجمركي",
      description: "تم إضافة البيان الجمركي بنجاح",
    })
  }

  // Add this handler function for saving purchase invoice data
  const handleAddPurchaseInvoice = (invoiceData) => {
    const newInvoice = { ...invoiceData, id: Date.now() }
    const updatedInvoices = [...purchaseInvoices, newInvoice]
    setPurchaseInvoices(updatedInvoices)

    // Save the invoice to the order in localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const orderIndex = storedOrders.findIndex((o) => o.id === id)

      if (orderIndex !== -1) {
        storedOrders[orderIndex] = {
          ...storedOrders[orderIndex],
          purchaseInvoices: updatedInvoices,
        }
      } else {
        storedOrders.push({
          id,
          purchaseInvoices: updatedInvoices,
          status: order.status,
          clientName: order.clientName,
          creationDate: order.creationDate,
        })
      }

      localStorage.setItem("orders", JSON.stringify(storedOrders))
    } catch (error) {
      console.error("Error saving purchase invoice to localStorage:", error)
    }

    // Add purchase invoices tab if it doesn't exist
    if (!activeComponents.some((comp) => comp.id === "purchase-invoices")) {
      setActiveComponents([
        ...activeComponents,
        {
          id: "purchase-invoices",
          label: "فواتير الشراء",
          isDefault: false,
        },
      ])
    }

    setActiveTab("purchase-invoices")
    toast({
      title: "تمت إضافة فاتورة الشراء",
      description: "تم إضافة فاتورة الشراء بنجاح",
    })
  }

  // Add this handler function for saving transport location data
  const handleAddTransportLocation = (locationData) => {
    const newLocation = { ...locationData, id: Date.now() }
    const updatedLocations = [...transportLocations, newLocation]
    setTransportLocations(updatedLocations)

    // Save the transport location to the order in localStorage
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const orderIndex = storedOrders.findIndex((o) => o.id === id)

      if (orderIndex !== -1) {
        storedOrders[orderIndex] = {
          ...storedOrders[orderIndex],
          transportLocations: updatedLocations,
        }
      } else {
        storedOrders.push({
          id,
          transportLocations: updatedLocations,
          status: order.status,
          clientName: order.clientName,
          creationDate: order.creationDate,
        })
      }

      localStorage.setItem("orders", JSON.stringify(storedOrders))
    } catch (error) {
      console.error("Error saving transport location to localStorage:", error)
    }

    // Add transport tab if it doesn't exist
    if (!activeComponents.some((comp) => comp.id === "transport")) {
      setActiveComponents([
        ...activeComponents,
        {
          id: "transport",
          label: "النقل",
          isDefault: false,
        },
      ])
    }

    setActiveTab("transport")
    toast({
      title: "تمت إضافة معلومات النقل",
      description: "تم إضافة معلومات النقل بنجاح",
    })
  }

  // Fetch order data
  // Also update the useEffect to load existing policies
  useEffect(() => {
    // In a real app, you would fetch from an API
    // For now, we'll simulate by retrieving from localStorage
    const fetchOrder = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        const foundOrder = storedOrders.find((order) => order.id === id)

        if (foundOrder) {
          setOrder(foundOrder)
          // Load policies if they exist
          if (foundOrder.policies) {
            setPolicies(foundOrder.policies)
          }
          // Load SIALs if they exist
          if (foundOrder.sials) {
            setSials(foundOrder.sials)
          }
          // Update the useEffect function to load existing customs declarations
          // Add this inside the fetchOrder function, after loading SIALs
          if (foundOrder.customsDeclarations) {
            setCustomsDeclarations(foundOrder.customsDeclarations)
          }
          if (foundOrder.purchaseInvoices) {
            setPurchaseInvoices(foundOrder.purchaseInvoices)
          }
          if (foundOrder.transportLocations) {
            setTransportLocations(foundOrder.transportLocations)
          }
        } else {
          // Fallback to mock data if not found
          setOrder({
            id: id,
            clientName: "شركة الفا للتجارة",
            services: ["import", "transport"],
            status: "قيد المراجعة",
            creationDate: "١٧/٧/١٤٤٣ هـ",
            documents: [
              { id: "1", name: "بوليصة الشحن.pdf", type: "application/pdf", documentType: "bill_of_lading" },
              { id: "2", name: "فاتورة الشراء.pdf", type: "application/pdf", documentType: "import_invoices" },
            ],
            transportType: "trailer",
            transportTemperature: "refrigerated",
            departureCity: "jeddah",
            departureDistrict: "الميناء",
            arrivalCity: "riyadh",
            arrivalDistrict: "السلي",
            factoryContact: {
              name: "اسم المصنع",
              phone: "0555555555",
              email: "test@test.com",
              address: "عنوان المصنع",
            },
            shippingType: "fob",
          })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching order:", error)
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  // Handle order approval
  const handleApproveOrder = () => {
    // Update order status
    const updatedOrder = { ...order, status: "موافق عليه" }
    updateOrderInStorage(updatedOrder)
    setAdminResponse("approved")
    toast({
      title: "تمت الموافقة على الطلب",
      description: `تم تحديث حالة الطلب ${id} إلى موافق عليه`,
    })
  }

  // Handle order rejection
  const handleRejectOrder = () => {
    if (!rejectionReason) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال سبب الرفض",
        variant: "destructive",
      })
      return
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status: "مرفوض",
      rejectionReason,
    }
    updateOrderInStorage(updatedOrder)
    setAdminResponse("rejected")
    toast({
      title: "تم رفض الطلب",
      description: `تم تحديث حالة الطلب ${id} إلى مرفوض`,
    })
  }

  // Handle requesting additional documents
  const handleRequestDocuments = () => {
    const selectedDocs = additionalDocsList.filter((doc) => doc.required)

    if (selectedDocs.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المستندات المطلوبة",
        variant: "destructive",
      })
      return
    }

    // Update order status
    const updatedOrder = {
      ...order,
      status: "بانتظار مستندات إضافية",
      additionalDocsRequired: selectedDocs,
    }
    updateOrderInStorage(updatedOrder)
    setAdditionalDocsRequired(selectedDocs)
    setAdminResponse("additional_docs")
    toast({
      title: "تم طلب مستندات إضافية",
      description: `تم تحديث حالة الطلب ${id} إلى بانتظار مستندات إضافية`,
    })
  }

  // Update order in localStorage
  const updateOrderInStorage = (updatedOrder) => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const updatedOrders = storedOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
      setOrder(updatedOrder)
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  // Toggle additional document requirement
  const toggleDocumentRequired = (docId) => {
    setAdditionalDocsList(
      additionalDocsList.map((doc) => (doc.id === docId ? { ...doc, required: !doc.required } : doc)),
    )
  }

  // Get city name in Arabic
  const getCityName = (cityCode) => {
    const cities = {
      riyadh: "الرياض",
      jeddah: "جدة",
      dammam: "الدمام",
      makkah: "مكة المكرمة",
    }
    return cities[cityCode] || cityCode
  }

  // إضافة دالة إعادة فتح الطلب
  const handleReopenOrder = () => {
    const updatedOrder = { ...order, status: "قيد المراجعة" }
    updateOrderInStorage(updatedOrder)
    toast({
      title: "تم إعادة فتح الطلب",
      description: `تم تحديث حالة الطلب ${id} إلى قيد المراجعة`,
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg">جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-lg">لم يتم العثور على الطلب</p>
          <Button onClick={() => router.back()}>العودة للخلف</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* الشريط العلوي */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50 transition-colors duration-200"
              onClick={() => router.back()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{order.clientName}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="text-gray-500">رقم الطلب:</span>
                <span className="font-medium mx-1">{id}</span>
                <span className="mx-2">•</span>
                <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  تخليص وارد
                </Badge>
                <Badge
                  variant="outline"
                  className="ml-1 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                >
                  نقل
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">خيارات</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <Share2 className="h-4 w-4 ml-2" />
                  مشاركة الطلب
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
                  <Copy className="h-4 w-4 ml-2" />
                  نسخ رقم الطلب
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast({ title: "تم الإرسال", description: "تم إرسال تذكير للعميل" })}>
                  <Bell className="h-4 w-4 ml-2" />
                  إرسال تذكير
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "تم التحديث", description: "تم تحديث الطلب" })}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث الطلب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* القسم الرئيسي - 8 أعمدة */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* بطاقة تفاصيل الطلب */}
            <Card className="overflow-hidden border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">تفاصيل الطلب</CardTitle>
                      <CardDescription>المعلومات الأساسية للطلب</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1 bg-white shadow-sm">
                    <Clock className="h-3 w-3" />
                    {order.creationDate}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">رقم الطلب</div>
                    <div className="font-semibold text-lg">{id}</div>
                  </div>
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">رقم البوليصة</div>
                    <div className="font-semibold text-lg">
                      {policies.length > 0 ? policies[0].policyNumber : "غير متوفر"}
                    </div>
                  </div>
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">رقم البيان الجمركي</div>
                    <div className="font-semibold text-lg">
                      {customsDeclarations.length > 0 ? customsDeclarations[0].declarationNumber : "غير متوفر"}
                    </div>
                  </div>
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">اسم العميل</div>
                    <div className="font-semibold text-lg">{order.clientName}</div>
                  </div>
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">المنفذ</div>
                    <div className="font-semibold text-lg">{policies.length > 0 ? policies[0].port : "غير متوفر"}</div>
                  </div>
                  <div className="space-y-1 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="text-xs text-gray-500">الحالة</div>
                    <div className="font-semibold text-lg">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Plus className="h-4 w-4 ml-1" />
                    إجراءات سريعة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                      onClick={() => setIsPolicyDialogOpen(true)}
                    >
                      <FileText className="h-4 w-4 ml-1" />
                      إضافة بوليصة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200"
                      onClick={() => setIsSialDialogOpen(true)}
                    >
                      <Package className="h-4 w-4 ml-1" />
                      إضافة سال
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors duration-200"
                      onClick={() => setIsCustomsDialogOpen(true)}
                    >
                      <FileCheck className="h-4 w-4 ml-1" />
                      بيان جمركي
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors duration-200"
                      onClick={() => setIsPurchaseInvoiceDialogOpen(true)}
                    >
                      <Calculator className="h-4 w-4 ml-1" />
                      فاتورة شراء
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors duration-200"
                      onClick={() => setIsTransportDialogOpen(true)}
                    >
                      <Truck className="h-4 w-4 ml-1" />
                      إضافة نقل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أزرار التبديل بين المعلومات والتتبع */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative ${
                    activeTab === "operations"
                      ? "text-blue-600 bg-blue-50/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab("operations")}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${activeTab === "operations" ? "bg-blue-100" : "bg-gray-100"}`}>
                      <FileText
                        className={`h-5 w-5 ${activeTab === "operations" ? "text-blue-600" : "text-gray-500"}`}
                      />
                    </div>
                    <span>معلومات الطلب</span>
                  </div>
                  {activeTab === "operations" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-md"></div>
                  )}
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 relative ${
                    activeTab === "tracking"
                      ? "text-blue-600 bg-blue-50/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setActiveTab("tracking")
                    setShowTimeline(true)
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${activeTab === "tracking" ? "bg-blue-100" : "bg-gray-100"}`}>
                      <Truck className={`h-5 w-5 ${activeTab === "tracking" ? "text-blue-600" : "text-gray-500"}`} />
                    </div>
                    <span>تتبع الطلب</span>
                  </div>
                  {activeTab === "tracking" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-md"></div>
                  )}
                </button>
              </div>
            </div>

            {/* المخطط الزمني */}
            {showTimeline && (
              <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Clock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">المخطط الزمني للطلب</CardTitle>
                        <CardDescription>تسلسل الأحداث والإجراءات</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-full"
                      onClick={() => setShowTimeline(!showTimeline)}
                    >
                      {showTimeline ? "إخفاء" : "عرض"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Timeline />
                </CardContent>
              </Card>
            )}

            {/* محتوى التبويبات */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Tabs value={activeTab} className="mt-0">
                <TabsContent value={activeTab} className="mt-0">
                  {/* محتوى التبويبات الحالي */}
                  {activeTab === "operations" && (
                    <div className="p-6 space-y-6">
                      {/* البوليصة - عرض فقط إذا كانت موجودة */}
                      {policies.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <div className="p-2 rounded-full bg-blue-100 ml-2">
                              <FileCheck className="h-5 w-5 text-blue-600" />
                            </div>
                            البوليصات
                            <Badge className="mr-2" variant="outline">
                              {policies.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {policies.map((policy) => (
                              <TicketCardImproved
                                key={policy.id}
                                type="policy"
                                title={`بوليصة شحن ${policy.policyNumber}`}
                                summary={`من ${policy.originCountry} إلى ${policy.destinationCountry}`}
                                date={policy.date || "غير محدد"}
                                reference={policy.policyNumber}
                                status="نشط"
                                hasAttachments={true}
                                onView={() => setActiveTab("policy")}
                                onViewAttachments={() => {
                                  toast({
                                    title: "عرض المرفقات",
                                    description: "جاري عرض مرفقات البوليصة",
                                  })
                                }}
                                onEdit={() => {
                                  toast({
                                    title: "تعديل البوليصة",
                                    description: "جاري فتح نموذج تعديل البوليصة",
                                  })
                                }}
                                onDelete={() => {
                                  toast({
                                    title: "حذف البوليصة",
                                    description: "هل أنت متأكد من حذف البوليصة؟",
                                    variant: "destructive",
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* السال - عرض فقط إذا كانت موجودة */}
                      {sials.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <div className="p-2 rounded-full bg-purple-100 ml-2">
                              <Package className="h-5 w-5 text-purple-600" />
                            </div>
                            السال
                            <Badge className="mr-2" variant="outline">
                              {sials.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {sials.map((sial) => (
                              <TicketCardImproved
                                key={sial.id}
                                type="sial"
                                title={`سال ${sial.sialNumber || "غير محدد"}`}
                                summary={`عدد الطرود: ${sial.packages} - المبلغ: ${sial.amount}`}
                                date={sial.date}
                                reference={sial.sialNumber}
                                status={
                                  sial.status === "unpaid" ? "غير مسدد" : sial.status === "paid" ? "مسدد" : "مسدد جزئياً"
                                }
                                hasAttachments={true}
                                onView={() => setActiveTab("sial")}
                                onViewAttachments={() => {
                                  toast({
                                    title: "عرض المرفقات",
                                    description: "جاري عرض مرفقات السال",
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* البيانات الجمركية - عرض فقط إذا كانت موجودة */}
                      {customsDeclarations.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <div className="p-2 rounded-full bg-amber-100 ml-2">
                              <ShieldCheck className="h-5 w-5 text-amber-600" />
                            </div>
                            البيانات الجمركية
                            <Badge className="mr-2" variant="outline">
                              {customsDeclarations.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {customsDeclarations.map((customs) => (
                              <TicketCardImproved
                                key={customs.id}
                                type="customs"
                                title={`بيان جمركي ${customs.declarationNumber || "غير محدد"}`}
                                summary={`المبلغ: ${customs.amount}`}
                                date={customs.date}
                                reference={customs.declarationNumber}
                                status={
                                  customs.status === "unpaid"
                                    ? "غير مسدد"
                                    : customs.status === "paid"
                                      ? "مسدد"
                                      : "مسدد جزئياً"
                                }
                                hasAttachments={true}
                                onView={() => setActiveTab("customs")}
                                onViewAttachments={() => {
                                  toast({
                                    title: "عرض المرفقات",
                                    description: "جاري عرض مرفقات البيان الجمركي",
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* فواتير الشراء - عرض فقط إذا كانت موجودة */}
                      {purchaseInvoices.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <div className="p-2 rounded-full bg-green-100 ml-2">
                              <BarChart className="h-5 w-5 text-green-600" />
                            </div>
                            فواتير الشراء
                            <Badge className="mr-2" variant="outline">
                              {purchaseInvoices.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {purchaseInvoices.map((invoice) => (
                              <TicketCardImproved
                                key={invoice.id}
                                type="invoice"
                                title={`فاتورة شراء ${invoice.invoiceNumber}`}
                                summary={`المورد: ${invoice.supplier} - المبلغ: ${invoice.total} ريال`}
                                date={invoice.date}
                                reference={invoice.invoiceNumber}
                                status="مدفوع"
                                hasAttachments={true}
                                onView={() => setActiveTab("purchase-invoices")}
                                onViewAttachments={() => {
                                  toast({
                                    title: "عرض المرفقات",
                                    description: "جاري عرض مرفقات الفاتورة",
                                  })
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* معلومات النقل - عرض فقط إذا كانت موجودة */}
                      {transportLocations.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <div className="p-2 rounded-full bg-indigo-100 ml-2">
                              <MapPin className="h-5 w-5 text-indigo-600" />
                            </div>
                            معلومات النقل
                            <Badge className="mr-2" variant="outline">
                              {transportLocations.length}
                            </Badge>
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {transportLocations.map((location) => (
                              <TicketCardImproved
                                key={location.id}
                                type="transport"
                                title={`نقل من ${location.startLocationName} إلى ${location.endLocationName}`}
                                summary={`المسافة: ${location.distance} كم - الوقت المتوقع: ${location.estimatedTime}`}
                                date={location.date || "غير محدد"}
                                status="جاري النقل"
                                hasAttachments={false}
                                onView={() => setActiveTab("transport")}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* إذا لم تكن هناك أي بيانات */}
                      {policies.length === 0 &&
                        sials.length === 0 &&
                        customsDeclarations.length === 0 &&
                        purchaseInvoices.length === 0 &&
                        transportLocations.length === 0 && (
                          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <div className="bg-gray-50 inline-flex rounded-full p-3 mb-4">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">لا توجد بيانات حتى الآن</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              قم بإضافة بوليصة أو سال أو بيان جمركي أو فاتورة شراء أو معلومات نقل
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => setIsPolicyDialogOpen(true)}
                              >
                                <FileText className="h-4 w-4 ml-1" />
                                إضافة بوليصة
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => setIsSialDialogOpen(true)}
                              >
                                <Package className="h-4 w-4 ml-1" />
                                إضافة سال
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => setIsCustomsDialogOpen(true)}
                              >
                                <FileCheck className="h-4 w-4 ml-1" />
                                بيان جمركي
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* زر إضافة جديد */}
                      {(policies.length > 0 ||
                        sials.length > 0 ||
                        customsDeclarations.length > 0 ||
                        purchaseInvoices.length > 0 ||
                        transportLocations.length > 0) && (
                        <div className="flex justify-center mt-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                                <Plus className="h-4 w-4 ml-2" />
                                إضافة جديد
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => setIsPolicyDialogOpen(true)}>
                                <div className="p-1 rounded-full bg-blue-50 ml-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                إضافة بوليصة
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsSialDialogOpen(true)}>
                                <div className="p-1 rounded-full bg-purple-50 ml-2">
                                  <Package className="h-4 w-4 text-purple-600" />
                                </div>
                                إضافة سال
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsCustomsDialogOpen(true)}>
                                <div className="p-1 rounded-full bg-amber-50 ml-2">
                                  <FileCheck className="h-4 w-4 text-amber-600" />
                                </div>
                                بيان جمركي
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsPurchaseInvoiceDialogOpen(true)}>
                                <div className="p-1 rounded-full bg-green-50 ml-2">
                                  <Calculator className="h-4 w-4 text-green-600" />
                                </div>
                                فاتورة شراء
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setIsTransportDialogOpen(true)}>
                                <div className="p-1 rounded-full bg-indigo-50 ml-2">
                                  <Truck className="h-4 w-4 text-indigo-600" />
                                </div>
                                إضافة نقل
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  )}

                  {/* تتبع الطلب */}
                  {activeTab === "tracking" && (
                    <div className="p-6">
                      <Card className="bg-white shadow-sm border-0">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-full shadow-sm">
                                <Truck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold">تتبع الشحنة</CardTitle>
                                <CardDescription>آخر تحديثات حالة الشحنة</CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline" className="gap-1 bg-white">
                              <Clock className="h-3 w-3" />
                              آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {/* إضافة الخريطة التفاعلية */}
                          <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 flex items-center">
                              <MapPin className="h-5 w-5 ml-2 text-blue-600" />
                              خريطة تتبع الشحنة
                            </h3>
                            {MapComponent && (
                              <MapComponent
                                startLocation={[24.7136, 46.6753]} // الرياض
                                endLocation={[21.4858, 39.1925]} // جدة
                                currentLocation={[23.8859, 45.0792]} // نقطة في المنتصف
                              />
                            )}
                          </div>

                          {/* إضافة مكون إحصائيات الشحنة هنا */}
                          <ShipmentStatsCard />

                          {/* إضافة مكون الرسوم البيانية */}
                          <ShipmentCharts />

                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-3 flex items-center">
                              <Clock className="h-5 w-5 ml-2 text-blue-600" />
                              سجل التحديثات
                            </h3>
                            <div className="relative">
                              <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-gray-200 z-0"></div>

                              <ScrollArea className="h-[400px] pr-2">
                                <div className="space-y-6">
                                  <div className="relative z-10">
                                    <div className="flex items-center mb-2">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ml-2 border-4 border-white shadow-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">تم استلام الطلب</div>
                                        <div className="text-sm text-muted-foreground">12/04/2025</div>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
                                        مكتمل
                                      </Badge>
                                    </div>
                                    <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm shadow-sm">
                                      تم استلام طلبك وجاري تجهيزه للشحن
                                    </div>
                                  </div>

                                  <div className="relative z-10">
                                    <div className="flex items-center mb-2">
                                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ml-2 border-4 border-white shadow-sm">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">تم شحن البضاعة</div>
                                        <div className="text-sm text-muted-foreground">15/04/2025</div>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
                                        مكتمل
                                      </Badge>
                                    </div>
                                    <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm shadow-sm">
                                      تم شحن البضاعة من المصدر وهي في طريقها إلى الميناء
                                    </div>
                                  </div>

                                  <div className="relative z-10">
                                    <div className="flex items-center mb-2">
                                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 border-4 border-white shadow-sm">
                                        <Truck className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">في الطريق</div>
                                        <div className="text-sm text-muted-foreground">17/04/2025</div>
                                      </div>
                                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300">
                                        جاري
                                      </Badge>
                                    </div>
                                    <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm shadow-sm">
                                      البضاعة في طريقها إلى الوجهة النهائية
                                    </div>
                                  </div>

                                  <div className="relative z-10">
                                    <div className="flex items-center mb-2">
                                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 border-4 border-white shadow-sm">
                                        <Package className="h-4 w-4 text-gray-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">التسليم النهائي</div>
                                        <div className="text-sm text-muted-foreground">متوقع: 20/04/2025</div>
                                      </div>
                                      <Badge variant="outline">قادم</Badge>
                                    </div>
                                    <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm shadow-sm">
                                      من المتوقع وصول الشحنة إلى الوجهة النهائية في هذا التاريخ
                                    </div>
                                  </div>

                                  <div className="relative z-10">
                                    <div className="flex items-center mb-2">
                                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 border-4 border-white shadow-sm">
                                        <FileCheck className="h-4 w-4 text-gray-600" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">التخليص الجمركي</div>
                                        <div className="text-sm text-muted-foreground">متوقع: 22/04/2025</div>
                                      </div>
                                      <Badge variant="outline">قادم</Badge>
                                    </div>
                                    <div className="mr-10 p-3 bg-gray-50 rounded-md text-sm shadow-sm">
                                      سيتم البدء في إجراءات التخليص الجمركي بعد وصول الشحنة
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
                            </div>

                            <div className="mt-6">
                              <Progress value={60} className="h-2 mb-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>استلام الطلب</span>
                                <span>في الطريق</span>
                                <span>التسليم النهائي</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 p-6 bg-gray-50 border-t">
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-md"
                            onClick={() => setIsUpdateStatusDialogOpen(true)}
                          >
                            <RefreshCw className="ml-2" size={16} />
                            تحديث حالة الشحنة
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* الشريط الجانبي - 4 أعمدة */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* بطاقة مدير المشروع */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">مدير المشروع</CardTitle>
                    <CardDescription>معلومات الاتصال</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                    <AvatarImage src="/diverse-group-city.png" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">محمد أحمد</h3>
                    <p className="text-sm text-gray-500">مدير المشروع</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-full">
                        <Phone className="h-3.5 w-3.5 ml-1" />
                        اتصال
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 rounded-full">
                        <Mail className="h-3.5 w-3.5 ml-1" />
                        مراسلة
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* بطاقة الإحصائيات */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">إحصائيات الطلب</CardTitle>
                    <CardDescription>ملخص البيانات</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">عدد المستندات</div>
                    <div className="font-bold text-2xl">
                      {policies.length + sials.length + customsDeclarations.length}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">عدد الفواتير</div>
                    <div className="font-bold text-2xl">{purchaseInvoices.length}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">عمليات النقل</div>
                    <div className="font-bold text-2xl">{transportLocations.length}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">نسبة الإنجاز</div>
                    <div className="font-bold text-2xl">60%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* بطاقة الإجراءات */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">إجراءات الطلب</CardTitle>
                    <CardDescription>الإجراءات المتاحة</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button className="w-full justify-start rounded-lg" variant="outline">
                    <Printer className="h-4 w-4 ml-2" />
                    طباعة تقرير الطلب
                  </Button>
                  <Button className="w-full justify-start rounded-lg" variant="outline">
                    <Download className="h-4 w-4 ml-2" />
                    تنزيل المستندات
                  </Button>
                  <Button className="w-full justify-start rounded-lg" variant="outline">
                    <Share2 className="h-4 w-4 ml-2" />
                    مشاركة الطلب
                  </Button>
                  <Button className="w-full justify-start rounded-lg" variant="outline">
                    <Bell className="h-4 w-4 ml-2" />
                    إرسال تذكير
                  </Button>
                  <Button className="w-full justify-start rounded-lg" variant="outline">
                    <RefreshCw className="h-4 w-4 ml-2" />
                    تحديث الطلب
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* الحوارات */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">تحديث حالة الشحنة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="font-medium">
                حالة الشحنة الجديدة
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status" className="rounded-lg">
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">تم استلام الطلب</SelectItem>
                  <SelectItem value="shipped">تم شحن البضاعة</SelectItem>
                  <SelectItem value="in_transit">في الطريق</SelectItem>
                  <SelectItem value="customs">في الجمارك</SelectItem>
                  <SelectItem value="out_for_delivery">جاري التوصيل</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="font-medium">
                ملاحظات إضافية
              </Label>
              <Textarea
                id="notes"
                placeholder="أضف ملاحظات إضافية حول حالة الشحنة"
                value={statusUpdateNote}
                onChange={(e) => setStatusUpdateNote(e.target.value)}
                className="min-h-[100px] rounded-lg"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)} className="rounded-lg">
              إلغاء
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "تم تحديث الحالة",
                  description: "تم تحديث حالة الشحنة بنجاح",
                })
                setIsUpdateStatusDialogOpen(false)
                setStatusUpdateNote("")
              }}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              تحديث الحالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Policy Dialog */}
      <AddPolicyDialog
        isOpen={isPolicyDialogOpen}
        onClose={() => setIsPolicyDialogOpen(false)}
        onSave={handleAddPolicy}
      />

      {/* SIAL Dialog */}
      <AddSialDialog isOpen={isSialDialogOpen} onClose={() => setIsSialDialogOpen(false)} onSave={handleAddSial} />

      {/* Add the Customs Declaration Dialog component after the SIAL Dialog */}
      <AddCustomsDialog
        operationNumber={id}
        policyNumber={policies.length > 0 ? policies[0].policyNumber : "21564120"}
        isOpen={isCustomsDialogOpen}
        onClose={() => setIsCustomsDialogOpen(false)}
        onSave={handleAddCustomsDeclaration}
      />

      <AddPurchaseInvoiceDialog
        isOpen={isPurchaseInvoiceDialogOpen}
        onClose={() => setIsPurchaseInvoiceDialogOpen(false)}
        onSave={handleAddPurchaseInvoice}
      />

      <AddTransportDialog
        isOpen={isTransportDialogOpen}
        onClose={() => setIsTransportDialogOpen(false)}
        onSave={handleAddTransportLocation}
      />

      {/* Request Missing Items Dialog */}
      <Dialog open={isRequestMissingItemsDialogOpen} onOpenChange={setIsRequestMissingItemsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">طلب نواقص</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
            {/* SABER Request */}
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب سابر",
                  description: "تم إرسال طلب سابر بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <FileCheck className="h-8 w-8" />
              <span>طلب سابر</span>
            </Button>

            {/* Other options can be added here */}
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب شهادة مطابقة",
                  description: "تم إرسال طلب شهادة مطابقة بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <FileText className="h-8 w-8" />
              <span>شهادة مطابقة</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب شهادة منشأ",
                  description: "تم إرسال طلب شهادة منشأ بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <FileText className="h-8 w-8" />
              <span>شهادة منشأ</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب شهادة صحية",
                  description: "تم إرسال طلب شهادة صحية بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <FileText className="h-8 w-8" />
              <span>شهادة صحية</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب تفويض",
                  description: "تم إرسال طلب تفويض بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <FileText className="h-8 w-8" />
              <span>تفويض</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-muted rounded-xl"
              onClick={() => {
                toast({
                  title: "طلب آخر",
                  description: "تم إرسال الطلب بنجاح",
                })
                setIsRequestMissingItemsDialogOpen(false)
              }}
            >
              <Plus className="h-8 w-8" />
              <span>طلب آخر</span>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestMissingItemsDialogOpen(false)} className="rounded-lg">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
