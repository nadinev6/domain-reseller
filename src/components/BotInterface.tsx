import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, Minimize2, Languages } from 'lucide-react';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
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
  
  // Simple language state - no more problematic imports
  const [language, setLanguage] = React.useState('en');
  
  // Initialize Lingo.dev for translation - NOW WITH LANGUAGE DEPENDENCY
  const lingo = React.useMemo(() => {
    const apiKey = import.meta.env.LINGO_API_KEY;
    if (apiKey) {
      return new LingoDotDevEngine({ 
        apiKey,
        locale: language // Pass the current language as locale
      });
    }
    return null;
  }, [language]); // Added language to dependency array

  // Define response templates with keys for translation
  const responseTemplates = {
    domainSearch: "To search for domains, simply type your desired domain name in the search box above. I'll show you available options with real-time pricing in multiple currencies. You can also filter by extension (.com, .net, .org, etc.) to find the perfect domain for your project.",
    cardStudio: "Card Studio is our powerful design tool for creating social media graphics! You can drag and drop text, images, and shapes, apply gradients and effects, choose from hundreds of templates, and export in various formats. It's perfect for Instagram posts, Facebook covers, Twitter headers, and more.",
    pricing: "Domain pricing varies by extension: .com domains typically start at R299/year, .net at R329/year, and country-specific domains vary. You can switch currencies in the header to see prices in MGA, ZAR, USD, EUR, or GBP. We also offer bulk discounts for multiple domains!",
    design: "Great choice! Our Card Studio makes design easy. Start by choosing a template or blank canvas, then customize with your text, colors, and images. Pro tip: Use our gradient text feature and shadow effects to make your designs pop! Need help with a specific design element?",
    saveExport: "You can save your designs to your account (requires sign-in) and export in PNG, JPG, or PDF formats. Saved projects are stored in your dashboard for easy access later. Free users get 5 saves per month, while premium users get unlimited saves and exports.",
    templates: "We have over 500 professionally designed templates! Categories include: Business cards, Social media posts, Event flyers, Logos, Banners, and more. Each template is fully customizable - change colors, fonts, text, and images to match your brand perfectly.",
    account: "Creating an account is free and gives you access to save projects, purchase domains, and use premium features. Click 'Sign Up' in the top right corner. You'll get 5 free design saves to start, plus access to our domain management tools.",
    help: "I can help you with: 🔍 Domain searching and registration, 🎨 Card Studio design tips, 💰 Pricing and billing questions, 📱 Mobile optimization, 🔧 Troubleshooting. What specific area would you like guidance on?",
    mobile: "VibePage works great on mobile! Our Card Studio is touch-optimized for tablets and phones. You can create designs on-the-go, and all templates automatically adjust for different screen sizes. Your designs will look perfect on any device!",
    designTools: "Our design tools include: 🎨 Color picker with hex/RGB support, 🌈 Gradient builder with multiple color stops, 📝 50+ Google Fonts, ✨ Text effects like shadows and outlines, 🖼️ Image filters and adjustments. Everything you need for professional designs!",
    default: "I'm here to help with VibePage! I can assist with domain searches, Card Studio design tips, pricing information, and account questions. What would you like to know more about? Feel free to ask specific questions about any feature!",
    welcome: "Hello! I'm your VibePage assistant. I can help you with domain searches, card creation, and answer questions about your projects. How can I assist you today?",
    thanks: "You're welcome! I'm here to help whenever you need assistance with VibePage. Feel free to ask about domains, card creation, or any other questions!",
    greeting: "Hello! Great to meet you! I'm your VibePage assistant. I can help you search for domains, create amazing social media cards, or answer any questions about our platform. What would you like to explore today?"
  };

  // Function to translate text using Lingo.dev
  const translateText = async (text: string, targetLanguage: string = language) => {
    if (!lingo || targetLanguage === 'en') {
      return text; // Return original if no translation needed
    }

    try {
      const translated = await lingo.localizeObject({
        [text]: text
      }, targetLanguage);
      return translated[text] || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message - UPDATED TO REFRESH WHEN LANGUAGE CHANGES
  useEffect(() => {
    const initializeWelcomeMessage = async () => {
      const welcomeText = await translateText(responseTemplates.welcome);
      setMessages([{
        id: '1',
        type: 'bot',
        content: welcomeText,
        timestamp: new Date()
      }]);
    };

    initializeWelcomeMessage();
  }, [language, lingo]); // Added lingo to dependencies

  // Smart local AI-like responses with translation support
  const sendToLLM = async (message: string) => {
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const input = message.toLowerCase();
    let responseKey = 'default';
    
    // Determine which response template to use
    if (input.includes('how') && (input.includes('domain') || input.includes('search'))) {
      responseKey = 'domainSearch';
    } else if (input.includes('what') && input.includes('card studio')) {
      responseKey = 'cardStudio';
    } else if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
      responseKey = 'pricing';
    } else if (input.includes('design') || input.includes('create') || input.includes('make')) {
      responseKey = 'design';
    } else if (input.includes('save') || input.includes('export') || input.includes('download')) {
      responseKey = 'saveExport';
    } else if (input.includes('template') || input.includes('example')) {
      responseKey = 'templates';
    } else if (input.includes('account') || input.includes('sign up') || input.includes('register')) {
      responseKey = 'account';
    } else if (input.includes('help') || input.includes('tutorial') || input.includes('guide')) {
      responseKey = 'help';
    } else if (input.includes('mobile') || input.includes('phone') || input.includes('responsive')) {
      responseKey = 'mobile';
    } else if (input.includes('color') || input.includes('gradient') || input.includes('font')) {
      responseKey = 'designTools';
    } else if (input.includes('thank') || input.includes('thanks')) {
      responseKey = 'thanks';
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      responseKey = 'greeting';
    }
    
    // Get and translate the response
    const baseResponse = responseTemplates[responseKey as keyof typeof responseTemplates];
    const translatedResponse = await translateText(baseResponse);
    
    return translatedResponse;
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
        content: await getFallbackResponse(inputValue),
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

  const getFallbackResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();
    let responseKey = 'default';
    
    // Enhanced pattern matching for better responses
    if (input.includes('domain') || input.includes('search')) {
      responseKey = 'domainSearch';
    } else if (input.includes('card') || input.includes('studio') || input.includes('design')) {
      responseKey = 'design';
    } else if (input.includes('save') || input.includes('export') || input.includes('download')) {
      responseKey = 'saveExport';
    } else if (input.includes('price') || input.includes('cost') || input.includes('currency') || input.includes('payment')) {
      responseKey = 'pricing';
    } else if (input.includes('help') || input.includes('tutorial') || input.includes('guide')) {
      responseKey = 'help';
    } else if (input.includes('social media') || input.includes('instagram') || input.includes('facebook') || input.includes('twitter')) {
      responseKey = 'cardStudio';
    } else if (input.includes('account') || input.includes('login') || input.includes('signup') || input.includes('register')) {
      responseKey = 'account';
    } else if (input.includes('thank') || input.includes('thanks')) {
      responseKey = 'thanks';
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      responseKey = 'greeting';
    }
    
    const baseResponse = responseTemplates[responseKey as keyof typeof responseTemplates];
    return await translateText(baseResponse);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
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
        <div className="flex items-center space-x-2">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages size={14} className="absolute left-2 text-white/70 pointer-events-none" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="pl-7 pr-3 py-1 text-xs bg-white/20 border border-white/30 rounded text-white focus:outline-none focus:ring-1 focus:ring-white/50 appearance-none cursor-pointer"
            >
              <option value="en" className="text-gray-900">EN</option>
              <option value="fr" className="text-gray-900">FR</option>
              <option value="mg" className="text-gray-900">MG</option>
            </select>
          </div>
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