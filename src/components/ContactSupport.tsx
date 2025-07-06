import React, { useState } from 'react';
import { User, Mail, MessageSquare, Send, MessageCircle, Languages } from 'lucide-react';
import { t } from 'lingo.dev/react';
import react from "@vitejs/plugin-react-swc";
import lingoCompiler from "lingo.dev/compiler"; 
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function ContactSupport() {
  const { t } = useTranslation();
  //const { locale, setLocale } = useLocale(); 

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

      <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">{t('support.form.title')}</h3>
              <p className="text-sm text-indigo-100">{t('support.form.subtitle')}</p>
            </div>
          </div>
          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages size={16} className="absolute left-2 text-white/70 pointer-events-none" />
            <select
              value={locale}
              onChange={handleLanguageChange}
              className="pl-8 pr-4 py-2 text-sm bg-white/20 border border-white/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none cursor-pointer"
            >
              <option value="en" className="text-gray-900">English</option>
              <option value="fr" className="text-gray-900">Français</option>
              <option value="mg" className="text-gray-900">Malagasy</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Success message
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">{t('support.form.successTitle')}</h3>
                <p className="text-gray-600">{t('support.form.successMessage')}</p>
              </div>
              <Button
                onClick={resetForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
              >
                {t('support.form.sendAnother')}
              </Button>
            </div>
          ) : (
            // Contact form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('support.form.namePlaceholder')}
                  className="pl-12 py-3 text-base"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('support.form.emailPlaceholder')}
                  className="pl-12 py-3 text-base"
                  required
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t('support.form.subjectPlaceholder')}
                  className="pl-12 py-3 text-base"
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
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-base"
                  required
                />
              </div>

              {/* Error message */}
              {submitError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                  {submitError}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('support.form.sending')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
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