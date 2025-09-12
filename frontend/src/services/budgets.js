import api from './api';

const budgetService = {
  // Get all budgets
  getBudgets: async (params = {}) => {
    try {
      const response = await api.get('/budgets', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single budget
  getBudget: async (id) => {
    try {
      const response = await api.get(`/budgets/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new budget
  createBudget: async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update budget
  updateBudget: async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete budget
  deleteBudget: async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get budget alerts
  getBudgetAlerts: async () => {
    try {
      const response = await api.get('/budgets/alerts');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default budgetService;