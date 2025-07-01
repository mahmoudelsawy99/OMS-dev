"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Calendar, Clock, Truck, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// استيراد Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

// بيانات وهمية لتغير السرعة خلال الرحلة
const speedData = {
  labels: ["الرياض", "الخرج", "المجمعة", "شقراء", "الدوادمي", "عفيف", "الطائف", "بحرة", "جدة"],
  datasets: [
    {
      label: "السرعة (كم/س)",
      data: [65, 80, 75, 82, 68, 72, 78, 70, 60],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "حد السرعة (كم/س)",
      data: [100, 100, 100, 100, 80, 80, 80, 80, 60],
      borderColor: "rgb(239, 68, 68)",
      backgroundColor: "rgba(239, 68, 68, 0)",
      borderDash: [5, 5],
      tension: 0.1,
      pointRadius: 0,
    },
  ],
}

// بيانات وهمية للوقت المستغرق بين النقاط
const timeData = {
  labels: [
    "الرياض - الخرج",
    "الخرج - المجمعة",
    "المجمعة - شقراء",
    "شقراء - الدوادمي",
    "الدوادمي - عفيف",
    "عفيف - الطائف",
    "الطائف - بحرة",
    "بحرة - جدة",
  ],
  datasets: [
    {
      label: "الوقت المستغرق (دقيقة)",
      data: [45, 60, 35, 50, 55, 90, 40, 30],
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      borderRadius: 6,
    },
  ],
}

// بيانات وهمية لنسبة المسافة المقطوعة والمتبقية
const distanceData = {
  labels: ["المسافة المقطوعة", "المسافة المتبقية"],
  datasets: [
    {
      data: [350, 450],
      backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(234, 179, 8, 0.8)"],
      borderColor: ["rgb(34, 197, 94)", "rgb(234, 179, 8)"],
      borderWidth: 1,
      hoverOffset: 4,
    },
  ],
}

// بيانات وهمية لاستهلاك الوقود
const fuelData = {
  labels: ["الرياض", "الخرج", "المجمعة", "شقراء", "الدوادمي", "عفيف", "الطائف", "بحرة", "جدة"],
  datasets: [
    {
      label: "استهلاك الوقود (لتر/100كم)",
      data: [32, 34, 30, 33, 36, 38, 35, 31, 30],
      borderColor: "rgb(249, 115, 22)",
      backgroundColor: "rgba(249, 115, 22, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
}

// خيارات الرسم البياني الخطي
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
    tooltip: {
      titleFont: {
        family: "Tajawal, sans-serif",
      },
      bodyFont: {
        family: "Tajawal, sans-serif",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
    x: {
      ticks: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
  },
}

// خيارات الرسم البياني الشريطي
const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
    tooltip: {
      titleFont: {
        family: "Tajawal, sans-serif",
      },
      bodyFont: {
        family: "Tajawal, sans-serif",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
    x: {
      ticks: {
        font: {
          family: "Tajawal, sans-serif",
        },
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
}

// خيارات الرسم البياني الدائري
const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          family: "Tajawal, sans-serif",
        },
      },
    },
    tooltip: {
      titleFont: {
        family: "Tajawal, sans-serif",
      },
      bodyFont: {
        family: "Tajawal, sans-serif",
      },
    },
  },
}

// مكون الرسوم البيانية
export default function ShipmentCharts() {
  const [activeTab, setActiveTab] = useState("speed")
  const [timeRange, setTimeRange] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // وظيفة لمحاكاة تحديث البيانات
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // وظيفة لمحاكاة تنزيل البيانات
  const handleDownload = () => {
    alert("جاري تنزيل البيانات...")
  }

  return (
    <Card className="bg-white shadow-sm border-0 mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">الرسوم البيانية للشحنة</CardTitle>
            <CardDescription>تحليل بياني لأداء الشحنة خلال الرحلة</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كامل الرحلة</SelectItem>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="week">آخر أسبوع</SelectItem>
                <SelectItem value="month">آخر شهر</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              آخر تحديث: {new Date().toLocaleTimeString("ar-SA")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="speed" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>السرعة</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>الوقت</span>
            </TabsTrigger>
            <TabsTrigger value="distance" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>المسافة</span>
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>الوقود</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            <TabsContent value="speed" className="mt-0">
              <div className="h-[400px] flex items-center justify-center">
                <Line data={speedData} options={lineOptions} />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <strong>تحليل السرعة:</strong> متوسط السرعة خلال الرحلة هو 72 كم/س، مع أعلى سرعة 82 كم/س عند شقراء
                  وأدنى سرعة 60 كم/س عند الوصول إلى جدة. تم الالتزام بحدود السرعة المقررة طوال الرحلة.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="time" className="mt-0">
              <div className="h-[400px] flex items-center justify-center">
                <Bar data={timeData} options={barOptions} />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <strong>تحليل الوقت:</strong> إجمالي الوقت المستغرق حتى الآن هو 6 ساعات و 45 دقيقة. أطول فترة كانت بين
                  عفيف والطائف (90 دقيقة) بسبب طبيعة الطريق الجبلية، وأقصر فترة كانت بين بحرة وجدة (30 دقيقة).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="distance" className="mt-0">
              <div className="h-[400px] flex items-center justify-center">
                <div className="w-1/2 h-full flex flex-col items-center justify-center">
                  <Doughnut data={distanceData} options={doughnutOptions} />
                </div>
                <div className="w-1/2 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">تفاصيل المسافة</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">المسافة الإجمالية</span>
                        <span className="text-sm font-bold">800 كم</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">المسافة المقطوعة</span>
                        <span className="text-sm font-bold">350 كم (44%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "44%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">المسافة المتبقية</span>
                        <span className="text-sm font-bold">450 كم (56%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "56%" }}></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">المسافة المقطوعة اليوم</div>
                          <div className="text-lg font-bold">120 كم</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">المتوسط اليومي</div>
                          <div className="text-lg font-bold">175 كم</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fuel" className="mt-0">
              <div className="h-[400px] flex items-center justify-center">
                <Line data={fuelData} options={lineOptions} />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <strong>تحليل استهلاك الوقود:</strong> متوسط استهلاك الوقود خلال الرحلة هو 33 لتر/100كم. زاد الاستهلاك
                  في المناطق الجبلية (عفيف - الطائف) إلى 38 لتر/100كم، بينما انخفض في المناطق المستوية إلى 30 لتر/100كم.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">ملاحظة:</span> البيانات تقديرية وقد تتغير حسب ظروف الطريق والطقس
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              تحديث
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              تنزيل البيانات
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
