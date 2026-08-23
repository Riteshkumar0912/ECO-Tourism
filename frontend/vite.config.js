import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: true,          // Binds to 0.0.0.0 → judges / teammates can connect via LAN IP
    strictPort: false,   // Falls back to next available port if 5173 is taken
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,  // TF.js + Leaflet are large; suppress noisy warnings
  },
})
