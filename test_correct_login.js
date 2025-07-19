const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

async function testCorrectLogin() {
  console.log('🔐 Testing Login with Correct Credentials...\n');

  // Test with the admin user that was just created
  const adminCredentials = {
    email: 'superadmin@pro.com',
    password: 'Admin1234'
  };

  console.log('1. Testing login with superadmin...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, adminCredentials);
    
    if (response.data.token) {
      console.log('✅ Login successful!');
      console.log('👤 User:', response.data.user.name);
      console.log('🎭 Role:', response.data.user.role);
      console.log('🆔 ID:', response.data.user.id);
      console.log('🔑 Token:', response.data.token.substring(0, 20) + '...');
      
      const token = response.data.token;
      
      // Test accessing protected endpoints
      console.log('\n2. Testing protected endpoints...');
      
      const endpoints = [
        { name: 'Users', url: '/users' },
        { name: 'Customers', url: '/customers' },
        { name: 'Orders', url: '/orders' },
        { name: 'Vehicles', url: '/vehicles' },
        { name: 'Invoices', url: '/invoices' },
        { name: 'Shipments', url: '/shipments' },
        { name: 'Reports', url: '/reports' }
      ];
      
      for (const endpoint of endpoints) {
        try {
          const endpointResponse = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`✅ ${endpoint.name}: ${endpointResponse.status} (${endpointResponse.data.data?.length || 0} items)`);
        } catch (error) {
          console.log(`❌ ${endpoint.name}: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
      }
      
    } else {
      console.log('❌ Login failed - no token received');
    }
    
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.log('📄 Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testCorrectLogin(); 