import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import lingoCompiler from 'lingo.dev/compiler'; 


// https://vitejs.dev/config/
export default defineConfig(() => lingoCompiler.vite({
  sourceLocale: 'en',
  targetLocales: ['fr'],
  models: "lingo.dev",
})({
  plugins: [
    react({

    }),
  ],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
