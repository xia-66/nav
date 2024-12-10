import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/views/Index/index.vue"),
    meta: { title: "黑羽导航" },
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@/views/Chat/chat.vue"),
    meta: { title: "Chat Room" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
