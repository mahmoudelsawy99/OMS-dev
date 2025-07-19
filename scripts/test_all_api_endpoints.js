const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

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
      status: error.response?.status,
      endpoint: endpoint,
      method: method
    };
  }
}

async function testAllEndpoints() {
  console.log('🔍 Testing All API Endpoints...\n');

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

    // Step 2: Test all endpoints
    const endpoints = [
      // Working endpoints
      { path: '/health', method: 'GET', name: 'Health Check', requiresAuth: false },
      { path: '/auth/login', method: 'POST', name: 'Login', requiresAuth: false },
      { path: '/auth/register', method: 'POST', name: 'Register', requiresAuth: false },
      
      // Blocked endpoints (Authorization issues)
      { path: '/users', method: 'GET', name: 'Get Users', requiresAuth: true },
      { path: '/users', method: 'POST', name: 'Create User', requiresAuth: true },
      { path: '/customers', method: 'GET', name: 'Get Customers', requiresAuth: true },
      { path: '/customers', method: 'POST', name: 'Create Customer', requiresAuth: true },
      
      // Working endpoints
      { path: '/orders', method: 'GET', name: 'Get Orders', requiresAuth: true },
      { path: '/orders', method: 'POST', name: 'Create Order', requiresAuth: true },
      { path: '/vehicles', method: 'GET', name: 'Get Vehicles', requiresAuth: true },
      { path: '/vehicles', method: 'POST', name: 'Create Vehicle', requiresAuth: true },
      
      // Missing endpoints (Route not found)
      { path: '/suppliers', method: 'GET', name: 'Get Suppliers', requiresAuth: true },
      { path: '/suppliers', method: 'POST', name: 'Create Supplier', requiresAuth: true },
      { path: '/invoices', method: 'GET', name: 'Get Invoices', requiresAuth: true },
      { path: '/invoices', method: 'POST', name: 'Create Invoice', requiresAuth: true },
      { path: '/shipments', method: 'GET', name: 'Get Shipments', requiresAuth: true },
      { path: '/shipments', method: 'POST', name: 'Create Shipment', requiresAuth: true },
      
      // Additional endpoints to check
      { path: '/reports', method: 'GET', name: 'Get Reports', requiresAuth: true },
      { path: '/notifications', method: 'GET', name: 'Get Notifications', requiresAuth: true },
    ];

    console.log('2. Testing all endpoints...\n');

    const results = {
      working: [],
      blocked: [],
      missing: [],
      other: []
    };

    for (const endpoint of endpoints) {
      const authToken = endpoint.requiresAuth ? token : null;
      const result = await makeApiCall(endpoint.path, endpoint.method, null, authToken);
      
      const endpointInfo = {
        path: endpoint.path,
        method: endpoint.method,
        name: endpoint.name,
        status: result.status,
        error: result.error
      };

      if (result.success) {
        results.working.push(endpointInfo);
        console.log(`✅ ${endpoint.name} (${endpoint.method} ${endpoint.path}) - Status: ${result.status}`);
      } else if (result.status === 403) {
        results.blocked.push(endpointInfo);
        console.log(`❌ ${endpoint.name} (${endpoint.method} ${endpoint.path}) - BLOCKED: Authorization required`);
      } else if (result.status === 404) {
        results.missing.push(endpointInfo);
        console.log(`❌ ${endpoint.name} (${endpoint.method} ${endpoint.path}) - MISSING: Route not found`);
      } else {
        results.other.push(endpointInfo);
        console.log(`⚠️  ${endpoint.name} (${endpoint.method} ${endpoint.path}) - OTHER: ${result.status} - ${result.error?.message || result.error}`);
      }
    }

    // Step 3: Generate detailed analysis
    console.log('\n📊 API Endpoints Analysis:\n');

    console.log('✅ WORKING ENDPOINTS:');
    results.working.forEach(endpoint => {
      console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
    });

    console.log('\n❌ BLOCKED ENDPOINTS (Authorization Issues):');
    results.blocked.forEach(endpoint => {
      console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
    });

    console.log('\n❌ MISSING ENDPOINTS (Route Not Found):');
    results.missing.forEach(endpoint => {
      console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
    });

    if (results.other.length > 0) {
      console.log('\n⚠️ OTHER ISSUES:');
      results.other.forEach(endpoint => {
        console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path} - ${endpoint.status}`);
      });
    }

    // Step 4: Provide solutions
    console.log('\n🔧 SOLUTIONS:\n');

    if (results.blocked.length > 0) {
      console.log('🚨 AUTHORIZATION FIXES REQUIRED:');
      console.log('The following endpoints are blocked due to authorization issues:');
      results.blocked.forEach(endpoint => {
        console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
      });
      console.log('\nSOLUTION: Update the authorization middleware to allow OPERATIONS_MANAGER access:');
      console.log('1. Update middleware/auth.js to include OPERATIONS_MANAGER in admin roles');
      console.log('2. Deploy the updated middleware to the server');
      console.log('3. Test the endpoints again\n');
    }

    if (results.missing.length > 0) {
      console.log('🚨 MISSING ROUTES FIXES REQUIRED:');
      console.log('The following endpoints need to be implemented:');
      results.missing.forEach(endpoint => {
        console.log(`  - ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
      });
      console.log('\nSOLUTION: Create the missing route files:');
      console.log('1. Create routes/suppliers.js');
      console.log('2. Create routes/invoices.js');
      console.log('3. Create routes/shipments.js');
      console.log('4. Add the routes to server.js');
      console.log('5. Deploy the new routes to the server\n');
    }

    // Step 5: Summary
    console.log('📈 SUMMARY:');
    console.log(`✅ Working endpoints: ${results.working.length}`);
    console.log(`❌ Blocked endpoints: ${results.blocked.length}`);
    console.log(`❌ Missing endpoints: ${results.missing.length}`);
    console.log(`⚠️ Other issues: ${results.other.length}`);
    console.log(`📊 Total tested: ${endpoints.length}`);

    console.log('\n🎯 PRIORITY ACTIONS:');
    if (results.blocked.length > 0) {
      console.log('1. 🔥 HIGH PRIORITY: Fix authorization middleware (affects Users & Customers)');
    }
    if (results.missing.length > 0) {
      console.log('2. 🔥 HIGH PRIORITY: Implement missing routes (Suppliers, Invoices, Shipments)');
    }
    console.log('3. Test all endpoints after fixes');
    console.log('4. Update frontend components to use working APIs');

  } catch (error) {
    console.error('❌ Testing failed:', error.message);
  }
}

// Run the test
testAllEndpoints(); 