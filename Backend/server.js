require('dotenv').config();
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/payments_portal';

// Connect to MongoDB
mongoose.connect(MONGO)
  .then(() => {
    console.log('MongoDB connected');

    // Read SSL certificate and key
    const options = {
      key: fs.readFileSync('ssl/key.pem'),
      cert: fs.readFileSync('ssl/cert.pem'),
    };

    // Start HTTPS server
    https.createServer(options, app).listen(PORT, () => {
      console.log(`Server running at https://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
