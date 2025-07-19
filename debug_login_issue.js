const axios = require('axios');

const BASE_URL = 'http://31.97.156.49:5001/api';

async function debugLoginIssue() {
  console.log('🔍 Debugging Login Issue...\n');
  
  // Test different login scenarios
  const testCases = [
    {
      name: 'Admin with correct credentials',
      data: { email: 'admin@pro.com', password: 'Admin123' }
    },
    {
      name: 'Admin with wrong password',
      data: { email: 'admin@pro.com', password: 'wrongpassword' }
    },
    {
      name: 'Non-existent user',
      data: { email: 'nonexistent@example.com', password: 'test123' }
    },
    {
      name: 'Empty credentials',
      data: { email: '', password: '' }
    },
    {
      name: 'Missing password',
      data: { email: 'admin@pro.com' }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.name} ---`);
    
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, testCase.data);
      
      if (response.data.token) {
        console.log('✅ Login successful!');
        console.log('User role:', response.data.user.role);
        console.log('User ID:', response.data.user.id);
      } else {
        console.log('⚠️ Login response without token');
        console.log('Response:', response.data);
      }
      
    } catch (error) {
      console.log('❌ Login failed');
      console.log('Status:', error.response?.status);
      console.log('Error type:', error.response?.status === 500 ? 'Server Error' : 'Client Error');
      console.log('Error message:', error.response?.data?.message || error.message);
      
      // If it's a 500 error, it might be a database issue
      if (error.response?.status === 500) {
        console.log('🔴 This is a server-side error (500)');
        console.log('Possible causes:');
        console.log('  - Database connection issue');
        console.log('  - User data corruption after role update');
        console.log('  - Server configuration problem');
      }
    }
  }
  
  // Test registration to see if that works
  console.log('\n--- Testing User Registration ---');
  try {
    const registerData = {
      name: 'Test Debug User',
      email: `debug${Date.now()}@example.com`,
      password: 'Test1234',
      phone: '+966501234567',
      role: 'employee'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful!');
    console.log('User role:', registerResponse.data.user.role);
    
    // Try to login with the newly created user
    console.log('\n--- Testing Login with New User ---');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login with new user successful!');
      console.log('User role:', loginResponse.data.user.role);
    }
    
  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
  }
}

debugLoginIssue(); 