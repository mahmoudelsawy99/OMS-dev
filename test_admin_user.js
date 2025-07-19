const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Admin user credentials
const adminUser = {
  email: 'superadmin@pro.com',
  password: 'Admin1234'
};

let adminToken = null;

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

// Login as admin
async function loginAsAdmin() {
  console.log('🔐 Logging in as Super Admin...');
  const result = await makeRequest('POST', '/auth/login', adminUser);
  
  if (result.success && result.data.token) {
    adminToken = result.data.token;
    console.log('✅ Login successful!');
    console.log('👤 User:', result.data.user.name);
    console.log('🎭 Role:', result.data.user.role);
    return true;
  } else {
    console.log('❌ Login failed:', result.error.message || result.error);
    return false;
  }
}

// Test all endpoints with admin role
async function testAdminAccess() {
  console.log('\n🚀 Testing Admin Access to All Endpoints...\n');

  const endpoints = [
    { name: 'Health Check', method: 'GET', url: '/health', requiresAuth: false },
    { name: 'Get Current User', method: 'GET', url: '/auth/me', requiresAuth: true },
    { name: 'Get All Users', method: 'GET', url: '/users', requiresAuth: true },
    { name: 'Create User', method: 'POST', url: '/users', requiresAuth: true, data: {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'Test1234',
      role: 'employee',
      phone: '+966501234567'
    }},
    { name: 'Get All Customers', method: 'GET', url: '/customers', requiresAuth: true },
    { name: 'Create Customer', method: 'POST', url: '/customers', requiresAuth: true, data: {
      name: 'Test Customer',
      email: `testcustomer${Date.now()}@example.com`,
      phone: '+966501234567',
      customerType: 'business',
      status: 'active'
    }},
    { name: 'Get All Orders', method: 'GET', url: '/orders', requiresAuth: true },
    { name: 'Create Order', method: 'POST', url: '/orders', requiresAuth: true, data: {
      serviceType: 'land_transport',
      status: 'pending',
      priority: 'high',
      origin: { address: 'Riyadh', city: 'Riyadh', country: 'Saudi Arabia' },
      destination: { address: 'Jeddah', city: 'Jeddah', country: 'Saudi Arabia' },
      cargo: { description: 'Test Cargo', weight: 1000 }
    }},
    { name: 'Get All Vehicles', method: 'GET', url: '/vehicles', requiresAuth: true },
    { name: 'Create Vehicle', method: 'POST', url: '/vehicles', requiresAuth: true, data: {
      plateNumber: `TEST-${Date.now()}`,
      type: 'truck',
      model: { brand: 'Mercedes', model: 'Actros' },
      capacity: { weight: 25000 },
      driver: { name: 'Test Driver', phone: '+966501234567' },
      status: 'available'
    }},
    { name: 'Get All Shipments', method: 'GET', url: '/shipments', requiresAuth: true },
    { name: 'Get All Invoices', method: 'GET', url: '/invoices', requiresAuth: true },
    { name: 'Get All Reports', method: 'GET', url: '/reports', requiresAuth: true },
    { name: 'Get All Notifications', method: 'GET', url: '/notifications', requiresAuth: true }
  ];

  const results = {
    success: 0,
    failed: 0,
    details: []
  };

  for (const endpoint of endpoints) {
    const token = endpoint.requiresAuth ? adminToken : null;
    const data = endpoint.data || null;
    
    const result = await makeRequest(endpoint.method, endpoint.url, data, token);
    
    const status = result.success ? '✅' : '❌';
    const message = result.success ? 
      `Success (${result.status})` : 
      `Failed (${result.status}): ${result.error.message || result.error}`;
    
    console.log(`${status} ${endpoint.name}: ${message}`);
    
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    
    results.details.push({
      endpoint: endpoint.name,
      success: result.success,
      status: result.status,
      error: result.error
    });
  }

  return results;
}

// Main test runner
async function runAdminTest() {
  console.log('🔧 Admin User Access Test\n');
  
  // First, login
  const loginSuccess = await loginAsAdmin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without admin login');
    return;
  }

  // Test all endpoints
  const results = await testAdminAccess();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 ADMIN ACCESS TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.success / (results.success + results.failed)) * 100).toFixed(1)}%`);

  // Show failed endpoints
  if (results.failed > 0) {
    console.log('\n❌ Failed Endpoints:');
    results.details
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.endpoint}: ${r.status} - ${r.error.message || r.error}`);
      });
  }

  // Show successful endpoints
  if (results.success > 0) {
    console.log('\n✅ Working Endpoints:');
    results.details
      .filter(r => r.success)
      .forEach(r => {
        console.log(`   - ${r.endpoint}`);
      });
  }

  console.log('\n🎯 Expected Results:');
  console.log('   - Admin role should have access to ALL endpoints');
  console.log('   - If any endpoints fail, the remote server may have different permissions');
}

// Run the test
runAdminTest(); 