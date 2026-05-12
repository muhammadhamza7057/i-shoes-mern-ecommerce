import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // Skip API routes and static files
            if (req.url.startsWith('/api') || /\.\w+$/.test(req.url)) {
              return next()
            }
            // For SPA routes, serve index.html
            if (req.method === 'GET') {
              req.url = '/index.html'
            }
            next()
          })
        }
      }
    }
  ],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation': ['framer-motion', 'gsap']
        }
      }
    }
  }
})
