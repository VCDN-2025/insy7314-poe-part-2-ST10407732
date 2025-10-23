require('dotenv').config();
const fs = require('fs');
const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

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

// ----------------- DATABASE CONNECTION -----------------
mongoose.connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Create HTTPS server
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`🔒 Secure server running at https://localhost:${PORT}`);
    });

    // Optional: redirect all HTTP requests to HTTPS
    http.createServer((req, res) => {
      const redirectUrl = `https://localhost:${PORT}${req.url}`;
      res.writeHead(301, { Location: redirectUrl });
      res.end();
    }).listen(80, () => {
      console.log('🌐 HTTP server redirecting to HTTPS');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
