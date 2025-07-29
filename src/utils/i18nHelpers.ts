import { RTL_LANGUAGES } from '../i18n';

/**
 * Utility functions for internationalization
 */

// Check if a language is RTL
export const isRTLLanguage = (langCode: string): boolean => {
  return RTL_LANGUAGES.includes(langCode);
};

// Get text direction for CSS
export const getTextDirection = (langCode: string): 'ltr' | 'rtl' => {
  return isRTLLanguage(langCode) ? 'rtl' : 'ltr';
};

// Apply RTL styles conditionally
export const rtlClass = (langCode: string, ltrClass: string, rtlClass: string): string => {
  return isRTLLanguage(langCode) ? rtlClass : ltrClass;
};

// Format file size with locale support
export const formatFileSize = (bytes: number, locale: string = 'en'): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2
  }).format(size)} ${sizes[i]}`;
};

// Format duration with locale support
export const formatDuration = (seconds: number, locale: string = 'en'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const formatter = new Intl.NumberFormat(locale, {
    minimumIntegerDigits: 2
  });
  
  if (hours > 0) {
    return `${formatter.format(hours)}:${formatter.format(minutes)}:${formatter.format(secs)}`;
  }
  return `${formatter.format(minutes)}:${formatter.format(secs)}`;
};

// Get browser's preferred languages
export const getBrowserLanguages = (): string[] => {
  if (typeof navigator !== 'undefined') {
    return navigator.languages || [navigator.language];
  }
  return ['en'];
};

// Detect user's preferred language from supported languages
export const detectPreferredLanguage = (supportedLanguages: string[]): string => {
  const browserLanguages = getBrowserLanguages();
  
  // First, try exact matches
  for (const browserLang of browserLanguages) {
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
  }
  
  // Then try language code matches (e.g., 'en-US' -> 'en')
  for (const browserLang of browserLanguages) {
    const langCode = browserLang.split('-')[0];
    if (supportedLanguages.includes(langCode)) {
      return langCode;
    }
  }
  
  // Fallback to first supported language (usually English)
  return supportedLanguages[0] || 'en';
};

// Pluralization helper for languages without built-in plural rules
export const getPlural = (count: number, singular: string, plural: string): string => {
  return count === 1 ? singular : plural;
};

// Safe translation key generator
export const generateTranslationKey = (namespace: string, key: string): string => {
  return `${namespace}:${key}`;
};

// Extract translation keys from text (for development)
export const extractTranslationKeys = (text: string): string[] => {
  const keyRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
  const keys: string[] = [];
  let match;
  
  while ((match = keyRegex.exec(text)) !== null) {
    keys.push(match[1]);
  }
  
  return [...new Set(keys)]; // Remove duplicates
};

// Validate translation completeness
export const validateTranslations = (
  baseTranslations: Record<string, any>,
  targetTranslations: Record<string, any>
): { missing: string[]; extra: string[] } => {
  const missing: string[] = [];
  const extra: string[] = [];
  
  const checkKeys = (base: any, target: any, prefix = '') => {
    for (const key in base) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (!(key in target)) {
        missing.push(fullKey);
      } else if (typeof base[key] === 'object' && typeof target[key] === 'object') {
        checkKeys(base[key], target[key], fullKey);
      }
    }
    
    for (const key in target) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!(key in base)) {
        extra.push(fullKey);
      }
    }
  };
  
  checkKeys(baseTranslations, targetTranslations);
  
  return { missing, extra };
};