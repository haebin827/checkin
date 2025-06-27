import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    server: {
      port: env.VITE_APP_CORS_PORT || 8081,
      host: true, //test
      allowedHosts: [
        // ngrok domain
        '8dab-2600-1700-1c00-7310-7cb3-62d-74f8-f828.ngrok-free.app'
      ]
    },
    plugins: [react()],
  }
})
