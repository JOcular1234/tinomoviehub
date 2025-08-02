import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // outDir: 'dist',
    // assetsDir: 'assets',
    // emptyOutDir: true,
  },
  root: '.', // adjust if your source is elsewhere
})
