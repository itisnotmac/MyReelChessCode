import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  build: {
    // ⚡ Minification & compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 📦 Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-popover'
          ],
          'three': ['three', 'draco3d', 'meshoptimizer'],
          'charts': ['recharts'],
          'vendor': ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
        }
      }
    },
    // 🎯 CSS code splitting
    cssCodeSplit: true,
    // 📊 Report bundle size
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // No source maps in production (saves space)
    sourcemap: false
  },
  // 🚀 Pre-bundle heavy dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'framer-motion',
      'react-router-dom',
      'three',
      'recharts'
    ]
  }
});
