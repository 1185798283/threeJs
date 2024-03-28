import { fileURLToPath, URL } from 'node:url'
// https本地调试
import basicSsl from '@vitejs/plugin-basic-ssl'

// import mkcert from 'vite-plugin-mkcert'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), basicSsl()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: true
  }
})
