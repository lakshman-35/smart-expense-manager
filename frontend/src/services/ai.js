import api from './api';

const aiService = {
  // Get AI financial insights
  getInsights: async (timeframe = 'month') => {
    try {
      // Mock AI insights for demo
      return {
        success: true,
        insights: [
          {
            type: 'spending_pattern',
            title: 'Spending Pattern Analysis',
            message: 'Your food expenses have increased by 25% this month. Consider meal planning to reduce costs.',
            confidence: 0.85,
            actionable: true,
            actions: ['Create a weekly meal plan', 'Set a food budget limit', 'Track restaurant visits']
          },
          {
            type: 'savings_opportunity',
            title: 'Savings Opportunity',
            message: 'You could save $150/month by switching to a high-yield savings account.',
            confidence: 0.92,
            actionable: true,
            actions: ['Research high-yield accounts', 'Compare interest rates', 'Transfer funds']
          },
          {
            type: 'budget_optimization',
            title: 'Budget Optimization',
            message: 'Your entertainment budget is underutilized. You could reallocate $200 to savings.',
            confidence: 0.78,
            actionable: true,
            actions: ['Adjust budget allocation', 'Increase savings goal', 'Review entertainment spending']
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  },

  // Get spending predictions
  getPredictions: async (category = 'all') => {
    try {
      // Mock predictions for demo
      return {
        success: true,
        predictions: {
          nextMonth: {
            totalSpending: 3200,
            confidence: 0.82,
            breakdown: {
              food: 1200,
              transportation: 600,
              entertainment: 400,
              bills: 800,
              other: 200
            }
          },
          yearEnd: {
            totalSpending: 38400,
            savings: 18000,
            confidence: 0.75
          }
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Analyze transactions for anomalies
  analyzeAnomalies: async (transactions) => {
    try {
      // Mock anomaly detection for demo
      return {
        success: true,
        anomalies: [
          {
            transactionId: '123',
            type: 'unusual_amount',
            message: 'This grocery expense ($450) is 3x your average',
            severity: 'medium',
            suggestion: 'Review if this was a bulk purchase or error'
          },
          {
            transactionId: '124',
            type: 'new_merchant',
            message: 'First time spending at this location',
            severity: 'low',
            suggestion: 'Verify this transaction is legitimate'
          }
        ]
      };
    } catch (error) {
      throw error;
    }
  },

  // Get personalized financial tips
  getTips: async (userProfile) => {
    try {
      const tips = [
        {
          category: 'savings',
          title: 'Automate Your Savings',
          description: 'Set up automatic transfers to save effortlessly',
          impact: 'high',
          difficulty: 'easy'
        },
        {
          category: 'spending',
          title: 'Use the 24-Hour Rule',
          description: 'Wait 24 hours before making non-essential purchases',
          impact: 'medium',
          difficulty: 'easy'
        },
        {
          category: 'budgeting',
          title: 'Try Zero-Based Budgeting',
          description: 'Assign every dollar a purpose in your budget',
          impact: 'high',
          difficulty: 'medium'
        },
        {
          category: 'investing',
          title: 'Start with Index Funds',
          description: 'Low-cost, diversified investing for beginners',
          impact: 'high',
          difficulty: 'medium'
        }
      ];

      return {
        success: true,
        tips: tips.slice(0, 3) // Return 3 random tips
      };
    } catch (error) {
      throw error;
    }
  },

  // Chat with AI assistant
  chat: async (message, conversationHistory = []) => {
    try {
      // Mock AI chat response for demo
      // In a real implementation, this would call an AI service like OpenAI
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      const lowerMessage = message.toLowerCase();
      let response = '';

      if (lowerMessage.includes('spending') || lowerMessage.includes('expenses')) {
        response = `Based on your transaction history, here's your spending analysis:

📊 Top spending categories:
• Food & Dining: $1,200 (35%)
• Transportation: $600 (18%)
• Bills: $800 (24%)

💡 Insight: Your food spending is above average. Consider meal planning to reduce costs by 15-20%.`;
      } else if (lowerMessage.includes('budget')) {
        response = `Your budget analysis:

🎯 Monthly Budget: $3,500
💰 Spent: $2,850 (81%)
⏰ Days remaining: 10

⚠️ You're at 81% of budget with 10 days left. Consider reducing discretionary spending.`;
      } else if (lowerMessage.includes('goal') || lowerMessage.includes('saving')) {
        response = `Your savings goals progress:

🚨 Emergency Fund: $8,500 / $15,000 (57%)
✈️ Vacation: $2,800 / $5,000 (56%)
🚗 New Car: $15,000 / $25,000 (60%)

You're making good progress! Consider increasing your emergency fund contribution by $100/month.`;
      } else {
        response = `I can help you with:
• Spending analysis and insights
• Budget recommendations
• Savings goal tracking
• Financial tips and advice
• Transaction categorization

What would you like to know about your finances?`;
      }

      return {
        success: true,
        response: {
          message: response,
          timestamp: new Date().toISOString(),
          conversationId: 'demo-conversation'
        }
      };
    } catch (error) {
      throw error;
    }
  }
};

export default aiService;