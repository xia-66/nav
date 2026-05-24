import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/tailwind.css'
import '@/assets/css/normalize.css'
import '@/assets/font/iconfont.css'
import '@/assets/css/base.css'
import '@/assets/css/content.scss'
import router from "./router";

const savedTheme = localStorage.getItem('theme-mode')
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
document.documentElement.setAttribute('theme-mode', savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : prefersDark ? 'dark' : 'light')

createApp(App).use(router).use(ElementPlus).mount('#app')
