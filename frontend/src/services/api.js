import axios from "axios";

// Create axios instance with secure defaults
const API = axios.create({
baseURL: process.env.REACT_APP_API_URL || "https://localhost:5000/api",// Use HTTPS in production
  withCredentials: true, // Important: sends HTTP-only cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging and security
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login might be handled by components
      console.log('Unauthorized access - token may be expired');
    } else if (error.response?.status === 423) {
      // Account locked
      console.log('Account locked due to failed attempts');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = (data) => {
  // Sanitize data before sending
  const sanitizedData = {
    fullName: data.fullName?.trim(),
    email: data.email?.trim().toLowerCase(),
    idNumber: data.idNumber?.replace(/\D/g, ''), // Only digits
    accountNumber: data.accountNumber?.replace(/\D/g, ''), // Only digits
    password: data.password
  };
  
  return API.post("/auth/register", sanitizedData);
};

export const loginUser = (data) => {
  // Sanitize login data
  const sanitizedData = {
    accountNumber: data.accountNumber?.replace(/\D/g, ''), // Only digits
    password: data.password
  };
  
  return API.post("/auth/login", sanitizedData);
};

export const logoutUser = () => API.post("/auth/logout");

// Protected routes
export const getProtected = () => API.get("/protected");

// Payment API calls (for future use)
export const createPayment = (data) => API.post("/payments", data);
export const getPayments = () => API.get("/payments");
export const getPayment = (id) => API.get(`/payments/${id}`);

// User profile API calls (for future use)
export const getUserProfile = () => API.get("/user/profile");
export const updateUserProfile = (data) => API.put("/user/profile", data);

export default API;