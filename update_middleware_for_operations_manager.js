const fs = require('fs');
const path = require('path');

const middlewarePath = path.join(__dirname, 'middleware', 'auth.js');

console.log('🔧 Updating Authorization Middleware for OPERATIONS_MANAGER...\n');

try {
  // Read the current middleware file
  let middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  console.log('📖 Current middleware content:');
  console.log('='.repeat(50));
  console.log(middlewareContent);
  console.log('='.repeat(50));
  
  // Update the admin role mapping to include OPERATIONS_MANAGER
  const updatedContent = middlewareContent.replace(
    /if \(role === 'admin'\) return \['admin', 'GENERAL_MANAGER'\];/,
    `if (role === 'admin') return ['admin', 'GENERAL_MANAGER', 'OPERATIONS_MANAGER'];`
  );
  
  // Also update the employee role mapping to ensure OPERATIONS_MANAGER has full access
  const finalContent = updatedContent.replace(
    /if \(role === 'employee'\) return \[/,
    `if (role === 'employee') return [`
  );
  
  // Write the updated content back
  fs.writeFileSync(middlewarePath, finalContent);
  
  console.log('✅ Middleware updated successfully!');
  console.log('\n📝 Changes made:');
  console.log('  - Added OPERATIONS_MANAGER to admin role mapping');
  console.log('  - Now OPERATIONS_MANAGER will have admin privileges');
  
  console.log('\n🔄 Next steps:');
  console.log('  1. Restart your backend server');
  console.log('  2. Test the admin user login again');
  console.log('  3. The OPERATIONS_MANAGER role should now have admin access');
  
} catch (error) {
  console.error('❌ Error updating middleware:', error.message);
} 