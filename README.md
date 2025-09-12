# 🏦 Smart Expense Tracker - Full Stack MERN Application

A comprehensive, AI-powered personal finance management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include intelligent spending analysis, voice commands, budget management, savings goals tracking, and detailed financial reporting.

## 🌟 Features

### 🔐 Authentication & Security
- JWT-based authentication with httpOnly cookies
- Google OAuth integration
- Password encryption with bcrypt
- Rate limiting and security headers
- Input validation and sanitization

### 💰 Transaction Management
- Add, edit, delete income/expense transactions
- Smart categorization (Food, Transportation, Shopping, etc.)
- Receipt upload and storage
- Transaction search and filtering
- Bulk operations and CSV import/export
- Recurring transaction setup

### 📊 Smart Analytics Dashboard
- Real-time financial overview
- Interactive charts (Pie, Bar, Line, Area)
- Category-wise spending breakdown
- Monthly/yearly trend analysis
- Budget vs actual comparisons
- Net income calculations

### 🎯 Budget Management
- Create category-specific budgets
- Budget period customization (weekly/monthly/yearly)
- Real-time progress tracking
- Overspending alerts and notifications
- Budget optimization recommendations
- Historical budget analysis

### 🏆 Savings Goals
- Multiple savings goals with progress tracking
- Goal categories (Emergency, Vacation, Car, etc.)
- Visual progress indicators
- Deadline monitoring
- Automatic contribution setup
- Achievement celebrations

### 🤖 AI-Powered Features
- **Smart Insights**: Spending pattern analysis and recommendations
- **AI Chatbot**: Natural language financial queries and advice
- **Expense Prediction**: ML-based spending forecasts
- **Anomaly Detection**: Unusual transaction identification
- **Personalized Tips**: Tailored financial advice

### 🎙️ Voice Assistant
- Voice-to-text transaction entry
- Natural language command processing
- Hands-free expense tracking
- Voice queries about finances
- Multi-language support

### 📈 Advanced Reporting
- Comprehensive financial reports
- PDF and Excel export capabilities
- Email report delivery
- Custom date range analysis
- Category performance metrics
- Financial health scoring

### 🌍 Multi-Currency Support
- Support for 20+ currencies
- Real-time exchange rates
- Currency conversion
- Travel expense tracking
- Multi-currency reporting

### 📱 Modern UI/UX
- Responsive mobile-first design
- Dark/Light mode toggle
- Progressive Web App (PWA)
- Smooth animations with Framer Motion
- Intuitive navigation
- Touch-friendly interfaces

### 🔔 Smart Notifications
- Budget overspending alerts
- Goal milestone notifications
- Bill payment reminders
- Weekly/monthly summaries
- Custom notification preferences

## 🏗️ Technology Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **JavaScript (JSX)** - No TypeScript, pure JS
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Recharts** - Beautiful, composable charts
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Express Validator** - Input validation

### External Services
- **OpenAI API** - AI chat and insights (placeholder)
- **Google OAuth** - Social authentication
- **Exchange Rate API** - Currency conversion
- **Cloudinary** - Image storage and optimization
- **Web Speech API** - Voice recognition

## 📁 Project Structure

```
smart-expense-tracker/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/            # Database and environment configuration
│   │   ├── controllers/       # Business logic (auth, transactions, budgets, etc.)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── middlewares/      # Authentication, error handling
│   │   ├── utils/            # Helper functions
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Server entry point
│   └── package.json
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # React entry point
│   └── package.json
├── docs/                     # Documentation
│   ├── Feature_List.md      # Comprehensive feature list
│   ├── Architecture.md      # System architecture
│   └── API_Documentation.md # API endpoints documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-expense-tracker.git
   cd smart-expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start frontend development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: Default localhost:27017

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/smart-expense-tracker

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# External APIs
EXCHANGE_RATE_API_KEY=your-exchange-rate-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 📊 Key Features Demo

### Smart Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Smart+Dashboard+Screenshot)
- Real-time financial overview
- Interactive charts and graphs
- Budget alerts and goal progress

### AI Assistant
![AI Chat](https://via.placeholder.com/800x400?text=AI+Assistant+Screenshot)
- Natural language financial queries
- Personalized insights and tips
- Voice command support

### Expense Tracking
![Transactions](https://via.placeholder.com/800x400?text=Transaction+Management+Screenshot)
- Quick transaction entry
- Smart categorization
- Advanced filtering and search

## 🤖 AI & Voice Features

### Voice Commands Examples
- "I spent fifty dollars on groceries"
- "Add expense twenty-five dollars for coffee"
- "How much did I spend on food this month?"
- "Show me my budget status"

### AI Insights
- Spending pattern analysis
- Budget optimization suggestions
- Anomaly detection for unusual transactions
- Personalized financial tips

## 📱 Mobile Experience

The application is fully responsive and works seamlessly on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets (iPad/Android tablets)
- 💻 Desktop computers
- 🖥️ Large screens

Progressive Web App (PWA) support allows users to install the app on their devices for a native app experience.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive server-side validation
- **Rate Limiting**: API request throttling
- **HTTPS**: SSL/TLS encryption in production
- **CORS**: Cross-origin request security
- **Helmet.js**: Security headers
- **Data Sanitization**: XSS and injection protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test

# E2E tests (if implemented)
npm run test:e2e
```

## 🚀 Deployment

### Production Deployment

1. **Backend (Heroku/Railway/DigitalOcean)**
   ```bash
   # Build and deploy backend
   npm run build
   npm start
   ```

2. **Frontend (Netlify/Vercel)**
   ```bash
   # Build frontend
   npm run build
   # Deploy dist folder
   ```

3. **Database (MongoDB Atlas)**
   - Set up MongoDB Atlas cluster
   - Update MONGODB_URI in production environment

### Environment Setup
- Configure production environment variables
- Set up SSL certificates
- Configure domain and DNS
- Enable monitoring and logging

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📝 API Documentation

Comprehensive API documentation is available in `/docs/API_Documentation.md` with:
- All endpoint specifications
- Request/response examples
- Authentication requirements
- Error handling
- Rate limiting information

## 🐛 Issue Reporting

Found a bug or have a feature request? Please create an issue with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React.js Team** - For the amazing frontend framework
- **MongoDB** - For the flexible NoSQL database
- **Tailwind CSS** - For the beautiful utility-first CSS
- **Recharts** - For the interactive charting library
- **OpenAI** - For AI capabilities (when integrated)

## 📞 Support

Need help? Reach out to us:
- 📧 Email: support@smartexpensetracker.com
- 💬 Discord: [Join our community](https://discord.gg/smartexpense)
- 📖 Documentation: [Full docs](https://docs.smartexpensetracker.com)

---

**Built with ❤️ by the Smart Expense Tracker Team**

*Helping you achieve financial freedom through intelligent expense tracking and AI-powered insights.*