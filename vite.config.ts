import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { lingoCompiler } from '@lingo.dev/compiler';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
     lingoCompiler.vite({
      // Configure supported locales
      locales: ['en', 'fr', 'mg'], // Added Malagasy (mg)
      // Default locale
      defaultLocale: 'en',
      // AI translation provider configuration
      ai: {
        // Use Lingo.dev's AI service (requires LINGO_API_KEY)
        provider: 'lingo',
        // Alternative: Use Groq (requires GROQ_API_KEY)
        // provider: 'groq',
         model: 'llama-3.1-70b-versatile'
      },
      // Translation file output directory
      outDir: './src/locales', 
      // Enable development mode features
      dev: {
        // Show translation keys in development
        showKeys: process.env.NODE_ENV === 'development',
        // Enable hot reload for translations
        hotReload: true
      }
    })
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});