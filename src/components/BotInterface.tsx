import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
// Remove Lingo.dev since it's for translation, not chat
// import { LingoDotDevEngine } from 'lingo.dev/sdk';
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
  
  // Option 1: Use a simple state for locale (replace with your actual locale logic)
  const [currentLocale, setCurrentLocale] = React.useState('en');
  
  // Option 2: Or get it from browser
  // const currentLocale = navigator.language || 'en';
  
  // Option 3: Or get it from context/props if you have a language context elsewhere
  // const { currentLocale } = useContext(YourLanguageContext);
  
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

  // Smart local AI-like responses (no API needed)
  const sendToLLM = async (message: string) => {
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const input = message.toLowerCase();
    
    // Context-aware responses based on user input
    if (input.includes('how') && (input.includes('domain') || input.includes('search'))) {
      return "To search for domains, simply type your desired domain name in the search box above. I'll show you available options with real-time pricing in multiple currencies. You can also filter by extension (.com, .net, .org, etc.) to find the perfect domain for your project.";
    }
    
    if (input.includes('what') && input.includes('card studio')) {
      return "Card Studio is our powerful design tool for creating social media graphics! You can drag and drop text, images, and shapes, apply gradients and effects, choose from hundreds of templates, and export in various formats. It's perfect for Instagram posts, Facebook covers, Twitter headers, and more.";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
      return "Domain pricing varies by extension: .com domains typically start at $12.99/year, .net at $14.99/year, and country-specific domains vary. You can switch currencies in the header to see prices in MGA, ZAR, USD, EUR, or GBP. We also offer bulk discounts for multiple domains!";
    }
    
    if (input.includes('design') || input.includes('create') || input.includes('make')) {
      return "Great choice! Our Card Studio makes design easy. Start by choosing a template or blank canvas, then customize with your text, colors, and images. Pro tip: Use our gradient text feature and shadow effects to make your designs pop! Need help with a specific design element?";
    }
    
    if (input.includes('save') || input.includes('export') || input.includes('download')) {
      return "You can save your designs to your account (requires sign-in) and export in PNG, JPG, or PDF formats. Saved projects are stored in your dashboard for easy access later. Free users get 5 saves per month, while premium users get unlimited saves and exports.";
    }
    
    if (input.includes('template') || input.includes('example')) {
      return "We have over 500 professionally designed templates! Categories include: Business cards, Social media posts, Event flyers, Logos, Banners, and more. Each template is fully customizable - change colors, fonts, text, and images to match your brand perfectly.";
    }
    
    if (input.includes('account') || input.includes('sign up') || input.includes('register')) {
      return "Creating an account is free and gives you access to save projects, purchase domains, and use premium features. Click 'Sign Up' in the top right corner. You'll get 5 free design saves to start, plus access to our domain management tools.";
    }
    
    if (input.includes('help') || input.includes('tutorial') || input.includes('guide')) {
      return "I can help you with: 🔍 Domain searching and registration, 🎨 Card Studio design tips, 💰 Pricing and billing questions, 📱 Mobile optimization, 🔧 Troubleshooting. What specific area would you like guidance on?";
    }
    
    if (input.includes('mobile') || input.includes('phone') || input.includes('responsive')) {
      return "VibePage works great on mobile! Our Card Studio is touch-optimized for tablets and phones. You can create designs on-the-go, and all templates automatically adjust for different screen sizes. Your designs will look perfect on any device!";
    }
    
    if (input.includes('color') || input.includes('gradient') || input.includes('font')) {
      return "Our design tools include: 🎨 Color picker with hex/RGB support, 🌈 Gradient builder with multiple color stops, 📝 50+ Google Fonts, ✨ Text effects like shadows and outlines, 🖼️ Image filters and adjustments. Everything you need for professional designs!";
    }
    
    // Default contextual response
    return "I'm here to help with VibePage! I can assist with domain searches, Card Studio design tips, pricing information, and account questions. What would you like to know more about? Feel free to ask specific questions about any feature!";
  };

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

    // Try to get LLM response
    const llmResponse = await sendToLLM(inputValue);
    
    if (llmResponse) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: llmResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      // Fallback to static response if LLM fails
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
    
    // Enhanced pattern matching for better responses
    if (input.includes('domain') || input.includes('search')) {
      return 'I can help you search for domains! Try entering a domain name in the search box above, and I\'ll show you available options with pricing in different currencies. Popular extensions include .com, .net, .org, and country-specific ones.';
    }
    
    if (input.includes('card') || input.includes('studio') || input.includes('design')) {
      return 'The Card Studio is perfect for creating social media cards! You can drag and drop elements, customize colors and fonts, add gradient text effects, and create professional-looking cards for your social media. Would you like tips on getting started?';
    }
    
    if (input.includes('save') || input.includes('export') || input.includes('download')) {
      return 'You can save your cards to your account and export them in various formats (PNG, JPG, PDF). Make sure you\'re signed in to save your work permanently. Your saved cards will be available in your dashboard.';
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('currency') || input.includes('payment')) {
      return 'Domain prices vary by extension and registrar. You can change the currency in the header to see prices in MGA, ZAR, USD, EUR, or GBP. Most .com domains start around $10-15/year. We accept major credit cards and PayPal.';
    }
    
    if (input.includes('help') || input.includes('tutorial') || input.includes('guide')) {
      return 'I can help you with: 1) Domain searching and registration, 2) Creating social media cards in Card Studio, 3) Account management and billing, 4) Troubleshooting common issues. What would you like to know more about?';
    }
    
    if (input.includes('social media') || input.includes('instagram') || input.includes('facebook') || input.includes('twitter')) {
      return 'Our Card Studio creates optimized cards for all major social platforms! We have templates for Instagram posts, Facebook covers, Twitter headers, LinkedIn banners, and more. Each template is sized perfectly for the platform.';
    }
    
    if (input.includes('account') || input.includes('login') || input.includes('signup') || input.includes('register')) {
      return 'You can create an account to save your work, manage domains, and access premium features. Click the "Sign Up" button in the top right. Already have an account? Use "Sign In" to access your dashboard.';
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return 'You\'re welcome! I\'m here to help whenever you need assistance with VibePage. Feel free to ask about domains, card creation, or any other questions!';
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return 'Hello! Great to meet you! I\'m your VibePage assistant. I can help you search for domains, create amazing social media cards, or answer any questions about our platform. What would you like to explore today?';
    }
    
    return 'I\'m here to help with domains, card creation, and general questions about VibePage. I can assist with domain searches, Card Studio tutorials, pricing information, and account management. Could you be more specific about what you\'d like assistance with?';
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