import api from './api';

const transactionService = {
  // Get all transactions
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single transaction
  getTransaction: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction statistics
  getTransactionStats: async (params = {}) => {
    try {
      const response = await api.get('/transactions/stats', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default transactionService;