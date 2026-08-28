import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/health': 'http://127.0.0.1:8000',
      '/reserve': 'http://127.0.0.1:8000',
      '/shortfall': 'http://127.0.0.1:8000',
      '/actions': 'http://127.0.0.1:8000',
      '/data-health': 'http://127.0.0.1:8000',
      '/chat': 'http://127.0.0.1:8000',
      '/predict-shortfall': 'http://127.0.0.1:8000',
    }
  }
})
