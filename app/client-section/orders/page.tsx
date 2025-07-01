"use client"

import { useState } from "react"
import { ArrowDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from "@/components/protected-route"

// Sample data for orders
const orders = [
  {
    id: "OP00001",
    policyNumber: "POL-12345",
    clientName: "شركة الفا للتجارة",
    serviceType: "شحن",
    status: "قيد المراجعة",
    createdAt: "25/03/1445",
  },
  {
    id: "OP00002",
    policyNumber: "POL-12346",
    clientName: "احمد محمد",
    serviceType: "تخليص جمركي - نقل",
    status: "موافق عليه",
    createdAt: "24/03/1445",
  },
  {
    id: "OP00003",
    policyNumber: "POL-12347",
    clientName: "مؤسسة النور",
    serviceType: "تخليص جمركي",
    status: "مرفوض",
    createdAt: "23/03/1445",
  },
  {
    id: "OP00004",
    policyNumber: "POL-12348",
    clientName: "خالد عبدالله",
    serviceType: "نقل",
    status: "بانتظار مستندات إضافية",
    createdAt: "22/03/1445",
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color = ""

  switch (status) {
    case "موافق عليه":
      color = "bg-green-50 text-green-700"
      break
    case "قيد المراجعة":
      color = "bg-blue-50 text-blue-700"
      break
    case "مرفوض":
      color = "bg-red-50 text-red-700"
      break
    case "بانتظار مستندات إضافية":
      color = "bg-yellow-50 text-yellow-700"
      break
    default:
      color = "bg-gray-50 text-gray-700"
  }

  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>
}

export default function ClientSectionOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" className="text-gray-600">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>

          <div className="flex items-center gap-2">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
                <SelectItem value="بانتظار">بانتظار مستندات إضافية</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="option1">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حسب النظام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">حسب النظام</SelectItem>
                <SelectItem value="option2">الخيار الثاني</SelectItem>
                <SelectItem value="option3">الخيار الثالث</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg border">
          <div className="grid grid-cols-7 gap-4 p-4 border-b text-sm font-medium text-gray-500">
            <div className="text-center">الإعدادات</div>
            <div className="flex items-center justify-end gap-1">
              تاريخ الإنشاء
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">
              حالة الطلب
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">نوع الخدمة</div>
            <div className="flex items-center justify-end gap-1">
              اسم العميل
              <ArrowDown className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-end gap-1">رقم البوليصة</div>
            <div className="flex items-center justify-end gap-1">
              رقم الطلب
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-7 gap-4 p-4 text-sm hover:bg-gray-50">
                <div className="text-center">...</div>
                <div className="text-end">{order.createdAt}</div>
                <div className="text-end">
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-end">{order.serviceType}</div>
                <div className="text-end font-medium">{order.clientName}</div>
                <div className="text-end text-gray-500">
                  <button
                    onClick={() => (window.location.href = `/client-section/orders/details/${order.id}?view=client`)}
                    className="hover:underline cursor-pointer"
                  >
                    {order.policyNumber}
                  </button>
                </div>
                <div className="text-end text-blue-600">
                  <button
                    onClick={() => (window.location.href = `/client-section/orders/details/${order.id}?view=client`)}
                    className="hover:underline cursor-pointer"
                  >
                    {order.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
