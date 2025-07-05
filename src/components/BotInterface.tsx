import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2, Maximize2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTamboState } from '../hooks/useTamboState';
import { z } from 'zod';

// Zod schema for bot interface state
const BotInterfaceStateSchema = z.object({
  isCollapsed: z.boolean(),
  messages: z.array(z.object({
    id: z.string(),
    type: z.enum(['user', 'bot']),
    content: z.string(),
    timestamp: z.date()
  })),
  isTyping: z.boolean()
});

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface BotInterfaceProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const BotInterface: React.FC<BotInterfaceProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your VibePage assistant. I can help you with domain searches, card creation, and answer questions about your projects. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Register component state with Tambo
  useTamboState({
    componentName: 'BotInterface',
    state: {
      isCollapsed,
      messages,
      isTyping
    },
    actions: {
      onToggleCollapse,
      sendMessage: handleSendMessage,
      setInputValue
    },
    schema: BotInterfaceStateSchema
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate bot response (replace with actual Tambo integration)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
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
          <div
            key={message.id}
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
};

export default BotInterface;   