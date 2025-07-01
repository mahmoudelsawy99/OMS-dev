"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Phone } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!identifier || !password) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description:
          loginMethod === "email" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "يرجى إدخال رقم الجوال وكلمة المرور",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log("Attempting login with:", identifier, password)
      const result = await login(identifier, password)
      console.log("Login result:", result)

      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "جاري تحويلك إلى لوحة التحكم",
        })
        router.push("/")
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: result.error || "بيانات الدخول غير صحيحة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Section - Background Image */}
      <div className="relative hidden md:block bg-slate-900">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1080"
            alt="Login Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute bottom-8 left-8 flex items-center space-x-4 text-white">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur" />
          <div>
            <h3 className="font-medium">Pro Speed</h3>
            <p className="text-sm text-white/60">نظام إدارة الشحنات</p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">مرحباً بك</h2>
            <p className="text-slate-600 mt-2">تسجيل الدخول إلى Pro Speed</p>
          </div>

          <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as "email" | "phone")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
              <TabsTrigger value="phone">رقم الجوال</TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-6 mt-8">
              <div className="space-y-2">
                <Label htmlFor="identifier">{loginMethod === "email" ? "البريد الإلكتروني" : "رقم الجوال"}</Label>
                <div className="relative">
                  {loginMethod === "email" ? (
                    <Mail className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  ) : (
                    <Phone className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  )}
                  <Input
                    id="identifier"
                    type={loginMethod === "email" ? "email" : "tel"}
                    placeholder={loginMethod === "email" ? "name@example.com" : "05xxxxxxxx"}
                    className="pr-10"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  /* Google login implementation */
                }}
              >
                <Image
                  src="/placeholder.svg?text=G&height=24&width=24"
                  alt="Google"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                تسجيل الدخول باستخدام Google
              </Button>

              <p className="text-center text-sm text-slate-600">
                ليس لديك حساب؟{" "}
                <Link href="/register" className="text-primary hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>

              <div className="flex justify-center space-x-4">
                <Link href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-slate-400 hover:text-slate-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </form>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
