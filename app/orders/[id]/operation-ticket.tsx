import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Package, Truck, Receipt, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type OperationType = "policy" | "customs" | "sial" | "transport" | "invoice"

interface OperationTicketProps {
  type: OperationType
  title: string
  number: string
  date: string
  status: string
  amount?: string
  details?: string
}

const typeIcons = {
  policy: Package,
  customs: FileText,
  sial: Receipt,
  transport: Truck,
  invoice: Receipt,
}

const typeColors = {
  policy: "bg-blue-100 text-blue-600",
  customs: "bg-purple-100 text-purple-600",
  sial: "bg-green-100 text-green-600",
  transport: "bg-orange-100 text-orange-600",
  invoice: "bg-gray-100 text-gray-600",
}

export function OperationTicket({ type, title, number, date, status, amount, details }: OperationTicketProps) {
  const Icon = typeIcons[type]

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${typeColors[type]}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">رقم {number}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{date}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                  <DropdownMenuItem>تعديل</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">حذف</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">الحالة:</span>
              <span className="text-sm font-medium">{status}</span>
            </div>
            {amount && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">المبلغ:</span>
                <span className="text-sm font-medium">{amount}</span>
              </div>
            )}
          </div>

          {details && <p className="mt-2 text-sm text-muted-foreground">{details}</p>}
        </div>
      </div>
    </Card>
  )
}
