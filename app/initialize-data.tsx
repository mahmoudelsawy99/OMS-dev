"use client"

import { useEffect } from "react"
import type { EntityType, RoleType } from "@/components/auth-provider"

interface User {
  id: string
  name: string
  email: string
  password: string
  entity: EntityType
  role: RoleType
  entityId?: string
}

export default function InitializeData() {
  useEffect(() => {
    // تهيئة بيانات المستخدمين إذا لم تكن موجودة
    if (!localStorage.getItem("users")) {
      const users: User[] = [
        // مستخدمو شركتك
        {
          id: "1",
          name: "مدير النظام",
          email: "admin@pro.com",
          password: "Admin123",
          entity: "PRO",
          role: "GENERAL_MANAGER",
        },
        {
          id: "2",
          name: "مدير العمليات",
          email: "operations@pro.com",
          password: "Ops123",
          entity: "PRO",
          role: "OPERATIONS_MANAGER",
        },
        {
          id: "3",
          name: "مدير التخليص",
          email: "clearance@pro.com",
          password: "Clear123",
          entity: "PRO",
          role: "CLEARANCE_MANAGER",
        },
        {
          id: "4",
          name: "مترجم",
          email: "translator@pro.com",
          password: "Trans123",
          entity: "PRO",
          role: "TRANSLATOR",
        },
        {
          id: "5",
          name: "مخلص جمركي",
          email: "broker@pro.com",
          password: "Broker123",
          entity: "PRO",
          role: "CUSTOMS_BROKER",
        },
        {
          id: "6",
          name: "سائق",
          email: "driver@pro.com",
          password: "Driver123",
          entity: "PRO",
          role: "DRIVER",
        },
        {
          id: "7",
          name: "محاسب",
          email: "accountant@pro.com",
          password: "Acc123",
          entity: "PRO",
          role: "ACCOUNTANT",
        },
        {
          id: "8",
          name: "مدخل بيانات",
          email: "dataentry@pro.com",
          password: "Data123",
          entity: "PRO",
          role: "DATA_ENTRY",
        },

        // مستخدمو العملاء
        {
          id: "9",
          name: "مدير شركة ألفا",
          email: "manager@alpha.com",
          password: "Alpha123",
          entity: "CLIENT",
          role: "CLIENT_MANAGER",
          entityId: "CUST001", // معرف العميل في جدول العملاء
        },
        {
          id: "10",
          name: "مشرف شركة ألفا",
          email: "supervisor@alpha.com",
          password: "Alpha456",
          entity: "CLIENT",
          role: "CLIENT_SUPERVISOR",
          entityId: "CUST001",
        },
        {
          id: "11",
          name: "مدخل بيانات شركة ألفا",
          email: "data@alpha.com",
          password: "Alpha789",
          entity: "CLIENT",
          role: "CLIENT_DATA_ENTRY",
          entityId: "CUST001",
        },

        // مستخدمو الموردين
        {
          id: "12",
          name: "مدير شركة بيتا",
          email: "manager@beta.com",
          password: "Beta123",
          entity: "SUPPLIER",
          role: "SUPPLIER_MANAGER",
          entityId: "SUPP001", // معرف المورد في جدول الموردين
        },
        {
          id: "13",
          name: "مشرف شركة بيتا",
          email: "supervisor@beta.com",
          password: "Beta456",
          entity: "SUPPLIER",
          role: "SUPPLIER_SUPERVISOR",
          entityId: "SUPP001",
        },
        {
          id: "14",
          name: "مدخل بيانات شركة بيتا",
          email: "data@beta.com",
          password: "Beta789",
          entity: "SUPPLIER",
          role: "SUPPLIER_DATA_ENTRY",
          entityId: "SUPP001",
        },
      ]

      localStorage.setItem("users", JSON.stringify(users))
    }

    // تهيئة بيانات العملاء إذا لم تكن موجودة
    if (!localStorage.getItem("customers")) {
      const customers = [
        {
          id: "CUST001",
          name: "شركة ألفا للتجارة",
          type: "company",
          phone: "0512345678",
          email: "info@alpha-trading.com",
          address: "الرياض، حي العليا، شارع التخصصي",
          contactPerson: "محمد العلي",
          taxNumber: "300012345600003",
          idNumber: "1234567890",
        },
        {
          id: "CUST002",
          name: "أحمد محمد",
          type: "individual",
          phone: "0567891234",
          email: "ahmed@example.com",
          address: "جدة، حي الروضة، شارع الأمير سلطان",
          idNumber: "1098765432",
        },
        {
          id: "CUST003",
          name: "مؤسسة النور",
          type: "company",
          phone: "0545678912",
          email: "contact@alnoor.com",
          address: "الدمام، حي الشاطئ، طريق الملك فهد",
          contactPerson: "خالد النور",
          taxNumber: "300045678900003",
          idNumber: "5432167890",
        },
        {
          id: "CUST004",
          name: "خالد عبدالله",
          type: "individual",
          phone: "0523456789",
          email: "khalid@example.com",
          address: "الرياض، حي النزهة، شارع عبدالرحمن الغافقي",
          idNumber: "2345678901",
        },
        {
          id: "CUST005",
          name: "شركة بيتا للخدمات اللوجستية",
          type: "company",
          phone: "0534567891",
          email: "info@beta-logistics.com",
          address: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
          contactPerson: "سعود الحربي",
          taxNumber: "300078912300003",
          idNumber: "6789012345",
        },
      ]
      localStorage.setItem("customers", JSON.stringify(customers))
    }

    // تهيئة بيانات الموردين إذا لم تكن موجودة
    if (!localStorage.getItem("suppliers")) {
      const suppliers = [
        {
          id: "SUPP001",
          name: "شركة بيتا للخدمات اللوجستية",
          type: "company",
          phone: "0534567891",
          email: "info@beta-logistics.com",
          address: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
          contactPerson: "سعود الحربي",
          taxNumber: "300078912300003",
          idNumber: "6789012345",
        },
        // ... باقي الموردين
      ]
      localStorage.setItem("suppliers", JSON.stringify(suppliers))
    }

    // Initialize orders if they don't exist
    if (!localStorage.getItem("orders")) {
      const orders = [
        {
          id: "OP00001",
          clientId: "CUST001",
          clientName: "شركة الفا للتجارة",
          services: ["shipping"],
          status: "قيد المراجعة",
          creationDate: "٢٥/٠٣/١٤٤٥",
          policyNumber: "POL-12345",
        },
        {
          id: "OP00002",
          clientId: "CUST002",
          clientName: "أحمد محمد",
          services: ["import", "transport"],
          status: "موافق عليه",
          creationDate: "٢٤/٠٣/١٤٤٥",
          policyNumber: "POL-12346",
        },
        {
          id: "OP00003",
          clientId: "CUST003",
          clientName: "مؤسسة النور",
          services: ["export"],
          status: "مرفوض",
          creationDate: "٢٣/٠٣/١٤٤٥",
          policyNumber: "POL-12347",
        },
        {
          id: "OP00004",
          clientId: "CUST004",
          clientName: "خالد عبدالله",
          services: ["transport"],
          status: "بانتظار مستندات إضافية",
          creationDate: "٢٢/٠٣/١٤٤٥",
          policyNumber: "POL-12348",
        },
      ]
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [])

  return null
}
