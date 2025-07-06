import React from 'react';
// Simple fallback translation function
const t = (key: string) => key;
import { HelpCircle, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import ContactSupport from '../components/ContactSupport';

const SupportPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I register a domain?",
      answer: "Simply search for your desired domain name using our search tool, select an available domain, and follow the checkout process. We'll guide you through each step."
    },
    {
      question: "Can I transfer my existing domain to VibePage?",
      answer: "Yes! We support domain transfers from most registrars. The process typically takes 5-7 days and we'll help you through every step."
    },
    {
      question: "How does the Card Studio work?",
      answer: "Our Card Studio is a drag-and-drop editor that lets you create professional social media cards. Choose from templates or start from scratch, then customize with your own text, images, and branding."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "How can I change my domain's DNS settings?",
      answer: "You can manage your DNS settings from your dashboard. Navigate to your domain management section and click on 'DNS Settings' to make changes."
    }
  ];

  const supportOptions = [
    {
      icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
      title: "Contact Support",
      description: "Get help from our support team",
      time: "Response within 24 hours"
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-green-600" />,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides",
      time: "Available 24/7"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "Live Chat",
      description: "Chat with our support team",
      time: "Mon-Fri, 9AM-6PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the support you need for domains, card creation, and everything VibePage
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                {option.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-3">{option.description}</p>
              <p className="text-sm text-gray-500">{option.time}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactSupport />
          </div>

          {/* FAQ Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className="w-6 h-6 mr-3 text-indigo-600" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-2">Need more help?</h3>
              <p className="text-indigo-700 text-sm mb-4">
                Can't find what you're looking for? Our comprehensive documentation covers everything from basic setup to advanced features.
              </p>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200">
                Browse Documentation →
              </button>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <h3 className="text-lg font-semibold text-gray-900">All Systems Operational</h3>
          </div>
          <p className="text-gray-600 mb-4">
            All VibePage services are running smoothly. Check our status page for real-time updates.
          </p>
          <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
            View Status Page →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;