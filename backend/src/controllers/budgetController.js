import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';

export const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const budgetData = {
      ...req.body,
      user: req.user._id
    };

    const budget = await Budget.create(budgetData);

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const { active, category } = req.query;
    
    const query = { user: req.user._id };
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }

    const budgets = await Budget.find(query).sort({ createdAt: -1 });

    // Calculate spent amount for each budget
    for (let budget of budgets) {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'expense',
            category: budget.category,
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            },
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      budget.spent = spent.length > 0 ? spent[0].total : 0;
      await budget.save();
    }

    res.status(200).json({
      success: true,
      budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Get recent transactions for this budget category
    const transactions = await Transaction.find({
      user: req.user._id,
      type: 'expense',
      category: budget.category,
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate
      },
      isDeleted: false
    }).sort({ date: -1 }).limit(10);

    res.status(200).json({
      success: true,
      budget,
      recentTransactions: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBudgetAlerts = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
      isActive: true,
      notifications: true
    });

    const alerts = [];

    for (let budget of budgets) {
      const spent = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'expense',
            category: budget.category,
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            },
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const totalSpent = spent.length > 0 ? spent[0].total : 0;
      const progress = (totalSpent / budget.amount) * 100;

      if (progress >= budget.alertThreshold) {
        alerts.push({
          budget: budget,
          progress: Math.round(progress),
          spent: totalSpent,
          remaining: budget.amount - totalSpent,
          type: progress >= 100 ? 'exceeded' : 'warning'
        });
      }
    }

    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};