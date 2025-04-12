import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
    // 配置代理
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:3000",
    //     changeOrigin: true,
    //     // 若有https证书，即可将secure设为true
    //     secure: false,
    //     rewrite: (path) => path.replace("/api", ""),
    //   },
    // },
  }
})
