import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import mgTranslations from './locales/mg.json';
import esTranslations from './locales/es.json';
import deTranslations from './locales/de.json';
import arTranslations from './locales/ar.json';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

// RTL languages
export const RTL_LANGUAGES = ['ar'];

// Default namespace
export const DEFAULT_NAMESPACE = 'common';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Namespace configuration
    defaultNS: DEFAULT_NAMESPACE,
    ns: [DEFAULT_NAMESPACE, 'auth', 'dashboard', 'studio', 'forms', 'errors'],
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Backend configuration for loading translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Resources (embedded translations for faster initial load)
    resources: {
      en: {
        common: enTranslations.common,
        auth: enTranslations.auth,
        dashboard: enTranslations.dashboard,
        studio: enTranslations.studio,
        forms: enTranslations.forms,
        errors: enTranslations.errors,
      },
      fr: {
        common: frTranslations.common,
        auth: frTranslations.auth,
        dashboard: frTranslations.dashboard,
        studio: frTranslations.studio,
        forms: frTranslations.forms,
        errors: frTranslations.errors,
      },
      mg: {
        common: mgTranslations.common,
        auth: mgTranslations.auth,
        dashboard: mgTranslations.dashboard,
        studio: mgTranslations.studio,
        forms: mgTranslations.forms,
        errors: mgTranslations.errors,
      },
      es: {
        common: esTranslations.common,
        auth: esTranslations.auth,
        dashboard: esTranslations.dashboard,
        studio: esTranslations.studio,
        forms: esTranslations.forms,
        errors: esTranslations.errors,
      },
      de: {
        common: deTranslations.common,
        auth: deTranslations.auth,
        dashboard: deTranslations.dashboard,
        studio: deTranslations.studio,
        forms: deTranslations.forms,
        errors: deTranslations.errors,
      },
      ar: {
        common: arTranslations.common,
        auth: arTranslations.auth,
        dashboard: arTranslations.dashboard,
        studio: arTranslations.studio,
        forms: arTranslations.forms,
        errors: arTranslations.errors,
      },
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
    },
    
    // React options
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    },
  });

export default i18n;