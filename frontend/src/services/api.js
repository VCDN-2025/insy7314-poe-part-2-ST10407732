// Frontend/src/services/api.js
import axios from 'axios';

// Disable SSL verification for development (remove in production)
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory cache for CSRF token
let csrfToken = null;
let fetchingCsrfPromise = null;

// Function to fetch CSRF token from server
export const fetchCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  if (fetchingCsrfPromise) return fetchingCsrfPromise;

  fetchingCsrfPromise = api.get('/csrf-token', { withCredentials: true })
    .then(res => {
      csrfToken = res.data?.csrfToken;
      fetchingCsrfPromise = null;
      return csrfToken;
    })
    .catch(err => {
      fetchingCsrfPromise = null;
      console.error('CSRF token fetch failed:', err);
      throw err;
    });

  return fetchingCsrfPromise;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    const unsafeMethods = ['post', 'put', 'patch', 'delete'];
    if (unsafeMethods.includes((config.method || '').toLowerCase())) {
      try {
        const token = await fetchCsrfToken();
        if (token) {
          config.headers['X-CSRF-Token'] = token;
        }
      } catch (err) {
        console.error('Failed to fetch CSRF token', err);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION APIs
// ============================================

export const register = async (userData) => {
  return api.post('/auth/register', userData);
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getProtected = async () => {
  return api.get('/protected');
};

// ============================================
// EMPLOYEE MANAGEMENT APIs (Admin Only)
// ============================================

export const createEmployee = async (employeeData) => {
  return api.post('/employees', employeeData);
};

export const listEmployees = async () => {
  return api.get('/employees');
};

export const getEmployee = async (id) => {
  return api.get(`/employees/${id}`);
};

export const updateEmployee = async (id, data) => {
  return api.put(`/employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  return api.delete(`/employees/${id}`);
};

// ============================================
// PAYMENT APIs
// ============================================

// Customer: Create payment
export const createPayment = async (paymentData) => {
  return api.post('/payments', paymentData);
};

// Customer: Get own payments
export const getUserPayments = async () => {
  return api.get('/payments');
};

// Get single payment by ID
export const getPaymentById = async (paymentId) => {
  return api.get(`/payments/${paymentId}`);
};

// Admin/Employee: Get all payments
export const getAllPayments = async () => {
  return api.get('/payments/all');
};

// Employee: Get pending payments
export const getPendingPayments = async () => {
  return api.get('/payments/pending/all');
};

// Employee: Verify payment
export const verifyPayment = async (paymentId) => {
  return api.patch(`/payments/${paymentId}/verify`);
};

// Employee: Complete payment (submit to SWIFT)
export const completePayment = async (paymentId) => {
  return api.patch(`/payments/${paymentId}/complete`);
};

// ============================================
// LEGACY ALIASES (for backward compatibility)
// ============================================

export const registerUser = register;
export const loginUser = login;
export const logoutUser = logout;
export const checkAuth = getProtected;

export default api;