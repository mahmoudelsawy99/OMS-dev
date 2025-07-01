"use client"

import type { ReactNode } from "react"
import { useAuth, type Permission, type RoleType, type EntityType } from "./auth-provider"

interface RoleGuardProps {
  children: ReactNode
  permissions?: Permission[]
  roles?: RoleType[]
  entities?: EntityType[]
  fallback?: ReactNode
}

// مكون للتحقق من صلاحيات المستخدم وعرض المحتوى بناءً عليها
export function RoleGuard({ children, permissions = [], roles = [], entities = [], fallback = null }: RoleGuardProps) {
  const { user, hasPermission, isRole, isEntity } = useAuth()

  // التحقق من وجود المستخدم
  if (!user) {
    return fallback
  }

  // التحقق من الصلاحيات إذا تم تحديدها
  if (permissions.length > 0) {
    const hasRequiredPermission = permissions.some((permission) => hasPermission(permission))
    if (!hasRequiredPermission) {
      return fallback
    }
  }

  // التحقق من الأدوار إذا تم تحديدها
  if (roles.length > 0) {
    const hasRequiredRole = roles.some((role) => isRole(role))
    if (!hasRequiredRole) {
      return fallback
    }
  }

  // التحقق من نوع الكيان إذا تم تحديده
  if (entities.length > 0) {
    const hasRequiredEntity = entities.some((entity) => isEntity(entity))
    if (!hasRequiredEntity) {
      return fallback
    }
  }

  // إذا اجتاز المستخدم جميع الفحوصات، يتم عرض المحتوى
  return <>{children}</>
}
