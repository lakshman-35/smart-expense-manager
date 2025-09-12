# Smart Expense Tracker - API Documentation

## 🔗 Base URL
```
Production: https://api.smartexpensetracker.com
Development: http://localhost:5000/api
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header or as an httpOnly cookie.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

**Cookie Format:**
```
Cookie: jwt=<jwt_token>
```

---

## 🔒 Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "64a7b8c9d1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "currency": "USD",
    "theme": "light"
  }
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters

---

### Login User
Authenticate user and return JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "64a7b8c9d1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "currency": "USD",
    "theme": "light",
    "notifications": {
      "budget": true,
      "goals": true,
      "reports": true
    },
    "streak": 5
  }
}
```

---

### Logout User
Invalidate user session.

**Endpoint:** `POST /auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Get User Profile
Get current user's profile information.

**Endpoint:** `GET /auth/profile`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64a7b8c9d1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "",
    "currency": "USD",
    "theme": "light",
    "notifications": {
      "budget": true,
      "goals": true,
      "reports": true
    },
    "streak": 5,
    "badges": [
      {
        "name": "First Transaction",
        "icon": "🎯",
        "earnedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "monthlyBudget": 3000
  }
}
```

---

### Update User Profile
Update user profile information.

**Endpoint:** `PUT /auth/profile`
**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Smith",
  "currency": "EUR",
  "theme": "dark",
  "notifications": {
    "budget": false,
    "goals": true,
    "reports": true
  },
  "monthlyBudget": 3500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64a7b8c9d1234567890abcde",
    "name": "John Smith",
    "email": "john@example.com",
    "currency": "EUR",
    "theme": "dark",
    "notifications": {
      "budget": false,
      "goals": true,
      "reports": true
    },
    "monthlyBudget": 3500
  }
}
```

---

## 💰 Transaction Endpoints

### Get Transactions
Retrieve user's transactions with pagination and filtering.

**Endpoint:** `GET /transactions`
**Authentication:** Required

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `type`: Filter by type ('income', 'expense', or 'all')
- `category`: Filter by category
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)
- `search`: Search in description and category

**Example:** `GET /transactions?page=1&limit=10&type=expense&category=food`

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "64a7b8c9d1234567890abcdf",
      "amount": 45.50,
      "type": "expense",
      "category": "food",
      "description": "Lunch at restaurant",
      "date": "2024-01-15T12:00:00Z",
      "paymentMethod": "card",
      "location": "Downtown Cafe",
      "tags": ["lunch", "dining"],
      "receipt": {
        "url": "https://example.com/receipts/receipt1.jpg",
        "filename": "receipt1.jpg"
      },
      "currency": "USD",
      "createdAt": "2024-01-15T12:30:00Z",
      "updatedAt": "2024-01-15T12:30:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 47
  }
}
```

---

### Create Transaction
Add a new transaction.

**Endpoint:** `POST /transactions`
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 25.99,
  "type": "expense",
  "category": "food",
  "description": "Coffee and pastry",
  "date": "2024-01-15",
  "paymentMethod": "card",
  "location": "Starbucks",
  "tags": ["coffee", "breakfast"],
  "currency": "USD"
}
```

**Validation Rules:**
- `amount`: Required, positive number
- `type`: Required, 'income' or 'expense'
- `category`: Required string
- `description`: Required, max 200 characters
- `date`: Optional, defaults to current date
- `paymentMethod`: Optional, enum values
- `tags`: Optional array of strings

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "64a7b8c9d1234567890abce0",
    "amount": 25.99,
    "type": "expense",
    "category": "food",
    "description": "Coffee and pastry",
    "date": "2024-01-15T00:00:00Z",
    "paymentMethod": "card",
    "location": "Starbucks",
    "tags": ["coffee", "breakfast"],
    "currency": "USD",
    "user": "64a7b8c9d1234567890abcde",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

---

### Get Single Transaction
Retrieve a specific transaction.

**Endpoint:** `GET /transactions/:id`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "transaction": {
    "_id": "64a7b8c9d1234567890abce0",
    "amount": 25.99,
    "type": "expense",
    "category": "food",
    "description": "Coffee and pastry",
    "date": "2024-01-15T00:00:00Z",
    "paymentMethod": "card",
    "location": "Starbucks",
    "tags": ["coffee", "breakfast"],
    "currency": "USD",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

---

### Update Transaction
Update an existing transaction.

**Endpoint:** `PUT /transactions/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 28.50,
  "description": "Coffee, pastry, and tip",
  "tags": ["coffee", "breakfast", "tip"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "64a7b8c9d1234567890abce0",
    "amount": 28.50,
    "type": "expense",
    "category": "food",
    "description": "Coffee, pastry, and tip",
    "tags": ["coffee", "breakfast", "tip"],
    "updatedAt": "2024-01-15T15:00:00Z"
  }
}
```

---

### Delete Transaction
Delete a transaction (soft delete).

**Endpoint:** `DELETE /transactions/:id`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

### Get Transaction Statistics
Get aggregated transaction statistics.

**Endpoint:** `GET /transactions/stats`
**Authentication:** Required

**Query Parameters:**
- `startDate`: Start date for statistics (ISO format)
- `endDate`: End date for statistics (ISO format)

**Response:**
```json
{
  "success": true,
  "stats": {
    "overview": [
      {
        "_id": "income",
        "total": 4500,
        "count": 2
      },
      {
        "_id": "expense",
        "total": 3200,
        "count": 45
      }
    ],
    "categories": [
      {
        "_id": "food",
        "total": 1200,
        "count": 18
      },
      {
        "_id": "transportation",
        "total": 600,
        "count": 12
      }
    ],
    "monthly": [
      {
        "_id": {
          "year": 2024,
          "month": 1,
          "type": "expense"
        },
        "total": 3200,
        "count": 45
      }
    ]
  }
}
```

---

## 🎯 Budget Endpoints

### Get Budgets
Retrieve user's budgets.

**Endpoint:** `GET /budgets`
**Authentication:** Required

**Query Parameters:**
- `active`: Filter by active status (true/false)
- `category`: Filter by category

**Response:**
```json
{
  "success": true,
  "budgets": [
    {
      "_id": "64a7b8c9d1234567890abce1",
      "name": "Monthly Food Budget",
      "amount": 800,
      "spent": 450,
      "category": "food",
      "period": "monthly",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "alertThreshold": 80,
      "isActive": true,
      "progress": 56.25,
      "remaining": 350,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

---

### Create Budget
Create a new budget.

**Endpoint:** `POST /budgets`
**Authentication:** Required

**Request Body:**
```json
{
  "name": "Transportation Budget",
  "amount": 400,
  "category": "transportation",
  "period": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "alertThreshold": 75
}
```

**Validation Rules:**
- `name`: Required string
- `amount`: Required, positive number
- `category`: Required string
- `startDate`: Required date
- `endDate`: Required date (must be after startDate)
- `alertThreshold`: Optional, 1-100

**Response:**
```json
{
  "success": true,
  "message": "Budget created successfully",
  "budget": {
    "_id": "64a7b8c9d1234567890abce2",
    "name": "Transportation Budget",
    "amount": 400,
    "spent": 0,
    "category": "transportation",
    "period": "monthly",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "alertThreshold": 75,
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

### Update Budget
Update an existing budget.

**Endpoint:** `PUT /budgets/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "amount": 450,
  "alertThreshold": 70
}
```

**Response:**
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "budget": {
    "_id": "64a7b8c9d1234567890abce2",
    "amount": 450,
    "alertThreshold": 70,
    "updatedAt": "2024-01-15T16:00:00Z"
  }
}
```

---

### Delete Budget
Delete a budget.

**Endpoint:** `DELETE /budgets/:id`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

### Get Budget Alerts
Get budget alerts for overspending.

**Endpoint:** `GET /budgets/alerts`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "budget": {
        "_id": "64a7b8c9d1234567890abce1",
        "name": "Monthly Food Budget",
        "amount": 800,
        "category": "food"
      },
      "progress": 87.5,
      "spent": 700,
      "remaining": 100,
      "type": "warning"
    }
  ]
}
```

---

## 🏆 Goal Endpoints

### Get Goals
Retrieve user's savings goals.

**Endpoint:** `GET /goals`
**Authentication:** Required

**Query Parameters:**
- `status`: Filter by status ('active', 'completed', 'paused')
- `category`: Filter by category

**Response:**
```json
{
  "success": true,
  "goals": [
    {
      "_id": "64a7b8c9d1234567890abce3",
      "name": "Emergency Fund",
      "description": "Build 6-month emergency fund",
      "targetAmount": 15000,
      "currentAmount": 8500,
      "targetDate": "2024-12-31T23:59:59Z",
      "category": "emergency",
      "priority": "high",
      "status": "active",
      "monthlyContribution": 500,
      "autoSave": true,
      "progress": 56.67,
      "remaining": 6500,
      "timeRemaining": 289,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T14:30:00Z"
    }
  ]
}
```

---

### Create Goal
Create a new savings goal.

**Endpoint:** `POST /goals`
**Authentication:** Required

**Request Body:**
```json
{
  "name": "Vacation Fund",
  "description": "Save for European vacation",
  "targetAmount": 5000,
  "currentAmount": 0,
  "targetDate": "2024-07-15",
  "category": "vacation",
  "priority": "medium",
  "monthlyContribution": 400,
  "autoSave": false
}
```

**Validation Rules:**
- `name`: Required string
- `targetAmount`: Required, positive number
- `targetDate`: Required date
- `category`: Optional, predefined categories
- `priority`: Optional, 'low'/'medium'/'high'

**Response:**
```json
{
  "success": true,
  "message": "Goal created successfully",
  "goal": {
    "_id": "64a7b8c9d1234567890abce4",
    "name": "Vacation Fund",
    "description": "Save for European vacation",
    "targetAmount": 5000,
    "currentAmount": 0,
    "targetDate": "2024-07-15T00:00:00Z",
    "category": "vacation",
    "priority": "medium",
    "status": "active",
    "monthlyContribution": 400,
    "autoSave": false,
    "createdAt": "2024-01-15T16:00:00Z"
  }
}
```

---

### Update Goal
Update an existing goal.

**Endpoint:** `PUT /goals/:id`
**Authentication:** Required

**Request Body:**
```json
{
  "currentAmount": 1200,
  "monthlyContribution": 450
}
```

**Response:**
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "goal": {
    "_id": "64a7b8c9d1234567890abce4",
    "currentAmount": 1200,
    "monthlyContribution": 450,
    "progress": 24,
    "updatedAt": "2024-01-15T16:30:00Z"
  }
}
```

---

### Delete Goal
Delete a savings goal.

**Endpoint:** `DELETE /goals/:id`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

---

## 🤖 AI & Voice Endpoints

### Get AI Insights
Get AI-powered financial insights.

**Endpoint:** `POST /ai/insights`
**Authentication:** Required

**Request Body:**
```json
{
  "timeframe": "month",
  "categories": ["food", "transportation"],
  "includeRecommendations": true
}
```

**Response:**
```json
{
  "success": true,
  "insights": [
    {
      "type": "spending_pattern",
      "title": "Food Spending Alert",
      "message": "Your food expenses increased 25% this month",
      "confidence": 0.85,
      "actionable": true,
      "actions": [
        "Create weekly meal plans",
        "Set food budget limit",
        "Track restaurant visits"
      ]
    }
  ]
}
```

---

### Chat with AI
Chat with AI financial assistant.

**Endpoint:** `POST /ai/chat`
**Authentication:** Required

**Request Body:**
```json
{
  "message": "How much did I spend on food last month?",
  "conversationId": "conv_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "You spent $1,245 on food last month, which is 15% higher than your average. Your biggest expenses were dining out ($580) and groceries ($665).",
    "timestamp": "2024-01-15T16:45:00Z",
    "conversationId": "conv_123456789"
  }
}
```

---

### Process Voice Command
Process voice commands for financial actions.

**Endpoint:** `POST /voice/process`
**Authentication:** Required

**Request Body:**
```json
{
  "transcript": "I spent fifty dollars on groceries today",
  "confidence": 0.92
}
```

**Response:**
```json
{
  "success": true,
  "action": "transaction_created",
  "data": {
    "transaction": {
      "_id": "64a7b8c9d1234567890abce5",
      "amount": 50,
      "type": "expense",
      "category": "food",
      "description": "groceries",
      "date": "2024-01-15T00:00:00Z"
    }
  },
  "response": "I've added an expense of $50 for groceries to your account."
}
```

---

## 📊 Reports Endpoints

### Generate Report
Generate financial reports.

**Endpoint:** `POST /reports/generate`
**Authentication:** Required

**Request Body:**
```json
{
  "type": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf",
  "categories": ["food", "transportation", "entertainment"]
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "report_123456789",
    "type": "monthly",
    "format": "pdf",
    "downloadUrl": "https://api.example.com/reports/download/report_123456789",
    "generatedAt": "2024-01-15T17:00:00Z",
    "expiresAt": "2024-01-22T17:00:00Z"
  }
}
```

---

### Email Report
Send report via email.

**Endpoint:** `POST /reports/email`
**Authentication:** Required

**Request Body:**
```json
{
  "reportId": "report_123456789",
  "email": "john@example.com",
  "subject": "Monthly Financial Report"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report sent successfully to john@example.com"
}
```

---

## ❌ Error Responses

All endpoints return standardized error responses:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📋 Rate Limiting

API endpoints have rate limiting applied:
- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **AI endpoints**: 20 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642694400
```

---

## 🔧 API Versioning

Current API version: **v1**

All endpoints are prefixed with `/api` and version is implicit. Future versions will be available at `/api/v2`.

---

## 📱 Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [],
  "code": "ERROR_CODE"
}
```