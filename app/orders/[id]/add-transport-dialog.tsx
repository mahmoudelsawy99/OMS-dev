"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, MapPin, Navigation } from "lucide-react"

export function AddTransportDialog({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    startLocationName: "",
    startLat: "",
    startLng: "",
    endLocationName: "",
    endLat: "",
    endLng: "",
    distance: "",
    estimatedTime: "",
    mapImageUrl: "/placeholder.svg?height=400&width=600",
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        startLocationName: "ميناء جدة الإسلامي",
        startLat: "21.4858",
        startLng: "39.1658",
        endLocationName: "مستودع الرياض المركزي",
        endLat: "24.7136",
        endLng: "46.6753",
        distance: "949",
        estimatedTime: "9 ساعات و 30 دقيقة",
        mapImageUrl: "/placeholder.svg?height=400&width=600",
      })
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  // Simulate map interaction
  const handleMapClick = (type) => {
    // In a real implementation, this would interact with a map API
    // For now, we'll just simulate setting coordinates
    if (type === "start") {
      setFormData((prev) => ({
        ...prev,
        startLat: (21.4858 + Math.random() * 0.01).toFixed(4),
        startLng: (39.1658 + Math.random() * 0.01).toFixed(4),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        endLat: (24.7136 + Math.random() * 0.01).toFixed(4),
        endLng: (46.6753 + Math.random() * 0.01).toFixed(4),
      }))
    }
  }

  // Calculate distance and time (simplified)
  useEffect(() => {
    if (formData.startLat && formData.startLng && formData.endLat && formData.endLng) {
      // In a real app, this would call a routing API
      // For demo purposes, we'll use the pre-filled values
      setFormData((prev) => ({
        ...prev,
        distance: "949",
        estimatedTime: "9 ساعات و 30 دقيقة",
      }))
    }
  }, [formData.startLat, formData.startLng, formData.endLat, formData.endLng])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">إضافة معلومات النقل</DialogTitle>
          <Button variant="ghost" className="h-6 w-6 p-0 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startLocationName">نقطة الانطلاق</Label>
              <Input
                id="startLocationName"
                name="startLocationName"
                value={formData.startLocationName}
                onChange={handleChange}
                placeholder="مثال: ميناء جدة الإسلامي"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endLocationName">نقطة الوصول</Label>
              <Input
                id="endLocationName"
                name="endLocationName"
                value={formData.endLocationName}
                onChange={handleChange}
                placeholder="مثال: مستودع الرياض المركزي"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>إحداثيات نقطة الانطلاق</Label>
              <div className="flex gap-2">
                <Input
                  name="startLat"
                  value={formData.startLat}
                  onChange={handleChange}
                  placeholder="خط العرض"
                  className="flex-1"
                  required
                />
                <Input
                  name="startLng"
                  value={formData.startLng}
                  onChange={handleChange}
                  placeholder="خط الطول"
                  className="flex-1"
                  required
                />
                <Button type="button" variant="outline" size="icon" onClick={() => handleMapClick("start")}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>إحداثيات نقطة الوصول</Label>
              <div className="flex gap-2">
                <Input
                  name="endLat"
                  value={formData.endLat}
                  onChange={handleChange}
                  placeholder="خط العرض"
                  className="flex-1"
                  required
                />
                <Input
                  name="endLng"
                  value={formData.endLng}
                  onChange={handleChange}
                  placeholder="خط الطول"
                  className="flex-1"
                  required
                />
                <Button type="button" variant="outline" size="icon" onClick={() => handleMapClick("end")}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="border rounded-lg p-2">
            <div className="h-64 w-full bg-gray-100 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Navigation className="h-8 w-8 mx-auto text-primary" />
                  <p className="text-muted-foreground">خريطة تفاعلية</p>
                  <p className="text-xs text-muted-foreground">انقر على الخريطة لتحديد نقاط الانطلاق والوصول</p>
                </div>
              </div>

              {/* Start Point Marker */}
              <div className="absolute" style={{ left: "20%", top: "60%" }}>
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-full mt-1 right-0 bg-white px-2 py-1 rounded shadow text-xs">
                  {formData.startLocationName}
                </div>
              </div>

              {/* End Point Marker */}
              <div className="absolute" style={{ left: "70%", top: "30%" }}>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="absolute top-full mt-1 right-0 bg-white px-2 py-1 rounded shadow text-xs">
                  {formData.endLocationName}
                </div>
              </div>

              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path d="M120,192 L420,96" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,5" fill="none" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distance">المسافة (كم)</Label>
              <Input
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="المسافة بالكيلومتر"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">وقت الوصول المتوقع</Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleChange}
                placeholder="مثال: 9 ساعات و 30 دقيقة"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
