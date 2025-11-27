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
  },
  {
    path: '/admin/callback',
    name: 'AdminCallback',
    component: () => import('@/views/AdminCallback.vue'),
    meta: { title: '授权回调 - ' + SITE_NAME }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { title: '后台管理 - ' + SITE_NAME }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
