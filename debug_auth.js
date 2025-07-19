const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function debugAuth() {
  console.log('🔍 Debugging Authorization...\n');

  // 1. Login as admin
  console.log('1. Logging in as admin...');
  try {
    const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    if (loginRes.data.token) {
      console.log('✅ Admin login successful');
      console.log('Token:', loginRes.data.token.substring(0, 20) + '...');
      console.log('User role:', loginRes.data.user.role);
      
      const token = loginRes.data.token;
      
      // 2. Test auth/me to see user details
      console.log('\n2. Testing /auth/me...');
      try {
        const meRes = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ /auth/me successful');
        console.log('User details:', {
          id: meRes.data.user._id,
          name: meRes.data.user.name,
          email: meRes.data.user.email,
          role: meRes.data.user.role
        });
      } catch (error) {
        console.log('❌ /auth/me failed:', error.response?.data?.message || error.message);
      }
      
      // 3. Test customers endpoint
      console.log('\n3. Testing customers endpoint...');
      try {
        const customersRes = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Customers endpoint accessible');
        console.log('Response status:', customersRes.status);
        console.log('Customers found:', customersRes.data.data?.length || 0);
      } catch (error) {
        console.log('❌ Customers endpoint failed:');
        console.log('  Status:', error.response?.status);
        console.log('  Message:', error.response?.data?.message || error.message);
        console.log('  Full error:', JSON.stringify(error.response?.data, null, 2));
      }
      
      // 4. Test users endpoint
      console.log('\n4. Testing users endpoint...');
      try {
        const usersRes = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Users endpoint accessible');
        console.log('Response status:', usersRes.status);
        console.log('Users found:', usersRes.data.data?.length || 0);
      } catch (error) {
        console.log('❌ Users endpoint failed:');
        console.log('  Status:', error.response?.status);
        console.log('  Message:', error.response?.data?.message || error.message);
        console.log('  Full error:', JSON.stringify(error.response?.data, null, 2));
      }
      
    } else {
      console.log('❌ Admin login failed - no token received');
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
  }
}

debugAuth(); 