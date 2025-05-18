import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Use dynamic import for tsconfig-paths
// We'll configure the paths directly instead

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],  build: {
    sourcemap: true, // Enable source maps for debugging production builds
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  resolve: {
    alias: {
      // Ensure consistent file resolution
      '@': '/src',
    },
  },
  server: {
    port: 3000,          // You can customize your dev server port here
    open: true,          // Automatically open the browser on server start
  },
  preview: {
    port: 8080           // Port for previewing the build locally
  },
  define: {
    'process.env': {}    // Fix issues with environment variables in some libs
  }
})
