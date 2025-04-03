import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      port: env.VITE_APP_CORS_PORT || 8081
    },
    plugins: [react()],
  }
})
