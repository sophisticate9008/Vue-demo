import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/websocket': {
        target: 'ws://localhost:8888/websocket',
        ws: true,
        changeOrigin: false,
      },
    },
    port: 4000,
  },
})

