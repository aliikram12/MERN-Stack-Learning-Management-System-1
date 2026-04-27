import API from './api';

/**
 * Auth service — handles register, login, and getMe API calls
 */
const authService = {
  register: async (userData) => {
    console.log('📤 Frontend: Sending register request to /api/auth/register', userData);
    try {
      const response = await API.post('/auth/register', userData);
      console.log('✅ Frontend: Register response received:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Frontend: Register request failed:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials) => {
    console.log('📤 Frontend: Sending login request to /api/auth/login', { email: credentials.email });
    try {
      const response = await API.post('/auth/login', credentials);
      console.log('✅ Frontend: Login response received:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Frontend: Login request failed:', error.response?.data || error.message);
      throw error;
    }
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
};

export default authService;
