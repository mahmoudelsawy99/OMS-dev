import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import { AuthProvider } from "@/components/auth-provider"
import InitializeData from "./initialize-data"

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "نظام إدارة العملاء",
  description: "نظام إدارة العملاء والطلبات",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <InitializeData />
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background text-foreground transition-colors duration-300">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
