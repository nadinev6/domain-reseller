import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MagicCard } from "@/registry/magicui/magic-card";


const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const supportOptions = [
    {
      icon: <MessageCircle className="w-6 h-6 text-indigo-600" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: <Mail className="w-6 h-6 text-green-600" />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Call Now'
    }
  ];

  const faqItems = [
    {
      question: 'How do I register a domain?',
      answer: 'Simply search for your desired domain name using our search tool, select an available domain, and follow the checkout process.'
    },
    {
      question: 'Can I transfer my existing domain to VibePage?',
      answer: 'Yes! We support domain transfers from most registrars. The process typically takes 5-7 days to complete.'
    },
    {
      question: 'How do I use the Card Studio?',
      answer: 'Sign up for an account, navigate to the Card Studio, and use our drag-and-drop editor to create stunning social media cards.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with domains, card creation, and any questions you might have.
          </p>
        </div>

         
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Form
                </CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="domain-registration">Domain Registration</option>
                        <option value="domain-transfer">Domain Transfer</option>
                        <option value="card-studio">Card Studio</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Describe your question or issue in detail..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@vibepage.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">
                      123 Tech Street<br />
                      San Francisco, CA 94105<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday: 9AM - 6PM EST<br />
                      Saturday - Sunday: 10AM - 4PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Response</CardTitle>
                <CardDescription>
                  Need immediate assistance? Try these options:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Preferred Support Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">{option.availability}</p>
                  <Button variant="outline" className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;