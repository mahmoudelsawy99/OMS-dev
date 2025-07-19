const axios = require('axios');

const BASE_URL = 'http://31.97.156.49:5001/api';

async function testServerHealth() {
  console.log('🏥 Testing Remote Server Health...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check successful:', healthResponse.data);
    
    // Test if server is responding
    console.log('\n2. Testing server response...');
    console.log('✅ Server is responding');
    console.log('Status:', healthResponse.status);
    console.log('Response time:', healthResponse.headers['x-response-time'] || 'N/A');
    
  } catch (error) {
    console.log('❌ Server health check failed');
    console.log('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🔴 Server is not accessible - connection refused');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🔴 Server host not found');
    } else if (error.response) {
      console.log('🔴 Server responded with error:', error.response.status);
      console.log('Error details:', error.response.data);
    }
  }
  
  // Test login with detailed error
  console.log('\n3. Testing login with detailed error...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('User role:', loginResponse.data.user.role);
    
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
    console.log('Full error response:', JSON.stringify(error.response?.data, null, 2));
  }
}

testServerHealth(); 