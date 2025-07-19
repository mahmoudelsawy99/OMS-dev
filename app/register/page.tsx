"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { authAPI, customersAPI } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState("individual")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "كلمات المرور غير متطابقة",
          description: "يرجى التأكد من تطابق كلمة المرور وتأكيدها",
          variant: "destructive",
        })
        return
      }

      // Validate terms agreement
      if (!agreeTerms) {
        toast({
          title: "يجب الموافقة على الشروط",
          description: "يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية",
          variant: "destructive",
        })
        return
      }

      // Create customer data
      const customerData = {
        name: formData.name,
        type: accountType,
        phone: formData.phone,
        email: formData.email,
        address: "", // Will be updated in profile
        idNumber: "", // Will be updated in profile
        ...(accountType === "company" && {
          contactPerson: formData.name,
          taxNumber: "",
        }),
      }

      // Create user data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        entity: "CLIENT",
        role: "CLIENT_MANAGER",
      }

      // Step 1: Create customer
      const customerResult = await customersAPI.create(customerData)
      if (!customerResult.success) {
        throw new Error(customerResult.error || "فشل في إنشاء العميل")
      }

      // Step 2: Create user account
      const userResult = await authAPI.register(userData)
      if (!userResult.success) {
        throw new Error(userResult.error || "فشل في إنشاء الحساب")
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام بياناتك",
      })

      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ أثناء محاولة إنشاء الحساب",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">PS</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-slate-500">أنشئ حسابك للوصول إلى خدمات الشحن والتخليص</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">معلومات الحساب</CardTitle>
            <CardDescription>أدخل بياناتك لإنشاء حساب جديد</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>نوع الحساب</Label>
                <RadioGroup
                  defaultValue="individual"
                  value={accountType}
                  onValueChange={setAccountType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="mr-2">
                      فرد
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="mr-2">
                      شركة
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{accountType === "individual" ? "الاسم الكامل" : "اسم الشركة"}</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder={accountType === "individual" ? "أدخل الاسم الكامل" : "أدخل اسم الشركة"}
                    className="pr-10"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    className="pr-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="أدخل رقم الجوال"
                    className="pr-10"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-3 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="أعد إدخال كلمة المرور"
                    className="pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={setAgreeTerms} />
                <Label htmlFor="terms" className="mr-2 text-sm">
                  أوافق على{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    سياسة الخصوصية
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-center text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
