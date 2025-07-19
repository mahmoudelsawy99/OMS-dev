const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

// Test different roles
const testRoles = [
  'GENERAL_MANAGER',
  'OPERATIONS_MANAGER', 
  'CLEARANCE_MANAGER',
  'TRANSLATOR',
  'CUSTOMS_BROKER',
  'DRIVER',
  'ACCOUNTANT',
  'DATA_ENTRY',
  'CLIENT_MANAGER',
  'CLIENT_SUPERVISOR',
  'CLIENT_DATA_ENTRY'
];

async function testRolePermissions() {
  console.log('🔍 Testing All Role Permissions on Remote Server...\n');

  // First, let's see what endpoints are available
  console.log('1. Testing Health Check...');
  try {
    const healthRes = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthRes.data);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
    return;
  }

  // Test each role by creating a user with that role
  for (const role of testRoles) {
    console.log(`\n=== Testing Role: ${role} ===`);
    
    const testUser = {
      name: `Test ${role}`,
      email: `test${role.toLowerCase()}${Date.now()}@example.com`,
      password: 'Test123456',
      phone: '+966501234567',
      role: role,
      address: { street: 'Test St', city: 'Riyadh', country: 'Saudi Arabia' }
    };

    try {
      // Register user with this role
      const registerRes = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      if (registerRes.data.token) {
        console.log(`✅ Registered user with role: ${role}`);
        
        const token = registerRes.data.token;
        
        // Test different endpoints
        const endpoints = [
          { name: 'Customers', url: '/customers', method: 'GET' },
          { name: 'Users', url: '/users', method: 'GET' },
          { name: 'Orders', url: '/orders', method: 'GET' },
          { name: 'Vehicles', url: '/vehicles', method: 'GET' },
          { name: 'Shipments', url: '/shipments', method: 'GET' },
          { name: 'Invoices', url: '/invoices', method: 'GET' },
          { name: 'Reports', url: '/reports', method: 'GET' },
          { name: 'Notifications', url: '/notifications', method: 'GET' }
        ];

        for (const endpoint of endpoints) {
          try {
            const res = await axios({
              method: endpoint.method,
              url: `${API_BASE_URL}${endpoint.url}`,
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`  ✅ ${endpoint.name}: ${res.status}`);
          } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;
            console.log(`  ❌ ${endpoint.name}: ${status} - ${message}`);
          }
        }
        
      } else {
        console.log(`❌ Failed to register user with role: ${role}`);
      }
    } catch (error) {
      if (error.response?.data?.message === 'User already exists') {
        console.log(`ℹ️ User with role ${role} already exists`);
      } else {
        console.log(`❌ Failed to register user with role ${role}:`, error.response?.data?.message || error.message);
      }
    }
  }

  console.log('\n✅ Role permission testing completed!');
}

testRolePermissions(); 