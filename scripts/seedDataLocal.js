const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

// Fake data extracted from frontend
const users = [
  // Company users (PRO)
  {
    name: "مدير النظام",
    email: "admin@pro.com",
    password: "Admin123",
    phone: "+966501234567",
    entity: "PRO",
    role: "GENERAL_MANAGER",
  },
  {
    name: "مدير العمليات",
    email: "operations@pro.com",
    password: "Ops123",
    phone: "+966502345678",
    entity: "PRO",
    role: "OPERATIONS_MANAGER",
  },
  {
    name: "مدير التخليص",
    email: "clearance@pro.com",
    password: "Clear123",
    phone: "+966503456789",
    entity: "PRO",
    role: "CLEARANCE_MANAGER",
  },
  {
    name: "مترجم",
    email: "translator@pro.com",
    password: "Trans123",
    phone: "+966504567890",
    entity: "PRO",
    role: "TRANSLATOR",
  },
  {
    name: "مخلص جمركي",
    email: "broker@pro.com",
    password: "Broker123",
    phone: "+966505678901",
    entity: "PRO",
    role: "CUSTOMS_BROKER",
  },
  {
    name: "سائق",
    email: "driver@pro.com",
    password: "Driver123",
    phone: "+966506789012",
    entity: "PRO",
    role: "DRIVER",
  },
  {
    name: "محاسب",
    email: "accountant@pro.com",
    password: "Acc123",
    phone: "+966507890123",
    entity: "PRO",
    role: "ACCOUNTANT",
  },
  {
    name: "مدخل بيانات",
    email: "dataentry@pro.com",
    password: "Data123",
    phone: "+966508901234",
    entity: "PRO",
    role: "DATA_ENTRY",
  },

  // Client users
  {
    name: "مدير شركة ألفا",
    email: "manager@alpha.com",
    password: "Alpha123",
    phone: "+966509012345",
    entity: "CLIENT",
    role: "CLIENT_MANAGER",
    entityId: "CUST001",
  },
  {
    name: "مشرف شركة ألفا",
    email: "supervisor@alpha.com",
    password: "Alpha456",
    phone: "+966509123456",
    entity: "CLIENT",
    role: "CLIENT_SUPERVISOR",
    entityId: "CUST001",
  },
  {
    name: "مدخل بيانات شركة ألفا",
    email: "data@alpha.com",
    password: "Alpha789",
    phone: "+966509234567",
    entity: "CLIENT",
    role: "CLIENT_DATA_ENTRY",
    entityId: "CUST001",
  },

  // Supplier users
  {
    name: "مدير شركة بيتا",
    email: "manager@beta.com",
    password: "Beta123",
    phone: "+966509345678",
    entity: "SUPPLIER",
    role: "SUPPLIER_MANAGER",
    entityId: "SUPP001",
  },
  {
    name: "مشرف شركة بيتا",
    email: "supervisor@beta.com",
    password: "Beta456",
    phone: "+966509456789",
    entity: "SUPPLIER",
    role: "SUPPLIER_SUPERVISOR",
    entityId: "SUPP001",
  },
  {
    name: "مدخل بيانات شركة بيتا",
    email: "data@beta.com",
    password: "Beta789",
    phone: "+966509567890",
    entity: "SUPPLIER",
    role: "SUPPLIER_DATA_ENTRY",
    entityId: "SUPP001",
  },
];

const customers = [
  {
    name: "شركة ألفا للتجارة",
    email: "info@alpha-trading.com",
    phone: "+966512345678",
    company: {
      name: "شركة ألفا للتجارة",
      taxId: "300012345600003",
      industry: "Import/Export",
    },
    address: {
      street: "الرياض، حي العليا، شارع التخصصي",
      city: "الرياض",
      country: "Saudi Arabia",
    },
    customerType: "business",
    creditLimit: 50000,
  },
  {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966567891234",
    address: {
      street: "جدة، حي الروضة، شارع الأمير سلطان",
      city: "جدة",
      country: "Saudi Arabia",
    },
    customerType: "individual",
  },
  {
    name: "مؤسسة النور",
    email: "contact@alnoor.com",
    phone: "+966545678912",
    company: {
      name: "مؤسسة النور",
      taxId: "300045678900003",
      industry: "Trading",
    },
    address: {
      street: "الدمام، حي الشاطئ، طريق الملك فهد",
      city: "الدمام",
      country: "Saudi Arabia",
    },
    customerType: "business",
    creditLimit: 30000,
  },
  {
    name: "خالد عبدالله",
    email: "khalid@example.com",
    phone: "+966523456789",
    address: {
      street: "الرياض، حي النزهة، شارع عبدالرحمن الغافقي",
      city: "الرياض",
      country: "Saudi Arabia",
    },
    customerType: "individual",
  },
  {
    name: "شركة بيتا للخدمات اللوجستية",
    email: "info@beta-logistics.com",
    phone: "+966534567891",
    company: {
      name: "شركة بيتا للخدمات اللوجستية",
      taxId: "300078912300003",
      industry: "Logistics",
    },
    address: {
      street: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
      city: "جدة",
      country: "Saudi Arabia",
    },
    customerType: "business",
    creditLimit: 75000,
  },
];

const suppliers = [
  {
    name: "شركة بيتا للخدمات اللوجستية",
    email: "info@beta-logistics.com",
    phone: "+966534567891",
    company: {
      name: "شركة بيتا للخدمات اللوجستية",
      taxId: "300078912300003",
      industry: "Logistics",
    },
    address: {
      street: "جدة، المنطقة الصناعية، طريق الملك عبدالعزيز",
      city: "جدة",
      country: "Saudi Arabia",
    },
    supplierType: "business",
  },
];

const orders = [
  {
    orderNumber: "ORD-1001",
    serviceType: "land_transport",
    status: "confirmed",
    priority: "high",
    origin: {
      address: "Riyadh Industrial City",
      city: "Riyadh",
      country: "Saudi Arabia",
      coordinates: { lat: 24.7136, lng: 46.6753 },
    },
    destination: {
      address: "Jeddah Port",
      city: "Jeddah",
      country: "Saudi Arabia",
      coordinates: { lat: 21.3891, lng: 39.8579 },
    },
    cargo: {
      description: "Electronic Equipment",
      weight: 1500,
      dimensions: { length: 200, width: 150, height: 100 },
      value: 25000,
      quantity: 10,
      packageType: "box",
    },
    pricing: {
      basePrice: 2500,
      additionalCharges: [
        { description: "Insurance", amount: 250 },
        { description: "Handling", amount: 150 },
      ],
      discount: 0,
      tax: 390,
      totalAmount: 3290,
    },
    timeline: {
      estimatedPickup: new Date(Date.now() + 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  },
  {
    orderNumber: "ORD-1002",
    serviceType: "express_delivery",
    status: "in_transit",
    priority: "medium",
    origin: {
      address: "Jeddah Mall",
      city: "Jeddah",
      country: "Saudi Arabia",
      coordinates: { lat: 21.3891, lng: 39.8579 },
    },
    destination: {
      address: "Dammam Residential",
      city: "Dammam",
      country: "Saudi Arabia",
      coordinates: { lat: 26.4207, lng: 50.0888 },
    },
    cargo: {
      description: "Personal Documents",
      weight: 2,
      dimensions: { length: 30, width: 20, height: 5 },
      value: 100,
      quantity: 1,
      packageType: "envelope",
    },
    pricing: {
      basePrice: 150,
      additionalCharges: [],
      discount: 15,
      tax: 20.25,
      totalAmount: 155.25,
    },
    timeline: {
      estimatedPickup: new Date(Date.now() - 12 * 60 * 60 * 1000),
      actualPickup: new Date(Date.now() - 10 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
  },
  {
    orderNumber: "ORD-1003",
    serviceType: "sea_freight",
    status: "pending",
    priority: "low",
    origin: {
      address: "Dammam Port",
      city: "Dammam",
      country: "Saudi Arabia",
      coordinates: { lat: 26.4207, lng: 50.0888 },
    },
    destination: {
      address: "Dubai Port",
      city: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.2048, lng: 55.2708 },
    },
    cargo: {
      description: "Industrial Machinery",
      weight: 5000,
      dimensions: { length: 500, width: 300, height: 250 },
      value: 75000,
      quantity: 2,
      packageType: "crate",
    },
    pricing: {
      basePrice: 8000,
      additionalCharges: [
        { description: "Customs Clearance", amount: 1200 },
        { description: "Port Handling", amount: 800 },
      ],
      discount: 500,
      tax: 1425,
      totalAmount: 10925,
    },
    timeline: {
      estimatedPickup: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    orderNumber: "ORD-1004",
    serviceType: "air_freight",
    status: "confirmed",
    priority: "high",
    origin: {
      address: "King Khalid International Airport",
      city: "Riyadh",
      country: "Saudi Arabia",
      coordinates: { lat: 24.9578, lng: 46.6989 },
    },
    destination: {
      address: "Heathrow Airport",
      city: "London",
      country: "UK",
      coordinates: { lat: 51.4700, lng: -0.4543 },
    },
    cargo: {
      description: "Medical Supplies",
      weight: 500,
      dimensions: { length: 100, width: 80, height: 60 },
      value: 15000,
      quantity: 5,
      packageType: "box",
    },
    pricing: {
      basePrice: 3500,
      additionalCharges: [
        { description: "Express Handling", amount: 500 },
        { description: "Temperature Control", amount: 300 },
      ],
      discount: 0,
      tax: 645,
      totalAmount: 4945,
    },
    timeline: {
      estimatedPickup: new Date(Date.now() + 6 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
];

// Helper function to make API calls
async function makeApiCall(endpoint, method, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// Seed data function
async function seedData() {
  console.log('🌱 Starting to seed data to LOCAL backend...\n');

  // Step 1: Register users
  console.log('📝 Registering users...');
  for (const user of users) {
    const result = await makeApiCall('/auth/register', 'POST', user);
    if (result.success) {
      console.log(`✅ Registered user: ${user.email}`);
    } else {
      console.log(`❌ Failed to register user: ${user.email} - ${result.error?.message || 'Unknown error'}`);
    }
  }

  // Step 2: Login as admin to get token
  console.log('\n🔐 Logging in as admin...');
  const adminLogin = await makeApiCall('/auth/login', 'POST', {
    email: 'admin@pro.com',
    password: 'Admin123'
  });

  if (!adminLogin.success) {
    console.log('❌ Failed to login as admin. Cannot proceed with seeding other data.');
    return;
  }

  const token = adminLogin.data.token;
  console.log('✅ Admin login successful');

  // Step 3: Add customers
  console.log('\n👥 Adding customers...');
  for (const customer of customers) {
    const result = await makeApiCall('/customers', 'POST', customer, token);
    if (result.success) {
      console.log(`✅ Added customer: ${customer.name}`);
    } else {
      console.log(`❌ Failed to add customer: ${customer.name} - ${result.error?.message || 'Unknown error'}`);
    }
  }

  // Step 4: Add suppliers
  console.log('\n🏢 Adding suppliers...');
  for (const supplier of suppliers) {
    const result = await makeApiCall('/suppliers', 'POST', supplier, token);
    if (result.success) {
      console.log(`✅ Added supplier: ${supplier.name}`);
    } else {
      console.log(`❌ Failed to add supplier: ${supplier.name} - ${result.error?.message || 'Unknown error'}`);
    }
  }

  // Step 5: Get customers to use their IDs for orders
  console.log('\n📋 Getting customers for order creation...');
  const customersResponse = await makeApiCall('/customers', 'GET', null, token);
  let customerIds = [];
  if (customersResponse.success) {
    customerIds = customersResponse.data.data.map(customer => customer._id);
    console.log(`✅ Found ${customerIds.length} customers`);
  } else {
    console.log('❌ Failed to get customers for order creation');
    return;
  }

  // Step 6: Add orders with proper customer IDs
  console.log('\n📋 Adding orders...');
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    // Assign customer ID from the list (cycling through available customers)
    const customerId = customerIds[i % customerIds.length];
    
    const orderData = {
      ...order,
      customer: customerId, // Add the customer ID
    };
    
    const result = await makeApiCall('/orders', 'POST', orderData, token);
    if (result.success) {
      console.log(`✅ Added order: ${order.orderNumber}`);
    } else {
      console.log(`❌ Failed to add order: ${order.orderNumber} - ${result.error?.message || 'Unknown error'}`);
    }
  }

  console.log('\n🎉 Data seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Customers: ${customers.length}`);
  console.log(`- Suppliers: ${suppliers.length}`);
  console.log(`- Orders: ${orders.length}`);
}

// Run the seeding
seedData().catch(console.error); 