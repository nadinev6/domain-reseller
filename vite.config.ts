import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // You already import path
import lingoCompiler from 'lingo.dev/compiler';

// https://vitejs.dev/config/
export default defineConfig(() => lingoCompiler.vite({
  sourceLocale: 'en',
  targetLocales: ['fr', 'mg'],
  models: "lingo.dev",
  sourceRoot: 'src', // <--- ADD THIS LINE!
                      // This tells Lingo.dev's compiler to scan files within your 'src' directory.
})({
  plugins: [
    react({
      // Add any specific react-swc options here if needed
    }),
  ],
  resolve: {
    alias: {
      // This alias is for your import statements, e.g., 'import MyComponent from "src/components/MyComponent"'
      'src': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    // Keep this as is, it's not directly related to Lingo.dev's internal exports
    exclude: ['lucide-react'],
  },
}));