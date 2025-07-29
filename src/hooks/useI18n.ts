import { useTranslation } from 'react-i18next';
import { format, formatDistance, formatRelative } from 'date-fns';
import { enUS, fr, es, de, ar } from 'date-fns/locale';
import { SUPPORTED_LANGUAGES, RTL_LANGUAGES } from '../i18n';

// Date-fns locale mapping
const DATE_LOCALES = {
  en: enUS,
  fr: fr,
  es: es,
  de: de,
  ar: ar,
  mg: enUS, // Fallback to English for Malagasy
};

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  const isRTL = RTL_LANGUAGES.includes(currentLanguage);
  const dateLocale = DATE_LOCALES[currentLanguage as keyof typeof DATE_LOCALES] || enUS;

  // Format date with locale support
  const formatDate = (date: Date | string | number, formatStr: string = 'PPP') => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: dateLocale });
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: Date | string | number) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), { 
      addSuffix: true, 
      locale: dateLocale 
    });
  };

  // Format relative date (e.g., "last Friday")
  const formatRelativeDate = (date: Date | string | number) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return formatRelative(dateObj, new Date(), { locale: dateLocale });
  };

  // Format numbers with locale support
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };

  // Format currency with locale support
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number, minimumFractionDigits: number = 0) => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'percent',
      minimumFractionDigits,
    }).format(value / 100);
  };

  // Get language info
  const getLanguageInfo = (langCode?: string) => {
    const code = langCode || currentLanguage;
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
  };

  // Change language
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    
    // Update document direction for RTL languages
    document.documentElement.dir = RTL_LANGUAGES.includes(langCode) ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  // Pluralization helper
  const plural = (count: number, key: string, options?: any) => {
    return t(key, { count, ...options });
  };

  return {
    t,
    i18n,
    currentLanguage,
    isRTL,
    formatDate,
    formatRelativeTime,
    formatRelativeDate,
    formatNumber,
    formatCurrency,
    formatPercentage,
    getLanguageInfo,
    changeLanguage,
    plural,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
};

// Type-safe translation hook with namespace support
export const useTranslationWithNamespace = (namespace: string) => {
  const { t, ...rest } = useTranslation(namespace);
  return { t, ...rest };
};

// Hook for form validation messages
export const useFormValidation = () => {
  const { t } = useTranslation('forms');
  
  const getValidationMessage = (field: string, rule: string, options?: any) => {
    const key = `${rule}`;
    return t(key, { field: t(`fields.${field}`, field), ...options });
  };

  return { getValidationMessage, t };
};

// Hook for error messages
export const useErrorMessages = () => {
  const { t } = useTranslation('errors');
  
  const getErrorMessage = (errorCode: string, context?: any) => {
    return t(errorCode, context);
  };

  return { getErrorMessage, t };
};