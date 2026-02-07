import User from '../models/User.js';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import Goal from '../models/Goal.js';
import { generateToken } from '../middlewares/auth.js';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation Error:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    // Set httpOnly cookie (Lax for same-site localhost dev; Strict can block XHR)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation Error:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    const token = generateToken(user._id);

    // Set httpOnly cookie (Lax for same-site localhost dev; Strict can block XHR)
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        theme: user.theme,
        notifications: user.notifications,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete related data
    await Transaction.deleteMany({ user: user._id });
    await Budget.deleteMany({ user: user._id });
    await Goal.deleteMany({ user: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    // Clear cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0)
    });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        theme: user.theme,
        notifications: user.notifications,
        streak: user.streak,
        badges: user.badges,
        monthlyBudget: user.monthlyBudget
      }
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      currency,
      theme,
      notifications,
      monthlyBudget,
      language,
      dateFormat,
      timeFormat,
      privacy,
      security
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(currency && { currency }),
        ...(theme && { theme }),
        ...(notifications && { notifications }),
        ...(monthlyBudget !== undefined && { monthlyBudget }),
        ...(language && { language }),
        ...(dateFormat && { dateFormat }),
        ...(timeFormat && { timeFormat }),
        ...(privacy && { privacy }),
        ...(security && { security })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        theme: user.theme,
        notifications: user.notifications,
        monthlyBudget: user.monthlyBudget,
        language: user.language,
        dateFormat: user.dateFormat,
        timeFormat: user.timeFormat,
        privacy: user.privacy,
        security: user.security
      }
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const budgets = await Budget.find({ user: req.user._id });
    const transactions = await Transaction.find({ user: req.user._id });
    const goals = await Goal.find({ user: req.user._id });

    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      user: {
        ...user.toObject(),
        password: undefined // Don't export password
      },
      budgets,
      transactions,
      goals
    };

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const importData = async (req, res) => {
  try {
    const { budgets, transactions, goals } = req.body;
    const userId = req.user._id;

    if (budgets && Array.isArray(budgets)) {
      const newBudgets = budgets.map(b => {
        const { _id, user, createdAt, updatedAt, ...rest } = b;
        return { ...rest, user: userId };
      });
      if (newBudgets.length > 0) await Budget.insertMany(newBudgets);
    }

    if (goals && Array.isArray(goals)) {
      const newGoals = goals.map(g => {
        const { _id, user, createdAt, updatedAt, ...rest } = g;
        return { ...rest, user: userId };
      });
      if (newGoals.length > 0) await Goal.insertMany(newGoals);
    }

    if (transactions && Array.isArray(transactions)) {
      const newTransactions = transactions.map(t => {
        const { _id, user, createdAt, updatedAt, ...rest } = t;
        return { ...rest, user: userId };
      });
      if (newTransactions.length > 0) await Transaction.insertMany(newTransactions);
    }

    res.status(200).json({
      success: true,
      message: 'Data imported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};