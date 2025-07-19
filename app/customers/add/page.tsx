"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { customersAPI } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

type CustomerType = "individual" | "company"

export default function AddCustomerPage() {
  const [customerType, setCustomerType] = useState<CustomerType>("individual")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async (data: any) => {
    setLoading(true)
    
    try {
      // Prepare customer data based on type
      const customerData = {
        name: customerType === "individual" ? data.fullName : data.companyName,
        type: customerType,
        phone: data.phone,
        email: data.email,
        address: data.address || "",
        ...(customerType === "company" && {
          contactPerson: data.managerName,
          taxNumber: data.taxNumber,
          idNumber: data.commercialRegister,
        }),
        ...(customerType === "individual" && {
          idNumber: data.idNumber,
          birthDate: data.birthDate,
        }),
      }

      // Create customer via API
      const result = await customersAPI.create(customerData)
      
      if (result.success) {
        toast({
          title: "تم إضافة العميل بنجاح",
          description: `تم إضافة ${customerType === "individual" ? "العميل" : "الشركة"} بنجاح`,
        })
        
        // Reset form
        reset()
        
        // Navigate to customers list
        router.push("/customers")
      } else {
        toast({
          title: "خطأ في إضافة العميل",
          description: result.error || "فشل في إضافة العميل",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding customer:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
      
      // Fallback to localStorage
      try {
        const newId = "C" + Math.floor(Math.random() * 10000).toString().padStart(4, "0")
        
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

        toast({
          title: "تم إضافة العميل بنجاح (محلي)",
          description: "تم إضافة العميل إلى التخزين المحلي",
        })
        
        reset()
        router.push("/customers")
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError)
        toast({
          title: "خطأ في الحفظ",
          description: "فشل في حفظ بيانات العميل",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">إضافة عميل جديد</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">نوع العميل</Label>
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
              <Label htmlFor="companyName">اسم الشركة *</Label>
              <Input 
                id="companyName" 
                {...register("companyName", { required: "اسم الشركة مطلوب" })} 
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commercialRegister">رقم السجل التجاري *</Label>
              <Input
                id="commercialRegister"
                type="number"
                {...register("commercialRegister", { 
                  required: "رقم السجل التجاري مطلوب",
                  minLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" },
                  maxLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" }
                })}
                className={errors.commercialRegister ? "border-red-500" : ""}
              />
              {errors.commercialRegister && (
                <p className="text-sm text-red-500">{errors.commercialRegister.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي *</Label>
              <Input 
                id="taxNumber" 
                type="number" 
                {...register("taxNumber", { required: "الرقم الضريبي مطلوب" })} 
                className={errors.taxNumber ? "border-red-500" : ""}
              />
              {errors.taxNumber && (
                <p className="text-sm text-red-500">{errors.taxNumber.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="managerName">اسم المدير *</Label>
              <Input 
                id="managerName" 
                {...register("managerName", { required: "اسم المدير مطلوب" })} 
                className={errors.managerName ? "border-red-500" : ""}
              />
              {errors.managerName && (
                <p className="text-sm text-red-500">{errors.managerName.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="managerId">هوية المدير *</Label>
              <Input
                id="managerId"
                type="number"
                {...register("managerId", { 
                  required: "هوية المدير مطلوبة",
                  minLength: { value: 10, message: "يجب أن تكون الهوية 10 أرقام" },
                  maxLength: { value: 10, message: "يجب أن تكون الهوية 10 أرقام" }
                })}
                className={errors.managerId ? "border-red-500" : ""}
              />
              {errors.managerId && (
                <p className="text-sm text-red-500">{errors.managerId.message as string}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل *</Label>
              <Input 
                id="fullName" 
                {...register("fullName", { required: "الاسم الكامل مطلوب" })} 
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">رقم الهوية *</Label>
              <Input
                id="idNumber"
                type="number"
                {...register("idNumber", { 
                  required: "رقم الهوية مطلوب",
                  minLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" },
                  maxLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" }
                })}
                className={errors.idNumber ? "border-red-500" : ""}
              />
              {errors.idNumber && (
                <p className="text-sm text-red-500">{errors.idNumber.message as string}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">تاريخ الميلاد *</Label>
              <Input 
                id="birthDate" 
                type="date" 
                {...register("birthDate", { required: "تاريخ الميلاد مطلوب" })} 
                className={errors.birthDate ? "border-red-500" : ""}
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate.message as string}</p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الجوال *</Label>
          <Input 
            id="phone" 
            type="tel" 
            {...register("phone", { 
              required: "رقم الجوال مطلوب",
              minLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" },
              maxLength: { value: 10, message: "يجب أن يكون الرقم 10 أرقام" }
            })} 
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني *</Label>
          <Input 
            id="email" 
            type="email" 
            {...register("email", { 
              required: "البريد الإلكتروني مطلوب",
              pattern: { 
                value: /^\S+@\S+$/i, 
                message: "يرجى إدخال بريد إلكتروني صحيح" 
              }
            })} 
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <Input 
            id="address" 
            {...register("address")} 
            placeholder="عنوان العميل (اختياري)"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/customers")}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الإضافة..." : "إضافة العميل"}
          </Button>
        </div>
      </form>
    </div>
  )
}
