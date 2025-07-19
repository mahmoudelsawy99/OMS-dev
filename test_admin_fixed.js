const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test users with different roles
const testUsers = {
  admin: {
    email: 'admin@pro.com',
    password: 'Admin123'
  },
  superadmin: {
    email: 'superadmin@pro.com', 
    password: 'Admin1234'
  }
};

let tokens = {};

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
async function loginUsers() {
  console.log('🔐 Logging in users...\n');
  
  for (const [role, credentials] of Object.entries(testUsers)) {
    const result = await makeRequest('POST', '/auth/login', credentials);
    if (result.success && result.data.token) {
      tokens[role] = result.data.token;
      console.log(`✅ Logged in as ${role}: ${result.data.user.name} (${result.data.user.role})`);
    } else {
      console.log(`❌ Failed to login as ${role}:`, result.error.message || result.error);
    }
  }
}

// Test admin access to all endpoints
async function testAdminAccess() {
  console.log('\n🚀 Testing Admin Access to All Endpoints...\n');

  const endpoints = [
    // Public endpoints
    { name: 'Health Check', method: 'GET', url: '/health', requiresAuth: false, adminOnly: false },
    
    // Admin-only endpoints
    { name: 'Get All Users', method: 'GET', url: '/users', requiresAuth: true, adminOnly: true },
    { name: 'Create User', method: 'POST', url: '/users', requiresAuth: true, adminOnly: true, data: {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'Test1234',
      role: 'employee',
      phone: '+966501234567'
    }},
    
    // Admin/Employee endpoints
    { name: 'Get All Customers', method: 'GET', url: '/customers', requiresAuth: true, adminOnly: false },
    { name: 'Create Customer', method: 'POST', url: '/customers', requiresAuth: true, adminOnly: false, data: {
      name: 'Test Customer',
      email: `testcustomer${Date.now()}@example.com`,
      phone: '+966501234567',
      customerType: 'business',
      status: 'active'
    }},
    { name: 'Get All Orders', method: 'GET', url: '/orders', requiresAuth: true, adminOnly: false },
    { name: 'Create Order', method: 'POST', url: '/orders', requiresAuth: true, adminOnly: false, data: {
      serviceType: 'land_transport',
      status: 'pending',
      priority: 'high',
      origin: { address: 'Riyadh', city: 'Riyadh', country: 'Saudi Arabia' },
      destination: { address: 'Jeddah', city: 'Jeddah', country: 'Saudi Arabia' },
      cargo: { description: 'Test Cargo', weight: 1000 }
    }},
    { name: 'Get All Vehicles', method: 'GET', url: '/vehicles', requiresAuth: true, adminOnly: false },
    { name: 'Create Vehicle', method: 'POST', url: '/vehicles', requiresAuth: true, adminOnly: false, data: {
      plateNumber: `TEST-${Date.now()}`,
      type: 'truck',
      model: { brand: 'Mercedes', model: 'Actros' },
      capacity: { weight: 25000 },
      driver: { name: 'Test Driver', phone: '+966501234567' },
      status: 'available'
    }},
    { name: 'Get All Reports', method: 'GET', url: '/reports', requiresAuth: true, adminOnly: false },
    
    // Read-only endpoints
    { name: 'Get All Shipments', method: 'GET', url: '/shipments', requiresAuth: true, adminOnly: false },
    { name: 'Get All Invoices', method: 'GET', url: '/invoices', requiresAuth: true, adminOnly: false },
    { name: 'Get All Notifications', method: 'GET', url: '/notifications', requiresAuth: true, adminOnly: false }
  ];

  const results = {
    admin: { success: 0, failed: 0, details: [] },
    superadmin: { success: 0, failed: 0, details: [] }
  };

  // Test with each admin user
  for (const [role, token] of Object.entries(tokens)) {
    console.log(`\n--- Testing ${role.toUpperCase()} Role ---`);
    
    for (const endpoint of endpoints) {
      const endpointToken = endpoint.requiresAuth ? token : null;
      const data = endpoint.data || null;
      
      const result = await makeRequest(endpoint.method, endpoint.url, data, endpointToken);
      
      const status = result.success ? '✅' : '❌';
      const message = result.success ? 
        `Success (${result.status})` : 
        `Failed (${result.status}): ${result.error.message || result.error}`;
      
      console.log(`${status} ${endpoint.name}: ${message}`);
      
      if (result.success) {
        results[role].success++;
      } else {
        results[role].failed++;
      }
      
      results[role].details.push({
        endpoint: endpoint.name,
        success: result.success,
        status: result.status,
        error: result.error,
        adminOnly: endpoint.adminOnly
      });
    }
  }

  return results;
}

// Test specific admin operations
async function testAdminOperations() {
  console.log('\n🔧 Testing Specific Admin Operations...\n');
  
  const adminToken = tokens.admin || tokens.superadmin;
  if (!adminToken) {
    console.log('❌ No admin token available for testing');
    return;
  }

  // Test user management (admin only)
  console.log('👥 Testing User Management (Admin Only)...');
  
  // Get all users
  let res = await makeRequest('GET', '/users', null, adminToken);
  console.log(`${res.success ? '✅' : '❌'} Get All Users:`, res.success ? `${res.data.data?.length || 0} users found` : res.error.message || res.error);
  
  // Create a test user
  const testUserData = {
    name: 'Test Admin User',
    email: `adminuser${Date.now()}@example.com`,
    password: 'Test1234',
    role: 'employee',
    phone: '+966501234567'
  };
  
  res = await makeRequest('POST', '/users', testUserData, adminToken);
  if (res.success) {
    console.log(`✅ Create User: ${res.data.data._id}`);
    
    // Update the user
    const updateData = { name: 'Updated Test User' };
    res = await makeRequest('PUT', `/users/${res.data.data._id}`, updateData, adminToken);
    console.log(`${res.success ? '✅' : '❌'} Update User:`, res.success ? 'User updated' : res.error.message || res.error);
  } else {
    console.log(`❌ Create User: ${res.error.message || res.error}`);
  }

  // Test customer management
  console.log('\n👤 Testing Customer Management...');
  
  // Get all customers
  res = await makeRequest('GET', '/customers', null, adminToken);
  console.log(`${res.success ? '✅' : '❌'} Get All Customers:`, res.success ? `${res.data.data?.length || 0} customers found` : res.error.message || res.error);
  
  // Create a test customer
  const testCustomerData = {
    name: 'Test Admin Customer',
    email: `admincustomer${Date.now()}@example.com`,
    phone: '+966501234567',
    customerType: 'business',
    status: 'active'
  };
  
  res = await makeRequest('POST', '/customers', testCustomerData, adminToken);
  if (res.success) {
    console.log(`✅ Create Customer: ${res.data.data._id}`);
  } else {
    console.log(`❌ Create Customer: ${res.error.message || res.error}`);
  }

  // Test order management
  console.log('\n📦 Testing Order Management...');
  
  // Get all orders
  res = await makeRequest('GET', '/orders', null, adminToken);
  console.log(`${res.success ? '✅' : '❌'} Get All Orders:`, res.success ? `${res.data.data?.length || 0} orders found` : res.error.message || res.error);
  
  // Create a test order
  const testOrderData = {
    serviceType: 'land_transport',
    status: 'pending',
    priority: 'high',
    origin: { address: 'Riyadh', city: 'Riyadh', country: 'Saudi Arabia' },
    destination: { address: 'Jeddah', city: 'Jeddah', country: 'Saudi Arabia' },
    cargo: { description: 'Admin Test Cargo', weight: 1000 }
  };
  
  res = await makeRequest('POST', '/orders', testOrderData, adminToken);
  if (res.success) {
    console.log(`✅ Create Order: ${res.data.data._id}`);
    
    // Update order status
    const statusData = { status: 'confirmed', notes: 'Order confirmed by admin' };
    res = await makeRequest('PUT', `/orders/${res.data.data._id}/status`, statusData, adminToken);
    console.log(`${res.success ? '✅' : '❌'} Update Order Status:`, res.success ? 'Status updated' : res.error.message || res.error);
  } else {
    console.log(`❌ Create Order: ${res.error.message || res.error}`);
  }
}

// Main test runner
async function runAdminFixedTest() {
  console.log('🔧 Admin Role Fixed Test - Remote Database\n');
  
  // First, login all users
  await loginUsers();
  
  if (Object.keys(tokens).length === 0) {
    console.log('❌ No users could login. Cannot proceed with testing.');
    return;
  }

  // Test admin access to all endpoints
  const results = await testAdminAccess();
  
  // Test specific admin operations
  await testAdminOperations();

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 ADMIN ROLE FIXED TEST SUMMARY');
  console.log('='.repeat(80));
  
  for (const [role, result] of Object.entries(results)) {
    console.log(`\n${role.toUpperCase()} Role:`);
    console.log(`  ✅ Successful: ${result.success}`);
    console.log(`  ❌ Failed: ${result.failed}`);
    console.log(`  📈 Success Rate: ${((result.success / (result.success + result.failed)) * 100).toFixed(1)}%`);
    
    if (result.failed > 0) {
      console.log('\n  ❌ Failed Endpoints:');
      result.details
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`    - ${r.endpoint}: ${r.status} - ${r.error.message || r.error}`);
        });
    }
  }

  console.log('\n🎯 Expected Results:');
  console.log('  - Admin role should have access to ALL endpoints');
  console.log('  - User management should work (admin only)');
  console.log('  - Customer and order management should work');
  console.log('  - If any endpoints fail, check the remote server configuration');
}

// Run the test
runAdminFixedTest(); 