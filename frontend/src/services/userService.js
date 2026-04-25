import API from './api';

/**
 * User service — handles user management API calls
 */
const userService = {
  getUsers: async (params = {}) => {
    const response = await API.get('/users', { params });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  },
};

export default userService;
