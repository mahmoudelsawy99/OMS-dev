const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prospeed';

// User Schema
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
      "admin",
      "employee",
      "client",
      "supplier",
      "ADMIN"
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

async function fixAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@pro.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found with email: admin@pro.com');
      return;
    }

    console.log('👤 Found admin user:');
    console.log(`  Name: ${adminUser.name}`);
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Current Role: ${adminUser.role}`);
    console.log(`  ID: ${adminUser._id}`);

    // Revert to OPERATIONS_MANAGER (which was working before)
    console.log('\n🔄 Reverting to OPERATIONS_MANAGER role...');
    adminUser.role = 'OPERATIONS_MANAGER';
    adminUser.permissions = ['read', 'write', 'delete'];
    await adminUser.save();

    console.log('✅ Admin user role reverted successfully!');
    console.log(`  New Role: ${adminUser.role}`);
    console.log(`  Permissions: ${adminUser.permissions.join(', ')}`);

    // Verify the update
    const updatedUser = await User.findOne({ email: 'admin@pro.com' });
    console.log('\n🔍 Verification:');
    console.log(`  Role: ${updatedUser.role}`);
    console.log(`  Permissions: ${updatedUser.permissions.join(', ')}`);

    console.log('\n📋 Next Steps:');
    console.log('1. Test login with the reverted role');
    console.log('2. Update the authorization middleware to treat OPERATIONS_MANAGER as admin');
    console.log('3. Restart the backend server');
    console.log('4. Test admin access');

  } catch (error) {
    console.error('❌ Error fixing admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fixAdminUser(); 