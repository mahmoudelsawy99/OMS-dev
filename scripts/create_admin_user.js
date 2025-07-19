const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
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
      "supplier" // Add supplier role
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

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'superadmin@pro.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists with email: superadmin@pro.com');
      console.log('Current role:', existingAdmin.role);
      
      // Update the role to admin if it's not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user role to admin');
      }
      
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Admin1234', saltRounds);

    // Create admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'superadmin@pro.com',
      password: hashedPassword,
      phone: '+966501234567',
      role: 'admin',
      address: {
        street: 'Admin Street',
        city: 'Riyadh',
        country: 'Saudi Arabia'
      },
      isActive: true,
      permissions: ['admin']
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: superadmin@pro.com');
    console.log('🔑 Password: Admin1234');
    console.log('👤 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.log('⚠️ User with this email already exists');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser(); 