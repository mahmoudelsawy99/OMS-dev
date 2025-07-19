const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function createAdminUser() {
  console.log('🔐 Creating Admin User...\n');

  try {
    // Create admin user
    const adminData = {
      name: 'System Administrator',
      email: 'admin@pro.com',
      password: 'Admin123',
      phone: '+966501234567',
      role: 'GENERAL_MANAGER',
      address: {
        street: '123 Admin Street',
        city: 'Riyadh',
        country: 'Saudi Arabia'
      }
    };

    console.log('📝 Registering admin user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, adminData);
    
    if (registerResponse.data.token) {
      console.log('✅ Admin user created successfully!');
      console.log('Token:', registerResponse.data.token.substring(0, 20) + '...');
      console.log('User ID:', registerResponse.data.user.id);
      
      // Test login with the new admin user
      console.log('\n🔐 Testing admin login...');
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@pro.com',
        password: 'Admin123'
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Admin login successful!');
        console.log('Login Token:', loginResponse.data.token.substring(0, 20) + '...');
        
        // Test admin access to protected endpoints
        console.log('\n🔒 Testing admin access to protected endpoints...');
        const token = loginResponse.data.token;
        
        // Test customers endpoint
        try {
          const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ Customers endpoint accessible');
          console.log(`   Found ${customersResponse.data.data?.length || 0} customers`);
        } catch (error) {
          console.log('❌ Customers endpoint failed:', error.response?.data?.message || error.message);
        }
        
        // Test users endpoint
        try {
          const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('✅ Users endpoint accessible');
          console.log(`   Found ${usersResponse.data.data?.length || 0} users`);
        } catch (error) {
          console.log('❌ Users endpoint failed:', error.response?.data?.message || error.message);
        }
        
      } else {
        console.log('❌ Admin login failed');
      }
      
    } else {
      console.log('❌ Failed to create admin user');
    }

  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
      console.log('ℹ️ Admin user already exists, testing login...');
      
      // Test login with existing admin user
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'admin@pro.com',
        password: 'Admin123'
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Admin login successful!');
        console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
      } else {
        console.log('❌ Admin login failed');
      }
    } else {
      console.log('❌ Error creating admin user:', error.response?.data?.message || error.message);
    }
  }
}

// Run the function
createAdminUser(); 