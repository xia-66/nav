import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import faviconApiPlugin from './vite-plugin-favicon-api'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), faviconApiPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // 配置根路径
  resolve: {
    // ↓路径别名，主要是这部分
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      // 使用新的API方式
      scss: {
        api: 'modern-compiler'
      }
      // 如果需要全局引入变量或mixin
      // additionalData: `@import "@/styles/variables.scss";`
    }
  },
  server: {
    // 配置host，局域网可访问
    host: '0.0.0.0',
    port: 8080
  }
})
