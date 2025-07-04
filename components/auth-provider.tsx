"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// تعريف أنواع الكيانات
export type EntityType = "PRO" | "CLIENT" | "SUPPLIER"

// تعريف أنواع الأدوار
export type RoleType =
  // أدوار شركتك
  | "GENERAL_MANAGER"
  | "CLEARANCE_MANAGER"
  | "OPERATIONS_MANAGER"
  | "TRANSLATOR"
  | "CUSTOMS_BROKER"
  | "DRIVER"
  | "ACCOUNTANT"
  | "DATA_ENTRY"
  // أدوار العملاء
  | "CLIENT_MANAGER"
  | "CLIENT_SUPERVISOR"
  | "CLIENT_DATA_ENTRY"
  // أدوار الموردين
  | "SUPPLIER_MANAGER"
  | "SUPPLIER_SUPERVISOR"
  | "SUPPLIER_DATA_ENTRY"

// تعريف أنواع الصلاحيات
export type Permission =
  | "VIEW_ALL_ORDERS"
  | "CREATE_ORDER"
  | "EDIT_ORDER"
  | "DELETE_ORDER"
  | "APPROVE_ORDER"
  | "REJECT_ORDER"
  | "VIEW_CLIENTS"
  | "CREATE_CLIENT"
  | "EDIT_CLIENT"
  | "DELETE_CLIENT"
  | "VIEW_SUPPLIERS"
  | "CREATE_SUPPLIER"
  | "EDIT_SUPPLIER"
  | "DELETE_SUPPLIER"
  | "VIEW_USERS"
  | "CREATE_USER"
  | "EDIT_USER"
  | "DELETE_USER"
  | "VIEW_INVOICES"
  | "CREATE_INVOICE"
  | "EDIT_INVOICE"
  | "DELETE_INVOICE"
  | "VIEW_REPORTS"
  | "TRANSLATE_DOCUMENTS"
  | "DRIVE_VEHICLES"
  | "MANAGE_PAYMENTS"
  | "ENTER_DATA"
  | "VIEW_OWN_ORDERS"
  | "EDIT_OWN_ORDERS"

// تعريف نوع المستخدم
export interface User {
  id: string
  name: string
  email: string
  entity: EntityType
  role: RoleType
  permissions: Permission[]
  entityId?: string // معرف الكيان (للعملاء والموردين)
}

// تعريف سياق المصادقة
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  isRole: (role: RoleType) => boolean
  isEntity: (entity: EntityType) => boolean
}

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | null>(null)

// تعريف مزود المصادقة
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // تحميل بيانات المستخدم عند بدء التطبيق
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          // إضافة الصلاحيات بناءً على الدور
          const userWithPermissions = {
            ...parsedUser,
            permissions: getRolePermissions(parsedUser.role),
          }
          setUser(userWithPermissions)
        } catch (error) {
          console.error("Error parsing user data:", error)
          localStorage.removeItem("currentUser")
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  // دالة تسجيل الدخول
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://31.97.156.49:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        // Always assign permissions based on role
        const userWithPermissions = {
          ...data.user,
          permissions: getRolePermissions(data.user.role),
        };
        setUser(userWithPermissions);
        localStorage.setItem("currentUser", JSON.stringify(userWithPermissions));
        localStorage.setItem("token", data.token);
        return { success: true };
      } else {
        return { success: false, error: data.message || "بيانات الدخول غير صحيحة" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" };
    }
  }

  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    router.push("/login")
  }

  // دالة للتحقق من صلاحيات المستخدم
  const hasPermission = (permission: Permission): boolean => {
    if (!user || !Array.isArray(user.permissions)) return false
    return user.permissions.includes(permission)
  }

  // دالة للتحقق من دور المستخدم
  const isRole = (role: RoleType): boolean => {
    if (!user) return false
    return user.role === role
  }

  // دالة للتحقق من نوع كيان المستخدم
  const isEntity = (entity: EntityType): boolean => {
    if (!user) return false
    return user.entity === entity
  }

  // توفير سياق المصادقة للتطبيق
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        hasPermission,
        isRole,
        isEntity,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// دالة مساعدة لاستخدام سياق المصادقة
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// دالة لتحديد نوع الكيان بناءً على الدور
function determineEntityFromRole(role: RoleType): EntityType {
  if (role.startsWith("CLIENT_")) {
    return "CLIENT"
  } else if (role.startsWith("SUPPLIER_")) {
    return "SUPPLIER"
  }
  return "PRO"
}

// دالة لتحديد الصلاحيات بناءً على الدور
function getRolePermissions(role: RoleType): Permission[] {
  // Always return all permissions for GENERAL_MANAGER (admin)
  if (role === "GENERAL_MANAGER") {
    return [
      "VIEW_ALL_ORDERS",
      "CREATE_ORDER",
      "EDIT_ORDER",
      "DELETE_ORDER",
      "APPROVE_ORDER",
      "REJECT_ORDER",
      "VIEW_CLIENTS",
      "CREATE_CLIENT",
      "EDIT_CLIENT",
      "DELETE_CLIENT",
      "VIEW_SUPPLIERS",
      "CREATE_SUPPLIER",
      "EDIT_SUPPLIER",
      "DELETE_SUPPLIER",
      "VIEW_USERS",
      "CREATE_USER",
      "EDIT_USER",
      "DELETE_USER",
      "VIEW_INVOICES",
      "CREATE_INVOICE",
      "EDIT_INVOICE",
      "DELETE_INVOICE",
      "VIEW_REPORTS",
      "TRANSLATE_DOCUMENTS",
      "DRIVE_VEHICLES",
      "MANAGE_PAYMENTS",
      "ENTER_DATA",
      "VIEW_OWN_ORDERS",
      "EDIT_OWN_ORDERS"
    ];
  }
  switch (role) {
    // أدوار شركتك
    case "CLEARANCE_MANAGER":
      return [
        "VIEW_ALL_ORDERS",
        "EDIT_ORDER",
        "APPROVE_ORDER",
        "REJECT_ORDER",
        "VIEW_CLIENTS",
        "VIEW_SUPPLIERS",
        "VIEW_INVOICES",
        "VIEW_REPORTS",
      ]
    case "OPERATIONS_MANAGER":
      return [
        "VIEW_ALL_ORDERS",
        "CREATE_ORDER",
        "EDIT_ORDER",
        "APPROVE_ORDER",
        "REJECT_ORDER",
        "VIEW_CLIENTS",
        "VIEW_SUPPLIERS",
        "VIEW_INVOICES",
        "VIEW_REPORTS",
      ]
    case "TRANSLATOR":
      return ["VIEW_ALL_ORDERS", "TRANSLATE_DOCUMENTS"]
    case "CUSTOMS_BROKER":
      return ["VIEW_ALL_ORDERS", "EDIT_ORDER"]
    case "DRIVER":
      return ["VIEW_ALL_ORDERS", "DRIVE_VEHICLES"]
    case "ACCOUNTANT":
      return ["VIEW_INVOICES", "CREATE_INVOICE", "EDIT_INVOICE", "MANAGE_PAYMENTS", "VIEW_REPORTS"]
    case "DATA_ENTRY":
      return ["ENTER_DATA", "VIEW_ALL_ORDERS", "CREATE_ORDER", "EDIT_ORDER"]

    // أدوار العملاء
    case "CLIENT_MANAGER":
      return ["VIEW_OWN_ORDERS", "CREATE_ORDER", "EDIT_OWN_ORDERS", "VIEW_INVOICES"]
    case "CLIENT_SUPERVISOR":
      return ["VIEW_OWN_ORDERS", "CREATE_ORDER", "EDIT_OWN_ORDERS"]
    case "CLIENT_DATA_ENTRY":
      return ["VIEW_OWN_ORDERS", "CREATE_ORDER", "ENTER_DATA"]

    // أدوار الموردين
    case "SUPPLIER_MANAGER":
      return ["VIEW_OWN_ORDERS", "APPROVE_ORDER", "REJECT_ORDER", "VIEW_INVOICES"]
    case "SUPPLIER_SUPERVISOR":
      return ["VIEW_OWN_ORDERS", "EDIT_OWN_ORDERS"]
    case "SUPPLIER_DATA_ENTRY":
      return ["VIEW_OWN_ORDERS", "ENTER_DATA"]

    default:
      return []
  }
}
