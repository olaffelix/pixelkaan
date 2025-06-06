import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/pixelkaan/', // Esta es la parte crucial
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
