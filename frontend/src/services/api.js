import axios from 'axios';

/**
 * Axios instance with baseURL and interceptors
 * Auto-attaches JWT token from localStorage
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token
API.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    const token = localStorage.getItem('lms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired)
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.config?.method?.toUpperCase(), error.config?.url, error.response?.data?.message || error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
