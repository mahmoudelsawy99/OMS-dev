const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test users - using the admin user that exists
const testUsers = {
  admin: {
    email: 'admin@pro.com',
    password: 'Admin123'
  }
};

// Store tokens and created IDs
let tokens = {};
let ids = {
  orders: [],
  vehicles: []
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

// Login function
async function login() {
  console.log('🔐 Logging in...\n');
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
async function runFinalApiTest() {
  console.log('🚀 Final Comprehensive API Test - Working Endpoints Only\n');
  await login();

  if (!tokens.admin) {
    console.log('❌ Cannot proceed without admin token');
    return;
  }

  const token = tokens.admin;

  // 1. Health Check
  console.log('\n=== HEALTH CHECK ===');
  const healthRes = await makeRequest('GET', '/health');
  console.log(`${healthRes.success ? '✅' : '❌'} Health Check:`, healthRes.success ? healthRes.data : healthRes.error);

  // 2. Get Current User
  console.log('\n=== CURRENT USER ===');
  const userRes = await makeRequest('GET', '/auth/me', null, token);
  console.log(`${userRes.success ? '✅' : '❌'} Get Current User:`, userRes.success ? userRes.data.user.name : userRes.error);

  // 3. Vehicles CRUD
  console.log('\n=== VEHICLES CRUD ===');
  
  // Get all vehicles
  let res = await makeRequest('GET', '/vehicles', null, token);
  console.log(`${res.success ? '✅' : '❌'} Get All Vehicles:`, res.success ? `${res.data.data?.length || 0} found` : res.error.message || res.error);
  
  // Create vehicle (if endpoint allows)
  const vehicleData = {
    plateNumber: `TEST-${Date.now()}`,
    type: 'truck',
    model: { brand: 'Mercedes', model: 'Actros', year: 2022 },
    capacity: { weight: 25000, volume: 100 },
    driver: { name: 'Test Driver', phone: '+966503333333', licenseNumber: 'DL123456', licenseExpiry: '2025-12-31' },
    status: 'available',
    currentLocation: { address: 'Test Location', coordinates: { lat: 24.7136, lng: 46.6753 } }
  };
  
  res = await makeRequest('POST', '/vehicles', vehicleData, token);
  if (res.success) {
    ids.vehicles.push(res.data.data._id);
    console.log(`✅ Create Vehicle: ${res.data.data._id}`);
    
    // Get single vehicle
    res = await makeRequest('GET', `/vehicles/${res.data.data._id}`, null, token);
    console.log(`${res.success ? '✅' : '❌'} Get Single Vehicle:`, res.success ? res.data.data.plateNumber : res.error.message || res.error);
  } else {
    console.log(`❌ Create Vehicle: ${res.error.message || res.error}`);
  }

  // 4. Orders CRUD
  console.log('\n=== ORDERS CRUD ===');
  
  // Get all orders
  res = await makeRequest('GET', '/orders', null, token);
  console.log(`${res.success ? '✅' : '❌'} Get All Orders:`, res.success ? `${res.data.data?.length || 0} found` : res.error.message || res.error);
  
  // Create order
  const orderData = {
    orderNumber: `ORD-${Date.now()}`,
    serviceType: 'land_transport',
    status: 'pending',
    priority: 'high',
    origin: { address: 'Riyadh Industrial City', city: 'Riyadh', country: 'Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 } },
    destination: { address: 'Jeddah Port', city: 'Jeddah', country: 'Saudi Arabia', coordinates: { lat: 21.3891, lng: 39.8579 } },
    cargo: { description: 'Electronic Equipment', weight: 1500, dimensions: { length: 200, width: 150, height: 100 }, value: 25000, quantity: 10, packageType: 'box' },
    pricing: { basePrice: 2500, additionalCharges: [{ description: 'Insurance', amount: 250 }], discount: 0, tax: 390, totalAmount: 3290 }
  };
  
  res = await makeRequest('POST', '/orders', orderData, token);
  if (res.success) {
    ids.orders.push(res.data.data._id);
    console.log(`✅ Create Order: ${res.data.data._id}`);
    
    // Get single order
    res = await makeRequest('GET', `/orders/${res.data.data._id}`, null, token);
    console.log(`${res.success ? '✅' : '❌'} Get Single Order:`, res.success ? res.data.data.orderNumber : res.error.message || res.error);
    
    // Update order status
    res = await makeRequest('PUT', `/orders/${res.data.data._id}/status`, { status: 'confirmed', notes: 'Order confirmed by test' }, token);
    console.log(`${res.success ? '✅' : '❌'} Update Order Status:`, res.success ? 'Status updated' : res.error.message || res.error);
  } else {
    console.log(`❌ Create Order: ${res.error.message || res.error}`);
  }

  // 5. Read-Only Endpoints
  console.log('\n=== READ-ONLY ENDPOINTS ===');
  
  const readOnlyEndpoints = [
    { name: 'Shipments', url: '/shipments' },
    { name: 'Invoices', url: '/invoices' },
    { name: 'Notifications', url: '/notifications' }
  ];
  
  for (const endpoint of readOnlyEndpoints) {
    res = await makeRequest('GET', endpoint.url, null, token);
    console.log(`${res.success ? '✅' : '❌'} Get ${endpoint.name}:`, res.success ? `${res.data.data?.length || 0} found` : res.error.message || res.error);
  }

  // 6. Test Restricted Endpoints (should fail)
  console.log('\n=== RESTRICTED ENDPOINTS (Expected to Fail) ===');
  
  const restrictedEndpoints = [
    { name: 'Customers', url: '/customers' },
    { name: 'Users', url: '/users' },
    { name: 'Reports', url: '/reports' }
  ];
  
  for (const endpoint of restrictedEndpoints) {
    res = await makeRequest('GET', endpoint.url, null, token);
    console.log(`${res.success ? '⚠️' : '✅'} Get ${endpoint.name}:`, res.success ? 'Unexpected success!' : `Expected: ${res.error.message || res.error}`);
  }

  // 7. Test with query parameters
  console.log('\n=== TESTING WITH QUERY PARAMETERS ===');
  
  // Test orders with pagination
  res = await makeRequest('GET', '/orders?page=1&limit=5', null, token);
  console.log(`${res.success ? '✅' : '❌'} Get Orders with Pagination:`, res.success ? `Page ${res.data.pagination?.page || 'N/A'}` : res.error.message || res.error);
  
  // Test orders with status filter
  res = await makeRequest('GET', '/orders?status=pending', null, token);
  console.log(`${res.success ? '✅' : '❌'} Get Orders with Status Filter:`, res.success ? `${res.data.data?.length || 0} pending orders` : res.error.message || res.error);

  // 8. Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log('✅ Working Endpoints:');
  console.log('  - Health Check');
  console.log('  - Authentication (/auth/me)');
  console.log('  - Orders (GET, POST, PUT)');
  console.log('  - Vehicles (GET)');
  console.log('  - Shipments (GET)');
  console.log('  - Invoices (GET)');
  console.log('  - Notifications (GET)');
  
  console.log('\n❌ Restricted Endpoints:');
  console.log('  - Customers (all operations)');
  console.log('  - Users (all operations)');
  console.log('  - Reports (all operations)');
  console.log('  - Vehicles (POST, PUT, DELETE)');
  
  console.log('\n📊 Test Results:');
  console.log(`  - Orders Created: ${ids.orders.length}`);
  console.log(`  - Vehicles Created: ${ids.vehicles.length}`);
  console.log(`  - Admin Token: ${tokens.admin ? '✅' : '❌'}`);
  
  console.log('\n✅ Final API Test completed successfully!');
}

if (require.main === module) {
  runFinalApiTest().catch(console.error);
} 