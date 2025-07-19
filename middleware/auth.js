const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Alias for auth function (for compatibility)
const authenticateToken = auth

const authorize = (...roles) => {
  return (req, res, next) => {
    // Map legacy roles to new ones for compatibility
    const effectiveRoles = roles.flatMap(role => {
      if (role === 'admin') return ['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER'];
      if (role === 'employee') return [
        'employee',
        'GENERAL_MANAGER', // <-- Give GENERAL_MANAGER full access as employee
        'CLEARANCE_MANAGER',
        'OPERATIONS_MANAGER',
        'TRANSLATOR',
        'CUSTOMS_BROKER',
        'DRIVER',
        'ACCOUNTANT',
        'DATA_ENTRY',
      ];
      return [role];
    });
    
    // Debug logging
    console.log('Authorization check:');
    console.log('  User role:', req.user.role);
    console.log('  Required roles:', roles);
    console.log('  Effective roles:', effectiveRoles);
    console.log('  Is authorized:', effectiveRoles.includes(req.user.role));
    
    if (!effectiveRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

// New authorizeRole function for array-based role checking
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Map legacy roles to new ones for compatibility
    const effectiveRoles = allowedRoles.flatMap(role => {
      if (role === 'admin') return ['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER'];
      if (role === 'employee') return [
        'employee',
        'GENERAL_MANAGER',
        'CLEARANCE_MANAGER',
        'OPERATIONS_MANAGER',
        'TRANSLATOR',
        'CUSTOMS_BROKER',
        'DRIVER',
        'ACCOUNTANT',
        'DATA_ENTRY',
      ];
      return [role];
    });
    
    // Debug logging
    console.log('Authorization check (authorizeRole):');
    console.log('  User role:', req.user.role);
    console.log('  Required roles:', allowedRoles);
    console.log('  Effective roles:', effectiveRoles);
    console.log('  Is authorized:', effectiveRoles.includes(req.user.role));
    
    if (!effectiveRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      })
    }
    next()
  }
}

module.exports = { auth, authorize, authenticateToken, authorizeRole }
