"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Customer = {
  id: string
  name: string
  type: "individual" | "company"
  phone: string
  email: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState("10")

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    }
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">العملاء</h1>
        <Link href="/customers/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> إضافة عميل
          </Button>
        </Link>
      </div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center">
          <span className="mr-2">إظهار</span>
          <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="ml-2">سجلات</span>
        </div>
        <div className="flex items-center w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          <Input
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>
      <div className="border rounded-lg overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px] font-bold">كود العميل</TableHead>
              <TableHead className="font-bold">اسم العميل</TableHead>
              <TableHead className="font-bold hidden md:table-cell">نوع العميل</TableHead>
              <TableHead className="font-bold hidden md:table-cell">رقم الجوال</TableHead>
              <TableHead className="font-bold hidden md:table-cell">البريد الإلكتروني</TableHead>
              <TableHead className="text-right font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.slice(0, Number.parseInt(entriesPerPage)).map((customer) => (
              <TableRow key={customer.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">
                  <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                    {customer.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.type === "individual" ? "فرد" : "شركة"}
                </TableCell>
                <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        إظهار {Math.min(filteredCustomers.length, Number.parseInt(entriesPerPage))} من أصل {filteredCustomers.length}{" "}
        سجل
      </div>
    </div>
  )
}
