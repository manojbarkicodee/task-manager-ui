import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import history from 'vite-plugin-history'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), history()],
  base: '/', // Ensure correct base path
  server: {
    open: true, // Optional: open browser after server is started
  },
})
