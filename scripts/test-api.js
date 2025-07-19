const API_BASE_URL = 'http://localhost:5002/api';

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
      config.body = JSON.stringify(data);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: config.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();
    
    return {
      success: response.ok,
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  // Test 1: Login
  console.log('1. Testing Login...');
  const loginResult = await makeApiCall('/auth/login', 'POST', {
    email: 'admin@pro.com',
    password: 'Admin123'
  });
  
  if (loginResult.success) {
    console.log('✅ Login successful');
    const token = loginResult.data.token;
    
    // Test 2: Get Customers
    console.log('\n2. Testing Get Customers...');
    const customersResult = await makeApiCall('/customers', 'GET', null, token);
    if (customersResult.success) {
      console.log(`✅ Found ${customersResult.data.data ? customersResult.data.data.length : 'undefined'} customers`);
      if (customersResult.data.data && customersResult.data.data.length > 0) {
        console.log(`   First customer: ${customersResult.data.data[0].name}`);
      }
      console.log('   Response structure:', JSON.stringify(customersResult.data, null, 2));
    } else {
      console.log('❌ Failed to get customers:', customersResult.data.message);
    }

    // Test 3: Get Users
    console.log('\n3. Testing Get Users...');
    const usersResult = await makeApiCall('/users', 'GET', null, token);
    if (usersResult.success) {
      console.log(`✅ Found ${usersResult.data.length} users`);
    } else {
      console.log('❌ Failed to get users:', usersResult.data.message);
    }

    // Test 4: Get Orders
    console.log('\n4. Testing Get Orders...');
    const ordersResult = await makeApiCall('/orders', 'GET', null, token);
    if (ordersResult.success) {
      console.log(`✅ Found ${ordersResult.data.length} orders`);
    } else {
      console.log('❌ Failed to get orders:', ordersResult.data.message);
    }

    // Test 5: Get Suppliers
    console.log('\n5. Testing Get Suppliers...');
    const suppliersResult = await makeApiCall('/suppliers', 'GET', null, token);
    if (suppliersResult.success) {
      console.log(`✅ Found ${suppliersResult.data.length} suppliers`);
    } else {
      console.log('❌ Failed to get suppliers:', suppliersResult.data.message);
    }

  } else {
    console.log('❌ Login failed:', loginResult.data.message);
  }

  console.log('\n🎉 API Testing completed!');
}

// Run the test
testAPI().catch(console.error); 