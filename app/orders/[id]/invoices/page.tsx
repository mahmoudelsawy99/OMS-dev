"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Share2, FileText, Package, Paperclip, Eye, Download, File, X } from "lucide-react"
import { AddInvoiceDialog } from "./add-invoice-dialog"
import Image from "next/image"

interface Attachment {
  name: string
  type: string
  url: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  itemsCount: number
  totalAmount: number
  currency: string
  items: Array<{
    description: string
    quantity: number
    amount: number
  }>
  attachments: Attachment[]
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      date: "٢٥/٠٣/١٤٤٥",
      itemsCount: 3,
      totalAmount: 15000,
      currency: "SAR",
      items: [
        { description: "منتج 1", quantity: 2, amount: 5000 },
        { description: "منتج 2", quantity: 1, amount: 5000 },
      ],
      attachments: [
        { name: "فاتورة-001.pdf", type: "pdf", url: "/path/to/invoice-001.pdf" },
        { name: "صورة-المنتج.jpg", type: "image", url: "/path/to/product-image.jpg" },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      date: "٢٦/٠٣/١٤٤٥",
      itemsCount: 2,
      totalAmount: 8500,
      currency: "SAR",
      items: [
        { description: "منتج 3", quantity: 1, amount: 3500 },
        { description: "منتج 4", quantity: 1, amount: 5000 },
      ],
      attachments: [{ name: "فاتورة-002.pdf", type: "pdf", url: "/path/to/invoice-002.pdf" }],
    },
  ])

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "image":
        return <File className="h-5 w-5 text-blue-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const handlePreview = (attachment: Attachment) => {
    setSelectedAttachment(attachment)
  }

  const handleDownload = (attachment: Attachment) => {
    console.log("Download", attachment)
    const link = document.createElement("a")
    link.href = attachment.url
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">فواتير الشراء</h1>
        <AddInvoiceDialog onInvoiceAdd={(invoice) => setInvoices([...invoices, invoice])} />
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedInvoice(invoice)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-slate-100">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
                <div className="space-y-1 mr-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">فاتورة رقم {invoice.invoiceNumber}</h3>
                    <span className="text-sm text-muted-foreground">• {invoice.date}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 ml-1" />
                      {invoice.itemsCount} بنود
                    </div>
                    {invoice.attachments.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 ml-1" />
                        {invoice.attachments.length} مرفقات
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  {invoice.totalAmount} {invoice.currency}
                </div>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الفاتورة - {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">رقم الفاتورة</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التاريخ</p>
                  <p className="font-medium">{selectedInvoice.date}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">البنود</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.amount} {selectedInvoice.currency}
                        </TableCell>
                        <TableCell>
                          {item.quantity * item.amount} {selectedInvoice.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="font-semibold mb-2">المرفقات</h3>
                {selectedInvoice?.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedInvoice.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded-md">
                        {getFileIcon(attachment.type)}
                        <span className="flex-grow truncate">{attachment.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(attachment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(attachment)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">لا توجد مرفقات</p>
                )}
              </div>

              <div className="flex justify-end">
                <div className="text-xl font-bold">
                  الإجمالي: {selectedInvoice.totalAmount} {selectedInvoice.currency}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Dialog for Attachment Preview */}
      <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedAttachment?.name}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAttachment(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedAttachment?.type === "pdf" ? (
              <iframe src={selectedAttachment.url} className="w-full h-[70vh]" title={selectedAttachment.name} />
            ) : selectedAttachment?.type === "image" ? (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedAttachment.url || "/placeholder.svg"}
                  alt={selectedAttachment.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <p>لا يمكن عرض هذا الملف مباشرة. يرجى تنزيله لعرضه.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
