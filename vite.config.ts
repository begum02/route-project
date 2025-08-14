import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:'dist'
  },
   assetsInclude: ['**/*.html'],
   server: {
      host: '127.0.0.1',
    port: 5173,
    open: true,
    proxy: {
      '/api/autocompletea.ts': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173
  }
})
