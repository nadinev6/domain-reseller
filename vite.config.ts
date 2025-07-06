import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
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
});