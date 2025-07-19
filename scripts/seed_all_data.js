const axios = require('axios');
const bcrypt = require('bcryptjs');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

// All the static data from initialize-data.tsx and localStorage
const staticData = {
  users: [
    // مستخدمو شركتك
    {
      name: "مدير النظام",
      email: "admin@pro.com",
      password: "Admin123",
      entity: "PRO",
      role: "GENERAL_MANAGER",
    },
    {
      name: "مدير العمليات",
      email: "operations@pro.com",
      password: "Ops123",
      entity: "PRO",
      role: "OPERATIONS_MANAGER",
    },
    {
      name: "مدير التخليص",
      email: "clearance@pro.com",
      password: "Clear123",
      entity: "PRO",
      role: "CLEARANCE_MANAGER",
    },
    {
      name: "مترجم",
      email: "translator@pro.com",
      password: "Trans123",
      entity: "PRO",
      role: "TRANSLATOR",
    },
    {
      name: "مخلص جمركي",
      email: "broker@pro.com",
      password: "Broker123",
      entity: "PRO",
      role: "CUSTOMS_BROKER",
    },
    {
      name: "سائق",
      email: "driver@pro.com",
      password: "Driver123",
      entity: "PRO",
      role: "DRIVER",
    },
    {
      name: "محاسب",
      email: "accountant@pro.com",
      password: "Acc123",
      entity: "PRO",
      role: "ACCOUNTANT",
    },
    {
      name: "مدخل بيانات",
      email: "dataentry@pro.com",
      password: "Data123",
      entity: "PRO",
      role: "DATA_ENTRY",
    },
    // مستخدمو العملاء
    {
      name: "مدير شركة ألفا",
      email: "manager@alpha.com",
      password: "Alpha123",
      entity: "CLIENT",
      role: "CLIENT_MANAGER",
      entityId: "CUST001",
    },
    {
      name: "مشرف شركة ألفا",
      email: "supervisor@alpha.com",
      password: "Alpha456",
      entity: "CLIENT",
      role: "CLIENT_SUPERVISOR",
      entityId: "CUST001",
    },
    {
      name: "مدخل بيانات شركة ألفا",
      email: "data@alpha.com",
      password: "Alpha789",
      entity: "CLIENT",
      role: "CLIENT_DATA_ENTRY",
      entityId: "CUST001",
    },
    // مستخدمو الموردين
    {
      name: "مدير شركة بيتا",
      email: "manager@beta.com",
      password: "Beta123",
      entity: "SUPPLIER",
      role: "SUPPLIER_MANAGER",
      entityId: "SUPP001",
    },
    {
      name: "مشرف شركة بيتا",
      email: "supervisor@beta.com",
      password: "Beta456",
      entity: "SUPPLIER",
      role: "SUPPLIER_SUPERVISOR",
      entityId: "SUPP001",
    },
    {
      name: "مدخل بيانات شركة بيتا",
      email: "data@beta.com",
      password: "Beta789",
      entity: "SUPPLIER",
      role: "SUPPLIER_DATA_ENTRY",
      entityId: "SUPP001",
    },
  ],

  customers: [
    {
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
      name: "أحمد محمد",
      type: "individual",
      phone: "0567891234",
      email: "ahmed@example.com",
      address: "جدة، حي الروضة، شارع الأمير سلطان",
      idNumber: "1098765432",
    },
    {
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
      name: "خالد عبدالله",
      type: "individual",
      phone: "0523456789",
      email: "khalid@example.com",
      address: "الرياض، حي النزهة، شارع عبدالرحمن الغافقي",
      idNumber: "2345678901",
    },
    {
      name: "شركة بيتا للخدمات اللوجستية",
      type: "company",
      phone: "0534567891",
      email: "info@beta-logistics.com",
      address: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
      contactPerson: "سعود الحربي",
      taxNumber: "300078912300003",
      idNumber: "6789012345",
    },
  ],

  suppliers: [
    {
      name: "شركة بيتا للخدمات اللوجستية",
      type: "company",
      phone: "0534567891",
      email: "info@beta-logistics.com",
      address: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
      contactPerson: "سعود الحربي",
      taxNumber: "300078912300003",
      idNumber: "6789012345",
    },
    {
      name: "شركة النقل السريع",
      type: "company",
      phone: "0543210987",
      email: "info@fast-transport.com",
      address: "الرياض، المنطقة الصناعية، طريق الملك خالد",
      contactPerson: "علي السريع",
      taxNumber: "300032109800003",
      idNumber: "4321098765",
    },
    {
      name: "مؤسسة الشحن العالمية",
      type: "company",
      phone: "0556789012",
      email: "contact@global-shipping.com",
      address: "الدمام، المنطقة الصناعية، طريق الملك فهد",
      contactPerson: "فهد العالمي",
      taxNumber: "300056789000003",
      idNumber: "5678901234",
    },
  ],

  orders: [
    {
      clientId: "CUST001",
      clientName: "شركة الفا للتجارة",
      services: ["shipping"],
      status: "قيد المراجعة",
      policyNumber: "POL-12345",
      documents: [
        { name: "فاتورة الشحن.pdf", type: "application/pdf" },
        { name: "صورة البضاعة.jpg", type: "image/jpeg" },
        { name: "تفاصيل الطلب.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      ],
    },
    {
      clientId: "CUST002",
      clientName: "أحمد محمد",
      services: ["import", "transport"],
      status: "موافق عليه",
      policyNumber: "POL-12346",
      documents: [
        { name: "شهادة المنشأ.pdf", type: "application/pdf" }
      ],
    },
    {
      clientId: "CUST003",
      clientName: "مؤسسة النور",
      services: ["export"],
      status: "مرفوض",
      policyNumber: "POL-12347",
      documents: [],
    },
    {
      clientId: "CUST004",
      clientName: "خالد عبدالله",
      services: ["transport"],
      status: "بانتظار مستندات إضافية",
      policyNumber: "POL-12348",
      documents: null,
    },
  ],

  vehicles: [
    {
      plateNumber: "أ ب ج 1234",
      type: "شاحنة",
      model: "مرسيدس",
      year: "2020",
      capacity: "20 طن",
      driver: "محمد السائق",
      phone: "0501234567",
      status: "متاح",
    },
    {
      plateNumber: "د ه و 5678",
      type: "شاحنة",
      model: "فولفو",
      year: "2021",
      capacity: "15 طن",
      driver: "أحمد الناقل",
      phone: "0502345678",
      status: "في مهمة",
    },
    {
      plateNumber: "ز ح ط 9012",
      type: "شاحنة صغيرة",
      model: "تويوتا",
      year: "2019",
      capacity: "5 طن",
      driver: "خالد السريع",
      phone: "0503456789",
      status: "متاح",
    },
    {
      plateNumber: "ي ك ل 3456",
      type: "شاحنة",
      model: "إيسوزو",
      year: "2022",
      capacity: "10 طن",
      driver: "سعد النقل",
      phone: "0504567890",
      status: "صيانة",
    },
  ],

  invoices: [
    {
      invoiceNumber: "INV-001",
      clientId: "CUST001",
      clientName: "شركة ألفا للتجارة",
      amount: 15000,
      currency: "SAR",
      status: "مدفوع",
      dueDate: "2024-01-15",
      services: ["شحن", "تخليص"],
    },
    {
      invoiceNumber: "INV-002",
      clientId: "CUST002",
      clientName: "أحمد محمد",
      amount: 8500,
      currency: "SAR",
      status: "معلق",
      dueDate: "2024-01-20",
      services: ["نقل"],
    },
    {
      invoiceNumber: "INV-003",
      clientId: "CUST003",
      clientName: "مؤسسة النور",
      amount: 22000,
      currency: "SAR",
      status: "متأخر",
      dueDate: "2024-01-10",
      services: ["تخليص صادر"],
    },
  ],

  shipments: [
    {
      trackingNumber: "TRK-001",
      orderId: "OP00001",
      status: "في الطريق",
      origin: "الرياض",
      destination: "جدة",
      estimatedDelivery: "2024-01-25",
      currentLocation: "مكة المكرمة",
    },
    {
      trackingNumber: "TRK-002",
      orderId: "OP00002",
      status: "تم التسليم",
      origin: "جدة",
      destination: "الدمام",
      estimatedDelivery: "2024-01-20",
      currentLocation: "الدمام",
      deliveredAt: "2024-01-19",
    },
  ],
};

// Helper function to make API calls
async function makeApiCall(endpoint, method, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

// Hash password function
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function seedAllData() {
  console.log('🌱 Starting comprehensive data seeding...\n');

  try {
    // Step 1: Login as admin to get token
    console.log('1. Logging in as admin...');
    const loginResult = await makeApiCall('/auth/login', 'POST', {
      email: 'admin@pro.com',
      password: 'Admin123'
    });

    if (!loginResult.success) {
      console.log('❌ Admin login failed:', loginResult.error);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Admin login successful\n');

    // Step 2: Seed Users
    console.log('2. Seeding Users...');
    for (const user of staticData.users) {
      const hashedPassword = await hashPassword(user.password);
      const userData = {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        entity: user.entity,
        role: user.role,
        entityId: user.entityId,
      };

      const result = await makeApiCall('/users', 'POST', userData, token);
      if (result.success) {
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`❌ Failed to create user ${user.name}:`, result.error);
      }
    }
    console.log('');

    // Step 3: Seed Customers
    console.log('3. Seeding Customers...');
    for (const customer of staticData.customers) {
      const result = await makeApiCall('/customers', 'POST', customer, token);
      if (result.success) {
        console.log(`✅ Created customer: ${customer.name}`);
      } else {
        console.log(`❌ Failed to create customer ${customer.name}:`, result.error);
      }
    }
    console.log('');

    // Step 4: Seed Suppliers
    console.log('4. Seeding Suppliers...');
    for (const supplier of staticData.suppliers) {
      const result = await makeApiCall('/suppliers', 'POST', supplier, token);
      if (result.success) {
        console.log(`✅ Created supplier: ${supplier.name}`);
      } else {
        console.log(`❌ Failed to create supplier ${supplier.name}:`, result.error);
      }
    }
    console.log('');

    // Step 5: Seed Vehicles
    console.log('5. Seeding Vehicles...');
    for (const vehicle of staticData.vehicles) {
      const result = await makeApiCall('/vehicles', 'POST', vehicle, token);
      if (result.success) {
        console.log(`✅ Created vehicle: ${vehicle.plateNumber}`);
      } else {
        console.log(`❌ Failed to create vehicle ${vehicle.plateNumber}:`, result.error);
      }
    }
    console.log('');

    // Step 6: Seed Orders
    console.log('6. Seeding Orders...');
    for (const order of staticData.orders) {
      const result = await makeApiCall('/orders', 'POST', order, token);
      if (result.success) {
        console.log(`✅ Created order for: ${order.clientName}`);
      } else {
        console.log(`❌ Failed to create order for ${order.clientName}:`, result.error);
      }
    }
    console.log('');

    // Step 7: Seed Invoices
    console.log('7. Seeding Invoices...');
    for (const invoice of staticData.invoices) {
      const result = await makeApiCall('/invoices', 'POST', invoice, token);
      if (result.success) {
        console.log(`✅ Created invoice: ${invoice.invoiceNumber}`);
      } else {
        console.log(`❌ Failed to create invoice ${invoice.invoiceNumber}:`, result.error);
      }
    }
    console.log('');

    // Step 8: Seed Shipments
    console.log('8. Seeding Shipments...');
    for (const shipment of staticData.shipments) {
      const result = await makeApiCall('/shipments', 'POST', shipment, token);
      if (result.success) {
        console.log(`✅ Created shipment: ${shipment.trackingNumber}`);
      } else {
        console.log(`❌ Failed to create shipment ${shipment.trackingNumber}:`, result.error);
      }
    }
    console.log('');

    console.log('🎉 Data seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${staticData.users.length}`);
    console.log(`- Customers: ${staticData.customers.length}`);
    console.log(`- Suppliers: ${staticData.suppliers.length}`);
    console.log(`- Vehicles: ${staticData.vehicles.length}`);
    console.log(`- Orders: ${staticData.orders.length}`);
    console.log(`- Invoices: ${staticData.invoices.length}`);
    console.log(`- Shipments: ${staticData.shipments.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

// Run the seeding
seedAllData(); 