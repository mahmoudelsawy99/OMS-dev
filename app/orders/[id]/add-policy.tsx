"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export function AddPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white">
          <Plus className="h-4 w-4 ml-1" />
          إضافة بوليصة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-right text-xl mb-6">إضافة بوليصة جديدة</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-right">رقم البوليصة</Label>
              <Input dir="rtl" />
            </div>

            <div className="space-y-2">
              <Label className="text-right">اسم المصدر</Label>
              <Input dir="rtl" />
            </div>

            <div className="space-y-2">
              <Label className="text-right">اسم المستورد</Label>
              <Input dir="rtl" />
            </div>

            <div className="space-y-2">
              <Label className="text-right">بلد القدوم</Label>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                  <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                  <SelectItem value="kw">الكويت</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">بلد الوصول</Label>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                  <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                  <SelectItem value="kw">الكويت</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-right">المنفذ</Label>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر المنفذ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="port1">منفذ 1</SelectItem>
                  <SelectItem value="port2">منفذ 2</SelectItem>
                  <SelectItem value="port3">منفذ 3</SelectItem>
                  {/* Add more ports as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-right">عدد الطرود</Label>
                <Input type="number" min="1" defaultValue="1" dir="rtl" />
              </div>

              <div className="space-y-2">
                <Label className="text-right">الوزن</Label>
                <Input type="number" step="0.1" dir="rtl" />
              </div>

              <div className="space-y-2">
                <Label className="text-right">الوحدة</Label>
                <Select defaultValue="kg">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الوحدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">KG</SelectItem>
                    <SelectItem value="ton">طن</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
