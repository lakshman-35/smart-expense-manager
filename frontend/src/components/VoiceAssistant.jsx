import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VoiceAssistant = ({ onTransactionAdd, isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
      toast.success('Voice assistant is listening...');
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command) => {
    setIsProcessing(true);
    
    try {
      // Parse common voice commands for expense tracking
      const lowerCommand = command.toLowerCase();
      
      // Pattern matching for expense commands
      const expensePatterns = [
        /(?:spent|paid|bought|purchased)\s+\$?(\d+(?:\.\d{2})?)\s+(?:on|for)\s+(.+)/i,
        /(?:add|record)\s+(?:expense|spending)\s+\$?(\d+(?:\.\d{2})?)\s+(?:for|on)\s+(.+)/i,
        /\$?(\d+(?:\.\d{2})?)\s+(?:for|on)\s+(.+)/i
      ];
      
      // Pattern matching for income commands
      const incomePatterns = [
        /(?:received|earned|got)\s+\$?(\d+(?:\.\d{2})?)\s+(?:from|for)\s+(.+)/i,
        /(?:add|record)\s+(?:income|earning)\s+\$?(\d+(?:\.\d{2})?)\s+(?:from|for)\s+(.+)/i
      ];

      let matchedTransaction = null;

      // Try to match expense patterns
      for (const pattern of expensePatterns) {
        const match = lowerCommand.match(pattern);
        if (match) {
          const amount = parseFloat(match[1]);
          const description = match[2].trim();
          const category = categorizeDescription(description);
          
          matchedTransaction = {
            type: 'expense',
            amount,
            description: description,
            category: category,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'cash'
          };
          break;
        }
      }

      // Try to match income patterns if no expense found
      if (!matchedTransaction) {
        for (const pattern of incomePatterns) {
          const match = lowerCommand.match(pattern);
          if (match) {
            const amount = parseFloat(match[1]);
            const description = match[2].trim();
            
            matchedTransaction = {
              type: 'income',
              amount,
              description: description,
              category: 'other',
              date: new Date().toISOString().split('T')[0],
              paymentMethod: 'bank_transfer'
            };
            break;
          }
        }
      }

      if (matchedTransaction) {
        // Add the transaction
        await onTransactionAdd(matchedTransaction);
        
        const responseText = `I've added ${matchedTransaction.type} of $${matchedTransaction.amount} for ${matchedTransaction.description}`;
        speakResponse(responseText);
        toast.success('Transaction added successfully via voice!');
      } else {
        // Handle other queries or provide help
        const responses = [
          "I can help you add expenses and income. Try saying something like 'I spent 50 dollars on groceries' or 'I earned 200 dollars from freelancing'",
          "I didn't understand that command. You can say things like 'Add expense 25 dollars for lunch' or 'Record income 500 dollars from salary'",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        speakResponse(randomResponse);
        toast.info('Voice command not recognized. Try a different phrase.');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speakResponse("Sorry, I encountered an error processing your request");
      toast.error('Error processing voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  const categorizeDescription = (description) => {
    const categories = {
      food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'groceries', 'coffee', 'snack'],
      transportation: ['gas', 'fuel', 'uber', 'taxi', 'bus', 'train', 'parking', 'metro'],
      shopping: ['clothes', 'shopping', 'amazon', 'mall', 'store', 'purchase'],
      entertainment: ['movie', 'game', 'concert', 'show', 'entertainment', 'fun'],
      bills: ['bill', 'electricity', 'water', 'internet', 'phone', 'rent', 'mortgage'],
      healthcare: ['doctor', 'medicine', 'hospital', 'pharmacy', 'health', 'medical'],
      education: ['book', 'course', 'school', 'education', 'learning', 'class']
    };

    const lowerDesc = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voice Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="text-center space-y-6">
          {/* Microphone Button */}
          <div className="relative">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
            
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isProcessing
                ? 'Processing your request...'
                : isListening
                ? 'Listening... Speak now!'
                : 'Tap the microphone to start'
              }
            </p>
            
            {isProcessing && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-800 dark:text-gray-200">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Voice Response Controls */}
          {isSpeaking && (
            <div className="flex items-center justify-center space-x-2">
              <Volume2 className="w-4 h-4 text-green-600 animate-pulse" />
              <span className="text-sm text-green-600">Speaking...</span>
              <button
                onClick={stopSpeaking}
                className="text-red-600 hover:text-red-700"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2 font-medium">
              Try saying:
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 text-left">
              <li>• "I spent 50 dollars on groceries"</li>
              <li>• "Add expense 25 dollars for lunch"</li>
              <li>• "I earned 200 dollars from freelancing"</li>
              <li>• "Record income 500 dollars from salary"</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;