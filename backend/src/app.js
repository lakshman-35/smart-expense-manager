import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import testDbRoutes from './routes/test-db.js';



const app = express();
app.use('/api/test-db', testDbRoutes);
app.use(cookieParser());
app.use(helmet());

// Rate limiting (applied AFTER CORS so 429s include CORS headers)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // Much higher limits in dev to avoid noisy 429s
  max: process.env.NODE_ENV === 'production' ? 300 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip preflight and, in dev, skip auth checks entirely
  skip: (req) => {
    if (req.method === 'OPTIONS') return true;
    if (process.env.NODE_ENV !== 'production' && req.path.startsWith('/api/auth')) return true;
    return false;
  },
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Apply limiter after CORS so blocked responses still carry CORS headers
app.use(limiter);

// CORS configuration
// CORS configuration
const isAllowedOrigin = (origin) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
  ].filter(Boolean);

  return (
    !origin ||
    allowedOrigins.includes(origin) ||
    origin.endsWith('.vercel.app') ||
    origin.endsWith('.onrender.com')
  );
};

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Ensure CORS headers are present on all responses (including errors)
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  if (isAllowedOrigin(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Handle preflight for all routes with same CORS policy
app.options('*', cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Apply limiter after CORS so blocked responses still carry CORS headers
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Expense Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;