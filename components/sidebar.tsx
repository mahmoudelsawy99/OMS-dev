"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  FileText,
  BarChart2,
  Users,
  UserCircle,
  Settings,
  Menu,
  X,
  Truck,
  CreditCard,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { RoleGuard } from "@/components/role-guard"
import ThemeToggle from "@/components/theme-toggle"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleSidebar = () => setIsOpen(!isOpen)

  // التحقق من وجود المستخدم قبل عرض الشريط الجانبي
  if (!user) {
    return null
  }

  return (
    <>
      <Button variant="ghost" className="md:hidden fixed top-4 right-4 z-50" onClick={toggleSidebar}>
        {isOpen ? <X /> : <Menu />}
      </Button>
      <aside
        className={`bg-slate-900 dark:bg-slate-950 text-white p-4 h-screen fixed md:relative transition-all duration-300 ease-in-out ${isOpen ? "w-64 left-0" : "w-0 -left-64 md:w-64 md:left-0"} overflow-hidden`}
      >
        <div className="text-xl font-bold mb-6">Pro Speed</div>

        <div className="mb-4 pb-4 border-b border-slate-700">
          <div className="text-sm text-slate-400">مرحباً،</div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-slate-400 mt-1">{getRoleDisplayName(user.role)}</div>
        </div>

        <nav className="space-y-4">
          {/* Main Navigation */}
          <div className="space-y-2">
            <NavItem
              href="/"
              icon={<LayoutGrid className="h-5 w-5" />}
              text="لوحة التحكم"
              onClick={toggleSidebar}
              isActive={pathname === "/"}
            />

            <RoleGuard permissions={["VIEW_ALL_ORDERS", "VIEW_OWN_ORDERS"]}>
              <NavItem
                href="/orders"
                icon={<FileText className="h-5 w-5" />}
                text="الطلبات"
                onClick={toggleSidebar}
                isActive={pathname === "/orders" || pathname.startsWith("/orders/")}
              />
            </RoleGuard>

            <RoleGuard permissions={["VIEW_REPORTS"]}>
              <NavItem
                href="/reports"
                icon={<BarChart2 className="h-5 w-5" />}
                text="التقارير"
                onClick={toggleSidebar}
                isActive={pathname === "/reports" || pathname.startsWith("/reports/")}
              />
            </RoleGuard>

            <RoleGuard permissions={["VIEW_CLIENTS"]}>
              <NavItem
                href="/customers"
                icon={<Users className="h-5 w-5" />}
                text="العملاء"
                onClick={toggleSidebar}
                isActive={pathname === "/customers" || pathname.startsWith("/customers/")}
              />
            </RoleGuard>

            <RoleGuard permissions={["VIEW_USERS"]}>
              <NavItem
                href="/users"
                icon={<UserCircle className="h-5 w-5" />}
                text="المستخدمين"
                onClick={toggleSidebar}
                isActive={pathname === "/users" || pathname.startsWith("/users/")}
              />
            </RoleGuard>

            <RoleGuard permissions={["DRIVE_VEHICLES"]}>
              <NavItem
                href="/vehicles"
                icon={<Truck className="h-5 w-5" />}
                text="المركبات"
                onClick={toggleSidebar}
                isActive={pathname === "/vehicles" || pathname.startsWith("/vehicles/")}
              />
            </RoleGuard>

            <RoleGuard permissions={["VIEW_INVOICES"]}>
              <NavItem
                href="/invoices"
                icon={<CreditCard className="h-5 w-5" />}
                text="الفواتير"
                onClick={toggleSidebar}
                isActive={pathname === "/invoices" || pathname.startsWith("/invoices/")}
              />
            </RoleGuard>

            <NavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              text="الإعدادات"
              onClick={toggleSidebar}
              isActive={pathname === "/settings" || pathname.startsWith("/settings/")}
            />
          </div>

          {/* قسم العميل - New Client Section */}
          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 px-2">قسم العميل</h3>
            <div className="space-y-2">
              <NavItem
                href="/client-section/dashboard"
                icon={<LayoutGrid className="h-5 w-5" />}
                text="لوحة التحكم"
                onClick={toggleSidebar}
                isActive={pathname === "/client-section/dashboard" || pathname.startsWith("/client-section/dashboard/")}
              />
              <NavItem
                href="/client-section/orders"
                icon={<FileText className="h-5 w-5" />}
                text="الطلبات"
                onClick={toggleSidebar}
                isActive={pathname === "/client-section/orders" || pathname.startsWith("/client-section/orders/")}
              />
              <NavItem
                href="/client-section/client-orders"
                icon={<Users className="h-5 w-5" />}
                text="طلبات عميل محدد"
                onClick={toggleSidebar}
                isActive={
                  pathname === "/client-section/client-orders" || pathname.startsWith("/client-section/client-orders/")
                }
              />
            </div>
          </div>

          {/* Client Section - Only show for clients */}
          <RoleGuard entities={["CLIENT"]}>
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 px-2">منطقة العميل</h3>
              <div className="space-y-2">
                <NavItem
                  href="/client/dashboard"
                  icon={<LayoutGrid className="h-5 w-5" />}
                  text="لوحة التحكم"
                  onClick={toggleSidebar}
                  isActive={pathname === "/client/dashboard" || pathname.startsWith("/client/dashboard/")}
                />
                <NavItem
                  href="/client/orders"
                  icon={<FileText className="h-5 w-5" />}
                  text="طلباتي"
                  onClick={toggleSidebar}
                  isActive={pathname === "/client/orders" || pathname.startsWith("/client/orders/")}
                />
              </div>
            </div>
          </RoleGuard>

          {/* Supplier Section - Only show for suppliers */}
          <RoleGuard entities={["SUPPLIER"]}>
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 px-2">منطقة المورد</h3>
              <div className="space-y-2">
                <NavItem
                  href="/supplier/dashboard"
                  icon={<LayoutGrid className="h-5 w-5" />}
                  text="لوحة التحكم"
                  onClick={toggleSidebar}
                  isActive={pathname === "/supplier/dashboard" || pathname.startsWith("/supplier/dashboard/")}
                />
                <NavItem
                  href="/supplier/orders"
                  icon={<FileText className="h-5 w-5" />}
                  text="الطلبات"
                  onClick={toggleSidebar}
                  isActive={pathname === "/supplier/orders" || pathname.startsWith("/supplier/orders/")}
                />
              </div>
            </div>
          </RoleGuard>

          {/* Logout Button */}
          <div className="pt-4 border-t border-slate-700">
            <button
              className="flex items-center space-x-2 p-2 rounded-lg w-full text-left hover:bg-slate-800"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </nav>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-medium text-slate-300">الوضع الليلي</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  )
}

function NavItem({ href, icon, text, onClick, isActive }) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 p-2 rounded-lg ${isActive ? "bg-slate-800 font-medium" : "hover:bg-slate-800"}`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </Link>
  )
}

// دالة مساعدة لعرض أسماء الأدوار بشكل مناسب
function getRoleDisplayName(role) {
  const roleNames = {
    GENERAL_MANAGER: "المدير العام",
    CLEARANCE_MANAGER: "مدير التخليص",
    OPERATIONS_MANAGER: "مدير العمليات",
    TRANSLATOR: "مترجم",
    CUSTOMS_BROKER: "مخلص جمركي",
    DRIVER: "سائق",
    ACCOUNTANT: "محاسب",
    DATA_ENTRY: "مدخل بيانات",
    CLIENT_MANAGER: "مدير (عميل)",
    CLIENT_SUPERVISOR: "مشرف (عميل)",
    CLIENT_DATA_ENTRY: "مدخل بيانات (عميل)",
    SUPPLIER_MANAGER: "مدير (مورد)",
    SUPPLIER_SUPERVISOR: "مشرف (مورد)",
    SUPPLIER_DATA_ENTRY: "مدخل بيانات (مورد)",
  }
  return roleNames[role] || role
}
