import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Target, 
  Calendar,
  DollarSign,
  TrendingUp,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Pause,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'other',
    priority: 'medium',
    monthlyContribution: '',
    autoSave: false
  });

  const goalCategories = [
    { value: 'vacation', label: 'Vacation', icon: '✈️' },
    { value: 'emergency', label: 'Emergency Fund', icon: '🆘' },
    { value: 'car', label: 'Car Purchase', icon: '🚗' },
    { value: 'house', label: 'House/Property', icon: '🏠' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'retirement', label: 'Retirement', icon: '👴' },
    { value: 'other', label: 'Other', icon: '🎯' }
  ];

  // Start with no mock data so users see only their own entries
  useEffect(() => {
    setGoals([]);
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      // Mock API call
      const newGoalWithId = {
        ...newGoal,
        _id: Date.now().toString(),
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setGoals([...goals, newGoalWithId]);
      toast.success('Goal created successfully');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const updatedGoals = goals.map(goal =>
        goal._id === editingGoal._id
          ? {
              ...goal,
              ...newGoal,
              targetAmount: parseFloat(newGoal.targetAmount),
              currentAmount: parseFloat(newGoal.currentAmount) || 0,
              monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0
            }
          : goal
      );

      setGoals(updatedGoals);
      toast.success('Goal updated successfully');
      setEditingGoal(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal._id !== id));
      toast.success('Goal deleted successfully');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedGoals = goals.map(goal =>
      goal._id === id ? { ...goal, status: newStatus } : goal
    );
    setGoals(updatedGoals);
    toast.success(`Goal ${newStatus === 'completed' ? 'completed' : newStatus}`);
  };

  const addContribution = (goalId, amount) => {
    const updatedGoals = goals.map(goal =>
      goal._id === goalId
        ? { 
            ...goal, 
            currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount)
          }
        : goal
    );
    setGoals(updatedGoals);
    toast.success(`Added ${formatCurrency(amount)} to goal`);
  };

  const resetForm = () => {
    setNewGoal({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'other',
      priority: 'medium',
      monthlyContribution: '',
      autoSave: false
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR'
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateTimeRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const GoalModal = React.memo(({ isEdit = false }) => {
    // Local state to prevent parent re-renders from affecting inputs
    const [localFormData, setLocalFormData] = useState(newGoal);
    
    // Sync with parent state when modal opens
    useEffect(() => {
      setLocalFormData(newGoal);
    }, [newGoal]);
    
    // Local handlers to prevent re-renders
    const handleLocalNameChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, name: e.target.value }));
    }, []);

    const handleLocalDescriptionChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, description: e.target.value }));
    }, []);

    const handleLocalTargetAmountChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, targetAmount: e.target.value }));
    }, []);

    const handleLocalCurrentAmountChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, currentAmount: e.target.value }));
    }, []);

    const handleLocalTargetDateChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, targetDate: e.target.value }));
    }, []);

    const handleLocalCategoryChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, category: e.target.value }));
    }, []);

    const handleLocalPriorityChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, priority: e.target.value }));
    }, []);

    const handleLocalMonthlyContributionChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, monthlyContribution: e.target.value }));
    }, []);

    const handleLocalAutoSaveChange = useCallback((e) => {
      setLocalFormData(prev => ({ ...prev, autoSave: e.target.checked }));
    }, []);
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      // Update parent state and submit
      setNewGoal(localFormData);
      if (isEdit) {
        handleUpdateGoal(e);
      } else {
        handleAddGoal(e);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isEdit ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={localFormData.name}
                onChange={handleLocalNameChange}
                className="input-field"
                placeholder="e.g., Emergency Fund"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={localFormData.description}
                onChange={handleLocalDescriptionChange}
                className="input-field"
                rows="3"
                placeholder="Describe your goal..."
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={localFormData.targetAmount}
                  onChange={handleLocalTargetAmountChange}
                  className="input-field"
                  placeholder="0.00"
                  autoComplete="off"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={localFormData.currentAmount}
                  onChange={handleLocalCurrentAmountChange}
                  className="input-field"
                  placeholder="0.00"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={localFormData.targetDate}
                onChange={handleLocalTargetDateChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={localFormData.category}
                  onChange={handleLocalCategoryChange}
                  className="input-field"
                >
                  {goalCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={localFormData.priority}
                  onChange={handleLocalPriorityChange}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Contribution (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                value={localFormData.monthlyContribution}
                onChange={handleLocalMonthlyContributionChange}
                className="input-field"
                placeholder="0.00"
                autoComplete="off"
              />
            </div>

            <div className="flex items-center">
              <input
                id="autoSave"
                type="checkbox"
                checked={localFormData.autoSave}
                onChange={handleLocalAutoSaveChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable auto-save from income
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  isEdit ? setEditingGoal(null) : setShowAddModal(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEdit ? 'Update' : 'Create'} Goal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  });

  // Calculate overview stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your financial goals to achieve your dreams
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalGoals}</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedGoals}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Target</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(totalTargetAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Saved</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalSavedAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const timeRemaining = calculateTimeRemaining(goal.targetDate);
            const categoryInfo = goalCategories.find(cat => cat.value === goal.category);
            
            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card card-hover"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{categoryInfo?.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setNewGoal({
                          name: goal.name,
                          description: goal.description,
                          targetAmount: goal.targetAmount.toString(),
                          currentAmount: goal.currentAmount.toString(),
                          targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
                          category: goal.category,
                          priority: goal.priority,
                          monthlyContribution: goal.monthlyContribution.toString(),
                          autoSave: goal.autoSave
                        });
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-blue-600">
                      {progress.toFixed(1)}% complete
                    </span>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {timeRemaining}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    {goal.status === 'active' ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(goal._id, 'paused')}
                          className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                          title="Pause Goal"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        {progress >= 100 && (
                          <button
                            onClick={() => handleStatusChange(goal._id, 'completed')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : goal.status === 'paused' ? (
                      <button
                        onClick={() => handleStatusChange(goal._id, 'active')}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Resume Goal"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                  
                  {goal.status !== 'completed' && (
                    <button
                      onClick={() => {
                        const amount = parseFloat(prompt('Enter contribution amount:', '100'));
                        if (amount && amount > 0) {
                          addContribution(goal._id, amount);
                        }
                      }}
                      className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Add Money
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals created</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by creating your first savings goal
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </button>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      {showAddModal && <GoalModal />}
      {editingGoal && <GoalModal isEdit />}
    </div>
  );
};

export default Goals;