const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

async function debugLoginIssue() {
  console.log('🔍 Debugging Login Issue...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
    return;
  }

  // Test 2: Test login with different data formats
  console.log('\n2. Testing Login with different formats...');
  
  const testCases = [
    {
      name: 'Standard login',
      data: { email: 'admin@pro.com', password: 'Admin123' }
    },
    {
      name: 'Admin with different password',
      data: { email: 'admin@pro.com', password: 'admin123' }
    },
    {
      name: 'Admin with uppercase password',
      data: { email: 'admin@pro.com', password: 'ADMIN123' }
    },
    {
      name: 'Different admin email',
      data: { email: 'admin@example.com', password: 'Admin123' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n   Testing: ${testCase.name}`);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, testCase.data);
      console.log(`   ✅ Success! Token: ${response.data.token ? 'Received' : 'None'}`);
      if (response.data.user) {
        console.log(`   👤 User: ${response.data.user.name} (${response.data.user.role})`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      if (error.response?.data) {
        console.log(`   📄 Response:`, JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  // Test 3: Check what users exist
  console.log('\n3. Testing if we can get users list...');
  try {
    // First try to login with any working credentials
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Got token, testing users endpoint...');
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${loginResponse.data.token}` }
      });
      console.log(`✅ Users endpoint working. Found ${usersResponse.data.data?.length || 0} users`);
      
      // Show first few users
      if (usersResponse.data.data && usersResponse.data.data.length > 0) {
        console.log('\n📋 Available users:');
        usersResponse.data.data.slice(0, 5).forEach(user => {
          console.log(`   - ${user.email} (${user.role})`);
        });
      }
    }
  } catch (error) {
    console.log('❌ Cannot access users:', error.response?.data?.message || error.message);
  }

  console.log('\n🔍 Debug Summary:');
  console.log('- The 400 error suggests the server is receiving the request but rejecting the data');
  console.log('- This could be due to:');
  console.log('  1. Wrong credentials format');
  console.log('  2. User does not exist');
  console.log('  3. Password is incorrect');
  console.log('  4. Server validation issues');
}

debugLoginIssue(); 