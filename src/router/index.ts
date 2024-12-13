import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
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
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Test/test.vue'),
    meta: { title: '测试' }
  },
  {
    path: '/qqmusic',
    name: 'QQMusic',
    component: () => import('@/views/Test/qqmusic.vue'),
    meta: { title: '测试1' }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
