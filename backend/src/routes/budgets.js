import express from 'express';
import { body } from 'express-validator';
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetAlerts
} from '../controllers/budgetController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Validation rules
const budgetValidation = [
  body('name')
    .notEmpty()
    .withMessage('Budget name is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getBudgets)
  .post(budgetValidation, createBudget);

router.get('/alerts', getBudgetAlerts);

router.route('/:id')
  .get(getBudget)
  .put(budgetValidation, updateBudget)
  .delete(deleteBudget);

export default router;