import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Goal name is required']
  },
  description: {
    type: String,
    default: ''
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required']
  },
  category: {
    type: String,
    enum: ['vacation', 'emergency', 'car', 'house', 'education', 'retirement', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  monthlyContribution: {
    type: Number,
    default: 0
  },
  autoSave: {
    type: Boolean,
    default: false
  },
  linkedAccount: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

goalSchema.virtual('progress').get(function() {
  return (this.currentAmount / this.targetAmount) * 100;
});

goalSchema.virtual('remaining').get(function() {
  return this.targetAmount - this.currentAmount;
});

goalSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const target = new Date(this.targetDate);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;