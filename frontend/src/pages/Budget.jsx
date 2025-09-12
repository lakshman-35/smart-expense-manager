import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Target, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Edit3,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import budgetService from '../services/budgets';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Budget = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    category: '',
    period: 'monthly',
    startDate: '',
    endDate: '',
    alertThreshold: '80'
  });

  const categories = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other'];
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  // Early return if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Please log in to view budgets
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be authenticated to access budget management.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Only fetch budgets if user is authenticated
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await budgetService.getBudgets();
      if (response.success) {
        setBudgets(response.budgets);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Please log in to view budgets');
      } else {
        toast.error('Failed to fetch budgets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (budgetData = null) => {
    try {
      const dataToSubmit = budgetData || newBudget;
      const response = await budgetService.createBudget({
        ...dataToSubmit,
        amount: parseFloat(dataToSubmit.amount),
        alertThreshold: parseFloat(dataToSubmit.alertThreshold)
      });

      if (response.success) {
        toast.success('Budget created successfully');
        setShowAddModal(false);
        resetForm();
        fetchBudgets();
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error(error.response?.data?.message || 'Failed to create budget');
    }
  };

  const handleUpdateBudget = async (budgetData = null) => {
    try {
      const dataToSubmit = budgetData || newBudget;
      const response = await budgetService.updateBudget(editingBudget._id, {
        ...dataToSubmit,
        amount: parseFloat(dataToSubmit.amount),
        alertThreshold: parseFloat(dataToSubmit.alertThreshold)
      });

      if (response.success) {
        toast.success('Budget updated successfully');
        setEditingBudget(null);
        resetForm();
        fetchBudgets();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update budget');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await budgetService.deleteBudget(id);
        if (response.success) {
          toast.success('Budget deleted successfully');
          fetchBudgets();
        }
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }
  };

  const resetForm = () => {
    setNewBudget({
      name: '',
      amount: '',
      category: '',
      period: 'monthly',
      startDate: '',
      endDate: '',
      alertThreshold: '80'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-red-500';
    if (progress >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressIcon = (progress) => {
    if (progress >= 100) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (progress >= 80) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  // Calculate budget overview data
  const budgetOverview = budgets.reduce((acc, budget) => {
    const progress = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent; // Calculate remaining properly
    
    acc.totalBudget += budget.amount;
    acc.totalSpent += budget.spent;
    acc.totalRemaining += remaining; // Use calculated remaining
    
    if (progress >= 100) acc.exceeded++;
    else if (progress >= 80) acc.warning++;
    else acc.onTrack++;
    
    return acc;
  }, {
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    exceeded: 0,
    warning: 0,
    onTrack: 0
  });

  const BudgetModal = React.memo(({ isEdit = false }) => {
    // Local state to prevent parent re-renders from affecting inputs
    const [localFormData, setLocalFormData] = useState(newBudget);
    
    // Sync with parent state when modal opens
    useEffect(() => {
      setLocalFormData(newBudget);
    }, [newBudget]);
    
    // Local handlers to prevent re-renders
    const handleLocalNameChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, name: e.target.value }));
    }, []);

    const handleLocalAmountChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, amount: e.target.value }));
    }, []);

    const handleLocalCategoryChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, category: e.target.value }));
    }, []);

    const handleLocalPeriodChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, period: e.target.value }));
    }, []);

    const handleLocalStartDateChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, startDate: e.target.value }));
    }, []);

    const handleLocalEndDateChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, endDate: e.target.value }));
    }, []);

    const handleLocalAlertThresholdChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, alertThreshold: e.target.value }));
    }, []);
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      // Pass the localFormData directly to avoid state update timing issues
      if (isEdit) {
        handleUpdateBudget(localFormData);
      } else {
        handleAddBudget(localFormData);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isEdit ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Budget Name
              </label>
              <input
                type="text"
                value={localFormData.name}
                onChange={handleLocalNameChange}
                className="input-field"
                placeholder="e.g., Monthly Food Budget"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={localFormData.amount}
                  onChange={handleLocalAmountChange}
                  className="input-field"
                  placeholder="0.00"
                  autoComplete="off"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={localFormData.category}
                  onChange={handleLocalCategoryChange}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <select
                value={localFormData.period}
                onChange={handleLocalPeriodChange}
                className="input-field"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFormData.startDate}
                  onChange={handleLocalStartDateChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFormData.endDate}
                  onChange={handleLocalEndDateChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alert Threshold (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={localFormData.alertThreshold}
                onChange={handleLocalAlertThresholdChange}
                className="input-field"
                placeholder="80"
                autoComplete="off"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get notified when you reach this percentage of your budget
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  isEdit ? setEditingBudget(null) : setShowAddModal(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEdit ? 'Update' : 'Create'} Budget
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your spending limits across different categories
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-2 -mt-px" />
          Create Budget
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(budgetOverview.totalBudget)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(budgetOverview.totalSpent)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(budgetOverview.totalRemaining)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Budget Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">On Track</span>
                <span className="text-sm font-medium">{budgetOverview.onTrack}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">Warning</span>
                <span className="text-sm font-medium">{budgetOverview.warning}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Exceeded</span>
                <span className="text-sm font-medium">{budgetOverview.exceeded}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budgets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : budgets.length > 0 ? (
          budgets.map((budget) => {
            const progress = (budget.spent / budget.amount) * 100;
            const progressClamped = Math.min(progress, 100);
            const remaining = budget.amount - budget.spent; // Calculate remaining properly
            
            return (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{budget.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {budget.category} • {budget.period}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getProgressIcon(progress)}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingBudget(budget);
                          setNewBudget({
                            name: budget.name,
                            amount: budget.amount.toString(),
                            category: budget.category,
                            period: budget.period,
                            startDate: new Date(budget.startDate).toISOString().split('T')[0],
                            endDate: new Date(budget.endDate).toISOString().split('T')[0],
                            alertThreshold: budget.alertThreshold.toString()
                          });
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progressClamped}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${
                      progress >= 100 ? 'text-red-600' : progress >= 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {progress.toFixed(1)}% used
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatCurrency(remaining)} left
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets created</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by creating your first budget to track your spending
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Budget
            </button>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      {showAddModal && <BudgetModal />}
      {editingBudget && <BudgetModal isEdit />}
    </div>
  );
};

export default Budget;