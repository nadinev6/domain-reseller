import React, { useRef, useEffect } from 'react';
import { MessageCircle, Send, Minimize2 } from 'lucide-react';
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

const BotInterface: React.FC<BotInterfaceProps> = ({ isCollapsed, onToggleCollapse }) => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your VibePage assistant. I can help you with domain searches, card creation, pricing information, and answer questions about your projects. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        { text: 'Search domains', action: 'How do I search for domains?' },
        { text: 'Studio help', action: 'How do I use the VibePage Studio?' },
        { text: 'Pricing info', action: 'What are your domain prices?' },
        { text: 'Account help', action: 'How do I manage my account?' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
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

  const getBotResponse = (userInput: string): { content: string; suggestions?: Suggestion[] } => {
    const input = userInput.toLowerCase();
    
    // Domain-related queries
    if (input.includes('domain') && (input.includes('search') || input.includes('find') || input.includes('register'))) {
      return {
        content: 'To search for domains, use the search box on our homepage! Simply enter your desired domain name and I\'ll show you available options with pricing in different currencies. You can also check out our Domains page for detailed pricing information.',
        suggestions: [
          { text: 'View domain pricing', action: 'Show me domain pricing' },
          { text: 'Popular TLDs', action: 'What are the most popular domain extensions?' },
          { text: 'Domain transfer', action: 'How do I transfer a domain?' }
        ]
      };
    }

    if (input.includes('domain') && (input.includes('price') || input.includes('cost') || input.includes('pricing'))) {
      return {
        content: 'Our domain prices vary by extension and are displayed in multiple currencies (ZAR, USD, EUR, MGA, GBP). Popular options include .co.za (R99), .com (R299), and .org (R189). Check our Domains page for the complete pricing list with registration, transfer, and renewal costs.',
        suggestions: [
          { text: 'View all prices', action: 'Show me the complete domain pricing list' },
          { text: 'Currency options', action: 'What currencies do you support?' },
          { text: 'Renewal costs', action: 'How much does domain renewal cost?' }
        ]
      };
    }

    if (input.includes('domain') && (input.includes('transfer') || input.includes('move'))) {
      return {
        content: 'Domain transfers are easy with VibePage! The process typically takes 5-7 days. You\'ll need your domain\'s authorization code from your current registrar. Transfer pricing varies by TLD - check our pricing table for specific costs.',
        suggestions: [
          { text: 'Transfer requirements', action: 'What do I need to transfer a domain?' },
          { text: 'Transfer timeline', action: 'How long does domain transfer take?' },
          { text: 'Transfer pricing', action: 'How much does domain transfer cost?' }
        ]
      };
    }

    // Card Studio queries
    if (input.includes('page') && (input.includes('studio') || input.includes('create') || input.includes('design'))) {
      return {
        content: 'The VibePage Studio is perfect for creating social media cards! You can drag and drop elements like text, images, shapes, and buttons. Customize colors, fonts, add gradient text effects, and save your designs. You need to be signed in to access the full editor.',
        suggestions: [
          { text: 'Getting started', action: 'How do I get started with Card Studio?' },
          { text: 'Save designs', action: 'How do I save my card designs?' },
          { text: 'Export options', action: 'Can I export my cards?' }
        ]
      };
    }

    if (input.includes('card') && (input.includes('save') || input.includes('export') || input.includes('download'))) {
      return {
        content: 'You can save your card designs to your account when signed in. Each saved card includes all elements and settings. Export functionality is coming soon! For now, you can take screenshots of your designs or save them to your account for future editing.',
        suggestions: [
          { text: 'View saved cards', action: 'How do I view my saved cards?' },
          { text: 'Edit saved cards', action: 'Can I edit my saved cards?' },
          { text: 'Delete cards', action: 'How do I delete saved cards?' }
        ]
      };
    }

    if (input.includes('gradient') || input.includes('text effect')) {
      return {
        content: 'Our VibePage Studio supports beautiful gradient text effects! Select any text element, enable "Gradient Text" in the properties panel, choose your colors and direction. You can create stunning effects like rainbow text, sunset gradients, or professional brand colors.',
        suggestions: [
          { text: 'Text styling', action: 'What text styling options are available?' },
          { text: 'Color options', action: 'How do I change text colors?' },
          { text: 'Font options', action: 'What fonts can I use?' }
        ]
      };
    }

    // Account and authentication
    if (input.includes('account') || input.includes('sign') || input.includes('login') || input.includes('register')) {
      return {
        content: 'You can sign up or sign in using the buttons in the header. Creating an account gives you access to the Card Studio editor, saved designs, domain management, and your dashboard. We use secure authentication with email and password.',
        suggestions: [
          { text: 'Account benefits', action: 'What are the benefits of creating an account?' },
          { text: 'Password reset', action: 'How do I reset my password?' },
          { text: 'Account security', action: 'How secure is my account?' }
        ]
      };
    }

    if (input.includes('dashboard') || input.includes('manage')) {
      return {
        content: 'Your dashboard is your control center! Access it from the header when signed in. You can view your domain portfolio, manage saved cards, check billing information, update payment methods, and access support tickets.',
        suggestions: [
          { text: 'Domain management', action: 'How do I manage my domains?' },
          { text: 'Billing info', action: 'Where can I see my billing information?' },
          { text: 'Support tickets', action: 'How do I create a support ticket?' }
        ]
      };
    }

    // Pricing and currency
    if (input.includes('currency') || input.includes('price') && !input.includes('domain')) {
      return {
        content: 'We support multiple currencies: South African Rand (ZAR), US Dollar (USD), Euro (EUR), Malagasy Ariary (MGA), and British Pound (GBP). You can change your currency using the selector in the header. All prices are converted using fixed exchange rates.',
        suggestions: [
          { text: 'Exchange rates', action: 'What are your exchange rates?' },
          { text: 'Payment methods', action: 'What payment methods do you accept?' },
          { text: 'Billing currency', action: 'Can I change my billing currency?' }
        ]
      };
    }

    if (input.includes('payment') || input.includes('billing') || input.includes('checkout')) {
      return {
        content: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely. You can update your payment method in your dashboard. Billing information and invoices are available in the billing section.',
        suggestions: [
          { text: 'Payment security', action: 'How secure are payments?' },
          { text: 'Invoice access', action: 'How do I access my invoices?' },
          { text: 'Payment issues', action: 'I\'m having payment problems' }
        ]
      };
    }

    // Support and help
    if (input.includes('support') || input.includes('help') || input.includes('contact')) {
      return {
        content: 'Need more help? Visit our Support page for live chat, email support, phone assistance, and comprehensive FAQs. Our team is available 24/7 for live chat, and email support responds within 24 hours.',
        suggestions: [
          { text: 'Contact options', action: 'What are my contact options?' },
          { text: 'Live chat', action: 'How do I start a live chat?' },
          { text: 'Phone support', action: 'What are your phone support hours?' }
        ]
      };
    }

    if (input.includes('hours') || input.includes('available') || input.includes('when')) {
      return {
        content: 'Our support hours are: Live Chat (24/7), Email Support (24-hour response), Phone Support (Mon-Fri 9AM-6PM EST, Sat-Sun 10AM-4PM EST). The VibePage platform is available 24/7 for domain searches and card creation.',
        suggestions: [
          { text: 'Emergency support', action: 'Do you have emergency support?' },
          { text: 'Response times', action: 'What are your response times?' },
          { text: 'Time zones', action: 'What time zone are you in?' }
        ]
      };
    }

    // Technical questions
    if (input.includes('browser') || input.includes('compatible') || input.includes('system')) {
      return {
        content: 'VibePage works on all modern browsers including Chrome, Firefox, Safari, and Edge. The Card Studio is optimized for desktop and tablet use. No downloads or plugins required - everything runs in your browser!',
        suggestions: [
          { text: 'Mobile support', action: 'Does VibePage work on mobile?' },
          { text: 'Browser requirements', action: 'What browsers do you support?' },
          { text: 'Performance tips', action: 'How can I improve performance?' }
        ]
      };
    }

    if (input.includes('mobile') || input.includes('phone') || input.includes('tablet')) {
      return {
        content: 'VibePage is fully responsive! You can search domains and browse on mobile devices. The Card Studio works best on tablets and desktops for the full editing experience, but you can view and manage saved cards on any device.',
        suggestions: [
          { text: 'Mobile features', action: 'What features work on mobile?' },
          { text: 'Tablet editing', action: 'Can I edit cards on a tablet?' },
          { text: 'App availability', action: 'Do you have a mobile app?' }
        ]
      };
    }

    // Features and capabilities
    if (input.includes('feature') || input.includes('what can') || input.includes('capabilities')) {
      return {
        content: 'VibePage offers domain registration and management, a powerful Page Studio for social media design, multi-currency pricing, secure authentication, saved designs, responsive templates, and comprehensive support. Everything you need for your online presence!',
        suggestions: [
          { text: 'Domain features', action: 'What domain features do you offer?' },
          { text: 'Design features', action: 'What design features are available?' },
          { text: 'Upcoming features', action: 'What new features are coming?' }
        ]
      };
    }

    if (input.includes('template') || input.includes('example') || input.includes('sample')) {
      return {
        content: 'We offer professional templates for business cards, creative portfolios, and content creator designs. You can start with a template and customize it completely, or create from scratch using our drag-and-drop editor.',
        suggestions: [
          { text: 'Browse templates', action: 'Show me available templates' },
          { text: 'Custom designs', action: 'Can I create custom designs?' },
          { text: 'Template categories', action: 'What template categories do you have?' }
        ]
      };
    }

    // Language and localization
    if (input.includes('language') || input.includes('français') || input.includes('french')) {
      return {
        content: 'VibePage supports English and French! You can switch languages using the language selector in the header. All interface elements, including this chat, will update to your selected language.',
        suggestions: [
          { text: 'Switch language', action: 'How do I change the language?' },
          { text: 'More languages', action: 'Will you add more languages?' },
          { text: 'Translation quality', action: 'How accurate are the translations?' }
        ]
      };
    }

    // Error handling and troubleshooting
    if (input.includes('error') || input.includes('problem') || input.includes('issue') || input.includes('bug')) {
      return {
        content: 'Sorry to hear you\'re experiencing issues! Try refreshing the page first. If problems persist, please contact our support team with details about what you were doing when the error occurred. We\'re here to help!',
        suggestions: [
          { text: 'Common solutions', action: 'What are common solutions to problems?' },
          { text: 'Report bug', action: 'How do I report a bug?' },
          { text: 'Get support', action: 'How do I get technical support?' }
        ]
      };
    }

    if (input.includes('slow') || input.includes('loading') || input.includes('performance')) {
      return {
        content: 'If VibePage is running slowly, try clearing your browser cache, closing other tabs, or switching to a different browser. The Card Studio works best with a stable internet connection. Contact support if issues persist.',
        suggestions: [
          { text: 'Speed tips', action: 'How can I make VibePage faster?' },
          { text: 'Browser cache', action: 'How do I clear my browser cache?' },
          { text: 'System requirements', action: 'What are the system requirements?' }
        ]
      };
    }

    // Greetings and pleasantries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon')) {
      return {
        content: 'Hello! Great to see you on VibePage! I\'m here to help you with anything you need - from finding the perfect domain to creating stunning pages. What would you like to explore today?',
        suggestions: [
          { text: 'Get started', action: 'How do I get started with VibePage?' },
          { text: 'Popular features', action: 'What are your most popular features?' },
          { text: 'Quick tour', action: 'Can you give me a quick tour?' }
        ]
      };
    }

    if (input.includes('thank') || input.includes('thanks')) {
      return {
        content: 'You\'re very welcome! I\'m always here to help. Feel free to ask me anything about domains, card creation, or using VibePage. Have a great day!',
        suggestions: [
          { text: 'More questions', action: 'I have more questions' },
          { text: 'Feedback', action: 'How can I provide feedback?' },
          { text: 'Stay updated', action: 'How do I stay updated on new features?' }
        ]
      };
    }

    // Default response for unrecognized queries
    return {
      content: 'I\'m here to help with VibePage! I can assist you with domain searches, Card Studio features, pricing information, account management, and general questions. Could you be more specific about what you\'d like to know?',
      suggestions: [
        { text: 'Domain help', action: 'Help me with domains' },
        { text: 'Card Studio help', action: 'Help me with Card Studio' },
        { text: 'Account help', action: 'Help me with my account' },
        { text: 'General info', action: 'Tell me about VibePage' }
      ]
    };
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
        {messages?.map((message) => (
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
        )) || []}
        
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