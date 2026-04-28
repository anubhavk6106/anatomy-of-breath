import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Expose env vars to index.html via html plugin replacement
    },
    // Replace %VITE_*% tokens in index.html
    html: {
      title: `${env.VITE_SITE_NAME || 'Anatomy of Breath'} — ${env.VITE_SITE_DOMAIN || 'anatomiadelaliento.com'}`,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [],
      testTimeout: 30000,   // 30s — property tests with i18n overhead need more time
      hookTimeout: 10000,
    },
  }
})
