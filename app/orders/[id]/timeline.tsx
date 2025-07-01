"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ActivityIcon as Attachment, MessageSquare, FileText, Plus, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

// Types for our timeline events
type TimelineEventType = "addition" | "modification" | "chat"

interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  summary: string
  timestamp: string
  hasAttachment?: boolean
  details?: string
  attachmentUrl?: string
}

// Mock data - replace with actual data
const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "addition",
    title: "إضافة بوليصة جديدة",
    summary: "تم إضافة بوليصة رقم 21564120",
    timestamp: "٢٥/٠٣/١٤٤٥ - ٠٢:٣٠ م",
    hasAttachment: true,
    attachmentUrl: "#",
    details: "تفاصيل البوليصة: شحن بحري - ميناء جدة - ٥٠٠ كرتون",
  },
  {
    id: "2",
    type: "chat",
    title: "محادثة جديدة",
    summary: "تم إضافة رد من قسم العمليات",
    timestamp: "٢٥/٠٣/١٤٤٥ - ٠٢:٤٥ م",
    details: "تم مراجعة البيانات والموافقة على الشحنة",
  },
  {
    id: "3",
    type: "modification",
    title: "تحديث حالة الطلب",
    summary: "تم تغيير حالة الطلب إلى قيد التنفيذ",
    timestamp: "٢٥/٠٣/١٤٤٥ - ٠٣:٠٠ م",
    hasAttachment: true,
    attachmentUrl: "#",
  },
]

function TimelineEvent({ event }: { event: TimelineEvent }) {
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: TimelineEventType) => {
    switch (type) {
      case "addition":
        return <Plus className="h-4 w-4" />
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "modification":
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="relative pb-8 last:pb-0">
      {/* Timeline connector line */}
      <div className="absolute right-4 top-4 -bottom-4 w-px bg-border last:bg-transparent" />

      <Card className="mr-8 p-4 relative">
        {/* Timeline dot */}
        <div className="absolute right-[-2rem] top-4 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
          {getIcon(event.type)}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-sm text-muted-foreground">{event.timestamp}</span>
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{event.summary}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {event.hasAttachment && (
              <Button variant="outline" size="sm">
                <Attachment className="h-4 w-4 ml-2" />
                المرفقات
              </Button>
            )}
            {event.details && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    {isOpen ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 text-sm text-muted-foreground pr-4">
                  {event.details}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function Timeline() {
  return (
    <div className="space-y-4 p-4">
      {mockEvents.map((event) => (
        <TimelineEvent key={event.id} event={event} />
      ))}
    </div>
  )
}
