import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index/index.vue"),
    meta: { title: "黑羽导航" },
  },
  {
    path: "/test",
    name: "Test",
    component: () => import("@/views/Test/test.vue"),
    meta: { title: "测试页面" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
