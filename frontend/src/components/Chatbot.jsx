import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X,
  TrendingUp,
  PieChart,
  Target,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Chatbot = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage(`Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI financial assistant. I can help you with:

• Analyzing your spending patterns
• Budget recommendations
• Financial insights and tips
• Transaction summaries
• Goal tracking advice

What would you like to know about your finances?`);
      }, 500);
    }
  }, [isOpen, user]);

  const addBotMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      message,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      message,
      timestamp: new Date()
    }]);
  };

  const processMessage = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Simulate AI processing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Simple pattern matching for demo purposes
    if (lowerMessage.includes('spending') || lowerMessage.includes('expenses')) {
      addBotMessage(`Based on your recent activity, here's your spending breakdown:

📊 **Top Categories:**
• Food & Dining: $1,200 (35%)
• Transportation: $600 (18%)
• Shopping: $400 (12%)
• Bills & Utilities: $800 (24%)

💡 **Insight:** You're spending 35% on food. Consider meal planning to reduce costs by 15-20%.`);
    }
    else if (lowerMessage.includes('budget') || lowerMessage.includes('limit')) {
      addBotMessage(`🎯 **Budget Analysis:**

Your current monthly budget: $3,500
Spent so far: $2,850 (81%)
Remaining: $650

⚠️ **Alert:** You're at 81% of your budget with 10 days left in the month. Consider reducing discretionary spending.

**Recommendations:**
• Limit dining out to $100
• Use public transport more
• Review subscription services`);
    }
    else if (lowerMessage.includes('goal') || lowerMessage.includes('saving')) {
      addBotMessage(`🏆 **Savings Goals Progress:**

🚨 Emergency Fund: $8,500 / $15,000 (57%)
✈️ Vacation: $2,800 / $5,000 (56%)
🚗 New Car: $15,000 / $25,000 (60%)

**Next Steps:**
• Increase emergency fund by $200/month
• You're on track for your vacation goal!
• Consider side income for the car fund`);
    }
    else if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      const tips = [
        `💰 **Smart Saving Tip:**
Try the 50/30/20 rule:
• 50% needs (rent, groceries)
• 30% wants (entertainment)
• 20% savings & debt payment

You're currently at 60/25/15 - try shifting 5% from wants to savings!`,
        
        `📈 **Investment Insight:**
You have $1,200 sitting in savings earning 0.5% interest. Consider:
• High-yield savings (3.5% APY)
• Index funds for long-term goals
• Emergency fund in money market account`,
        
        `🔍 **Expense Optimization:**
I noticed recurring subscriptions of $180/month:
• Netflix: $15
• Spotify: $10
• Gym: $50
• Others: $105

Review and cancel unused services to save $50-80/month!`
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      addBotMessage(randomTip);
    }
    else if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
      addBotMessage(`💵 **Income Analysis:**

Monthly Income: $4,500
YTD Income: $27,000

**Income Sources:**
• Salary: $4,000 (89%)
• Freelance: $400 (9%)
• Investments: $100 (2%)

**Suggestion:** Your freelance income is growing! Consider:
• Increasing rates by 15%
• Finding 2 more regular clients
• Setting up a business account`);
    }
    else if (lowerMessage.includes('compare') || lowerMessage.includes('last month')) {
      addBotMessage(`📊 **Month-over-Month Comparison:**

**This Month vs Last Month:**
• Income: $4,500 vs $4,200 (+7% 📈)
• Expenses: $3,200 vs $2,800 (+14% 📉)
• Savings: $1,300 vs $1,400 (-7% ⚠️)

**Key Changes:**
• ⬆️ Food expenses (+$300)
• ⬆️ Transportation (+$100)
• ⬇️ Entertainment (-$50)

**Action:** Focus on meal planning to control food costs.`);
    }
    else if (lowerMessage.includes('debt') || lowerMessage.includes('loan')) {
      addBotMessage(`💳 **Debt Overview:**

Currently, I don't see any active debts in your profile - great job! 🎉

**Debt Prevention Tips:**
• Maintain emergency fund (6 months expenses)
• Use credit cards responsibly (pay full balance)
• Avoid lifestyle inflation as income grows
• Consider debt consolidation if needed in future

Keep up the excellent financial management!`);
    }
    else {
      // Default response
      const responses = [
        `I can help you with financial questions! Try asking about:
• "How's my spending this month?"
• "Show me my budget status"
• "How are my savings goals?"
• "Give me a financial tip"
• "Compare this month to last month"`,
        
        `I'd be happy to help! You can ask me about:
• Your expense categories and trends
• Budget recommendations
• Savings goal progress
• Investment suggestions
• Bill reminders and due dates`,
        
        `Not sure what you're looking for? I can assist with:
• Spending analysis and insights
• Budget optimization tips
• Goal tracking and motivation
• Financial planning advice
• Expense categorization help`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addBotMessage(randomResponse);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const message = inputMessage.trim();
    setInputMessage('');
    addUserMessage(message);
    await processMessage(message);
  };

  const quickActions = [
    { label: "Spending Summary", message: "Show me my spending summary" },
    { label: "Budget Status", message: "How's my budget this month?" },
    { label: "Savings Goals", message: "How are my savings goals?" },
    { label: "Financial Tip", message: "Give me a financial tip" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">AI Financial Assistant</h2>
              <p className="text-sm text-green-600">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'user' ? 'ml-2 bg-blue-500' : 'mr-2 bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {msg.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message */}
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(action.message);
                    handleSendMessage({ preventDefault: () => {} });
                  }}
                  className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your finances..."
              className="flex-1 input-field"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;