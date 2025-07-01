import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        orders: "Orders",
        addOrder: "Add Order",
        orderNumber: "Order Number",
        customerName: "Customer Name",
        orderType: "Order Type",
        status: "Status",
        date: "Date",
        actions: "Actions",
        view: "View",
        print: "Print",
        shipping: "Shipping",
        clearance: "Clearance",
        transport: "Transport",
        details: "Details",
        save: "Save",
        selectLanguage: "Select Language",
        arabic: "Arabic",
        english: "English",
        selectOrderType: "Select Order Type",
        "قيد التنفيذ": "In Progress",
        مكتمل: "Completed",
      },
    },
    ar: {
      translation: {
        orders: "الطلبات",
        addOrder: "إضافة طلب",
        orderNumber: "رقم الطلب",
        customerName: "اسم العميل",
        orderType: "نوع الطلب",
        status: "الحالة",
        date: "التاريخ",
        actions: "الإجراءات",
        view: "عرض",
        print: "طباعة",
        shipping: "شحن",
        clearance: "تخليص",
        transport: "نقل",
        details: "التفاصيل",
        save: "حفظ",
        selectLanguage: "اختر اللغة",
        arabic: "العربية",
        english: "الإنجليزية",
        selectOrderType: "اختر نوع الطلب",
        "قيد التنفيذ": "قيد التنفيذ",
        مكتمل: "مكتمل",
      },
    },
  },
  lng: "ar", // Set default language to Arabic
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
