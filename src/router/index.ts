import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/Index/index.vue'),
    meta: { title: '黑羽导航' }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/Chat/chat.vue'),
    meta: { title: 'Chat Room' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth/auth.vue'),
    meta: { title: 'Auth' }
  },
  {
    path: '/private',
    name: 'Private',
    component: () => import('@/views/Chat/privateChat.vue'),
    meta: { title: '私人聊天' }
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
