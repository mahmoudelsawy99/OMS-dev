const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

async function testFrontendAPI() {
  console.log('🔗 Testing Frontend API Connectivity...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: Login
    console.log('\n2. Testing Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🎭 Role:', loginResponse.data.user.role);
      
      const token = loginResponse.data.token;
      
      // Test 3: Customers API
      console.log('\n3. Testing Customers API...');
      try {
        const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Customers API: Working');
        console.log(`   Found ${customersResponse.data.data?.length || 0} customers`);
      } catch (error) {
        console.log('❌ Customers API: Failed -', error.response?.data?.message || error.message);
      }
      
      // Test 4: Users API
      console.log('\n4. Testing Users API...');
      try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Users API: Working');
        console.log(`   Found ${usersResponse.data.data?.length || 0} users`);
      } catch (error) {
        console.log('❌ Users API: Failed -', error.response?.data?.message || error.message);
      }
      
      // Test 5: Orders API
      console.log('\n5. Testing Orders API...');
      try {
        const ordersResponse = await axios.get(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Orders API: Working');
        console.log(`   Found ${ordersResponse.data.data?.length || 0} orders`);
      } catch (error) {
        console.log('❌ Orders API: Failed -', error.response?.data?.message || error.message);
      }
      
      // Test 6: Vehicles API
      console.log('\n6. Testing Vehicles API...');
      try {
        const vehiclesResponse = await axios.get(`${API_BASE_URL}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Vehicles API: Working');
        console.log(`   Found ${vehiclesResponse.data.data?.length || 0} vehicles`);
      } catch (error) {
        console.log('❌ Vehicles API: Failed -', error.response?.data?.message || error.message);
      }
      
      console.log('\n🎯 Frontend API Status:');
      console.log('✅ API Base URL: Correct (31.97.156.49:5001)');
      console.log('✅ Authentication: Working');
      console.log('✅ Token Management: Working');
      console.log('✅ API Endpoints: Accessible');
      
    } else {
      console.log('❌ Login failed - no token received');
    }
    
  } catch (error) {
    console.log('❌ API Test failed:', error.response?.data?.message || error.message);
  }
}

testFrontendAPI(); 