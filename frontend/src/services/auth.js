import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response?.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export user data
  exportData: async () => {
    try {
      const response = await api.get('/auth/export');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Import user data
  importData: async (data) => {
    try {
      const response = await api.post('/auth/import', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/delete-account');
      localStorage.removeItem('token');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;