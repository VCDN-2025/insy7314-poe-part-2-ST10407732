# International Payment Portal

<div align="center">
  

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=your-project-key&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=your-project-key)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=your-project-key&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=your-project-key)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=your-project-key&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=your-project-key)

*A secure, enterprise-grade banking application for international payments via the SWIFT network*

[Demo Video](https://youtu.be/D6JbAHOqNrA) • [Report Bug](https://github.com/VCDN-2025/insy7314-poe-part-2-ST10407732/issues) • [Request Feature](https://github.com/VCDN-2025/insy7314-poe-part-2-ST10407732/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Security Implementation](#security-implementation)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Code Attribution](#code-attribution)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

The International Payment Portal is a full-stack web application designed for secure international money transfers. Built with React and Node.js, it implements bank-level security measures including SSL/TLS encryption, password hashing, input validation, and comprehensive attack protection.

### Project Objectives

- Provide customers with a secure platform for international payments
- Implement enterprise-grade security measures
- Ensure compliance with banking security standards
- Maintain high code quality through automated testing and scanning

### Video Demonstration

Watch the full demonstration and security walkthrough: [YouTube Demo Video](https://youtu.be/D6JbAHOqNrA)

LINK 
https://youtu.be/D6JbAHOqNrA

---

## Features

### Customer Features
- **Secure Registration** - Multi-factor validation with strong password requirements
- **JWT Authentication** - Token-based authentication with automatic expiration
- **International Payments** - SWIFT network integration for global transfers
- **Payment Dashboard** - Real-time tracking of transaction history
- **Multi-Currency Support** - USD, EUR, GBP, ZAR, JPY, CAD, AUD, CHF
- **Responsive Design** - Mobile-friendly interface

### Security Features
- **SSL/TLS Encryption** - All traffic encrypted with TLS 1.3
- **Password Hashing** - bcrypt with 12 salt rounds
- **Input Validation** - RegEx whitelisting on all inputs
- **Attack Prevention** - XSS, CSRF, SQL Injection, NoSQL Injection protection
- **Rate Limiting** - Brute force and DDoS protection
- **Secure Cookies** - HTTP-only cookies with SameSite strict
- **Account Lockout** - Automatic lockout after failed login attempts

---

## Security Implementation

### 1. Password Security

**Implementation:**
- Algorithm: bcrypt with 12 salt rounds
- Requirements: 8-128 characters, uppercase, lowercase, number, special character
- Validation Pattern: 
  ```javascript
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
  ```

**Code Location:** `Backend/controllers/authController.js`

```javascript
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);
```

### 2. Input Whitelisting

**RegEx Patterns:**
- Full Name: `/^[A-Za-z\s]{2,100}$/` - Letters and spaces only
- ID Number: `/^\d{13}$/` - Exactly 13 digits
- Account Number: `/^\d{10,12}$/` - 10-12 digits
- Currency: `/^[A-Z]{3}$/` - ISO 4217 format
- SWIFT Code: `/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/` - BIC format

**Validation:** Client-side and server-side double validation

**Code Location:** `Backend/controllers/authController.js`, `Backend/controllers/paymentController.js`

### 3. SSL/TLS Encryption

**Implementation:**
- Protocol: HTTPS with TLS 1.3
- Certificate: Self-signed for development, production-ready structure
- Server: Node.js HTTPS module with Express

**Code Location:** `Backend/server.js`

```javascript
const options = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem'),
};
https.createServer(options, app).listen(PORT);
```

### 4. Attack Protection

| Protection | Tool/Method | Status |
|------------|-------------|--------|
| XSS | Helmet + Input Validation | Implemented |
| CSRF | SameSite Cookies + CORS | Implemented |
| SQL Injection | N/A (NoSQL) | N/A |
| NoSQL Injection | Mongoose Validation + Sanitization | Implemented |
| Brute Force | Rate Limiting + Account Lockout | Implemented |
| DDoS | Rate Limiting (100 req/15min) | Implemented |
| Clickjacking | Helmet X-Frame-Options | Implemented |
| Session Hijacking | HTTP-only Cookies + Token Expiry | Implemented |

**Security Middleware:**
```javascript
app.use(helmet());                    // Security headers
app.use(cors({ credentials: true })); // CORS protection
app.use(rateLimit({ max: 100 }));    // Rate limiting
app.use(mongoSanitize());             // NoSQL injection prevention
```

### 5. DevSecOps Pipeline

**CI/CD Workflow:**
- Platform: GitHub Actions
- Triggers: Push to main, Pull requests
- Checks:
  - Code linting (ESLint)
  - Security scanning (SonarCloud)
  - Quality gate enforcement
  - Dependency auditing

**Pipeline Configuration:** `.github/workflows/ci.yml`

**SonarCloud Metrics:**
- Quality Gate: Passed
- Security Rating: A
- Bugs: 0
- Vulnerabilities: 0
- Code Smells: 0

---

## Technology Stack

### Frontend
```
React 18.3.1
React Router 6.28.0
Axios 1.7.9
```

### Backend
```
Node.js 18+
Express 4.21.2
MongoDB + Mongoose
bcryptjs 2.4.3
jsonwebtoken 9.0.2
helmet 8.0.0
express-rate-limit 7.4.1
```

### Development Tools
```
ESLint
SonarCloud
GitHub Actions
OBS Studio (video recording)
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB v4.4 or higher
- npm or yarn
- OpenSSL (for SSL certificates)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VCDN-2025/insy7314-poe-part-2-ST10407732.git
   cd insy7314-poe-part-2-ST10407732
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Generate SSL Certificates**
   ```bash
   mkdir ssl
   openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
   ```

4. **Configure Environment Variables**
   
   Create `Backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   FRONTEND_URL=https://localhost:3000
   NODE_ENV=development
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://localhost:5000/api
   HTTPS=true
   ```

6. **Start MongoDB**
   ```bash
   # If using Docker
   docker run -d -p 27017:27017 mongo:latest
   
   # Or start local MongoDB service
   sudo systemctl start mongod
   ```

7. **Run the Application**
   
   Terminal 1 (Backend):
   ```bash
   cd Backend
   node server.js
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

8. **Access the Application**
   - Frontend: https://localhost:3000
   - Backend API: https://localhost:5000/api

   **Note:** Accept the SSL certificate warning in your browser (for development only)

---

## Architecture

### System Architecture

```
┌─────────────────┐         HTTPS          ┌──────────────────┐
│                 │◄─────────────────────►│                  │
│  React Frontend │      Encrypted         │  Express Backend │
│  (Port 3000)    │      Connection        │  (Port 5000)     │
│                 │                        │                  │
└─────────────────┘                        └────────┬─────────┘
                                                    │
                                                    │ Mongoose
                                                    │
                                           ┌────────▼─────────┐
                                           │                  │
                                           │  MongoDB Atlas   │
                                           │  (Cloud DB)      │
                                           │                  │
                                           └──────────────────┘
```

### Project Structure

```
international-payment-portal/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── paymentController.js   # Payment processing
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── rateLimiter.js         # Rate limiting
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Payment.js             # Payment schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── paymentRoutes.js       # Payment endpoints
│   ├── ssl/
│   │   ├── key.pem                # Private key
│   │   └── cert.pem               # Certificate
│   ├── app.js                     # Express app configuration
│   ├── server.js                  # HTTPS server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # App layout with nav
│   │   │   ├── Login.jsx          # Login component
│   │   │   ├── Register.jsx       # Registration component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── DashboardPage.jsx  # User dashboard
│   │   │   ├── PaymentPage.jsx    # Create payment
│   │   │   └── PaymentsPage.jsx   # Payment history
│   │   ├── services/
│   │   │   └── api.js             # Axios configuration
│   │   └── index.js               # App entry point
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions pipeline
│
└── README.md
```

---

## API Documentation

### Base URL
```
https://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "idNumber": "1234567890123",
  "accountNumber": "1234567890",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "message": "User registered successfully."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "accountNumber": "1234567890",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "accountNumber": "1234567890"
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Logged out successfully."
}
```

### Payment Endpoints

#### Create Payment
```http
POST /payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000.00,
  "currency": "USD",
  "provider": "SWIFT",
  "payeeAccount": "9876543210",
  "swiftCode": "ABCDZAJJXXX"
}

Response: 201 Created
{
  "message": "Payment submitted successfully",
  "paymentId": "...",
  "payment": {
    "amount": 1000,
    "currency": "USD",
    "status": "pending",
    "createdAt": "2025-01-08T..."
  }
}
```

#### Get User Payments
```http
GET /payments
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "count": 5,
  "payments": 
}
```

#### Get Payment by ID
```http
GET /payments/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "payment": 
}
```

---

## Security Features

### Password Requirements
- Minimum 8 characters
- Maximum 128 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### Account Lockout Policy
- Maximum failed attempts: 5
- Lockout duration: 15 minutes
- Automatic unlock after duration

### Token Security
- Algorithm: HS256
- Expiration: 30 minutes
- Storage: HTTP-only cookie + localStorage
- Automatic refresh on activity

### Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 10 requests per 15 minutes
- Payment endpoints: Authenticated users only

---

## Code Attribution

### Course Materials and Tutorials

**Primary Course Repository:**
- VCDN-2025-INSY7314/Hello-INSY7314: https://github.com/VCDN-2025-INSY7314/Hello-INSY7314
- The project structure, SSL implementation, authentication flow, and DevOps pipeline were adapted from course tutorials and examples provided by the instructor
- Specific modules referenced:
  - Module 02: Adding SSL - https://github.com/VCDN-2025-INSY7314/Hello-INSY7314/tree/main/02%20-%20Adding%20SSL
  - Module 03: Adding Authentication with JWT
  - Module 08: Rate Limiting
  - Module 11: Pipelining the API with lint and render deploy - https://github.com/VCDN-2025-INSY7314/Hello-INSY7314/tree/main/11%20-%20Pipelining%20the%20API
  - Module 12: Pipelining with Newman and SonarQube

### Security Implementation References

**Password Hashing:**
- bcrypt documentation: https://www.npmjs.com/package/bcryptjs
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Implementation pattern based on INSY7314 course materials

**SSL/TLS Configuration:**
- Node.js HTTPS documentation: https://nodejs.org/api/https.html
- Mozilla SSL Configuration Generator: https://ssl-config.mozilla.org/
- OpenSSL certificate generation adapted from course Module 02
- Certificate configuration follows INSY7314 tutorial guidelines

**Input Validation:**
- OWASP Input Validation Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- RegEx patterns adapted from OWASP guidelines and course examples

**Attack Prevention:**
- Helmet.js documentation: https://helmetjs.github.io/
- express-rate-limit: https://www.npmjs.com/package/express-rate-limit
- express-mongo-sanitize: https://www.npmjs.com/package/express-mongo-sanitize
- Middleware configuration based on course security modules

**JWT Authentication:**
- jsonwebtoken documentation: https://www.npmjs.com/package/jsonwebtoken
- JWT.io: https://jwt.io/introduction
- Authentication middleware structure from INSY7314 Module 03

**DevSecOps Pipeline:**
- GitHub Actions workflow adapted from INSY7314 Module 11
- SonarCloud integration based on Module 12 guidelines
- ESLint configuration from course standards

**SWIFT Code Standards:**
- ISO 9362 BIC standard for SWIFT codes
- SWIFT network documentation for payment processing flows

### Third-Party Libraries

All third-party libraries are properly attributed in `package.json` files:
- React and React Router (Meta Platforms, Inc.)
- Express.js (Node.js Foundation)
- MongoDB and Mongoose (MongoDB, Inc.)
- All security middleware packages as listed in Technology Stack

---

## Testing

### Run Tests
```bash
cd Backend
npm test
```

---

## Deployment

### Deployment Commands

```bash
# Build frontend
cd frontend
npm run build

# Deploy backend
cd Backend
pm2 start server.js --name payment-portal
pm2 save
```

---

## Contributing

This is an academic project. For improvements or issues:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## Authors

**Student Number:** ST10407732  
**Course:** INSY7314  
**Institution:** Varsity College  
**Year:** 2025

**Student Number:** ST10286777 
**Course:** INSY7314  
**Institution:** Varsity College  
**Year:** 2025

**Student Number:** ST10262825
**Course:** INSY7314  
**Institution:** Varsity College  
**Year:** 2025

**Student Number:** ST10210161 
**Course:** INSY7314  
**Institution:** Varsity College  
**Year:** 2025
**Security Notice:** This application uses self-signed SSL certificates for development. In production, use certificates from a trusted Certificate Authority.

**Banking Notice:** This is a demonstration project for educational purposes. Not intended for actual financial transactions.

---

*Built with security and reliability in mind for international payment processing*
