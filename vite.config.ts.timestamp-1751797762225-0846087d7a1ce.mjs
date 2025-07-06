// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import lingoCompiler from "file:///home/project/node_modules/lingo.dev/build/compiler.mjs";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(() => lingoCompiler.vite({
  sourceLocale: "en",
  targetLocales: ["fr", "mg"],
  models: "lingo.dev",
  sourceRoot: "src"
  // <--- ADD THIS LINE!
  // This tells Lingo.dev's compiler to scan files within your 'src' directory.
})({
  plugins: [
    react({
      // Add any specific react-swc options here if needed
    })
  ],
  resolve: {
    alias: {
      // This alias is for your import statements, e.g., 'import MyComponent from "src/components/MyComponent"'
      "src": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    // Keep this as is, it's not directly related to Lingo.dev's internal exports
    exclude: ["lucide-react"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7IC8vIFlvdSBhbHJlYWR5IGltcG9ydCBwYXRoXG5pbXBvcnQgbGluZ29Db21waWxlciBmcm9tICdsaW5nby5kZXYvY29tcGlsZXInO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IGxpbmdvQ29tcGlsZXIudml0ZSh7XG4gIHNvdXJjZUxvY2FsZTogJ2VuJyxcbiAgdGFyZ2V0TG9jYWxlczogWydmcicsICdtZyddLFxuICBtb2RlbHM6IFwibGluZ28uZGV2XCIsXG4gIHNvdXJjZVJvb3Q6ICdzcmMnLCAvLyA8LS0tIEFERCBUSElTIExJTkUhXG4gICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyB0ZWxscyBMaW5nby5kZXYncyBjb21waWxlciB0byBzY2FuIGZpbGVzIHdpdGhpbiB5b3VyICdzcmMnIGRpcmVjdG9yeS5cbn0pKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KHtcbiAgICAgIC8vIEFkZCBhbnkgc3BlY2lmaWMgcmVhY3Qtc3djIG9wdGlvbnMgaGVyZSBpZiBuZWVkZWRcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAvLyBUaGlzIGFsaWFzIGlzIGZvciB5b3VyIGltcG9ydCBzdGF0ZW1lbnRzLCBlLmcuLCAnaW1wb3J0IE15Q29tcG9uZW50IGZyb20gXCJzcmMvY29tcG9uZW50cy9NeUNvbXBvbmVudFwiJ1xuICAgICAgJ3NyYyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICAvLyBLZWVwIHRoaXMgYXMgaXMsIGl0J3Mgbm90IGRpcmVjdGx5IHJlbGF0ZWQgdG8gTGluZ28uZGV2J3MgaW50ZXJuYWwgZXhwb3J0c1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBSDFCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxNQUFNLGNBQWMsS0FBSztBQUFBLEVBQ25ELGNBQWM7QUFBQSxFQUNkLGVBQWUsQ0FBQyxNQUFNLElBQUk7QUFBQSxFQUMxQixRQUFRO0FBQUEsRUFDUixZQUFZO0FBQUE7QUFBQTtBQUVkLENBQUMsRUFBRTtBQUFBLEVBQ0QsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDeEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUE7QUFBQSxJQUVaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFDRixDQUFDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
