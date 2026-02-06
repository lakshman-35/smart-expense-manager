import express from 'express';
import User from '../models/User.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1️⃣ Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'kanakala@123'
    });

    
    await Budget.create({
      user: user._id,
      name: 'Food Budget',
      amount: 1000,
      category: 'Food',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    
    await Goal.create({
      user: user._id,
      name: 'Vacation Fund',
      targetAmount: 5000,
      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    });

    
    await Transaction.create({
      user: user._id,
      amount: 200,
      type: 'expense',
      category: 'Food',
      description: 'Grocery shopping'
    });

    res.json({ message: '✅ Test data inserted. Collections created!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
