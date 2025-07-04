"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Camera,
  Save,
  Trash,
  Bell,
  Shield,
  User,
  Building,
  Truck,
  FileText,
  RefreshCw,
  Zap,
  Sliders,
  BarChart2,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Helper functions
const getDayName = (day: string) => {
  switch (day) {
    case "sunday":
      return "الأحد"
    case "monday":
      return "الاثنين"
    case "tuesday":
      return "الثلاثاء"
    case "wednesday":
      return "الأربعاء"
    case "thursday":
      return "الخميس"
    case "friday":
      return "الجمعة"
    case "saturday":
      return "السبت"
    default:
      return day
  }
}

const getServiceIcon = (service: string) => {
  switch (service) {
    case "import":
      return <FileText className="h-5 w-5" />
    case "export":
      return <FileText className="h-5 w-5" />
    case "shipping":
      return <Truck className="h-5 w-5" />
    case "transport":
      return <Truck className="h-5 w-5" />
    case "storage":
      return <Building className="h-5 w-5" />
    case "translation":
      return <FileText className="h-5 w-5" />
    case "customs":
      return <Shield className="h-5 w-5" />
    default:
      return null
  }
}

const getServiceName = (service: string) => {
  switch (service) {
    case "import":
      return "تخليص وارد"
    case "export":
      return "تخليص صادر"
    case "shipping":
      return "شحن"
    case "transport":
      return "نقل"
    case "storage":
      return "تخزين"
    case "translation":
      return "ترجمة"
    case "customs":
      return "جمارك"
    default:
      return service
  }
}

const getServiceDescription = (service: string) => {
  switch (service) {
    case "import":
      return "تخليص البضائع المستوردة"
    case "export":
      return "تخليص البضائع المصدرة"
    case "shipping":
      return "خدمات الشحن المختلفة"
    case "transport":
      return "خدمات النقل البري"
    case "storage":
      return "خدمات التخزين والتخزين المؤقت"
    case "translation":
      return "خدمات الترجمة المعتمدة"
    case "customs":
      return "خدمات التخليص الجمركي"
    default:
      return ""
  }
}

const getShippingTypeName = (type: string) => {
  switch (type) {
    case "sea":
      return "بحري"
    case "air":
      return "جوي"
    case "land":
      return "بري"
    default:
      return type
  }
}

const getNotificationChannelName = (channel: string) => {
  switch (channel) {
    case "email":
      return "البريد الإلكتروني"
    case "sms":
      return "الرسائل النصية"
    case "push":
      return "إشعارات التطبيق"
    case "whatsapp":
      return "واتساب"
    default:
      return channel
  }
}

const getNotificationChannelDescription = (channel: string) => {
  switch (channel) {
    case "email":
      return "تلقي الإشعارات عبر البريد الإلكتروني"
    case "sms":
      return "تلقي الإشعارات عبر الرسائل النصية"
    case "push":
      return "تلقي الإشعارات داخل التطبيق"
    case "whatsapp":
      return "تلقي الإشعارات عبر واتساب"
    default:
      return ""
  }
}

const getNotificationEventName = (event: string) => {
  switch (event) {
    case "orderCreated":
      return "إنشاء طلب جديد"
    case "orderStatusChanged":
      return "تغيير حالة الطلب"
    case "orderCompleted":
      return "إكمال الطلب"
    case "documentUploaded":
      return "رفع مستند"
    case "invoiceIssued":
      return "إصدار فاتورة"
    case "paymentReceived":
      return "استلام دفعة"
    case "commentAdded":
      return "إضافة تعليق"
    default:
      return event
  }
}

const getNotificationEventDescription = (event: string) => {
  switch (event) {
    case "orderCreated":
      return "إشعار عند إنشاء طلب جديد"
    case "orderStatusChanged":
      return "إشعار عند تغيير حالة الطلب"
    case "orderCompleted":
      return "إشعار عند إكمال الطلب"
    case "documentUploaded":
      return "إشعار عند رفع مستند جديد"
    case "invoiceIssued":
      return "إشعار عند إصدار فاتورة جديدة"
    case "paymentReceived":
      return "إشعار عند استلام دفعة"
    case "commentAdded":
      return "إشعار عند إضافة تعليق"
    default:
      return ""
  }
}

const getFieldTypeName = (type: string) => {
  switch (type) {
    case "text":
      return "نص"
    case "number":
      return "رقم"
    case "date":
      return "تاريخ"
    case "select":
      return "قائمة اختيار"
    case "checkbox":
      return "مربع اختيار"
    default:
      return type
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: "",
    email: "",
    phone: "",
    language: "ar",
    timeZone: "Asia/Riyadh",
    notificationPreferences: {
      email: true,
      sms: true,
      app: true
    }
  })
  
  // Company settings
  const [companySettings, setCompanySettings] = useState({
    name: "Pro Speed",
    legalName: "شركة برو سبيد للخدمات اللوجستية",
    email: "info@prospeed.com",
    phone: "0512345678",
    address: "الرياض، حي العليا، شارع التخصصي",
    taxNumber: "300012345600003",
    commercialRegister: "1234567890",
    logo: null,
    website: "www.prospeed.com",
    socialMedia: {
      twitter: "",
      linkedin: "",
      facebook: ""
    },
    workingHours: {
      sunday: { from: "08:00", to: "17:00", closed: false },
      monday: { from: "08:00", to: "17:00", closed: false },
      tuesday: { from: "08:00", to: "17:00", closed: false },
      wednesday: { from: "08:00", to: "17:00", closed: false },
      thursday: { from: "08:00", to: "17:00", closed: false },
      friday: { from: "08:00", to: "14:00", closed: false },
      saturday: { from: "00:00", to: "00:00", closed: true }
    }
  })
  
  // Services settings
  const [servicesSettings, setServicesSettings] = useState({
    enabledServices: {
      import: true,
      export: true,
      shipping: true,
      transport: true,
      storage: true,
      translation: true,
      customs: true
    },
    serviceOptions: {
      import: {
        requireDocuments: true,
        allowPartialSubmission: false,
        autoAssignBroker: true
      },
      export: {
        requireDocuments: true,
        allowPartialSubmission: false,
        autoAssignBroker: true
      },
      shipping: {
        supportedTypes: ["sea", "air", "land"],
        defaultType: "sea",
        requireInsurance: true
      },
      transport: {
        supportedVehicles: ["dina", "trailer", "van"],
        supportedTemperatures: ["refrigerated", "dry"],
        requireDriverAssignment: true
      },
      translation: {
        supportedLanguages: ["ar", "en", "fr"],
        requireVerification: true
      }
    },
    pricing: {
      import: { base: 1000, perKg: 5 },
      export: { base: 1200, perKg: 6 },
      shipping: { 
        sea: { base: 2000, perContainer: 500 },
        air: { base: 3000, perKg: 15 },
        land: { base: 1500, perKm: 2 }
      },
      transport: {
        dina: { base: 800, perKm: 1.5 },
        trailer: { base: 1200, perKm: 2.5 },
        van: { base: 500, perKm: 1 }
      },
      translation: { perPage: 50, rush: 75 }
    }
  })
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    channels: {
      email: true,
      sms: true,
      push: true,
      whatsapp: false
    },
    events: {
      orderCreated: true,
      orderStatusChanged: true,
      orderCompleted: true,
      documentUploaded: true,
      invoiceIssued: true,
      paymentReceived: true,
      commentAdded: true
    },
    templates: {
      orderCreated: {
        email: {
          subject: "تم إنشاء طلب جديد - [ORDER_NUMBER]",
          body: "تم إنشاء طلبك رقم [ORDER_NUMBER] بنجاح. يمكنك متابعة حالة الطلب من خلال حسابك."
        },
        sms: "تم إنشاء طلبك رقم [ORDER_NUMBER] بنجاح. برو سبيد"
      },
      orderCompleted: {
        email: {
          subject: "تم إكمال طلبك - [ORDER_NUMBER]",
          body: "تم إكمال طلبك رقم [ORDER_NUMBER] بنجاح. شكراً لاختيارك برو سبيد."
        },
        sms: "تم إكمال طلبك رقم [ORDER_NUMBER] بنجاح. برو سبيد"
      }
    },
    schedules: {
      dailySummary: true,
      dailySummaryTime: "18:00",
      weeklyReport: true,
      weeklyReportDay: "thursday"
    }
  })
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    authentication: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        expiryDays: 90
      },
      twoFactorAuth: {
        enabled: false,
        required: false,
        methods: ["email", "app"]
      },
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
      lockoutDuration: 15 // minutes
    },
    dataProtection: {
      dataRetention: {
        orders: 7, // years
        invoices: 10, // years
        clients: 5 // years
      },
      encryption: {
        filesAtRest: true,
        sensitiveData: true
      },
      backups: {
        frequency: "daily",
        retention: 30, // days
        encryptBackups: true
      }
    },
    accessControl: {
      ipRestriction: {
        enabled: false,
        allowedIPs: []
      },
      geoRestriction: {
        enabled: false,
        allowedCountries: ["SA"]
      }
    }
  })
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    appearance: {
      theme: "light",
      primaryColor: "#0f172a",
      accentColor: "#3b82f6",
      direction: "rtl",
      density: "comfortable",
      animations: true
    },
    localization: {
      defaultLanguage: "ar",
      dateFormat: "dd/MM/yyyy",
      timeFormat: "24h",
      timezone: "Asia/Riyadh",
      currency: "SAR",
      firstDayOfWeek: "sunday"
    },
    performance: {
      caching: true,
      cacheDuration: 15, // minutes
      pagination: {
        defaultPageSize: 10,
        pageSizeOptions: [10, 25, 50, 100]
      }
    },
    integration: {
      apis: {
        enabled: true,
        requireApiKey: true
      },
      thirdParty: {
        googleMaps: {
          enabled: true,
          apiKey: ""
        },
        sms: {
          provider: "twilio",
          enabled: true,
          apiKey: ""
        },
        payment: {
          providers: ["mada", "visa", "mastercard", "stcpay"],
          defaultProvider: "mada"
        }
      }
    },
    customization: {
      dashboard: {
        widgets: ["recentOrders", "statistics", "pendingTasks", "calendar"],
        layout: "grid"
      },
      orderFlow: {
        steps: ["creation", "document", "review", "processing", "completion"],
        allowSkipSteps: false
      }
    }
  })
  
  // Workflow settings
  const [workflowSettings, setWorkflowSettings] = useState({
    approvals: {
      orders: {
        enabled: true,
        levels: 1,
        requiredRoles: ["OPERATIONS_MANAGER"]
      },
      invoices: {
        enabled: true,
        levels: 1,
        requiredRoles: ["ACCOUNTANT"]
      },
      expenses: {
        enabled: true,
        levels: 2,
        requiredRoles: ["ACCOUNTANT", "GENERAL_MANAGER"]
      }
    },
    automation: {
      notifications: {
        orderStatusChange: true,
        documentUpload: true,
        paymentReceived: true
      },
      assignments: {
        autoAssignBroker: true,
        autoAssignDriver: true,
        loadBalancing: true
      },
      reminders: {
        documentExpiry: true,
        paymentDue: true,
        taskDeadline: true
      }
    },
    sla: {
      responseTime: 4, // hours
      processingTime: {
        import: 24, // hours
        export: 24, // hours
        shipping: 48, // hours
        transport: 12 // hours
      },
      escalation: {
        enabled: true,
        levels: [
          { hours: 4, notifyRoles: ["OPERATIONS_MANAGER"] },
          { hours: 8, notifyRoles: ["GENERAL_MANAGER"] }
        ]
      }
    }
  })
  
  // Custom fields settings
  const [customFieldsSettings, setCustomFieldsSettings] = useState({
    entities: {
      orders: [
        { id: "priority", label: "الأولوية", type: "select", options: ["عادي", "عاجل", "فائق العجلة"], required: false, enabled: true },
        { id: "department", label: "القسم", type: "text", required: false, enabled: true }
      ],
      clients: [
        { id: "industry", label: "القطاع", type: "select", options: ["تجارة", "صناعة", "خدمات", "أخرى"], required: false, enabled: true },
        { id: "referral", label: "مصدر العميل", type: "text", required: false, enabled: true }
      ],
      invoices: [
        { id: "poNumber", label: "رقم أمر الشراء", type: "text", required: false, enabled: true }
      ]
    }
  })
  
  // Reports settings
  const [reportsSettings, setReportsSettings] = useState({
    scheduled: {
      daily: {
        enabled: true,
        time: "18:00",
        recipients: ["manager@example.com"],
        reports: ["ordersSummary", "pendingTasks"]
      },
      weekly: {
        enabled: true,
        day: "thursday",
        time: "17:00",
        recipients: ["manager@example.com", "director@example.com"],
        reports: ["weeklyPerformance", "clientActivity"]
      },
      monthly: {
        enabled: true,
        day: 1,
        time: "09:00",
        recipients: ["director@example.com"],
        reports: ["monthlyFinancials", "servicePerformance"]
      }
    },
    export: {
      formats: ["pdf", "excel", "csv"],
      defaultFormat: "excel",
      includeCompanyLogo: true
    },
    dashboards: {
      refresh: 15, // minutes
      defaultDateRange: "thisMonth"
    }
  })
  
  // Integrations settings
  const [integrationsSettings, setIntegrationsSettings] = useState({
    active: {
      googleMaps: {
        enabled: true,
        apiKey: "••••••••••••••••••••••••••••••••",
        usageLimit: 1000
      },
      sms: {
        enabled: true,
        provider: "twilio",
        apiKey: "••••••••••••••••••••••••••••••••",
        fromNumber: "+966512345678"
      },
      email: {
        enabled: true,
        provider: "sendgrid",
        apiKey: "••••••••••••••••••••••••••••••••",
        fromEmail: "no-reply@prospeed.com",
        fromName: "Pro Speed"
      },
      payment: {
        enabled: true,
        providers: [
          { name: "mada", enabled: true, merchantId: "••••••••••••" },
          { name: "visa", enabled: true, merchantId: "••••••••••••" },
          { name: "mastercard", enabled: true, merchantId: "••••••••••••" },
          { name: "stcpay", enabled: false, merchantId: "" }
        ]
      },
      customs: {
        enabled: true,
        apiKey: "••••••••••••••••••••••••••••••••",
        endpoint: "https://api.customs.gov.sa"
      }
    },
    available: [
      { id: "whatsapp", name: "WhatsApp Business", category: "communication", status: "available" },
      { id: "dropbox", name: "Dropbox", category: "storage", status: "available" },
      { id: "slack", name: "Slack", category: "communication", status: "available" },
      { id: "quickbooks", name: "QuickBooks", category: "accounting", status: "available" }
    ]
  })
  
  // Load user data and determine if admin
  useEffect(() => {
    if (user) {
      setProfileSettings({
        ...profileSettings,
        name: user.name || "",
        email: user.email || ""
      })
      
      // Check if user is admin
      setIsAdmin(
        user.role === "GENERAL_MANAGER" ||
        (Array.isArray(user.permissions) && user.permissions.includes("VIEW_ALL_ORDERS"))
      )
    }
  }, [user])
  
  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real application, you would upload this to your server
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        toast({
          title: "تم تحديث الصورة",
          description: "تم تحديث صورة الملف الشخصي بنجاح",
        })
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Handle save for different settings sections
  const handleSaveSettings = (section) => {
    toast({
      title: "تم الحفظ بنجاح",
      description: `تم حفظ إعدادات ${section} بنجاح`,
    })
  }
  
  // Add new custom field
  const [newCustomField, setNewCustomField] = useState({
    id: "",
    label: "",
    type: "text",
    options: "",
    required: false,
    enabled: true,
    entity: "orders"
  })
  
  const handleAddCustomField = () => {
    if (!newCustomField.label) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الحقل",
        variant: "destructive"
      })
      return
    }
    
    const fieldId = newCustomField.id || newCustomField.label.toLowerCase().replace(/\s+/g, '_')
    
    const newField = {
      id: fieldId,
      label: newCustomField.label,
      type: newCustomField.type,
      options: newCustomField.type === "select" ? newCustomField.options.split(',').map(o => o.trim()) : [],
      required: newCustomField.required,
      enabled: newCustomField.enabled
    }
    
    setCustomFieldsSettings(prev => ({
      ...prev,
      entities: {
        ...prev.entities,
        [newCustomField.entity]: [
          ...prev.entities[newCustomField.entity],
          newField
        ]
      }
    }))
    
    setNewCustomField({
      id: "",
      label: "",
      type: "text",
      options: "",
      required: false,
      enabled: true,
      entity: "orders"
    })
    
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة الحقل المخصص "${newCustomField.label}" بنجاح`
    })
  }
  
  // Add new allowed IP
  const [newAllowedIP, setNewAllowedIP] = useState("")
  
  const handleAddAllowedIP = () => {
    if (!newAllowedIP) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان IP",
        variant: "destructive"
      })
      return
    }
    
    setSecuritySettings(prev => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        ipRestriction: {
          ...prev.accessControl.ipRestriction,
          allowedIPs: [...prev.accessControl.ipRestriction.allowedIPs, newAllowedIP]
        }
      }
    }))
    
    setNewAllowedIP("")
    
    toast({
      title: "تمت الإضافة",
      description: `تم إضافة عنوان IP "${newAllowedIP}" بنجاح`
    })
  }
  
  // Remove allowed IP
  const handleRemoveAllowedIP = (ip) => {
    setSecuritySettings(prev => ({
      ...prev,
      accessControl: {
        ...prev.accessControl,
        ipRestriction: {
          ...prev.accessControl.ipRestriction,
          allowedIPs: prev.accessControl.ipRestriction.allowedIPs.filter(item => item !== ip)
        }
      }
    }))
    
    toast({
      title: "تم الحذف",
      description: `تم حذف عنوان IP "${ip}" بنجاح`
    })
  }
  
  // Toggle service
  const handleToggleService = (service) => {
    setServicesSettings(prev => ({
      ...prev,
      enabledServices: {
        ...prev.enabledServices,
        [service]: !prev.enabledServices[service]
      }
    }))
  }
  
  // Toggle notification channel
  const handleToggleNotificationChannel = (channel) => {
    setNotificationSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }))
  }
  
  // Toggle notification event
  const handleToggleNotificationEvent = (event) => {
    setNotificationSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: !prev.events[event]
      }
    }))
  }
  
  // Update working hours
  const handleUpdateWorkingHours = (day, field, value) => {
    setCompanySettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }))
  }
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>الملف الشخصي</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>الشركة</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>الخدمات</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>الإشعارات</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>الأمان</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>النظام</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>سير العمل</span>
            </TabsTrigger>
            <TabsTrigger value="customFields" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>الحقول المخصصة</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>التقارير</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>التكاملات</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>إدارة معلومات الملف الشخصي وتفضيلات الحساب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileImage || "/placeholder.svg"} />
                        <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "PS"}</AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      <input
                        type="file"
                        id="profile-image"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">اختر صورة ملفك الشخصي</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم</Label>
                      <Input 
                        id="name" 
                        value={profileSettings.name}
                        onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input 
                        id="phone" 
                        value={profileSettings.phone}
                        onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">اللغة المفضلة</Label>
                      <Select 
                        value={profileSettings.language}
                        onValueChange={(value) => setProfileSettings({...profileSettings, language: value})}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="اختر اللغة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">الإنجليزية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">المنطقة الزمنية</Label>
                      <Select 
                        value={profileSettings.timeZone}
                        onValueChange={(value) => setProfileSettings({...profileSettings, timeZone: value})}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="اختر المنطقة الزمنية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                          <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                          <SelectItem value="Europe/London">لندن (GMT+0/+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">تفضيلات الإشعارات</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications" className="font-medium">
                            إشعارات البريد الإلكتروني
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            تلقي الإشعارات عبر البريد الإلكتروني
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={profileSettings.notificationPreferences.email}
                          onCheckedChange={(checked) => 
                            setProfileSettings({
                              ...profileSettings, 
                              notificationPreferences: {
                                ...profileSettings.notificationPreferences,
                                email: checked
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications" className="font-medium">
                            إشعارات الرسائل النصية
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            تلقي الإشعارات عبر الرسائل النصية
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={profileSettings.notificationPreferences.sms}
                          onCheckedChange={(checked) => 
                            setProfileSettings({
                              ...profileSettings, 
                              notificationPreferences: {
                                ...profileSettings.notificationPreferences,
                                sms: checked
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="app-notifications" className="font-medium">
                            إشعارات التطبيق
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            تلقي الإشعارات داخل التطبيق
                          </p>
                        </div>
                        <Switch
                          id="app-notifications"
                          checked={profileSettings.notificationPreferences.app}
                          onCheckedChange={(checked) => 
                            setProfileSettings({
                              ...profileSettings, 
                              notificationPreferences: {
                                ...profileSettings.notificationPreferences,
                                app: checked
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('الملف الشخصي')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الشركة</CardTitle>
                <CardDescription>إدارة معلومات الشركة وبيانات الاتصال</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">اسم الشركة</Label>
                      <Input 
                        id="company-name" 
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legal-name">الاسم القانوني</Label>
                      <Input 
                        id="legal-name" 
                        value={companySettings.legalName}
                        onChange={(e) => setCompanySettings({...companySettings, legalName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">البريد الإلكتروني</Label>
                      <Input 
                        id="company-email" 
                        type="email" 
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">رقم الهاتف</Label>
                      <Input 
                        id="company-phone" 
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company-address">العنوان</Label>
                      <Textarea 
                        id="company-address" 
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-number">الرقم الضريبي</Label>
                      <Input 
                        id="tax-number" 
                        value={companySettings.taxNumber}
                        onChange={(e) => setCompanySettings({...companySettings, taxNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commercial-register">السجل التجاري</Label>
                      <Input 
                        id="commercial-register" 
                        value={companySettings.commercialRegister}
                        onChange={(e) => setCompanySettings({...companySettings, commercialRegister: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">الموقع الإلكتروني</Label>
                      <Input 
                        id="website" 
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                      />
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">ساعات العمل</h3>
                    <div className="space-y-4">
                      {Object.entries(companySettings.workingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className="w-24">
                            <Label>{getDayName(day)}</Label>
                          </div>
                          <div className="flex-1 flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Checkbox 
                                id={`${day}-closed`} 
                                checked={hours.closed}
                                onCheckedChange={(checked) => 
                                  handleUpdateWorkingHours(day, 'closed', checked)
                                }
                              />
                              <Label htmlFor={`${day}-closed`} className="text-sm">مغلق</Label>
                            </div>
                            {!hours.closed && (
                              <>
                                <div className="space-y-1">
                                  <Label htmlFor={`${day}-from`} className="text-sm">من</Label>
                                  <Input 
                                    id={`${day}-from`} 
                                    type="time" 
                                    className="w-24" 
                                    value={hours.from}
                                    onChange={(e) => handleUpdateWorkingHours(day, 'from', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`${day}-to`} className="text-sm">إلى</Label>
                                  <Input 
                                    id={`${day}-to`} 
                                    type="time" 
                                    className="w-24" 
                                    value={hours.to}
                                    onChange={(e) => handleUpdateWorkingHours(day, 'to', e.target.value)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('الشركة')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Settings */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الخدمات</CardTitle>
                <CardDescription>إدارة الخدمات المتاحة وخياراتها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الخدمات المتاحة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(servicesSettings.enabledServices).map(([service, enabled]) => (
                        <Card key={service} className={`border-2 ${enabled ? 'border-primary' : 'border-muted'}`}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              {getServiceIcon(service)}
                              <div>
                                <h4 className="font-medium">{getServiceName(service)}</h4>
                                <p className="text-sm text-muted-foreground">{getServiceDescription(service)}</p>
                              </div>
                            </div>
                            <Switch 
                              checked={enabled}
                              onCheckedChange={() => handleToggleService(service)}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">خيارات الخدمات</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="import">
                        <AccordionTrigger>تخليص وارد</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="import-require-documents">طلب المستندات إلزامي</Label>
                              <Switch 
                                id="import-require-documents"
                                checked={servicesSettings.serviceOptions.import.requireDocuments}
                                onCheckedChange={(checked) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      import: {
                                        ...servicesSettings.serviceOptions.import,
                                        requireDocuments: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="import-partial-submission">السماح بالتقديم الجزئي</Label>
                              <Switch 
                                id="import-partial-submission"
                                checked={servicesSettings.serviceOptions.import.allowPartialSubmission}
                                onCheckedChange={(checked) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      import: {
                                        ...servicesSettings.serviceOptions.import,
                                        allowPartialSubmission: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="import-auto-assign">تعيين مخلص تلقائياً</Label>
                              <Switch 
                                id="import-auto-assign"
                                checked={servicesSettings.serviceOptions.import.autoAssignBroker}
                                onCheckedChange={(checked) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      import: {
                                        ...servicesSettings.serviceOptions.import,
                                        autoAssignBroker: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="shipping">
                        <AccordionTrigger>الشحن</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="space-y-2">
                              <Label>أنواع الشحن المدعومة</Label>
                              <div className="flex flex-wrap gap-2">
                                {['sea', 'air', 'land'].map(type => (
                                  <div key={type} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Checkbox 
                                      id={`shipping-type-${type}`}
                                      checked={servicesSettings.serviceOptions.shipping.supportedTypes.includes(type)}
                                      onCheckedChange={(checked) => {
                                        const types = checked 
                                          ? [...servicesSettings.serviceOptions.shipping.supportedTypes, type]
                                          : servicesSettings.serviceOptions.shipping.supportedTypes.filter(t => t !== type)
                                        
                                        setServicesSettings({
                                          ...servicesSettings,
                                          serviceOptions: {
                                            ...servicesSettings.serviceOptions,
                                            shipping: {
                                              ...servicesSettings.serviceOptions.shipping,
                                              supportedTypes: types
                                            }
                                          }
                                        })
                                      }}
                                    />
                                    <Label htmlFor={`shipping-type-${type}`}>{getShippingTypeName(type)}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="default-shipping-type">نوع الشحن الافتراضي</Label>
                              <Select 
                                value={servicesSettings.serviceOptions.shipping.defaultType}
                                onValueChange={(value) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      shipping: {
                                        ...servicesSettings.serviceOptions.shipping,
                                        defaultType: value
                                      }
                                    }
                                  })
                                }
                              >
                                <SelectTrigger id="default-shipping-type">
                                  <SelectValue placeholder="اختر النوع الافتراضي" />
                                </SelectTrigger>
                                <SelectContent>
                                  {servicesSettings.serviceOptions.shipping.supportedTypes.map(type => (
                                    <SelectItem key={type} value={type}>{getShippingTypeName(type)}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor="require-insurance">التأمين إلزامي</Label>
                              <Switch 
                                id="require-insurance"
                                checked={servicesSettings.serviceOptions.shipping.requireInsurance}
                                onCheckedChange={(checked) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      shipping: {
                                        ...servicesSettings.serviceOptions.shipping,
                                        requireInsurance: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="translation">
                        <AccordionTrigger>الترجمة</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="space-y-2">
                              <Label>اللغات المدعومة</Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { code: 'ar', name: 'العربية' },
                                  { code: 'en', name: 'الإنجليزية' },
                                  { code: 'fr', name: 'الفرنسية' },
                                  { code: 'de', name: 'الألمانية' },
                                  { code: 'es', name: 'الإسبانية' },
                                  { code: 'zh', name: 'الصينية' }
                                ].map(lang => (
                                  <div key={lang.code} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Checkbox 
                                      id={`lang-${lang.code}`}
                                      checked={servicesSettings.serviceOptions.translation.supportedLanguages.includes(lang.code)}
                                      onCheckedChange={(checked) => {
                                        const langs = checked 
                                          ? [...servicesSettings.serviceOptions.translation.supportedLanguages, lang.code]
                                          : servicesSettings.serviceOptions.translation.supportedLanguages.filter(l => l !== lang.code)
                                        
                                        setServicesSettings({
                                          ...servicesSettings,
                                          serviceOptions: {
                                            ...servicesSettings.serviceOptions,
                                            translation: {
                                              ...servicesSettings.serviceOptions.translation,
                                              supportedLanguages: langs
                                            }
                                          }
                                        })
                                      }}
                                    />
                                    <Label htmlFor={`lang-${lang.code}`}>{lang.name}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor="require-verification">التحقق من الترجمة إلزامي</Label>
                              <Switch 
                                id="require-verification"
                                checked={servicesSettings.serviceOptions.translation.requireVerification}
                                onCheckedChange={(checked) => 
                                  setServicesSettings({
                                    ...servicesSettings,
                                    serviceOptions: {
                                      ...servicesSettings.serviceOptions,
                                      translation: {
                                        ...servicesSettings.serviceOptions.translation,
                                        requireVerification: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('الخدمات')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>إدارة قنوات وأنواع الإشعارات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">قنوات الإشعارات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(notificationSettings.channels).map(([channel, enabled]) => (
                        <div key={channel} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={`channel-${channel}`} className="font-medium">
                              {getNotificationChannelName(channel)}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {getNotificationChannelDescription(channel)}
                            </p>
                          </div>
                          <Switch 
                            id={`channel-${channel}`}
                            checked={enabled}
                            onCheckedChange={() => handleToggleNotificationChannel(channel)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">أحداث الإشعارات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(notificationSettings.events).map(([event, enabled]) => (
                        <div key={event} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={`event-${event}`} className="font-medium">
                              {getNotificationEventName(event)}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {getNotificationEventDescription(event)}
                            </p>
                          </div>
                          <Switch 
                            id={`event-${event}`}
                            checked={enabled}
                            onCheckedChange={() => handleToggleNotificationEvent(event)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">قوالب الإشعارات</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="order-created">
                        <AccordionTrigger>إنشاء طلب جديد</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="space-y-2">
                              <Label htmlFor="order-created-email-subject">عنوان البريد الإلكتروني</Label>
                              <Input 
                                id="order-created-email-subject"
                                value={notificationSettings.templates.orderCreated.email.subject}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCreated: {
                                        ...notificationSettings.templates.orderCreated,
                                        email: {
                                          ...notificationSettings.templates.orderCreated.email,
                                          subject: e.target.value
                                        }
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="order-created-email-body">نص البريد الإلكتروني</Label>
                              <Textarea 
                                id="order-created-email-body"
                                rows={4}
                                value={notificationSettings.templates.orderCreated.email.body}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCreated: {
                                        ...notificationSettings.templates.orderCreated,
                                        email: {
                                          ...notificationSettings.templates.orderCreated.email,
                                          body: e.target.value
                                        }
                                      }
                                    }
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                يمكنك استخدام الرموز التالية: [ORDER_NUMBER], [CLIENT_NAME], [DATE], [STATUS]
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="order-created-sms">نص الرسالة النصية</Label>
                              <Textarea 
                                id="order-created-sms"
                                rows={2}
                                value={notificationSettings.templates.orderCreated.sms}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCreated: {
                                        ...notificationSettings.templates.orderCreated,
                                        sms: e.target.value
                                      }
                                    }
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                يمكنك استخدام الرموز التالية: [ORDER_NUMBER], [CLIENT_NAME], [DATE], [STATUS]
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="order-completed">
                        <AccordionTrigger>إكمال الطلب</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="space-y-2">
                              <Label htmlFor="order-completed-email-subject">عنوان البريد الإلكتروني</Label>
                              <Input 
                                id="order-completed-email-subject"
                                value={notificationSettings.templates.orderCompleted.email.subject}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCompleted: {
                                        ...notificationSettings.templates.orderCompleted,
                                        email: {
                                          ...notificationSettings.templates.orderCompleted.email,
                                          subject: e.target.value
                                        }
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="order-completed-email-body">نص البريد الإلكتروني</Label>
                              <Textarea 
                                id="order-completed-email-body"
                                rows={4}
                                value={notificationSettings.templates.orderCompleted.email.body}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCompleted: {
                                        ...notificationSettings.templates.orderCompleted,
                                        email: {
                                          ...notificationSettings.templates.orderCompleted.email,
                                          body: e.target.value
                                        }
                                      }
                                    }
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                يمكنك استخدام الرموز التالية: [ORDER_NUMBER], [CLIENT_NAME], [DATE], [STATUS]
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="order-completed-sms">نص الرسالة النصية</Label>
                              <Textarea 
                                id="order-completed-sms"
                                rows={2}
                                value={notificationSettings.templates.orderCompleted.sms}
                                onChange={(e) => 
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    templates: {
                                      ...notificationSettings.templates,
                                      orderCompleted: {
                                        ...notificationSettings.templates.orderCompleted,
                                        sms: e.target.value
                                      }
                                    }
                                  })
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                يمكنك استخدام الرموز التالية: [ORDER_NUMBER], [CLIENT_NAME], [DATE], [STATUS]
                              </p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('الإشعارات')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأمان</CardTitle>
                <CardDescription>إدارة سياسات الأمان وحماية البيانات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">سياسة كلمة المرور</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min-password-length">الحد الأدنى لطول كلمة المرور</Label>
                        <Select 
                          value={securitySettings.authentication.passwordPolicy.minLength.toString()}
                          onValueChange={(value) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                passwordPolicy: {
                                  ...securitySettings.authentication.passwordPolicy,
                                  minLength: Number.parseInt(value)
                                }
                              }
                            })
                          }
                        >
                          <SelectTrigger id="min-password-length">
                            <SelectValue placeholder="اختر الحد الأدنى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6">6 أحرف</SelectItem>
                            <SelectItem value="8">8 أحرف</SelectItem>
                            <SelectItem value="10">10 أحرف</SelectItem>
                            <SelectItem value="12">12 حرف</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password-expiry">مدة انتهاء كلمة المرور (بالأيام)</Label>
                        <Select 
                          value={securitySettings.authentication.passwordPolicy.expiryDays.toString()}
                          onValueChange={(value) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                passwordPolicy: {
                                  ...securitySettings.authentication.passwordPolicy,
                                  expiryDays: Number.parseInt(value)
                                }
                              }
                            })
                          }
                        >
                          <SelectTrigger id="password-expiry">
                            <SelectValue placeholder="اختر المدة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 يوم</SelectItem>
                            <SelectItem value="60">60 يوم</SelectItem>
                            <SelectItem value="90">90 يوم</SelectItem>
                            <SelectItem value="180">180 يوم</SelectItem>
                            <SelectItem value="365">365 يوم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-uppercase">تتطلب أحرف كبيرة</Label>
                        <Switch 
                          id="require-uppercase"
                          checked={securitySettings.authentication.passwordPolicy.requireUppercase}
                          onCheckedChange={(checked) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                passwordPolicy: {
                                  ...securitySettings.authentication.passwordPolicy,
                                  requireUppercase: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-numbers">تتطلب أرقام</Label>
                        <Switch 
                          id="require-numbers"
                          checked={securitySettings.authentication.passwordPolicy.requireNumbers}
                          onCheckedChange={(checked) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                passwordPolicy: {
                                  ...securitySettings.authentication.passwordPolicy,
                                  requireNumbers: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-special-chars">تتطلب رموز خاصة</Label>
                        <Switch 
                          id="require-special-chars"
                          checked={securitySettings.authentication.passwordPolicy.requireSpecialChars}
                          onCheckedChange={(checked) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                passwordPolicy: {
                                  ...securitySettings.authentication.passwordPolicy,
                                  requireSpecialChars: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">المصادقة الثنائية</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor-auth" className="font-medium">
                            تفعيل المصادقة الثنائية
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            تفعيل المصادقة الثنائية لزيادة أمان الحسابات
                          </p>
                        </div>
                        <Switch 
                          id="two-factor-auth"
                          checked={securitySettings.authentication.twoFactorAuth.enabled}
                          onCheckedChange={(checked) => 
                            setSecuritySettings({
                              ...securitySettings,
                              authentication: {
                                ...securitySettings.authentication,
                                twoFactorAuth: {
                                  ...securitySettings.authentication.twoFactorAuth,
                                  enabled: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      {securitySettings.authentication.twoFactorAuth.enabled && (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="two-factor-required" className="font-medium">
                                إلزامية للجميع
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                جعل المصادقة الثنائية إلزامية لجميع المستخدمين
                              </p>
                            </div>
                            <Switch 
                              id="two-factor-required"
                              checked={securitySettings.authentication.twoFactorAuth.required}
                              onCheckedChange={(checked) => 
                                setSecuritySettings({
                                  ...securitySettings,
                                  authentication: {
                                    ...securitySettings.authentication,
                                    twoFactorAuth: {
                                      ...securitySettings.authentication.twoFactorAuth,
                                      required: checked
                                    }
                                  }
                                })
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>طرق المصادقة المتاحة</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: 'email', label: 'البريد الإلكتروني' },
                                { value: 'sms', label: 'الرسائل النصية' },
                                { value: 'app', label: 'تطبيق المصادقة' }
                              ].map(method => (
                                <div key={method.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <Checkbox 
                                    id={`auth-method-${method.value}`}
                                    checked={securitySettings.authentication.twoFactorAuth.methods.includes(method.value)}
                                    onCheckedChange={(checked) => {
                                      const methods = checked 
                                        ? [...securitySettings.authentication.twoFactorAuth.methods, method.value]
                                        : securitySettings.authentication.twoFactorAuth.methods.filter(m => m !== method.value)
                                      
                                      setSecuritySettings({
                                        ...securitySettings,
                                        authentication: {
                                          ...securitySettings.authentication,
                                          twoFactorAuth: {
                                            ...securitySettings.authentication.twoFactorAuth,
                                            methods
                                          }
                                        }
                                      })
                                    }}
                                  />
                                  <Label htmlFor={`auth-method-${method.value}`}>{method.label}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">تقييد الوصول</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ip-restriction" className="font-medium">
                            تقييد عناوين IP
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            السماح بالوصول فقط من عناوين IP محددة
                          </p>
                        </div>
                        <Switch 
                          id="ip-restriction"
                          checked={securitySettings.accessControl.ipRestriction.enabled}
                          onCheckedChange={(checked) => 
                            setSecuritySettings({
                              ...securitySettings,
                              accessControl: {
                                ...securitySettings.accessControl,
                                ipRestriction: {
                                  ...securitySettings.accessControl.ipRestriction,
                                  enabled: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      {securitySettings.accessControl.ipRestriction.enabled && (
                        <div className="space-y-2 border p-4 rounded-md">
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Label htmlFor="new-ip">إضافة عنوان IP</Label>
                              <Input 
                                id="new-ip"
                                placeholder="مثال: 192.168.1.1"
                                value={newAllowedIP}
                                onChange={(e) => setNewAllowedIP(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleAddAllowedIP}>إضافة</Button>
                          </div>
                          
                          {securitySettings.accessControl.ipRestriction.allowedIPs.length > 0 ? (
                            <div className="mt-4">
                              <Label>عناوين IP المسموح بها</Label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {securitySettings.accessControl.ipRestriction.allowedIPs.map(ip => (
                                  <div key={ip} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                                    <span>{ip}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-1 ml-1"
                                      onClick={() => handleRemoveAllowedIP(ip)}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">
                              لم يتم إضافة أي عناوين IP بعد. سيتم منع جميع المستخدمين من الوصول.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('الأمان')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النظام</CardTitle>
                <CardDescription>إدارة إعدادات المظهر واللغة والأداء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">المظهر</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">السمة</Label>
                        <Select 
                          value={systemSettings.appearance.theme}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              appearance: {
                                ...systemSettings.appearance,
                                theme: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="theme">
                            <SelectValue placeholder="اختر السمة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">فاتح</SelectItem>
                            <SelectItem value="dark">داكن</SelectItem>
                            <SelectItem value="system">حسب النظام</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="direction">اتجاه النص</Label>
                        <Select 
                          value={systemSettings.appearance.direction}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              appearance: {
                                ...systemSettings.appearance,
                                direction: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="direction">
                            <SelectValue placeholder="اختر الاتجاه" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rtl">من اليمين إلى اليسار</SelectItem>
                            <SelectItem value="ltr">من اليسار إلى اليمين</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="density">كثافة العرض</Label>
                        <Select 
                          value={systemSettings.appearance.density}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              appearance: {
                                ...systemSettings.appearance,
                                density: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="density">
                            <SelectValue placeholder="اختر الكثافة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">مضغوط</SelectItem>
                            <SelectItem value="comfortable">مريح</SelectItem>
                            <SelectItem value="spacious">فسيح</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animations">تفعيل الرسوم المتحركة</Label>
                        <Switch 
                          id="animations"
                          checked={systemSettings.appearance.animations}
                          onCheckedChange={(checked) => 
                            setSystemSettings({
                              ...systemSettings,
                              appearance: {
                                ...systemSettings.appearance,
                                animations: checked
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">اللغة والتوطين</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="default-language">اللغة الافتراضية</Label>
                        <Select 
                          value={systemSettings.localization.defaultLanguage}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              localization: {
                                ...systemSettings.localization,
                                defaultLanguage: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="default-language">
                            <SelectValue placeholder="اختر اللغة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ar">العربية</SelectItem>
                            <SelectItem value="en">الإنجليزية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date-format">تنسيق التاريخ</Label>
                        <Select 
                          value={systemSettings.localization.dateFormat}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              localization: {
                                ...systemSettings.localization,
                                dateFormat: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="اختر التنسيق" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/MM/yyyy">DD/MM/YYYY (31/12/2023)</SelectItem>
                            <SelectItem value="MM/dd/yyyy">MM/DD/YYYY (12/31/2023)</SelectItem>
                            <SelectItem value="yyyy-MM-dd">YYYY-MM-DD (2023-12-31)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time-format">تنسيق الوقت</Label>
                        <Select 
                          value={systemSettings.localization.timeFormat}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              localization: {
                                ...systemSettings.localization,
                                timeFormat: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="time-format">
                            <SelectValue placeholder="اختر التنسيق" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 ساعة (مساءً/صباحاً)</SelectItem>
                            <SelectItem value="24h">24 ساعة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currency">العملة</Label>
                        <Select 
                          value={systemSettings.localization.currency}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              localization: {
                                ...systemSettings.localization,
                                currency: value
                              }
                            })
                          }
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="اختر العملة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                            <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                            <SelectItem value="EUR">يورو (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الأداء</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="caching" className="font-medium">
                            تفعيل التخزين المؤقت
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            تحسين الأداء عن طريق تخزين البيانات مؤقتاً
                          </p>
                        </div>
                        <Switch 
                          id="caching"
                          checked={systemSettings.performance.caching}
                          onCheckedChange={(checked) => 
                            setSystemSettings({
                              ...systemSettings,
                              performance: {
                                ...systemSettings.performance,
                                caching: checked
                              }
                            })
                          }
                        />
                      </div>
                      
                      {systemSettings.performance.caching && (
                        <div className="space-y-2">
                          <Label htmlFor="cache-duration">مدة التخزين المؤقت (بالدقائق)</Label>
                          <Select 
                            value={systemSettings.performance.cacheDuration.toString()}
                            onValueChange={(value) => 
                              setSystemSettings({
                                ...systemSettings,
                                performance: {
                                  ...systemSettings.performance,
                                  cacheDuration: Number.parseInt(value)
                                }
                              })
                            }
                          >
                            <SelectTrigger id="cache-duration">
                              <SelectValue placeholder="اختر المدة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 دقائق</SelectItem>
                              <SelectItem value="15">15 دقيقة</SelectItem>
                              <SelectItem value="30">30 دقيقة</SelectItem>
                              <SelectItem value="60">60 دقيقة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="default-page-size">حجم الصفحة الافتراضي</Label>
                        <Select 
                          value={systemSettings.performance.pagination.defaultPageSize.toString()}
                          onValueChange={(value) => 
                            setSystemSettings({
                              ...systemSettings,
                              performance: {
                                ...systemSettings.performance,
                                pagination: {
                                  ...systemSettings.performance.pagination,
                                  defaultPageSize: Number.parseInt(value)
                                }
                              }
                            })
                          }
                        >
                          <SelectTrigger id="default-page-size">
                            <SelectValue placeholder="اختر الحجم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 عناصر</SelectItem>
                            <SelectItem value="25">25 عنصر</SelectItem>
                            <SelectItem value="50">50 عنصر</SelectItem>
                            <SelectItem value="100">100 عنصر</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings('النظام')} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Settings */}
          <TabsContent value="workflow">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات سير العمل</CardTitle>
                <CardDescription>إدارة الموافقات والأتمتة ومستويات الخدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الموافقات</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="orders-approval">
                        <AccordionTrigger>موافقات الطلبات</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="orders-approval-enabled">تفعيل الموافقات</Label>
                              <Switch 
                                id="orders-approval-enabled"
                                checked={workflowSettings.approvals.orders.enabled}
                                onCheckedChange={(checked) => 
                                  setWorkflowSettings({
                                    ...workflowSettings,
                                    approvals: {
                                      ...workflowSettings.approvals,
                                      orders: {
                                        ...workflowSettings.approvals.orders,
                                        enabled: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            
                            {workflowSettings.approvals.orders.enabled && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="orders-approval-levels">عدد مستويات الموافقة</Label>
                                  <Select 
                                    value={workflowSettings.approvals.orders.levels.toString()}
                                    onValueChange={(value) => 
                                      setWorkflowSettings({
                                        ...workflowSettings,
                                        approvals: {
                                          ...workflowSettings.approvals,
                                          orders: {
                                            ...workflowSettings.approvals.orders,
                                            levels: Number.parseInt(value)
                                          }
                                        }
                                      })
                                    }
                                  >
                                    <SelectTrigger id="orders-approval-levels">
                                      <SelectValue placeholder="اختر عدد المستويات" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">مستوى واحد</SelectItem>
                                      <SelectItem value="2">مستويان</SelectItem>
                                      <SelectItem value="3">ثلاثة مستويات</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>الأدوار المطلوبة للموافقة</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      { value: 'OPERATIONS_MANAGER', label: 'مدير العمليات' },
                                      { value: 'CLEARANCE_MANAGER', label: 'مدير التخليص' },
                                      { value: 'GENERAL_MANAGER', label: 'المدير العام' }
                                    ].map(role => (
                                      <div key={role.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Checkbox 
                                          id={`orders-role-${role.value}`}
                                          checked={workflowSettings.approvals.orders.requiredRoles.includes(role.value)}
                                          onCheckedChange={(checked) => {
                                            const roles = checked 
                                              ? [...workflowSettings.approvals.orders.requiredRoles, role.value]
                                              : workflowSettings.approvals.orders.requiredRoles.filter(r => r !== role.value)
                                            
                                            setWorkflowSettings({
                                              ...workflowSettings,
                                              approvals: {
                                                ...workflowSettings.approvals,
                                                orders: {
                                                  ...workflowSettings.approvals.orders,
                                                  requiredRoles: roles
                                                }
                                              }
                                            })
                                          }}
                                        />
                                        <Label htmlFor={`orders-role-${role.value}`}>{role.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="invoices-approval">
                        <AccordionTrigger>موافقات الفواتير</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="invoices-approval-enabled">تفعيل الموافقات</Label>
                              <Switch 
                                id="invoices-approval-enabled"
                                checked={workflowSettings.approvals.invoices.enabled}
                                onCheckedChange={(checked) => 
                                  setWorkflowSettings({
                                    ...workflowSettings,
                                    approvals: {
                                      ...workflowSettings.approvals,
                                      invoices: {
                                        ...workflowSettings.approvals.invoices,
                                        enabled: checked
                                      }
                                    }
                                  })
                                }
                              />
                            </div>
                            
                            {workflowSettings.approvals.invoices.enabled && (
                              <>
                                <div className="space-y-2">
                                  <Label htmlFor="invoices-approval-levels">عدد مستويات الموافقة</Label>
                                  <Select 
                                    value={workflowSettings.approvals.invoices.levels.toString()}
                                    onValueChange={(value) => 
                                      setWorkflowSettings({
                                        ...workflowSettings,
                                        approvals: {
                                          ...workflowSettings.approvals,
                                          invoices: {
                                            ...workflowSettings.approvals.invoices,
                                            levels: Number.parseInt(value)
                                          }
                                        }
                                      })
                                    }
                                  >
                                    <SelectTrigger id="invoices-approval-levels">
                                      <SelectValue placeholder="اختر عدد المستويات" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">مستوى واحد</SelectItem>
                                      <SelectItem value="2">مستويان</SelectItem>
                                      <SelectItem value="3">ثلاثة مستويات</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>الأدوار المطلوبة للموافقة</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {[
                                      { value: 'ACCOUNTANT', label: 'محاسب' },
                                      { value: 'OPERATIONS_MANAGER', label: 'مدير العمليات' },
                                      { value: 'GENERAL_MANAGER', label: 'المدير العام' }
                                    ].map(role => (
                                      <div key={role.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                                        <Checkbox 
                                          id={`invoices-role-${role.value}`}
                                          checked={workflowSettings.approvals.invoices.requiredRoles.includes(role.value)}
                                          onCheckedChange={(checked) => {
                                            const roles = checked 
                                              ? [...workflowSettings.approvals.invoices.requiredRoles, role.value]
                                              : workflowSettings.approvals.invoices.requiredRoles.filter(r => r !== role.value)
                                            
                                            setWorkflowSettings({
                                              ...workflowSettings,
                                              approvals: {
                                                ...workflowSettings.approvals,
                                                invoices: {
                                                  ...workflowSettings.approvals.invoices,
                                                  requiredRoles: roles
                                                }
                                              }
                                            })
                                          }}
                                        />
                                        <Label htmlFor={`invoices-role-${role.value}`}>{role.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">الأتمتة</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-notifications">إشعارات تلقائية عند تغيير حالة الطلب</Label>
                        <Switch 
                          id="auto-notifications"
                          checked={workflowSettings.automation.notifications.orderStatusChange}
                          onCheckedChange={(checked) => 
                            setWorkflowSettings({
                              ...workflowSettings,
                              automation: {
                                ...workflowSettings.automation,
                                notifications: {
                                  ...workflowSettings.automation.notifications,
                                  orderStatusChange: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-document-notifications">إشعارات تلقائية عند رفع المستندات</Label>
                        <Switch 
                          id="auto-document-notifications"
                          checked={workflowSettings.automation.notifications.documentUpload}
                          onCheckedChange={(checked) => 
                            setWorkflowSettings({
                              ...workflowSettings,
                              automation: {
                                ...workflowSettings.automation,
                                notifications: {
                                  ...workflowSettings.automation.notifications,
                                  documentUpload: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-assign-broker">تعيين مخلص تلقائياً</Label>
                        <Switch 
                          id="auto-assign-broker"
                          checked={workflowSettings.automation.assignments.autoAssignBroker}
                          onCheckedChange={(checked) => 
                            setWorkflowSettings({
                              ...workflowSettings,
                              automation: {
                                ...workflowSettings.automation,
                                assignments: {
                                  ...workflowSettings.automation.assignments,
                                  autoAssignBroker: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-assign-driver">تعيين سائق تلقائياً</Label>
                        <Switch 
                          id="auto-assign-driver"
                          checked={workflowSettings.automation.assignments.autoAssignDriver}
                          onCheckedChange={(checked) => 
                            setWorkflowSettings({
                              ...workflowSettings,
                              automation: {
                                ...workflowSettings.automation,
                                assignments: {
                                  ...workflowSettings.automation.assignments,
                                  autoAssignDriver: checked
                                }
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button onClick={() => handleSaveSettings("workflow")}>
                      <Save className="h-4 w-4 ml-2" />
                      حفظ إعدادات سير العمل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
