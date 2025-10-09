// frontend/src/services/api.js
import axios from 'axios';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory cache for CSRF token
let csrfToken = null;
let fetchingCsrfPromise = null;

// Function to fetch CSRF token from server (returns token)
export const fetchCsrfToken = async () => {
  // If we already fetched, return it
  if (csrfToken) return csrfToken;

  // If a fetch is already in progress, reuse the promise
  if (fetchingCsrfPromise) return fetchingCsrfPromise;

  // Start fetch and store promise to prevent parallel fetches
  fetchingCsrfPromise = api.get('/csrf-token', { withCredentials: true })
    .then(res => {
      csrfToken = res.data?.csrfToken;
      fetchingCsrfPromise = null;
      return csrfToken;
    })
    .catch(err => {
      fetchingCsrfPromise = null;
      throw err;
    });

  return fetchingCsrfPromise;
};

// Add request interceptor to include Bearer token + CSRF token for state-changing requests
api.interceptors.request.use(
  async (config) => {
    // Attach Authorization header if token present
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // For unsafe methods, ensure CSRF token header is present
    const unsafeMethods = ['post', 'put', 'patch', 'delete'];
    if (unsafeMethods.includes((config.method || '').toLowerCase())) {
      try {
        const token = await fetchCsrfToken();
        if (token) {
          config.headers['X-CSRF-Token'] = token;
        }
        // else: we'll still send the request; server will reject with 403 if token missing
      } catch (err) {
        // If token fetch fails, let the request proceed (it will likely be rejected by server)
        console.error('Failed to fetch CSRF token', err);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const registerUser = async (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  // Store token if returned
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response;
};

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
  }
};

export const checkAuth = async () => {
  return api.get('/auth/verify');
};

// Payment APIs
export const createPayment = async (paymentData) => {
  return api.post('/payments', paymentData);
};

export const getUserPayments = async () => {
  return api.get('/payments');
};

export const getPaymentById = async (paymentId) => {
  return api.get(`/payments/${paymentId}`);
};

// Employee/Admin APIs (for staff portal)
export const getAllPayments = async () => {
  return api.get('/payments/all');
};

export const verifyPayment = async (paymentId, status) => {
  return api.put(`/payments/${paymentId}/verify`, { status });
};

// Protected route test (optional)
export const getProtected = async () => {
  return api.get('/protected');
};

export default api;
