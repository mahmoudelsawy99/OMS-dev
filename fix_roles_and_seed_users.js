const axios = require('axios');

const API_BASE_URL = 'http://31.97.156.49:5001/api';

const users = [
  {
    name: 'Admin User',
    email: 'admin@pro.com',
    password: 'Admin123',
    phone: '+966501234567',
    role: 'admin',
    address: { street: 'Admin St', city: 'Riyadh', country: 'Saudi Arabia' }
  },
  {
    name: 'Employee User',
    email: 'operations@pro.com',
    password: 'Ops123',
    phone: '+966502345678',
    role: 'employee',
    address: { street: 'Employee St', city: 'Jeddah', country: 'Saudi Arabia' }
  },
  {
    name: 'Client User',
    email: 'manager@alpha.com',
    password: 'Alpha123',
    phone: '+966509012345',
    role: 'client',
    address: { street: 'Client St', city: 'Dammam', country: 'Saudi Arabia' }
  }
];

async function deleteUserByEmail(email, adminToken) {
  try {
    // Find user by email
    const res = await axios.get(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const user = res.data.data.find(u => u.email === email);
    if (user) {
      await axios.delete(`${API_BASE_URL}/users/${user._id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`🗑️ Deleted user: ${email}`);
    }
  } catch (err) {
    // Ignore if not found or not authorized
  }
}

async function main() {
  // Try to login as admin (old or new)
  let adminToken = null;
  try {
    const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@pro.com',
      password: 'Admin123'
    });
    adminToken = loginRes.data.token;
    console.log('✅ Logged in as admin for cleanup.');
  } catch (err) {
    console.log('ℹ️ Admin login failed, will try to register new admin.');
  }

  // Delete users if possible
  if (adminToken) {
    for (const user of users) {
      await deleteUserByEmail(user.email, adminToken);
    }
  }

  // Register all users
  for (const user of users) {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, user);
      if (res.data.token) {
        console.log(`✅ Registered user: ${user.email} (role: ${user.role})`);
      }
    } catch (err) {
      if (err.response?.data?.message === 'User already exists') {
        console.log(`ℹ️ User already exists: ${user.email}`);
      } else {
        console.log(`❌ Failed to register user: ${user.email}`, err.response?.data?.message || err.message);
      }
    }
  }
}

main(); 