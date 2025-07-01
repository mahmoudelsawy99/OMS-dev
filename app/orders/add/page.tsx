"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function AddOrderPage() {
  const { register, control, handleSubmit } = useForm()
  const [items, setItems] = useState([])
  const [payments, setPayments] = useState([])
  const [attachments, setAttachments] = useState([])

  const onSubmit = (data) => {
    console.log(data)
    // Handle form submission
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 0, price: 0 }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const addPayment = () => {
    setPayments([...payments, { date: "", amount: 0, method: "" }])
  }

  const removePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index))
  }

  const handleFileChange = (e) => {
    setAttachments([...attachments, ...Array.from(e.target.files)])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">إضافة طلب جديد</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* تفاصيل الطلب */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orderNumber">رقم الطلب</Label>
                  <Input id="orderNumber" {...register("orderNumber")} />
                </div>
                <div>
                  <Label htmlFor="orderDate">تاريخ الطلب</Label>
                  <Input id="orderDate" type="date" {...register("orderDate")} />
                </div>
                <div>
                  <Label htmlFor="orderType">نوع الطلب</Label>
                  <Controller
                    name="orderType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الطلب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shipping">شحن</SelectItem>
                          <SelectItem value="clearance">تخليص</SelectItem>
                          <SelectItem value="transport">نقل</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="orderStatus">حالة الطلب</Label>
                  <Controller
                    name="orderStatus"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة الطلب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">جديد</SelectItem>
                          <SelectItem value="inProgress">قيد التنفيذ</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* تفاصيل العميل */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل العميل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">اسم العميل</Label>
                  <Input id="customerName" {...register("customerName")} />
                </div>
                <div>
                  <Label htmlFor="customerPhone">رقم الهاتف</Label>
                  <Input id="customerPhone" {...register("customerPhone")} />
                </div>
                <div>
                  <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                  <Input id="customerEmail" type="email" {...register("customerEmail")} />
                </div>
                <div>
                  <Label htmlFor="customerAddress">العنوان</Label>
                  <Textarea id="customerAddress" {...register("customerAddress")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* تفاصيل البنود */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تفاصيل البنود</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الكمية</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input {...register(`items.${index}.description`)} defaultValue={item.description} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" {...register(`items.${index}.quantity`)} defaultValue={item.quantity} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" {...register(`items.${index}.price`)} defaultValue={item.price} />
                    </TableCell>
                    <TableCell>{item.quantity * item.price}</TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" onClick={addItem} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              إضافة بند
            </Button>
          </CardContent>
        </Card>

        {/* تفاصيل المدفوعات */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تفاصيل المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input type="date" {...register(`payments.${index}.date`)} defaultValue={payment.date} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" {...register(`payments.${index}.amount`)} defaultValue={payment.amount} />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`payments.${index}.method`}
                        control={control}
                        defaultValue={payment.method}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر طريقة الدفع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">نقدي</SelectItem>
                              <SelectItem value="bankTransfer">تحويل بنكي</SelectItem>
                              <SelectItem value="cheque">شيك</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" onClick={addPayment} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              إضافة دفعة
            </Button>
          </CardContent>
        </Card>

        {/* المرفقات */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>المرفقات</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" multiple onChange={handleFileChange} className="mb-4" />
            {attachments.length > 0 && (
              <ul className="list-disc list-inside">
                {attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          حفظ الطلب
        </Button>
      </form>
    </div>
  )
}
