import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem'),
    },
    host: true, // This ensures it's exposed to the network
    proxy: {
      '/api': {
        target: 'https://localhost:3000',
        secure: false, // Don't verify self-signed certs
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.js'],
    globals: true
  }
})
