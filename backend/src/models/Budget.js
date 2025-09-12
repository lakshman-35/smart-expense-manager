import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Budget name is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required']
  },
  spent: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  alertThreshold: {
    type: Number,
    default: 80
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

budgetSchema.virtual('progress').get(function() {
  return (this.spent / this.amount) * 100;
});

budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;