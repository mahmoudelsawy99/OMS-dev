const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAuth() {
  console.log('🔐 Testing authorization...\n');

  try {
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });

    if (loginResponse.data.token) {
      console.log('✅ Admin login successful');
      const token = loginResponse.data.token;

      // Step 2: Test customers endpoint
      console.log('\n2. Testing customers endpoint...');
      try {
        const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Customers endpoint accessible');
        console.log(`   Found ${customersResponse.data.data?.length || 0} customers`);
      } catch (error) {
        console.log('❌ Customers endpoint failed:', error.response?.data?.message || error.message);
      }

      // Step 3: Test suppliers endpoint
      console.log('\n3. Testing suppliers endpoint...');
      try {
        const suppliersResponse = await axios.get(`${API_BASE_URL}/suppliers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Suppliers endpoint accessible');
        console.log(`   Found ${suppliersResponse.data.data?.length || 0} suppliers`);
      } catch (error) {
        console.log('❌ Suppliers endpoint failed:', error.response?.data?.message || error.message);
      }

    } else {
      console.log('❌ Admin login failed');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testAuth(); 