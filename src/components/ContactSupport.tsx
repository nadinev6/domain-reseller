import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, Minimize2, Languages, User, Mail, MessageSquare } from 'lucide-react';
import { useTranslation, useLocale } from 'lingo.dev/react/client';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ContactSupportProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ContactSupport({ isCollapsed, onToggleCollapse }: ContactSupportProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Check if ContactSupport should be hidden based on current route
  const shouldHide = location.pathname.startsWith('/card-studio/editor');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) {
      setSubmitError(t('support.form.validation.nameRequired'));
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitError(t('support.form.validation.emailRequired'));
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setSubmitError(t('support.form.validation.emailInvalid'));
      return false;
    }
    if (!formData.subject.trim()) {
      setSubmitError(t('support.form.validation.subjectRequired'));
      return false;
    }
    if (!formData.message.trim()) {
      setSubmitError(t('support.form.validation.messageRequired'));
      return false;
    }
    
    setSubmitError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'form-name': 'contact-support',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          language: locale,
          timestamp: new Date().toISOString()
        }).toString()
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(t('support.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLocale(newLanguage);
  };

  // Reset form to show contact form again
  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError('');
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
    <>
      {/* Hidden Netlify form for form detection */}
      <form name="contact-support" netlify hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="subject" />
        <textarea name="message"></textarea>
        <input type="text" name="language" />
        <input type="text" name="timestamp" />
      </form>

      <div className="fixed bottom-0 right-0 w-full md:w-96 h-96 bg-white border-t md:border-l md:border-t border-gray-200 shadow-lg z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-sm">{t('support.form.title')}</h3>
              <p className="text-xs text-indigo-100">{t('support.form.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Languages size={14} className="absolute left-2 text-white/70 pointer-events-none" />
              <select
                value={locale}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSubmitted ? (
            // Success message
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">{t('support.form.successTitle')}</h3>
                <p className="text-sm text-gray-600 mt-1">{t('support.form.successMessage')}</p>
              </div>
              <Button
                onClick={resetForm}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {t('support.form.sendAnother')}
              </Button>
            </div>
          ) : (
            // Contact form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('support.form.namePlaceholder')}
                  className="pl-10"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('support.form.emailPlaceholder')}
                  className="pl-10"
                  required
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t('support.form.subjectPlaceholder')}
                  className="pl-10"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('support.form.messagePlaceholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"
                  required
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('support.form.sending')}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>{t('support.form.sendButton')}</span>
                  </div>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}