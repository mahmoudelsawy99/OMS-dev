"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Trash2, Upload } from "lucide-react"

interface AddPolicyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (policyData: any) => void
}

export function AddPolicyDialog({ isOpen, onClose, onSave }: AddPolicyDialogProps) {
  const [policyData, setPolicyData] = useState({
    policyNumber: "",
    sourceName: "",
    importerName: "",
    originCountry: "",
    destinationCountry: "",
    port: "",
    packagesCount: "",
    weight: "",
    unit: "KG",
  })

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...policyData, attachments: attachedFiles })
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setPolicyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-right text-xl mb-6">إضافة بوليصة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* رقم البوليصة */}
            <div className="space-y-2">
              <Label className="text-right">رقم البوليصة</Label>
              <Input
                dir="rtl"
                value={policyData.policyNumber}
                onChange={(e) => handleChange("policyNumber", e.target.value)}
                required
              />
            </div>

            {/* اسم المصدر */}
            <div className="space-y-2">
              <Label className="text-right">اسم المصدر</Label>
              <Input
                dir="rtl"
                value={policyData.sourceName}
                onChange={(e) => handleChange("sourceName", e.target.value)}
                required
              />
            </div>

            {/* اسم المستورد */}
            <div className="space-y-2">
              <Label className="text-right">اسم المستورد</Label>
              <Input
                dir="rtl"
                value={policyData.importerName}
                onChange={(e) => handleChange("importerName", e.target.value)}
                required
              />
            </div>

            {/* بلد القدوم */}
            <div className="space-y-2">
              <Label className="text-right">بلد القدوم</Label>
              <Select value={policyData.originCountry} onValueChange={(value) => handleChange("originCountry", value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                  <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                  <SelectItem value="kw">الكويت</SelectItem>
                  <SelectItem value="bh">البحرين</SelectItem>
                  <SelectItem value="om">عمان</SelectItem>
                  <SelectItem value="qa">قطر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* بلد الوصول */}
            <div className="space-y-2">
              <Label className="text-right">بلد الوصول</Label>
              <Select
                value={policyData.destinationCountry}
                onValueChange={(value) => handleChange("destinationCountry", value)}
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                  <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                  <SelectItem value="kw">الكويت</SelectItem>
                  <SelectItem value="bh">البحرين</SelectItem>
                  <SelectItem value="om">عمان</SelectItem>
                  <SelectItem value="qa">قطر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* المنفذ */}
            <div className="space-y-2">
              <Label className="text-right">المنفذ</Label>
              <Select value={policyData.port} onValueChange={(value) => handleChange("port", value)}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر المنفذ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jeddah">ميناء جدة الإسلامي</SelectItem>
                  <SelectItem value="dammam">ميناء الملك عبدالعزيز بالدمام</SelectItem>
                  <SelectItem value="riyadh">المنفذ الجوي بالرياض</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* عدد الطرود والوزن والوحدة */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-right">عدد الطرود</Label>
                <Input
                  type="number"
                  min="1"
                  dir="rtl"
                  value={policyData.packagesCount}
                  onChange={(e) => handleChange("packagesCount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right">الوزن</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  dir="rtl"
                  value={policyData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right">الوحدة</Label>
                <Select value={policyData.unit} onValueChange={(value) => handleChange("unit", value)}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الوحدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KG">كيلوجرام</SelectItem>
                    <SelectItem value="TON">طن</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-right text-lg">المرفقات</h3>

            {attachedFiles.length > 0 ? (
              <div className="space-y-2 mb-4">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-md mb-4 bg-white">
                <p className="text-muted-foreground">لا توجد مرفقات</p>
              </div>
            )}

            <div className="flex justify-center mt-2">
              <Button
                variant="outline"
                onClick={() => setIsFileUploadOpen(true)}
                className="w-full md:w-auto bg-white hover:bg-blue-50"
              >
                <Upload className="h-4 w-4 ml-2" />
                إضافة مرفق
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90">
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
