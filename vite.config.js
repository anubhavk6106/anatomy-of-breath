import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/', // ✅ IMPORTANT (fixes asset loading)

    plugins: [react()],

    define: {
      __APP_NAME__: JSON.stringify(env.VITE_SITE_NAME || 'Anatomy of Breath'),
      __APP_DOMAIN__: JSON.stringify(env.VITE_SITE_DOMAIN || 'anatomiadelaliento.com'),
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },

    server: {
      port: 5173,
    },

    preview: {
      port: 4173,
    },

    test: {
      environment: 'jsdom',
      globals: true,
      testTimeout: 30000,
      hookTimeout: 10000,
    },
  }
})