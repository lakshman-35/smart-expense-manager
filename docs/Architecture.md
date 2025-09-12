# Smart Expense Tracker - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend       │    │    Backend      │    │    Database     │
│   React.js       │◄──►│   Node.js       │◄──►│   MongoDB       │
│   Tailwind CSS   │    │   Express.js    │    │   Mongoose      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  External APIs   │    │   AI Services   │    │  File Storage   │
│  - Currency API  │    │  - OpenAI GPT   │    │  - Cloudinary   │
│  - OAuth APIs    │    │  - Speech APIs  │    │  - AWS S3       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Technology Stack

### Frontend
- **Framework**: React.js 18.x
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State Management**: Context API + useReducer
- **Animations**: Framer Motion
- **Voice Recognition**: Web Speech API
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Database ODM**: Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Email**: Nodemailer
- **Scheduling**: node-cron
- **Testing**: Jest + Supertest

### Database
- **Primary Database**: MongoDB
- **Schema Design**: Document-based NoSQL
- **Indexing**: Compound indexes for performance
- **Aggregation**: MongoDB aggregation pipeline
- **Transactions**: ACID transactions for critical operations

### External Integrations
- **AI/ML**: OpenAI GPT-4 API (placeholder)
- **Currency**: Exchange Rate API
- **OAuth**: Google OAuth 2.0
- **File Storage**: Cloudinary / AWS S3
- **OCR**: Tesseract.js
- **Speech**: Web Speech API / Google Speech API

## 📊 Database Schema Design

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  avatar: String,
  googleId: String,
  currency: String (default: 'USD'),
  monthlyBudget: Number,
  theme: String (enum: ['light', 'dark']),
  notifications: {
    budget: Boolean,
    goals: Boolean,
    reports: Boolean
  },
  streak: Number,
  badges: [BadgeSchema],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  amount: Number (required),
  type: String (enum: ['income', 'expense']),
  category: String (indexed),
  subcategory: String,
  description: String (indexed),
  date: Date (indexed),
  paymentMethod: String,
  location: String,
  tags: [String],
  receipt: {
    url: String,
    filename: String
  },
  isRecurring: Boolean,
  recurringData: RecurringSchema,
  currency: String,
  exchangeRate: Number,
  isDeleted: Boolean (soft delete),
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  name: String,
  amount: Number,
  spent: Number (calculated),
  category: String,
  period: String (enum: ['weekly', 'monthly', 'yearly']),
  startDate: Date,
  endDate: Date,
  alertThreshold: Number (percentage),
  isActive: Boolean,
  notifications: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Goal Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  name: String,
  description: String,
  targetAmount: Number,
  currentAmount: Number,
  targetDate: Date,
  category: String,
  priority: String (enum: ['low', 'medium', 'high']),
  status: String (enum: ['active', 'completed', 'paused']),
  monthlyContribution: Number,
  autoSave: Boolean,
  linkedAccount: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 API Architecture

### REST API Endpoints

#### Authentication Routes
```
POST /api/auth/register        - User registration
POST /api/auth/login          - User login
POST /api/auth/logout         - User logout
GET  /api/auth/profile        - Get user profile
PUT  /api/auth/profile        - Update user profile
POST /api/auth/refresh        - Refresh JWT token
POST /api/auth/forgot         - Forgot password
POST /api/auth/reset          - Reset password
```

#### Transaction Routes
```
GET    /api/transactions      - Get user transactions (paginated)
POST   /api/transactions      - Create new transaction
GET    /api/transactions/:id  - Get specific transaction
PUT    /api/transactions/:id  - Update transaction
DELETE /api/transactions/:id  - Delete transaction
GET    /api/transactions/stats- Get transaction statistics
POST   /api/transactions/bulk - Bulk transaction operations
```

#### Budget Routes
```
GET    /api/budgets          - Get user budgets
POST   /api/budgets          - Create new budget
GET    /api/budgets/:id      - Get specific budget
PUT    /api/budgets/:id      - Update budget
DELETE /api/budgets/:id      - Delete budget
GET    /api/budgets/alerts   - Get budget alerts
```

#### Goal Routes
```
GET    /api/goals            - Get user goals
POST   /api/goals            - Create new goal
GET    /api/goals/:id        - Get specific goal
PUT    /api/goals/:id        - Update goal
DELETE /api/goals/:id        - Delete goal
POST   /api/goals/:id/contribute - Add contribution to goal
```

#### AI & Voice Routes
```
POST /api/ai/insights         - Get AI financial insights
POST /api/ai/chat            - Chat with AI assistant
POST /api/ai/categorize      - AI categorization suggestions
POST /api/voice/process      - Process voice commands
POST /api/voice/transcribe   - Transcribe audio to text
```

## 🔒 Security Architecture

### Authentication Flow
```
1. User Login → JWT Token Generated → Stored in httpOnly Cookie
2. Each Request → JWT Verified → User Context Attached
3. Token Expiry → Refresh Token → New JWT Generated
4. Logout → Token Invalidated → Cookie Cleared
```

### Security Measures
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure httpOnly cookies
- **Rate Limiting**: Express rate limit middleware
- **Input Validation**: express-validator
- **SQL Injection**: Mongoose ODM protection
- **XSS Protection**: Helmet.js security headers
- **CORS**: Configured for specific origins
- **HTTPS**: SSL/TLS encryption in production

## 📱 Frontend Architecture

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation component
│   ├── Sidebar.jsx      # Sidebar navigation
│   ├── LoadingSpinner.jsx
│   ├── VoiceAssistant.jsx
│   └── Chatbot.jsx      # AI chatbot component
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Transactions.jsx # Transaction management
│   ├── Budget.jsx       # Budget management
│   ├── Goals.jsx        # Goal tracking
│   ├── Reports.jsx      # Financial reports
│   ├── Profile.jsx      # User profile
│   └── LoginSignup.jsx  # Authentication
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── ThemeContext.jsx # Theme management
├── services/            # API service layers
│   ├── api.js          # Axios configuration
│   ├── auth.js         # Authentication services
│   ├── transactions.js # Transaction services
│   ├── budgets.js      # Budget services
│   ├── ai.js           # AI services
│   └── voice.js        # Voice services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── styles/             # CSS and styling files
```

### State Management Pattern
```javascript
// Using Context API with useReducer for complex state
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
};

// Provider component wraps the entire app
<AuthProvider>
  <App />
</AuthProvider>
```

## 🚀 Deployment Architecture

### Development Environment
```
Frontend: Vite Dev Server (http://localhost:3000)
Backend: Node.js Server (http://localhost:5000)
Database: Local MongoDB instance
```

### Production Environment
```
Frontend: Netlify / Vercel (Static hosting)
Backend: Heroku / AWS EC2 / DigitalOcean
Database: MongoDB Atlas (Cloud)
CDN: Cloudflare
File Storage: AWS S3 / Cloudinary
```

### CI/CD Pipeline
```
1. Code Push → GitHub Repository
2. Automated Tests → Jest + Cypress
3. Build Process → Webpack/Vite Bundle
4. Deploy Frontend → Static Host (Netlify)
5. Deploy Backend → Cloud Platform (Heroku)
6. Database Migration → MongoDB Atlas
7. Health Checks → Application Monitoring
```

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: React.lazy for route-based splitting
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and lazy loading
- **Caching**: Service worker for offline functionality
- **Memoization**: React.memo for expensive components

### Backend Optimizations
- **Database Indexing**: Strategic indexes for query performance
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression for responses
- **Connection Pooling**: MongoDB connection pool optimization
- **Pagination**: Efficient pagination for large datasets

### Database Optimizations
```javascript
// Strategic indexing
db.transactions.createIndex({ user: 1, date: -1 });
db.transactions.createIndex({ user: 1, category: 1 });
db.transactions.createIndex({ user: 1, type: 1, date: -1 });

// Aggregation pipeline optimization
db.transactions.aggregate([
  { $match: { user: userId, date: { $gte: startDate } } },
  { $group: { _id: "$category", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

## 🔄 Data Flow Architecture

### Transaction Creation Flow
```
1. User Input (Form/Voice) → Frontend Validation
2. API Request → Backend Validation → Database Insert
3. Real-time Update → WebSocket/Polling → UI Refresh
4. Analytics Update → Background Job → Reports Update
```

### AI Processing Flow
```
1. User Query → Voice/Text Input → Natural Language Processing
2. Intent Recognition → Command Classification → Action Routing
3. Data Analysis → AI/ML Processing → Insight Generation
4. Response Generation → Text/Voice Output → User Interface
```

This architecture provides a scalable, secure, and maintainable foundation for the Smart Expense Tracker application, supporting all features from basic transaction tracking to advanced AI-powered insights and voice interactions.