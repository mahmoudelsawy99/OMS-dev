const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

async function checkValidRoles() {
  console.log('🔍 Checking Valid Roles...\n');

  // Test different role values that might be valid
  const possibleRoles = [
    'admin',
    'user',
    'employee',
    'manager',
    'supervisor',
    'client',
    'supplier',
    'driver',
    'accountant',
    'translator',
    'broker',
    'data_entry',
    'operations',
    'clearance',
    'customs',
    'general',
    'basic',
    'standard'
  ];

  console.log('1. Testing different role values...\n');

  for (const role of possibleRoles) {
    console.log(`Testing role: "${role}"`);
    
    const testUser = {
      name: `Test ${role}`,
      email: `test${role}${Date.now()}@example.com`,
      password: 'Test123456',
      phone: '+966501234567',
      role: role,
      address: {
        street: 'Test Street',
        city: 'Riyadh',
        country: 'Saudi Arabia'
      }
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      console.log(`✅ SUCCESS! Role "${role}" is valid`);
      console.log(`   User created: ${response.data.user.email}`);
      console.log(`   Token: ${response.data.token ? 'Received' : 'None'}`);
      
      // If we found a working role, let's test login with it
      console.log(`   Testing login...`);
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.token) {
        console.log(`   ✅ Login successful!`);
        console.log(`   👤 User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
        return; // We found a working role, stop testing
      }
      
    } catch (error) {
      if (error.response?.data?.errors) {
        const roleError = error.response.data.errors.find(e => e.path === 'role');
        if (roleError) {
          console.log(`   ❌ Role "${role}" is invalid: ${roleError.msg}`);
        } else {
          console.log(`   ❌ Other error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else {
        console.log(`   ❌ Error: ${error.response?.data?.message || error.message}`);
      }
    }
  }

  // Test 2: Try to get the list of valid roles from the server
  console.log('\n2. Trying to get valid roles from server...');
  try {
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check successful');
    
    // Some APIs expose valid roles in health or config endpoints
    console.log('Health response:', JSON.stringify(healthResponse.data, null, 2));
    
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  console.log('\n🔍 Summary:');
  console.log('- The backend is rejecting all the roles we tried');
  console.log('- We need to find out what roles are actually valid');
  console.log('- Possible solutions:');
  console.log('  1. Check the backend code for valid role definitions');
  console.log('  2. Look for API documentation');
  console.log('  3. Check if there\'s a config endpoint that lists valid roles');
  console.log('  4. Try simpler roles like "admin", "user", "employee"');
}

checkValidRoles(); 