"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useState } from "react"

interface AddSialDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function AddSialDialog({ isOpen, onClose, onSave }: AddSialDialogProps) {
  const [sialNumber, setSialNumber] = useState("")
  const [date, setDate] = useState("٢٥/٠٣/١٤٤٥")
  const [amount, setAmount] = useState("0.1")
  const [packages, setPackages] = useState("1")
  const [status, setStatus] = useState("unpaid")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      sialNumber,
      date,
      amount,
      packages,
      status,
      files: selectedFiles,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="flex justify-between items-start">
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="text-right">
            <DialogTitle className="text-xl mb-2">سال جديد</DialogTitle>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>رقم أمر التشغيل: OP00001</div>
              <div>رقم البوليصة: 21564120</div>
            </div>
          </div>
        </div>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right block">رقم سداد سال</Label>
              <Input
                className="text-right border-2"
                value={sialNumber}
                onChange={(e) => setSialNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">التاريخ</Label>
              <Input
                type="text"
                dir="rtl"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">المبلغ</Label>
              <Input
                type="number"
                dir="rtl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.1"
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">عدد الطرود</Label>
              <Input
                type="number"
                dir="rtl"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-right block">حالة السداد</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر حالة السداد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">غير مسدد</SelectItem>
                  <SelectItem value="paid">مسدد</SelectItem>
                  <SelectItem value="partial">مسدد جزئياً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right block">المرفقات</Label>
              <div className="mt-2">
                <div className="flex justify-between items-center border rounded-lg p-4">
                  <label htmlFor="sial-files">
                    <Button
                      type="button"
                      variant="default"
                      className="bg-[#14181F] hover:bg-[#14181F]/90 text-white"
                      onClick={() => document.getElementById("sial-files")?.click()}
                    >
                      اختيار الملفات
                    </Button>
                  </label>
                  <span className="text-muted-foreground">
                    {selectedFiles.length > 0 ? `تم اختيار ${selectedFiles.length} ملفات` : "*لم يتم اختيار أي ملف"}
                  </span>
                </div>
                <Input
                  id="sial-files"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files))
                    }
                  }}
                  multiple
                />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button type="submit" className="bg-[#14181F] text-white hover:bg-[#14181F]/90 px-8">
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
