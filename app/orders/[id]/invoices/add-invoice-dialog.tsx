"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Paperclip } from "lucide-react"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  originCountry: string
  currency: string
  amount: number
}

interface AddInvoiceDialogProps {
  onInvoiceAdd: (invoice: any) => void
}

export function AddInvoiceDialog({ onInvoiceAdd }: AddInvoiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({})
  const [attachments, setAttachments] = useState<File[]>([])

  const addItem = () => {
    if (newItem.description && newItem.quantity && newItem.amount) {
      setItems([
        ...items,
        {
          id: Math.random().toString(36).substr(2, 9),
          description: newItem.description || "",
          quantity: newItem.quantity || 0,
          originCountry: newItem.originCountry || "",
          currency: newItem.currency || "SAR",
          amount: newItem.amount || 0,
        },
      ])
      setNewItem({})
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount * item.quantity, 0)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSaveInvoice = () => {
    const newInvoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      date: new Date().toLocaleDateString("ar-SA"),
      itemsCount: items.length,
      totalAmount: calculateTotal(),
      currency: items[0]?.currency || "SAR",
      items: items,
      attachments: attachments.map((file) => file.name), // We're just saving file names for this example
    }

    onInvoiceAdd(newInvoice)
    setOpen(false)
    setItems([])
    setNewItem({})
    setAttachments([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة فاتورة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl mb-6">إضافة فاتورة شراء جديدة</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right">رقم الفاتورة</Label>
              <Input dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label className="text-right">التاريخ</Label>
              <Input type="date" className="text-right" />
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="text-right">المرفقات</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                multiple
              />
              <Button type="button" size="sm" variant="outline">
                <Paperclip className="h-4 w-4 ml-2" />
                إضافة مرفقات
              </Button>
            </div>
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <span>{file.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Items Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">بلد المنشأ</TableHead>
                  <TableHead className="text-right">العملة</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">المجموع</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.originCountry}</TableCell>
                    <TableCell>{item.currency}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.amount * item.quantity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Input
                      placeholder="الوصف"
                      value={newItem.description || ""}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="الكمية"
                      value={newItem.quantity || ""}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={newItem.originCountry}
                      onValueChange={(value) => setNewItem({ ...newItem, originCountry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="بلد المنشأ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SA">السعودية</SelectItem>
                        <SelectItem value="AE">الإمارات</SelectItem>
                        <SelectItem value="CN">الصين</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={newItem.currency}
                      onValueChange={(value) => setNewItem({ ...newItem, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي</SelectItem>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="المبلغ"
                      value={newItem.amount || ""}
                      onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>{newItem.amount && newItem.quantity ? newItem.amount * newItem.quantity : 0}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={addItem}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>المجموع:</span>
                <span>{calculateTotal()} ريال</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>الإجمالي:</span>
                <span>{calculateTotal()} ريال</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="button" className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleSaveInvoice}>
              حفظ الفاتورة
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
