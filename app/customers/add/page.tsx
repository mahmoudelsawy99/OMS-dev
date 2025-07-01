"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"

type CustomerType = "individual" | "company"

export default function AddCustomerPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("individual")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    const newId =
      "C" +
      Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")

    const newCustomer = {
      id: newId,
      name: customerType === "individual" ? data.fullName : data.companyName,
      type: customerType,
      phone: data.phone,
      email: data.email,
      ...data,
    }

    const existingCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
    const updatedCustomers = [...existingCustomers, newCustomer]
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    router.push("/customers")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">إضافة عميل</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Label>نوع العميل</Label>
          <RadioGroup
            defaultValue="individual"
            onValueChange={(value) => setCustomerType(value as CustomerType)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">فرد</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company">شركة</Label>
            </div>
          </RadioGroup>
        </div>

        {customerType === "company" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">اسم الشركة</Label>
              <Input id="companyName" {...register("companyName", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commercialRegister">رقم السجل التجاري</Label>
              <Input
                id="commercialRegister"
                type="number"
                {...register("commercialRegister", { required: true, minLength: 10, maxLength: 10 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي</Label>
              <Input id="taxNumber" type="number" {...register("taxNumber", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">اسم المدير</Label>
              <Input id="managerName" {...register("managerName", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerId">هوية المدير</Label>
              <Input
                id="managerId"
                type="number"
                {...register("managerId", { required: true, minLength: 10, maxLength: 10 })}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل</Label>
              <Input id="fullName" {...register("fullName", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idNumber">رقم الهوية</Label>
              <Input
                id="idNumber"
                type="number"
                {...register("idNumber", { required: true, minLength: 10, maxLength: 10 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">تاريخ الميلاد</Label>
              <Input id="birthDate" type="date" {...register("birthDate", { required: true })} />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الجوال</Label>
          <Input id="phone" type="number" {...register("phone", { required: true, minLength: 10, maxLength: 10 })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push("/customers")}>
            الرجوع
          </Button>
          <Button type="submit">حفظ</Button>
        </div>
      </form>
    </div>
  )
}
