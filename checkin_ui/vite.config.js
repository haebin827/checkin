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
        'b8ba-172-125-145-52.ngrok-free.app'
      ]
    },
    plugins: [react()],
  }
})
