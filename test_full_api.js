const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test users for each role
const testUsers = {
  admin: {
    email: 'admin@pro.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'GENERAL_MANAGER'
  },
  employee: {
    email: 'operations@pro.com',
    password: 'Ops123',
    name: 'Employee User',
    role: 'OPERATIONS_MANAGER'
  },
  client: {
    email: 'manager@alpha.com',
    password: 'Alpha123',
    name: 'Client User',
    role: 'CLIENT_MANAGER'
  }
};

// Store tokens and created IDs
let tokens = {};
let ids = {
  customer: null,
  vehicle: null,
  order: null,
  invoice: null,
  shipment: null,
  user: null
};

// Helper to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
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

// Login all roles
async function loginAllRoles() {
  for (const role of Object.keys(testUsers)) {
    const user = testUsers[role];
    const result = await makeRequest('POST', '/auth/login', user);
    if (result.success && result.data.token) {
      tokens[role] = result.data.token;
      console.log(`✅ Logged in as ${role}`);
    } else {
      console.log(`❌ Failed to login as ${role}:`, result.error.message || result.error);
    }
  }
}

// Main test runner
async function runFullApiTest() {
  console.log('🚀 Starting Full API CRUD & Permission Test...\n');
  await loginAllRoles();

  // 1. Customers CRUD (admin/employee)
  console.log('\n=== CUSTOMERS CRUD ===');
  // Create
  let res = await makeRequest('POST', '/customers', {
    name: 'Test Customer',
    email: `customer${Date.now()}@example.com`,
    phone: '+966501111111',
    company: { name: 'Test Co', taxId: '123456789', industry: 'Tech' },
    address: { street: '123 Test St', city: 'Riyadh', country: 'Saudi Arabia' },
    customerType: 'business', creditLimit: 50000, status: 'active'
  }, tokens.admin);
  if (res.success) {
    ids.customer = res.data.data._id;
    console.log('✅ [admin] Create Customer:', ids.customer);
  } else {
    console.log('❌ [admin] Create Customer:', res.error.message || res.error);
  }
  // Read all
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', '/customers', null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get All Customers`, res.success ? '' : res.error.message || res.error);
  }
  // Read one
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', `/customers/${ids.customer}`, null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get Customer`, res.success ? '' : res.error.message || res.error);
  }
  // Update
  res = await makeRequest('PUT', `/customers/${ids.customer}`, { name: 'Updated Customer' }, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Update Customer`, res.success ? '' : res.error.message || res.error);
  // Delete
  res = await makeRequest('DELETE', `/customers/${ids.customer}`, null, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Delete Customer`, res.success ? '' : res.error.message || res.error);

  // 2. Vehicles CRUD (admin/employee)
  console.log('\n=== VEHICLES CRUD ===');
  res = await makeRequest('POST', '/vehicles', {
    plateNumber: `TEST-${Math.floor(Math.random()*10000)}`,
    type: 'truck',
    model: { brand: 'Mercedes', model: 'Actros', year: 2022 },
    capacity: { weight: 25000, volume: 100 },
    driver: { name: 'Test Driver', phone: '+966503333333', licenseNumber: 'DL123456', licenseExpiry: '2025-12-31' },
    status: 'available',
    currentLocation: { address: 'Test Location', coordinates: { lat: 24.7136, lng: 46.6753 } }
  }, tokens.admin);
  if (res.success) {
    ids.vehicle = res.data.data._id;
    console.log('✅ [admin] Create Vehicle:', ids.vehicle);
  } else {
    console.log('❌ [admin] Create Vehicle:', res.error.message || res.error);
  }
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', '/vehicles', null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get All Vehicles`, res.success ? '' : res.error.message || res.error);
  }
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', `/vehicles/${ids.vehicle}`, null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get Vehicle`, res.success ? '' : res.error.message || res.error);
  }
  res = await makeRequest('PUT', `/vehicles/${ids.vehicle}`, { status: 'unavailable' }, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Update Vehicle`, res.success ? '' : res.error.message || res.error);
  res = await makeRequest('DELETE', `/vehicles/${ids.vehicle}`, null, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Delete Vehicle`, res.success ? '' : res.error.message || res.error);

  // 3. Orders CRUD (admin/employee, needs customer & vehicle)
  console.log('\n=== ORDERS CRUD ===');
  // Re-create customer and vehicle for order dependency
  let custRes = await makeRequest('POST', '/customers', {
    name: 'Order Customer',
    email: `ordercustomer${Date.now()}@example.com`,
    phone: '+966501111112',
    company: { name: 'Order Co', taxId: '987654321', industry: 'Logistics' },
    address: { street: '456 Order St', city: 'Jeddah', country: 'Saudi Arabia' },
    customerType: 'business', creditLimit: 100000, status: 'active'
  }, tokens.admin);
  let vehRes = await makeRequest('POST', '/vehicles', {
    plateNumber: `ORD-${Math.floor(Math.random()*10000)}`,
    type: 'truck',
    model: { brand: 'Volvo', model: 'FH', year: 2023 },
    capacity: { weight: 30000, volume: 120 },
    driver: { name: 'Order Driver', phone: '+966503333334', licenseNumber: 'DL654321', licenseExpiry: '2026-12-31' },
    status: 'available',
    currentLocation: { address: 'Order Location', coordinates: { lat: 21.3891, lng: 39.8579 } }
  }, tokens.admin);
  if (custRes.success && vehRes.success) {
    ids.customer = custRes.data.data._id;
    ids.vehicle = vehRes.data.data._id;
    res = await makeRequest('POST', '/orders', {
      orderNumber: `ORD-${Date.now()}`,
      serviceType: 'land_transport',
      status: 'pending',
      priority: 'high',
      origin: { address: 'Origin', city: 'Riyadh', country: 'Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 } },
      destination: { address: 'Dest', city: 'Jeddah', country: 'Saudi Arabia', coordinates: { lat: 21.3891, lng: 39.8579 } },
      cargo: { description: 'Goods', weight: 2000, dimensions: { length: 100, width: 100, height: 100 }, value: 20000, quantity: 10, packageType: 'box' },
      pricing: { basePrice: 2000, additionalCharges: [{ description: 'Insurance', amount: 200 }], discount: 0, tax: 320, totalAmount: 2520 },
      customer: ids.customer,
      vehicle: ids.vehicle
    }, tokens.admin);
    if (res.success) {
      ids.order = res.data.data._id;
      console.log('✅ [admin] Create Order:', ids.order);
    } else {
      console.log('❌ [admin] Create Order:', res.error.message || res.error);
    }
  } else {
    console.log('❌ [admin] Create Order dependencies failed');
  }
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', '/orders', null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get All Orders`, res.success ? '' : res.error.message || res.error);
  }
  for (const role of Object.keys(tokens)) {
    res = await makeRequest('GET', `/orders/${ids.order}`, null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get Order`, res.success ? '' : res.error.message || res.error);
  }
  res = await makeRequest('PUT', `/orders/${ids.order}/status`, { status: 'confirmed', notes: 'Confirmed by test' }, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Update Order Status`, res.success ? '' : res.error.message || res.error);
  res = await makeRequest('DELETE', `/orders/${ids.order}`, null, tokens.admin);
  console.log(`${res.success ? '✅' : '❌'} [admin] Delete Order`, res.success ? '' : res.error.message || res.error);

  // 4. Invoices, Shipments, Reports, Notifications, Users, etc. can be added similarly...
  // For brevity, you can expand this script to cover all endpoints in postman_endpoints.json

  console.log('\n✅ Full API CRUD & Permission Test completed!');
}

if (require.main === module) {
  runFullApiTest().catch(console.error);
} 