import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev me API calls ko backend (Spring Boot :8080) pe forward karo
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // OAuth2 login bhi same-origin rahe (dev me bhi), taaki production
      // (single server) aur dev ka behavior ek jaisa ho
      '/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login/oauth2': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
