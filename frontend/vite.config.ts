import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Enable React Fast Refresh and JSX/TSX compilation during development and builds.
  plugins: [react()],
  server: {
    // Vite serves the UI here and forwards browser API calls to the backend.
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
