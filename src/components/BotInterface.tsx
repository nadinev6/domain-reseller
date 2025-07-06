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
      content: t('botInterface.initialMessage'),
      timestamp: new Date(),
      suggestions: [
        { text: t('botInterface.suggestions.searchDomains'), action: 'How do I search for domains?' },
        { text: t('botInterface.suggestions.cardStudioHelp'), action: 'How do I use the Card Studio?' },
        { text: t('botInterface.suggestions.pricingInfo'), action: 'What are your domain prices?' },
        { text: t('botInterface.suggestions.accountHelp'), action: 'How do I manage my account?' }
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
        content: t('botInterface.responses.domainSearch'),
        suggestions: [
          { text: t('botInterface.suggestions.viewDomainPricing'), action: 'Show me domain pricing' },
          { text: t('botInterface.suggestions.popularTlds'), action: 'What are the most popular domain extensions?' },
          { text: t('botInterface.suggestions.domainTransfer'), action: 'How do I transfer a domain?' }
        ]
      };
    }

    if (input.includes('domain') && (input.includes('price') || input.includes('cost') || input.includes('pricing'))) {
      return {
        content: t('botInterface.responses.domainPricing'),
        suggestions: [
          { text: t('botInterface.suggestions.viewAllPrices'), action: 'Show me the complete domain pricing list' },
          { text: t('botInterface.suggestions.currencyOptions'), action: 'What currencies do you support?' },
          { text: t('botInterface.suggestions.renewalCosts'), action: 'How much does domain renewal cost?' }
        ]
      };
    }

    if (input.includes('domain') && (input.includes('transfer') || input.includes('move'))) {
      return {
        content: t('botInterface.responses.domainTransfer'),
        suggestions: [
          { text: t('botInterface.suggestions.transferRequirements'), action: 'What do I need to transfer a domain?' },
          { text: t('botInterface.suggestions.transferTimeline'), action: 'How long does domain transfer take?' },
          { text: t('botInterface.suggestions.transferPricing'), action: 'How much does domain transfer cost?' }
        ]
      };
    }

    // Card Studio queries
    if (input.includes('card') && (input.includes('studio') || input.includes('create') || input.includes('design'))) {
      return {
        content: t('botInterface.responses.cardStudio'),
        suggestions: [
          { text: t('botInterface.suggestions.gettingStarted'), action: 'How do I get started with Card Studio?' },
          { text: t('botInterface.suggestions.saveDesigns'), action: 'How do I save my card designs?' },
          { text: t('botInterface.suggestions.exportOptions'), action: 'Can I export my cards?' }
        ]
      };
    }

    if (input.includes('card') && (input.includes('save') || input.includes('export') || input.includes('download'))) {
      return {
        content: t('botInterface.responses.cardSaveExport'),
        suggestions: [
          { text: t('botInterface.suggestions.viewSavedCards'), action: 'How do I view my saved cards?' },
          { text: t('botInterface.suggestions.editSavedCards'), action: 'Can I edit my saved cards?' },
          { text: t('botInterface.suggestions.deleteCards'), action: 'How do I delete saved cards?' }
        ]
      };
    }

    if (input.includes('gradient') || input.includes('text effect')) {
      return {
        content: t('botInterface.responses.gradientText'),
        suggestions: [
          { text: t('botInterface.suggestions.textStyling'), action: 'What text styling options are available?' },
          { text: t('botInterface.suggestions.colorOptions'), action: 'How do I change text colors?' },
          { text: t('botInterface.suggestions.fontOptions'), action: 'What fonts can I use?' }
        ]
      };
    }

    // Account and authentication
    if (input.includes('account') || input.includes('sign') || input.includes('login') || input.includes('register')) {
      return {
        content: t('botInterface.responses.accountAuth'),
        suggestions: [
          { text: t('botInterface.suggestions.accountBenefits'), action: 'What are the benefits of creating an account?' },
          { text: t('botInterface.suggestions.passwordReset'), action: 'How do I reset my password?' },
          { text: t('botInterface.suggestions.accountSecurity'), action: 'How secure is my account?' }
        ]
      };
    }

    if (input.includes('dashboard') || input.includes('manage')) {
      return {
        content: t('botInterface.responses.dashboard'),
        suggestions: [
          { text: t('botInterface.suggestions.domainManagement'), action: 'How do I manage my domains?' },
          { text: t('botInterface.suggestions.billingInfo'), action: 'Where can I see my billing information?' },
          { text: t('botInterface.suggestions.supportTickets'), action: 'How do I create a support ticket?' }
        ]
      };
    }

    // Pricing and currency
    if (input.includes('currency') || (input.includes('price') && !input.includes('domain'))) {
      return {
        content: t('botInterface.responses.currencyPricing'),
        suggestions: [
          { text: t('botInterface.suggestions.exchangeRates'), action: 'What are your exchange rates?' },
          { text: t('botInterface.suggestions.paymentMethods'), action: 'What payment methods do you accept?' },
          { text: t('botInterface.suggestions.billingCurrency'), action: 'Can I change my billing currency?' }
        ]
      };
    }

    if (input.includes('payment') || input.includes('billing') || input.includes('checkout')) {
      return {
        content: t('botInterface.responses.paymentBilling'),
        suggestions: [
          { text: t('botInterface.suggestions.paymentSecurity'), action: 'How secure are payments?' },
          { text: t('botInterface.suggestions.invoiceAccess'), action: 'How do I access my invoices?' },
          { text: t('botInterface.suggestions.paymentIssues'), action: 'I\'m having payment problems' }
        ]
      };
    }

    // Support and help
    if (input.includes('support') || input.includes('help') || input.includes('contact')) {
      return {
        content: t('botInterface.responses.supportHelp'),
        suggestions: [
          { text: t('botInterface.suggestions.contactOptions'), action: 'What are my contact options?' },
          { text: t('botInterface.suggestions.liveChat'), action: 'How do I start a live chat?' },
          { text: t('botInterface.suggestions.phoneSupport'), action: 'What are your phone support hours?' }
        ]
      };
    }

    if (input.includes('hours') || input.includes('available') || input.includes('when')) {
      return {
        content: t('botInterface.responses.hoursAvailability'),
        suggestions: [
          { text: t('botInterface.suggestions.emergencySupport'), action: 'Do you have emergency support?' },
          { text: t('botInterface.suggestions.responseTimes'), action: 'What are your response times?' },
          { text: t('botInterface.suggestions.timeZones'), action: 'What time zone are you in?' }
        ]
      };
    }

    // Technical questions
    if (input.includes('browser') || input.includes('compatible') || input.includes('system')) {
      return {
        content: t('botInterface.responses.browserCompatible'),
        suggestions: [
          { text: t('botInterface.suggestions.mobileSupport'), action: 'Does VibePage work on mobile?' },
          { text: t('botInterface.suggestions.browserRequirements'), action: 'What browsers do you support?' },
          { text: t('botInterface.suggestions.performanceTips'), action: 'How can I improve performance?' }
        ]
      };
    }

    if (input.includes('mobile') || input.includes('phone') || input.includes('tablet')) {
      return {
        content: t('botInterface.responses.mobilePhone'),
        suggestions: [
          { text: t('botInterface.suggestions.mobileFeatures'), action: 'What features work on mobile?' },
          { text: t('botInterface.suggestions.tabletEditing'), action: 'Can I edit cards on a tablet?' },
          { text: t('botInterface.suggestions.appAvailability'), action: 'Do you have a mobile app?' }
        ]
      };
    }

    // Features and capabilities
    if (input.includes('feature') || input.includes('what can') || input.includes('capabilities')) {
      return {
        content: t('botInterface.responses.featuresCapabilities'),
        suggestions: [
          { text: t('botInterface.suggestions.domainFeatures'), action: 'What domain features do you offer?' },
          { text: t('botInterface.suggestions.designFeatures'), action: 'What design features are available?' },
          { text: t('botInterface.suggestions.upcomingFeatures'), action: 'What new features are coming?' }
        ]
      };
    }

    if (input.includes('template') || input.includes('example') || input.includes('sample')) {
      return {
        content: t('botInterface.responses.templateExample'),
        suggestions: [
          { text: t('botInterface.suggestions.browseTemplates'), action: 'Show me available templates' },
          { text: t('botInterface.suggestions.customDesigns'), action: 'Can I create custom designs?' },
          { text: t('botInterface.suggestions.templateCategories'), action: 'What template categories do you have?' }
        ]
      };
    }

    // Language and localization
    if (input.includes('language') || input.includes('français') || input.includes('french')) {
      return {
        content: t('botInterface.responses.languageFrench'),
        suggestions: [
          { text: t('botInterface.suggestions.switchLanguage'), action: 'How do I change the language?' },
          { text: t('botInterface.suggestions.moreLanguages'), action: 'Will you add more languages?' },
          { text: t('botInterface.suggestions.translationQuality'), action: 'How accurate are the translations?' }
        ]
      };
    }

    // Error handling and troubleshooting
    if (input.includes('error') || input.includes('problem') || input.includes('issue') || input.includes('bug')) {
      return {
        content: t('botInterface.responses.errorProblem'),
        suggestions: [
          { text: t('botInterface.suggestions.commonSolutions'), action: 'What are common solutions to problems?' },
          { text: t('botInterface.suggestions.reportBug'), action: 'How do I report a bug?' },
          { text: t('botInterface.suggestions.getSupport'), action: 'How do I get technical support?' }
        ]
      };
    }

    if (input.includes('slow') || input.includes('loading') || input.includes('performance')) {
      return {
        content: t('botInterface.responses.slowLoading'),
        suggestions: [
          { text: t('botInterface.suggestions.speedTips'), action: 'How can I make VibePage faster?' },
          { text: t('botInterface.suggestions.browserCache'), action: 'How do I clear my browser cache?' },
          { text: t('botInterface.suggestions.systemRequirements'), action: 'What are the system requirements?' }
        ]
      };
    }

    // Greetings and pleasantries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon')) {
      return {
        content: t('botInterface.responses.greeting'),
        suggestions: [
          { text: t('botInterface.suggestions.getStartedGeneral'), action: 'How do I get started with VibePage?' },
          { text: t('botInterface.suggestions.popularFeatures'), action: 'What are your most popular features?' },
          { text: t('botInterface.suggestions.quickTour'), action: 'Can you give me a quick tour?' }
        ]
      };
    }

    if (input.includes('thank') || input.includes('thanks')) {
      return {
        content: t('botInterface.responses.thankYou'),
        suggestions: [
          { text: t('botInterface.suggestions.moreQuestions'), action: 'I have more questions' },
          { text: t('botInterface.suggestions.feedback'), action: 'How can I provide feedback?' },
          { text: t('botInterface.suggestions.stayUpdated'), action: 'How do I stay updated on new features?' }
        ]
      };
    }

    // Default response for unrecognized queries
    return {
      content: t('botInterface.responses.defaultResponse'),
      suggestions: [
        { text: t('botInterface.suggestions.domainHelp'), action: 'Help me with domains' },
        { text: t('botInterface.suggestions.cardStudioHelp'), action: 'Help me with Card Studio' },
        { text: t('botInterface.suggestions.accountHelpGeneral'), action: 'Help me with my account' },
        { text: t('botInterface.suggestions.generalInfo'), action: 'Tell me about VibePage' }
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
          <h3 className="font-semibold">{t('botInterface.headerTitle')}</h3>
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
            placeholder={t('botInterface.inputPlaceholder')}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3"
          >
            {t('botInterface.sendButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};
 
export default BotInterface;
 