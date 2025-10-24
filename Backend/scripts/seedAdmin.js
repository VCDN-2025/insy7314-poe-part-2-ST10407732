// Backend/scripts/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('🚀 Starting admin seeding...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@bankportal.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists!');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      
      // Check if password reset requested
      if (process.argv.includes('--reset-password')) {
        const salt = await bcrypt.genSalt(12);
        existingAdmin.passwordHash = await bcrypt.hash('Admin@123', salt);
        await existingAdmin.save();
        console.log('\n🔑 Password reset to: Admin@123\n');
      } else {
        console.log('\n💡 To reset password, run: npm run seed:admin:reset\n');
      }
      
      process.exit(0);
    }

    // Create admin
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Admin@123', salt);

    const admin = new User({
      fullName: 'System Administrator',
      email: 'admin@bankportal.com',
      idNumber: '9999999999999',
      accountNumber: '999999999',
      passwordHash,
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMIN CREATED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@bankportal.com');
    console.log('🔑 Password: Admin@123');
    console.log('👤 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Also create test employee
    const employeeHash = await bcrypt.hash('Employee@123', salt);
    const employee = new User({
      fullName: 'Test Employee',
      email: 'employee@bankportal.com',
      idNumber: '8888888888888',
      accountNumber: '888888888',
      passwordHash: employeeHash,
      role: 'employee',
      isActive: true
    });

    await employee.save();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ EMPLOYEE CREATED SUCCESSFULLY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    employee@bankportal.com');
    console.log('🔑 Password: Employee@123');
    console.log('👤 Role:     employee');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎉 All done!\n');
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedAdmin();