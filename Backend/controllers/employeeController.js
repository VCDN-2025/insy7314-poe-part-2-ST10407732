// Backend/controllers/employeeController.js
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');

// Patterns
const namePattern = /^[A-Za-z ,.'-]{2,100}$/;
const accountPattern = /^\d{6,20}$/;
const idPattern = /^\d{13}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

// CREATE EMPLOYEE/ADMIN
exports.createEmployee = async (req, res) => {
  try {
    const { fullName, email, accountNumber, idNumber, password, role } = req.body;

    console.log('📝 Creating employee:', { fullName, email, role });

    // Validate required fields
    if (!fullName || !email || !accountNumber || !idNumber || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate role
    if (!['employee', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be employee or admin.' });
    }

    // Validate formats
    if (!namePattern.test(fullName)) {
      return res.status(400).json({ error: 'Invalid full name format.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!accountPattern.test(accountNumber)) {
      return res.status(400).json({ error: 'Invalid account number format.' });
    }
    if (!idPattern.test(idNumber)) {
      return res.status(400).json({ error: 'ID number must be 13 digits.' });
    }
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be 8-128 characters with uppercase, lowercase, number, and special character.' 
      });
    }

    // Check if user exists
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { accountNumber }, { idNumber }]
    });

    if (existing) {
      return res.status(409).json({ error: 'User already exists with this email, account number, or ID.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName: validator.escape(fullName),
      email: validator.normalizeEmail(email),
      accountNumber,
      idNumber,
      passwordHash,
      role
    });

    await user.save();

    console.log('✅ Employee created:', user.email);

    return res.status(201).json({ 
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });

  } catch (err) {
    console.error('❌ Create employee error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// LIST ALL EMPLOYEES/ADMINS
exports.listEmployees = async (req, res) => {
  try {
    const users = await User.find({ 
      role: { $in: ['employee', 'admin'] } 
    }).select('-passwordHash').sort({ createdAt: -1 });

    console.log('📋 Listed', users.length, 'employees/admins');

    return res.json({ 
      count: users.length, 
      users 
    });

  } catch (err) {
    console.error('❌ List employees error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { fullName, email, role, isActive } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || !['employee', 'admin'].includes(user.role)) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Update fields if provided and valid
    if (fullName && namePattern.test(fullName)) {
      user.fullName = validator.escape(fullName);
    }
    if (email && validator.isEmail(email)) {
      user.email = validator.normalizeEmail(email);
    }
    if (role && ['employee', 'admin'].includes(role)) {
      user.role = role;
    }
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    console.log('✅ Employee updated:', user.email);

    return res.json({ 
      message: 'Employee updated successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (err) {
    console.error('❌ Update employee error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// DELETE (DEACTIVATE) EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || !['employee', 'admin'].includes(user.role)) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account.' });
    }

    user.isActive = false;
    await user.save();

    console.log('✅ Employee deactivated:', user.email);

    return res.json({ 
      message: 'Employee deactivated successfully.' 
    });

  } catch (err) {
    console.error('❌ Delete employee error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// GET SINGLE EMPLOYEE
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-passwordHash');
    if (!user || !['employee', 'admin'].includes(user.role)) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    return res.json({ user });

  } catch (err) {
    console.error('❌ Get employee error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};