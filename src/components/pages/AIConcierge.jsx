import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import { aiConciergeService } from '@/services';

const AIConcierge = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickPrompts = [
    {
      text: 'Book a restaurant reservation',
      icon: 'UtensilsCrossed',
      prompt: 'I would like to make a restaurant reservation. Can you help me find available options?'
    },
    {
      text: 'Local recommendations',
      icon: 'MapPin',
      prompt: 'What are some must-see attractions and activities near the hotel?'
    },
    {
      text: 'Room service menu',
      icon: 'Room',
      prompt: 'Can you show me the room service menu and help me place an order?'
    },
    {
      text: 'Spa appointment',
      icon: 'Sparkles',
      prompt: 'I would like to book a spa treatment. What services are available?'
    },
    {
      text: 'Transportation help',
      icon: 'Car',
      prompt: 'I need help with transportation. Can you arrange a car or provide directions?'
    },
    {
      text: 'Event tickets',
      icon: 'Ticket',
      prompt: 'What shows, concerts, or events are happening in the city this week?'
    }
  ];

  useEffect(() => {
    initializeChat();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const session = await aiConciergeService.createSession();
      setSessionId(session.id);
      
      // Welcome message
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'Hello! I\'m your AI Concierge, available 24/7 to assist you with anything you need during your stay. I can help with reservrations, recommendations, room service, and much more. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      toast.error('Failed to initialize AI Concierge');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      const response = await aiConciergeService.sendMessage(sessionId, messageText.trim());
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our human concierge for immediate assistance.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex-shrink-0"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center relative">
            <ApperIcon name="Bot" className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              AI Concierge
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Online and ready to help</span>
            </p>
          </div>
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick requests:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={prompt.icon} className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                      {prompt.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : message.isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm break-words">{message.content}</p>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200 text-xs"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                style={{ 
                  minHeight: '44px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
              />
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              variant="primary"
              size="sm"
              className="px-4 py-3 rounded-lg"
            >
              <ApperIcon name="Send" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIConcierge;