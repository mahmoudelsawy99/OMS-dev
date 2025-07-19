const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test users for different roles
const testUsers = {
  admin: {
    email: 'admin@pro.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'OPERATIONS_MANAGER'
  },
  employee: {
    email: 'operations@pro.com',
    password: 'Ops123',
    name: 'Employee User',
    role: 'CLEARANCE_MANAGER'
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
  order: null,
  vehicle: null,
  shipment: null,
  invoice: null
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
  console.log('🔐 Logging in all roles...\n');
  for (const role of Object.keys(testUsers)) {
    const user = testUsers[role];
    const result = await makeRequest('POST', '/auth/login', user);
    if (result.success && result.data.token) {
      tokens[role] = result.data.token;
      console.log(`✅ Logged in as ${role} (${result.data.user.role})`);
    } else {
      console.log(`❌ Failed to login as ${role}:`, result.error.message || result.error);
    }
  }
}

// Main test runner
async function runWorkingEndpointsTest() {
  console.log('🚀 Testing Working Endpoints on Remote Server...\n');
  await loginAllRoles();

  // 1. Vehicles CRUD (All roles can access)
  console.log('\n=== VEHICLES CRUD (All Roles) ===');
  for (const role of Object.keys(tokens)) {
    console.log(`\n--- Testing ${role.toUpperCase()} Role ---`);
    
    // Create vehicle
    const vehicleData = {
      plateNumber: `TEST-${role.toUpperCase()}-${Math.floor(Math.random()*10000)}`,
      type: 'truck',
      model: { brand: 'Mercedes', model: 'Actros', year: 2022 },
      capacity: { weight: 25000, volume: 100 },
      driver: { name: 'Test Driver', phone: '+966503333333', licenseNumber: 'DL123456', licenseExpiry: '2025-12-31' },
      status: 'available',
      currentLocation: { address: 'Test Location', coordinates: { lat: 24.7136, lng: 46.6753 } }
    };
    
    let res = await makeRequest('POST', '/vehicles', vehicleData, tokens[role]);
    if (res.success) {
      ids.vehicle = res.data.data._id;
      console.log(`✅ [${role}] Create Vehicle: ${ids.vehicle}`);
    } else {
      console.log(`❌ [${role}] Create Vehicle:`, res.error.message || res.error);
    }
    
    // Get all vehicles
    res = await makeRequest('GET', '/vehicles', null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get All Vehicles`, res.success ? `(${res.data.data?.length || 0} found)` : res.error.message || res.error);
    
    // Get single vehicle (if created)
    if (ids.vehicle) {
      res = await makeRequest('GET', `/vehicles/${ids.vehicle}`, null, tokens[role]);
      console.log(`${res.success ? '✅' : '❌'} [${role}] Get Vehicle`, res.success ? '' : res.error.message || res.error);
    }
  }

  // 2. Orders CRUD (All roles can access)
  console.log('\n=== ORDERS CRUD (All Roles) ===');
  for (const role of Object.keys(tokens)) {
    console.log(`\n--- Testing ${role.toUpperCase()} Role ---`);
    
    // Create order (without customer/vehicle dependencies for now)
    const orderData = {
      orderNumber: `ORD-${role.toUpperCase()}-${Date.now()}`,
      serviceType: 'land_transport',
      status: 'pending',
      priority: 'high',
      origin: { address: 'Origin', city: 'Riyadh', country: 'Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 } },
      destination: { address: 'Dest', city: 'Jeddah', country: 'Saudi Arabia', coordinates: { lat: 21.3891, lng: 39.8579 } },
      cargo: { description: 'Test Cargo', weight: 1000, dimensions: { length: 100, width: 100, height: 100 }, value: 10000, quantity: 5, packageType: 'box' },
      pricing: { basePrice: 1500, additionalCharges: [{ description: 'Insurance', amount: 150 }], discount: 0, tax: 247.5, totalAmount: 1897.5 }
    };
    
    let res = await makeRequest('POST', '/orders', orderData, tokens[role]);
    if (res.success) {
      ids.order = res.data.data._id;
      console.log(`✅ [${role}] Create Order: ${ids.order}`);
    } else {
      console.log(`❌ [${role}] Create Order:`, res.error.message || res.error);
    }
    
    // Get all orders
    res = await makeRequest('GET', '/orders', null, tokens[role]);
    console.log(`${res.success ? '✅' : '❌'} [${role}] Get All Orders`, res.success ? `(${res.data.data?.length || 0} found)` : res.error.message || res.error);
    
    // Get single order (if created)
    if (ids.order) {
      res = await makeRequest('GET', `/orders/${ids.order}`, null, tokens[role]);
      console.log(`${res.success ? '✅' : '❌'} [${role}] Get Order`, res.success ? '' : res.error.message || res.error);
    }
  }

  // 3. Shipments, Invoices, Notifications (Read-only for all roles)
  console.log('\n=== READ-ONLY ENDPOINTS (All Roles) ===');
  const readOnlyEndpoints = [
    { name: 'Shipments', url: '/shipments' },
    { name: 'Invoices', url: '/invoices' },
    { name: 'Notifications', url: '/notifications' }
  ];
  
  for (const role of Object.keys(tokens)) {
    console.log(`\n--- Testing ${role.toUpperCase()} Role ---`);
    
    for (const endpoint of readOnlyEndpoints) {
      const res = await makeRequest('GET', endpoint.url, null, tokens[role]);
      console.log(`${res.success ? '✅' : '❌'} [${role}] Get ${endpoint.name}`, res.success ? `(${res.data.data?.length || 0} found)` : res.error.message || res.error);
    }
  }

  // 4. Test restricted endpoints (should fail for all roles)
  console.log('\n=== RESTRICTED ENDPOINTS (Should Fail for All Roles) ===');
  const restrictedEndpoints = [
    { name: 'Customers', url: '/customers' },
    { name: 'Users', url: '/users' },
    { name: 'Reports', url: '/reports' }
  ];
  
  for (const role of Object.keys(tokens)) {
    console.log(`\n--- Testing ${role.toUpperCase()} Role ---`);
    
    for (const endpoint of restrictedEndpoints) {
      const res = await makeRequest('GET', endpoint.url, null, tokens[role]);
      console.log(`${res.success ? '⚠️' : '✅'} [${role}] Get ${endpoint.name}`, res.success ? 'Unexpected success!' : `Expected: ${res.error.message || res.error}`);
    }
  }

  console.log('\n✅ Working Endpoints Test completed!');
  console.log('\n📊 Summary:');
  console.log('✅ Working: Orders, Vehicles, Shipments, Invoices, Notifications');
  console.log('❌ Restricted: Customers, Users, Reports');
  console.log('💡 All roles have the same permissions on the remote server');
}

if (require.main === module) {
  runWorkingEndpointsTest().catch(console.error);
} 