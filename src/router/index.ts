import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Index from "@/views/Index/index.vue";
import Test from "@/views/Test/test.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: { title: "黑羽导航" },
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
    meta: { title: "黑羽导航" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
