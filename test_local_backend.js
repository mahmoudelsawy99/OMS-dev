const axios = require('axios');

const API_BASE_URL = 'http://localhost:5002/api';

async function testLocalBackend() {
  console.log('🔧 Testing Local Backend...\n');

  // Test 1: Health Check
  console.log('1. Testing Health Check...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
    console.log('Make sure the local backend is running on port 5002');
    return;
  }

  // Test 2: Create admin user
  console.log('\n2. Creating admin user...');
  const adminUser = {
    name: 'System Administrator',
    email: 'admin@pro.com',
    password: 'Admin123',
    phone: '+966501234567',
    role: 'ADMIN',
    address: {
      street: 'Admin Street',
      city: 'Riyadh',
      country: 'Saudi Arabia'
    }
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, adminUser);
    
    if (response.data.token) {
      console.log('✅ Admin user created successfully!');
      console.log('👤 User:', response.data.user.name);
      console.log('🎭 Role:', response.data.user.role);
      console.log('🔑 Token:', response.data.token.substring(0, 20) + '...');
      
      // Test 3: Login with created user
      console.log('\n3. Testing login...');
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: adminUser.email,
        password: adminUser.password
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Login successful!');
        console.log('👤 User:', loginResponse.data.user.name);
        console.log('🎭 Role:', loginResponse.data.user.role);
        
        // Test 4: Access protected endpoints
        console.log('\n4. Testing protected endpoints...');
        const token = loginResponse.data.token;
        
        const endpoints = [
          { name: 'Users', url: '/users' },
          { name: 'Customers', url: '/customers' },
          { name: 'Orders', url: '/orders' },
          { name: 'Vehicles', url: '/vehicles' },
          { name: 'Invoices', url: '/invoices' },
          { name: 'Shipments', url: '/shipments' }
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
        
        console.log('\n🎉 SUCCESS! Local backend is working!');
        console.log('📧 Email: admin@pro.com');
        console.log('🔑 Password: Admin123');
        console.log('🌐 Backend: http://localhost:5002/api');
        
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
  }
}

testLocalBackend(); 