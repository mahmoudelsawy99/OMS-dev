const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testSignup() {
  console.log('🚀 Testing Sign-up System...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
    return;
  }

  // Test 2: Register a new user
  console.log('\n2. Testing User Registration...');
  const timestamp = Date.now();
  const newUser = {
    name: 'Test User',
    email: `testuser${timestamp}@example.com`,
    password: 'Test123456',
    phone: '+966501234567',
    role: 'CLIENT_MANAGER',
    address: {
      street: '123 Test Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  };

  try {
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, newUser);
    console.log('✅ Registration successful!');
    console.log('User ID:', registerResponse.data.user.id);
    console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
    
    const token = registerResponse.data.token;
    
    // Test 3: Login with the new user
    console.log('\n3. Testing Login with new user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: newUser.email,
      password: newUser.password
    });
    
    if (loginResponse.data.token) {
      console.log('✅ Login successful!');
      console.log('Login Token:', loginResponse.data.token.substring(0, 20) + '...');
      
      // Test 4: Get current user profile
      console.log('\n4. Testing Get Current User...');
      const profileResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile retrieved:', profileResponse.data.user.name);
      
      // Test 5: Test access to public endpoints
      console.log('\n5. Testing Public Endpoints...');
      
      // Test orders endpoint (should be accessible)
      try {
        const ordersResponse = await axios.get(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Orders endpoint accessible');
        console.log(`   Found ${ordersResponse.data.data?.length || 0} orders`);
      } catch (error) {
        console.log('❌ Orders endpoint failed:', error.response?.data?.message || error.message);
      }
      
      // Test vehicles endpoint (should be accessible)
      try {
        const vehiclesResponse = await axios.get(`${API_BASE_URL}/vehicles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Vehicles endpoint accessible');
        console.log(`   Found ${vehiclesResponse.data.data?.length || 0} vehicles`);
      } catch (error) {
        console.log('❌ Vehicles endpoint failed:', error.response?.data?.message || error.message);
      }
      
      // Test notifications endpoint (should be accessible)
      try {
        const notificationsResponse = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Notifications endpoint accessible');
        console.log(`   Found ${notificationsResponse.data.data?.length || 0} notifications`);
      } catch (error) {
        console.log('❌ Notifications endpoint failed:', error.response?.data?.message || error.message);
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
      console.log('ℹ️ User already exists, testing login...');
      
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: newUser.email,
        password: newUser.password
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Login successful with existing user!');
      } else {
        console.log('❌ Login failed with existing user');
      }
    } else {
      console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    }
  }

  // Test 6: Create admin user if it doesn't exist
  console.log('\n6. Testing Admin User Creation...');
  const adminUser = {
    name: 'System Administrator',
    email: 'admin@prospeed.com',
    password: 'Admin123',
    phone: '+966501234567',
    role: 'GENERAL_MANAGER',
    address: {
      street: '123 Admin Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  };

  try {
    const adminRegisterResponse = await axios.post(`${API_BASE_URL}/auth/register`, adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('Admin Token:', adminRegisterResponse.data.token.substring(0, 20) + '...');
    
    const adminToken = adminRegisterResponse.data.token;
    
    // Test admin access to protected endpoints
    console.log('\n7. Testing Admin Access to Protected Endpoints...');
    
    // Test customers endpoint with admin
    try {
      const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin can access customers endpoint');
      console.log(`   Found ${customersResponse.data.data?.length || 0} customers`);
    } catch (error) {
      console.log('❌ Admin customers access failed:', error.response?.data?.message || error.message);
    }
    
    // Test users endpoint with admin
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Admin can access users endpoint');
      console.log(`   Found ${usersResponse.data.data?.length || 0} users`);
    } catch (error) {
      console.log('❌ Admin users access failed:', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
      console.log('ℹ️ Admin user already exists, testing login...');
      
      const adminLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@pro.com',
        password: 'Admin123'
      });
      
      if (adminLoginResponse.data.token) {
        console.log('✅ Admin login successful!');
        console.log('Admin Token:', adminLoginResponse.data.token.substring(0, 20) + '...');
        
        const adminToken = adminLoginResponse.data.token;
        
        // Test admin access to protected endpoints
        console.log('\n7. Testing Admin Access to Protected Endpoints...');
        
        // Test customers endpoint with admin
        try {
          const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          console.log('✅ Admin can access customers endpoint');
          console.log(`   Found ${customersResponse.data.data?.length || 0} customers`);
        } catch (error) {
          console.log('❌ Admin customers access failed:', error.response?.data?.message || error.message);
        }
        
        // Test users endpoint with admin
        try {
          const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          console.log('✅ Admin can access users endpoint');
          console.log(`   Found ${usersResponse.data.data?.length || 0} users`);
        } catch (error) {
          console.log('❌ Admin users access failed:', error.response?.data?.message || error.message);
        }
      } else {
        console.log('❌ Admin login failed');
      }
    } else {
      console.log('❌ Admin creation failed:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n✅ Sign-up system testing completed!');
}

// Run the test
testSignup(); 