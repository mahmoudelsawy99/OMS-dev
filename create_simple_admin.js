const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

async function createSimpleAdmin() {
  console.log('🔧 Creating Simple Admin User...\n');

  // Try to create a simple admin user
  const adminUser = {
    name: 'System Administrator',
    email: 'admin@pro.com',
    password: 'Admin123',
    phone: '+966501234567',
    role: 'admin', // Try the simple 'admin' role
    address: {
      street: 'Admin Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  };

  console.log('1. Creating admin user...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, adminUser);
    
    if (response.data.token) {
      console.log('✅ Admin user created successfully!');
      console.log('👤 User:', response.data.user.name);
      console.log('🎭 Role:', response.data.user.role);
      console.log('🔑 Token:', response.data.token.substring(0, 20) + '...');
      
      // Test login with the created user
      console.log('\n2. Testing login with created admin...');
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: adminUser.email,
        password: adminUser.password
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Login successful!');
        console.log('👤 User:', loginResponse.data.user.name);
        console.log('🎭 Role:', loginResponse.data.user.role);
        
        // Test accessing protected endpoints
        console.log('\n3. Testing protected endpoints...');
        const token = loginResponse.data.token;
        
        const endpoints = [
          { name: 'Users', url: '/users' },
          { name: 'Customers', url: '/customers' },
          { name: 'Orders', url: '/orders' },
          { name: 'Vehicles', url: '/vehicles' }
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
        
        console.log('\n🎉 SUCCESS! You can now use these credentials:');
        console.log('📧 Email: admin@pro.com');
        console.log('🔑 Password: Admin123');
        
      } else {
        console.log('❌ Login failed after creation');
      }
      
    } else {
      console.log('❌ Admin creation failed - no token received');
    }
    
  } catch (error) {
    console.log('❌ Admin creation failed:', error.response?.data?.message || error.message);
    
    if (error.response?.data?.errors) {
      console.log('📄 Validation errors:');
      error.response.data.errors.forEach(err => {
        console.log(`   - ${err.path}: ${err.msg}`);
      });
    }
    
    // If admin role fails, try with 'user' role
    console.log('\n🔄 Trying with "user" role...');
    const userData = {
      ...adminUser,
      role: 'user'
    };
    
    try {
      const userResponse = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      if (userResponse.data.token) {
        console.log('✅ User created with "user" role!');
        console.log('👤 User:', userResponse.data.user.name);
        console.log('🎭 Role:', userResponse.data.user.role);
        
        // Test login
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        
        if (loginResponse.data.token) {
          console.log('✅ Login successful!');
          console.log('\n🎉 SUCCESS! You can now use these credentials:');
          console.log('📧 Email: admin@pro.com');
          console.log('🔑 Password: Admin123');
          console.log('🎭 Role: user');
        }
      }
    } catch (userError) {
      console.log('❌ User creation also failed:', userError.response?.data?.message || userError.message);
    }
  }
}

createSimpleAdmin(); 