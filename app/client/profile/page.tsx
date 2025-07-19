"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import { usersAPI, customersAPI } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: (user as any).phone || "",
        address: (user as any).address || "",
        city: (user as any).city || "",
        postalCode: (user as any).postalCode || "",
      })
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)

    try {
      // Update user profile via API
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        postalCode: profileData.postalCode,
      }

      const result = await usersAPI.update(user.id, updateData)
      
      if (result.success) {
        // Update local user state - we'll need to reload the page or update localStorage
        localStorage.setItem("currentUser", JSON.stringify({ ...user, ...updateData }))
        window.location.reload() // Simple solution to refresh user data

        // If client, also update customer data
        if (user.role === "CLIENT_MANAGER" && user.entityId) {
          try {
            const customerResult = await customersAPI.update(user.entityId, updateData)
            if (!customerResult.success) {
              console.error('Failed to update customer data:', customerResult.error)
            }
          } catch (error) {
            console.error('Error updating customer data:', error)
          }
        }

        toast({
          title: "تم تحديث الملف الشخصي",
          description: "تم تحديث بياناتك الشخصية بنجاح",
        })
      } else {
        toast({
          title: "خطأ في تحديث الملف الشخصي",
          description: result.error || "حدث خطأ أثناء محاولة تحديث بياناتك",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">يرجى تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>

        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                                 <Avatar className="h-16 w-16">
                   <AvatarImage src={(user as any).avatar} />
                   <AvatarFallback className="text-lg">
                     {getInitials(user.name)}
                   </AvatarFallback>
                 </Avatar>
                 <div>
                   <h2 className="text-xl font-semibold">{user.name}</h2>
                   <p className="text-muted-foreground">{user.email}</p>
                   <p className="text-sm text-muted-foreground">
                     {user.role.startsWith("CLIENT_") ? "عميل" : 
                      user.role === "GENERAL_MANAGER" ? "مدير" : 
                      user.role.startsWith("SUPPLIER_") ? "مورد" : user.role}
                   </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>تعديل المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      لا يمكن تغيير البريد الإلكتروني
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) =>
                        setProfileData({ ...profileData, city: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({ ...profileData, address: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="postalCode">الرمز البريدي</Label>
                    <Input
                      id="postalCode"
                      value={profileData.postalCode}
                      onChange={(e) =>
                        setProfileData({ ...profileData, postalCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "جاري التحديث..." : "تحديث الملف الشخصي"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      نوع الحساب
                    </Label>
                    <p className="text-sm">
                      {user.entity === "CLIENT" ? "عميل" : 
                       user.entity === "PRO" ? "شركة" : 
                       user.entity === "SUPPLIER" ? "مورد" : user.entity}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      الدور
                    </Label>
                    <p className="text-sm">
                      {user.role.startsWith("CLIENT_") ? "عميل" : 
                       user.role === "GENERAL_MANAGER" ? "مدير" : 
                       user.role.startsWith("SUPPLIER_") ? "مورد" : user.role}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      تاريخ التسجيل
                    </Label>
                    <p className="text-sm">
                      {(user as any).createdAt 
                        ? new Date((user as any).createdAt).toLocaleDateString('ar-SA')
                        : "غير محدد"
                      }
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      آخر تحديث
                    </Label>
                    <p className="text-sm">
                      {(user as any).updatedAt 
                        ? new Date((user as any).updatedAt).toLocaleDateString('ar-SA')
                        : "غير محدد"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    حالة الحساب
                  </Label>
                  <p className="text-sm">
                    {(user as any).isActive ? "نشط" : "غير نشط"}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">
                    تغيير كلمة المرور
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
