const voiceService = {
  // Check if browser supports speech recognition
  isSupported: () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  // Check if browser supports speech synthesis
  isSpeechSupported: () => {
    return 'speechSynthesis' in window;
  },

  // Create speech recognition instance
  createRecognition: () => {
    if (!voiceService.isSupported()) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configuration
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    return recognition;
  },

  // Parse voice commands for financial actions
  parseVoiceCommand: (transcript) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Expense patterns
    const expensePatterns = [
      // "I spent 50 dollars on groceries"
      /(?:i\s+)?(?:spent|paid|bought|purchased)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:on|for)\s+(.+)/i,
      // "Add expense 25 dollars for lunch"
      /(?:add|record)\s+(?:expense|spending)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:for|on)\s+(.+)/i,
      // "50 dollars for coffee"
      /(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:for|on)\s+(.+)/i,
      // "Expense of 30 dollars at restaurant"
      /expense\s+of\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:at|for|on)\s+(.+)/i
    ];

    // Income patterns
    const incomePatterns = [
      // "I received 200 dollars from work"
      /(?:i\s+)?(?:received|earned|got)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:from|for)\s+(.+)/i,
      // "Add income 500 dollars from salary"
      /(?:add|record)\s+(?:income|earning|salary)\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:from|for)\s+(.+)/i,
      // "Income of 1000 dollars from freelancing"
      /income\s+of\s+(?:\$)?(\d+(?:\.\d{2})?)\s+(?:dollars?\s+)?(?:from|for)\s+(.+)/i
    ];

    // Query patterns
    const queryPatterns = [
      {
        pattern: /(?:how much|what|show me).*(?:spent|spending).*(?:this month|month|today)/i,
        type: 'spending_query',
        timeframe: 'month'
      },
      {
        pattern: /(?:what's|show me).*(?:budget|remaining)/i,
        type: 'budget_query'
      },
      {
        pattern: /(?:how are|show me).*(?:goals|savings)/i,
        type: 'goals_query'
      },
      {
        pattern: /(?:give me|what's|show me).*(?:tip|advice|insight)/i,
        type: 'advice_query'
      }
    ];

    // Try to match expense patterns
    for (const pattern of expensePatterns) {
      const match = lowerTranscript.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]);
        const description = match[2].trim();
        
        return {
          type: 'transaction',
          action: 'add_expense',
          data: {
            type: 'expense',
            amount,
            description,
            category: voiceService.categorizeDescription(description),
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'cash'
          },
          confidence: 0.9
        };
      }
    }

    // Try to match income patterns
    for (const pattern of incomePatterns) {
      const match = lowerTranscript.match(pattern);
      if (match) {
        const amount = parseFloat(match[1]);
        const description = match[2].trim();
        
        return {
          type: 'transaction',
          action: 'add_income',
          data: {
            type: 'income',
            amount,
            description,
            category: 'salary',
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'bank_transfer'
          },
          confidence: 0.9
        };
      }
    }

    // Try to match query patterns
    for (const queryPattern of queryPatterns) {
      if (queryPattern.pattern.test(lowerTranscript)) {
        return {
          type: 'query',
          action: queryPattern.type,
          data: {
            timeframe: queryPattern.timeframe
          },
          confidence: 0.8
        };
      }
    }

    // No pattern matched
    return {
      type: 'unknown',
      action: 'help',
      data: {
        originalText: transcript
      },
      confidence: 0.1
    };
  },

  // Categorize description based on keywords
  categorizeDescription: (description) => {
    const categories = {
      food: [
        'food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'groceries', 
        'coffee', 'snack', 'pizza', 'burger', 'sandwich', 'meal', 'eat',
        'starbucks', 'mcdonalds', 'subway', 'dominos', 'kitchen', 'cook'
      ],
      transportation: [
        'gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'parking', 
        'metro', 'flight', 'airline', 'car', 'vehicle', 'transport',
        'toll', 'subway', 'commute'
      ],
      shopping: [
        'clothes', 'shopping', 'amazon', 'mall', 'store', 'purchase',
        'walmart', 'target', 'clothing', 'shoes', 'electronics', 'gadget',
        'online', 'retail'
      ],
      entertainment: [
        'movie', 'cinema', 'game', 'concert', 'show', 'entertainment', 
        'fun', 'netflix', 'spotify', 'music', 'theater', 'sports',
        'hobby', 'recreation'
      ],
      bills: [
        'bill', 'electricity', 'water', 'internet', 'phone', 'rent', 
        'mortgage', 'insurance', 'utility', 'cable', 'subscription',
        'payment', 'monthly'
      ],
      healthcare: [
        'doctor', 'medicine', 'hospital', 'pharmacy', 'health', 'medical',
        'dentist', 'clinic', 'prescription', 'treatment', 'wellness'
      ],
      education: [
        'book', 'course', 'school', 'education', 'learning', 'class',
        'tuition', 'student', 'university', 'college', 'training'
      ]
    };

    const lowerDesc = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  },

  // Text-to-speech
  speak: (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!voiceService.isSpeechSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 0.8;
      utterance.lang = options.lang || 'en-US';

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      speechSynthesis.speak(utterance);
    });
  },

  // Stop current speech
  stopSpeaking: () => {
    if (voiceService.isSpeechSupported()) {
      speechSynthesis.cancel();
    }
  },

  // Get available voices
  getVoices: () => {
    if (!voiceService.isSpeechSupported()) {
      return [];
    }
    return speechSynthesis.getVoices();
  },

  // Generate response text for voice commands
  generateResponse: (commandResult, additionalData = {}) => {
    switch (commandResult.action) {
      case 'add_expense':
        return `I've added an expense of $${commandResult.data.amount} for ${commandResult.data.description}. This has been categorized as ${commandResult.data.category}.`;
      
      case 'add_income':
        return `I've recorded income of $${commandResult.data.amount} from ${commandResult.data.description}.`;
      
      case 'spending_query':
        return `Based on your transactions, you've spent $${additionalData.totalSpent || 0} this month. Your top category is ${additionalData.topCategory || 'food'}.`;
      
      case 'budget_query':
        return `You have $${additionalData.remaining || 0} remaining in your budget this month. You've used ${additionalData.percentUsed || 0}% of your allocated budget.`;
      
      case 'goals_query':
        return `You have ${additionalData.activeGoals || 0} active savings goals. Your emergency fund is ${additionalData.emergencyProgress || 0}% complete.`;
      
      case 'advice_query':
        return `Here's a tip: ${additionalData.tip || 'Consider using the 50-30-20 budgeting rule to manage your finances better.'}`;
      
      case 'help':
      default:
        return `I can help you add expenses and income using voice commands. Try saying something like "I spent 50 dollars on groceries" or "Add income 200 dollars from freelancing". You can also ask about your spending, budget, or savings goals.`;
    }
  }
};

export default voiceService;