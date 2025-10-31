import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { SITE_NAME } from '@/config'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/Index/index.vue'),
    meta: { title: SITE_NAME }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
