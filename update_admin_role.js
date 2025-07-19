const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function updateAdminRole() {
  console.log('🔄 Updating Admin Role...\n');

  // First, let's try to login and see what happens
  console.log('1. Testing login with current role...');
  try {
    const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    
    if (loginRes.data.token) {
      console.log('✅ Login successful');
      console.log('Current role:', loginRes.data.user.role);
      
      const token = loginRes.data.token;
      
      // Try to access a protected endpoint to see what happens
      console.log('\n2. Testing access to protected endpoint...');
      try {
        const customersRes = await axios.get(`${API_BASE_URL}/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Access granted! Role is working correctly.');
        return;
      } catch (error) {
        console.log('❌ Access denied. Role needs to be updated.');
        console.log('Error:', error.response?.data?.message || error.message);
      }
    }
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return;
  }

  console.log('\n3. Since the role is not working, you need to update it in the database.');
  console.log('   Please update the role for admin@pro.com in your MongoDB to one of these:');
  console.log('   - GENERAL_MANAGER (should work based on routes)');
  console.log('   - OPERATIONS_MANAGER (should work for employee-level access)');
  console.log('   - CLEARANCE_MANAGER (should work for employee-level access)');
  console.log('\n   The routes are configured to allow these roles for admin operations.');
}

updateAdminRole(); 