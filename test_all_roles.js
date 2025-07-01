const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001/api';

// Test data for different roles
const testUsers = {
  admin: {
    email: 'admin@prospeed.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  employee: {
    email: 'employee@prospeed.com',
    password: 'employee123',
    name: 'Employee User',
    role: 'employee'
  },
  client: {
    email: 'client@example.com',
    password: 'client123',
    name: 'Client User',
    role: 'client'
  }
};

// Test data
const testData = {
  customer: {
    name: 'Test Customer',
    email: `customer${Date.now()}@example.com`,
    phone: '+966501111111',
    company: {
      name: 'Test Company',
      taxId: '123456789',
      industry: 'Technology'
    },
    address: {
      street: '123 Test Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    },
    customerType: 'business',
    creditLimit: 50000,
    status: 'active'
  },
  vehicle: {
    plateNumber: `TEST-${Math.floor(Math.random()*10000)}`,
    type: 'truck',
    model: {
      brand: 'Mercedes',
      model: 'Actros',
      year: 2022
    },
    capacity: {
      weight: 25000,
      volume: 100
    },
    driver: {
      name: 'Test Driver',
      phone: '+966503333333',
      licenseNumber: 'DL123456',
      licenseExpiry: '2025-12-31'
    },
    status: 'available',
    currentLocation: {
      address: 'Test Location',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    }
  },
  order: {
    orderNumber: `ORD-${Date.now()}`,
    serviceType: 'land_transport',
    status: 'pending',
    priority: 'medium',
    origin: {
      address: 'Test Origin',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    },
    destination: {
      address: 'Test Destination',
      city: 'Jeddah',
      country: 'Saudi Arabia',
      coordinates: { lat: 21.3891, lng: 39.8579 }
    },
    cargo: {
      description: 'Test Cargo',
      weight: 1000,
      dimensions: { length: 100, width: 100, height: 100 },
      value: 10000,
      quantity: 5,
      packageType: 'box'
    },
    pricing: {
      basePrice: 1500,
      additionalCharges: [{ description: 'Insurance', amount: 150 }],
      discount: 0,
      tax: 247.5,
      totalAmount: 1897.5
    }
  }
};

// Global variables to store IDs and tokens
let tokens = {};
let customerId = '';
let vehicleId = '';
let orderId = '';

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

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

// Test functions for each role
async function testRoleAccess(role, token) {
  console.log(`\n🔐 Testing ${role.toUpperCase()} Role Access:`);
  console.log('='.repeat(50));

  const results = {
    role,
    token: token ? '✅' : '❌',
    endpoints: {}
  };

  // Test Health Check (Public)
  console.log('🏥 Health Check (Public)...');
  const healthResult = await makeRequest('GET', '/health');
  results.endpoints.health = healthResult.success ? '✅' : '❌';
  console.log(`Status: ${healthResult.status} ${healthResult.success ? '✅' : '❌'}`);

  // Test Get Current User
  console.log('👤 Get Current User...');
  const userResult = await makeRequest('GET', '/auth/me', null, token);
  results.endpoints.getCurrentUser = userResult.success ? '✅' : '❌';
  console.log(`Status: ${userResult.status} ${userResult.success ? '✅' : '❌'}`);

  // Test Get All Users (Admin only)
  console.log('👥 Get All Users (Admin only)...');
  const usersResult = await makeRequest('GET', '/users', null, token);
  results.endpoints.getUsers = usersResult.success ? '✅' : '❌';
  console.log(`Status: ${usersResult.status} ${usersResult.success ? '✅' : '❌'}`);

  // Test Create User (Admin only)
  console.log('➕ Create User (Admin only)...');
  const createUserData = {
    name: 'Test New User',
    email: `newuser${Date.now()}@example.com`,
    password: 'test1234',
    role: 'employee',
    phone: '+966501234567'
  };
  const createUserResult = await makeRequest('POST', '/users', createUserData, token);
  results.endpoints.createUser = createUserResult.success ? '✅' : '❌';
  console.log(`Status: ${createUserResult.status} ${createUserResult.success ? '✅' : '❌'}`);

  // Test Get All Customers (Admin/Employee only)
  console.log('📋 Get All Customers (Admin/Employee only)...');
  const customersResult = await makeRequest('GET', '/customers', null, token);
  results.endpoints.getCustomers = customersResult.success ? '✅' : '❌';
  console.log(`Status: ${customersResult.status} ${customersResult.success ? '✅' : '❌'}`);

  // Test Create Customer (Admin/Employee only)
  console.log('➕ Create Customer (Admin/Employee only)...');
  const createCustomerData = { ...testData.customer, email: `customer${Date.now()}@example.com` };
  const createCustomerResult = await makeRequest('POST', '/customers', createCustomerData, token);
  results.endpoints.createCustomer = createCustomerResult.success ? '✅' : '❌';
  if (createCustomerResult.success && !customerId) {
    customerId = createCustomerResult.data.data._id;
  }
  console.log(`Status: ${createCustomerResult.status} ${createCustomerResult.success ? '✅' : '❌'}`);

  // Test Get All Orders
  console.log('📦 Get All Orders...');
  const ordersResult = await makeRequest('GET', '/orders', null, token);
  results.endpoints.getOrders = ordersResult.success ? '✅' : '❌';
  console.log(`Status: ${ordersResult.status} ${ordersResult.success ? '✅' : '❌'}`);

  // Test Create Order (Admin/Employee only)
  console.log('➕ Create Order (Admin/Employee only)...');
  const createOrderData = {
    ...testData.order,
    orderNumber: `ORD-${Date.now()}`,
    customer: customerId
  };
  if (vehicleId) createOrderData.vehicle = vehicleId;
  const createOrderResult = await makeRequest('POST', '/orders', createOrderData, token);
  results.endpoints.createOrder = createOrderResult.success ? '✅' : '❌';
  if (createOrderResult.success && !orderId) {
    orderId = createOrderResult.data.data._id;
  }
  console.log(`Status: ${createOrderResult.status} ${createOrderResult.success ? '✅' : '❌'}`);

  // Test Update Order Status (Admin/Employee only)
  if (orderId) {
    console.log('🔄 Update Order Status (Admin/Employee only)...');
    const updateStatusData = {
      status: 'confirmed',
      notes: 'Order confirmed by test'
    };
    const updateStatusResult = await makeRequest('PUT', `/orders/${orderId}/status`, updateStatusData, token);
    results.endpoints.updateOrderStatus = updateStatusResult.success ? '✅' : '❌';
    console.log(`Status: ${updateStatusResult.status} ${updateStatusResult.success ? '✅' : '❌'}`);
  } else {
    console.log('🔄 Update Order Status (Admin/Employee only)... SKIPPED (no order)');
    results.endpoints.updateOrderStatus = '⏭️';
  }

  // Test Get All Vehicles
  console.log('🚛 Get All Vehicles...');
  const vehiclesResult = await makeRequest('GET', '/vehicles', null, token);
  results.endpoints.getVehicles = vehiclesResult.success ? '✅' : '❌';
  console.log(`Status: ${vehiclesResult.status} ${vehiclesResult.success ? '✅' : '❌'}`);

  // Test Create Vehicle (Admin/Employee only)
  console.log('➕ Create Vehicle (Admin/Employee only)...');
  const createVehicleData = { ...testData.vehicle, plateNumber: `TEST-${Math.floor(Math.random()*10000)}` };
  const createVehicleResult = await makeRequest('POST', '/vehicles', createVehicleData, token);
  results.endpoints.createVehicle = createVehicleResult.success ? '✅' : '❌';
  if (createVehicleResult.success && !vehicleId) {
    vehicleId = createVehicleResult.data.data._id;
  }
  console.log(`Status: ${createVehicleResult.status} ${createVehicleResult.success ? '✅' : '❌'}`);

  // Test Get All Shipments
  console.log('📦 Get All Shipments...');
  const shipmentsResult = await makeRequest('GET', '/shipments', null, token);
  results.endpoints.getShipments = shipmentsResult.success ? '✅' : '❌';
  console.log(`Status: ${shipmentsResult.status} ${shipmentsResult.success ? '✅' : '❌'}`);

  // Test Get All Invoices
  console.log('🧾 Get All Invoices...');
  const invoicesResult = await makeRequest('GET', '/invoices', null, token);
  results.endpoints.getInvoices = invoicesResult.success ? '✅' : '❌';
  console.log(`Status: ${invoicesResult.status} ${invoicesResult.success ? '✅' : '❌'}`);

  // Test Get Reports (Admin/Employee only)
  console.log('📊 Get Reports (Admin/Employee only)...');
  const reportsResult = await makeRequest('GET', '/reports', null, token);
  results.endpoints.getReports = reportsResult.success ? '✅' : '❌';
  console.log(`Status: ${reportsResult.status} ${reportsResult.success ? '✅' : '❌'}`);

  // Test Get Notifications
  console.log('🔔 Get Notifications...');
  const notificationsResult = await makeRequest('GET', '/notifications', null, token);
  results.endpoints.getNotifications = notificationsResult.success ? '✅' : '❌';
  console.log(`Status: ${notificationsResult.status} ${notificationsResult.success ? '✅' : '❌'}`);

  return results;
}

// Login function for each role
async function loginUser(role) {
  console.log(`\n🔐 Logging in as ${role}...`);
  const user = testUsers[role];
  const result = await makeRequest('POST', '/auth/login', user);
  
  if (result.success) {
    tokens[role] = result.data.token;
    console.log(`✅ ${role} logged in successfully`);
    return result.data.token;
  } else {
    console.log(`❌ Failed to login as ${role}:`, result.error);
    return null;
  }
}

// Main test runner
async function runAllRoleTests() {
  console.log('🚀 Starting Comprehensive Role-Based API Tests...\n');

  // Login all users first
  for (const role of Object.keys(testUsers)) {
    await loginUser(role);
  }

  // Test each role
  const allResults = {};
  
  for (const role of Object.keys(testUsers)) {
    const token = tokens[role];
    allResults[role] = await testRoleAccess(role, token);
  }

  // Print comprehensive results
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE ROLE-BASED TEST RESULTS');
  console.log('='.repeat(80));

  const endpoints = [
    'health', 'getCurrentUser', 'getUsers', 'createUser', 'getCustomers', 
    'createCustomer', 'getOrders', 'createOrder', 'updateOrderStatus', 
    'getVehicles', 'createVehicle', 'getShipments', 'getInvoices', 
    'getReports', 'getNotifications'
  ];

  // Header
  console.log('\nRole'.padEnd(15) + endpoints.map(e => e.padEnd(12)).join(''));
  console.log('-'.repeat(15 + endpoints.length * 12));

  // Results for each role
  for (const role of Object.keys(allResults)) {
    const result = allResults[role];
    let line = role.padEnd(15);
    
    for (const endpoint of endpoints) {
      const status = result.endpoints[endpoint] || '❌';
      line += status.padEnd(12);
    }
    
    console.log(line);
  }

  // Expected permissions summary
  console.log('\n' + '='.repeat(80));
  console.log('📋 EXPECTED PERMISSIONS SUMMARY');
  console.log('='.repeat(80));
  
  console.log('\n🔴 ADMIN Role:');
  console.log('   ✅ Full access to all endpoints');
  
  console.log('\n🟡 EMPLOYEE Role:');
  console.log('   ✅ Most endpoints (except user management)');
  console.log('   ❌ Cannot: Create/Update/Delete Users');
  
  console.log('\n🟢 CLIENT Role:');
  console.log('   ✅ Read access to: Orders (own), Vehicles, Shipments, Invoices, Notifications');
  console.log('   ❌ Cannot: Create/Update/Delete Customers, Orders, Vehicles');
  console.log('   ❌ Cannot: Access Reports, User Management');

  console.log('\n' + '='.repeat(80));
  console.log('✅ Role-based testing completed!');
  console.log('='.repeat(80));
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllRoleTests().catch(console.error);
}

module.exports = {
  runAllRoleTests,
  testRoleAccess,
  loginUser,
  makeRequest
}; 