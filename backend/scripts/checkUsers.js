const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUsers() {
  try {
    // List all users with all fields
    const users = await User.find({});
    console.log('Complete user objects in database:');
    console.log(JSON.stringify(users, null, 2));
    
    // Check admin user details with password
    const admin = await User.findOne({ email: 'admin@example.com' }).select('+password');
    console.log('\nAdmin user with password:');
    if (admin) {
      console.log({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        password: admin.password, 
        passwordExists: !!admin.password,
        authType: admin.authType
      });
      
      // Verify the password
      if (admin.password) {
        const isMatch = await bcrypt.compare('123456', admin.password);
        console.log('Password matches "123456":', isMatch);
      }
    } else {
      console.log('Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

// Run the function
checkUsers();
