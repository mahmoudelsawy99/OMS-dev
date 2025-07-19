const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection - you'll need to update this to your remote database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prospeed';

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: [
      "GENERAL_MANAGER",
      "CLEARANCE_MANAGER",
      "OPERATIONS_MANAGER",
      "TRANSLATOR",
      "CUSTOMS_BROKER",
      "DRIVER",
      "ACCOUNTANT",
      "DATA_ENTRY",
      "CLIENT_MANAGER",
      "CLIENT_SUPERVISOR",
      "CLIENT_DATA_ENTRY",
      "SUPPLIER_MANAGER",
      "SUPPLIER_SUPERVISOR",
      "SUPPLIER_DATA_ENTRY",
      "admin", // Add admin role
      "employee", // Add employee role
      "client", // Add client role
      "supplier", // Add supplier role
      "ADMIN" // Add ADMIN role (uppercase)
    ],
    default: "CLIENT_MANAGER",
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "Saudi Arabia" },
  },
  avatar: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  permissions: [
    {
      type: String,
      enum: ["read", "write", "delete", "admin"],
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

async function updateAdminRole() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('⚠️  Make sure you have the correct MONGODB_URI for your remote database!');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@pro.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found with email: admin@pro.com');
      console.log('Available users:');
      const allUsers = await User.find({}, 'name email role');
      allUsers.forEach(user => {
        console.log(`  - ${user.name} (${user.email}): ${user.role}`);
      });
      return;
    }

    console.log('👤 Found admin user:');
    console.log(`  Name: ${adminUser.name}`);
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Current Role: ${adminUser.role}`);
    console.log(`  ID: ${adminUser._id}`);

    // Update the role to admin
    adminUser.role = 'admin';
    adminUser.permissions = ['admin'];
    await adminUser.save();

    console.log('✅ Admin user role updated successfully!');
    console.log(`  New Role: ${adminUser.role}`);
    console.log(`  Permissions: ${adminUser.permissions.join(', ')}`);

    // Verify the update
    const updatedUser = await User.findOne({ email: 'admin@pro.com' });
    console.log('\n🔍 Verification:');
    console.log(`  Role: ${updatedUser.role}`);
    console.log(`  Permissions: ${updatedUser.permissions.join(', ')}`);

  } catch (error) {
    console.error('❌ Error updating admin role:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  Duplicate key error - user might already exist');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Instructions for the user
console.log('📋 INSTRUCTIONS:');
console.log('1. Make sure you have the correct MONGODB_URI in your .env file');
console.log('2. The MONGODB_URI should point to your remote database');
console.log('3. Run this script to update the admin user role');
console.log('4. After running, test the admin login again\n');

// Run the script
updateAdminRole(); 