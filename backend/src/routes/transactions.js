import express from 'express';
import { body } from 'express-validator';
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const transactionValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getTransactions)
  .post(transactionValidation, createTransaction);

router.get('/stats', getTransactionStats);

router.route('/:id')
  .get(getTransaction)
  .put(transactionValidation, updateTransaction)
  .delete(deleteTransaction);

export default router;