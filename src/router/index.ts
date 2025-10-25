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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
