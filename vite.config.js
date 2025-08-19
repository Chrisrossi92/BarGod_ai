// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@',    replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // TEMP: support legacy "/src/..." imports
      { find: '/src', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
})



