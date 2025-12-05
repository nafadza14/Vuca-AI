import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Ensure process.env is polyfilled or redirected if needed, 
  // though we updated index.tsx to use import.meta.env
  define: {
    'process.env': {}
  }
})