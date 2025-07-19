const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

// Test with different user roles
const testUsers = [
  {
    email: 'admin@pro.com',
    password: 'Admin123',
    role: 'admin'
  },
  {
    email: 'manager@pro.com', 
    password: 'Manager123',
    role: 'GENERAL_MANAGER'
  },
  {
    email: 'operations@pro.com',
    password: 'Operations123', 
    role: 'OPERATIONS_MANAGER'
  }
];

async function testAuthorization() {
  console.log('🔍 Testing Authorization with Different Users...\n');

  for (const user of testUsers) {
    console.log(`👤 Testing with ${user.role} user...`);
    
    try {
      // Login
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });

      const token = loginResponse.data.token;
      console.log(`✅ Login successful for ${user.role}`);

      // Test Users API
      try {
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Users API accessible for ${user.role}`);
      } catch (error) {
        console.log(`❌ Users API blocked for ${user.role}: ${error.response?.data?.message || error.message}`);
      }

      // Test Customers API
      try {
        const customersResponse = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Customers API accessible for ${user.role}`);
      } catch (error) {
        console.log(`❌ Customers API blocked for ${user.role}: ${error.response?.data?.message || error.message}`);
      }

      // Test Reports API
      try {
        const reportsResponse = await axios.get(`${API_BASE_URL}/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Reports API accessible for ${user.role}`);
      } catch (error) {
        console.log(`❌ Reports API blocked for ${user.role}: ${error.response?.data?.message || error.message}`);
      }

      console.log('---\n');

    } catch (error) {
      console.log(`❌ Login failed for ${user.role}: ${error.response?.data?.message || error.message}\n`);
    }
  }
}

// Run the test
testAuthorization(); 