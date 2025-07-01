"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Trash2 } from "lucide-react"

interface AddPurchaseInvoiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

interface InvoiceItem {
  id: number
  item: string
  description: string
  quantity: number
  originCountry: string
  currency: string
  amount: number
}

export function AddPurchaseInvoiceDialog({ isOpen, onClose, onSave }: AddPurchaseInvoiceDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [date, setDate] = useState("")
  const [supplier, setSupplier] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      item: "",
      description: "",
      quantity: 0,
      originCountry: "",
      currency: "SAR",
      amount: 0,
    },
  ])

  const [attachments, setAttachments] = useState<File[]>([])
  const [fileToDelete, setFileToDelete] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.15
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        item: "",
        description: "",
        quantity: 0,
        originCountry: "",
        currency: "SAR",
        amount: 0,
      },
    ])
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    setItems(newItems)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.dataTransfer.files)])
    }
  }

  const handleDeleteFile = (index: number) => {
    setFileToDelete(index)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteFile = () => {
    if (fileToDelete !== null) {
      const newAttachments = [...attachments]
      newAttachments.splice(fileToDelete, 1)
      setAttachments(newAttachments)
    }
    setShowDeleteConfirm(false)
    setFileToDelete(null)
  }

  const cancelDeleteFile = () => {
    setShowDeleteConfirm(false)
    setFileToDelete(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      invoiceNumber,
      date,
      supplier,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      attachments,
    })
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-right">إضافة فاتورة شراء جديدة</DialogTitle>
            <Button className="absolute left-4 top-4 p-2 h-auto" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-right block">رقم الفاتورة</label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="text-right" />
              </div>
              <div className="space-y-2">
                <label className="text-right block">التاريخ</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-right" />
              </div>
              <div className="space-y-2">
                <label className="text-right block">المورد</label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier1">مورد 1</SelectItem>
                    <SelectItem value="supplier2">مورد 2</SelectItem>
                    <SelectItem value="supplier3">مورد 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-7 gap-4 mb-4 text-right font-medium">
                <div>البند</div>
                <div>الوصف</div>
                <div>الكمية</div>
                <div>بلد المنشأ</div>
                <div>العملة</div>
                <div>المبلغ</div>
                <div>المجموع</div>
              </div>

              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-7 gap-4 mb-4">
                  <Input
                    value={item.item}
                    onChange={(e) => handleItemChange(index, "item", e.target.value)}
                    className="text-right"
                  />
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="text-right"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", Number.parseFloat(e.target.value))}
                    className="text-right"
                  />
                  <Select
                    value={item.originCountry}
                    onValueChange={(value: string) => handleItemChange(index, "originCountry", value)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="بلد..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SA">السعودية</SelectItem>
                      <SelectItem value="AE">الإمارات</SelectItem>
                      <SelectItem value="CN">الصين</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={item.currency} onValueChange={(value: string) => handleItemChange(index, "currency", value)}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي</SelectItem>
                      <SelectItem value="USD">دولار أمريكي</SelectItem>
                      <SelectItem value="EUR">يورو</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, "amount", Number.parseFloat(e.target.value))}
                    className="text-right"
                  />
                  <div className="flex items-center justify-end">
                    {(item.quantity || 0) * (item.amount || 0)} {item.currency}
                  </div>
                </div>
              ))}

              <Button type="button" onClick={handleAddItem} className="mt-4">
                + إضافة بند
              </Button>
            </div>

            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>{calculateSubtotal()} ريال</span>
                <span>المجموع:</span>
              </div>
              <div className="flex justify-between">
                <span>{calculateTax()} ريال</span>
                <span>الضريبة (15%):</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>{calculateTotal()} ريال</span>
                <span>الإجمالي:</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-right mb-4 font-medium">المرفقات</h3>
              
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">اسحب وأفلت الملفات هنا أو انقر للتصفح</p>
                <p className="text-gray-400 text-sm mt-1">PDF, JPG, PNG</p>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-right font-medium">الملفات المرفقة ({attachments.length})</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <Button 
                        type="button" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                        onClick={() => handleDeleteFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="text-right">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-start">
              <Button type="submit" className="bg-primary text-white">
                حفظ الفاتورة
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">تأكيد الحذف</DialogTitle>
              <DialogDescription className="text-right">هل أنت متأكد من حذف هذا الملف؟</DialogDescription>
            </DialogHeader>
            <div className="flex justify-start gap-2 mt-4">
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={confirmDeleteFile}>
                نعم، حذف الملف
              </Button>
              <Button className="border border-gray-300 hover:bg-gray-50" onClick={cancelDeleteFile}>
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
