// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    lingoCompiler.vite({
      // Configure supported locales
      locales: ["en", "fr", "mg"],
      // Added Malagasy (mg)
      // Default locale
      defaultLocale: "en",
      // AI translation provider configuration
      ai: {
        // Use Lingo.dev's AI service (requires LINGO_API_KEY)
        provider: "lingo"
        // Alternative: Use Groq (requires GROQ_API_KEY)
        // provider: 'groq',
        // model: 'llama-3.1-70b-versatile'
      },
      // Translation file output directory
      outDir: "./src/locales",
      // Enable development mode features
      dev: {
        // Show translation keys in development
        showKeys: process.env.NODE_ENV === "development",
        // Enable hot reload for translations
        hotReload: true
      }
    })
  ],
  resolve: {
    alias: {
      "src": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBsaW5nb0NvbXBpbGVyIGZyb20gJ2xpbmdvLmRldi9jb21waWxlcic7IFxuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICAgbGluZ29Db21waWxlci52aXRlKHtcbiAgICAgIC8vIENvbmZpZ3VyZSBzdXBwb3J0ZWQgbG9jYWxlc1xuICAgICAgbG9jYWxlczogWydlbicsICdmcicsICdtZyddLCAvLyBBZGRlZCBNYWxhZ2FzeSAobWcpXG4gICAgICAvLyBEZWZhdWx0IGxvY2FsZVxuICAgICAgZGVmYXVsdExvY2FsZTogJ2VuJyxcbiAgICAgIC8vIEFJIHRyYW5zbGF0aW9uIHByb3ZpZGVyIGNvbmZpZ3VyYXRpb25cbiAgICAgIGFpOiB7XG4gICAgICAgIC8vIFVzZSBMaW5nby5kZXYncyBBSSBzZXJ2aWNlIChyZXF1aXJlcyBMSU5HT19BUElfS0VZKVxuICAgICAgICBwcm92aWRlcjogJ2xpbmdvJyxcbiAgICAgICAgLy8gQWx0ZXJuYXRpdmU6IFVzZSBHcm9xIChyZXF1aXJlcyBHUk9RX0FQSV9LRVkpXG4gICAgICAgIC8vIHByb3ZpZGVyOiAnZ3JvcScsXG4gICAgICAgIC8vIG1vZGVsOiAnbGxhbWEtMy4xLTcwYi12ZXJzYXRpbGUnXG4gICAgICB9LFxuICAgICAgLy8gVHJhbnNsYXRpb24gZmlsZSBvdXRwdXQgZGlyZWN0b3J5XG4gICAgICBvdXREaXI6ICcuL3NyYy9sb2NhbGVzJyxcbiAgICAgIC8vIEVuYWJsZSBkZXZlbG9wbWVudCBtb2RlIGZlYXR1cmVzXG4gICAgICBkZXY6IHtcbiAgICAgICAgLy8gU2hvdyB0cmFuc2xhdGlvbiBrZXlzIGluIGRldmVsb3BtZW50XG4gICAgICAgIHNob3dLZXlzOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICAgICAgLy8gRW5hYmxlIGhvdCByZWxvYWQgZm9yIHRyYW5zbGF0aW9uc1xuICAgICAgICBob3RSZWxvYWQ6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdzcmMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLG1CQUFtQjtBQUgxQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTCxjQUFjLEtBQUs7QUFBQTtBQUFBLE1BRWxCLFNBQVMsQ0FBQyxNQUFNLE1BQU0sSUFBSTtBQUFBO0FBQUE7QUFBQSxNQUUxQixlQUFlO0FBQUE7QUFBQSxNQUVmLElBQUk7QUFBQTtBQUFBLFFBRUYsVUFBVTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSVo7QUFBQTtBQUFBLE1BRUEsUUFBUTtBQUFBO0FBQUEsTUFFUixLQUFLO0FBQUE7QUFBQSxRQUVILFVBQVUsUUFBUSxJQUFJLGFBQWE7QUFBQTtBQUFBLFFBRW5DLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsT0FBTyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
