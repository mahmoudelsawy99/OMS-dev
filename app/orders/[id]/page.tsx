"use client"
import dynamic from "next/dynamic"
import OrderDetailsPage from "./order-details"

// استيراد مكون الخريطة بشكل ديناميكي لتجنب مشاكل SSR
const MapComponent = dynamic(() => import("../../../components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
})

export default function OrderDetails() {
  return <OrderDetailsPage MapComponent={MapComponent} />
}
