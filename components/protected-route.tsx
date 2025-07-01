"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

interface ProtectedRouteProps {
  children: React.ReactNode
}

// مكون لحماية المسارات وتوجيه المستخدم غير المصرح له إلى صفحة تسجيل الدخول
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // إذا انتهى التحميل ولم يتم تسجيل دخول المستخدم
    if (!loading && !user) {
      // حفظ المسار الحالي للعودة إليه بعد تسجيل الدخول
      localStorage.setItem("redirectAfterLogin", pathname)
      router.push("/login")
    }
  }, [user, loading, router, pathname])

  // إذا كان التحميل جارياً، يمكن عرض شاشة تحميل
  if (loading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>
  }

  // إذا كان المستخدم مسجل الدخول، عرض المحتوى
  return user ? <>{children}</> : null
}
