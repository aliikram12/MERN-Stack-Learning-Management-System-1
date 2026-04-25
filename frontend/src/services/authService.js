import API from './api';

/**
 * Auth service — handles register, login, and getMe API calls
 */
const authService = {
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
};

export default authService;
