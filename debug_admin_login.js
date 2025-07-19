const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test different admin credentials
const testCredentials = [
  {
    name: 'Original Admin',
    email: 'admin@pro.com',
    password: 'Admin123'
  },
  {
    name: 'New Super Admin',
    email: 'superadmin@pro.com',
    password: 'Admin1234'
  },
  {
    name: 'Super Admin (different password)',
    email: 'superadmin@pro.com',
    password: 'Admin123'
  }
];

async function testLogin(credentials) {
  try {
    console.log(`\n🔐 Testing login for: ${credentials.name}`);
    console.log(`📧 Email: ${credentials.email}`);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    if (response.data.token) {
      console.log('✅ Login successful!');
      console.log('👤 User:', response.data.user.name);
      console.log('🎭 Role:', response.data.user.role);
      console.log('🆔 ID:', response.data.user.id);
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      };
    }
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.message || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
}

async function testHealthCheck() {
  try {
    console.log('\n🏥 Testing Health Check...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Health Check failed:', error.response?.data || error.message);
    return false;
  }
}

async function runDebugTest() {
  console.log('🔧 Debug Admin Login Test\n');
  
  // First test health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('❌ Server health check failed - server might be down');
    return;
  }
  
  // Test all credentials
  const results = [];
  for (const cred of testCredentials) {
    const result = await testLogin(cred);
    results.push({ ...cred, ...result });
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 LOGIN TEST SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful logins: ${successful.length}`);
  console.log(`❌ Failed logins: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Working Credentials:');
    successful.forEach(r => {
      console.log(`   - ${r.name}: ${r.email} (Role: ${r.user?.role})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Credentials:');
    failed.forEach(r => {
      console.log(`   - ${r.name}: ${r.email} - ${r.error} (${r.status})`);
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  if (successful.length === 0) {
    console.log('   - All login attempts failed - check server status');
    console.log('   - Verify database connection');
    console.log('   - Check if users exist in the remote database');
  } else {
    console.log('   - Use the working credentials for testing');
    console.log('   - The admin user creation might not have worked on remote server');
  }
}

runDebugTest(); 