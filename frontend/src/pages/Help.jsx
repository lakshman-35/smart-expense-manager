import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Star,
  Send,
  Download,
  Video,
  FileText,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    message: '',
    email: ''
  });

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'budgets', label: 'Budgets & Goals', icon: Star },
    { id: 'reports', label: 'Reports', icon: Book },
    { id: 'account', label: 'Account Settings', icon: HelpCircle }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with the Smart Expense Tracker?',
      answer: 'After creating your account, start by adding your first transaction. You can then set up budgets and goals to track your financial progress. The dashboard will automatically update to show your spending patterns.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do I change my currency to Indian Rupees?',
      answer: 'Go to your Profile settings and select "Indian Rupee (₹)" from the Default Currency dropdown. All your transactions and reports will automatically be formatted in INR with proper Indian number formatting.'
    },
    {
      id: 3,
      category: 'transactions',
      question: 'How do I add a new transaction?',
      answer: 'Click the "Add Transaction" button on the Transactions page. Fill in the amount, category, description, and date. You can also specify the payment method and add tags for better organization.'
    },
    {
      id: 4,
      category: 'transactions',
      question: 'Can I edit or delete transactions?',
      answer: 'Yes, you can edit or delete any transaction by clicking the edit or delete icon next to the transaction in your transactions list.'
    },
    {
      id: 5,
      category: 'budgets',
      question: 'How do I set up a budget?',
      answer: 'Go to the Budget page and click "Create Budget". Set your budget amount, select a category, choose the time period (weekly/monthly/yearly), and set alert thresholds to get notified when you approach your limits.'
    },
    {
      id: 6,
      category: 'budgets',
      question: 'How do savings goals work?',
      answer: 'In the Goals section, you can create savings goals by setting a target amount, target date, and optional monthly contribution. The app will track your progress and show you how much you need to save to reach your goal.'
    },
    {
      id: 7,
      category: 'reports',
      question: 'How do I export my financial data?',
      answer: 'You can export your data in PDF or Excel format from the Reports page. The exported files will include all your transactions, summaries, and charts for the selected date range.'
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I change my password?',
      answer: 'Currently, password changes are handled through your profile settings. We recommend using a strong, unique password and enabling two-factor authentication for better security.'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using Smart Expense Tracker',
      duration: '5 min read',
      type: 'article',
      icon: FileText
    },
    {
      title: 'Setting Up Your First Budget',
      description: 'Step-by-step guide to creating and managing budgets',
      duration: '3 min read',
      type: 'article',
      icon: FileText
    },
    {
      title: 'Understanding Reports and Analytics',
      description: 'How to use reports to track your financial health',
      duration: '4 min read',
      type: 'article',
      icon: FileText
    },
    {
      title: 'Mobile App Tutorial',
      description: 'Watch this video to learn mobile app features',
      duration: '8 min watch',
      type: 'video',
      icon: Video
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.category === activeCategory &&
    (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for your feedback! We\'ll review it shortly.');
    setFeedbackForm({ rating: 5, message: '', email: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-gray-600 mt-2">Find answers to your questions and get support</p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center hover:shadow-md transition-shadow cursor-pointer"
        >
          <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
          <button className="btn-primary">Start Chat</button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center hover:shadow-md transition-shadow cursor-pointer"
        >
          <Mail className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-sm text-gray-600 mb-4">Send us an email</p>
          <a href="mailto:support@expensetracker.com" className="btn-secondary">
            Send Email
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center hover:shadow-md transition-shadow cursor-pointer"
        >
          <Phone className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-sm text-gray-600 mb-4">Call us for urgent issues</p>
          <a href="tel:+911234567890" className="btn-secondary">
            Call Now
          </a>
        </motion.div>
      </div>

      {/* Tutorials & Guides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tutorials & Guides</h2>
          <button className="text-blue-600 hover:text-blue-700 inline-flex items-center">
            View All <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorials.map((tutorial, index) => {
            const Icon = tutorial.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tutorial.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600">{tutorial.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{tutorial.duration}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No FAQs found for your search. Try different keywords or browse other categories.</p>
          </div>
        )}
      </motion.div>

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Send Feedback</h2>
        
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                  className={`w-8 h-8 ${
                    star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
              className="input-field"
              rows="4"
              placeholder="Tell us about your experience or suggest improvements..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={feedbackForm.email}
              onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
              className="input-field"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            className="btn-primary inline-flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Feedback
          </button>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-blue-50 border-blue-200"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Still need help?</h3>
          <p className="text-blue-700 mb-4">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="mailto:support@expensetracker.com" className="text-blue-600 hover:text-blue-700 inline-flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              support@expensetracker.com
            </a>
            <a href="tel:+911234567890" className="text-blue-600 hover:text-blue-700 inline-flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              +91 12345 67890
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Help;