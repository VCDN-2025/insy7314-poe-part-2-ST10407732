require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('./app');
const User = require('./models/User'); // make sure path matches your structure

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/payments_portal';

// ----------------- SSL SETUP -----------------
const sslKeyPath = process.env.SSL_KEY || 'ssl/key.pem';
const sslCertPath = process.env.SSL_CERT || 'ssl/cert.pem';

// Verify SSL files exist
if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
  console.error('❌ SSL key or certificate file not found. Please verify paths in .env.');
  process.exit(1);
}

const sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath),
};

// ----------------- SEED ADMIN FUNCTION -----------------
async function seedAdminUser() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = new User({
      fullName: 'System Administrator',
      email: 'admin@bankportal.com',
      idNumber: '0000000000000',
      accountNumber: '999999',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    console.log('🌟 Admin user seeded successfully!');
    console.log('➡️  Email: admin@bankportal.com');
    console.log('➡️  Password: Admin@123');
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  }
}

// ----------------- DATABASE CONNECTION -----------------
mongoose
  .connect(MONGO)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed admin after successful DB connection
    await seedAdminUser();

    // Start HTTPS server
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`🔒 Secure server running at https://localhost:${PORT}`);
    });

    // Optional: Redirect HTTP → HTTPS
    http
      .createServer((req, res) => {
        const redirectUrl = `https://localhost:${PORT}${req.url}`;
        res.writeHead(301, { Location: redirectUrl });
        res.end();
      })
      .listen(80, () => {
        console.log('🌐 HTTP server redirecting to HTTPS');
      });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
