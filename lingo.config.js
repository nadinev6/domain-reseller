export default {
  // Supported locales
  locales: ['en', 'fr', 'mg'],
  
  // Default locale
  defaultLocale: 'en',
  
  // AI translation configuration
  ai: {
    // Primary provider - Lingo.dev's AI service
    provider: 'lingo',
    
    // Alternative providers you can use:
     provider: 'groq',
     model: 'llama-3.1-70b-versatile',
    
    // provider: 'openai',
    // model: 'gpt-4',
    
    // Custom translation instructions
    instructions: {
      // Global instructions for all translations
      global: 'Maintain the tone and context appropriate for a domain registration and social media card creation platform called VibePage.',
      
      // Locale-specific instructions
      locales: {
        fr: 'Use formal French (vous) for professional contexts and informal French (tu) for casual interactions.',
        mg: 'Use standard Malagasy with appropriate honorifics and cultural context for Madagascar users.'
      }
    }
  },
  
  // Output configuration
  outDir: './src/locales',
  
  // Development settings
  dev: {
    showKeys: process.env.NODE_ENV === 'development',
    hotReload: true,
    // Show missing translations in development
    showMissing: true
  },
  
  // Translation key extraction settings
  extract: {
    // File patterns to scan for translations
    include: ['src/**/*.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.test.{ts,tsx,js,jsx}', 'src/**/*.spec.{ts,tsx,js,jsx}'],
    
    // Custom function patterns to extract
    functions: ['t', 'translate'],
    
    // Component patterns to extract
    components: ['Trans', 'Translation']
  },
  
  // Translation file format
  format: 'json',
  
  // Namespace configuration (optional)
  namespaces: {
    default: 'common',
    // You can organize translations into namespaces
    // cardStudio: 'card-studio',
    // domains: 'domains'
  }
};