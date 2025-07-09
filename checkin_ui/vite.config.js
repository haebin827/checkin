import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: env.VITE_APP_CORS_PORT || 8081,
      host: true,
      //https: true,
      allowedHosts: ['all', '.ngrok-free.app'],
    },
    plugins: [react()],
  };
});
