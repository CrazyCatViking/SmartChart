import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      name: 'SmartDraw',
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
    }
  }
})
