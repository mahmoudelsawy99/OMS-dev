"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Send, Smile, Search, MoreVertical, Edit, Trash2, Reply } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type MessageStatus = "sent" | "delivered" | "read"
type MessageType = "text" | "file" | "system"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  status: MessageStatus
  type: MessageType
  replyTo?: string
  attachments?: { name: string; url: string }[]
}

interface ChatUser {
  id: string
  name: string
  avatar: string
}

// Mock data
const currentUser: ChatUser = {
  id: "1",
  name: "أحمد محمد",
  avatar: "/placeholder.svg?height=32&width=32",
}

const otherUser: ChatUser = {
  id: "2",
  name: "فاطمة علي",
  avatar: "/placeholder.svg?height=32&width=32",
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "فاطمة علي",
    content: "مرحبًا، هل يمكنك تأكيد تفاصيل الشحنة؟",
    timestamp: "10:30 ص",
    status: "read",
    type: "text",
  },
  {
    id: "2",
    senderId: "1",
    senderName: "أحمد محمد",
    content: "بالتأكيد، الشحنة تحتوي على 100 كرتون وستصل غدًا.",
    timestamp: "10:32 ص",
    status: "read",
    type: "text",
    replyTo: "1",
  },
  {
    id: "3",
    senderId: "2",
    senderName: "فاطمة علي",
    content: "شكرًا لك. هل يمكنك إرسال قائمة التعبئة؟",
    timestamp: "10:35 ص",
    status: "read",
    type: "text",
  },
  {
    id: "4",
    senderId: "1",
    senderName: "أحمد محمد",
    content: "بالطبع، إليك قائمة التعبئة المرفقة.",
    timestamp: "10:40 ص",
    status: "delivered",
    type: "file",
    attachments: [{ name: "قائمة_التعبئة.pdf", url: "#" }],
  },
]

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: (messages.length + 1).toString(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        type: "text",
        replyTo: replyingTo || undefined,
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
      setReplyingTo(null)
    }
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  const getReplyingToMessage = () => {
    return messages.find((msg) => msg.id === replyingTo)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="mr-3">
            <h2 className="font-semibold">{otherUser.name}</h2>
            <p className="text-sm text-muted-foreground">آخر ظهور: الآن</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${message.senderId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg p-3`}
            >
              {message.replyTo && (
                <div className="text-sm text-muted-foreground bg-background/10 p-2 rounded mb-2">
                  {messages.find((msg) => msg.id === message.replyTo)?.content}
                </div>
              )}
              <p>{message.content}</p>
              {message.attachments && (
                <div className="mt-2">
                  {message.attachments.map((attachment, index) => (
                    <a key={index} href={attachment.url} className="text-sm text-blue-400 hover:underline">
                      {attachment.name}
                    </a>
                  ))}
                </div>
              )}
              <div className="text-xs mt-1 text-muted-foreground">
                {message.timestamp}
                {message.senderId === currentUser.id && (
                  <span className="mr-2">
                    {message.status === "sent" && "✓"}
                    {message.status === "delivered" && "✓✓"}
                    {message.status === "read" && "✓✓"}
                  </span>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleReply(message.id)}>
                  <Reply className="ml-2 h-4 w-4" />
                  رد
                </DropdownMenuItem>
                {message.senderId === currentUser.id && (
                  <>
                    <DropdownMenuItem>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="border-t p-4">
        {replyingTo && (
          <div className="bg-muted p-2 rounded-lg mb-2 flex justify-between items-center">
            <p className="text-sm">الرد على: {getReplyingToMessage()?.content}</p>
            <Button variant="ghost" size="sm" onClick={cancelReply}>
              إلغاء
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="اكتب رسالتك هنا..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
