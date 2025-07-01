"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, Mail, Phone, User, Building, MapPin } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    country: "السعودية",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      // Find customer data if this is a client
      if (userData.role === "client") {
        const customers = JSON.parse(localStorage.getItem("customers") || "[]")
        const customerData = customers.find((c) => c.email === userData.email)

        if (customerData) {
          setProfileData({
            name: customerData.name || userData.name,
            email: customerData.email || userData.email,
            phone: customerData.phone || "",
            company: customerData.type === "company" ? customerData.name : "",
            address: customerData.address || "",
            city: customerData.city || "",
            postalCode: customerData.postalCode || "",
            country: "السعودية",
          })
        } else {
          setProfileData({
            ...profileData,
            name: userData.name,
            email: userData.email,
          })
        }
      }
    }
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data in localStorage
      if (user) {
        const updatedUser = { ...user, name: profileData.name }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)

        // If client, also update customer data
        if (user.role === "client") {
          const customers = JSON.parse(localStorage.getItem("customers") || "[]")
          const updatedCustomers = customers.map((customer) => {
            if (customer.email === user.email) {
              return {
                ...customer,
                name: profileData.name,
                phone: profileData.phone,
                address: profileData.address,
                city: profileData.city,
                postalCode: profileData.postalCode,
              }
            }
            return customer
          })
          localStorage.setItem("customers", JSON.stringify(updatedCustomers))
        }
      }

      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث بياناتك الشخصية بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: "حدث خطأ أثناء محاولة تحديث بياناتك",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمة المرور الجديدة وتأكيدها",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تحديث كلمة المرور الخاصة بك بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث كلمة المرور",
        description: "حدث خطأ أثناء محاولة تحديث كلمة المرور",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!user) {
    return <div className="container mx-auto p-4 text-center">جاري تحميل البيانات...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">الملف الشخصي</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={profileData.name} />
              <AvatarFallback className="text-2xl">{getInitials(profileData.name)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <p className="text-muted-foreground">{profileData.email}</p>
            <div className="mt-2 text-center">
              <Badge className="bg-green-100 text-green-800 mt-2">
                {user.role === "client" ? "عميل" : user.role === "admin" ? "مدير النظام" : "موظف"}
              </Badge>
            </div>
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-muted-foreground ml-2" />
                <span className="text-sm">{profileData.email}</span>
              </div>
              {profileData.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
              )}
              {profileData.company && (
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{profileData.company}</span>
                </div>
              )}
              {profileData.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{profileData.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
              <TabsTrigger value="security">الأمان</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>قم بتحديث معلوماتك الشخصية وبيانات الاتصال</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            placeholder="أدخل الاسم الكامل"
                            className="pr-10"
                            value={profileData.name}
                            onChange={handleProfileChange}
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
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled
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
                            placeholder="أدخل رقم الجوال"
                            className="pr-10"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">الشركة (اختياري)</Label>
                        <div className="relative">
                          <Building className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="company"
                            name="company"
                            placeholder="أدخل اسم الشركة"
                            className="pr-10"
                            value={profileData.company}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="أدخل العنوان"
                        value={profileData.address}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="أدخل المدينة"
                          value={profileData.city}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">الرمز البريدي</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="أدخل الرمز البريدي"
                          value={profileData.postalCode}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">الدولة</Label>
                        <Input
                          id="country"
                          name="country"
                          value={profileData.country}
                          onChange={handleProfileChange}
                          disabled
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" onClick={handleUpdateProfile} disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>الأمان</CardTitle>
                  <CardDescription>قم بتحديث كلمة المرور الخاصة بك</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          placeholder="أدخل كلمة المرور الحالية"
                          className="pr-10"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-3 text-muted-foreground"
                          onClick={() => toggleShowPassword("current")}
                        >
                          {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          placeholder="أدخل كلمة المرور الجديدة"
                          className="pr-10"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-3 text-muted-foreground"
                          onClick={() => toggleShowPassword("new")}
                        >
                          {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          placeholder="أعد إدخال كلمة المرور الجديدة"
                          className="pr-10"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          type="button"
                          className="absolute left-3 top-3 text-muted-foreground"
                          onClick={() => toggleShowPassword("confirm")}
                        >
                          {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" onClick={handleUpdatePassword} disabled={isLoading}>
                    {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
