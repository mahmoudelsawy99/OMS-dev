const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testCurrentState() {
  console.log('🔍 Testing Current State of Admin User\n');
  
  try {
    // Test login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🎭 Role:', loginResponse.data.user.role);
      console.log('🆔 ID:', loginResponse.data.user.id);
      
      const token = loginResponse.data.token;
      
      // Test a few key endpoints
      console.log('\n2. Testing key endpoints...');
      
      // Test users endpoint (should be admin only)
      try {
        const usersResponse = await axios.get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Users endpoint: Access granted');
      } catch (error) {
        console.log('❌ Users endpoint: Access denied -', error.response?.data?.message || error.message);
      }
      
      // Test customers endpoint
      try {
        const customersResponse = await axios.get(`${BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Customers endpoint: Access granted');
      } catch (error) {
        console.log('❌ Customers endpoint: Access denied -', error.response?.data?.message || error.message);
      }
      
      // Test reports endpoint
      try {
        const reportsResponse = await axios.get(`${BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Reports endpoint: Access granted');
      } catch (error) {
        console.log('❌ Reports endpoint: Access denied -', error.response?.data?.message || error.message);
      }
      
      console.log('\n📊 Summary:');
      console.log(`Current role: ${loginResponse.data.user.role}`);
      console.log('This role should have access to all endpoints if the authorization is working correctly.');
      
    } else {
      console.log('❌ Login failed - no token received');
    }
    
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
  }
}

testCurrentState(); 