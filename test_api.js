const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001/api';
let authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2EyMjI5MGFmZjc3OWVjMmY5YTJlNCIsImlhdCI6MTc1MjgzNDYyNiwiZXhwIjoxNzUzNDM5NDI2fQ.GYvLqhvTCS6X_RnGsxww2ktnZ0_j9rDMlWOBMl9wkFE';
let adminToken = '';
let customerId = '';
let orderId = '';
let vehicleId = '';

// Test data
const testData = {
  admin: {
    email: 'admin@pro.com',
    password: 'Admin123'
  },
  employee: {
    email: 'operations@pro.com',
    password: 'Ops123'
  },
  customer: {
    name: 'Ahmed Al-Rashid',
    email: `ahmed${Date.now()}@example.com`,
    phone: '+966501111111',
    company: {
      name: 'Al-Rashid Trading',
      taxId: '123456789',
      industry: 'Import/Export'
    },
    address: {
      street: '123 Business District',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    },
    customerType: 'business',
    creditLimit: 50000,
    status: 'active'
  },
  order: {
    orderNumber: `ORD-${Date.now()}`,
    serviceType: 'land_transport',
    status: 'pending',
    priority: 'high',
    origin: {
      address: 'Riyadh Industrial City',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    },
    destination: {
      address: 'Jeddah Port',
      city: 'Jeddah',
      country: 'Saudi Arabia',
      coordinates: { lat: 21.3891, lng: 39.8579 }
    },
    cargo: {
      description: 'Electronic Equipment',
      weight: 1500,
      dimensions: { length: 200, width: 150, height: 100 },
      value: 25000,
      quantity: 10,
      packageType: 'box'
    },
    pricing: {
      basePrice: 2500,
      additionalCharges: [{ description: 'Insurance', amount: 250 }],
      discount: 0,
      tax: 390,
      totalAmount: 3290
    }
  },
  vehicle: {
    plateNumber: `ABC-${Math.floor(Math.random()*10000)}`,
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
      name: 'Mohammed Al-Fahd',
      phone: '+966503333333',
      licenseNumber: 'DL123456',
      licenseExpiry: '2025-12-31'
    },
    status: 'available',
    currentLocation: {
      address: 'Riyadh Logistics Hub',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    }
  }
};

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

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  const result = await makeRequest('GET', '/health');
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log('Response:', result.data);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testLogin() {
  console.log('🔐 Testing Login...');
  const result = await makeRequest('POST', '/auth/login', testData.admin);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    adminToken = result.data.token;
    console.log('Admin token received:', adminToken.substring(0, 20) + '...');
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testRegister() {
  console.log('📝 Testing Register...');
  const timestamp = Date.now();
  const registerData = {
    name: 'Test User',
    email: `testuser${timestamp}@example.com`,
    password: 'test1234',
    phone: '+966501234000',
    role: 'CLIENT_MANAGER',
    address: {
      street: '123 Test Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  };
  const result = await makeRequest('POST', '/auth/register', registerData);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    authToken = result.data.token;
    console.log('User token received:', authToken.substring(0, 20) + '...');
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetCurrentUser() {
  console.log('👤 Testing Get Current User...');
  const result = await makeRequest('GET', '/auth/me', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log('User:', result.data.user.name);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testCreateCustomer() {
  console.log('👥 Testing Create Customer...');
  const result = await makeRequest('POST', '/customers', testData.customer, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    customerId = result.data.data._id;
    console.log('Customer created with ID:', customerId);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetCustomers() {
  console.log('📋 Testing Get All Customers...');
  const result = await makeRequest('GET', '/customers', null, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} customers`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testCreateVehicle() {
  console.log('🚛 Testing Create Vehicle...');
  const vehicleData = { ...testData.vehicle, plateNumber: `ABC-${Math.floor(Math.random()*10000)}` };
  const result = await makeRequest('POST', '/vehicles', vehicleData, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    vehicleId = result.data.data._id;
    console.log('Vehicle created with ID:', vehicleId);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testCreateOrder() {
  console.log('📦 Testing Create Order...');
  const orderData = {
    ...testData.order,
    orderNumber: `ORD-${Date.now()}`,
    customer: customerId
  };
  if (vehicleId) orderData.vehicle = vehicleId;
  const result = await makeRequest('POST', '/orders', orderData, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    orderId = result.data.data._id;
    console.log('Order created with ID:', orderId);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetOrders() {
  console.log('📋 Testing Get All Orders...');
  const result = await makeRequest('GET', '/orders', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} orders`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testUpdateOrderStatus() {
  if (!orderId) {
    console.log('🔄 Skipping Update Order Status (no order created)');
    return;
  }
  console.log('🔄 Testing Update Order Status...');
  const statusData = {
    status: 'in_transit',
    notes: 'Package picked up and in transit'
  };
  const result = await makeRequest('PUT', `/orders/${orderId}/status`, statusData, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log('Order status updated successfully');
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetVehicles() {
  console.log('🚛 Testing Get All Vehicles...');
  const result = await makeRequest('GET', '/vehicles', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} vehicles`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetShipments() {
  console.log('📦 Testing Get All Shipments...');
  const result = await makeRequest('GET', '/shipments', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} shipments`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetInvoices() {
  console.log('🧾 Testing Get All Invoices...');
  const result = await makeRequest('GET', '/invoices', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} invoices`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetReports() {
  console.log('📊 Testing Get Reports...');
  const result = await makeRequest('GET', '/reports', null, adminToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log('Reports retrieved successfully');
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

async function testGetNotifications() {
  console.log('🔔 Testing Get Notifications...');
  const result = await makeRequest('GET', '/notifications', null, authToken);
  console.log(`Status: ${result.status}`, result.success ? '✅' : '❌');
  if (result.success) {
    console.log(`Found ${result.data.data.length} notifications`);
  } else {
    console.log('Error:', result.error);
  }
  console.log('---');
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting API Tests...\n');

  // Test order
  await testHealthCheck();
  await testLogin();
  await testRegister();
  await testGetCurrentUser();
  await testCreateCustomer();
  await testGetCustomers();
  await testCreateVehicle();
  await testCreateOrder();
  await testGetOrders();
  await testUpdateOrderStatus();
  await testGetVehicles();
  await testGetShipments();
  await testGetInvoices();
  await testGetReports();
  await testGetNotifications();

  console.log('✅ All tests completed!');
  console.log('\n📊 Summary:');
  console.log(`- Admin Token: ${adminToken ? '✅' : '❌'}`);
  console.log(`- User Token: ${authToken ? '✅' : '❌'}`);
  console.log(`- Customer ID: ${customerId || '❌'}`);
  console.log(`- Vehicle ID: ${vehicleId || '❌'}`);
  console.log(`- Order ID: ${orderId || '❌'}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  makeRequest,
  testData
}; 