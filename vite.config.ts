import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: process.env.VITE_PROXY_API ? {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_API,
        changeOrigin: true,
      }
    }
  } : {}
})
