"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// تعريف الأيقونات خارج المكون لتجنب إعادة إنشائها في كل مرة
let startIcon
let endIcon
let currentIcon

// تهيئة الأيقونات عند تحميل المكون
const initializeIcons = () => {
  // تأكد من أننا في بيئة المتصفح
  if (typeof window !== "undefined") {
    // تعريف الأيقونات
    startIcon = new L.Icon({
      iconUrl: "/marker-start.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    })

    endIcon = new L.Icon({
      iconUrl: "/marker-end.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    })

    currentIcon = new L.Icon({
      iconUrl: "/marker-current.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "/marker-shadow.png",
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    })
  }
}

// إضافة مكون للتحكم بالخريطة بعد تعريف الأيقونات وقبل مكون الخريطة الرئيسي
// أضف هذا المكون بعد تعريف الأيقونات وقبل مكون MapComponent
const MapControls = ({ center }) => {
  const map = useMap()

  // وظيفة للعودة إلى المركز
  const handleReturnToCenter = () => {
    map.flyTo(center, 6, {
      animate: true,
      duration: 1.5,
    })
  }

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: "60px" }}>
      <div className="leaflet-control leaflet-bar flex flex-col">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center border-b border-gray-300 rounded-t-md"
          aria-label="تكبير"
          title="تكبير"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center border-b border-gray-300"
          aria-label="تصغير"
          title="تصغير"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>
        <button
          onClick={handleReturnToCenter}
          className="w-10 h-10 bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center rounded-b-md"
          aria-label="العودة للمركز"
          title="العودة للمركز"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

// مكون الخريطة
const MapComponent = ({ startLocation, endLocation, currentLocation }) => {
  const [iconsReady, setIconsReady] = useState(false)

  // تهيئة الأيقونات عند تحميل المكون
  useEffect(() => {
    initializeIcons()
    setIconsReady(true)
  }, [])

  // إحداثيات المواقع
  const startCoords = startLocation || [24.7136, 46.6753] // الرياض
  const endCoords = endLocation || [21.4858, 39.1925] // جدة
  const currentCoords = currentLocation || [23.8859, 45.0792] // نقطة في المنتصف

  // حساب مركز الخريطة
  const center = [(startCoords[0] + endCoords[0]) / 2, (startCoords[1] + endCoords[1]) / 2]

  // مسار الشحنة
  const shipmentPath = [startCoords, currentCoords, endCoords]

  // إذا لم تكن الأيقونات جاهزة بعد، عرض شاشة التحميل
  if (!iconsReady) {
    return (
      <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md border border-gray-200 relative">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false} // إزالة أزرار التكبير/التصغير الافتراضية
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={startCoords} icon={startIcon}>
          <Popup>
            <div className="text-center">
              <strong>نقطة الانطلاق</strong>
              <p>الرياض</p>
            </div>
          </Popup>
        </Marker>
        <Marker position={endCoords} icon={endIcon}>
          <Popup>
            <div className="text-center">
              <strong>الوجهة النهائية</strong>
              <p>جدة</p>
            </div>
          </Popup>
        </Marker>
        <Marker position={currentCoords} icon={currentIcon}>
          <Popup>
            <div className="text-center">
              <strong>الموقع الحالي للشحنة</strong>
              <p>في الطريق</p>
              <p className="text-xs text-gray-500">آخر تحديث: 17/04/2025</p>
            </div>
          </Popup>
        </Marker>
        <Polyline positions={shipmentPath} color="#3b82f6" weight={4} opacity={0.7} dashArray="10,10" />

        {/* إضافة أزرار التحكم المخصصة */}
        <MapControls center={center} />
      </MapContainer>

      {/* معلومات الشحنة */}
      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg z-[1000] border border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">المسافة المتبقية</div>
            <div className="text-base font-bold">450 كم</div>
            <div className="text-xs text-blue-600">المقطوعة: 350 كم</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">الوقت المتوقع للوصول</div>
            <div className="text-base font-bold">20/04/2025</div>
            <div className="text-xs text-blue-600">متبقي: 6 ساعات</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">السرعة الحالية</div>
            <div className="text-base font-bold">75 كم/س</div>
            <div className="text-xs text-blue-600">متوسط: 70 كم/س</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapComponent
