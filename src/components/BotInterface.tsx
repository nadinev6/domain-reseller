import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { useLanguage } from 'lingo.dev/react-client';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Suggestion {
  text: string;
  action: string;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
}

interface BotInterfaceProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function BotInterface({ isCollapsed, onToggleCollapse }: BotInterfaceProps) {
  const location = useLocation();
  const { currentLocale } = useLanguage();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your VibePage assistant. I can help you with domain searches, card creation, and answer questions about your projects. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Lingo.dev engine
  const lingo = React.useMemo(() => {
    const apiKey = import.meta.env.LINGO_API_KEY;
    if (apiKey) {
      return new LingoDotDevEngine({ apiKey });
    }
    return null;
  }, []);

  // Check if BotInterface should be hidden based on current route
  const shouldHide = location.pathname.startsWith('/card-studio/editor');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (lingo) {
      try {
        // Send message to Lingo.dev LLM for AI response
        const response = await lingo.chat.sendMessage(inputValue, {
          language: currentLocale,
          context: 'You are a helpful assistant for VibePage, a domain registration and social media card creation platform. Help users with domain searches, card creation, and general questions about the platform.',
          maxTokens: 150
        });

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.content || 'I apologize, but I encountered an issue processing your request. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Fallback to static response if AI fails
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: getFallbackResponse(inputValue),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } else {
      // Use fallback response if Lingo.dev is not available
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getFallbackResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.action);
    // Auto-send the suggestion
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('domain') || input.includes('search')) {
      return 'I can help you search for domains! Try entering a domain name in the search box above, and I\'ll show you available options with pricing in different currencies.';
    }
    
    if (input.includes('card') || input.includes('studio') || input.includes('design')) {
      return 'The Card Studio is perfect for creating social media cards! You can drag and drop elements, customize colors and fonts, and even add gradient text effects. Would you like me to guide you through creating your first card?';
    }
    
    if (input.includes('save') || input.includes('export')) {
      return 'You can save your cards to your account and export them when ready. Make sure you\'re signed in to save your work permanently.';
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('currency')) {
      return 'Domain prices vary by extension. You can change the currency in the header, and I\'ll show prices in MGA, ZAR, USD, EUR, or GBP. Most .com domains start around $12.99/year.';
    }
    
    return 'I\'m here to help with domains, card creation, and general questions about VibePage. Could you be more specific about what you\'d like assistance with?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render if on editor pages
  if (shouldHide) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleCollapse}
          className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-96 bg-white border-t md:border-l md:border-t border-gray-200 shadow-lg z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">VibePage Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-white hover:bg-white/20 p-1"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            {/* Render suggestions if present */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="flex justify-start mt-2">
                <div className="max-w-xs lg:max-w-md">
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-700 hover:text-indigo-800"
                      >
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about VibePage..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}