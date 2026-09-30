import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Emit esbuild-minified output without sourcemaps in production
    // (add `sourcemap: true` temporarily when profiling with Sentry/etc).
    sourcemap: false,
    target: 'es2020',

    rollupOptions: {
      output: {
        // Split stable vendor code so deployments only invalidate app chunks.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            return 'vendor'
          }
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },

  // Pre-bundle these for faster dev-server cold starts / fewer re-optimizations.
  optimizeDeps: {
    include: ['lucide-react', 'react-icons/fa', 'react-icons/pi', 'react-icons/si', 'react-icons/fa6'],
  },
})
